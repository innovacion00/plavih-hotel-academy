import { createClient } from '@/lib/supabase/server'
import { isMockMode } from '@/lib/auth/session'
import { getMockCourseDetail, getMockLesson } from '@/lib/mocks/courses'
import type { Profile } from '@/types'

export type LessonVideo = {
  id: string
  storage_path: string
  duration_seconds: number | null
}

export type LessonProgress = {
  position_seconds: number
  percent_watched: number
  is_completed: boolean
}

export type LessonWithVideo = {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: 'video' | 'text' | 'quiz' | 'file'
  content: string | null
  duration_minutes: number | null
  order_index: number
  is_free_preview: boolean
  video: LessonVideo | null
  progress: LessonProgress | null
}

export type ModuleWithLessons = {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  lessons: LessonWithVideo[]
}

export type CourseDetail = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number | null
  thumbnail_url: string | null
  instructor_id: string | null
  is_published: boolean
  modules: ModuleWithLessons[]
  enrollment: { id: string; progress_percent: number; enrolled_at: string; is_active: boolean } | null
  total_lessons: number
  completed_lessons: number
}

// ── Main queries ──────────────────────────────────────────────

export async function getCourseDetail(
  slug: string,
  profile: Profile,
): Promise<CourseDetail | null> {
  if (isMockMode) {
    const mock = getMockCourseDetail(slug)
    return {
      ...mock,
      modules: mock.modules as ModuleWithLessons[],
    }
  }

  const supabase = await createClient()

  // 1. Fetch course — students only see published; editors see all
  let courseQuery = supabase
    .from('courses')
    .select('id, slug, title, description, category, level, duration_hours, thumbnail_url, instructor_id, institution_id, is_published')
    .eq('slug', slug)

  if (profile.role === 'student') courseQuery = courseQuery.eq('is_published', true)
  if (profile.role === 'admin') courseQuery = courseQuery.eq('institution_id', profile.institution_id)
  if (profile.role === 'instructor') courseQuery = courseQuery.eq('instructor_id', profile.id)

  const { data: course, error: courseError } = await courseQuery.single()
  if (courseError || !course) return null

  // 2. Fetch enrollment (students only)
  let enrollment: CourseDetail['enrollment'] = null
  if (profile.role === 'student') {
    const { data: enr } = await supabase
      .from('enrollments')
      .select('id, progress_percent, enrolled_at, is_active')
      .eq('course_id', course.id)
      .eq('student_id', profile.id)
      .single()
    if (enr?.is_active) enrollment = enr  // show course even if not enrolled (so they can enroll)
    enrollment = enr
  }

  // 3. Fetch modules
  const { data: modules, error: modError } = await supabase
    .from('course_modules')
    .select('id, course_id, title, description, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })
  if (modError || !modules) return null

  // 4. Fetch lessons + videos + progress for each module
  const moduleIds = modules.map((m) => m.id)
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, module_id, title, description, content_type, content, duration_minutes, order_index, is_free_preview')
    .in('module_id', moduleIds)
    .order('order_index', { ascending: true })

  const lessonIds = (lessons ?? []).map((l) => l.id)

  const { data: videos } = await supabase
    .from('lesson_videos')
    .select('id, lesson_id, storage_path, duration_seconds')
    .in('lesson_id', lessonIds)

  const { data: progressRows } = await supabase
    .from('video_progress')
    .select('video_id, position_seconds, percent_watched, is_completed')
    .eq('student_id', profile.id)
    .in('video_id', (videos ?? []).map((v) => v.id))

  const videoByLesson = new Map((videos ?? []).map((v) => [v.lesson_id, v]))
  const progressByVideo = new Map((progressRows ?? []).map((p) => [p.video_id, p]))

  const lessonsByModule = new Map<string, LessonWithVideo[]>()
  for (const lesson of lessons ?? []) {
    const vid = videoByLesson.get(lesson.id) ?? null
    const prog = vid ? (progressByVideo.get(vid.id) ?? null) : null

    if (!lessonsByModule.has(lesson.module_id)) lessonsByModule.set(lesson.module_id, [])
    lessonsByModule.get(lesson.module_id)!.push({
      ...lesson,
      content: lesson.content ?? null,
      video: vid ? { id: vid.id, storage_path: vid.storage_path, duration_seconds: vid.duration_seconds } : null,
      progress: prog ? { position_seconds: prog.position_seconds, percent_watched: prog.percent_watched, is_completed: prog.is_completed } : null,
    })
  }

  const modulesWithLessons: ModuleWithLessons[] = modules.map((m) => ({
    ...m,
    lessons: lessonsByModule.get(m.id) ?? [],
  }))

  const allLessons = modulesWithLessons.flatMap((m) => m.lessons)
  const completedLessons = allLessons.filter((l) => l.progress?.is_completed).length

  return {
    ...course,
    level: course.level as CourseDetail['level'],
    modules: modulesWithLessons,
    enrollment,
    total_lessons: allLessons.length,
    completed_lessons: completedLessons,
  }
}

export async function getLessonDetail(
  lessonId: string,
  profile: Profile,
): Promise<LessonWithVideo | null> {
  if (isMockMode) {
    const mock = getMockLesson(lessonId)
    return mock as LessonWithVideo | null
  }

  const supabase = await createClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, module_id, title, description, content_type, content, duration_minutes, order_index, is_free_preview')
    .eq('id', lessonId)
    .single()
  if (!lesson) return null

  const { data: video } = await supabase
    .from('lesson_videos')
    .select('id, storage_path, duration_seconds')
    .eq('lesson_id', lessonId)
    .single()

  let progress: LessonProgress | null = null
  if (video && profile.role === 'student') {
    const { data: prog } = await supabase
      .from('video_progress')
      .select('position_seconds, percent_watched, is_completed')
      .eq('student_id', profile.id)
      .eq('video_id', video.id)
      .single()
    if (prog) progress = prog
  }

  return {
    ...lesson,
    content: lesson.content ?? null,
    video: video ? { id: video.id, storage_path: video.storage_path, duration_seconds: video.duration_seconds } : null,
    progress,
  }
}

export async function getStudentEnrollment(courseId: string, studentId: string) {
  if (isMockMode) {
    return { id: 'enroll-001', progress_percent: 20, enrolled_at: '2024-03-01T00:00:00Z', is_active: true }
  }
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select('id, progress_percent, enrolled_at, is_active')
    .eq('course_id', courseId)
    .eq('student_id', studentId)
    .single()
  return data
}
