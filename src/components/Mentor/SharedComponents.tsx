import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${maxWidth} w-full mx-4 p-6 rounded-xl shadow-lg border border-border transition-colors duration-200 bg-card`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

interface ActionButtonProps {
    onClick: () => void;
    icon?: React.ElementType;
    label: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'purple';
    className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    icon: Icon,
    label,
    variant = 'primary',
    className = ''
}) => {
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success: 'bg-primary text-primary-foreground hover:bg-primary/90',
        warning: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
        purple: 'bg-primary text-primary-foreground hover:bg-primary/90'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
        </button>
    );
};
