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
    throw new Error('Missing DO_SPACES_BUCKET or DO_SPACES_REGION (required to build public video URLs)')
  }
  return `https://${bucket}.${region}.digitaloceanspaces.com/${storagePath}`
}
