import type { EnrollmentInfo, UserData } from './types';

export function filterUsersByEnrollment(
  users: UserData[],
  enrollmentsByUser: Record<string, EnrollmentInfo>,
  batchFilter: string,
  roadmapFilter: string
) {
  return users.filter((user) => {
    const enrollment = enrollmentsByUser[user.id];
    if (batchFilter !== 'all') {
      if (!enrollment?.batchIds.includes(batchFilter)) return false;
    }
    if (roadmapFilter !== 'all') {
      if (!enrollment?.roadmapIds.includes(roadmapFilter)) return false;
    }
    return true;
  });
}

export function buildStudentModalPayload(user: UserData) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    raw_user_meta_data: { full_name: `${user.first_name} ${user.last_name}`.trim() },
  };
}

export function buildUserDisplayName(user: UserData) {
  return `${user.first_name} ${user.last_name}`.trim();
}
