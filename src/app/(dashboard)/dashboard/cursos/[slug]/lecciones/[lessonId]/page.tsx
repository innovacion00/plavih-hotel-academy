import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { getLessonDetail, getStudentEnrollment } from '@/lib/video/queries'
import { getSignedVideoUrl } from '@/lib/video/actions'
import VideoPlayer from '@/components/video/VideoPlayer'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

type Props = { params: Promise<{ slug: string; lessonId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params
  return { title: `Lección — Plavih` }
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params
  const profile = await getServerProfile()
  if (!profile) return null

  const lesson = await getLessonDetail(lessonId, profile)
  if (!lesson) notFound()

  // Enrollment check for students
  let enrollmentId = 'enroll-mock-001'
  if (!isMockMode && profile.role === 'student') {
    // We need the courseId — derive from the module
    // In real mode, getLessonDetail already verified enrollment (student path)
    // Get enrollment via slug → course
    const supabase = (await import('@/lib/supabase/server')).createClient()
    const { data: course } = await (await supabase)
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (course) {
      const enr = await getStudentEnrollment(course.id, profile.id)
      if (enr) enrollmentId = enr.id
    }
  }

  // Fetch signed URL server-side for real video
  let signedUrl: string | null = null
  if (lesson.video && !isMockMode) {
    const { url } = await getSignedVideoUrl(lesson.video.id)
    signedUrl = url
  }

  const isVideo = lesson.content_type === 'video'
  const isCompleted = lesson.progress?.is_completed ?? false

  return (
    <div className="max-w-4xl mx-auto">
      <DashboardHeader
        title={lesson.title}
        subtitle={lesson.description ?? ''}
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 font-medium">
          Modo demo — El video no está disponible. Configura Supabase Storage para reproducción real.
        </div>
      )}

      {/* Completion badge */}
      {isCompleted && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <p className="text-xs text-green-700 font-medium">Lección completada</p>
        </div>
      )}

      {/* Video player, text content, or placeholder */}
      {isVideo ? (
        <div className="mb-6">
          <VideoPlayer
            videoId={lesson.video?.id ?? 'mock-video'}
            lessonId={lesson.id}
            enrollmentId={enrollmentId}
            signedUrl={signedUrl}
            initialPositionSeconds={lesson.progress?.position_seconds ?? 0}
            durationSeconds={lesson.video?.duration_seconds}
            isMock={isMockMode || !lesson.video}
            title={lesson.title}
          />
        </div>
      ) : lesson.content_type === 'text' && lesson.content ? (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-sm text-[#222222] leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
        </div>
      ) : (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <span className="text-4xl mb-3 block">
            {lesson.content_type === 'quiz' ? '📝' : lesson.content_type === 'text' ? '📄' : '📎'}
          </span>
          <p className="text-[#5F6368] text-sm">
            {lesson.content_type === 'quiz'
              ? 'Este módulo incluye una evaluación. Las evaluaciones estarán disponibles en Fase 1.3.'
              : 'El instructor aún no ha agregado contenido a esta lección.'}
          </p>
        </div>
      )}

      {/* Lesson meta */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="font-semibold text-[#222222] text-sm mb-3">Sobre esta lección</h3>
        <div className="flex flex-wrap gap-4 text-sm text-[#5F6368]">
          {lesson.duration_minutes && (
            <span>⏱ {lesson.duration_minutes} minutos</span>
          )}
          <span>
            {lesson.content_type === 'video' ? '🎬 Video'
              : lesson.content_type === 'quiz' ? '📝 Evaluación'
              : lesson.content_type === 'text' ? '📄 Lectura'
              : '📎 Archivo'}
          </span>
          {lesson.is_free_preview && (
            <span className="text-[#00A9E0] font-medium">Vista previa gratuita</span>
          )}
          {lesson.progress && (
            <span>{lesson.progress.percent_watched}% visto</span>
          )}
        </div>
        {lesson.description && (
          <p className="mt-3 text-sm text-[#5F6368] leading-relaxed">{lesson.description}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Link
          href={`/dashboard/cursos/${slug}`}
          className="text-sm text-[#00A9E0] hover:underline"
        >
          ← Volver al curso
        </Link>
      </div>
    </div>
  )
}
