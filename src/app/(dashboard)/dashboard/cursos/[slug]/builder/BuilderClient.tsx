'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createModuleAction,
  updateModuleAction,
  deleteModuleAction,
  createLessonAction,
  deleteLessonAction,
} from '@/lib/course/actions'
import type { BuilderCourse, BuilderModule, BuilderLesson } from '@/lib/course/queries'

// ── Shared styles ─────────────────────────────────────────────
const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0]'
const btnPrimary =
  'bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-50'
const btnGhost =
  'text-[#5F6368] hover:text-[#222222] text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors'

const videoStatusConfig = {
  pending:    { label: 'Subido — verificando', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Procesando…',           color: 'bg-blue-100 text-blue-700' },
  ready:      { label: 'Listo ✓',               color: 'bg-green-100 text-green-700' },
  error:      { label: 'Error',                 color: 'bg-red-100 text-red-700' },
}

// ── Add Module form ───────────────────────────────────────────

function AddModuleForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createModuleAction(courseId, { ok: true }, fd)
      if (result.ok) { onDone(); router.refresh() }
      else setError(result.error)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 p-4 bg-[#F5F7FA] rounded-xl border border-dashed border-gray-300">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div>
        <label className="block text-xs font-medium text-[#222222] mb-1">Título del módulo *</label>
        <input name="title" type="text" required placeholder="ej. Módulo 1 — Fundamentos" className={inputCls} disabled={pending} />
      </div>
      <input name="description" type="hidden" value="" />
      <input name="order_index" type="hidden" value="99" />
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? 'Creando…' : 'Crear módulo'}
        </button>
        <button type="button" onClick={onDone} className={btnGhost}>Cancelar</button>
      </div>
    </form>
  )
}

// ── Add Lesson form ───────────────────────────────────────────

function AddLessonForm({
  moduleId,
  courseId,
  onDone,
}: {
  moduleId: string
  courseId: string
  onDone: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createLessonAction(moduleId, courseId, { ok: true }, fd)
      if (result.ok) { onDone(); router.refresh() }
      else setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-white rounded-xl border border-dashed border-gray-200">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input name="order_index" type="hidden" value="99" />
      <input name="is_free_preview" type="hidden" value="false" />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[#222222] mb-1">Título *</label>
          <input name="title" type="text" required placeholder="ej. Introducción" className={inputCls} disabled={pending} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#222222] mb-1">Tipo</label>
          <select name="content_type" className={inputCls} disabled={pending}>
            <option value="video">Video</option>
            <option value="text">Texto</option>
            <option value="quiz">Evaluación</option>
            <option value="file">Archivo</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#222222] mb-1">Duración (minutos)</label>
        <input name="duration_minutes" type="number" min="1" placeholder="10" className={inputCls} disabled={pending} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? 'Creando…' : 'Agregar lección'}
        </button>
        <button type="button" onClick={onDone} className={btnGhost}>Cancelar</button>
      </div>
    </form>
  )
}

// ── Lesson row ────────────────────────────────────────────────

function LessonRow({
  lesson,
  courseSlug,
  courseId,
  moduleId,
}: {
  lesson: BuilderLesson
  courseSlug: string
  courseId: string
  moduleId: string
}) {
  const [deleting, startDelete] = useTransition()
  const router = useRouter()

  const contentTypeIcon: Record<string, string> = {
    video: '🎬', text: '📄', quiz: '📝', file: '📎',
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar la lección "${lesson.title}"?`)) return
    startDelete(async () => {
      await deleteLessonAction(lesson.id, courseId)
      router.refresh()
    })
  }

  const videoStatus = lesson.video?.processing_status ?? null
  const statusCfg = videoStatus ? videoStatusConfig[videoStatus] : null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F7FA] transition-colors rounded-lg">
      <span className="text-sm shrink-0">{contentTypeIcon[lesson.content_type] ?? '📄'}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#222222] truncate">{lesson.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {lesson.duration_minutes && (
            <span className="text-xs text-[#5F6368]">{lesson.duration_minutes} min</span>
          )}
          {lesson.is_free_preview && (
            <span className="text-xs text-[#00A9E0] font-medium">Vista previa</span>
          )}
          {statusCfg && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          )}
          {lesson.content_type === 'video' && !lesson.video && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Sin video
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {lesson.content_type === 'video' && (
          <Link
            href={`/dashboard/cursos/${courseSlug}/builder/lecciones/${lesson.id}/video`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
              lesson.video
                ? 'border-gray-200 text-[#5F6368] hover:border-[#00A9E0] hover:text-[#00A9E0]'
                : 'border-[#00A9E0] text-[#00A9E0] bg-blue-50 hover:bg-[#00A9E0] hover:text-white'
            }`}
          >
            {lesson.video ? 'Reemplazar video' : '+ Subir video'}
          </Link>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-full transition-colors disabled:opacity-50"
          title="Eliminar lección"
        >
          {deleting ? '…' : '✕'}
        </button>
      </div>
    </div>
  )
}

