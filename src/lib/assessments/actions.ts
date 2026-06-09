'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

const assessmentSchema = z.object({
  course_id:           z.string().uuid('Selecciona un curso válido.'),
  title:               z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description:         z.string().optional(),
  passing_score:       z.coerce.number().min(0).max(100).default(70),
  max_attempts:        z.coerce.number().min(1).default(3),
  time_limit_minutes:  z.coerce.number().min(1).optional().nullable(),
})

const questionSchema = z.object({
  question_text:   z.string().min(5, 'La pregunta es demasiado corta.'),
  question_type:   z.enum(['multiple_choice', 'true_false', 'short_answer']),
  correct_answer:  z.string().min(1, 'Ingresa la respuesta correcta.'),
  points:          z.coerce.number().min(1).default(1),
  order_index:     z.coerce.number().default(0),
  options:         z.string().optional(),
})

export async function createAssessmentAction(
  _prev: ActionResult<{ id: string }>,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'manage:assessments')) {
    return { ok: false, error: 'Sin permisos para crear evaluaciones.' }
  }

  const raw = Object.fromEntries(formData)
  const parsed = assessmentSchema.safeParse({
    ...raw,
    time_limit_minutes: raw.time_limit_minutes === '' ? undefined : raw.time_limit_minutes,
    passing_score: raw.passing_score === '' ? '70' : raw.passing_score,
    max_attempts: raw.max_attempts === '' ? '3' : raw.max_attempts,
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      course_id:          parsed.data.course_id,
      title:              parsed.data.title,
      description:        parsed.data.description || null,
      passing_score:      parsed.data.passing_score,
      max_attempts:       parsed.data.max_attempts,
      time_limit_minutes: parsed.data.time_limit_minutes ?? null,
      is_published:       false,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createAssessment]', error?.message)
    return { ok: false, error: 'No se pudo crear la evaluación.' }
  }

  redirect(`/dashboard/evaluaciones/${data.id}`)
}

export async function addQuestionAction(
  assessmentId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'manage:assessments')) {
    return { ok: false, error: 'Sin permisos.' }
  }

  const raw = {
    ...Object.fromEntries(formData),
    options: formData.get('options') as string | null,
  }

  const parsed = questionSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  let options: string[] | null = null
  if (parsed.data.question_type === 'multiple_choice' && parsed.data.options) {
    options = parsed.data.options.split('\n').map((o) => o.trim()).filter(Boolean)
    if (options.length < 2) return { ok: false, error: 'Agrega al menos 2 opciones.' }
  } else if (parsed.data.question_type === 'true_false') {
    options = ['Verdadero', 'Falso']
  }

  const supabase = await createClient()
  const { error } = await supabase.from('questions').insert({
    assessment_id:  assessmentId,
    question_text:  parsed.data.question_text,
    question_type:  parsed.data.question_type,
    options:        options,
    correct_answer: parsed.data.correct_answer,
    points:         parsed.data.points,
    order_index:    parsed.data.order_index,
  })

  if (error) {
    console.error('[addQuestion]', error?.message)
    return { ok: false, error: 'No se pudo agregar la pregunta.' }
  }

  return { ok: true }
}

export async function deleteQuestionAction(questionId: string): Promise<ActionResult> {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'manage:assessments')) {
    return { ok: false, error: 'Sin permisos.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  if (error) return { ok: false, error: 'No se pudo eliminar la pregunta.' }
  return { ok: true }
}

export async function submitExamAction(
  assessmentId: string,
  answers: Record<string, string>,
): Promise<ActionResult<{ score: number; passed: boolean; earned_points: number; total_points: number }>> {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'view:assessments')) {
    return { ok: false, error: 'Sin permisos.' }
  }

  const supabase = await createClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('passing_score, is_published')
    .eq('id', assessmentId)
    .single()

  if (!assessment || !assessment.is_published) {
    return { ok: false, error: 'Evaluación no disponible.' }
  }

  const { data: questions } = await supabase
    .from('questions')
    .select('id, correct_answer, points')
    .eq('assessment_id', assessmentId)

  if (!questions) return { ok: false, error: 'No se pudo cargar la evaluación.' }

  let earned = 0
  const total = questions.reduce((s, q) => s + q.points, 0)

  for (const q of questions) {
    const submitted = (answers[q.id] ?? '').trim().toLowerCase()
    const correct = q.correct_answer.trim().toLowerCase()
    if (submitted && submitted === correct) {
      earned += q.points
    }
  }

  const score = total > 0 ? Math.round((earned / total) * 100) : 0
  const passed = score >= assessment.passing_score

  return { ok: true, data: { score, passed, earned_points: earned, total_points: total } }
}

export async function toggleAssessmentPublished(
  assessmentId: string,
  publish: boolean,
): Promise<ActionResult> {
  const profile = await getServerProfile()
  if (!profile || !can(profile.role, 'manage:assessments')) {
    return { ok: false, error: 'Sin permisos.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('assessments')
    .update({ is_published: publish })
    .eq('id', assessmentId)

  if (error) return { ok: false, error: 'No se pudo cambiar el estado.' }
  return { ok: true }
}
