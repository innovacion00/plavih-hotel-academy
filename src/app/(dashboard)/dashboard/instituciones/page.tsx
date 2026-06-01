import { getServerProfile } from '@/lib/auth/session'
import { MOCK_INSTITUTIONS } from '@/lib/mocks/dashboard'
import { can } from '@/lib/permissions'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Instituciones' }

export default async function InstitucionesPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:all_institutions')) redirect('/unauthorized')

  return (
    <div>
      <DashboardHeader title="Instituciones" subtitle="Hoteles y organizaciones en la plataforma" role={profile.role} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {MOCK_INSTITUTIONS.map((inst) => (
          <div key={inst.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-[#E8F7FD] rounded-xl flex items-center justify-center">
                <span className="text-xl">🏨</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inst.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {inst.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <h3 className="font-bold text-[#222222] text-sm mb-1">{inst.name}</h3>
            <p className="text-xs text-[#5F6368] mb-3">/{inst.slug}</p>
            <div className="flex gap-4 text-xs text-[#5F6368]">
              <span>👥 {inst.students} estudiantes</span>
              <span>📚 {inst.courses} cursos</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#005C7A]">Todas las instituciones</h2>
          <button className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors">
            + Nueva institución
          </button>
        </div>
        <p className="text-sm text-[#5F6368]">
          La gestión completa de instituciones estará disponible en la Fase 2 con integración Supabase activa.
        </p>
      </div>
    </div>
  )
}
