'use client';

import { useState } from 'react';
import { Todo, Category, Tag } from '@/types';
import { TodoItem } from './TodoItem';
import { ListChecks } from 'lucide-react';

interface TodoListProps {
    todos: Todo[];
    categories: Category[];
    tags: Tag[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
}

export function TodoList({
    todos,
    categories,
    tags,
    onToggle,
    onDelete,
    onUpdate,
    onReorder,
}: TodoListProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const pendingTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    const getCategoryById = (id: string | null) => {
        if (!id) return null;
        return categories.find((cat) => cat.id === id) || null;
    };

    const handleDragStart = (index: number) => {
        setDragIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (dragIndex !== null && dragIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = () => {
        if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
            onReorder(dragIndex, dragOverIndex);
        }
        setDragIndex(null);
        setDragOverIndex(null);
    };

    // Get original index in the full todos array
    const getOriginalIndex = (todo: Todo) => {
        return todos.findIndex(t => t.id === todo.id);
    };

    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                    <ListChecks className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                    No tasks yet
                </h3>
                <p className="text-sm text-gray-500">
                    Add your first task above to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pending tasks */}
            {pendingTodos.length > 0 && (
                <div>
                    <div className="mb-2 flex items-center gap-2 px-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Pending
                        </h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {pendingTodos.length}
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        {pendingTodos.map((todo) => {
                            const originalIndex = getOriginalIndex(todo);
                            return (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    category={getCategoryById(todo.categoryId)}
                                    tags={tags}
                                    index={originalIndex}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleDragEnd}
                                    isDragging={dragIndex === originalIndex}
                                    isDragOver={dragOverIndex === originalIndex}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Completed tasks */}
            {completedTodos.length > 0 && (
                <div>
                    <div className="mb-2 flex items-center gap-2 px-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Completed
                        </h3>
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                            {completedTodos.length}
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        {completedTodos.map((todo) => {
                            const originalIndex = getOriginalIndex(todo);
                            return (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    category={getCategoryById(todo.categoryId)}
                                    tags={tags}
                                    index={originalIndex}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleDragEnd}
                                    isDragging={dragIndex === originalIndex}
                                    isDragOver={dragOverIndex === originalIndex}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
