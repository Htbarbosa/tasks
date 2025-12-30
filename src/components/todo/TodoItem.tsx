'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Todo, Category, Tag } from '@/types';
import { Checkbox, TagBadge, CategoryBadge } from '@/components/ui';
import { Trash2, GripVertical } from 'lucide-react';

interface TodoItemProps {
    todo: Todo;
    category: Category | null;
    tags: Tag[];
    index: number;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isDragOver: boolean;
}

export function TodoItem({
    todo,
    category,
    tags,
    index,
    onToggle,
    onDelete,
    onUpdate,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
    isDragOver,
}: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);

    const handleSubmit = () => {
        if (editTitle.trim() && editTitle !== todo.title) {
            onUpdate(todo.id, { title: editTitle.trim() });
        } else {
            setEditTitle(todo.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setEditTitle(todo.title);
            setIsEditing(false);
        }
    };

    const todoTags = tags.filter((tag) => todo.tags.includes(tag.id));

    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDragEnd={onDragEnd}
            className={cn(
                'group flex items-start gap-3 rounded-lg px-3 py-2.5',
                'transition-all duration-150 ease-in-out',
                'hover:bg-gray-50/80',
                todo.completed && 'opacity-60',
                isDragging && 'opacity-50 bg-gray-100',
                isDragOver && 'border-t-2 border-sky-500'
            )}
        >
            {/* Drag handle */}
            <div className="mt-0.5 cursor-grab active:cursor-grabbing opacity-0 transition-opacity group-hover:opacity-40">
                <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Checkbox */}
            <div className="mt-0.5">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-sm text-gray-800 outline-none"
                        autoFocus
                    />
                ) : (
                    <p
                        onClick={() => setIsEditing(true)}
                        className={cn(
                            'cursor-text text-sm text-gray-800',
                            'transition-colors duration-150',
                            todo.completed && 'text-gray-400 line-through'
                        )}
                    >
                        {todo.title}
                    </p>
                )}

                {/* Category and Tags */}
                {(category || todoTags.length > 0) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {category && <CategoryBadge category={category} size="sm" />}
                        {todoTags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} size="sm" />
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    onClick={() => onDelete(todo.id)}
                    className={cn(
                        'rounded p-1.5 text-gray-400',
                        'transition-colors duration-150',
                        'hover:bg-red-50 hover:text-red-500'
                    )}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
