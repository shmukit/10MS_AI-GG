-- Fix Infinite Recursion in RLS Policies
-- We use a SECURITY DEFINER function to bypass RLS when checking for admin status.

-- 1. Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER -- Run with privileges of the creator (bypass RLS)
SET search_path = public -- Secure search path
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 2. Update 'users' table policies to use this function
-- Select
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    is_admin() OR auth.uid() = id -- Users can still view themselves
  );

-- Insert
DROP POLICY IF EXISTS "Admins can insert users" ON users;
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    is_admin()
  );

-- Update
DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    is_admin() OR auth.uid() = id -- Users can update themselves (if allowed by other logic)
  );

-- Delete
DROP POLICY IF EXISTS "Admins can delete users" ON users;
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (
    is_admin()
  );

-- 3. Verify function works
-- SELECT is_admin();
