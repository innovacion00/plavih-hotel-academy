# DigitalOcean Spaces Video Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Supabase Storage as the video backend with DigitalOcean Spaces so that lesson videos are stored in and served from a public DO Spaces bucket.

**Architecture:** A new `DigitalOceanSpacesVideoProvider` implements the existing `VideoProvider` interface. A `spaces-client.ts` helper centralises S3 client construction and public URL generation. The three server actions in `course/actions.ts` that touch storage (`getVideoUploadUrl`, `confirmVideoUpload`, `deleteLessonVideoAction`) and one in `video/actions.ts` (`getSignedVideoUrl`) are updated to use the new helpers. No frontend files change.

**Tech Stack:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` (DO Spaces is S3-compatible), Next.js 15 Server Actions, TypeScript.

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/lib/video/spaces-client.ts` |
| Create | `src/lib/video/digitalocean-spaces-provider.ts` |
| Modify | `src/lib/video/video-provider.ts` |
| Modify | `src/lib/course/actions.ts` |
| Modify | `src/lib/video/actions.ts` |
| Modify | `.env.example` |

---

## Task 1: Install AWS SDK packages and document env vars

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.example`

- [ ] **Step 1: Install packages**

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Expected: packages added to `dependencies` in `package.json`, `node_modules` updated.

- [ ] **Step 2: Add env vars to `.env.example`**

Open `c:\Users\Usuario\plavih-hotel-academy\.env.example` and append after the `# ── App ───` block:

```
# ── DigitalOcean Spaces (video storage) ──────────────────────
DO_SPACES_KEY=your-spaces-access-key
DO_SPACES_SECRET=your-spaces-secret-key
DO_SPACES_REGION=nyc3
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "feat: install AWS SDK for DigitalOcean Spaces video storage"
```

---

## Task 2: Create `spaces-client.ts` helper

**Files:**
- Create: `src/lib/video/spaces-client.ts`

- [ ] **Step 1: Create the file**

Create `c:\Users\Usuario\plavih-hotel-academy\src\lib\video\spaces-client.ts` with this exact content:

```ts
import { S3Client } from '@aws-sdk/client-s3'

export function getSpacesClient(): { client: S3Client; bucket: string; region: string } {
  const key = process.env.DO_SPACES_KEY
  const secret = process.env.DO_SPACES_SECRET
  const region = process.env.DO_SPACES_REGION
  const endpoint = process.env.DO_SPACES_ENDPOINT
  const bucket = process.env.DO_SPACES_BUCKET

  if (!key || !secret || !region || !endpoint || !bucket) {
    throw new Error(
      'Missing DO Spaces env vars: DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_REGION, DO_SPACES_ENDPOINT, DO_SPACES_BUCKET',
    )
  }

  return {
    client: new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId: key, secretAccessKey: secret },
    }),
    bucket,
    region,
  }
}

export function getPublicVideoUrl(storagePath: string): string {
  const bucket = process.env.DO_SPACES_BUCKET
  const region = process.env.DO_SPACES_REGION
  if (!bucket || !region) {
    throw new Error('Missing DO_SPACES_BUCKET or DO_SPACES_REGION')
  }
  return `https://${bucket}.${region}.digitaloceanspaces.com/${storagePath}`
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors related to the new file.

- [ ] **Step 3: Commit**

```bash
git add src/lib/video/spaces-client.ts
git commit -m "feat: add DigitalOcean Spaces client helper"
```

---

## Task 3: Create `DigitalOceanSpacesVideoProvider`

**Files:**
- Create: `src/lib/video/digitalocean-spaces-provider.ts`
- Reference: `src/lib/video/types.ts` (interface + types)
- Reference: `src/lib/video/spaces-client.ts` (created in Task 2)

The provider implements all four methods of `VideoProvider`. `saveProgress` and `getProgress` are identical to `SupabaseVideoProvider` — they always use Supabase DB, regardless of where files are stored.

- [ ] **Step 1: Create the file**

Create `c:\Users\Usuario\plavih-hotel-academy\src\lib\video\digitalocean-spaces-provider.ts`:

