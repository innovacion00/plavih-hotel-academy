import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerProfile } from '@/lib/auth/session'
import { getCourseBuilderData } from '@/lib/course/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import TextContentEditor from './TextContentEditor'

type Props = { params: Promise<{ slug: string; lessonId: string }> }

export const metadata: Metadata = { title: 'Editar texto — Plavih' }

export default async function TextContentPage({ params }: Props) {
  const { slug, lessonId } = await params
  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') redirect('/dashboard/cursos')

  const course = await getCourseBuilderData(slug, profile)
  if (!course) notFound()

  const lesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === lessonId)
  if (!lesson || lesson.content_type !== 'text') notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <DashboardHeader
        title="Editar contenido"
        subtitle={`Lección: ${lesson.title}`}
        role={profile.role}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <TextContentEditor
          lessonId={lessonId}
          courseId={course.id}
          courseSlug={slug}
          initialContent={lesson.content}
        />
      </div>
    </div>
  )
}
