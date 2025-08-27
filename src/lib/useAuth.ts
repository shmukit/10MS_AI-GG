import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

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
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
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

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL
        }
      })
      if (error) {
        setError(error)
        return { success: false, error }
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        setError(error)
        return { error }
      }
      return { success: true }
    } catch (err) {
      console.error('Sign out error:', err)
      return { error: err as AuthError }
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
    }
  }

  // Update user role when session changes
  useEffect(() => {
    if (session?.user?.email) {
      console.log('🔄 Session changed, fetching role for:', session.user.email);
      fetchUserRole(session.user.email).then(role => {
        console.log('🎭 Setting user role to:', role);
        setUserRole(role)
      })
    } else {
      console.log('🔄 No session, clearing user role');
      setUserRole(null)
    }
  }, [session])

  return {
    user,
    session,
    loading,
    error,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }
}
