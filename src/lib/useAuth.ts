import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

// Get Supabase URL for session cleanup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          setError(error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Clear user role when user logs out
        if (event === 'SIGNED_OUT' || !session) {
          setUserRole(null)
          console.log('🧹 User role cleared due to sign out');
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      // Fetch user role immediately after successful sign in
      if (data.user?.email) {
        const role = await fetchUserRole(data.user.email)
        setUserRole(role)
        console.log('✅ Sign in successful, user role set to:', role)
      }
      
      return { success: true, data }
    } catch (err) {
      console.error('Sign in error:', err)
      return { success: false, error: err as AuthError }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setError(null)
      
      // Parse first and last name from full name
      let firstName = '';
      let lastName = '';
      if (name) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // Determine user type based on email domain
      const isCompanyEmail = email.includes('@10minuteschool.com') || email.includes('@lightcastlepartners.com');
      const userRole = isCompanyEmail ? 'admin' : 'student';
      
      console.log('🔐 Signing up user:', email, 'Role:', userRole, 'Company:', isCompanyEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: userRole,
            is_company_user: isCompanyEmail,
            intended_roadmap: isCompanyEmail ? 'augmedix' : 'general'
          }
        }
      })
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      // For company users, try to connect them to existing data
      if (data.user && isCompanyEmail) {
        console.log('🏢 Company user signup detected, checking for existing profile...');
        
        // Check if this email already exists in public.users
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, role, first_name, last_name')
            .eq('email', email)
            .single();
          
          if (existingUser) {
            console.log('✅ Found existing public user profile for:', email);
            console.log('🔄 User will be connected to existing batch assignments on first login');
          }
        } catch (existingUserError) {
          console.log('ℹ️ No existing public user found - new profile will be created');
        }
      }
      
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          data,
          requiresEmailConfirmation: true,
          message: `Please check your email and click the confirmation link to complete your registration.${isCompanyEmail ? ' You will be automatically assigned to the Augmedix learning program.' : ''}`
        }
      }
      
      return { success: true, data }
    } catch (err) {
      console.error('Sign up error:', err)
      return { success: false, error: err as AuthError }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      console.log('🔄 Starting logout process...')
      
      // Check if there's an active session before attempting logout
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        console.log('✅ Active session found, proceeding with logout...')
        // Try to sign out from Supabase - this will trigger the auth state change listener
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('❌ Supabase logout error:', error)
          // If Supabase logout fails, manually clear state as fallback
          setUser(null)
          setSession(null)
          setUserRole(null)
          console.log('🧹 Local state cleared due to Supabase error')
        } else {
          console.log('✅ Supabase logout successful - auth state change will handle cleanup')
        }
      } else {
        console.log('⚠️ No active session found, manually clearing state...')
        // No session exists, manually clear state
        setUser(null)
        setSession(null)
        setUserRole(null)
        console.log('🧹 Local state cleared - no session found')
      }
      
      // Clear any stored session data as a fallback
      try {
        localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')
        sessionStorage.clear()
        console.log('🧹 Stored session data cleared')
      } catch (storageError) {
        console.log('⚠️ Could not clear stored session data:', storageError)
      }
      
      // Always return success to ensure user gets redirected
      return { success: true }
    } catch (err) {
      console.error('❌ Exception during logout:', err)
      // Clear local state even if there's an exception
      setUser(null)
      setSession(null)
      setUserRole(null)
      console.log('🧹 Local state cleared after exception')
      
      // Clear any stored session data as a fallback
      try {
        localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')
        sessionStorage.clear()
        console.log('🧹 Stored session data cleared after exception')
      } catch (storageError) {
        console.log('⚠️ Could not clear stored session data after exception:', storageError)
      }
      
      return { success: true } // Still return success to redirect user
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL
      })
      if (error) {
        setError(error)
        return { error }
      }
      return { data }
    } catch (err) {
      console.error('Reset password error:', err)
      return { error: err as AuthError }
    }
  }

  // Fetch user role from custom database
  const fetchUserRole = async (email: string) => {
    try {
      setRoleLoading(true)
      console.log('🔍 Fetching user role for email:', email);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single()
      
      if (error) {
        console.error('❌ Error fetching user role:', error);
        return null
      }
      
      console.log('✅ User role fetched successfully:', data?.role);
      return data?.role || null
    } catch (err) {
      console.error('❌ Error fetching user role:', err);
      return null
    } finally {
      setRoleLoading(false)
    }
  }

  // Update user role when session changes
  useEffect(() => {
    if (session?.user?.email) {
      console.log('🔄 Session changed, fetching role for:', session.user.email);
      setRoleLoading(true)
      fetchUserRole(session.user.email).then(role => {
        console.log('🎭 Setting user role to:', role);
        setUserRole(role)
        setRoleLoading(false)
      })
    } else {
      console.log('🔄 No session, clearing user role');
      setUserRole(null)
      setRoleLoading(false)
    }
  }, [session])

  return {
    user,
    session,
    loading,
    error,
    userRole,
    roleLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }
}
