/**
 * Role → accessible platform dashboards.
 *
 * - admin  → student + mentor + admin
 * - mentor → student + mentor (also if mentor_profiles / batch_mentors exists)
 * - student → student only
 *
 * Route guards in App.tsx must match. Data access remains enforced by RLS.
 */

export type AppRole = 'student' | 'mentor' | 'admin';

export interface DashboardLink {
  label: string;
  path: string;
  role: AppRole;
}

export const ALL_DASHBOARDS: DashboardLink[] = [
  { label: 'Student Dashboard', path: '/student/dashboard', role: 'student' },
  { label: 'Mentor Dashboard', path: '/mentor/dashboard', role: 'mentor' },
  { label: 'Admin Dashboard', path: '/admin/dashboard', role: 'admin' },
];

export function normalizeRole(role: string | null | undefined): AppRole {
  if (role === 'admin' || role === 'mentor') return role;
  return 'student';
}

/**
 * Compute which platforms a user may open.
 * @param primaryRole users.role
 * @param opts.hasMentorProfile whether mentor_profiles or batch_mentors has a row
 */
export function getAccessibleRoles(
  primaryRole: string | null | undefined,
  opts?: { hasMentorProfile?: boolean; email?: string | null }
): AppRole[] {
  const primary = normalizeRole(primaryRole);
  const roles = new Set<AppRole>(['student']);

  if (primary === 'admin') {
    roles.add('mentor');
    roles.add('admin');
  } else if (primary === 'mentor' || opts?.hasMentorProfile) {
    roles.add('mentor');
  }

  return Array.from(roles);
}

export function getAccessibleDashboards(
  primaryRole: string | null | undefined,
  opts?: { hasMentorProfile?: boolean; email?: string | null; accessibleRoles?: AppRole[] }
): DashboardLink[] {
  const roles = opts?.accessibleRoles ?? getAccessibleRoles(primaryRole, opts);
  return ALL_DASHBOARDS.filter((d) => roles.includes(d.role));
}

export function canAccessPlatform(
  platform: AppRole,
  primaryRole: string | null | undefined,
  opts?: { hasMentorProfile?: boolean; email?: string | null; accessibleRoles?: AppRole[] }
): boolean {
  const roles = opts?.accessibleRoles ?? getAccessibleRoles(primaryRole, opts);
  return roles.includes(platform);
}

export function roleDisplayLabel(
  role: string | null | undefined,
  accessibleRoles?: AppRole[]
): string {
  if (accessibleRoles && accessibleRoles.length > 1) {
    if (accessibleRoles.includes('admin')) return 'Administrator';
    if (accessibleRoles.includes('mentor')) return 'Mentor';
  }
  const r = normalizeRole(role);
  if (r === 'admin') return 'Administrator';
  if (r === 'mentor') return 'Mentor';
  return 'Student';
}
