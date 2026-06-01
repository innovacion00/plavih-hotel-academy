import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { getCourseBuilderData } from '@/lib/course/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import VideoUploadClient from './VideoUploadClient'

type Props = { params: Promise<{ slug: string; lessonId: string }> }

export const metadata: Metadata = { title: 'Subir video — Plavih' }

export default async function VideoUploadPage({ params }: Props) {
  const { slug, lessonId } = await params
  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') redirect('/dashboard/cursos')

  const course = await getCourseBuilderData(slug, profile)
  if (!course) notFound()

  // Find the lesson across all modules
  const lesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === lessonId)
  if (!lesson) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <DashboardHeader
        title={lesson.video ? 'Reemplazar video' : 'Subir video'}
        subtitle={`Lección: ${lesson.title}`}
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          Modo demo activo — El upload de video requiere Supabase Storage configurado.
        </div>
      )}

      {/* Current video status */}
      {lesson.video && (
        <div className="mb-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-2xl">🎬</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#222222]">Video actual</p>
            <p className="text-xs text-[#5F6368] truncate mt-0.5">{lesson.video.storage_path}</p>
            <div className="flex gap-3 mt-1 text-xs text-[#5F6368]">
              {lesson.video.duration_seconds && (
                <span>{Math.round(lesson.video.duration_seconds / 60)} min</span>
              )}
              {lesson.video.size_bytes && (
                <span>{(lesson.video.size_bytes / 1_048_576).toFixed(1)} MB</span>
              )}
              <span className={`font-semibold ${
                lesson.video.processing_status === 'ready' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {lesson.video.processing_status === 'ready' ? 'Listo ✓' : 'Procesando…'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <VideoUploadClient
          lessonId={lessonId}
          courseId={course.id}
          courseSlug={slug}
          hasExistingVideo={!!lesson.video}
          isMock={isMockMode}
        />
      </div>

      <div className="mt-4">
        <Link href={`/dashboard/cursos/${slug}/builder`} className="text-sm text-[#00A9E0] hover:underline">
          ← Volver al builder
        </Link>
      </div>
    </div>
  )
}
