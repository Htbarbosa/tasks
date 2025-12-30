'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    'group relative flex h-4 w-4 shrink-0 items-center justify-center',
                    'rounded border border-gray-300 bg-white',
                    'transition-all duration-150 ease-in-out',
                    'hover:border-gray-400 hover:bg-gray-50',
                    'focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:ring-offset-1',
                    checked && 'border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600',
                    className
                )}
            >
                <input
                    type="checkbox"
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    className="sr-only"
                    {...props}
                />
                <Check
                    className={cn(
                        'h-3 w-3 text-white transition-transform duration-150',
                        checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    )}
                    strokeWidth={3}
                />
            </button>
        );
    }
);

Checkbox.displayName = 'Checkbox';
