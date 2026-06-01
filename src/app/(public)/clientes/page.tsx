import { hotels } from '@/lib/data/partners'
import { testimonials } from '@/lib/data/testimonials'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuestros Clientes',
  description: 'La experiencia de GEH Suites Hotels con Plavih Hotel Academy. Hoteles que ya forman a su equipo con nosotros.',
}

export default function ClientesPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Nuestros Clientes</h1>
          <p className="text-blue-100 max-w-xl">
            La Experiencia de GEH Suites Hotels con Plavih
          </p>
        </div>
      </div>

      {/* GEH Suites destacado */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#E8F7FD] to-[#F5F7FA] rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Cliente Principal
                </span>
                <h2 className="text-3xl font-bold text-[#005C7A] mb-4">GEH Suites Hotels</h2>
                <p className="text-[#5F6368] leading-relaxed mb-4">
                  GEH Suites es el cliente fundador y principal aliado de Plavih. Fue desde su equipo de innovación que
                  nació la idea de crear una plataforma de formación hotelera virtual, moderna y especializada.
                </p>
                <p className="text-[#5F6368] leading-relaxed mb-4">
                  Plavih se presenta como un socio de aprendizaje que permite fortalecer las capacidades del equipo,
                  mejorar habilidades de servicio, facilitar la formación flexible y contribuir a una mejor experiencia del huésped.
                </p>
                <p className="text-[#5F6368] leading-relaxed">
                  Hoy, todos los hoteles de la marca GEH Suites capacitan a sus colaboradores a través de Plavih,
                  logrando equipos más preparados y estándares de servicio más elevados.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Colaboradores formados', value: '200+' },
                  { label: 'Cursos completados', value: '1,500+' },
                  { label: 'Hoteles de la red', value: '10' },
                  { label: 'Satisfacción promedio', value: '4.8/5' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                    <p className="text-3xl font-bold text-[#00A9E0]">{stat.value}</p>
                    <p className="text-xs text-[#5F6368] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoteles de la red */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#005C7A]">Hoteles de la red GEH Suites</h2>
            <p className="text-[#5F6368] mt-2">Todas estas marcas forman a su equipo con Plavih</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.name} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 rounded-full ${hotel.color} flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-sm">{hotel.initials.slice(0, 2)}</span>
                </div>
                <p className="text-xs font-medium text-[#222222] leading-tight">{hotel.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#005C7A]">Testimonios de nuestros colaboradores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#F5F7FA] rounded-2xl p-6 border border-gray-100">
                <p className="text-[#5F6368] text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#222222] text-sm">{t.name}</p>
                    <p className="text-[#5F6368] text-xs">{t.role} · {t.hotel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
