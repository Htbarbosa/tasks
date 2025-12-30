'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 font-medium',
                    'transition-all duration-150 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    'disabled:pointer-events-none disabled:opacity-50',
                    // Variants
                    variant === 'default' && [
                        'rounded-md bg-gray-900 text-white',
                        'hover:bg-gray-800',
                        'focus:ring-gray-900/20',
                    ],
                    variant === 'ghost' && [
                        'rounded-md bg-transparent text-gray-600',
                        'hover:bg-gray-100 hover:text-gray-900',
                        'focus:ring-gray-500/20',
                    ],
                    variant === 'danger' && [
                        'rounded-md bg-red-500 text-white',
                        'hover:bg-red-600',
                        'focus:ring-red-500/20',
                    ],
                    // Sizes
                    size === 'sm' && 'h-7 px-2 text-xs',
                    size === 'md' && 'h-9 px-3 text-sm',
                    size === 'lg' && 'h-11 px-4 text-base',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
