import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inscripciones' }

const MOCK_ENROLLMENTS = [
  { id: '1', student: 'Angely Villa', course: 'Recepcionistas de Hotel', progress: 100, status: 'Completado', date: '2024-03-15' },
  { id: '2', student: 'Belcy Pérez', course: 'Recepcionistas de Hotel', progress: 65, status: 'En progreso', date: '2024-04-01' },
  { id: '3', student: 'Brenda Roa', course: 'Conoce GEH Suites', progress: 100, status: 'Completado', date: '2024-03-20' },
  { id: '4', student: 'Jarsy Barbosa', course: 'ValerIA: Agente Inteligente', progress: 10, status: 'En progreso', date: '2024-05-10' },
  { id: '5', student: 'Angely Villa', course: 'Botones de Hotel', progress: 0, status: 'Sin iniciar', date: '2024-05-12' },
]

export default async function InscripcionesPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:all_enrollments')) redirect('/unauthorized')

  return (
    <div>
      <DashboardHeader title="Inscripciones" subtitle="Control de inscripciones y progreso de estudiantes" role={profile.role} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3">
          <input
            type="text"
            placeholder="Buscar estudiante o curso..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Estudiante</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Curso</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Progreso</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Estado</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Inscripción</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ENROLLMENTS.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                <td className="py-3 px-4 font-medium text-[#222222]">{e.student}</td>
                <td className="py-3 px-4 text-[#5F6368]">{e.course}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-[#00A9E0] h-1.5 rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                    <span className="text-xs text-[#5F6368]">{e.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    e.status === 'Completado' ? 'bg-green-100 text-green-700' :
                    e.status === 'En progreso' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{e.status}</span>
                </td>
                <td className="py-3 px-4 text-[#5F6368]">{new Date(e.date).toLocaleDateString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
