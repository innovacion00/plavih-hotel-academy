'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getNavItems } from '@/lib/permissions'
import { logoutAction } from '@/lib/auth/actions'
import type { UserRole } from '@/types'

type Props = {
  role: UserRole
  userName: string
  userEmail: string
}

export default function Sidebar({ role, userName, userEmail }: Props) {
  const pathname = usePathname()
  const items = getNavItems(role)

  const roleColors: Record<UserRole, string> = {
    superadmin: 'bg-purple-600',
    admin: 'bg-blue-600',
    instructor: 'bg-teal-600',
    student: 'bg-green-600',
  }

  const roleLabels: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrador',
    instructor: 'Instructor',
    student: 'Estudiante',
  }

  return (
    <aside className="w-64 bg-[#005C7A] min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00A9E0] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🔔</span>
          </div>
          <div className="leading-tight">
            <span className="block text-white font-bold text-base leading-none">Plavih</span>
            <span className="block text-[#27BCEB] text-[9px] font-medium uppercase tracking-widest leading-none">
              Hotel Academy
            </span>
          </div>
        </Link>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${roleColors[role]} flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold text-sm">
              {(userName || userEmail).slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName || 'Usuario'}</p>
            <span className="text-[10px] font-semibold text-[#27BCEB] uppercase tracking-wider">
              {roleLabels[role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#00A9E0] text-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>🌐</span>
          <span>Ver sitio público</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
