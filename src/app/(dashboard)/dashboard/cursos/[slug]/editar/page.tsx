import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { getCourseBuilderData } from '@/lib/course/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import EditCourseForm from './EditCourseForm'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Editar curso — Plavih' }

export default async function EditCursoPage({ params }: Props) {
  const { slug } = await params
  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') redirect('/dashboard/cursos')

  const course = await getCourseBuilderData(slug, profile)
  if (!course) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <DashboardHeader
        title="Editar curso"
        subtitle={course.title}
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          Modo demo activo — Los cambios no se guardarán.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <EditCourseForm course={course} />
      </div>
    </div>
  )
}
