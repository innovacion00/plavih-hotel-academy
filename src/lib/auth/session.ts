import { createClient } from '@/lib/supabase/server'
import { MOCK_USER } from '@/lib/mocks/dashboard'
import type { Profile } from '@/types'

/**
 * USE_MOCKS is explicit and opt-in.
 * - NEXT_PUBLIC_USE_MOCKS=true  → always use mock data (safe for development)
 * - NEXT_PUBLIC_USE_MOCKS=false (default) → require real Supabase credentials
 *
 * NEXT_PUBLIC_ prefix so it can also be read client-side for UI hints.
 */
export const isMockMode = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key'

export async function getServerSession() {
  if (isMockMode) return null
  if (!isSupabaseConfigured) return null

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

export async function getServerProfile(): Promise<Profile | null> {
  if (isMockMode) return MOCK_USER
  if (!isSupabaseConfigured) return null   // triggers "config pending" path in dashboard layout

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) return null
    return data as Profile
  } catch {
    return null
  }
}
