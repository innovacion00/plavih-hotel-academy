import { createClient } from '@/lib/supabase/server'
import { isMockMode } from '@/lib/auth/session'
import { getMockCourseDetail } from '@/lib/mocks/courses'
import type { Profile, UserRole } from '@/types'

export type VideoStatus = {
  id: string
  storage_path: string
  processing_status: 'pending' | 'processing' | 'ready' | 'error'
  duration_seconds: number | null
  size_bytes: number | null
  mime_type: string | null
  created_at: string
}

export type BuilderLesson = {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: 'video' | 'text' | 'quiz' | 'file'
  duration_minutes: number | null
  order_index: number
  is_free_preview: boolean
  video: VideoStatus | null
}

export type BuilderModule = {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  lessons: BuilderLesson[]
}

export type BuilderCourse = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number | null
  institution_id: string | null
  instructor_id: string | null
  is_published: boolean
  modules: BuilderModule[]
}

// Verify the requesting profile has edit rights on the course
async function assertEditAccess(
  courseId: string,
  profile: Profile,
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<boolean> {
  if (profile.role === 'superadmin') return true

  const { data: course } = await supabase
    .from('courses')
    .select('instructor_id, institution_id')
    .eq('id', courseId)
    .single()

  if (!course) return false
  if (profile.role === 'admin') return course.institution_id === profile.institution_id
  if (profile.role === 'instructor') return course.instructor_id === profile.id
  return false
}

export { assertEditAccess }

export async function getCourseBuilderData(
  slug: string,
  profile: Profile,
): Promise<BuilderCourse | null> {
  if (isMockMode) {
    const mock = getMockCourseDetail(slug)
    return {
      id: mock.id,
      slug: mock.slug,
      title: mock.title,
      description: mock.description,
      category: mock.category,
      level: mock.level,
      duration_hours: mock.duration_hours,
      institution_id: mock.institution_id,
      instructor_id: mock.instructor_id,
      is_published: mock.is_published,
      modules: mock.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          video: l.video
            ? {
                id: l.video.id,
                storage_path: l.video.storage_path,
                processing_status: 'ready' as const,
                duration_seconds: l.video.duration_seconds,
                size_bytes: null,
                mime_type: 'video/mp4',
                created_at: '2024-01-01T00:00:00Z',
              }
            : null,
        })),
      })),
    }
  }

  const supabase = await createClient()

  // Role-filtered course fetch
  let query = supabase
    .from('courses')
    .select('id, slug, title, description, category, level, duration_hours, institution_id, instructor_id, is_published')
    .eq('slug', slug)

  if (profile.role === 'admin') query = query.eq('institution_id', profile.institution_id)
  if (profile.role === 'instructor') query = query.eq('instructor_id', profile.id)

  const { data: course } = await query.single()
  if (!course) return null

  const { data: modules } = await supabase
    .from('course_modules')
    .select('id, course_id, title, description, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  const moduleIds = (modules ?? []).map((m) => m.id)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, module_id, title, description, content_type, duration_minutes, order_index, is_free_preview')
    .in('module_id', moduleIds.length > 0 ? moduleIds : ['none'])
    .order('order_index', { ascending: true })

  const lessonIds = (lessons ?? []).map((l) => l.id)

  const { data: videos } = await supabase
    .from('lesson_videos')
    .select('id, lesson_id, storage_path, processing_status, duration_seconds, size_bytes, mime_type, created_at')
    .in('lesson_id', lessonIds.length > 0 ? lessonIds : ['none'])

  const videoByLesson = new Map(
    (videos ?? []).map((v) => [v.lesson_id, v as VideoStatus & { lesson_id: string }]),
  )
  const lessonsByModule = new Map<string, BuilderLesson[]>()

  for (const lesson of lessons ?? []) {
    const vid = videoByLesson.get(lesson.id)
    if (!lessonsByModule.has(lesson.module_id)) lessonsByModule.set(lesson.module_id, [])
    lessonsByModule.get(lesson.module_id)!.push({
      ...lesson,
      content_type: lesson.content_type as BuilderLesson['content_type'],
      video: vid
        ? {
            id: vid.id,
            storage_path: vid.storage_path,
            processing_status: (vid.processing_status ?? 'pending') as VideoStatus['processing_status'],
            duration_seconds: vid.duration_seconds,
            size_bytes: vid.size_bytes,
            mime_type: vid.mime_type,
            created_at: vid.created_at,
          }
        : null,
    })
  }

  return {
    ...course,
    level: course.level as BuilderCourse['level'],
    modules: (modules ?? []).map((m) => ({
      ...m,
      lessons: lessonsByModule.get(m.id) ?? [],
    })),
  }
}

export async function getInstructorCourses(profile: Profile) {
  if (isMockMode) {
    const mock = getMockCourseDetail('recepcionista-hotel')
    return [{ id: mock.id, slug: mock.slug, title: mock.title, is_published: mock.is_published, category: mock.category, level: mock.level, duration_hours: mock.duration_hours, created_at: '' }]
  }

  const supabase = await createClient()
  let query = supabase
    .from('courses')
    .select('id, slug, title, is_published, category, level, duration_hours, created_at')
    .order('created_at', { ascending: false })

  if (profile.role === 'admin') query = query.eq('institution_id', profile.institution_id)
  if (profile.role === 'instructor') query = query.eq('instructor_id', profile.id)

  const { data } = await query
  return data ?? []
}
