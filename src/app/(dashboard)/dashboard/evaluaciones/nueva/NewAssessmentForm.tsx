'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createAssessmentAction } from '@/lib/assessments/actions'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50'
const labelCls = 'block text-sm font-medium text-[#222222] mb-1.5'

type Course = { id: string; title: string; slug: string }

export default function NewAssessmentForm({ courses }: { courses: Course[] }) {
  const [state, action, pending] = useActionState(createAssessmentAction, { ok: true })

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      {!state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className={labelCls}>Curso *</label>
        <select name="course_id" required className={inputCls} disabled={pending}>
          <option value="">Selecciona un curso...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Título de la evaluación *</label>
        <input name="title" type="text" required placeholder="ej. Evaluación Final — Recepcionistas"
          className={inputCls} disabled={pending} />
      </div>

      <div>
        <label className={labelCls}>Descripción</label>
        <textarea name="description" rows={3} placeholder="Instrucciones o descripción de la evaluación..."
          className={inputCls + ' resize-none'} disabled={pending} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Puntaje para aprobar (%)</label>
          <input name="passing_score" type="number" min="0" max="100" defaultValue="70"
            className={inputCls} disabled={pending} />
        </div>
        <div>
          <label className={labelCls}>Intentos máximos</label>
          <input name="max_attempts" type="number" min="1" defaultValue="3"
            className={inputCls} disabled={pending} />
        </div>
        <div>
          <label className={labelCls}>Límite de tiempo (min)</label>
          <input name="time_limit_minutes" type="number" min="1" placeholder="Sin límite"
            className={inputCls} disabled={pending} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending}
          className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors disabled:opacity-60">
          {pending ? 'Creando...' : 'Crear evaluación →'}
        </button>
        <Link href="/dashboard/evaluaciones"
          className="border border-gray-300 text-[#5F6368] hover:border-gray-400 font-medium px-6 py-2.5 rounded-full text-sm transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
