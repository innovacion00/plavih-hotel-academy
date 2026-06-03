'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addQuestionAction, deleteQuestionAction, toggleAssessmentPublished } from '@/lib/assessments/actions'
import type { Question } from '@/lib/assessments/queries'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50'
const labelCls = 'block text-xs font-medium text-[#222222] mb-1'

function AddQuestionForm({ assessmentId, onDone }: { assessmentId: string; onDone: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<'multiple_choice' | 'true_false' | 'short_answer'>('multiple_choice')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await addQuestionAction(assessmentId, { ok: true }, fd)
      if (result.ok) { onDone(); router.refresh() }
      else setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-[#F5F7FA] rounded-xl border border-dashed border-gray-300">
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div>
        <label className={labelCls}>Tipo de pregunta</label>
        <select name="question_type" value={type} onChange={(e) => setType(e.target.value as typeof type)}
          className={inputCls} disabled={pending}>
          <option value="multiple_choice">Opción múltiple</option>
          <option value="true_false">Verdadero / Falso</option>
          <option value="short_answer">Respuesta corta</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Pregunta *</label>
        <textarea name="question_text" required rows={2} placeholder="Escribe la pregunta..."
          className={inputCls + ' resize-none'} disabled={pending} />
      </div>

      {type === 'multiple_choice' && (
        <div>
          <label className={labelCls}>Opciones (una por línea, mínimo 2) *</label>
          <textarea name="options" required rows={4}
            placeholder={"Opción A\nOpción B\nOpción C\nOpción D"}
            className={inputCls + ' resize-none font-mono text-xs'} disabled={pending} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Respuesta correcta *</label>
          <input name="correct_answer" required placeholder={type === 'true_false' ? 'Verdadero o Falso' : 'Respuesta exacta'}
            className={inputCls} disabled={pending} />
        </div>
        <div>
          <label className={labelCls}>Puntos</label>
          <input name="points" type="number" min="1" defaultValue="1" className={inputCls} disabled={pending} />
        </div>
      </div>

      <input name="order_index" type="hidden" value="99" />

      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-50">
          {pending ? 'Guardando...' : 'Agregar pregunta'}
        </button>
        <button type="button" onClick={onDone}
          className="text-[#5F6368] text-xs font-medium px-3 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

function QuestionRow({ question, onDeleted }: { question: Question; onDeleted: () => void }) {
  const [deleting, startDelete] = useTransition()
  const router = useRouter()

  const typeLabel = { multiple_choice: 'Opción múltiple', true_false: 'V/F', short_answer: 'Respuesta corta' }

  function handleDelete() {
    if (!confirm('¿Eliminar esta pregunta?')) return
    startDelete(async () => {
      await deleteQuestionAction(question.id)
      onDeleted()
      router.refresh()
    })
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#F5F7FA] rounded-lg transition-colors">
      <span className="text-xs font-bold text-[#5F6368] w-5 shrink-0 mt-0.5">{question.order_index + 1}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#222222]">{question.question_text}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-[#5F6368]">{typeLabel[question.question_type]}</span>
          <span className="text-xs text-[#5F6368]">{question.points} pt{question.points !== 1 ? 's' : ''}</span>
          <span className="text-xs text-green-600 font-medium">✓ {question.correct_answer}</span>
        </div>
        {question.options && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {question.options.map((opt) => (
              <span key={opt} className={`text-xs px-2 py-0.5 rounded-full border ${opt === question.correct_answer ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 text-[#5F6368]'}`}>
                {opt}
              </span>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleDelete} disabled={deleting}
        className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50 shrink-0">
        {deleting ? '...' : '✕'}
      </button>
    </div>
  )
}

export default function AssessmentDetailClient({
  assessmentId,
  isPublished,
  questions,
  canManage,
}: {
  assessmentId: string
  isPublished: boolean
  questions: Question[]
  canManage: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [publishing, startPublish] = useTransition()
  const router = useRouter()

  function handleTogglePublish() {
    startPublish(async () => {
      await toggleAssessmentPublished(assessmentId, !isPublished)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Publish bar */}
      {canManage && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {isPublished ? 'Publicada' : 'Borrador'}
          </span>
          <button onClick={handleTogglePublish} disabled={publishing}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-50 ${
              isPublished
                ? 'border border-gray-300 text-[#5F6368] hover:bg-[#F5F7FA]'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}>
            {publishing ? '...' : isPublished ? 'Despublicar' : 'Publicar evaluación'}
          </button>
        </div>
      )}

      {/* Questions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-[#F5F7FA] border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-[#222222] text-sm">
            Preguntas ({questions.length})
          </h3>
        </div>

        <div className="p-3 space-y-0.5">
          {questions.length === 0 ? (
            <p className="text-xs text-[#5F6368] text-center py-6">Sin preguntas todavía. Agrega la primera.</p>
          ) : (
            questions.map((q) => (
              <QuestionRow key={q.id} question={q} onDeleted={() => {}} />
            ))
          )}

          {canManage && (
            showForm ? (
              <div className="mt-2">
                <AddQuestionForm assessmentId={assessmentId} onDone={() => setShowForm(false)} />
              </div>
            ) : (
              <button onClick={() => setShowForm(true)}
                className="w-full mt-1 text-xs font-medium text-[#00A9E0] hover:text-[#007FA8] py-2.5 rounded-lg border border-dashed border-[#00A9E0]/40 hover:border-[#00A9E0] transition-colors">
                + Agregar pregunta
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
