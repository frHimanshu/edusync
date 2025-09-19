import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  if (isDemoMode || !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    // Return a mock client for demo mode
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Demo mode - authentication disabled' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database disabled' } }) }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database disabled' } }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database disabled' } }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database disabled' } }) })
      })
    } as any
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createBrowserClient() {
  return createClient()
}
