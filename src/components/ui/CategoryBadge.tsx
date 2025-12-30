'use client';

import { cn } from '@/lib/utils';
import { Category } from '@/types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CategoryBadgeProps {
    category: Category;
    size?: 'sm' | 'md';
    showIcon?: boolean;
}

export function CategoryBadge({ category, size = 'sm', showIcon = true }: CategoryBadgeProps) {
    // Dynamically get the icon component
    const IconComponent = (Icons[category.icon as keyof typeof Icons] as LucideIcon) || Icons.Folder;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md font-medium',
                'transition-all duration-150',
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-2.5 py-1 text-sm'
            )}
            style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
            }}
        >
            {showIcon && (
                <IconComponent
                    className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')}
                />
            )}
            {category.name}
        </span>
    );
}
