import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'slate' | 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'indigo' | 'cyan' | 'sky';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'slate',
    size = 'md',
    children,
    ...props
}) => {
    const variants = {
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        sky: 'bg-sky-50 text-sky-700 border-sky-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs font-medium',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full border font-medium transition-colors',
                variants[variant] || variants.slate,
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
