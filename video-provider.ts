/**
 * Factory: returns the appropriate VideoProvider for the current environment.
 *
 * Server-side usage only (needs the Supabase server client which reads cookies).
 * Import the interface type directly from ./types for client-side type checking.
 */
import type { VideoProvider } from './types'

export async function getVideoProvider(): Promise<VideoProvider> {
  const { createClient } = await import('@/lib/supabase/server')
  const { SupabaseVideoProvider } = await import('./supabase-video-provider')
  const supabase = await createClient()
  return new SupabaseVideoProvider(supabase)
}

export type { VideoProvider } from './types'