// ── Edit Module form ──────────────────────────────────────────

function EditModuleForm({
  module,
  courseId,
  onDone,
}: {
  module: BuilderModule
  courseId: string
  onDone: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateModuleAction(module.id, courseId, { ok: true }, fd)
      if (result.ok) { onDone(); router.refresh() }
      else setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-5 py-3 bg-[#F5F7FA] border-b border-gray-100">
      {error && <p className="text-xs text-red-600 mr-2">{error}</p>}
      <input
        name="title"
        defaultValue={module.title}
        required
        autoFocus
        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0]"
        disabled={pending}
      />
      <input name="description" type="hidden" value={module.description ?? ''} />
      <input name="order_index" type="hidden" value={module.order_index} />
      <button type="submit" disabled={pending}
        className="text-xs font-semibold bg-[#00A9E0] hover:bg-[#007FA8] text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50">
        {pending ? '…' : 'Guardar'}
      </button>
      <button type="button" onClick={onDone}
        className="text-xs text-[#5F6368] hover:text-[#222222] px-3 py-1.5 rounded-full border border-gray-200 transition-colors">
        Cancelar
      </button>
    </form>
  )
}

// ── Module card ───────────────────────────────────────────────

function ModuleCard({
  module,
  courseSlug,
  courseId,
}: {
  module: BuilderModule
  courseSlug: string
  courseId: string
}) {
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, startDelete] = useTransition()
  const router = useRouter()

  function handleDeleteModule() {
    if (!confirm(`¿Eliminar el módulo "${module.title}" y todas sus lecciones?`)) return
    startDelete(async () => {
      await deleteModuleAction(module.id, courseId)
      router.refresh()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Module header */}
      {editing ? (
        <EditModuleForm module={module} courseId={courseId} onDone={() => setEditing(false)} />
      ) : (
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#F5F7FA] border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#222222] text-sm truncate">{module.title}</h3>
          {module.description && (
            <p className="text-xs text-[#5F6368] mt-0.5 truncate">{module.description}</p>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-[#5F6368] hover:text-[#222222] hover:bg-white px-2.5 py-1 rounded-full transition-colors border border-gray-200"
        >
          Editar
        </button>
        <button
          onClick={handleDeleteModule}
          disabled={deleting}
          className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
        >
          {deleting ? '…' : 'Eliminar'}
        </button>
      </div>
      )}

      {/* Lessons */}
      <div className="p-3 space-y-0.5">
        {module.lessons.length === 0 ? (
          <p className="text-xs text-[#5F6368] text-center py-4">Sin lecciones todavía.</p>
        ) : (
          module.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              courseSlug={courseSlug}
              courseId={courseId}
              moduleId={module.id}
            />
          ))
        )}

        {showAddLesson ? (
          <div className="mt-2">
            <AddLessonForm
              moduleId={module.id}
              courseId={courseId}
              onDone={() => setShowAddLesson(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAddLesson(true)}
            className="w-full mt-1 text-xs font-medium text-[#00A9E0] hover:text-[#007FA8] py-2 rounded-lg border border-dashed border-[#00A9E0]/40 hover:border-[#00A9E0] transition-colors"
          >
            + Agregar lección
          </button>
        )}
      </div>
    </div>
  )
}

// ── Builder root ──────────────────────────────────────────────

export default function BuilderClient({
  course,
  isMock,
}: {
  course: BuilderCourse
  isMock: boolean
}) {
  const [showAddModule, setShowAddModule] = useState(false)

  return (
    <div className="space-y-4">
      {course.modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="text-4xl mb-3 block">📦</span>
          <p className="text-[#5F6368] font-medium mb-1">Este curso no tiene módulos</p>
          <p className="text-xs text-[#5F6368]">Agrega el primer módulo para estructurar el contenido.</p>
        </div>
      ) : (
        course.modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            courseSlug={course.slug}
            courseId={course.id}
          />
        ))
      )}

      {showAddModule ? (
        <AddModuleForm
          courseId={course.id}
          onDone={() => setShowAddModule(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddModule(true)}
          disabled={isMock}
          className="w-full py-3 text-sm font-semibold text-[#00A9E0] hover:text-[#007FA8] border-2 border-dashed border-[#00A9E0]/40 hover:border-[#00A9E0] rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Agregar módulo
        </button>
      )}
    </div>
  )
}
