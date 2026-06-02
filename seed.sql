-- ═══════════════════════════════════════════════════════════════
--  Plavih — Datos de demostracion
--  Ejecutar DESPUES de schema.sql y policies.sql
--  NOTA: Los usuarios demo deben crearse primero en Auth de Supabase
-- ═══════════════════════════════════════════════════════════════

-- ── Instituciones demo ───────────────────────────────────────
insert into institutions (id, name, slug, contact_email, contact_phone, address, is_active)
values
  ('00000000-0000-0000-0000-000000000001', 'GEH Suites Hotels',     'geh-suites',     'formacion@gehsuites.com', '+57 5 123 4567', 'Cartagena, Colombia', true),
  ('00000000-0000-0000-0000-000000000002', 'Hotel Boquilla Suites', 'boquilla-suites', 'info@boquillasuites.com', '+57 5 234 5678', 'Barranquilla, Colombia', true),
  ('00000000-0000-0000-0000-000000000003', 'Madisson Inn',          'madisson-inn',    'info@madissoninn.com',    '+57 5 345 6789', 'Santa Marta, Colombia', true),
  ('00000000-0000-0000-0000-000000000004', 'Windsor House',         'windsor-house',   'info@windsorhouse.com',   '+57 5 456 7890', 'Medellin, Colombia', false);

-- ── Cursos demo ──────────────────────────────────────────────
insert into courses (id, institution_id, title, slug, description, category, level, duration_hours, is_published, is_featured)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Capacitacion para Recepcionistas de Hotel', 'recepcionista-hotel',     'Domina check-in, check-out, reservas y atencion al huesped.',       'Operaciones',      'beginner',     8,  true, true),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Capacitacion para Botones de Hotel',        'botones-hotel',           'Estandares de servicio, manejo de equipaje y atencion al huesped.', 'Operaciones',      'beginner',     4,  true, true),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Capacitacion para Meseros',                 'meseros-hotel',           'Protocolo de alimentos y bebidas, servicio en mesa.',               'Alimentos',        'beginner',     6,  true, true),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Curso para Camareras de Hotel',             'camareras-hotel',         'Estandares de limpieza y housekeeping.',                            'Housekeeping',     'beginner',     5,  true, false),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Conoce GEH Suites',                         'conoce-geh-suites',       'Induccion a la cultura y valores de GEH Suites Hotels.',            'Induccion',        'beginner',     3,  true, false),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Administradores y Jefes de Operacion',      'administradores-jefes',   'Liderazgo, KPIs y gestion de equipos hoteleros.',                   'Liderazgo',        'advanced',     10, true, true),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'ValerIA: Agente Inteligente de Reservas',   'valeria-agente-reservas', 'Trabaja con IA aplicada a reservas hoteleras.',                     'Tecnologia e IA',  'intermediate', 4,  true, true),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Capacidades de Innovacion',                 'capacidades-innovacion',  'Metodologias de innovacion para el sector hotelero.',               'Innovacion',       'intermediate', 6,  true, true);
