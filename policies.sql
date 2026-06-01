-- ═══════════════════════════════════════════════════════════════
--  Plavih — RLS Policies
--  Ejecutar DESPUÉS de schema.sql
-- ═══════════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
alter table institutions     enable row level security;
alter table profiles         enable row level security;
alter table courses          enable row level security;
alter table course_modules   enable row level security;
alter table lessons          enable row level security;
alter table enrollments      enable row level security;
alter table lesson_progress  enable row level security;
alter table assessments      enable row level security;
alter table questions        enable row level security;
alter table certificates     enable row level security;
alter table media_library    enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages      enable row level security;
alter table audit_logs       enable row level security;

-- Función helper: obtener rol del usuario actual
create or replace function auth_role()
returns user_role as $$
  select role from profiles where id = auth.uid()
$$ language sql security definer stable;

-- Función helper: obtener institution_id del usuario actual
create or replace function auth_institution_id()
returns uuid as $$
  select institution_id from profiles where id = auth.uid()
$$ language sql security definer stable;

-- ── POLICIES: profiles ───────────────────────────────────────

-- Todos pueden ver perfiles activos de su institución
create policy "profiles: read own or same institution"
  on profiles for select
  using (
    id = auth.uid()
    or auth_role() in ('superadmin', 'admin')
    or institution_id = auth_institution_id()
  );

-- Solo el propio usuario puede actualizar su perfil
create policy "profiles: update own"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Solo superadmin puede insertar perfiles manualmente
create policy "profiles: insert superadmin"
  on profiles for insert
  with check (auth_role() = 'superadmin');

-- Solo superadmin puede eliminar perfiles
create policy "profiles: delete superadmin"
  on profiles for delete
  using (auth_role() = 'superadmin');

-- ── POLICIES: institutions ───────────────────────────────────

create policy "institutions: superadmin full access"
  on institutions for all
  using (auth_role() = 'superadmin');

create policy "institutions: admin read own"
  on institutions for select
  using (
    auth_role() = 'admin' and id = auth_institution_id()
  );

create policy "institutions: public read active"
  on institutions for select
  using (is_active = true);

-- ── POLICIES: courses ─────────────────────────────────────────

-- Todos los usuarios autenticados pueden ver cursos publicados de su institución
create policy "courses: read published"
  on courses for select
  using (
    is_published = true
    and (
      institution_id is null
      or institution_id = auth_institution_id()
      or auth_role() in ('superadmin', 'admin')
    )
  );

-- Superadmin ve todos los cursos
create policy "courses: superadmin full"
  on courses for all
  using (auth_role() = 'superadmin');

-- Admin ve y gestiona cursos de su institución
create policy "courses: admin manage own institution"
  on courses for all
  using (
    auth_role() = 'admin'
    and institution_id = auth_institution_id()
  );

-- Instructor gestiona solo sus cursos
create policy "courses: instructor manage own"
  on courses for all
  using (
    auth_role() = 'instructor'
    and instructor_id = auth.uid()
  );

-- ── POLICIES: enrollments ────────────────────────────────────

create policy "enrollments: student read own"
  on enrollments for select
  using (student_id = auth.uid() or auth_role() in ('superadmin', 'admin', 'instructor'));

create policy "enrollments: student insert own"
  on enrollments for insert
  with check (student_id = auth.uid());

create policy "enrollments: admin manage"
  on enrollments for all
  using (auth_role() in ('superadmin', 'admin'));

-- ── POLICIES: lesson_progress ────────────────────────────────

create policy "progress: student manage own"
  on lesson_progress for all
  using (student_id = auth.uid());

create policy "progress: instructor read"
  on lesson_progress for select
  using (auth_role() in ('superadmin', 'admin', 'instructor'));

-- ── POLICIES: certificates ───────────────────────────────────

create policy "certificates: student read own"
  on certificates for select
  using (
    student_id = auth.uid()
    or auth_role() in ('superadmin', 'admin')
  );

create policy "certificates: admin insert"
  on certificates for insert
  with check (auth_role() in ('superadmin', 'admin'));

-- ── POLICIES: ai_conversations ───────────────────────────────

create policy "ai_conversations: user manage own"
  on ai_conversations for all
  using (user_id = auth.uid());

create policy "ai_messages: user manage own"
  on ai_messages for all
  using (
    conversation_id in (
      select id from ai_conversations where user_id = auth.uid()
    )
  );

-- ── POLICIES: audit_logs ─────────────────────────────────────

create policy "audit_logs: superadmin read all"
  on audit_logs for select
  using (auth_role() = 'superadmin');

create policy "audit_logs: system insert"
  on audit_logs for insert
  with check (true);

-- ── POLICIES: media_library ──────────────────────────────────

create policy "media: read own institution"
  on media_library for select
  using (
    institution_id = auth_institution_id()
    or auth_role() = 'superadmin'
    or uploaded_by = auth.uid()
  );

create policy "media: insert authenticated"
  on media_library for insert
  with check (uploaded_by = auth.uid());

create policy "media: delete own or admin"
  on media_library for delete
  using (
    uploaded_by = auth.uid()
    or auth_role() in ('superadmin', 'admin')
  );

-- ── RLS: lesson_videos ───────────────────────────────────────
alter table lesson_videos enable row level security;

create policy "lesson_videos: enrolled students can read"
  on lesson_videos for select
  using (
    auth_role() in ('superadmin', 'admin', 'instructor')
    or exists (
      select 1 from lessons l
      join course_modules cm on cm.id = l.module_id
      join enrollments e on e.course_id = cm.course_id
      where l.id = lesson_videos.lesson_id
        and e.student_id = auth.uid()
        and e.is_active = true
    )
  );

create policy "lesson_videos: instructor/admin insert"
  on lesson_videos for insert
  with check (auth_role() in ('superadmin', 'admin', 'instructor'));

create policy "lesson_videos: instructor/admin update"
  on lesson_videos for update
  using (auth_role() in ('superadmin', 'admin', 'instructor'));

create policy "lesson_videos: admin delete"
  on lesson_videos for delete
  using (auth_role() in ('superadmin', 'admin'));

-- ── RLS: video_progress ──────────────────────────────────────
alter table video_progress enable row level security;

create policy "video_progress: student reads own"
  on video_progress for select
  using (student_id = auth.uid() or auth_role() in ('superadmin', 'admin', 'instructor'));

create policy "video_progress: student upserts own"
  on video_progress for insert
  with check (student_id = auth.uid());

create policy "video_progress: student updates own"
  on video_progress for update
  using (student_id = auth.uid());
