import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import { createClient } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import NewAssessmentForm from './NewAssessmentForm'

export const metadata: Metadata = { title: 'Nueva Evaluación' }

export default async function NuevaEvaluacionPage() {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'manage:assessments')) redirect('/dashboard/evaluaciones')

  const supabase = await createClient()
  let query = supabase.from('courses').select('id, title, slug').eq('is_published', false).order('title')

  // Also include published courses
  const { data: all } = await supabase
    .from('courses')
    .select('id, title, slug')
    .order('title')

  let courses = all ?? []
  if (profile.role === 'instructor') {
    courses = courses.filter(() => true) // filtered by RLS
    const { data } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('instructor_id', profile.id)
      .order('title')
    courses = data ?? []
  } else if (profile.role === 'admin') {
    const { data } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('institution_id', profile.institution_id)
      .order('title')
    courses = data ?? []
  }

  return (
    <div>
      <DashboardHeader
        title="Nueva Evaluación"
        subtitle="Crea una evaluación para un curso"
        role={profile.role}
      />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <NewAssessmentForm courses={courses} />
      </div>
    </div>
  )
}
