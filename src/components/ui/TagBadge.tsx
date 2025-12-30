'use client';

import { cn } from '@/lib/utils';
import { Tag as TagType } from '@/types';
import { X } from 'lucide-react';

interface TagBadgeProps {
    tag: TagType;
    onRemove?: () => void;
    size?: 'sm' | 'md';
    interactive?: boolean;
}

export function TagBadge({ tag, onRemove, size = 'sm', interactive = false }: TagBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full font-medium',
                'transition-all duration-150',
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-2.5 py-1 text-sm',
                interactive && 'cursor-pointer hover:opacity-80'
            )}
            style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
            }}
        >
            {tag.name}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
}
