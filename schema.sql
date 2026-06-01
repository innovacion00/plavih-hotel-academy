-- ═══════════════════════════════════════════════════════════════
--  Plavih Hotel Academy — Schema completo
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── Extensiones ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- ── Tipos ENUM ───────────────────────────────────────────────
create type user_role as enum ('superadmin', 'admin', 'instructor', 'student');
create type content_type as enum ('video', 'text', 'quiz', 'file');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type question_type as enum ('multiple_choice', 'true_false', 'short_answer');
create type ai_message_role as enum ('user', 'assistant');

-- ── Función updated_at ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── TABLA: institutions ───────────────────────────────────────
create table institutions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  logo_url      text,
  contact_email text,
  contact_phone text,
  address       text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_institutions_slug on institutions(slug);
create index idx_institutions_active on institutions(is_active);

create trigger trg_institutions_updated_at
  before update on institutions
  for each row execute function set_updated_at();

-- ── TABLA: profiles ──────────────────────────────────────────
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null unique,
  full_name      text,
  avatar_url     text,
  role           user_role not null default 'student',
  institution_id uuid references institutions(id) on delete set null,
  phone          text,
  position       text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_profiles_email on profiles(email);
create index idx_profiles_role on profiles(role);
create index idx_profiles_institution on profiles(institution_id);
create index idx_profiles_active on profiles(is_active);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Función: crear perfil automáticamente al registrar usuario
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── TABLA: courses ────────────────────────────────────────────
create table courses (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions(id) on delete set null,
  instructor_id   uuid references profiles(id) on delete set null,
  title           text not null,
  slug            text not null unique,
  description     text,
  thumbnail_url   text,
  category        text,
  level           course_level not null default 'beginner',
  duration_hours  numeric(5,1),
  is_published    boolean not null default false,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_courses_institution on courses(institution_id);
create index idx_courses_instructor on courses(instructor_id);
create index idx_courses_published on courses(is_published);
create index idx_courses_featured on courses(is_featured);
create index idx_courses_category on courses(category);
create index idx_courses_slug on courses(slug);

create trigger trg_courses_updated_at
  before update on courses
  for each row execute function set_updated_at();

-- ── TABLA: course_modules ─────────────────────────────────────
create table course_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  title       text not null,
  description text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_modules_course on course_modules(course_id);
create index idx_modules_order on course_modules(course_id, order_index);

create trigger trg_modules_updated_at
  before update on course_modules
  for each row execute function set_updated_at();

-- ── TABLA: lessons ────────────────────────────────────────────
create table lessons (
  id                 uuid primary key default gen_random_uuid(),
  module_id          uuid not null references course_modules(id) on delete cascade,
  title              text not null,
  description        text,
  content_type       content_type not null default 'video',
  content_url        text,
  duration_minutes   integer,
  order_index        integer not null default 0,
  is_free_preview    boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_lessons_module on lessons(module_id);
create index idx_lessons_order on lessons(module_id, order_index);

create trigger trg_lessons_updated_at
  before update on lessons
  for each row execute function set_updated_at();

-- ── TABLA: enrollments ───────────────────────────────────────
create table enrollments (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid not null references profiles(id) on delete cascade,
  course_id        uuid not null references courses(id) on delete cascade,
  enrolled_at      timestamptz not null default now(),
  completed_at     timestamptz,
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  is_active        boolean not null default true,
  unique(student_id, course_id)
);

create index idx_enrollments_student on enrollments(student_id);
create index idx_enrollments_course on enrollments(course_id);
create index idx_enrollments_active on enrollments(is_active);
create index idx_enrollments_enrolled_at on enrollments(enrolled_at);

-- ── TABLA: lesson_progress ───────────────────────────────────
create table lesson_progress (
  id                     uuid primary key default gen_random_uuid(),
  student_id             uuid not null references profiles(id) on delete cascade,
  lesson_id              uuid not null references lessons(id) on delete cascade,
  enrollment_id          uuid not null references enrollments(id) on delete cascade,
  is_completed           boolean not null default false,
  completed_at           timestamptz,
  last_position_seconds  integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique(student_id, lesson_id)
);

create index idx_progress_student on lesson_progress(student_id);
create index idx_progress_lesson on lesson_progress(lesson_id);
create index idx_progress_enrollment on lesson_progress(enrollment_id);

create trigger trg_progress_updated_at
  before update on lesson_progress
  for each row execute function set_updated_at();

-- ── TABLA: assessments ───────────────────────────────────────
create table assessments (
  id                  uuid primary key default gen_random_uuid(),
  course_id           uuid not null references courses(id) on delete cascade,
  title               text not null,
  description         text,
  passing_score       integer not null default 70 check (passing_score between 0 and 100),
  max_attempts        integer not null default 3,
  time_limit_minutes  integer,
  is_published        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_assessments_course on assessments(course_id);
create index idx_assessments_published on assessments(is_published);

create trigger trg_assessments_updated_at
  before update on assessments
  for each row execute function set_updated_at();

-- ── TABLA: questions ─────────────────────────────────────────
create table questions (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid not null references assessments(id) on delete cascade,
  question_text   text not null,
  question_type   question_type not null default 'multiple_choice',
  options         jsonb,
  correct_answer  text not null,
  points          integer not null default 1,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_questions_assessment on questions(assessment_id);
create index idx_questions_order on questions(assessment_id, order_index);

-- ── TABLA: certificates ──────────────────────────────────────
create table certificates (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references profiles(id) on delete cascade,
  course_id         uuid not null references courses(id) on delete cascade,
  enrollment_id     uuid not null references enrollments(id) on delete cascade,
  certificate_code  text not null unique default 'PLV-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  issued_at         timestamptz not null default now(),
  expires_at        timestamptz,
  pdf_url           text
);

create index idx_certificates_student on certificates(student_id);
create index idx_certificates_course on certificates(course_id);
create index idx_certificates_code on certificates(certificate_code);

-- ── TABLA: media_library ─────────────────────────────────────
create table media_library (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions(id) on delete set null,
  uploaded_by     uuid not null references profiles(id) on delete cascade,
  file_name       text not null,
  file_type       text not null,
  file_size       bigint not null,
  storage_path    text not null unique,
  public_url      text,
  created_at      timestamptz not null default now()
);

create index idx_media_institution on media_library(institution_id);
create index idx_media_uploader on media_library(uploaded_by);
create index idx_media_type on media_library(file_type);

-- ── TABLA: ai_conversations ──────────────────────────────────
create table ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text,
  context    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_ai_conv_user on ai_conversations(user_id);

create trigger trg_ai_conv_updated_at
  before update on ai_conversations
  for each row execute function set_updated_at();

-- ── TABLA: ai_messages ───────────────────────────────────────
create table ai_messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references ai_conversations(id) on delete cascade,
  role             ai_message_role not null,
  content          text not null,
  tokens_used      integer,
  created_at       timestamptz not null default now()
);

create index idx_ai_msg_conversation on ai_messages(conversation_id);
create index idx_ai_msg_created on ai_messages(created_at);

-- ── TABLA: audit_logs ────────────────────────────────────────
create table audit_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references profiles(id) on delete set null,
  action       text not null,
  entity_type  text not null,
  entity_id    uuid,
  old_values   jsonb,
  new_values   jsonb,
  ip_address   inet,
  created_at   timestamptz not null default now()
);

create index idx_audit_user on audit_logs(user_id);
create index idx_audit_entity on audit_logs(entity_type, entity_id);
create index idx_audit_created on audit_logs(created_at);

-- ── TABLA: lesson_videos ─────────────────────────────────────
-- Cada lección puede tener exactamente un video almacenado en
-- Supabase Storage bajo el bucket "lesson-videos".
create table lesson_videos (
  id               uuid primary key default gen_random_uuid(),
  lesson_id        uuid not null references lessons(id) on delete cascade,
  storage_path     text not null,         -- path dentro del bucket, ej: courses/uuid/module/lesson/video.mp4
  public_url       text,                  -- URL pública si el bucket es público, null si es privado (signed URLs)
  duration_seconds integer,
  resolution       text,                  -- '1080p', '720p', '480p'
  size_bytes       bigint,
  is_processed     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique(lesson_id)                       -- una lección → un video activo
);

create index idx_lesson_videos_lesson on lesson_videos(lesson_id);
create index idx_lesson_videos_processed on lesson_videos(is_processed);

create trigger trg_lesson_videos_updated_at
  before update on lesson_videos
  for each row execute function set_updated_at();

-- ── TABLA: video_progress ────────────────────────────────────
-- Registra la posición de reproducción de cada estudiante por video.
-- El frontend hace upsert cada N segundos (heartbeat).
create table video_progress (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid not null references profiles(id) on delete cascade,
  lesson_id        uuid not null references lessons(id) on delete cascade,
  video_id         uuid not null references lesson_videos(id) on delete cascade,
  position_seconds integer not null default 0,
  duration_seconds integer,
  percent_watched  numeric(5,2) not null default 0 check (percent_watched between 0 and 100),
  is_completed     boolean not null default false,
  completed_at     timestamptz,
  last_watched_at  timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique(student_id, video_id)
);

create index idx_video_progress_student on video_progress(student_id);
create index idx_video_progress_lesson on video_progress(lesson_id);
create index idx_video_progress_video on video_progress(video_id);
create index idx_video_progress_completed on video_progress(student_id, is_completed);

create trigger trg_video_progress_updated_at
  before update on video_progress
  for each row execute function set_updated_at();
