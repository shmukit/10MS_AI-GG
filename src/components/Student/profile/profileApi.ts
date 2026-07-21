import { DatabaseService } from '../../../services/database';
import { supabase } from '../../../lib/supabase';
import type { ProfileData, ProfileEditForm } from './types';

export async function fetchProfileDashboardData(databaseUserId: string) {
  return DatabaseService.getDashboardData(databaseUserId);
}

export async function fetchStudentCertificates(databaseUserId: string) {
  const { data, error } = await supabase
    .from('student_certificates')
    .select('*')
    .eq('student_id', databaseUserId)
    .order('issued_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export function buildEditFormFromProfile(data: ProfileData | null): ProfileEditForm {
  return {
    first_name: data?.userData?.first_name || '',
    last_name: data?.userData?.last_name || '',
    degree: data?.profile?.degree || '',
    subject: data?.profile?.subject || '',
    year: data?.profile?.year || '',
    institute: data?.profile?.institute || '',
  };
}

export async function saveProfileUpdates(
  databaseUserId: string,
  editForm: ProfileEditForm
): Promise<{ success: true; refreshedData: ProfileData } | { success: false; error: string }> {
  const userUpdates = {
    first_name: editForm.first_name,
    last_name: editForm.last_name,
  };

  const profileUpdates = {
    degree: editForm.degree,
    subject: editForm.subject,
    year: editForm.year,
    institute: editForm.institute,
  };

  const userUpdateSuccess = await DatabaseService.updateUser(databaseUserId, userUpdates);
  if (!userUpdateSuccess) {
    return { success: false, error: 'Failed to update user information. Please try again.' };
  }

  const profileUpdateSuccess = await DatabaseService.updateStudentProfile(databaseUserId, profileUpdates);
  if (!profileUpdateSuccess) {
    return { success: false, error: 'Failed to update profile information. Please try again.' };
  }

  const refreshedData = await DatabaseService.getDashboardData(databaseUserId);
  return { success: true, refreshedData };
}
