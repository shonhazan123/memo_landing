import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers (prepared for future implementation)
export const auth = {
  signInWithGoogle: async () => {
    // TODO: Implement Google OAuth
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/login`
    //   }
    // })
    // return { data, error }
  },
  
  signOut: async () => {
    // TODO: Implement sign out
    // const { error } = await supabase.auth.signOut()
    // return { error }
  },
  
  getSession: async () => {
    // TODO: Get current session
    // const { data: { session } } = await supabase.auth.getSession()
    // return session
  },
  
  getUser: async () => {
    // TODO: Get current user
    // const { data: { user } } = await supabase.auth.getUser()
    // return user
  }
}

