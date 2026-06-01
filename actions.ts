'use server'

import { createClient } from '@/lib/supabase/server'
import { getServerProfile, isMockMode } from '@/lib/auth/session'

const COMPLETION_THRESHOLD = 90  // percent

// ── Signed URL ────────────────────────────────────────────────

export async function getSignedVideoUrl(
  videoId: string,
): Promise<{ url: string | null; error?: string }> {
  if (isMockMode) {
    return { url: null, error: 'mock' }
  }

  const supabase = await createClient()

  const { data: video } = await supabase
    .from('lesson_videos')
    .select('storage_path')
    .eq('id', videoId)
    .single()

  if (!video) return { url: null, error: 'Video no encontrado.' }

  const { data, error } = await supabase.storage
    .from('lesson-videos')
    .createSignedUrl(video.storage_path, 3600)  // 1 hour

  if (error || !data?.signedUrl) {
    return { url: null, error: 'No se pudo generar el enlace de video.' }
  }

  return { url: data.signedUrl }
}

// ── Progress heartbeat ────────────────────────────────────────

export async function saveVideoProgress(params: {
  videoId: string
  lessonId: string
  enrollmentId: string
  positionSeconds: number
  durationSeconds: number
  percentWatched: number
}): Promise<void> {
  if (isMockMode) return  // no-op in demo mode

  const profile = await getServerProfile()
  if (!profile) return

  const isCompleted = params.percentWatched >= COMPLETION_THRESHOLD
  const supabase = await createClient()

  // 1. Upsert video_progress
  await supabase.from('video_progress').upsert(
    {
      student_id: profile.id,
      lesson_id: params.lessonId,
      video_id: params.videoId,
      position_seconds: params.positionSeconds,
      duration_seconds: params.durationSeconds,
      percent_watched: params.percentWatched,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      last_watched_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,video_id' },
  )

  // 2. If video completed, mirror to lesson_progress
  if (isCompleted) {
    await supabase.from('lesson_progress').upsert(
      {
        student_id: profile.id,
        lesson_id: params.lessonId,
        enrollment_id: params.enrollmentId,
        is_completed: true,
        completed_at: new Date().toISOString(),
        last_position_seconds: params.positionSeconds,
      },
      { onConflict: 'student_id,lesson_id' },
    )

    // 3. Recalculate and update enrollment progress_percent
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, course_id')
      .eq('id', params.enrollmentId)
      .single()

    if (enrollment) {
      // Fetch module IDs first, then count lessons
      const { data: moduleRows } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', enrollment.course_id)
      const moduleIds = (moduleRows ?? []).map((m) => m.id)

      const { count: total } = await supabase
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .in('module_id', moduleIds)

      // Count completed lessons for this student
      const { count: completed } = await supabase
        .from('lesson_progress')
        .select('id', { count: 'exact', head: true })
        .eq('enrollment_id', params.enrollmentId)
        .eq('is_completed', true)

      if (total && completed !== null) {
        const percent = Math.round((completed / total) * 100)
        await supabase
          .from('enrollments')
          .update({ progress_percent: percent })
          .eq('id', params.enrollmentId)
      }
    }
  }
}

// ── Enrollment ────────────────────────────────────────────────

export async function createEnrollment(
  courseId: string,
): Promise<{ enrollmentId: string | null; error?: string }> {
  if (isMockMode) {
    return { enrollmentId: 'enroll-mock-001' }
  }

  const profile = await getServerProfile()
  if (!profile) return { enrollmentId: null, error: 'No autenticado.' }
  if (profile.role !== 'student') return { enrollmentId: null, error: 'Solo los estudiantes pueden inscribirse.' }

  const supabase = await createClient()

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id, is_active')
    .eq('course_id', courseId)
    .eq('student_id', profile.id)
    .single()

  if (existing) {
    if (existing.is_active) return { enrollmentId: existing.id }
    // Reactivate
    await supabase.from('enrollments').update({ is_active: true }).eq('id', existing.id)
    return { enrollmentId: existing.id }
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert({ student_id: profile.id, course_id: courseId })
    .select('id')
    .single()

  if (error || !data) return { enrollmentId: null, error: 'No se pudo procesar la inscripción.' }
  return { enrollmentId: data.id }
}
