export type SaveProgressParams = {
  studentId: string
  lessonId: string
  videoId: string
  positionSeconds: number
  durationSeconds: number
  percentWatched: number
  isCompleted: boolean
}

export type VideoProgressRecord = {
  id: string
  studentId: string
  lessonId: string
  videoId: string
  positionSeconds: number
  durationSeconds: number | null
  percentWatched: number
  isCompleted: boolean
  completedAt: string | null
  lastWatchedAt: string
}

export type UploadResult = {
  storagePath: string
  publicUrl: string
}

export interface VideoProvider {
  /** Returns a URL suitable for the <video> element (signed or public) */
  getVideoUrl(storagePath: string, expiresInSeconds?: number): Promise<string>
  /** Persists watch position and completion */
  saveProgress(params: SaveProgressParams): Promise<void>
  /** Returns last saved progress for a student + video, or null */
  getProgress(studentId: string, videoId: string): Promise<VideoProgressRecord | null>
  /** Uploads a video file to storage, returns path and URL */
  uploadVideo(file: File, destinationPath: string): Promise<UploadResult>
}
