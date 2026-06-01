import { getServerProfile } from '@/lib/auth/session'
import { MOCK_USERS } from '@/lib/mocks/dashboard'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/auth/roles'
import { can } from '@/lib/permissions'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Usuarios' }

export default async function UsuariosPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:all_users')) redirect('/unauthorized')

  return (
    <div>
      <DashboardHeader title="Usuarios" subtitle="Gestiona los usuarios de la plataforma" role={profile.role} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
          <button className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors">
            + Invitar usuario
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Nombre</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Correo</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Rol</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Cargo</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                <td className="py-3 px-4 font-medium text-[#222222]">{u.full_name ?? '—'}</td>
                <td className="py-3 px-4 text-[#5F6368]">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#5F6368]">{u.position ?? '—'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
