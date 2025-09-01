-- Sync Existing Auth Users to Custom Users Table
-- This script manually syncs any users that were created before the trigger was set up

-- Insert existing auth users that don't exist in public.users
INSERT INTO public.users (
  id,
  email,
  password_hash,
  role,
  first_name,
  last_name,
  email_verified,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  '', -- password_hash is empty since we don't store it in public.users
  'student', -- default role for existing users
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  au.email_confirmed_at IS NOT NULL, -- email_verified based on confirmation
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL;

-- Show how many users were synced
SELECT 
  COUNT(*) as synced_users,
  'Existing users synced successfully!' as status
FROM public.users pu
JOIN auth.users au ON pu.id = au.id;
