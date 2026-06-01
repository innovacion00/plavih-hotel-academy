import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { getCourseBuilderData } from '@/lib/course/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import BuilderClient from './BuilderClient'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Builder — Plavih' }

export default async function BuilderPage({ params }: Props) {
  const { slug } = await params
  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') redirect('/dashboard/cursos')

  const course = await getCourseBuilderData(slug, profile)
  if (!course) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <DashboardHeader
        title={`Builder — ${course.title}`}
        subtitle={`${course.modules.length} módulos · ${course.modules.reduce((s, m) => s + m.lessons.length, 0)} lecciones`}
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          Modo demo activo — La creación de módulos, lecciones y upload de video requiere Supabase configurado.
        </div>
      )}

      {/* Course actions bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            course.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {course.is_published ? 'Publicado' : 'Borrador'}
          </span>
          <span className="text-sm text-[#5F6368]">{course.category ?? 'Sin categoría'}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/cursos/${course.slug}/editar`}
            className="text-xs font-medium text-[#5F6368] hover:text-[#222222] border border-gray-200 px-3 py-1.5 rounded-full transition-colors">
            Editar info
          </Link>
          <Link href={`/dashboard/cursos/${course.slug}`}
            className="text-xs font-medium text-[#00A9E0] hover:text-[#007FA8] border border-[#00A9E0] px-3 py-1.5 rounded-full transition-colors">
            Vista estudiante →
          </Link>
        </div>
      </div>

      <BuilderClient course={course} isMock={isMockMode} />

      <div className="mt-6">
        <Link href="/dashboard/cursos" className="text-sm text-[#00A9E0] hover:underline">
          ← Volver a Cursos
        </Link>
      </div>
    </div>
  )
}
