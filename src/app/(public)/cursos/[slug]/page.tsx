import Link from 'next/link'
import { courses } from '@/lib/data/courses'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = courses.find((c) => c.slug === slug)
  if (!course) return {}
  return { title: course.title, description: course.description }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = courses.find((c) => c.slug === slug)
  if (!course) notFound()

  const related = courses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, 3)

  return (
    <div>
      {/* Hero del curso */}
      <div className="bg-gradient-to-br from-[#005C7A] to-[#00A9E0] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cursos" className="inline-flex items-center gap-1 text-blue-200 text-sm mb-6 hover:text-white transition-colors">
            ← Todos los cursos
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-blue-200">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {course.level}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {course.instructor}
                </span>
              </div>
            </div>

            {/* Card de inscripción */}
            <div className="bg-white rounded-2xl p-6 text-[#222222] shadow-xl">
              <div className="h-32 bg-gradient-to-br from-[#E8F7FD] to-[#27BCEB]/20 rounded-xl mb-5 flex items-center justify-center">
                <span className="text-5xl">🏨</span>
              </div>
              <h3 className="font-bold text-xl text-[#005C7A] mb-1">{course.title}</h3>
              <p className="text-[#5F6368] text-sm mb-5">{course.category} · {course.duration}</p>
              {!course.upcoming ? (
                <Link
                  href="/acceder"
                  className="block w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full text-center transition-colors"
                >
                  Comenzar curso
                </Link>
              ) : (
                <button disabled className="block w-full bg-gray-200 text-gray-400 font-semibold py-3 rounded-full text-center cursor-not-allowed">
                  Próximamente
                </button>
              )}
              <p className="text-xs text-[#5F6368] text-center mt-3">Acceso incluido con tu cuenta GEH Suites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[#005C7A] mb-6">Lo que aprenderás</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.objectives.map((obj) => (
              <div key={obj} className="flex items-start gap-3 bg-[#F5F7FA] rounded-xl p-4">
                <div className="w-5 h-5 rounded-full bg-[#00A9E0] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-[#222222] leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cursos relacionados */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#005C7A] mb-6">Cursos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cursos/${r.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-[#00A9E0] font-medium mb-1">{r.category}</p>
                  <h3 className="font-semibold text-[#222222] text-sm leading-snug mb-2">{r.title}</h3>
                  <p className="text-xs text-[#5F6368]">{r.duration} · {r.instructor}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
