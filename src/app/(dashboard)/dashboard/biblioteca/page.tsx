import { getServerProfile } from '@/lib/auth/session'
import { can } from '@/lib/permissions'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Biblioteca de Medios' }

const MOCK_MEDIA = [
  { id: '1', name: 'intro-recepcionista.mp4', type: 'video/mp4', size: '245 MB', uploaded: '2024-03-01', by: 'Rosa Cárdenas' },
  { id: '2', name: 'manual-geh-suites.pdf', type: 'application/pdf', size: '4.2 MB', uploaded: '2024-03-05', by: 'Admin GEH' },
  { id: '3', name: 'presentacion-botones.pptx', type: 'application/pptx', size: '12 MB', uploaded: '2024-03-10', by: 'Juan López' },
  { id: '4', name: 'logo-plavih.png', type: 'image/png', size: '180 KB', uploaded: '2024-02-01', by: 'Admin GEH' },
]

const typeIcons: Record<string, string> = {
  'video/mp4': '🎬',
  'application/pdf': '📄',
  'application/pptx': '📊',
  'image/png': '🖼️',
  'image/jpeg': '🖼️',
}

export default async function BibliotecaPage() {
  const profile = await getServerProfile()
  if (!profile) return null
  if (!can(profile.role, 'view:media_library')) redirect('/unauthorized')

  return (
    <div>
      <DashboardHeader title="Biblioteca de Medios" subtitle="Archivos y recursos multimedia de la plataforma" role={profile.role} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar archivo..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
          {can(profile.role, 'manage:media_library') && (
            <button className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#007FA8] transition-colors">
              + Subir archivo
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Archivo</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Tamaño</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Subido por</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Fecha</th>
              <th className="text-left py-3 px-4 text-[#5F6368] font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MEDIA.map((f) => (
              <tr key={f.id} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>{typeIcons[f.type] ?? '📎'}</span>
                    <span className="font-medium text-[#222222]">{f.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#5F6368]">{f.size}</td>
                <td className="py-3 px-4 text-[#5F6368]">{f.by}</td>
                <td className="py-3 px-4 text-[#5F6368]">{new Date(f.uploaded).toLocaleDateString('es-CO')}</td>
                <td className="py-3 px-4">
                  <button className="text-xs text-[#00A9E0] hover:underline mr-3">Descargar</button>
                  {can(profile.role, 'manage:media_library') && (
                    <button className="text-xs text-red-500 hover:underline">Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
