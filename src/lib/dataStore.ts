/**
 * Turso/libSQL data store for user todo data.
 * Persistent database storage for production.
 */

import { db, initializeDatabase } from "./db";
import { Todo, Category, Tag, DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/types";

interface UserData {
    todos: Todo[];
    categories: Category[];
    tags: Tag[];
    migrated: boolean;
}

// Initialize database on first import
let dbInitialized = false;
async function ensureDbInitialized() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

// Ensure user exists in database
async function ensureUser(userId: string): Promise<void> {
    await ensureDbInitialized();

    const existing = await db.execute({
        sql: "SELECT id FROM users WHERE id = ?",
        args: [userId],
    });

    if (existing.rows.length === 0) {
        // Create user with default categories and tags
        await db.execute({
            sql: "INSERT INTO users (id, migrated) VALUES (?, 0)",
            args: [userId],
        });

        // Insert default categories
        for (const cat of DEFAULT_CATEGORIES) {
            await db.execute({
                sql: "INSERT INTO categories (id, user_id, name, icon, color) VALUES (?, ?, ?, ?, ?)",
                args: [cat.id, userId, cat.name, cat.icon, cat.color],
            });
        }

        // Insert default tags
        for (const tag of DEFAULT_TAGS) {
            await db.execute({
                sql: "INSERT INTO tags (id, user_id, name, color) VALUES (?, ?, ?, ?)",
                args: [tag.id, userId, tag.name, tag.color],
            });
        }
    }
}

export async function getUserData(userId: string): Promise<UserData> {
    await ensureUser(userId);

    // Get user migration status
    const userResult = await db.execute({
        sql: "SELECT migrated FROM users WHERE id = ?",
        args: [userId],
    });
    const migrated = userResult.rows[0]?.migrated === 1;

    // Get todos
    const todosResult = await db.execute({
        sql: `SELECT id, title, completed, category_id, position, created_at, updated_at 
              FROM todos WHERE user_id = ? ORDER BY position ASC, created_at DESC`,
        args: [userId],
    });

    // Get tags for each todo
    const todos: Todo[] = await Promise.all(
        todosResult.rows.map(async (row) => {
            const tagsResult = await db.execute({
                sql: "SELECT tag_id FROM todo_tags WHERE todo_id = ?",
                args: [row.id],
            });
            return {
                id: row.id as string,
                title: row.title as string,
                completed: row.completed === 1,
                categoryId: row.category_id as string | null,
                tags: tagsResult.rows.map((t) => t.tag_id as string),
                createdAt: row.created_at as string,
                updatedAt: row.updated_at as string,
            };
        })
    );

    // Get categories
    const categoriesResult = await db.execute({
        sql: "SELECT id, name, icon, color FROM categories WHERE user_id = ?",
        args: [userId],
    });
    const categories: Category[] = categoriesResult.rows.map((row) => ({
        id: row.id as string,
        name: row.name as string,
        icon: row.icon as string,
        color: row.color as string,
    }));

    // Get tags
    const tagsResult = await db.execute({
        sql: "SELECT id, name, color FROM tags WHERE user_id = ?",
        args: [userId],
    });
    const tags: Tag[] = tagsResult.rows.map((row) => ({
        id: row.id as string,
        name: row.name as string,
        color: row.color as string,
    }));

    return { todos, categories, tags, migrated };
}

// Todo operations
export async function getUserTodos(userId: string): Promise<Todo[]> {
    const data = await getUserData(userId);
    return data.todos;
}

export async function addUserTodo(userId: string, todo: Todo): Promise<Todo> {
    await ensureUser(userId);

    // Get max position
    const maxPosResult = await db.execute({
        sql: "SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM todos WHERE user_id = ?",
        args: [userId],
    });
    const position = maxPosResult.rows[0]?.next_pos as number || 0;

    await db.execute({
        sql: `INSERT INTO todos (id, user_id, title, completed, category_id, position, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
            todo.id,
            userId,
            todo.title,
            todo.completed ? 1 : 0,
            todo.categoryId,
            position,
            todo.createdAt,
            todo.updatedAt,
        ],
    });

    // Insert tags
    for (const tagId of todo.tags) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)",
            args: [todo.id, tagId],
        });
    }

    return todo;
}

export async function updateUserTodo(
    userId: string,
    todoId: string,
    updates: Partial<Todo>
): Promise<Todo | null> {
    await ensureUser(userId);

    // Check if todo exists and belongs to user
    const existing = await db.execute({
        sql: "SELECT id FROM todos WHERE id = ? AND user_id = ?",
        args: [todoId, userId],
    });

    if (existing.rows.length === 0) return null;

    const updatedAt = new Date().toISOString();

    // Build update query dynamically
    const setClauses: string[] = ["updated_at = ?"];
    const args: (string | number | null)[] = [updatedAt];

    if (updates.title !== undefined) {
        setClauses.push("title = ?");
        args.push(updates.title);
    }
    if (updates.completed !== undefined) {
        setClauses.push("completed = ?");
        args.push(updates.completed ? 1 : 0);
    }
    if (updates.categoryId !== undefined) {
        setClauses.push("category_id = ?");
        args.push(updates.categoryId);
    }

    args.push(todoId, userId);

    await db.execute({
        sql: `UPDATE todos SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`,
        args,
    });

    // Update tags if provided
    if (updates.tags !== undefined) {
        await db.execute({
            sql: "DELETE FROM todo_tags WHERE todo_id = ?",
            args: [todoId],
        });
        for (const tagId of updates.tags) {
            await db.execute({
                sql: "INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)",
                args: [todoId, tagId],
            });
        }
    }

    // Fetch and return updated todo
    const todoResult = await db.execute({
        sql: `SELECT id, title, completed, category_id, created_at, updated_at 
              FROM todos WHERE id = ?`,
        args: [todoId],
    });

    if (todoResult.rows.length === 0) return null;

    const row = todoResult.rows[0];
    const tagsResult = await db.execute({
        sql: "SELECT tag_id FROM todo_tags WHERE todo_id = ?",
        args: [todoId],
    });

    return {
        id: row.id as string,
        title: row.title as string,
        completed: row.completed === 1,
        categoryId: row.category_id as string | null,
        tags: tagsResult.rows.map((t) => t.tag_id as string),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

export async function deleteUserTodo(userId: string, todoId: string): Promise<boolean> {
    await ensureUser(userId);

    const result = await db.execute({
        sql: "DELETE FROM todos WHERE id = ? AND user_id = ?",
        args: [todoId, userId],
    });

    return result.rowsAffected > 0;
}

export async function reorderUserTodos(
    userId: string,
    fromIndex: number,
    toIndex: number
): Promise<Todo[]> {
    await ensureUser(userId);

    // Get all todos ordered by position
    const todosResult = await db.execute({
        sql: "SELECT id FROM todos WHERE user_id = ? ORDER BY position ASC",
        args: [userId],
    });

    const todoIds = todosResult.rows.map((r) => r.id as string);

    // Reorder in memory
    const [removed] = todoIds.splice(fromIndex, 1);
    todoIds.splice(toIndex, 0, removed);

    // Update positions in database
    for (let i = 0; i < todoIds.length; i++) {
        await db.execute({
            sql: "UPDATE todos SET position = ? WHERE id = ?",
            args: [i, todoIds[i]],
        });
    }

    // Return updated todos
    return getUserTodos(userId);
}

// Category operations
export async function getUserCategories(userId: string): Promise<Category[]> {
    const data = await getUserData(userId);
    return data.categories;
}

export async function addUserCategory(userId: string, category: Category): Promise<Category> {
    await ensureUser(userId);

    await db.execute({
        sql: "INSERT INTO categories (id, user_id, name, icon, color) VALUES (?, ?, ?, ?, ?)",
        args: [category.id, userId, category.name, category.icon, category.color],
    });

    return category;
}

export async function deleteUserCategory(userId: string, categoryId: string): Promise<boolean> {
    await ensureUser(userId);

    // Delete category (todos will have category_id set to NULL via ON DELETE SET NULL)
    const result = await db.execute({
        sql: "DELETE FROM categories WHERE id = ? AND user_id = ?",
        args: [categoryId, userId],
    });

    return result.rowsAffected > 0;
}

// Tag operations
export async function getUserTags(userId: string): Promise<Tag[]> {
    const data = await getUserData(userId);
    return data.tags;
}

export async function addUserTag(userId: string, tag: Tag): Promise<Tag> {
    await ensureUser(userId);

    await db.execute({
        sql: "INSERT INTO tags (id, user_id, name, color) VALUES (?, ?, ?, ?)",
        args: [tag.id, userId, tag.name, tag.color],
    });

    return tag;
}

export async function deleteUserTag(userId: string, tagId: string): Promise<boolean> {
    await ensureUser(userId);

    // Delete tag (todo_tags entries will be deleted via ON DELETE CASCADE)
    const result = await db.execute({
        sql: "DELETE FROM tags WHERE id = ? AND user_id = ?",
        args: [tagId, userId],
    });

    return result.rowsAffected > 0;
}

// Migration flag
export async function hasUserMigrated(userId: string): Promise<boolean> {
    await ensureUser(userId);

    const result = await db.execute({
        sql: "SELECT migrated FROM users WHERE id = ?",
        args: [userId],
    });

    return result.rows[0]?.migrated === 1;
}

export async function setUserMigrated(userId: string): Promise<void> {
    await ensureUser(userId);

    await db.execute({
        sql: "UPDATE users SET migrated = 1, updated_at = datetime('now') WHERE id = ?",
        args: [userId],
    });
}

// Bulk import for migration
export async function importUserData(
    userId: string,
    data: { todos: Todo[]; categories: Category[]; tags: Tag[] }
): Promise<UserData> {
    await ensureUser(userId);

    // Clear existing data (except defaults that may have been added)
    await db.execute({ sql: "DELETE FROM todo_tags WHERE todo_id IN (SELECT id FROM todos WHERE user_id = ?)", args: [userId] });
    await db.execute({ sql: "DELETE FROM todos WHERE user_id = ?", args: [userId] });
    await db.execute({ sql: "DELETE FROM categories WHERE user_id = ?", args: [userId] });
    await db.execute({ sql: "DELETE FROM tags WHERE user_id = ?", args: [userId] });

    // Import categories
    for (const cat of data.categories) {
        await db.execute({
            sql: "INSERT INTO categories (id, user_id, name, icon, color) VALUES (?, ?, ?, ?, ?)",
            args: [cat.id, userId, cat.name, cat.icon, cat.color],
        });
    }

    // Import tags
    for (const tag of data.tags) {
        await db.execute({
            sql: "INSERT INTO tags (id, user_id, name, color) VALUES (?, ?, ?, ?)",
            args: [tag.id, userId, tag.name, tag.color],
        });
    }

    // Import todos with position
    for (let i = 0; i < data.todos.length; i++) {
        const todo = data.todos[i];
        await db.execute({
            sql: `INSERT INTO todos (id, user_id, title, completed, category_id, position, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                todo.id,
                userId,
                todo.title,
                todo.completed ? 1 : 0,
                todo.categoryId,
                i,
                todo.createdAt,
                todo.updatedAt,
            ],
        });

        // Insert todo tags
        for (const tagId of todo.tags) {
            await db.execute({
                sql: "INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)",
                args: [todo.id, tagId],
            });
        }
    }

    // Mark as migrated
    await setUserMigrated(userId);

    return getUserData(userId);
}

