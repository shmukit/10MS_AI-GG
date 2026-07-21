import React from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { formatDegreeLine } from './profileUtils';

interface ProfileHeaderProps {
  avatarInitial: string;
  displayName: string;
  degree?: string | null;
  subject?: string | null;
  year?: string | null;
  institute?: string | null;
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarInitial,
  displayName,
  degree,
  subject,
  year,
  institute,
  isEditing,
  isSaving,
  onSave,
  onCancel,
  onStartEditing,
}) => (
  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
    <div className="flex items-center gap-4 md:gap-6">
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 bg-muted text-foreground border border-border">
        {avatarInitial}
      </div>
      <div className="min-w-0">
        <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 truncate text-foreground">
          {displayName}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground">
          {formatDegreeLine(degree, subject, year)}
        </p>
        <p className="text-xs md:text-base text-muted-foreground truncate">
          {institute?.trim() ? institute.trim() : 'Not set'}
        </p>
      </div>
    </div>
    {isEditing ? (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-primary-foreground"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Save
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex items-center gap-2 bg-muted border border-border text-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Cancel
        </button>
      </div>
    ) : (
      <button
        onClick={onStartEditing}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-xl hover:opacity-90 transition-opacity text-sm"
      >
        <Edit3 className="w-4 h-4" />
        Edit Profile
      </button>
    )}
  </div>
);
