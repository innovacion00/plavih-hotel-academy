-- Migration: add metadata columns to lesson_videos
-- Run after schema.sql in Supabase SQL Editor

alter table lesson_videos
  add column if not exists mime_type          text,
  add column if not exists storage_provider   text not null default 'supabase',
  add column if not exists storage_bucket     text not null default 'lesson-videos',
  add column if not exists processing_status  text not null default 'pending'
    check (processing_status in ('pending', 'processing', 'ready', 'error'));

-- Back-fill existing rows
update lesson_videos set processing_status = 'ready' where is_processed = true;
update lesson_videos set processing_status = 'pending' where is_processed = false;

comment on column lesson_videos.processing_status is
  'pending → file uploaded, not yet verified; processing → being transcoded; ready → playable; error → failed';