```ts
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { VideoProvider, SaveProgressParams, VideoProgressRecord, UploadResult } from './types'
import { getSpacesClient, getPublicVideoUrl } from './spaces-client'

const COMPLETION_THRESHOLD = 90

export class DigitalOceanSpacesVideoProvider implements VideoProvider {
  constructor(private readonly supabase: SupabaseClient) {}

  async getVideoUrl(storagePath: string): Promise<string> {
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
      }),
    )

    return {
      storagePath: destinationPath,
      publicUrl: getPublicVideoUrl(destinationPath),
    }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/video/digitalocean-spaces-provider.ts
git commit -m "feat: add DigitalOceanSpacesVideoProvider"
```

---

## Task 4: Update `video-provider.ts` factory

**Files:**
- Modify: `src/lib/video/video-provider.ts`

- [ ] **Step 1: Replace the file content**

Overwrite `c:\Users\Usuario\plavih-hotel-academy\src\lib\video\video-provider.ts` with:

```ts
import type { VideoProvider } from './types'

export async function getVideoProvider(): Promise<VideoProvider> {
  const { createClient } = await import('@/lib/supabase/server')
  const { DigitalOceanSpacesVideoProvider } = await import('./digitalocean-spaces-provider')
  const supabase = await createClient()
  return new DigitalOceanSpacesVideoProvider(supabase)
}

export type { VideoProvider } from './types'
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/video/video-provider.ts
git commit -m "feat: update VideoProvider factory to use DigitalOcean Spaces"
```

---

## Task 5: Update server actions in `course/actions.ts`

**Files:**
- Modify: `src/lib/course/actions.ts`

Three functions change: `getVideoUploadUrl`, `confirmVideoUpload`, `deleteLessonVideoAction`. All other functions in the file stay exactly the same.

- [ ] **Step 1: Add imports at the top of `src/lib/course/actions.ts`**

After the existing imports (after the `import { ZodError } from 'zod'` line), add:

```ts
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSpacesClient } from '@/lib/video/spaces-client'
```

- [ ] **Step 2: Replace `getVideoUploadUrl`**

Find and replace the entire `getVideoUploadUrl` function (lines 297–333 in the original file) with:

```ts
export async function getVideoUploadUrl(params: {
  lessonId: string
  courseId: string
  fileName: string
  fileSize: number
  mimeType: string
}): Promise<ActionResult<{ signedUrl: string; storagePath: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo — el upload no está disponible en demo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const validated = videoUploadSchema.safeParse({
    file_name: params.fileName,
    file_size: params.fileSize,
    mime_type: params.mimeType,
  })
  if (!validated.success) return zodError(validated.error)

  const supabase = await createClient()
  const canEdit = await assertEditAccess(params.courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso a este curso.' }

  const ext = params.fileName.split('.').pop() ?? 'mp4'
  const storagePath = `courses/${params.courseId}/lessons/${params.lessonId}/${Date.now()}.${ext}`

  try {
    const { client, bucket } = getSpacesClient()
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: storagePath,
      ContentType: params.mimeType,
    })
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 15 * 60 })
    return { ok: true, data: { signedUrl, storagePath } }
  } catch {
    return { ok: false, error: 'No se pudo generar la URL de upload.' }
  }
}
```

- [ ] **Step 3: Replace `confirmVideoUpload`**

Find and replace the entire `confirmVideoUpload` function with:

```ts
export async function confirmVideoUpload(params: {
  lessonId: string
  courseId: string
  storagePath: string
  durationSeconds?: number
  fileSizeBytes: number
  mimeType: string
}): Promise<ActionResult<{ videoId: string }>> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(params.courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  // Delete existing video for this lesson (replace flow)
  const { data: existing } = await supabase
    .from('lesson_videos')
    .select('id, storage_path')
    .eq('lesson_id', params.lessonId)
    .single()

  const { client, bucket } = getSpacesClient()

  if (existing) {
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: existing.storage_path }))
    } catch {
      // file may not exist; proceed with DB cleanup
    }
    await supabase.from('lesson_videos').delete().eq('id', existing.id)
  }

  const { data, error } = await supabase
    .from('lesson_videos')
    .insert({
      lesson_id: params.lessonId,
      storage_path: params.storagePath,
      storage_bucket: bucket,
      storage_provider: 'digitalocean',
      duration_seconds: params.durationSeconds ?? null,
      size_bytes: params.fileSizeBytes,
      mime_type: params.mimeType,
      is_processed: true,
      processing_status: 'ready',
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'No se pudo registrar el video.' }
  return { ok: true, data: { videoId: data.id } }
}
```

