import type { EnrollmentDetail, StudentCertificateRecord } from '../../../lib/certificateTypes';

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'mentor' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface EnrollmentInfo {
  batches: string[];
  roadmaps: string[];
  batchIds: string[];
  roadmapIds: string[];
  details: EnrollmentDetail[];
}

export type RoleFilter = 'all' | 'student' | 'mentor' | 'admin';
export type StatusFilter = 'all' | 'active' | 'inactive';

export interface UserListFetchFilters {
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
  debouncedSearch: string;
}

export interface UserListFetchResult {
  users: UserData[];
  enrollmentsByUser: Record<string, EnrollmentInfo>;
  certificatesByStudent: Record<string, StudentCertificateRecord[]>;
  roadmapOptions: { id: string; title: string }[];
  batchOptions: { id: string; name: string }[];
}
