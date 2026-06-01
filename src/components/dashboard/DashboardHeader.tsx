import { ROLE_LABELS, ROLE_COLORS } from '@/lib/auth/roles'
import type { UserRole } from '@/types'

type Props = {
  title: string
  subtitle?: string
  role: UserRole
}

export default function DashboardHeader({ title, subtitle, role }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">{title}</h1>
        {subtitle && <p className="text-[#5F6368] text-sm mt-0.5">{subtitle}</p>}
      </div>
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${ROLE_COLORS[role]}`}>
        {ROLE_LABELS[role]}
      </span>
    </div>
  )
}
