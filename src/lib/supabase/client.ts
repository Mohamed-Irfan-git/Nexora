import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { validateSupabaseConfig } from '@/lib/supabase/validate-env'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const configError = validateSupabaseConfig(supabaseUrl ?? '', supabaseAnonKey ?? '')
if (configError) {
  console.error('[Nexora] Supabase config error:', configError)
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
