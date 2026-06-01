'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getVideoUploadUrl, confirmVideoUpload, deleteLessonVideoAction } from '@/lib/course/actions'

type Props = {
  lessonId: string
  courseId: string
  courseSlug: string
  hasExistingVideo: boolean
  isMock: boolean
}

type UploadState =
  | { stage: 'idle' }
  | { stage: 'validating' }
  | { stage: 'uploading'; percent: number }
  | { stage: 'confirming' }
  | { stage: 'done' }
  | { stage: 'error'; message: string }

const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const MAX_SIZE_BYTES = 500 * 1024 * 1024  // 500 MB

export default function VideoUploadClient({
  lessonId,
  courseId,
  courseSlug,
  hasExistingVideo,
  isMock,
}: Props) {
  const [uploadState, setUploadState] = useState<UploadState>({ stage: 'idle' })
  const [deleting, startDelete] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function reset() {
    setUploadState({ stage: 'idle' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleFile(file: File) {
    // Client-side validation
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadState({ stage: 'error', message: 'Formato no soportado. Usa MP4, WebM o MOV.' })
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadState({ stage: 'error', message: 'El archivo supera el límite de 500 MB.' })
      return
    }

    setUploadState({ stage: 'validating' })

    // Step 1: Get signed upload URL from server
    const urlResult = await getVideoUploadUrl({
      lessonId,
      courseId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    })

    if (!urlResult.ok) {
      setUploadState({ stage: 'error', message: urlResult.error })
      return
    }

    const { signedUrl, storagePath } = urlResult.data!

    // Step 2: Upload directly to Supabase Storage (bypasses Next.js server)
    setUploadState({ stage: 'uploading', percent: 0 })

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100)
            setUploadState({ stage: 'uploading', percent: pct })
          }
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed: ${xhr.status}`))
        })
        xhr.addEventListener('error', () => reject(new Error('Error de red durante el upload.')))
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch (err) {
      setUploadState({ stage: 'error', message: (err as Error).message })
      return
    }

    // Step 3: Confirm upload on server (creates lesson_videos record)
    setUploadState({ stage: 'confirming' })

    const confirmResult = await confirmVideoUpload({
      lessonId,
      courseId,
      storagePath,
      fileSizeBytes: file.size,
      mimeType: file.type,
    })

    if (!confirmResult.ok) {
      setUploadState({ stage: 'error', message: confirmResult.error })
      return
    }

    setUploadState({ stage: 'done' })
    router.refresh()
  }

  function handleDelete() {
    if (!confirm('¿Eliminar el video de esta lección? Esta acción no se puede deshacer.')) return
    startDelete(async () => {
      const result = await deleteLessonVideoAction(lessonId, courseId)
      if (result.ok) { router.refresh() }
      else { alert(result.error) }
    })
  }

  if (isMock) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-3 block">🔒</span>
        <p className="text-sm font-medium text-[#222222] mb-1">Upload no disponible en modo demo</p>
        <p className="text-xs text-[#5F6368]">
          Configura Supabase Storage y desactiva <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_USE_MOCKS</code> para habilitar el upload real.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Upload area */}
      {uploadState.stage === 'idle' && (
        <>
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-[#00A9E0] hover:bg-blue-50/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
          >
            <span className="text-4xl mb-3 block">🎬</span>
            <p className="text-sm font-semibold text-[#222222] mb-1">
              {hasExistingVideo ? 'Arrastra un video para reemplazar el actual' : 'Arrastra tu video aquí'}
            </p>
            <p className="text-xs text-[#5F6368] mb-4">MP4, WebM o MOV · Máx. 500 MB</p>
            <button
              type="button"
              className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              Seleccionar archivo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />

          {hasExistingVideo && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full text-xs font-medium text-red-500 hover:text-red-700 py-2 rounded-full border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando…' : 'Eliminar video actual'}
            </button>
          )}
        </>
      )}

      {/* Upload progress states */}
      {(uploadState.stage === 'validating' || uploadState.stage === 'confirming') && (
        <div className="text-center py-8 space-y-3">
          <div className="w-10 h-10 border-4 border-[#00A9E0] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#222222]">
            {uploadState.stage === 'validating' ? 'Preparando upload…' : 'Guardando video…'}
          </p>
        </div>
      )}

      {uploadState.stage === 'uploading' && (
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between text-sm font-medium text-[#222222]">
            <span>Subiendo video…</span>
            <span className="text-[#00A9E0] tabular-nums">{uploadState.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-[#00A9E0] rounded-full transition-all duration-300"
              style={{ width: `${uploadState.percent}%` }}
            />
          </div>
          <p className="text-xs text-[#5F6368]">No cierres esta página hasta que el upload termine.</p>
        </div>
      )}

      {uploadState.stage === 'done' && (
        <div className="text-center py-6 space-y-3">
          <span className="text-5xl block">✅</span>
          <p className="text-sm font-semibold text-green-700">Video subido correctamente</p>
          <p className="text-xs text-[#5F6368]">El video está disponible para los estudiantes inscritos.</p>
          <button onClick={reset} className="text-sm text-[#00A9E0] hover:underline">
            Subir otro video
          </button>
        </div>
      )}

      {uploadState.stage === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-red-700">Error en el upload</p>
          <p className="text-xs text-red-600">{uploadState.message}</p>
          <button onClick={reset} className="text-xs font-medium text-red-600 hover:underline">
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}
