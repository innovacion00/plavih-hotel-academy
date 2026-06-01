import { redirect } from 'next/navigation'
import { getServerProfile, isMockMode, isSupabaseConfigured } from '@/lib/auth/session'
import Sidebar from '@/components/dashboard/Sidebar'
import MockBanner from '@/components/dashboard/MockBanner'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Supabase not configured and not in mock mode → direct user to setup page
  if (!isMockMode && !isSupabaseConfigured) {
    redirect('/configuracion-pendiente')
  }

  const profile = await getServerProfile()

  // No profile means unauthenticated (only reachable here when Supabase IS configured)
  if (!profile) {
    redirect('/acceder?redirect=/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        role={profile.role}
        userName={profile.full_name ?? ''}
        userEmail={profile.email}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {isMockMode && <MockBanner />}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
