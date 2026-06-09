'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServerProfile, isMockMode } from '@/lib/auth/session'
import { assertEditAccess } from '@/lib/course/queries'
import { courseSchema, moduleSchema, lessonSchema, videoUploadSchema } from '@/lib/course/schema'
import { ZodError } from 'zod'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSpacesClient } from '@/lib/video/spaces-client'

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

function zodError<T = void>(e: ZodError): ActionResult<T> {
  const first = e.issues[0]
  return { ok: false, error: first?.message ?? 'Datos inválidos.' }
}

// ── Course ────────────────────────────────────────────────────

export async function createCourseAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo — las mutaciones están deshabilitadas.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') {
    return { ok: false, error: 'Sin permisos para crear cursos.' }
  }

  const parsed = courseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return zodError(parsed.error)

  const input = parsed.data
  const supabase = await createClient()

  // Derive slug from title
  const slug =
    input.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') +
    '-' +
    Date.now().toString(36)

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: input.title,
      slug,
      description: input.description || null,
      category: input.category || null,
      level: input.level,
      duration_hours: input.duration_hours ?? null,
      institution_id:
        profile.role === 'admin' ? profile.institution_id
        : input.institution_id || null,
      instructor_id:
        profile.role === 'instructor' ? profile.id
        : input.instructor_id || profile.id,
      is_published: false,
    })
    .select('slug')
    .single()

  if (error || !data) return { ok: false, error: 'No se pudo crear el curso.' }
  redirect(`/dashboard/cursos/${data.slug}/builder`)
}

export async function deleteCourseAction(courseId: string): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'No tienes acceso a este curso.' }

  const { error } = await supabase.from('courses').delete().eq('id', courseId)
  if (error) return { ok: false, error: 'No se pudo eliminar el curso.' }
  return { ok: true }
}

export async function updateCourseAction(
  courseId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const parsed = courseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return zodError(parsed.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'No tienes acceso a este curso.' }

  const input = parsed.data
  const { error } = await supabase
    .from('courses')
    .update({
      title: input.title,
      description: input.description || null,
      category: input.category || null,
      level: input.level,
      duration_hours: input.duration_hours ?? null,
    })
    .eq('id', courseId)

  if (error) return { ok: false, error: 'No se pudo actualizar el curso.' }
  return { ok: true }
}

export async function toggleCoursePublished(courseId: string, publish: boolean): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'No tienes acceso a este curso.' }

  const { error } = await supabase
    .from('courses')
    .update({ is_published: publish })
    .eq('id', courseId)

  if (error) return { ok: false, error: 'No se pudo cambiar el estado.' }
  return { ok: true }
}

// ── Modules ───────────────────────────────────────────────────

export async function createModuleAction(
  courseId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const parsed = moduleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return zodError(parsed.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'No tienes acceso a este curso.' }

  const { data, error } = await supabase
    .from('course_modules')
    .insert({ ...parsed.data, description: parsed.data.description || null, course_id: courseId })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'No se pudo crear el módulo.' }
  return { ok: true, data: { id: data.id } }
}

export async function updateModuleAction(
  moduleId: string,
  courseId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const parsed = moduleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return zodError(parsed.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { error } = await supabase
    .from('course_modules')
    .update({ ...parsed.data, description: parsed.data.description || null })
    .eq('id', moduleId)

  if (error) return { ok: false, error: 'No se pudo actualizar el módulo.' }
  return { ok: true }
}

export async function deleteModuleAction(moduleId: string, courseId: string): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { error } = await supabase.from('course_modules').delete().eq('id', moduleId)
  if (error) return { ok: false, error: 'No se pudo eliminar el módulo.' }
  return { ok: true }
}

// ── Lessons ───────────────────────────────────────────────────

