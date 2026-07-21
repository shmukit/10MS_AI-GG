import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { posthog } from '../../../lib/posthog';
import {
  buildEditFormFromProfile,
  fetchProfileDashboardData,
  fetchStudentCertificates,
  saveProfileUpdates,
} from './profileApi';
import { DEFAULT_EDIT_FORM, type ProfileData, type ProfileEditForm } from './types';

interface UseStudentProfileParams {
  user: User | null;
  databaseUserId: string | null;
}

export function useStudentProfile({ user, databaseUserId }: UseStudentProfileParams) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState<ProfileEditForm>(DEFAULT_EDIT_FORM);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id || !databaseUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Profile: Auth user object:', user);
        console.log('🆔 Profile: User ID:', user?.id);
        console.log('📧 Profile: User email:', user?.email);
        console.log('📋 Profile: User metadata:', user?.user_metadata);

        const data = await fetchProfileDashboardData(databaseUserId);
        console.log('📊 Profile: Dashboard data received:', data);
        setProfileData(data);
        setEditForm(buildEditFormFromProfile(data));
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }

      try {
        const certData = await fetchStudentCertificates(databaseUserId);
        setCertificates(certData);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
        posthog?.capture('profile_viewed', {
          target_user_id: databaseUserId,
          is_own_profile: true,
        });
      }
    };

    fetchProfileData();
  }, [user?.id, user?.email, databaseUserId]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user?.id || !databaseUserId) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      console.log('🔄 Starting to save profile updates...');
      console.log('👤 User ID being used:', databaseUserId);
      console.log('📧 User email:', user.email);
      console.log('📝 Profile updates to save:', { editForm });

      const result = await saveProfileUpdates(databaseUserId, editForm);

      if (!result.success) {
        console.error('❌ Failed to save profile:', result.error);
        setSaveError(result.error);
        return;
      }

      console.log('✅ User data updated successfully');
      console.log('✅ Student profile updated successfully');
      console.log('🔄 Refreshing profile data from server...');

      setProfileData(result.refreshedData);
      setEditForm(buildEditFormFromProfile(result.refreshedData));
      setIsEditing(false);
      setSaveSuccess(true);
      console.log('✅ Profile updated successfully via API and data refreshed');

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, user?.email, databaseUserId, editForm]);

  const handleCancel = useCallback(() => {
    setEditForm(buildEditFormFromProfile(profileData));
    setIsEditing(false);
  }, [profileData]);

  const startEditing = useCallback(() => {
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  }, []);

  return {
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
  };
}
