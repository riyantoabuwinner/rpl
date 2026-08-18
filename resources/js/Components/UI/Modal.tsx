import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    children,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
        full: 'max-w-full m-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Dialog Panel */}
            <div
                className={cn(
                    'relative w-full bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden transform transition-all animate-fade-in',
                    sizes[size]
                )}
            >
                {(title || description) && (
                    <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
                        <div>
                            {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
                            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};