export async function createLessonAction(
  moduleId: string,
  courseId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const parsed = lessonSchema.safeParse({
    ...Object.fromEntries(formData),
    is_free_preview: formData.get('is_free_preview') === 'true',
  })
  if (!parsed.success) return zodError(parsed.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      ...parsed.data,
      description: parsed.data.description || null,
      duration_minutes: parsed.data.duration_minutes ?? null,
      module_id: moduleId,
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'No se pudo crear la lección.' }
  return { ok: true, data: { id: data.id } }
}

export async function updateLessonAction(
  lessonId: string,
  courseId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const parsed = lessonSchema.safeParse({
    ...Object.fromEntries(formData),
    is_free_preview: formData.get('is_free_preview') === 'true',
  })
  if (!parsed.success) return zodError(parsed.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { error } = await supabase
    .from('lessons')
    .update({ ...parsed.data, description: parsed.data.description || null, duration_minutes: parsed.data.duration_minutes ?? null })
    .eq('id', lessonId)

  if (error) return { ok: false, error: 'No se pudo actualizar la lección.' }
  return { ok: true }
}

export async function deleteLessonAction(lessonId: string, courseId: string): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
  if (error) return { ok: false, error: 'No se pudo eliminar la lección.' }
  return { ok: true }
}

// ── Video upload ──────────────────────────────────────────────

export async function getVideoUploadUrl(params: {
  lessonId: string
  courseId: string
  fileName: string
  fileSize: number
  mimeType: string
}): Promise<ActionResult<{ signedUrl: string; storagePath: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo — el upload no está disponible en demo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const validated = videoUploadSchema.safeParse({
    file_name: params.fileName,
    file_size: params.fileSize,
    mime_type: params.mimeType,
  })
  if (!validated.success) return zodError(validated.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(params.courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso a este curso.' }

  const ext = params.fileName.split('.').pop() ?? 'mp4'
  const storagePath = `courses/${params.courseId}/lessons/${params.lessonId}/${Date.now()}.${ext}`

  try {
    const { client, bucket } = getSpacesClient()
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: storagePath,
      ContentType: params.mimeType,
    })
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 15 * 60 })
    return { ok: true, data: { signedUrl, storagePath } }
  } catch {
    return { ok: false, error: 'No se pudo generar la URL de upload.' }
  }
}

export async function confirmVideoUpload(params: {
  lessonId: string
  courseId: string
  storagePath: string
  durationSeconds?: number
  fileSizeBytes: number
  mimeType: string
}): Promise<ActionResult<{ videoId: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(params.courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  // Delete existing video for this lesson (replace flow)
  const { data: existing } = await supabase
    .from('lesson_videos')
    .select('id, storage_path')
    .eq('lesson_id', params.lessonId)
    .single()

  const { client, bucket } = getSpacesClient()

  if (existing) {
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: existing.storage_path }))
    } catch {
      // file may not exist; proceed with DB cleanup
    }
    await supabase.from('lesson_videos').delete().eq('id', existing.id)
  }

  const { data, error } = await supabase
    .from('lesson_videos')
    .insert({
      lesson_id: params.lessonId,
      storage_path: params.storagePath,
      storage_bucket: bucket,
      storage_provider: 'digitalocean',
      duration_seconds: params.durationSeconds ?? null,
      size_bytes: params.fileSizeBytes,
      mime_type: params.mimeType,
      is_processed: true,
      processing_status: 'ready',
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'No se pudo registrar el video.' }
  return { ok: true, data: { videoId: data.id } }
}

export async function deleteLessonVideoAction(lessonId: string, courseId: string): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { data: video } = await supabase
    .from('lesson_videos')
    .select('id, storage_path')
    .eq('lesson_id', lessonId)
    .single()

  if (!video) return { ok: false, error: 'No se encontró el video.' }

  try {
    const { client, bucket } = getSpacesClient()
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: video.storage_path }))
  } catch {
    // log but don't block the DB delete
  }

  await supabase.from('lesson_videos').delete().eq('id', video.id)
  return { ok: true }
}
