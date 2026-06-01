import { getServerProfile } from '@/lib/auth/session'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Asistente IA — ValerIA' }

export default async function IaPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  return (
    <div>
      <DashboardHeader title="Asistente IA — ValerIA" subtitle="Tu asistente de hotelería con inteligencia artificial" role={profile.role} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[60vh]">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A9E0] rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <p className="font-semibold text-[#222222] text-sm">ValerIA</p>
              <p className="text-xs text-green-600 font-medium">● En línea</p>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 bg-[#00A9E0] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-[#F5F7FA] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#222222]">
                ¡Hola! Soy <strong>ValerIA</strong>, tu asistente de hotelería. Puedo ayudarte con preguntas sobre cursos, hospitalidad, gestión hotelera y operaciones. ¿En qué te puedo ayudar hoy?
              </div>
            </div>

            <div className="flex justify-end gap-3 max-w-xl ml-auto">
              <div className="bg-[#00A9E0] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                ¿Cuáles son las mejores prácticas para el check-in de huéspedes?
              </div>
            </div>

            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 bg-[#00A9E0] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-[#F5F7FA] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#222222]">
                La integración completa con IA estará disponible en la <strong>Fase 2</strong>. Por ahora, te recomiendo revisar el curso de <em>Recepcionistas de Hotel</em> que cubre todas las mejores prácticas de check-in.
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu pregunta sobre hotelería..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
              />
              <button className="bg-[#00A9E0] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#007FA8] transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#005C7A] mb-3">Sobre ValerIA</h3>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              ValerIA es el asistente de inteligencia artificial de Plavih Hotel Academy. Especializado en hotelería, hospitalidad y formación del talento humano del sector turístico.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#005C7A] to-[#00A9E0] rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-2">🚀 Fase 2</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              La IA completa con Claude API llegará en la Fase 2 con conversaciones reales, historial, recomendaciones personalizadas de cursos y análisis de progreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
