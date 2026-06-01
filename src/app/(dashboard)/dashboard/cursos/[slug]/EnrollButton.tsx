'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createEnrollment } from '@/lib/video/actions'

type Props = { courseId: string; slug: string }

export default function EnrollButton({ courseId, slug }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleEnroll() {
    startTransition(async () => {
      const { enrollmentId, error } = await createEnrollment(courseId)
      if (enrollmentId) {
        router.refresh()
      } else {
        alert(error ?? 'No se pudo completar la inscripción.')
      }
    })
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={pending}
      className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Inscribiéndote...' : 'Inscribirme en este curso'}
    </button>
  )
}
