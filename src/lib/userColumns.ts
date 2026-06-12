/** Safe users columns — excludes password_hash (not granted to authenticated). */
export const USER_PUBLIC_COLUMNS =
  'id, email, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at, updated_at';
