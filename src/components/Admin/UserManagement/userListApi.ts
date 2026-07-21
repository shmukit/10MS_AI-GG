import { supabase } from '../../../lib/supabase';
import { USER_PUBLIC_COLUMNS } from '../../../lib/userColumns';
import { buildCertificatesMap, buildEnrollmentMap } from './enrollmentUtils';
import type { UserListFetchFilters, UserListFetchResult } from './types';

export async function fetchUserListData(filters: UserListFetchFilters): Promise<UserListFetchResult> {
  const { roleFilter, statusFilter, debouncedSearch } = filters;

  let query = supabase
    .from('users')
    .select(USER_PUBLIC_COLUMNS)
    .order('created_at', { ascending: false });

  if (roleFilter !== 'all') {
    query = query.eq('role', roleFilter);
  }

  if (statusFilter === 'active') {
    query = query.eq('is_active', true);
  } else if (statusFilter === 'inactive') {
    query = query.eq('is_active', false);
  }

  if (debouncedSearch) {
    query = query.or(
      `first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  const [
    { data: certData },
    { data: batchData },
    { data: roadmaps },
    { data: batches },
  ] = await Promise.all([
    supabase.from('student_certificates').select('id, student_id, certificate_type, issued_at, batch_id, roadmap_id, metadata'),
    supabase.from('student_batch_assignments').select(`
      student_id,
      batch_id,
      batches (
        id,
        name,
        roadmap_id,
        roadmaps ( id, title )
      )
    `),
    supabase.from('roadmaps').select('id, title').order('title'),
    supabase.from('batches').select('id, name').order('name'),
  ]);

  return {
    users: data || [],
    enrollmentsByUser: buildEnrollmentMap(batchData),
    certificatesByStudent: buildCertificatesMap(certData),
    roadmapOptions: (roadmaps as any[]) || [],
    batchOptions: (batches as any[]) || [],
  };
}

export async function toggleUserActiveStatus(userId: string, currentStatus: boolean) {
  return supabase
    .from('users')
    .update({ is_active: !currentStatus } as unknown as never)
    .eq('id', userId);
}

export async function deleteUserFromDb(userId: string) {
  return supabase
    .from('users')
    .delete()
    .eq('id', userId);
}
