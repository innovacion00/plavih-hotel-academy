'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveLessonContentAction } from '@/lib/course/actions'

type Props = {
  lessonId: string
  courseId: string
  courseSlug: string
  initialContent: string | null
}

export default function TextContentEditor({ lessonId, courseId, courseSlug, initialContent }: Props) {
  const [content, setContent] = useState(initialContent ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveLessonContentAction(lessonId, courseId, content)
      if (result.ok) {
        setSaved(true)
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-2">
          Contenido de la lección
        </label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setSaved(false) }}
          rows={20}
          placeholder="Escribe el contenido de la lección aquí..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] resize-y leading-relaxed"
          disabled={pending}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {saved && (
        <p className="text-sm text-green-600 font-medium">Contenido guardado correctamente.</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
        >
          {pending ? 'Guardando…' : 'Guardar contenido'}
        </button>
        <a
          href={`/dashboard/cursos/${courseSlug}/builder`}
          className="text-sm font-medium text-[#5F6368] hover:text-[#222222] px-4 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Volver al builder
        </a>
      </div>
    </form>
  )
}
