import { User } from '@supabase/supabase-js';
import type { ProfileData } from './types';

export function resolveProfileDisplayName(
  profileData: ProfileData | null,
  user: User | null
): string {
  return (
    profileData?.userData?.first_name ||
    profileData?.profile?.first_name ||
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student'
  );
}

export function resolveProfileInitial(
  profileData: ProfileData | null,
  user: User | null
): string {
  return (
    profileData?.userData?.first_name?.[0] ||
    profileData?.profile?.first_name?.[0] ||
    user?.user_metadata?.first_name?.[0] ||
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    'S'
  );
}

export function resolveFullNameDisplay(
  profileData: ProfileData | null,
  user: User | null
): { firstName: string; lastName: string } {
  return {
    firstName:
      profileData?.userData?.first_name ||
      user?.user_metadata?.first_name ||
      user?.user_metadata?.full_name?.split(' ')[0] ||
      user?.email?.split('@')[0] ||
      'Student',
    lastName:
      profileData?.userData?.last_name ||
      user?.user_metadata?.last_name ||
      user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') ||
      '',
  };
}
