import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden',
                hoverable && 'transition-all duration-200 hover:shadow-md hover:border-slate-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('px-6 py-5 border-b border-slate-100 flex items-center justify-between', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
    <h3 className={cn('text-lg font-bold text-slate-900 tracking-tight', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
    <p className={cn('text-xs text-slate-500 mt-0.5', className)} {...props}>
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('p-6', className)} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3', className)} {...props}>
        {children}
    </div>
);
