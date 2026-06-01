-- ═══════════════════════════════════════════════════════════════
--  Plavih — Datos de demostración
--  Ejecutar DESPUÉS de schema.sql y policies.sql
--  NOTA: Los usuarios demo deben crearse primero en Auth de Supabase
-- ═══════════════════════════════════════════════════════════════

-- ── Instituciones demo ───────────────────────────────────────
insert into institutions (id, name, slug, contact_email, contact_phone, address, is_active)
values
  ('00000000-0000-0000-0000-000000000001', 'GEH Suites Hotels',     'geh-suites',     'formacion@gehsuites.com', '+57 5 123 4567', 'Cartagena, Colombia', true),
  ('00000000-0000-0000-0000-000000000002', 'Hotel Boquilla Suites', 'boquilla-suites', 'info@boquillasuites.com', '+57 5 234 5678', 'Barranquilla, Colombia', true),
  ('00000000-0000-0000-0000-000000000003', 'Madisson Inn',          'madisson-inn',    'info@madissoninn.com',    '+57 5 345 6789', 'Santa Marta, Colombia', true),
  ('00000000-0000-0000-0000-000000000004', 'Windsor House',         'windsor-house',   'info@windsorhouse.com',   '+57 5 456 7890', 'Medellín, Colombia', false);

-- ── Perfiles demo (IDs ficticios — reemplazar con IDs reales de auth.users) ──
-- Los perfiles se crean automáticamente al registrar usuarios vía trigger.
-- Para insertar manualmente en desarrollo:

/*
insert into profiles (id, email, full_name, role, institution_id, position, is_active)
values
  ('11111111-0000-0000-0000-000000000001', 'superadmin@plavih.com',       'Demo Superadmin',               'superadmin', null,                                         'Super Administrador',               true),
  ('11111111-0000-0000-0000-000000000002', 'admin@gehsuites.com',         'Admin GEH Suites',              'admin',      '00000000-0000-0000-0000-000000000001',        'Administrador de Plataforma',       true),
  ('11111111-0000-0000-0000-000000000003', 'rcardenas@gehsuites.com',     'Rosa Cárdenas',                 'instructor', '00000000-0000-0000-0000-000000000001',        'Especialista en Gestión Hotelera',  true),
  ('11111111-0000-0000-0000-000000000004', 'jlopez@gehsuites.com',        'Juan López',                    'instructor', '00000000-0000-0000-0000-000000000001',        'Jefe de Operaciones',               true),
  ('11111111-0000-0000-0000-000000000005', 'angely.villa@gehsuites.com',  'Angely Carolina Villa Villa',   'student',    '00000000-0000-0000-0000-000000000001',        'Recepcionista',                     true),
  ('11111111-0000-0000-0000-000000000006', 'belcy.perez@gehsuites.com',   'Belcy Alejandra Pérez Seña',    'student',    '00000000-0000-0000-0000-000000000001',        'Recepcionista',                     true),
  ('11111111-0000-0000-0000-000000000007', 'brenda.roa@gehsuites.com',    'Brenda Roa De La Espriella',    'student',    '00000000-0000-0000-0000-000000000001',        'Recepcionista',                     true),
  ('11111111-0000-0000-0000-000000000008', 'jarsy.barbosa@gehsuites.com', 'Jarsy Barbosa',                 'student',    '00000000-0000-0000-0000-000000000001',        'Gerente',                           true);
*/

-- ── Cursos demo ──────────────────────────────────────────────
insert into courses (id, institution_id, title, slug, description, category, level, duration_hours, is_published, is_featured)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Capacitación para Recepcionistas de Hotel', 'recepcionista-hotel',        'Domina check-in, check-out, reservas y atención al huésped.',       'Operaciones',      'beginner',     8,    true,  true),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Capacitación para Botones de Hotel',         'botones-hotel',              'Estándares de servicio, manejo de equipaje y atención al huésped.', 'Operaciones',      'beginner',     4,    true,  true),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Capacitación para Meseros',                  'meseros-hotel',              'Protocolo de alimentos y bebidas, servicio en mesa.',               'Alimentos y Beb.', 'beginner',     6,    true,  true),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Curso para Camareras de Hotel',              'camareras-hotel',            'Estándares de limpieza y housekeeping.',                            'Housekeeping',     'beginner',     5,    true,  false),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Conoce GEH Suites',                          'conoce-geh-suites',          'Inducción a la cultura y valores de GEH Suites Hotels.',            'Inducción',        'beginner',     3,    true,  false),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Administradores y Jefes de Operación',       'administradores-jefes',      'Liderazgo, KPIs y gestión de equipos hoteleros.',                   'Liderazgo',        'advanced',     10,   true,  true),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'ValerIA: Agente Inteligente de Reservas',    'valeria-agente-reservas',    'Trabaja con IA aplicada a reservas hoteleras.',                     'Tecnología e IA',  'intermediate', 4,    true,  true),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Capacidades de Innovación',                  'capacidades-innovacion',     'Metodologías de innovación para el sector hotelero.',               'Innovación',       'intermediate', 6,    true,  true);
