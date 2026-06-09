import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { getCourseDetail } from '@/lib/video/queries'
import { getCourseAssessments } from '@/lib/assessments/queries'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import VideoProgressBar from '@/components/video/VideoProgressBar'
import EnrollButton from './EnrollButton'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `${slug.replace(/-/g, ' ')} — Cursos` }
}

const levelLabel = { beginner: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado' } as const
const contentTypeIcon = { video: '🎬', text: '📄', quiz: '📝', file: '📎' } as const

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const profile = await getServerProfile()
  if (!profile) return null

  const course = await getCourseDetail(slug, profile)
  if (!course) notFound()

  const isStudent = profile.role === 'student'
  const isEnrolled = !!course.enrollment?.is_active
  const progressPercent = course.enrollment?.progress_percent ?? 0

  const assessments = (!isStudent || isEnrolled) && !isMockMode
    ? await getCourseAssessments(course.id)
    : []

  return (
    <div className="max-w-4xl mx-auto">
      <DashboardHeader
        title={course.title}
        subtitle={
          isStudent
            ? isEnrolled ? `Progreso: ${progressPercent}%` : 'No estás inscrito en este curso'
            : `${course.total_lessons} lecciones · ${course.modules.length} módulos`
        }
        role={profile.role}
      />

      {isMockMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 font-medium">
          Modo demo — Contenido de ejemplo. Los videos no están disponibles en este modo.
        </div>
      )}

      {/* Course header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Thumbnail placeholder */}
          <div className="w-full sm:w-48 h-28 bg-gradient-to-br from-[#00A9E0] to-[#005C7A] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-4xl">🎓</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-medium px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                {course.category ?? 'General'}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {levelLabel[course.level]}
              </span>
              {course.duration_hours && (
                <span className="text-xs font-medium px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {course.duration_hours}h
                </span>
              )}
            </div>

            <p className="text-sm text-[#5F6368] mb-4 line-clamp-2">{course.description}</p>

            {/* Enrollment / progress */}
            {isStudent ? (
              isEnrolled ? (
                <div className="space-y-2">
                  <VideoProgressBar percent={progressPercent} />
                  <p className="text-xs text-[#5F6368]">
                    {course.completed_lessons} de {course.total_lessons} lecciones completadas
                  </p>
                </div>
              ) : (
                <EnrollButton courseId={course.id} slug={slug} />
              )
            ) : (
              <div className="text-sm text-[#5F6368]">
                <span className="font-medium text-[#222222]">{course.total_lessons}</span> lecciones ·{' '}
                <span className="font-medium text-[#222222]">{course.completed_lessons}</span> completadas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modules and lessons */}
      {course.modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-[#5F6368] font-medium">Este curso no tiene contenido publicado todavía.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((mod, modIdx) => (
            <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Module header */}
              <div className="px-5 py-4 bg-[#F5F7FA] border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-[#00A9E0] text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                    {modIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#222222] text-sm">{mod.title}</h3>
                    {mod.description && (
                      <p className="text-xs text-[#5F6368] mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lessons list */}
              {mod.lessons.length === 0 ? (
                <p className="px-5 py-4 text-sm text-[#5F6368]">Sin lecciones en este módulo.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isCompleted = lesson.progress?.is_completed
                    const hasProgress = (lesson.progress?.percent_watched ?? 0) > 0 && !isCompleted
                    const canAccess =
                      !isStudent || isEnrolled || lesson.is_free_preview

                    return (
                      <li key={lesson.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F5F7FA] transition-colors">
                        {/* Status icon */}
                        <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                          {isCompleted ? (
                            <span className="text-green-500 text-base">✓</span>
                          ) : hasProgress ? (
                            <span className="text-[#00A9E0] text-base">▶</span>
                          ) : (
                            <span className="text-gray-300 text-sm">{lessonIdx + 1}</span>
                          )}
                        </div>

                        {/* Content type icon */}
                        <span className="text-sm shrink-0">{contentTypeIcon[lesson.content_type]}</span>

                        {/* Lesson info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isCompleted ? 'text-green-700' : 'text-[#222222]'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.duration_minutes && (
                              <span className="text-xs text-[#5F6368]">{lesson.duration_minutes} min</span>
                            )}
                            {lesson.is_free_preview && (
                              <span className="text-xs font-medium text-[#00A9E0]">Vista previa</span>
                            )}
                            {hasProgress && lesson.progress && (
                              <span className="text-xs text-[#5F6368]">{lesson.progress.percent_watched}% visto</span>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                          {canAccess && (lesson.content_type === 'video' || lesson.content_type === 'text') ? (
                            <Link
                              href={`/dashboard/cursos/${slug}/lecciones/${lesson.id}`}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                isCompleted
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'bg-[#00A9E0] text-white hover:bg-[#007FA8]'
                              }`}
                            >
                              {isCompleted ? 'Repasar' : hasProgress ? 'Continuar' : lesson.content_type === 'text' ? 'Leer' : 'Ver'}
                            </Link>
                          ) : canAccess ? (
                            <span className="text-xs text-[#5F6368] font-medium">Próximamente</span>
                          ) : (
                            <span className="text-xs text-gray-400">🔒</span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assessments */}
      {assessments.length > 0 && (
        <div className="mt-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#222222] px-1">Evaluaciones del curso</h2>
          {assessments.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#222222] truncate">{a.title}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#5F6368]">
                  <span>📝 {a.question_count} preguntas</span>
                  <span>🎯 {a.passing_score}% para aprobar</span>
                  <span>🔄 {a.max_attempts} intentos máx.</span>
                  {a.time_limit_minutes && <span>⏱ {a.time_limit_minutes} min</span>}
                </div>
                {a.description && (
                  <p className="text-xs text-[#5F6368] mt-1 line-clamp-1">{a.description}</p>
                )}
              </div>
              <Link
                href={`/dashboard/evaluaciones/${a.id}`}
                className="shrink-0 bg-[#00A9E0] hover:bg-[#007FA8] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                {isStudent ? 'Tomar evaluación →' : 'Ver →'}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Back link */}
      <div className="mt-6">
        <Link href="/dashboard/cursos" className="text-sm text-[#00A9E0] hover:underline">
          ← Volver a Cursos
        </Link>
      </div>
    </div>
  )
}
