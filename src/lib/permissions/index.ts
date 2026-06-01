import type { UserRole } from '@/types'

type Permission =
  | 'view:all_institutions'
  | 'manage:institutions'
  | 'view:all_users'
  | 'manage:users'
  | 'view:all_courses'
  | 'manage:all_courses'
  | 'manage:own_courses'
  | 'view:all_enrollments'
  | 'manage:enrollments'
  | 'view:reports'
  | 'view:ai'
  | 'view:media_library'
  | 'manage:media_library'
  | 'view:certificates'
  | 'view:assessments'
  | 'manage:assessments'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    'view:all_institutions',
    'manage:institutions',
    'view:all_users',
    'manage:users',
    'view:all_courses',
    'manage:all_courses',
    'manage:own_courses',
    'view:all_enrollments',
    'manage:enrollments',
    'view:reports',
    'view:ai',
    'view:media_library',
    'manage:media_library',
    'view:certificates',
    'view:assessments',
    'manage:assessments',
  ],
  admin: [
    'view:all_users',
    'manage:users',
    'view:all_courses',
    'manage:all_courses',
    'manage:own_courses',
    'view:all_enrollments',
    'manage:enrollments',
    'view:reports',
    'view:ai',
    'view:media_library',
    'manage:media_library',
    'view:certificates',
    'view:assessments',
    'manage:assessments',
  ],
  instructor: [
    'manage:own_courses',
    'view:all_enrollments',
    'view:ai',
    'view:media_library',
    'manage:media_library',
    'view:assessments',
    'manage:assessments',
  ],
  student: [
    'view:ai',
    'view:certificates',
    'view:assessments',
  ],
}

export function can(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getNavItems(role: UserRole) {
  const all = [
    { href: '/dashboard',                  label: 'Dashboard',     icon: '🏠', roles: ['superadmin', 'admin', 'instructor', 'student'] },
    { href: '/dashboard/instituciones',    label: 'Instituciones', icon: '🏛️', roles: ['superadmin'] },
    { href: '/dashboard/usuarios',         label: 'Usuarios',      icon: '👥', roles: ['superadmin', 'admin'] },
    { href: '/dashboard/cursos',           label: 'Cursos',        icon: '📚', roles: ['superadmin', 'admin', 'instructor', 'student'] },
    { href: '/dashboard/inscripciones',    label: 'Inscripciones', icon: '📋', roles: ['superadmin', 'admin', 'instructor'] },
    { href: '/dashboard/evaluaciones',     label: 'Evaluaciones',  icon: '📝', roles: ['superadmin', 'admin', 'instructor'] },
    { href: '/dashboard/certificados',     label: 'Certificados',  icon: '🎓', roles: ['superadmin', 'admin', 'student'] },
    { href: '/dashboard/biblioteca',       label: 'Biblioteca',    icon: '📁', roles: ['superadmin', 'admin', 'instructor'] },
    { href: '/dashboard/reportes',         label: 'Reportes',      icon: '📊', roles: ['superadmin', 'admin'] },
    { href: '/dashboard/ia',               label: 'Asistente IA',  icon: '🤖', roles: ['superadmin', 'admin', 'instructor', 'student'] },
    { href: '/dashboard/perfil',           label: 'Mi Perfil',     icon: '👤', roles: ['superadmin', 'admin', 'instructor', 'student'] },
  ]

  return all.filter((item) => (item.roles as UserRole[]).includes(role))
}
