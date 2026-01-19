-- Admin Dashboard Permissions
-- Creates RLS policies to allow Admins to manage users

-- 1. Users Table: Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Users Table: Admins can insert new users (required for Add User)
-- Note: 'auth.users' is managed by Supabase Auth, but 'public.users' needs this
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Users Table: Admins can update users (e.g. change role, deactivate)
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Users Table: Admins can delete users (optional, usually soft delete preferred)
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Verify
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'users';
