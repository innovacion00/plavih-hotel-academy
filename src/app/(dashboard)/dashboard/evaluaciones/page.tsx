import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import { getAssessments } from '@/lib/assessments/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const metadata: Metadata = { title: 'Evaluaciones' }

export default async function EvaluacionesPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:assessments')) redirect('/unauthorized')

  const assessments = await getAssessments(profile)
  const canManage = can(profile.role, 'manage:assessments')

  return (
    <div>
      <DashboardHeader title="Evaluaciones" subtitle="Gestión de evaluaciones y resultados" role={profile.role} />

      {canManage && (
        <div className="flex justify-end mb-4">
          <Link
            href="/dashboard/evaluaciones/nueva"
            className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors"
          >
            + Nueva evaluación
          </Link>
        </div>
      )}

      {assessments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="text-4xl mb-3 block">📝</span>
          <p className="text-[#5F6368] font-medium mb-1">No hay evaluaciones todavía</p>
          <p className="text-xs text-[#5F6368] mb-4">Crea la primera evaluación para un curso.</p>
          {canManage && (
            <Link
              href="/dashboard/evaluaciones/nueva"
              className="bg-[#00A9E0] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#007FA8] transition-colors"
            >
              + Nueva evaluación
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assessments.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#222222] truncate">{a.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {a.is_published ? 'Publicada' : 'Borrador'}
                    </span>
                  </div>
                  <p className="text-sm text-[#5F6368] mb-3">
                    {a.course ? a.course.title : 'Sin curso asignado'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-[#5F6368]">
                    <span>📝 {a.question_count} preguntas</span>
                    <span>🎯 {a.passing_score}% para aprobar</span>
                    <span>🔄 {a.max_attempts} intentos máx.</span>
                    {a.time_limit_minutes && <span>⏱ {a.time_limit_minutes} min</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/dashboard/evaluaciones/${a.id}`}
                    className="text-xs text-[#00A9E0] border border-[#00A9E0] px-3 py-1.5 rounded-full hover:bg-[#E8F7FD] transition-colors font-medium"
                  >
                    {canManage ? 'Editar →' : 'Ver →'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
