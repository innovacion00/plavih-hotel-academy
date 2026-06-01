export type UserRole = 'superadmin' | 'admin' | 'instructor' | 'student'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  institution_id: string | null
  phone: string | null
  position: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Institution = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Course = {
  id: string
  institution_id: string | null
  instructor_id: string | null
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  category: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number | null
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type CourseModule = {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export type Lesson = {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: 'video' | 'text' | 'quiz' | 'file'
  content_url: string | null
  duration_minutes: number | null
  order_index: number
  is_free_preview: boolean
  created_at: string
  updated_at: string
}

export type Enrollment = {
  id: string
  student_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  progress_percent: number
  is_active: boolean
}

export type LessonProgress = {
  id: string
  student_id: string
  lesson_id: string
  enrollment_id: string
  is_completed: boolean
  completed_at: string | null
  last_position_seconds: number
  created_at: string
  updated_at: string
}

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
  updated_at: string
}

export type Question = {
  id: string
  assessment_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: Record<string, string> | null
  correct_answer: string
  points: number
  order_index: number
  created_at: string
}

export type Certificate = {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  certificate_code: string
  issued_at: string
  expires_at: string | null
  pdf_url: string | null
}

export type MediaItem = {
  id: string
  institution_id: string | null
  uploaded_by: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  public_url: string | null
  created_at: string
}

export type AiConversation = {
  id: string
  user_id: string
  title: string | null
  context: string | null
  created_at: string
  updated_at: string
}

export type AiMessage = {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  tokens_used: number | null
  created_at: string
}

export type LessonVideo = {
  id: string
  lesson_id: string
  storage_path: string
  public_url: string | null
  duration_seconds: number | null
  resolution: string | null
  size_bytes: number | null
  is_processed: boolean
  created_at: string
  updated_at: string
}

export type VideoProgress = {
  id: string
  student_id: string
  lesson_id: string
  video_id: string
  position_seconds: number
  duration_seconds: number | null
  percent_watched: number
  is_completed: boolean
  completed_at: string | null
  last_watched_at: string
  created_at: string
  updated_at: string
}

export type AuditLog = {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export type DashboardStats = {
  superadmin: {
    institutions: number
    users: number
    courses: number
    activeStudents: number
    enrollmentsThisMonth: number
    certificatesIssued: number
  }
  admin: {
    students: number
    activeCourses: number
    certificates: number
    completionRate: number
  }
  instructor: {
    courses: number
    students: number
    assessments: number
    avgScore: number
  }
  student: {
    enrolledCourses: number
    completedCourses: number
    certificates: number
    progressPercent: number
  }
}
