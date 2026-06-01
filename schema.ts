import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(120),
  description: z.string().max(2000).optional().or(z.literal('')),
  category: z.string().max(80).optional().or(z.literal('')),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration_hours: z.coerce.number().min(0).max(500).optional(),
  institution_id: z.string().uuid().optional().or(z.literal('')),
  instructor_id: z.string().uuid().optional().or(z.literal('')),
})

export const moduleSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres').max(120),
  description: z.string().max(500).optional().or(z.literal('')),
  order_index: z.coerce.number().int().min(0),
})

export const lessonSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres').max(120),
  description: z.string().max(500).optional().or(z.literal('')),
  content_type: z.enum(['video', 'text', 'quiz', 'file']),
  duration_minutes: z.coerce.number().int().min(0).max(480).optional(),
  order_index: z.coerce.number().int().min(0),
  is_free_preview: z.boolean().default(false),
})

export const videoUploadSchema = z.object({
  file_name: z.string().min(1),
  file_size: z.coerce.number().int().positive().max(524_288_000, 'El archivo supera el límite de 500 MB'),
  mime_type: z.enum(['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'], {
    error: 'Formato no soportado. Usa MP4, WebM o MOV.',
  }),
  duration_seconds: z.coerce.number().int().min(0).optional(),
})

export type CourseInput = z.infer<typeof courseSchema>
export type ModuleInput = z.infer<typeof moduleSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type VideoUploadInput = z.infer<typeof videoUploadSchema>
