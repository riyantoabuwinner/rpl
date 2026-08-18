import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus:ring-blue-500',
            secondary: 'bg-slate-800 text-white hover:bg-slate-900 active:bg-black shadow-sm focus:ring-slate-700',
            outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-blue-500',
            danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus:ring-red-500',
            success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm focus:ring-emerald-500',
            ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
            md: 'px-4 py-2 text-sm font-medium rounded-lg',
            lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg className="w-4 h-4 mr-2 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
