import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { StudentHeader } from './StudentHeader';
import { useStudentProfile } from './profile/useStudentProfile';
import {
  resolveFullNameDisplay,
  resolveProfileDisplayName,
  resolveProfileInitial,
} from './profile/profileSelectors';
import { ProfileSkeleton } from './profile/ProfileSkeleton';
import { ProfileSaveMessages } from './profile/ProfileSaveMessages';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileFormFields } from './profile/ProfileFormFields';
import { ProfileCertificatesSection } from './profile/ProfileCertificatesSection';

export const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, databaseUserId } = useAuth();

  const {
    profileData,
    certificates,
    loading,
    isEditing,
    isSaving,
    saveError,
    saveSuccess,
    editForm,
    handleInputChange,
    handleSave,
    handleCancel,
    startEditing,
  } = useStudentProfile({ user, databaseUserId });

  if (loading) {
    return <ProfileSkeleton />;
  }

  const displayName = resolveProfileDisplayName(profileData, user);
  const avatarInitial = resolveProfileInitial(profileData, user);
  const fullNameDisplay = resolveFullNameDisplay(profileData, user);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentHeader userName={displayName} pageTitle="Profile" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-8 overflow-hidden">
          <ProfileSaveMessages saveSuccess={saveSuccess} saveError={saveError} />

          <ProfileHeader
            avatarInitial={avatarInitial}
            displayName={displayName}
            degree={profileData?.profile?.degree}
            subject={profileData?.profile?.subject}
            year={profileData?.profile?.year}
            institute={profileData?.profile?.institute}
            isEditing={isEditing}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
            onStartEditing={startEditing}
          />

          <ProfileFormFields
            profileData={profileData}
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            onInputChange={handleInputChange}
            fullNameDisplay={fullNameDisplay}
          />
        </div>

        <ProfileCertificatesSection certificates={certificates} />
      </div>
    </div>
  );
};
