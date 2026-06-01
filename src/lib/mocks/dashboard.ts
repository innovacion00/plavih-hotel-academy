import type { Profile, DashboardStats } from '@/types'

export const MOCK_USER: Profile = {
  id: 'demo-superadmin-001',
  email: 'superadmin@plavih.com',
  full_name: 'Demo Superadmin',
  avatar_url: null,
  role: 'superadmin',
  institution_id: null,
  phone: '+57 300 000 0001',
  position: 'Super Administrador',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const MOCK_USERS: Profile[] = [
  MOCK_USER,
  {
    id: 'demo-admin-001',
    email: 'admin@gehsuites.com',
    full_name: 'Admin GEH Suites',
    avatar_url: null,
    role: 'admin',
    institution_id: 'inst-001',
    phone: '+57 300 000 0002',
    position: 'Administrador',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'demo-instructor-001',
    email: 'rcardenas@gehsuites.com',
    full_name: 'Rosa Cárdenas',
    avatar_url: null,
    role: 'instructor',
    institution_id: 'inst-001',
    phone: '+57 300 000 0003',
    position: 'Especialista en Gestión Hotelera',
    is_active: true,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'demo-student-001',
    email: 'angely.villa@gehsuites.com',
    full_name: 'Angely Carolina Villa Villa',
    avatar_url: null,
    role: 'student',
    institution_id: 'inst-001',
    phone: '+57 300 000 0004',
    position: 'Recepcionista',
    is_active: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
]

export const MOCK_STATS: DashboardStats = {
  superadmin: {
    institutions: 4,
    users: 128,
    courses: 15,
    activeStudents: 89,
    enrollmentsThisMonth: 34,
    certificatesIssued: 67,
  },
  admin: {
    students: 45,
    activeCourses: 8,
    certificates: 23,
    completionRate: 72,
  },
  instructor: {
    courses: 4,
    students: 38,
    assessments: 12,
    avgScore: 84,
  },
  student: {
    enrolledCourses: 3,
    completedCourses: 1,
    certificates: 1,
    progressPercent: 45,
  },
}

export const MOCK_RECENT_ACTIVITY = [
  { id: '1', user: 'Angely Villa', action: 'Completó el curso', target: 'Recepcionista de Hotel', time: 'hace 2 horas', type: 'completion' },
  { id: '2', user: 'Jarsy Barbosa', action: 'Se inscribió en', target: 'ValerIA: Agente Inteligente', time: 'hace 3 horas', type: 'enrollment' },
  { id: '3', user: 'Brenda Roa', action: 'Obtuvo certificado de', target: 'Recepcionista de Hotel', time: 'hace 5 horas', type: 'certificate' },
  { id: '4', user: 'Belcy Pérez', action: 'Completó lección en', target: 'Botones de Hotel', time: 'hace 6 horas', type: 'lesson' },
  { id: '5', user: 'Admin GEH', action: 'Publicó el curso', target: 'Capacidades de Innovación', time: 'ayer', type: 'publish' },
]

export const MOCK_INSTITUTIONS = [
  { id: 'inst-001', name: 'GEH Suites Hotels', slug: 'geh-suites', students: 89, courses: 15, is_active: true },
  { id: 'inst-002', name: 'Hotel Boquilla Suites', slug: 'boquilla-suites', students: 12, courses: 5, is_active: true },
  { id: 'inst-003', name: 'Madisson Inn', slug: 'madisson-inn', students: 8, courses: 4, is_active: true },
  { id: 'inst-004', name: 'Windsor House', slug: 'windsor-house', students: 19, courses: 6, is_active: false },
]
