import { getServerProfile } from '@/lib/auth/session'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Certificados' }

const MOCK_CERTIFICATES = [
  { id: '1', student: 'Angely Villa', course: 'Recepcionistas de Hotel', code: 'PLV-A1B2C3D4', issued: '2024-03-16', expires: null },
  { id: '2', student: 'Brenda Roa', course: 'Recepcionistas de Hotel', code: 'PLV-E5F6G7H8', issued: '2024-03-21', expires: null },
  { id: '3', student: 'Angely Villa', course: 'Conoce GEH Suites', code: 'PLV-I9J0K1L2', issued: '2024-03-10', expires: null },
]

export default async function CertificadosPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  const isStudent = profile.role === 'student'
  const certificates = isStudent ? MOCK_CERTIFICATES.filter((_, i) => i < 2) : MOCK_CERTIFICATES

  return (
    <div>
      <DashboardHeader
        title="Certificados"
        subtitle={isStudent ? 'Mis certificados obtenidos' : 'Certificados emitidos en la plataforma'}
        role={profile.role}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#E8F7FD] rounded-bl-3xl flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <div className="pr-16">
              <p className="text-[10px] text-[#00A9E0] font-bold uppercase tracking-wider mb-1">Certificado</p>
              {!isStudent && (
                <p className="font-bold text-[#222222] mb-0.5">{cert.student}</p>
              )}
              <p className={`font-${isStudent ? 'bold text-[#222222]' : 'medium text-[#5F6368]'} text-sm mb-3`}>
                {cert.course}
              </p>
              <p className="text-xs text-[#5F6368] font-mono bg-[#F5F7FA] px-2 py-1 rounded-lg inline-block mb-3">
                {cert.code}
              </p>
              <p className="text-xs text-[#5F6368]">
                Emitido: {new Date(cert.issued).toLocaleDateString('es-CO')}
              </p>
            </div>
            <button className="mt-4 w-full text-xs font-semibold text-[#00A9E0] border border-[#00A9E0] py-2 rounded-full hover:bg-[#E8F7FD] transition-colors">
              Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
