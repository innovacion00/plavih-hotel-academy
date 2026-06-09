import type { VideoProvider } from './types'

export async function getVideoProvider(): Promise<VideoProvider> {
  const { createClient } = await import('@/lib/supabase/server')
  const { DigitalOceanSpacesVideoProvider } = await import('./digitalocean-spaces-provider')
  const supabase = await createClient()
  return new DigitalOceanSpacesVideoProvider(supabase)
}

export type { VideoProvider } from './types'
