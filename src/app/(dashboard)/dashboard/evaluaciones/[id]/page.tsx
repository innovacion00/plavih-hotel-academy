import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import { getAssessmentWithQuestions, getAssessmentForExam } from '@/lib/assessments/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import AssessmentDetailClient from './AssessmentDetailClient'
import ExamTaker from './ExamTaker'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Evaluación — Dashboard' }

export default async function AssessmentDetailPage({ params }: Props) {
  const { id } = await params
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'view:assessments')) redirect('/dashboard')

  const isStudent = profile.role === 'student'

  if (isStudent) {
    const assessment = await getAssessmentForExam(id)
    if (!assessment) notFound()

    const totalPoints = assessment.questions.reduce((s, q) => s + q.points, 0)

    return (
      <div className="max-w-3xl mx-auto">
        <DashboardHeader
          title={assessment.title}
          subtitle="Evaluación del curso"
          role={profile.role}
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#00A9E0]">{assessment.question_count}</p>
              <p className="text-xs text-[#5F6368] mt-0.5">Preguntas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#005C7A]">{totalPoints}</p>
              <p className="text-xs text-[#5F6368] mt-0.5">Puntos totales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#005C7A]">{assessment.passing_score}%</p>
              <p className="text-xs text-[#5F6368] mt-0.5">Para aprobar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#005C7A]">{assessment.max_attempts}</p>
              <p className="text-xs text-[#5F6368] mt-0.5">Intentos máx.</p>
            </div>
          </div>
          {assessment.description && (
            <p className="text-sm text-[#5F6368] mt-4 pt-4 border-t border-gray-100">{assessment.description}</p>
          )}
        </div>

        <ExamTaker
          assessmentId={assessment.id}
          questions={assessment.questions}
          passingScore={assessment.passing_score}
          totalPoints={totalPoints}
        />

        <div className="mt-6">
          <Link href="/dashboard/cursos" className="text-sm text-[#00A9E0] hover:underline">
            ← Volver a Cursos
          </Link>
        </div>
      </div>
    )
  }

  const assessment = await getAssessmentWithQuestions(id, profile)
  if (!assessment) notFound()

  const canManage = can(profile.role, 'manage:assessments')
  const totalPoints = assessment.questions.reduce((s, q) => s + q.points, 0)

  return (
    <div className="max-w-3xl mx-auto">
      <DashboardHeader
        title={assessment.title}
        subtitle={assessment.course ? `Curso: ${assessment.course.title}` : 'Sin curso asignado'}
        role={profile.role}
      />

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#00A9E0]">{assessment.question_count}</p>
            <p className="text-xs text-[#5F6368] mt-0.5">Preguntas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#005C7A]">{totalPoints}</p>
            <p className="text-xs text-[#5F6368] mt-0.5">Puntos totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#005C7A]">{assessment.passing_score}%</p>
            <p className="text-xs text-[#5F6368] mt-0.5">Para aprobar</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#005C7A]">{assessment.max_attempts}</p>
            <p className="text-xs text-[#5F6368] mt-0.5">Intentos máx.</p>
          </div>
        </div>
        {assessment.description && (
          <p className="text-sm text-[#5F6368] mt-4 pt-4 border-t border-gray-100">{assessment.description}</p>
        )}
      </div>

      <AssessmentDetailClient
        assessmentId={assessment.id}
        isPublished={assessment.is_published}
        questions={assessment.questions}
        canManage={canManage}
      />

      <div className="mt-6">
        <Link href="/dashboard/evaluaciones" className="text-sm text-[#00A9E0] hover:underline">
          ← Volver a Evaluaciones
        </Link>
      </div>
    </div>
  )
}
