import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    isDarkMode: boolean;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    isDarkMode,
    maxWidth = 'max-w-md'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${maxWidth} w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
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
    isDarkMode?: boolean;
    className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    icon: Icon,
    label,
    variant = 'primary',
    isDarkMode = false,
    className = ''
}) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        warning: 'bg-orange-500 hover:bg-orange-600 text-white',
        purple: 'bg-purple-600 hover:bg-purple-700 text-white'
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
