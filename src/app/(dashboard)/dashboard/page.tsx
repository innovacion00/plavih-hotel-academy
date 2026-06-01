import { getServerProfile } from '@/lib/auth/session'
import { MOCK_STATS, MOCK_RECENT_ACTIVITY, MOCK_INSTITUTIONS } from '@/lib/mocks/dashboard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const profile = await getServerProfile()
  if (!profile) return null

  const { role } = profile

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Bienvenido, ${profile.full_name ?? profile.email}`}
        role={role}
      />

      {role === 'superadmin' && <SuperadminView />}
      {role === 'admin' && <AdminView />}
      {role === 'instructor' && <InstructorView />}
      {role === 'student' && <StudentView />}
    </div>
  )
}

function SuperadminView() {
  const s = MOCK_STATS.superadmin
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard label="Instituciones"        value={s.institutions}          icon="🏛️" color="bg-purple-100" />
        <StatsCard label="Usuarios totales"     value={s.users}                 icon="👥" color="bg-blue-100" />
        <StatsCard label="Cursos"               value={s.courses}               icon="📚" color="bg-teal-100" />
        <StatsCard label="Estudiantes activos"  value={s.activeStudents}        icon="🎓" color="bg-green-100" />
        <StatsCard label="Inscripciones / mes"  value={s.enrollmentsThisMonth}  icon="📋" color="bg-orange-100" trend="+12% vs mes anterior" trendUp />
        <StatsCard label="Certificados emitidos" value={s.certificatesIssued}   icon="🏆" color="bg-yellow-100" />
      </div>

      {/* Instituciones */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#005C7A] mb-4">Instituciones activas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[#5F6368] font-medium">Institución</th>
                <th className="text-right py-2 px-3 text-[#5F6368] font-medium">Estudiantes</th>
                <th className="text-right py-2 px-3 text-[#5F6368] font-medium">Cursos</th>
                <th className="text-right py-2 px-3 text-[#5F6368] font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INSTITUTIONS.map((inst) => (
                <tr key={inst.id} className="border-b border-gray-50 hover:bg-[#F5F7FA]">
                  <td className="py-2.5 px-3 font-medium text-[#222222]">{inst.name}</td>
                  <td className="py-2.5 px-3 text-right text-[#5F6368]">{inst.students}</td>
                  <td className="py-2.5 px-3 text-right text-[#5F6368]">{inst.courses}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inst.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {inst.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActivityFeed />
    </div>
  )
}

function AdminView() {
  const s = MOCK_STATS.admin
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Estudiantes"          value={s.students}       icon="🎓" color="bg-blue-100" />
        <StatsCard label="Cursos activos"       value={s.activeCourses}  icon="📚" color="bg-teal-100" />
        <StatsCard label="Certificados"         value={s.certificates}   icon="🏆" color="bg-yellow-100" />
        <StatsCard label="Tasa de completitud"  value={`${s.completionRate}%`} icon="📊" color="bg-green-100" trend="+5% vs mes anterior" trendUp />
      </div>
      <ActivityFeed />
    </div>
  )
}

function InstructorView() {
  const s = MOCK_STATS.instructor
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Mis cursos"          value={s.courses}      icon="📚" color="bg-teal-100" />
        <StatsCard label="Estudiantes"         value={s.students}     icon="🎓" color="bg-blue-100" />
        <StatsCard label="Evaluaciones"        value={s.assessments}  icon="📝" color="bg-purple-100" />
        <StatsCard label="Puntaje promedio"    value={`${s.avgScore}%`} icon="⭐" color="bg-yellow-100" />
      </div>

      {/* Mis cursos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#005C7A] mb-4">Mis cursos publicados</h2>
        <div className="space-y-3">
          {[
            { title: 'Capacitación para Recepcionistas', students: 18, completion: 72 },
            { title: 'Administradores y Jefes de Operación', students: 8, completion: 55 },
            { title: 'Capacidades de Innovación', students: 12, completion: 40 },
          ].map((c) => (
            <div key={c.title} className="flex items-center justify-between bg-[#F5F7FA] rounded-xl px-4 py-3">
              <div>
                <p className="font-medium text-sm text-[#222222]">{c.title}</p>
                <p className="text-xs text-[#5F6368]">{c.students} estudiantes</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#00A9E0]">{c.completion}%</p>
                <p className="text-xs text-[#5F6368]">completitud</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StudentView() {
  const s = MOCK_STATS.student
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Cursos inscritos"    value={s.enrolledCourses}  icon="📚" color="bg-blue-100" />
        <StatsCard label="Cursos completados"  value={s.completedCourses} icon="✅" color="bg-green-100" />
        <StatsCard label="Certificados"        value={s.certificates}     icon="🏆" color="bg-yellow-100" />
        <StatsCard label="Progreso general"    value={`${s.progressPercent}%`} icon="📊" color="bg-teal-100" />
      </div>

      {/* Mis cursos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#005C7A] mb-4">Mis cursos asignados</h2>
        <div className="space-y-3">
          {[
            { title: 'Conoce GEH Suites', progress: 100, status: 'Completado' },
            { title: 'Capacitación para Recepcionistas', progress: 65, status: 'En progreso' },
            { title: 'ValerIA: Agente Inteligente', progress: 0, status: 'Sin iniciar' },
          ].map((c) => (
            <div key={c.title} className="bg-[#F5F7FA] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm text-[#222222]">{c.title}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  c.status === 'Completado' ? 'bg-green-100 text-green-700' :
                  c.status === 'En progreso' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{c.status}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#00A9E0] h-1.5 rounded-full transition-all"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <p className="text-xs text-[#5F6368] mt-1">{c.progress}% completado</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-[#005C7A] mb-4">Actividad reciente</h2>
      <div className="space-y-3">
        {MOCK_RECENT_ACTIVITY.map((a) => {
          const icons: Record<string, string> = {
            completion: '✅',
            enrollment: '📋',
            certificate: '🏆',
            lesson: '▶️',
            publish: '🚀',
          }
          return (
            <div key={a.id} className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{icons[a.type] ?? '📌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#222222]">
                  <span className="font-medium">{a.user}</span>{' '}
                  <span className="text-[#5F6368]">{a.action}</span>{' '}
                  <span className="font-medium text-[#00A9E0]">{a.target}</span>
                </p>
                <p className="text-xs text-[#5F6368]">{a.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
