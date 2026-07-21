import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AppRole, getAccessibleRoles } from './roleAccess'

// Get Supabase URL for session cleanup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [accessibleRoles, setAccessibleRoles] = useState<AppRole[]>(['student'])
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
          setAccessibleRoles(['student'])
          setDatabaseUserId(null)
          console.log('🧹 User role cleared due to sign out');
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error)
        return { error }
      }

      return { data }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            full_name: name,
          }
        }
      })

      if (error) {
        setError(error)
        return { error }
      }

      return { data }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear local storage first
      try {
        if (supabaseUrl) {
          const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
          localStorage.removeItem(`sb-${projectRef}-auth-token`)
        }
      } catch {
        // Ignore storage cleanup errors
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error)
        return { error, success: false }
      }

      setUser(null)
      setSession(null)
      setUserRole(null)
      setDatabaseUserId(null)
      
      return { success: true }
    } catch (err) {
      console.error('Sign out error:', err)
      return { error: err as AuthError, success: false }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
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

  // Fetch user role by auth uid first, then email (case-insensitive).
  // Looking up only by email failed when people had multiple accounts
  // (e.g. admin on work email, student session on personal Gmail).
  const fetchUserRole = async (email: string, authUserId?: string | null) => {
    try {
      setRoleLoading(true)
      console.log('🔍 Fetching user role for:', { email, authUserId });

      const rolePriority: Record<string, number> = { admin: 3, mentor: 2, student: 1 };
      const pickBest = (rows: any[] | null | undefined) =>
        ((rows || []) as any[])
          .slice()
          .sort((a, b) => (rolePriority[b?.role] || 0) - (rolePriority[a?.role] || 0))[0] || null;

      let userData: any = null;

      // 1) Prefer exact auth.uid → public.users.id (canonical when IDs are synced)
      if (authUserId) {
        const { data: byId, error: byIdError } = await supabase
          .from('users')
          .select('id, role, email')
          .eq('id', authUserId)
          .maybeSingle();
        if (byIdError) {
          console.error('❌ Error fetching user by id:', byIdError);
        } else if (byId) {
          userData = byId;
          console.log('✅ User resolved by auth id:', userData);
        }
      }

      // 2) Fall back to case-insensitive email match
      if (!userData && email) {
        const { data: rows, error } = await supabase
          .from('users')
          .select('id, role, email')
          .ilike('email', email);

        if (error) {
          console.error('❌ Error fetching user by email:', error);
        } else {
          userData = pickBest(rows as any[]);
          if (userData) console.log('✅ User resolved by email:', userData);
        }
      }

      if (!userData) {
        console.warn('⚠️ No users row matched', { email, authUserId });
        const roles = getAccessibleRoles(null);
        setAccessibleRoles(roles);
        return { role: null, id: null, accessibleRoles: roles };
      }

      setDatabaseUserId(userData?.id || null);

      let hasMentorProfile = false;
      if (userData?.id) {
        const [{ data: mentorProfile }, { data: batchMentors }] = await Promise.all([
          supabase
            .from('mentor_profiles')
            .select('user_id')
            .eq('user_id', userData.id)
            .maybeSingle(),
          supabase
            .from('batch_mentors')
            .select('mentor_id')
            .eq('mentor_id', userData.id)
            .limit(1),
        ]);
        hasMentorProfile = !!(mentorProfile || (batchMentors && batchMentors.length > 0));
      }

      const roles = getAccessibleRoles(userData?.role, { hasMentorProfile, email });
      setAccessibleRoles(roles);
      console.log('🎭 Accessible platforms:', roles);

      return {
        role: userData?.role || null,
        id: userData?.id || null,
        accessibleRoles: roles,
      }
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      return { role: null, id: null, accessibleRoles: getAccessibleRoles(null) }
    } finally {
      setRoleLoading(false)
    }
  }

  // Update user role when the signed-in user changes (not on token refresh)
  useEffect(() => {
    if (session?.user?.email || session?.user?.id) {
      console.log('🔄 User changed, fetching role for:', session.user.email, session.user.id);
      fetchUserRole(session.user.email || '', session.user.id).then(userData => {
        console.log('🎭 Setting user role to:', userData.role);
        setUserRole(userData.role);
        if (userData.accessibleRoles) {
          setAccessibleRoles(userData.accessibleRoles);
        }
      });
    } else {
      console.log('🔄 No session, clearing user role');
      setUserRole(null);
      setAccessibleRoles(['student']);
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
    accessibleRoles,
    roleLoading,
    databaseUserId,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }
}
