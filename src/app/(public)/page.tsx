import Link from 'next/link'
import { featuredCourses, upcomingCourses } from '@/lib/data/courses'
import { teachers } from '@/lib/data/teachers'
import { testimonials } from '@/lib/data/testimonials'
import { hotels, partners } from '@/lib/data/partners'
import CourseCard from '@/components/courses/CourseCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Plavih Hotel Academy — Plataforma de videos hoteleros. Capacita tu equipo y eleva los estándares de servicio en la industria turística.',
}

const learningTopics = [
  {
    icon: '⭐',
    title: 'Servicio al Cliente de Clase Mundial',
    description:
      'Herramientas para brindar un servicio excepcional, desde la bienvenida hasta la despedida del huésped.',
  },
  {
    icon: '🏨',
    title: 'Gestión Hotelera Efectiva',
    description:
      'Habilidades para liderar y gestionar hoteles, equipos de trabajo y procesos operativos con eficiencia.',
  },
  {
    icon: '🍳',
    title: 'Creatividad en la Cocina',
    description:
      'Contenidos de cocina, recetas, combinaciones de sabores y presentación para el área de alimentos y bebidas.',
  },
  {
    icon: '💬',
    title: 'Comunicación Asertiva',
    description:
      'Habilidades de comunicación clara, respetuosa y efectiva con huéspedes, compañeros y líderes.',
  },
  {
    icon: '🚀',
    title: 'Liderazgo Inspirador',
    description:
      'Formación para fortalecer habilidades de liderazgo, motivación y dirección de equipos hoteleros.',
  },
  {
    icon: '🔄',
    title: 'Adaptabilidad y Resiliencia',
    description:
      'Capacidad de adaptarse a cambios y mantener una actitud positiva frente a los retos del sector.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#005C7A] via-[#007FA8] to-[#00A9E0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              IA + Educación = Plavih
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Plavih Hotel Academy,{' '}
              <span className="text-[#27BCEB]">plataforma de videos hoteleros</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
              Nuestro objetivo es mejorar la calidad del servicio en el sector hotelero y turístico,
              capacitando a los profesionales y aspirantes a través de una experiencia de aprendizaje innovadora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cursos"
                className="bg-white text-[#005C7A] font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors text-center"
              >
                Ver todos los cursos
              </Link>
              <Link
                href="/estudia"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-center"
              >
                Estudia con nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banners / Propuesta de valor ── */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-[#E8F7FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="font-bold text-[#005C7A] text-lg mb-2">Conoce nuestro curso de recepcionista</h3>
              <p className="text-[#5F6368] text-sm mb-4">
                El más completo del sector. Aprende check-in, check-out, reservas y servicio al huésped.
              </p>
              <Link href="/cursos/recepcionista-hotel" className="text-[#00A9E0] font-semibold text-sm hover:underline">
                Ver curso →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#00A9E0] to-[#007FA8] rounded-2xl p-6 shadow-sm text-center text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Aprende y alcanza tus sueños</h3>
              <p className="text-blue-100 text-sm mb-4">
                La educación virtual puede convertirse en una herramienta para tu crecimiento profesional.
              </p>
              <Link
                href="/cursos"
                className="bg-white text-[#005C7A] font-semibold text-sm px-4 py-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                Explorar cursos
              </Link>
            </div>

            <div className="bg-[#005C7A] rounded-2xl p-6 shadow-sm text-center text-white">
              <div className="w-12 h-12 bg-[#00A9E0]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">IA + Educación = Plavih</h3>
              <p className="text-blue-200 text-sm mb-4">
                Integramos inteligencia artificial para personalizar tu aprendizaje y optimizar resultados.
              </p>
              <Link href="/cursos/valeria-agente-reservas" className="text-[#27BCEB] font-semibold text-sm hover:underline">
                Conoce ValerIA →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Propuesta de valor ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Acceso Flexible', desc: 'Aprende desde cualquier lugar y en cualquier momento. Avanza a tu propio ritmo y concilia formación con trabajo.' },
              { icon: '👥', title: 'Comunidad en Línea', desc: 'Sé parte de una comunidad de profesionales hoteleros. Colabora, comparte experiencias y fortalece estándares juntos.' },
              { icon: '🎓', title: 'Contenido Especializado', desc: 'Cursos 100% enfocados en hotelería, diseñados por expertos con experiencia real en la operación diaria.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-[#E8F7FD] rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-[#005C7A] text-lg mb-2">{item.title}</h3>
                <p className="text-[#5F6368] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿Qué aprenderás? ── */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#005C7A] mb-4">¿Qué aprenderás con Plavih?</h2>
            <p className="text-[#5F6368] max-w-2xl mx-auto">
              Competencias prácticas diseñadas para elevar tu desempeño en la industria hotelera y turística.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningTopics.map((topic) => (
              <div key={topic.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <span className="text-3xl mb-3 block">{topic.icon}</span>
                <h3 className="font-semibold text-[#005C7A] mb-2">{topic.title}</h3>
                <p className="text-[#5F6368] text-sm leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cursos Destacados ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#005C7A]">Cursos Destacados</h2>
              <p className="text-[#5F6368] mt-1">Los más populares entre nuestros colaboradores</p>
            </div>
            <Link href="/cursos" className="hidden sm:block text-[#00A9E0] font-semibold text-sm hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Próximos Cursos ── */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#005C7A]">Próximos Cursos</h2>
            <p className="text-[#5F6368] mt-2">Contenidos que estarán disponibles muy pronto</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingCourses.map((course) => (
              <CourseCard key={course.slug} course={course} showUpcomingBadge />
            ))}
          </div>
        </div>
      </section>

      {/* ── Nuestros Profesores ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#005C7A] mb-2">Nuestros Profesores</h2>
            <p className="text-[#5F6368] max-w-xl mx-auto">
              Continuamos sirviendo con nuestro distinguido personal docente. Expertos con experiencia real en la industria hotelera.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-full ${teacher.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-sm">{teacher.initials}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#222222]">{teacher.name}</h3>
                  <p className="text-[#00A9E0] text-xs font-medium mb-1">{teacher.role}</p>
                  <p className="text-[#5F6368] text-xs leading-relaxed">{teacher.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="bg-gradient-to-br from-[#005C7A] to-[#007FA8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Lo que dicen nuestros colaboradores</h2>
            <p className="text-blue-200">Experiencias reales del equipo de GEH Suites Hotels</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <p className="text-blue-100 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-blue-200 text-xs">{t.role} · {t.hotel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hoteles que confían en Plavih ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#005C7A] mb-2">Empresas que ya confían en nosotros</h2>
            <p className="text-[#5F6368] text-sm">Hoteles y marcas de GEH Suites Hotels que forman a su equipo con Plavih</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.name} className="flex items-center gap-2 bg-[#F5F7FA] rounded-full px-4 py-2 border border-gray-200">
                <div className={`w-7 h-7 rounded-full ${hotel.color} flex items-center justify-center`}>
                  <span className="text-white text-[10px] font-bold">{hotel.initials.slice(0, 2)}</span>
                </div>
                <span className="text-sm font-medium text-[#222222]">{hotel.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="bg-[#F5F7FA] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-[#5F6368] uppercase tracking-wider mb-8">
            Nuestros Partners
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 border border-gray-200 shadow-sm">
                <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{p.initials.slice(0, 3)}</span>
                </div>
                <span className="text-sm font-medium text-[#222222]">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#005C7A] mb-4">
            ¡Descubre el futuro de la educación hotelera con Plavih!
          </h2>
          <p className="text-[#5F6368] max-w-xl mx-auto mb-8">
            Capacita a tu equipo hotelero con cursos virtuales diseñados por expertos de la industria.
            Forma colaboradores más preparados, eficientes y orientados al servicio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cursos" className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Explorar cursos
            </Link>
            <Link href="/contacto" className="border-2 border-[#00A9E0] text-[#00A9E0] font-semibold px-8 py-3 rounded-full hover:bg-[#E8F7FD] transition-colors">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
