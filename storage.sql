-- ═══════════════════════════════════════════════════════════════
--  Plavih Hotel Academy — Storage buckets y policies
--  Ejecutar DESPUÉS de schema.sql y policies.sql
-- ═══════════════════════════════════════════════════════════════

-- ── Bucket: lesson-videos ────────────────────────────────────
-- Privado: los videos se sirven mediante signed URLs (1h por defecto)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lesson-videos',
  'lesson-videos',
  false,                                         -- privado: requiere signed URL
  524288000,                                     -- 500 MB por archivo
  array['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
on conflict (id) do nothing;

-- ── Bucket: thumbnails ───────────────────────────────────────
-- Público: imágenes de portada de cursos y lecciones
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'thumbnails',
  'thumbnails',
  true,                                          -- público: CDN directo
  5242880,                                       -- 5 MB por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- ── Bucket: certificates ─────────────────────────────────────
-- Privado: PDFs de certificados por estudiante
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'certificates',
  'certificates',
  false,
  10485760,                                      -- 10 MB
  array['application/pdf']
)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- POLICIES: lesson-videos
-- ────────────────────────────────────────────────────────────

-- Estudiantes pueden descargar videos de cursos donde están inscritos
create policy "videos: enrolled student download"
  on storage.objects for select
  using (
    bucket_id = 'lesson-videos'
    and (
      -- instructores, admins y superadmins ven todo
      (select role from profiles where id = auth.uid()) in ('superadmin', 'admin', 'instructor')
      or
      -- estudiante inscrito activo
      exists (
        select 1
        from lesson_videos lv
        join lessons l on l.id = lv.lesson_id
        join course_modules cm on cm.id = l.module_id
        join enrollments e on e.course_id = cm.course_id
        where lv.storage_path = storage.objects.name
          and e.student_id = auth.uid()
          and e.is_active = true
      )
    )
  );

-- Solo instructores/admins pueden subir videos
create policy "videos: instructor upload"
  on storage.objects for insert
  with check (
    bucket_id = 'lesson-videos'
    and (select role from profiles where id = auth.uid()) in ('superadmin', 'admin', 'instructor')
  );

-- Solo admins y superadmin pueden borrar videos
create policy "videos: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'lesson-videos'
    and (select role from profiles where id = auth.uid()) in ('superadmin', 'admin')
  );

-- ────────────────────────────────────────────────────────────
-- POLICIES: thumbnails (bucket público — solo control de escritura)
-- ────────────────────────────────────────────────────────────

create policy "thumbnails: public read"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy "thumbnails: instructor upload"
  on storage.objects for insert
  with check (
    bucket_id = 'thumbnails'
    and (select role from profiles where id = auth.uid()) in ('superadmin', 'admin', 'instructor')
  );

create policy "thumbnails: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'thumbnails'
    and (select role from profiles where id = auth.uid()) in ('superadmin', 'admin')
  );

-- ────────────────────────────────────────────────────────────
-- POLICIES: certificates
-- ────────────────────────────────────────────────────────────

-- El estudiante solo ve sus propios certificados
create policy "certificates: student reads own"
  on storage.objects for select
  using (
    bucket_id = 'certificates'
    and (
      (select role from profiles where id = auth.uid()) in ('superadmin', 'admin')
      or name like auth.uid()::text || '/%'
    )
  );

create policy "certificates: system insert"
  on storage.objects for insert
  with check (
    bucket_id = 'certificates'
    and (select role from profiles where id = auth.uid()) in ('superadmin', 'admin')
  );
