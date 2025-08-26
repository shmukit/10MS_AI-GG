import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0)
    
    // Test basic connection
    const { data, error } = await supabase.from('test').select('*').limit(1)
    
    if (error) {
      console.log('Connection test result:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('Connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Connection test failed:', err)
    return { success: false, error: err }
  }
}