- [ ] **Step 4: Replace `deleteLessonVideoAction`**

Find and replace the entire `deleteLessonVideoAction` function with:

```ts
export async function deleteLessonVideoAction(lessonId: string, courseId: string): Promise<ActionResult> {
  if (isMockMode) return { ok: false, error: 'Modo demo activo.' }

  const profile = await getServerProfile()
  if (!profile || profile.role === 'student') return { ok: false, error: 'Sin permisos.' }

  const supabase = await createClient()
  const canEdit = await assertEditAccess(courseId, profile, supabase)
  if (!canEdit) return { ok: false, error: 'Sin acceso.' }

  const { data: video } = await supabase
    .from('lesson_videos')
    .select('id, storage_path')
    .eq('lesson_id', lessonId)
    .single()

  if (!video) return { ok: false, error: 'No se encontró el video.' }

  try {
    const { client, bucket } = getSpacesClient()
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: video.storage_path }))
  } catch {
    // log but don't block the DB delete
  }

  await supabase.from('lesson_videos').delete().eq('id', video.id)
  return { ok: true }
}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/course/actions.ts
git commit -m "feat: use DigitalOcean Spaces in video upload/delete actions"
```

---

## Task 6: Update `getSignedVideoUrl` in `video/actions.ts`

**Files:**
- Modify: `src/lib/video/actions.ts`

`getSignedVideoUrl` currently calls `supabase.storage.createSignedUrl()`. Since the bucket is public, it now returns a static public URL instead.

- [ ] **Step 1: Add import at the top of `src/lib/video/actions.ts`**

After the existing imports at the top of the file, add:

```ts
import { getPublicVideoUrl } from '@/lib/video/spaces-client'
```

- [ ] **Step 2: Replace `getSignedVideoUrl`**

Find and replace the entire `getSignedVideoUrl` function with:

```ts
export async function getSignedVideoUrl(
  videoId: string,
): Promise<{ url: string | null; error?: string }> {
  if (isMockMode) {
    return { url: null, error: 'mock' }
  }

  const supabase = await createClient()

  const { data: video } = await supabase
    .from('lesson_videos')
    .select('storage_path')
    .eq('id', videoId)
    .single()

  if (!video) return { url: null, error: 'Video no encontrado.' }

  try {
    const url = getPublicVideoUrl(video.storage_path)
    return { url }
  } catch {
    return { url: null, error: 'No se pudo generar el enlace de video.' }
  }
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Final commit**

```bash
git add src/lib/video/actions.ts
git commit -m "feat: return public DO Spaces URL for video playback"
```

---

## Task 7: CORS check reminder

**No code changes — manual verification step.**

Before testing the upload in the browser, confirm the DO Spaces bucket has a CORS rule that allows `PUT` from your app's origin. In the DigitalOcean dashboard → Spaces → your bucket → Settings → CORS:

```
Origin: http://localhost:3000 (and your production URL)
Allowed methods: PUT, GET
Allowed headers: Content-Type, *
```

Without this rule, the browser XHR upload will fail with a CORS error even though the presigned URL is valid.

- [ ] **Step 1: Confirm CORS is configured in the DO dashboard** (manual)

---

## Verification

After all tasks are committed:

- [ ] Run `npx tsc --noEmit` — should produce zero errors
- [ ] Set real DO Spaces credentials in `.env` (not `.env.example`) and set `NEXT_PUBLIC_USE_MOCKS=false`
- [ ] Run `npm run dev`
- [ ] Open a course builder → lesson → video tab
- [ ] Upload a video file — progress bar should appear and reach 100%
- [ ] Open the lesson as a student — video should play from the DO Spaces public URL
- [ ] Delete the video from the builder — confirm the file is removed from the bucket
