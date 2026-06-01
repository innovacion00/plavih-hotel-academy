import type { UserRole } from '@/types'

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Super Administrador',
  admin: 'Administrador',
  instructor: 'Instructor',
  student: 'Estudiante',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  instructor: 'bg-teal-100 text-teal-700',
  student: 'bg-green-100 text-green-700',
}

export function isAtLeast(userRole: UserRole, minRole: UserRole): boolean {
  const hierarchy: UserRole[] = ['student', 'instructor', 'admin', 'superadmin']
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(minRole)
}

export function canManageInstitution(role: UserRole): boolean {
  return role === 'superadmin' || role === 'admin'
}

export function canManageCourses(role: UserRole): boolean {
  return role === 'superadmin' || role === 'admin' || role === 'instructor'
}

export function canViewReports(role: UserRole): boolean {
  return role === 'superadmin' || role === 'admin'
}
