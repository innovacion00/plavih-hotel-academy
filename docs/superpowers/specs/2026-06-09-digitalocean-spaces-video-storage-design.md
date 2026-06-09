# DigitalOcean Spaces Video Storage — Design Spec

**Date:** 2026-06-09  
**Status:** Approved

## Overview

Replace Supabase Storage as the video backend for lesson videos with DigitalOcean Spaces (S3-compatible). The Supabase database (tables `lesson_videos`, `video_progress`, `lesson_progress`, `enrollments`) is unchanged. Only the file storage layer changes. Video URLs are public — no signed playback URLs required.

## Architecture

### Files changed

| File | Change |
|------|--------|
| `src/lib/video/digitalocean-spaces-provider.ts` | New — implements `VideoProvider` interface |
| `src/lib/video/video-provider.ts` | Update factory to return `DigitalOceanSpacesVideoProvider` |
| `src/lib/course/actions.ts` | Update `getVideoUploadUrl`, `confirmVideoUpload`, `deleteLessonVideoAction` |
| `src/lib/video/actions.ts` | Update `getSignedVideoUrl` to return public URL |
| `.env.example` | Add DO Spaces env vars |
| `package.json` | Add `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |

**No changes** to `VideoUploadClient.tsx`, `VideoPlayer.tsx`, database schema, or any other frontend code.

### New env vars

```
DO_SPACES_KEY=       # Access key ID from DigitalOcean
DO_SPACES_SECRET=    # Secret access key from DigitalOcean
DO_SPACES_REGION=    # e.g. nyc3, sfo3, ams3, sgp1
DO_SPACES_BUCKET=    # Bucket name
DO_SPACES_ENDPOINT=  # e.g. https://nyc3.digitaloceanspaces.com
```

### Dependencies

Add to `package.json`:
- `@aws-sdk/client-s3` — S3-compatible SDK (works with DO Spaces)
- `@aws-sdk/s3-request-presigner` — generates presigned PUT URLs for direct upload

## Upload Flow

1. Instructor selects a video file in `VideoUploadClient` (no changes here).
2. Client calls `getVideoUploadUrl()` server action.
3. Server uses `@aws-sdk/s3-request-presigner` (`PutObjectCommand`) to generate a **presigned PUT URL** expiring in 15 minutes. Storage path pattern: `courses/{courseId}/lessons/{lessonId}/{timestamp}.{ext}`.
4. Client uploads the file directly to DO Spaces via XHR PUT (no change to client code).
5. Client calls `confirmVideoUpload()` server action.
6. Server inserts into `lesson_videos` with `storage_provider: 'digitalocean'`, `storage_bucket: {DO_SPACES_BUCKET}`.

## Playback Flow

Because the bucket is **public**, the playback URL is a static string — no SDK call needed:

```
https://{DO_SPACES_BUCKET}.{DO_SPACES_REGION}.digitaloceanspaces.com/{storagePath}
```

`getSignedVideoUrl()` in `src/lib/video/actions.ts` constructs this URL from env vars + the `storage_path` stored in `lesson_videos`. No expiry, no AWS call at playback time.

## Delete Flow

`deleteLessonVideoAction()` calls `DeleteObjectCommand` via the S3 client to remove the file from DO Spaces, then deletes the `lesson_videos` row from Supabase DB.

## `DigitalOceanSpacesVideoProvider` class

Implements the existing `VideoProvider` interface (`src/lib/video/types.ts`):

```ts
interface VideoProvider {
  getVideoUrl(storagePath: string, expiresInSeconds?: number): Promise<string>
  saveProgress(params: SaveProgressParams): Promise<void>
  getProgress(studentId: string, videoId: string): Promise<VideoProgressRecord | null>
  uploadVideo(file: File, destinationPath: string): Promise<UploadResult>
}
```

- `getVideoUrl` — constructs the public URL from env vars and ignores `expiresInSeconds` (bucket is public, no expiry applies). Returns synchronously wrapped in a resolved Promise.
- `saveProgress` and `getProgress` — delegate to Supabase DB exactly as `SupabaseVideoProvider` does today. Only storage changes, not progress tracking.
- `uploadVideo` — implemented for interface completeness, but **not called by the server actions**. The upload flow in `course/actions.ts` bypasses the provider and calls the S3 SDK directly (same pattern as today where `course/actions.ts` calls `supabase.storage` directly rather than going through `SupabaseVideoProvider`). This is intentional: presigned URL generation requires a server-only context and direct SDK access.

## Error Handling

- Presigned URL generation failure → `getVideoUploadUrl` returns `{ ok: false, error: '...' }` — existing error UI in `VideoUploadClient` handles this.
- Upload XHR failure → existing error UI handles this (no change).
- `DeleteObjectCommand` failure is logged but does not block the DB delete (same behavior as current Supabase Storage delete).
- Missing env vars → throw at SDK client construction time (server startup) with a clear message.

## What does NOT change

- Database schema (`lesson_videos`, `video_progress`, `lesson_progress`, `enrollments`)
- `VideoUploadClient.tsx` — presigned PUT pattern is identical
- `VideoPlayer.tsx` — receives a URL string, doesn't care about the source
- Progress tracking logic
- Auth and permissions checks
- Mock mode behavior
