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
  const [databaseUserId, setDatabaseUserId] = useState<string | null>(null)

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
        const userData = await fetchUserRole(data.user.email)
        setUserRole(userData.role)
        console.log('✅ Sign in successful, user role set to:', userData.role)
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
      
      // SECURITY: All self-service signups are students.
      // Admin/Mentor promotion must go through the secure RPC
      // (create_new_user / upsert_student_user) which requires
      // an existing admin or mentor caller.
      const userRole = 'student';
      
      console.log('🔐 Signing up user:', email, 'Role:', userRole);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: userRole,
          }
        }
      })
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          data,
          requiresEmailConfirmation: true,
          message: 'Please check your email and click the confirmation link to complete your registration.'
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

  // Fetch user role and ID from custom database
  const fetchUserRole = async (email: string) => {
    try {
      setRoleLoading(true)
      console.log('🔍 Fetching user role and ID for email:', email);
      const { data, error } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', email)
        .single()
      
      if (error) {
        console.error('❌ Error fetching user data:', error);
        return { role: null, id: null }
      }
      
      console.log('✅ User data fetched successfully:', data);
      const userData = data as any;
      setDatabaseUserId(userData?.id || null);
      return { role: userData?.role || null, id: userData?.id || null }
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      return { role: null, id: null }
    } finally {
      setRoleLoading(false)
    }
  }

  // Update user role when the signed-in user changes (not on token refresh)
  useEffect(() => {
    if (session?.user?.email) {
      console.log('🔄 User changed, fetching role for:', session.user.email);
      fetchUserRole(session.user.email).then(userData => {
        console.log('🎭 Setting user role to:', userData.role);
        setUserRole(userData.role);
      });
    } else {
      console.log('🔄 No session, clearing user role');
      setUserRole(null);
      setDatabaseUserId(null);
      setRoleLoading(false);
    }
  }, [session?.user?.id]);

  return {
    user,
    session,
    loading,
    error,
    userRole,
    roleLoading,
    databaseUserId,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }
}
