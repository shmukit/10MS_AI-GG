import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  loadingText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  loadingText = "Processing..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 shadow-modal max-w-md w-full mx-4 bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-6 leading-relaxed text-muted-foreground">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary hover:bg-[#17994B] text-primary-foreground'
            }`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            )}
            {isLoading ? loadingText : 'Yes, I am sure'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors border border-border ${
              isLoading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-muted hover:bg-accent text-foreground'
            }`}
          >
            No, I am unsure
          </button>
        </div>
      </div>
    </div>
  );
};
