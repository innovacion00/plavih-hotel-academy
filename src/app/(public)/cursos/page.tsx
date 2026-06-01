import { activeCourses, upcomingCourses } from '@/lib/data/courses'
import CourseCard from '@/components/courses/CourseCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Explora todos los cursos de Plavih Hotel Academy. Formación virtual especializada en hotelería y turismo.',
}

const categories = ['Todos', 'Operaciones', 'Alimentos & Bebidas', 'Housekeeping', 'Administrativo', 'Liderazgo', 'Tecnología e IA', 'Innovación', 'Inducción']

export default function CursosPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Todos los Cursos</h1>
          <p className="text-blue-100 max-w-xl">
            Formación virtual especializada para cada área del hotel. Desde operaciones hasta liderazgo e inteligencia artificial.
          </p>
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <span
                key={cat}
                className="shrink-0 text-sm font-medium px-4 py-1.5 rounded-full bg-[#F5F7FA] text-[#5F6368] hover:bg-[#E8F7FD] hover:text-[#00A9E0] cursor-pointer transition-colors"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cursos activos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#005C7A] mb-6">Cursos disponibles ({activeCourses.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Próximos cursos */}
      <section className="bg-[#F5F7FA] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#005C7A] mb-6">Próximamente ({upcomingCourses.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingCourses.map((course) => (
              <CourseCard key={course.slug} course={course} showUpcomingBadge />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
