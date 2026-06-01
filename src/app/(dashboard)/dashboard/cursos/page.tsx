import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { activeCourses } from '@/lib/data/courses'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const metadata: Metadata = { title: 'Cursos — Dashboard' }

const levelLabel: Record<string, string> = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export default async function DashboardCursosPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  const visibleCourses =
    profile.role === 'student' ? activeCourses.slice(0, 3) : activeCourses

  return (
    <div>
      <DashboardHeader
        title="Cursos"
        subtitle={
          profile.role === 'student'
            ? 'Mis cursos asignados'
            : 'Gestión de cursos'
        }
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Curso</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Categoría</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Nivel</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Duración</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {visibleCourses.map((c) => (
              <tr key={c.slug} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                <td className="py-3 px-4 font-medium text-[#222222]">{c.title}</td>
                <td className="py-3 px-4 text-[#5F6368]">{c.category}</td>
                <td className="py-3 px-4 text-[#5F6368]">
                  {levelLabel[c.level] ?? c.level}
                </td>
                <td className="py-3 px-4 text-[#5F6368]">{c.duration}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <Link href={`/dashboard/cursos/${c.slug}`} className="text-xs font-semibold text-[#00A9E0] hover:underline">
                      {profile.role === 'student' ? 'Ir al curso →' : 'Ver →'}
                    </Link>
                    {profile.role !== 'student' && (
                      <Link href={`/dashboard/cursos/${c.slug}/builder`} className="text-xs font-semibold text-[#5F6368] hover:text-[#222222] hover:underline">
                        Builder →
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
