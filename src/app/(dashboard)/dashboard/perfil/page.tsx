import { getServerProfile } from '@/lib/auth/session'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/auth/roles'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi Perfil' }

export default async function PerfilPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  const fields = [
    { label: 'Nombre completo', value: profile.full_name ?? '—' },
    { label: 'Correo electrónico', value: profile.email },
    { label: 'Teléfono', value: profile.phone ?? '—' },
    { label: 'Cargo', value: profile.position ?? '—' },
  ]

  return (
    <div>
      <DashboardHeader title="Mi Perfil" role={profile.role} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar y rol */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#00A9E0] flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white font-bold">
              {(profile.full_name ?? profile.email).slice(0, 1).toUpperCase()}
            </span>
          </div>
          <h2 className="font-bold text-[#222222] text-lg">{profile.full_name ?? 'Sin nombre'}</h2>
          <p className="text-[#5F6368] text-sm mb-3">{profile.email}</p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROLE_COLORS[profile.role]}`}>
            {ROLE_LABELS[profile.role]}
          </span>
          <div className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${profile.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${profile.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
            {profile.is_active ? 'Activo' : 'Inactivo'}
          </div>
        </div>

        {/* Datos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-[#005C7A] mb-5">Información personal</h3>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.label} className="grid grid-cols-3 gap-3 items-center">
                <label className="text-sm font-medium text-[#5F6368] col-span-1">{f.label}</label>
                <div className="col-span-2">
                  <input
                    type="text"
                    defaultValue={f.value}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button className="bg-[#00A9E0] hover:bg-[#007FA8] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
              Guardar cambios
            </button>
            <button className="border border-gray-200 text-[#5F6368] text-sm font-medium px-5 py-2 rounded-full hover:bg-[#F5F7FA] transition-colors">
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
