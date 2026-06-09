import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { VideoProvider, SaveProgressParams, VideoProgressRecord, UploadResult } from './types'
import { getSpacesClient, getPublicVideoUrl } from './spaces-client'

const COMPLETION_THRESHOLD = 90

export class DigitalOceanSpacesVideoProvider implements VideoProvider {
  constructor(private readonly supabase: SupabaseClient) {}

  async getVideoUrl(storagePath: string, _expiresInSeconds?: number): Promise<string> {
    return getPublicVideoUrl(storagePath)
  }

  async saveProgress(params: SaveProgressParams): Promise<void> {
    const isCompleted = params.isCompleted || params.percentWatched >= COMPLETION_THRESHOLD

    const { error } = await this.supabase
      .from('video_progress')
      .upsert(
        {
          student_id: params.studentId,
          lesson_id: params.lessonId,
          video_id: params.videoId,
          position_seconds: params.positionSeconds,
          duration_seconds: params.durationSeconds,
          percent_watched: params.percentWatched,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_watched_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,video_id' },
      )

    if (error) throw new Error(`saveProgress failed: ${error.message}`)
  }

  async getProgress(studentId: string, videoId: string): Promise<VideoProgressRecord | null> {
    const { data, error } = await this.supabase
      .from('video_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('video_id', videoId)
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      studentId: data.student_id,
      lessonId: data.lesson_id,
      videoId: data.video_id,
      positionSeconds: data.position_seconds,
      durationSeconds: data.duration_seconds,
      percentWatched: data.percent_watched,
      isCompleted: data.is_completed,
      completedAt: data.completed_at,
      lastWatchedAt: data.last_watched_at,
    }
  }

  async uploadVideo(file: File, destinationPath: string): Promise<UploadResult> {
    const { client, bucket } = getSpacesClient()
    const arrayBuffer = await file.arrayBuffer()

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: destinationPath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
        CacheControl: 'max-age=3600',
      }),
    )

    return {
      storagePath: destinationPath,
      publicUrl: getPublicVideoUrl(destinationPath),
    }
  }
}
