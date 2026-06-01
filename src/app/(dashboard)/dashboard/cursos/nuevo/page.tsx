import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import CourseForm from './CourseForm'

export const metadata: Metadata = { title: 'Nuevo curso — Plavih' }

export default async function NuevoCursoPage() {
  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') redirect('/dashboard/cursos')

  return (
    <div className="max-w-2xl mx-auto">
      <DashboardHeader
        title="Nuevo curso"
        subtitle="Completa la información básica del curso. Podrás agregar módulos y lecciones después."
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          Modo demo activo — Los cambios no se guardarán en la base de datos.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <CourseForm profile={profile} />
      </div>
    </div>
  )
}
