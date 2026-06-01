import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import { MOCK_STATS } from '@/lib/mocks/dashboard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reportes' }

export default async function ReportesPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:reports')) redirect('/unauthorized')

  const s = profile.role === 'superadmin' ? MOCK_STATS.superadmin : MOCK_STATS.admin

  return (
    <div>
      <DashboardHeader title="Reportes" subtitle="Métricas y análisis de la plataforma" role={profile.role} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {'institutions' in s && <StatsCard label="Instituciones"   value={s.institutions}  icon="🏛️" color="bg-purple-100" />}
        {'users' in s && <StatsCard label="Usuarios totales"       value={s.users}         icon="👥" color="bg-blue-100" />}
        <StatsCard label="Cursos publicados" value={'courses' in s ? s.courses : s.activeCourses} icon="📚" color="bg-teal-100" />
        <StatsCard label="Certificados"      value={'certificatesIssued' in s ? s.certificatesIssued : s.certificates} icon="🏆" color="bg-yellow-100" />
      </div>

      {/* Tasa de completitud por curso (mock) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-[#005C7A] mb-4">Tasa de completitud por curso</h2>
        <div className="space-y-3">
          {[
            { course: 'Conoce GEH Suites', pct: 92 },
            { course: 'Recepcionistas de Hotel', pct: 78 },
            { course: 'Botones de Hotel', pct: 65 },
            { course: 'Meseros', pct: 55 },
            { course: 'ValerIA: Agente Inteligente', pct: 41 },
          ].map((r) => (
            <div key={r.course}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#222222] font-medium">{r.course}</span>
                <span className="text-[#5F6368]">{r.pct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#00A9E0] h-2 rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-100">
        <p className="text-sm text-[#5F6368]">
          📊 Los reportes avanzados con exportación CSV/PDF y gráficas interactivas estarán disponibles en la <strong>Fase 2</strong>.
        </p>
      </div>
    </div>
  )
}
