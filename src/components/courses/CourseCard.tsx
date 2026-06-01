import Link from 'next/link'
import type { Course } from '@/lib/data/courses'

const categoryColors: Record<string, string> = {
  'Operaciones': 'bg-blue-100 text-blue-700',
  'Alimentos & Bebidas': 'bg-orange-100 text-orange-700',
  'Housekeeping': 'bg-teal-100 text-teal-700',
  'Administrativo': 'bg-purple-100 text-purple-700',
  'Liderazgo': 'bg-indigo-100 text-indigo-700',
  'Innovación': 'bg-cyan-100 text-cyan-700',
  'Tecnología e IA': 'bg-sky-100 text-sky-700',
  'Inducción': 'bg-green-100 text-green-700',
  'Idiomas': 'bg-yellow-100 text-yellow-700',
  'Gestión': 'bg-red-100 text-red-700',
  'Marketing Digital': 'bg-pink-100 text-pink-700',
}

type Props = {
  course: Course
  showUpcomingBadge?: boolean
}

export default function CourseCard({ course, showUpcomingBadge = false }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-[#00A9E0] to-[#005C7A] relative flex items-center justify-center">
        <span className="text-white text-4xl opacity-30">🏨</span>
        {showUpcomingBadge && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
            Próximamente
          </span>
        )}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${categoryColors[course.category] ?? 'bg-gray-100 text-gray-700'}`}>
          {course.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#222222] text-base leading-snug mb-2">{course.title}</h3>
        <p className="text-[#5F6368] text-sm leading-relaxed flex-1 mb-4">{course.description}</p>

        <div className="flex items-center gap-4 text-xs text-[#5F6368] mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {course.instructor}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#5F6368] bg-[#F5F7FA] px-2 py-1 rounded-full">{course.level}</span>
          {!showUpcomingBadge ? (
            <Link
              href={`/cursos/${course.slug}`}
              className="bg-[#00A9E0] hover:bg-[#007FA8] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Mirar
            </Link>
          ) : (
            <span className="text-xs text-[#5F6368] font-medium">Disponible pronto</span>
          )}
        </div>
      </div>
    </div>
  )
}
