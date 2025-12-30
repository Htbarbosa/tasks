'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'ghost';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'w-full text-sm text-gray-800 placeholder:text-gray-400',
                    'transition-all duration-150 ease-in-out',
                    'focus:outline-none',
                    variant === 'default' && [
                        'rounded-md border border-gray-200 bg-white px-3 py-2',
                        'hover:border-gray-300',
                        'focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20',
                    ],
                    variant === 'ghost' && [
                        'border-none bg-transparent px-0 py-1',
                        'focus:ring-0',
                    ],
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
