/**
 * Mock data for the course-detail view (dashboard).
 * Mirrors the DB schema shape used by CourseDetail / LessonWithVideo.
 * Only used when NEXT_PUBLIC_USE_MOCKS=true.
 */

export type MockLesson = {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: 'video' | 'text' | 'quiz' | 'file'
  duration_minutes: number | null
  order_index: number
  is_free_preview: boolean
  video: { id: string; storage_path: string; duration_seconds: number | null } | null
  progress: { position_seconds: number; percent_watched: number; is_completed: boolean } | null
}

export type MockModule = {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  lessons: MockLesson[]
}

export type MockCourseDetail = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number | null
  thumbnail_url: string | null
  instructor_id: string | null
  institution_id: string | null
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  modules: MockModule[]
  enrollment: {
    id: string
    progress_percent: number
    enrolled_at: string
    is_active: boolean
  } | null
  total_lessons: number
  completed_lessons: number
}

const DEMO_MODULES: MockModule[] = [
  {
    id: 'mod-001',
    course_id: 'course-001',
    title: 'Módulo 1 — Fundamentos del servicio hotelero',
    description: 'Introducción a los estándares de calidad y cultura de servicio en hotelería.',
    order_index: 0,
    lessons: [
      {
        id: 'lesson-001',
        module_id: 'mod-001',
        title: 'Bienvenida e introducción',
        description: 'Presentación del curso y expectativas del programa.',
        content_type: 'video',
        duration_minutes: 5,
        order_index: 0,
        is_free_preview: true,
        video: { id: 'vid-001', storage_path: 'demo/intro.mp4', duration_seconds: 300 },
        progress: { position_seconds: 290, percent_watched: 96, is_completed: true },
      },
      {
        id: 'lesson-002',
        module_id: 'mod-001',
        title: 'Cultura de servicio cinco estrellas',
        description: 'Los pilares del servicio de excelencia en la industria hotelera.',
        content_type: 'video',
        duration_minutes: 12,
        order_index: 1,
        is_free_preview: false,
        video: { id: 'vid-002', storage_path: 'demo/cultura.mp4', duration_seconds: 720 },
        progress: { position_seconds: 180, percent_watched: 25, is_completed: false },
      },
      {
        id: 'lesson-003',
        module_id: 'mod-001',
        title: 'Protocolos de presentación personal',
        description: 'Normas de imagen y uniformidad en hoteles de lujo.',
        content_type: 'video',
        duration_minutes: 8,
        order_index: 2,
        is_free_preview: false,
        video: { id: 'vid-003', storage_path: 'demo/presentacion.mp4', duration_seconds: 480 },
        progress: null,
      },
    ],
  },
  {
    id: 'mod-002',
    course_id: 'course-001',
    title: 'Módulo 2 — Atención al huésped',
    description: 'Técnicas de comunicación, manejo de situaciones difíciles y experiencia del cliente.',
    order_index: 1,
    lessons: [
      {
        id: 'lesson-004',
        module_id: 'mod-002',
        title: 'Check-in y check-out eficiente',
        description: 'Flujo completo del proceso de llegada y salida del huésped.',
        content_type: 'video',
        duration_minutes: 15,
        order_index: 0,
        is_free_preview: false,
        video: { id: 'vid-004', storage_path: 'demo/checkin.mp4', duration_seconds: 900 },
        progress: null,
      },
      {
        id: 'lesson-005',
        module_id: 'mod-002',
        title: 'Resolución de quejas y conflictos',
        description: 'Cómo convertir una queja en una oportunidad de fidelización.',
        content_type: 'video',
        duration_minutes: 10,
        order_index: 1,
        is_free_preview: false,
        video: { id: 'vid-005', storage_path: 'demo/quejas.mp4', duration_seconds: 600 },
        progress: null,
      },
    ],
  },
  {
    id: 'mod-003',
    course_id: 'course-001',
    title: 'Módulo 3 — Evaluación final',
    description: 'Evaluación de conocimientos y obtención del certificado.',
    order_index: 2,
    lessons: [
      {
        id: 'lesson-006',
        module_id: 'mod-003',
        title: 'Evaluación del módulo',
        description: 'Evaluación de conocimientos del programa.',
        content_type: 'quiz',
        duration_minutes: 20,
        order_index: 0,
        is_free_preview: false,
        video: null,
        progress: null,
      },
    ],
  },
]

export const MOCK_COURSE_DETAIL: MockCourseDetail = {
  id: 'course-001',
  slug: 'recepcionista-hotel',
  title: 'Capacitación para Recepcionistas de Hotel',
  description:
    'Domina los procesos de check-in, check-out, gestión de reservas, atención al huésped y protocolos de servicio de clase mundial.',
  category: 'Operaciones',
  level: 'beginner',
  duration_hours: 8,
  thumbnail_url: null,
  instructor_id: 'demo-instructor-001',
  institution_id: 'inst-001',
  is_published: true,
  is_featured: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  modules: DEMO_MODULES,
  enrollment: {
    id: 'enroll-001',
    progress_percent: 20,
    enrolled_at: '2024-03-01T00:00:00Z',
    is_active: true,
  },
  total_lessons: 6,
  completed_lessons: 1,
}

// Returns mock for any slug in mock mode
export function getMockCourseDetail(slug: string): MockCourseDetail {
  return { ...MOCK_COURSE_DETAIL, slug }
}

export function getMockLesson(lessonId: string): MockLesson | null {
  for (const mod of DEMO_MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonId)
    if (lesson) return lesson
  }
  return DEMO_MODULES[0].lessons[0]  // fallback to first lesson for demo
}
