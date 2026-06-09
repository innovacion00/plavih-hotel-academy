'use server'

import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

export type Assessment = {
  id: string
  course_id: string
  title: string
  description: string | null
  passing_score: number
  max_attempts: number
  time_limit_minutes: number | null
  is_published: boolean
  created_at: string
  course: { title: string; slug: string } | null
  question_count: number
}

export type Question = {
  id: string
  assessment_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: string[] | null
  correct_answer: string
  points: number
  order_index: number
}

export async function getAssessments(profile: Profile): Promise<Assessment[]> {
  const supabase = await createClient()

  let query = supabase
    .from('assessments')
    .select('id, course_id, title, description, passing_score, max_attempts, time_limit_minutes, is_published, created_at, courses(title, slug)')
    .order('created_at', { ascending: false })

  if (profile.role === 'instructor') {
    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', profile.id)
    const ids = (courses ?? []).map((c) => c.id)
    if (ids.length === 0) return []
    query = query.in('course_id', ids)
  } else if (profile.role === 'admin') {
    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('institution_id', profile.institution_id)
    const ids = (courses ?? []).map((c) => c.id)
    if (ids.length === 0) return []
    query = query.in('course_id', ids)
  }

  const { data } = await query
  if (!data) return []

  const assessmentIds = data.map((a) => a.id)
  const { data: qCounts } = await supabase
    .from('questions')
    .select('assessment_id')
    .in('assessment_id', assessmentIds.length > 0 ? assessmentIds : ['none'])

  const countMap = new Map<string, number>()
  for (const q of qCounts ?? []) {
    countMap.set(q.assessment_id, (countMap.get(q.assessment_id) ?? 0) + 1)
  }

  return data.map((a) => ({
    ...a,
    course: Array.isArray(a.courses) ? a.courses[0] ?? null : (a.courses as { title: string; slug: string } | null),
    question_count: countMap.get(a.id) ?? 0,
  }))
}

export type ExamQuestion = Omit<Question, 'correct_answer'>

export async function getCourseAssessments(courseId: string): Promise<Assessment[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('assessments')
    .select('id, course_id, title, description, passing_score, max_attempts, time_limit_minutes, is_published, created_at, courses(title, slug)')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  if (!data) return []

  const assessmentIds = data.map((a) => a.id)
  const { data: qCounts } = await supabase
    .from('questions')
    .select('assessment_id')
    .in('assessment_id', assessmentIds.length > 0 ? assessmentIds : ['none'])

  const countMap = new Map<string, number>()
  for (const q of qCounts ?? []) {
    countMap.set(q.assessment_id, (countMap.get(q.assessment_id) ?? 0) + 1)
  }

  return data.map((a) => ({
    ...a,
    course: Array.isArray(a.courses) ? a.courses[0] ?? null : (a.courses as { title: string; slug: string } | null),
    question_count: countMap.get(a.id) ?? 0,
  }))
}

export async function getAssessmentForExam(
  assessmentId: string,
): Promise<(Omit<Assessment, 'course'> & { questions: ExamQuestion[] }) | null> {
  const supabase = await createClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, course_id, title, description, passing_score, max_attempts, time_limit_minutes, is_published, created_at')
    .eq('id', assessmentId)
    .eq('is_published', true)
    .single()

  if (!assessment) return null

  // Intencionalmente NO se selecciona correct_answer
  const { data: questions } = await supabase
    .from('questions')
    .select('id, assessment_id, question_text, question_type, options, points, order_index')
    .eq('assessment_id', assessmentId)
    .order('order_index', { ascending: true })

  return {
    ...assessment,
    question_count: (questions ?? []).length,
    questions: (questions ?? []) as ExamQuestion[],
  }
}

export async function getAssessmentWithQuestions(
  assessmentId: string,
  profile: Profile,
): Promise<(Assessment & { questions: Question[] }) | null> {
  const supabase = await createClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, course_id, title, description, passing_score, max_attempts, time_limit_minutes, is_published, created_at, courses(title, slug)')
    .eq('id', assessmentId)
    .single()

  if (!assessment) return null

  const { data: questions } = await supabase
    .from('questions')
    .select('id, assessment_id, question_text, question_type, options, correct_answer, points, order_index')
    .eq('assessment_id', assessmentId)
    .order('order_index', { ascending: true })

  return {
    ...assessment,
    course: Array.isArray(assessment.courses)
      ? assessment.courses[0] ?? null
      : (assessment.courses as { title: string; slug: string } | null),
    question_count: (questions ?? []).length,
    questions: (questions ?? []) as Question[],
  }
}
