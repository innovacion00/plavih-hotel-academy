import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce la misión, visión y valores de Plavih Hotel Academy. Una iniciativa del equipo de innovación de GEH Suites.',
}

const values = [
  { icon: '💡', title: 'Innovación continua', description: 'Incorporamos tecnología de vanguardia para transformar la experiencia de aprendizaje en el sector hotelero.' },
  { icon: '🌍', title: 'Accesibilidad universal', description: 'Creemos que la formación de calidad debe estar disponible para todos, sin importar el lugar o el momento.' },
  { icon: '🎯', title: 'Personalización del aprendizaje', description: 'Cada colaborador tiene necesidades únicas. Adaptamos el contenido para maximizar el impacto formativo.' },
]

const milestones = [
  { year: 'Marzo 2023', event: 'Nace Plavih desde el equipo de innovación de GEH Suites Hotels con el objetivo de revolucionar la formación hotelera.' },
  { year: 'Junio 2023', event: 'Lanzamiento del primer curso: Capacitación para Recepcionistas de Hotel. Primera cohorte de colaboradores certificados.' },
  { year: '2024', event: 'Expansión del catálogo de cursos a todas las áreas del hotel: operaciones, housekeeping, alimentos y bebidas, administración.' },
  { year: '2025', event: 'Integración de inteligencia artificial con ValerIA y nuevos módulos de liderazgo e innovación.' },
]

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">¿Quiénes somos?</h1>
          <p className="text-blue-100 max-w-xl text-lg">
            ¡Descubre el futuro de la educación hotelera con Plavih!
          </p>
        </div>
      </div>

      {/* Presentación */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#005C7A] mb-6">Plavih Hotel Academy</h2>
              <p className="text-[#5F6368] leading-relaxed mb-4">
                Plavih Hotel Academy es una plataforma de formación hotelera que fusiona tecnología innovadora con la visión
                de impulsar el turismo mediante educación virtual. Nació en marzo de 2023 desde el equipo de innovación de
                GEH Suites Hotels.
              </p>
              <p className="text-[#5F6368] leading-relaxed mb-4">
                No solo buscamos capacitar, sino formar personas listas para liderar en un mundo hotelero dinámico. Nuestra
                plataforma combina experiencia sectorial, contenidos prácticos y herramientas de inteligencia artificial
                para ofrecer una experiencia de aprendizaje sin precedentes en la industria.
              </p>
              <p className="text-[#5F6368] leading-relaxed">
                Hoy, Plavih es sinónimo de innovación educativa en el sector de la hospitalidad, con cursos para todas las
                áreas del hotel y colaboradores más preparados para brindar experiencias memorables a cada huésped.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#E8F7FD] to-[#F5F7FA] rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-[#00A9E0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔔</span>
              </div>
              <h3 className="text-2xl font-bold text-[#005C7A]">Plavih</h3>
              <p className="text-[#00A9E0] font-medium text-sm uppercase tracking-widest mb-6">Hotel Academy</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-[#005C7A]">15+</p>
                  <p className="text-xs text-[#5F6368]">Cursos activos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#005C7A]">10+</p>
                  <p className="text-xs text-[#5F6368]">Hoteles aliados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#005C7A]">6</p>
                  <p className="text-xs text-[#5F6368]">Expertos docentes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#E8F7FD] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[#005C7A] mb-4">Nuestra Misión</h3>
              <p className="text-[#5F6368] leading-relaxed">
                Capacitar colaboradores de la industria hotelera mediante una plataforma innovadora, con el propósito de
                elevar conocimientos, fortalecer habilidades y mejorar la eficiencia operativa del sector turístico.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#E8F7FD] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔭</span>
              </div>
              <h3 className="text-xl font-bold text-[#005C7A] mb-4">Nuestra Visión</h3>
              <p className="text-[#5F6368] leading-relaxed">
                Transformar la educación hotelera, formar colaboradores altamente capacitados y posicionar la marca como
                sinónimo de innovación educativa dentro del sector de la hospitalidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#005C7A]">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-[#005C7A] text-lg mb-2">{v.title}</h3>
                <p className="text-[#5F6368] text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestra historia */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#005C7A]">Nuestra Historia</h2>
          </div>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="shrink-0 w-28 text-right">
                  <span className="text-sm font-bold text-[#00A9E0]">{m.year}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#00A9E0] mt-0.5" />
                  {i < milestones.length - 1 && <div className="w-0.5 h-full min-h-[40px] bg-[#00A9E0]/30" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-[#222222] leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
