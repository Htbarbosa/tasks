import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL is not set");
}

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema
export async function initializeDatabase() {
    await db.batch([
        // Users table (for tracking migration status)
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            name TEXT,
            migrated INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )`,

        // Categories table
        `CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            color TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // Tags table
        `CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            color TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // Todos table
        `CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            category_id TEXT,
            position INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )`,

        // Todo-Tags junction table (many-to-many)
        `CREATE TABLE IF NOT EXISTS todo_tags (
            todo_id TEXT NOT NULL,
            tag_id TEXT NOT NULL,
            PRIMARY KEY (todo_id, tag_id),
            FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )`,

        // Create indexes for better performance
        `CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_todo_tags_todo_id ON todo_tags(todo_id)`,
    ]);
}
