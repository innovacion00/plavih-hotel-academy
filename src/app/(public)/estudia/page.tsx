import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estudia con Nosotros',
  description: 'Únete a Plavih Hotel Academy. Cursos diseñados para entregar habilidades prácticas y conocimientos en gestión hotelera.',
}

const benefits = [
  { icon: '🎓', title: 'Certificado de finalización', desc: 'Al completar cada curso recibes un certificado que acredita tus nuevas competencias.' },
  { icon: '📱', title: 'Aprende desde cualquier dispositivo', desc: 'Accede desde tu celular, tablet o computador. Siempre que quieras, donde quieras.' },
  { icon: '👨‍🏫', title: 'Expertos del sector hotelero', desc: 'Aprende de profesionales con años de experiencia real en la industria de la hospitalidad.' },
  { icon: '⚡', title: 'Contenido práctico y directo', desc: 'Sin relleno ni teoría innecesaria. Cada lección tiene aplicación directa en tu trabajo diario.' },
  { icon: '🤖', title: 'Inteligencia artificial', desc: 'Tecnología de IA para personalizar tu experiencia de aprendizaje y adaptarla a tus necesidades.' },
  { icon: '🏆', title: 'Avanza a tu propio ritmo', desc: 'No hay presión de tiempo. Completa los cursos cuando puedas y retoma donde lo dejaste.' },
]

export default function EstudiaPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#005C7A] via-[#007FA8] to-[#00A9E0] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Estudia con Nosotros</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Plavih ofrece cursos diseñados para entregarte habilidades prácticas y conocimientos teóricos en gestión
            hotelera y servicio al cliente. Para principiantes y profesionales.
          </p>
          <Link
            href="/acceder"
            className="bg-white text-[#005C7A] font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>

      {/* Beneficios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#005C7A]">¿Por qué elegir Plavih?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <span className="text-3xl mb-3 block">{b.icon}</span>
                <h3 className="font-semibold text-[#005C7A] mb-2">{b.title}</h3>
                <p className="text-[#5F6368] text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <span className="text-4xl mb-4 block">🌱</span>
              <h3 className="text-xl font-bold text-[#005C7A] mb-3">Para principiantes</h3>
              <p className="text-[#5F6368] leading-relaxed mb-4">
                ¿Quieres ingresar al sector hotelero? Plavih te da las bases que necesitas para comenzar con el pie derecho.
                Aprende los fundamentos del servicio, las operaciones y la atención al huésped.
              </p>
              <ul className="space-y-2 text-sm text-[#5F6368]">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Cursos de inducción hotelera
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Formación por cargo operativo
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Contenido práctico desde el día 1
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <span className="text-4xl mb-4 block">🚀</span>
              <h3 className="text-xl font-bold text-[#005C7A] mb-3">Para profesionales</h3>
              <p className="text-[#5F6368] leading-relaxed mb-4">
                ¿Ya trabajas en hotelería? Fortalece tus competencias, aprende sobre IA, liderazgo, revenue management
                y habilidades que te llevarán al siguiente nivel de tu carrera.
              </p>
              <ul className="space-y-2 text-sm text-[#5F6368]">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Liderazgo y gestión avanzada
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Inteligencia artificial aplicada
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Revenue management e innovación
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Contacto */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#005C7A] mb-4">¿Tienes preguntas?</h2>
          <p className="text-[#5F6368] mb-8">
            Escríbenos y un asesor de Plavih te guiará sobre los cursos más adecuados para tu perfil o tu equipo.
          </p>
          <Link
            href="/contacto"
            className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  )
}
