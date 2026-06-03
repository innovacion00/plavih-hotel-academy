'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCourseAction } from '@/lib/course/actions'

export default function DeleteCourseButton({ courseId, title }: { courseId: string; title: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm(`¿Eliminar el curso "${title}"?\n\nEsta acción eliminará también todos sus módulos, lecciones y videos. No se puede deshacer.`)) return
    startTransition(async () => {
      const result = await deleteCourseAction(courseId)
      if (result.ok) router.refresh()
      else alert(result.error)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50"
    >
      {pending ? '...' : 'Eliminar'}
    </button>
  )
}
