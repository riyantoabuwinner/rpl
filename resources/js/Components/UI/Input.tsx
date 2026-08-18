import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 tracking-wide">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-400',
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 text-slate-900',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, helperText, id, children, ...props }, ref) => {
        const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 tracking-wide">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-400',
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 text-slate-900',
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';
