'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { saveVideoProgress } from '@/lib/video/actions'

type Props = {
  videoId: string
  lessonId: string
  enrollmentId: string
  signedUrl: string | null    // null → mock mode or URL error
  initialPositionSeconds?: number
  durationSeconds?: number | null
  isMock?: boolean
  title: string
}

const HEARTBEAT_INTERVAL = 5000   // ms
const COMPLETION_THRESHOLD = 0.90  // fraction

export default function VideoPlayer({
  videoId,
  lessonId,
  enrollmentId,
  signedUrl,
  initialPositionSeconds = 0,
  isMock = false,
  title,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSavedPosition = useRef<number>(0)
  const completedSent = useRef<boolean>(false)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [percentWatched, setPercentWatched] = useState(0)

  // Resume from last saved position once the video metadata loads
  const handleMetadataLoaded = useCallback(() => {
    const v = videoRef.current
    if (!v || initialPositionSeconds <= 0) return
    v.currentTime = initialPositionSeconds
  }, [initialPositionSeconds])

  const sendProgress = useCallback(
    async (completed = false) => {
      const v = videoRef.current
      if (!v || !v.duration || isNaN(v.duration)) return

      const position = Math.floor(v.currentTime)
      const duration = Math.floor(v.duration)
      const percent = Math.round((position / duration) * 100)

      if (position === lastSavedPosition.current && !completed) return
      lastSavedPosition.current = position
      setPercentWatched(percent)

      await saveVideoProgress({
        videoId,
        lessonId,
        enrollmentId,
        positionSeconds: position,
        durationSeconds: duration,
        percentWatched: percent,
      })
    },
    [videoId, lessonId, enrollmentId],
  )

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v || !v.duration || isNaN(v.duration)) return
    const fraction = v.currentTime / v.duration
    setPercentWatched(Math.round(fraction * 100))

    if (!completedSent.current && fraction >= COMPLETION_THRESHOLD) {
      completedSent.current = true
      sendProgress(true)
    }
  }, [sendProgress])

  // Heartbeat: save every 5 seconds
  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      const v = videoRef.current
      if (v && !v.paused && !v.ended) sendProgress()
    }, HEARTBEAT_INTERVAL)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      sendProgress()  // save on unmount
    }
  }, [sendProgress])

  if (isMock || !signedUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🎬</span>
        <p className="text-white font-medium text-sm">{title}</p>
        <p className="text-gray-400 text-xs text-center max-w-xs">
          {isMock
            ? 'Modo demo activo — el video no está disponible. Configura Supabase Storage para reproducción real.'
            : 'No se pudo cargar el video. Intenta recargar la página.'}
        </p>
        {isMock && (
          <div className="mt-2 flex gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-xs font-medium">Demo</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 gap-3">
            <span className="text-3xl">⚠️</span>
            <p className="text-white text-sm text-center px-6">{error}</p>
            <button
              onClick={() => { setError(null); videoRef.current?.load() }}
              className="text-xs text-[#00A9E0] hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          preload="metadata"
          onLoadedMetadata={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => sendProgress(true)}
          onError={() => setError('Error al reproducir el video. El enlace puede haber expirado.')}
          aria-label={title}
        >
          <source src={signedUrl} type="video/mp4" />
          Tu navegador no soporta reproducción de video HTML5.
        </video>
      </div>

      {/* Progress indicator below player */}
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-[#00A9E0] rounded-full transition-all"
            style={{ width: `${percentWatched}%` }}
          />
        </div>
        <span className="text-xs text-[#5F6368] shrink-0 tabular-nums">{percentWatched}%</span>
        {percentWatched >= 90 && (
          <span className="text-xs font-semibold text-green-600 shrink-0">✓ Completado</span>
        )}
      </div>
    </div>
  )
}
