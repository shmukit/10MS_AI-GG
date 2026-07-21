import React from 'react';

interface ProfileSaveMessagesProps {
  saveSuccess: boolean;
  saveError: string | null;
}

export const ProfileSaveMessages: React.FC<ProfileSaveMessagesProps> = ({ saveSuccess, saveError }) => (
  <>
    {saveSuccess && (
      <div className="mb-6 p-4 bg-accent border border-border text-accent-foreground rounded-xl">
        ✅ Profile updated successfully!
      </div>
    )}
    {saveError && (
      <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
        ❌ {saveError}
      </div>
    )}
  </>
);
