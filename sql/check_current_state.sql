-- Check Current State of User Tables
-- This script provides a comprehensive view of the current user synchronization status

-- 1. Check if the trigger and function exist
SELECT 
  'TRIGGER CHECK' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN '✅ Trigger exists'
    ELSE '❌ Trigger missing'
  END as status;

SELECT 
  'FUNCTION CHECK' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'handle_new_user'
    ) THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as status;

-- 2. Count users in both tables
SELECT 
  'USER COUNT' as check_type,
  'auth.users' as table_name,
  COUNT(*) as user_count
FROM auth.users
UNION ALL
SELECT 
  'USER COUNT' as check_type,
  'public.users' as table_name,
  COUNT(*) as user_count
FROM public.users;

-- 3. Check for users that exist in auth.users but NOT in public.users
SELECT 
  'MISSING IN PUBLIC' as check_type,
  au.id,
  au.email,
  au.created_at,
  'Needs sync' as action
FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL;

-- 4. Check for users that exist in public.users but NOT in auth.users
SELECT 
  'MISSING IN AUTH' as check_type,
  pu.id,
  pu.email,
  pu.created_at,
  'Orphaned record' as action
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- 5. Show the most recent users in both tables for comparison
SELECT 
  'RECENT AUTH USERS' as check_type,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  CASE 
    WHEN au.raw_user_meta_data IS NOT NULL THEN 
      COALESCE(au.raw_user_meta_data->>'first_name', '') || ' ' || 
      COALESCE(au.raw_user_meta_data->>'last_name', '')
    ELSE 'No name data'
  END as full_name
FROM auth.users au
ORDER BY au.created_at DESC
LIMIT 5;

SELECT 
  'RECENT PUBLIC USERS' as check_type,
  pu.email,
  pu.created_at,
  pu.first_name || ' ' || pu.last_name as full_name,
  pu.role
FROM public.users pu
ORDER BY pu.created_at DESC
LIMIT 5;

-- 6. Check if the specific user (afsanamimi194@gmail.com) exists in both tables
SELECT 
  'SPECIFIC USER CHECK' as check_type,
  'afsanamimi194@gmail.com' as email,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'afsanamimi194@gmail.com') 
    THEN '✅ In auth.users'
    ELSE '❌ Missing from auth.users'
  END as auth_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE email = 'afsanamimi194@gmail.com') 
    THEN '✅ In public.users'
    ELSE '❌ Missing from public.users'
  END as public_status;
