import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Evaluaciones' }

const MOCK_ASSESSMENTS = [
  { id: '1', title: 'Evaluación Final — Recepcionistas', course: 'Recepcionistas de Hotel', questions: 20, passing: 70, attempts: 45, avg: 82 },
  { id: '2', title: 'Quiz de Inducción', course: 'Conoce GEH Suites', questions: 10, passing: 60, attempts: 89, avg: 91 },
  { id: '3', title: 'Prueba de Liderazgo', course: 'Administradores y Jefes', questions: 15, passing: 75, attempts: 12, avg: 78 },
]

export default async function EvaluacionesPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:assessments')) redirect('/unauthorized')

  return (
    <div>
      <DashboardHeader title="Evaluaciones" subtitle="Gestión de evaluaciones y resultados" role={profile.role} />

      {can(profile.role, 'manage:assessments') && (
        <div className="flex justify-end mb-4">
          <button className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors">
            + Nueva evaluación
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {MOCK_ASSESSMENTS.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-[#222222]">{a.title}</h3>
                <p className="text-sm text-[#5F6368] mb-3">{a.course}</p>
                <div className="flex gap-4 text-xs text-[#5F6368]">
                  <span>📝 {a.questions} preguntas</span>
                  <span>🎯 {a.passing}% para aprobar</span>
                  <span>👥 {a.attempts} intentos</span>
                  <span>⭐ Promedio: {a.avg}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-[#00A9E0] border border-[#00A9E0] px-3 py-1.5 rounded-full hover:bg-[#E8F7FD] transition-colors">
                  Ver resultados
                </button>
                {can(profile.role, 'manage:assessments') && (
                  <button className="text-xs text-[#5F6368] border border-gray-200 px-3 py-1.5 rounded-full hover:bg-[#F5F7FA] transition-colors">
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
