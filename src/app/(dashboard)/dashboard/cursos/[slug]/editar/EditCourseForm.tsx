'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useTransition } from 'react'
import { updateCourseAction, toggleCoursePublished } from '@/lib/course/actions'
import type { BuilderCourse } from '@/lib/course/queries'

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50'
const labelCls = 'block text-sm font-medium text-[#222222] mb-1.5'

function PublishToggle({ course }: { course: BuilderCourse }) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleCoursePublished(course.id, !course.is_published)
    })
  }

  return (
    <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
      <div>
        <p className="text-sm font-medium text-[#222222]">Estado del curso</p>
        <p className="text-xs text-[#5F6368] mt-0.5">
          {course.is_published
            ? 'Publicado — visible para estudiantes'
            : 'Borrador — no visible'}
        </p>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-50 ${
          course.is_published
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-[#00A9E0] text-white hover:bg-[#007FA8]'
        }`}
      >
        {pending ? '…' : course.is_published ? 'Despublicar' : 'Publicar'}
      </button>
    </div>
  )
}

export default function EditCourseForm({ course }: { course: BuilderCourse }) {
  const boundUpdate = updateCourseAction.bind(null, course.id)
  const [state, action, pending] = useActionState(boundUpdate, { ok: true })

  return (
    <div className="space-y-6">
      <PublishToggle course={course} />

      <form action={action} className="space-y-5">
        {!state.ok && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {state.error}
          </div>
        )}

        <div>
          <label className={labelCls}>Título *</label>
          <input
            name="title"
            type="text"
            defaultValue={course.title}
            required
            className={inputCls}
            disabled={pending}
          />
        </div>

        <div>
          <label className={labelCls}>Descripción</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={course.description ?? ''}
            className={inputCls + ' resize-none'}
            disabled={pending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Categoría</label>
            <input
              name="category"
              defaultValue={course.category ?? ''}
              className={inputCls}
              disabled={pending}
            />
          </div>
          <div>
            <label className={labelCls}>Duración (horas)</label>
            <input
              name="duration_hours"
              type="number"
              min="0"
              step="0.5"
              defaultValue={course.duration_hours ?? ''}
              className={inputCls}
              disabled={pending}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Nivel *</label>
          <select
            name="level"
            defaultValue={course.level}
            required
            className={inputCls}
            disabled={pending}
          >
            <option value="beginner">Básico</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors disabled:opacity-60"
          >
            {pending ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <Link
            href={`/dashboard/cursos/${course.slug}/builder`}
            className="border border-gray-300 text-[#5F6368] hover:border-gray-400 font-medium px-6 py-2.5 rounded-full text-sm"
          >
            ← Builder
          </Link>
        </div>
      </form>
    </div>
  )
}
