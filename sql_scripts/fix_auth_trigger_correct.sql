-- FIX AUTH TRIGGER - CORRECT VERSION
-- This script fixes the root cause: the auth trigger should update existing users, not create duplicates

-- Drop existing function and trigger
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create CORRECTED function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Check if a user with this email already exists in public.users
  SELECT id INTO existing_user_id 
  FROM public.users 
  WHERE email = NEW.email;
  
  IF existing_user_id IS NOT NULL THEN
    -- User already exists - UPDATE the existing record to use the auth.users ID
    -- This preserves all existing relationships (batch assignments, etc.)
    UPDATE public.users SET
      id = NEW.id,
      email_verified = NEW.email_confirmed_at IS NOT NULL,
      updated_at = NOW()
    WHERE id = existing_user_id;
    
    RAISE NOTICE 'Updated existing user % to use auth ID %', existing_user_id, NEW.id;
  ELSE
    -- User doesn't exist - create new record
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
    ) VALUES (
      NEW.id,
      NEW.email,
      '', -- password_hash is empty since we don't store it in public.users
      COALESCE(NEW.raw_user_meta_data->>'role', 'student'), -- use metadata role or default to student
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email_confirmed_at IS NOT NULL,
      NEW.created_at,
      NEW.updated_at
    );
    
    RAISE NOTICE 'Created new user with auth ID %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Success message
SELECT 'CORRECTED Auth users sync trigger created successfully!' as status;
