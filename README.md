# Plavih Hotel Academy

**Plataforma LMS de formación virtual especializada en hotelería**  
Una iniciativa del equipo de innovación de [GEH Suites Hotels](https://gehsuites.com)

---

## ¿Qué es Plavih?

Plavih Hotel Academy es una plataforma educativa virtual diseñada para capacitar a los colaboradores de la industria hotelera. Combina cursos especializados, evaluaciones, certificados y un asistente de inteligencia artificial (ValerIA) para ofrecer una experiencia de aprendizaje moderna y accesible.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend / Full-stack | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| IA | Claude API — Fase 2 |
| Deployment | Vercel (recomendado) |

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/          # Sitio público: home, cursos, blog, nosotros
│   ├── (auth)/            # Autenticación: acceder, registro, recuperar
│   └── (dashboard)/       # Zona privada: dashboard por rol
│       └── dashboard/
│           ├── page.tsx   # Dashboard principal (rol-aware)
│           ├── usuarios/
│           ├── instituciones/
│           ├── cursos/
│           ├── inscripciones/
│           ├── evaluaciones/
│           ├── certificados/
│           ├── biblioteca/
│           ├── reportes/
│           ├── ia/
│           └── perfil/
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── dashboard/         # Sidebar, StatsCard, DashboardHeader
│   └── courses/           # CourseCard
├── lib/
│   ├── supabase/          # Browser client, Server client
│   ├── auth/              # session.ts, roles.ts
│   ├── permissions/       # Matriz de permisos por rol
│   ├── ai/                # Placeholder ValerIA
│   ├── mocks/             # Datos demo para desarrollo
│   └── data/              # Datos estáticos del catálogo
├── types/                 # Tipos globales TypeScript
└── proxy.ts               # Protección de rutas (Next.js 16)

supabase/
├── schema.sql             # Tablas, triggers, funciones
├── policies.sql           # RLS policies
└── seed.sql               # Datos de demostración
```

## Roles del sistema

| Rol | Acceso |
|---|---|
| `superadmin` | Todo: instituciones, usuarios, cursos, reportes globales |
| `admin` | Su institución: usuarios, cursos, inscripciones, reportes |
| `instructor` | Sus cursos, estudiantes, evaluaciones |
| `student` | Sus cursos asignados, progreso, certificados |

## Configuración inicial

### 1. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Base de datos Supabase

En el SQL Editor de tu proyecto Supabase, ejecuta en orden:

```sql
-- 1. Schema: tablas, triggers, índices
\i supabase/schema.sql

-- 2. Políticas RLS
\i supabase/policies.sql

-- 3. Datos demo
\i supabase/seed.sql
```

### 3. Usuarios demo

Crea estos usuarios en **Supabase → Authentication → Users** y luego actualiza su `role` en la tabla `profiles`:

| Email | Contraseña | Rol |
|---|---|---|
| `superadmin@plavih.com` | `Plavih2024!` | `superadmin` |
| `admin@gehsuites.com` | `Plavih2024!` | `admin` |
| `rcardenas@gehsuites.com` | `Plavih2024!` | `instructor` |
| `angely.villa@gehsuites.com` | `Plavih2024!` | `student` |

### 4. Correr en desarrollo

```bash
npm install
npm run dev
# → http://localhost:3000
```

> **Nota:** Sin variables de entorno configuradas, el dashboard muestra datos mock automáticamente para facilitar el desarrollo local.

## Tablas de la base de datos

| Tabla | Descripción |
|---|---|
| `profiles` | Extiende `auth.users` con rol, institución, cargo |
| `institutions` | Hoteles y organizaciones |
| `courses` | Catálogo de cursos |
| `course_modules` | Módulos por curso |
| `lessons` | Lecciones (video, texto, quiz, archivo) |
| `enrollments` | Inscripciones de estudiantes a cursos |
| `lesson_progress` | Progreso por lección |
| `assessments` | Evaluaciones por curso |
| `questions` | Preguntas de evaluaciones |
| `certificates` | Certificados emitidos |
| `media_library` | Biblioteca de archivos y videos |
| `ai_conversations` | Conversaciones con ValerIA |
| `ai_messages` | Mensajes individuales del chat IA |
| `audit_logs` | Registro de acciones del sistema |

## Fases de desarrollo

| Fase | Estado | Descripción |
|---|---|---|
| **Fase 0** | ✅ Completa | Sitio público: home, cursos, blog, nosotros, clientes |
| **Fase 1** | ✅ Completa | Arquitectura LMS: auth, roles, Supabase, dashboards |
| **Fase 2** | 🔜 Próxima | Auth real, player de video, evaluaciones, certificados PDF |
| **Fase 3** | 🔜 Futura | ValerIA con Claude API, reportes avanzados, notificaciones |

## Licencia

Proyecto privado. Todos los derechos reservados.  
© 2024 Plavih Hotel Academy — GEH Suites Hotels

---

*Desarrollado con ❤️ para elevar los estándares de formación en la industria hotelera colombiana.*
