'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
    Todo,
    Category,
    Tag,
    TodoState,
    DEFAULT_CATEGORIES,
    DEFAULT_TAGS,
} from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'notion-todo-app';

const initialState: TodoState = {
    todos: [],
    categories: DEFAULT_CATEGORIES,
    tags: DEFAULT_TAGS,
};

export function useTodos() {
    const [state, setState, isLoaded] = useLocalStorage<TodoState>(
        STORAGE_KEY,
        initialState
    );

    // Todo operations
    const addTodo = useCallback(
        (title: string, categoryId: string | null = null, tagIds: string[] = []) => {
            const now = new Date().toISOString();
            const newTodo: Todo = {
                id: generateId(),
                title,
                completed: false,
                categoryId,
                tags: tagIds,
                createdAt: now,
                updatedAt: now,
            };

            setState((prev) => ({
                ...prev,
                todos: [newTodo, ...prev.todos],
            }));

            return newTodo;
        },
        [setState]
    );

    const updateTodo = useCallback(
        (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
            setState((prev) => ({
                ...prev,
                todos: prev.todos.map((todo) =>
                    todo.id === id
                        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
                        : todo
                ),
            }));
        },
        [setState]
    );

    const toggleTodo = useCallback(
        (id: string) => {
            setState((prev) => ({
                ...prev,
                todos: prev.todos.map((todo) =>
                    todo.id === id
                        ? {
                            ...todo,
                            completed: !todo.completed,
                            updatedAt: new Date().toISOString(),
                        }
                        : todo
                ),
            }));
        },
        [setState]
    );

    const deleteTodo = useCallback(
        (id: string) => {
            setState((prev) => ({
                ...prev,
                todos: prev.todos.filter((todo) => todo.id !== id),
            }));
        },
        [setState]
    );

    // Category operations
    const addCategory = useCallback(
        (name: string, icon: string, color: string) => {
            const newCategory: Category = {
                id: generateId(),
                name,
                icon,
                color,
            };

            setState((prev) => ({
                ...prev,
                categories: [...prev.categories, newCategory],
            }));

            return newCategory;
        },
        [setState]
    );

    const deleteCategory = useCallback(
        (id: string) => {
            setState((prev) => ({
                ...prev,
                categories: prev.categories.filter((cat) => cat.id !== id),
                todos: prev.todos.map((todo) =>
                    todo.categoryId === id ? { ...todo, categoryId: null } : todo
                ),
            }));
        },
        [setState]
    );

    // Tag operations
    const addTag = useCallback(
        (name: string, color: string) => {
            const newTag: Tag = {
                id: generateId(),
                name,
                color,
            };

            setState((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag],
            }));

            return newTag;
        },
        [setState]
    );

    const deleteTag = useCallback(
        (id: string) => {
            setState((prev) => ({
                ...prev,
                tags: prev.tags.filter((tag) => tag.id !== id),
                todos: prev.todos.map((todo) => ({
                    ...todo,
                    tags: todo.tags.filter((tagId) => tagId !== id),
                })),
            }));
        },
        [setState]
    );

    // Utility functions
    const getCategoryById = useCallback(
        (id: string | null) => {
            if (!id) return null;
            return state.categories.find((cat) => cat.id === id) || null;
        },
        [state.categories]
    );

    const getTagById = useCallback(
        (id: string) => {
            return state.tags.find((tag) => tag.id === id) || null;
        },
        [state.tags]
    );

    const getTodosByCategory = useCallback(
        (categoryId: string | null) => {
            return state.todos.filter((todo) => todo.categoryId === categoryId);
        },
        [state.todos]
    );

    const getTodosByTag = useCallback(
        (tagId: string) => {
            return state.todos.filter((todo) => todo.tags.includes(tagId));
        },
        [state.todos]
    );

    const reorderTodos = useCallback(
        (fromIndex: number, toIndex: number) => {
            setState((prev) => {
                const newTodos = [...prev.todos];
                const [removed] = newTodos.splice(fromIndex, 1);
                newTodos.splice(toIndex, 0, removed);
                return {
                    ...prev,
                    todos: newTodos,
                };
            });
        },
        [setState]
    );

    return {
        // State
        todos: state.todos,
        categories: state.categories,
        tags: state.tags,
        isLoaded,

        // Todo operations
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        reorderTodos,

        // Category operations
        addCategory,
        deleteCategory,

        // Tag operations
        addTag,
        deleteTag,

        // Utility functions
        getCategoryById,
        getTagById,
        getTodosByCategory,
        getTodosByTag,
    };
}
