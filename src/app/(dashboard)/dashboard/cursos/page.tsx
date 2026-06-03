import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { getInstructorCourses } from '@/lib/course/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DeleteCourseButton from './DeleteCourseButton'

export const metadata: Metadata = { title: 'Cursos — Dashboard' }

const levelLabel: Record<string, string> = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export default async function DashboardCursosPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  const courses = await getInstructorCourses(profile)

  return (
    <div>
      <DashboardHeader
        title="Cursos"
        subtitle={profile.role === 'student' ? 'Mis cursos asignados' : 'Gestión de cursos'}
        role={profile.role}
      />

      {(profile.role === 'superadmin' || profile.role === 'admin' || profile.role === 'instructor') && (
        <div className="flex justify-end mb-4">
          <Link
            href="/dashboard/cursos/nuevo"
            className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors"
          >
            + Nuevo curso
          </Link>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="text-4xl mb-3 block">📚</span>
          <p className="text-[#5F6368] font-medium mb-1">No hay cursos todavía</p>
          <p className="text-xs text-[#5F6368] mb-4">Crea el primer curso para empezar.</p>
          <Link
            href="/dashboard/cursos/nuevo"
            className="bg-[#00A9E0] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#007FA8] transition-colors"
          >
            + Nuevo curso
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FA]">
              <tr>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Curso</th>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Categoría</th>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Nivel</th>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Duración</th>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.slug} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                  <td className="py-3 px-4 font-medium text-[#222222]">{c.title}</td>
                  <td className="py-3 px-4 text-[#5F6368]">{c.category ?? '—'}</td>
                  <td className="py-3 px-4 text-[#5F6368]">{levelLabel[c.level] ?? c.level}</td>
                  <td className="py-3 px-4 text-[#5F6368]">
                    {c.duration_hours ? `${c.duration_hours}h` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      c.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3 items-center">
                      <Link href={`/dashboard/cursos/${c.slug}`} className="text-xs font-semibold text-[#00A9E0] hover:underline">
                        {profile.role === 'student' ? 'Ir al curso →' : 'Ver →'}
                      </Link>
                      {profile.role !== 'student' && (
                        <Link href={`/dashboard/cursos/${c.slug}/builder`} className="text-xs font-semibold text-[#5F6368] hover:text-[#222222] hover:underline">
                          Builder →
                        </Link>
                      )}
                      {(profile.role === 'superadmin' || profile.role === 'admin' || profile.role === 'instructor') && (
                        <DeleteCourseButton courseId={c.id} title={c.title} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
