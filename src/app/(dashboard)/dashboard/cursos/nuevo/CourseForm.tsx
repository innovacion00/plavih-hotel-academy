'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createCourseAction } from '@/lib/course/actions'
import type { Profile } from '@/types'

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50'
const labelCls = 'block text-sm font-medium text-[#222222] mb-1.5'

export default function CourseForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(createCourseAction, { ok: true })

  return (
    <form action={action} className="space-y-5">
      {!state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className={labelCls}>Título del curso *</label>
        <input name="title" type="text" placeholder="ej. Capacitación para Recepcionistas" required
          className={inputCls} disabled={pending} />
      </div>

      <div>
        <label className={labelCls}>Descripción</label>
        <textarea name="description" rows={3} placeholder="Describe el objetivo del curso..."
          className={inputCls + ' resize-none'} disabled={pending} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Categoría</label>
          <input name="category" type="text" placeholder="ej. Operaciones"
            className={inputCls} disabled={pending} />
        </div>
        <div>
          <label className={labelCls}>Duración estimada (horas)</label>
          <input name="duration_hours" type="number" min="0" step="0.5" placeholder="8"
            className={inputCls} disabled={pending} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Nivel *</label>
        <select name="level" required className={inputCls} disabled={pending}>
          <option value="beginner">Básico</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>
      </div>

      {(profile.role === 'superadmin' || profile.role === 'admin') && (
        <div>
          <label className={labelCls}>ID del instructor (UUID)</label>
          <input name="instructor_id" type="text" placeholder="uuid del instructor"
            className={inputCls} disabled={pending} />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending}
          className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors disabled:opacity-60">
          {pending ? 'Creando...' : 'Crear curso y continuar →'}
        </button>
        <Link href="/dashboard/cursos"
          className="border border-gray-300 text-[#5F6368] hover:border-gray-400 font-medium px-6 py-2.5 rounded-full text-sm transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
