'use client'

import { useState, useTransition } from 'react'
import { submitExamAction } from '@/lib/assessments/actions'
import type { ExamQuestion } from '@/lib/assessments/queries'

type ExamResult = {
  score: number
  passed: boolean
  earned_points: number
  total_points: number
}

function QuestionItem({
  question,
  index,
  answer,
  onChange,
  disabled,
}: {
  question: ExamQuestion
  index: number
  answer: string
  onChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <div className="p-5 border-b border-gray-50 last:border-0">
      <p className="text-sm font-medium text-[#222222] mb-3">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00A9E0] text-white text-xs font-bold mr-2">
          {index + 1}
        </span>
        {question.question_text}
        <span className="ml-2 text-xs text-[#5F6368] font-normal">({question.points} pt{question.points !== 1 ? 's' : ''})</span>
      </p>

      {question.question_type === 'multiple_choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
              answer === opt
                ? 'border-[#00A9E0] bg-[#E8F7FD]'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={answer === opt}
                onChange={() => onChange(opt)}
                disabled={disabled}
                className="accent-[#00A9E0]"
              />
              <span className="text-sm text-[#222222]">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.question_type === 'true_false' && (
        <div className="flex gap-3">
          {['Verdadero', 'Falso'].map((opt) => (
            <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
              answer === opt
                ? 'border-[#00A9E0] bg-[#E8F7FD] text-[#005C7A] font-medium'
                : 'border-gray-200 text-[#5F6368] hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={answer === opt}
                onChange={() => onChange(opt)}
                disabled={disabled}
                className="accent-[#00A9E0]"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.question_type === 'short_answer' && (
        <input
          type="text"
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Escribe tu respuesta..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-60"
        />
      )}
    </div>
  )
}

export default function ExamTaker({
  assessmentId,
  questions,
  passingScore,
  totalPoints,
}: {
  assessmentId: string
  questions: ExamQuestion[]
  passingScore: number
  totalPoints: number
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ExamResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await submitExamAction(assessmentId, answers)
      if (res.ok && res.data) setResult(res.data)
      else setError(res.ok ? 'Error inesperado.' : res.error)
    })
  }

  if (result) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          result.passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <span className="text-4xl">{result.passed ? '🎉' : '📚'}</span>
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${result.passed ? 'text-green-700' : 'text-red-600'}`}>
          {result.passed ? '¡Aprobaste!' : 'No aprobaste esta vez'}
        </h3>
        <p className="text-[#5F6368] text-sm mb-6">
          {result.passed
            ? 'Has superado el puntaje mínimo requerido.'
            : `Necesitas al menos ${passingScore}% para aprobar. ¡Inténtalo de nuevo!`}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#F5F7FA] rounded-xl py-3">
            <p className={`text-2xl font-bold ${result.passed ? 'text-green-700' : 'text-red-600'}`}>
              {result.score}%
            </p>
            <p className="text-xs text-[#5F6368] mt-0.5">Tu puntaje</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl py-3">
            <p className="text-2xl font-bold text-[#005C7A]">
              {result.earned_points}/{result.total_points}
            </p>
            <p className="text-xs text-[#5F6368] mt-0.5">Puntos</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl py-3">
            <p className="text-2xl font-bold text-[#005C7A]">{passingScore}%</p>
            <p className="text-xs text-[#5F6368] mt-0.5">Para aprobar</p>
          </div>
        </div>

        {!result.passed && (
          <button
            onClick={() => { setResult(null); setAnswers({}) }}
            className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-[#5F6368]">Esta evaluación aún no tiene preguntas.</p>
      </div>
    )
  }

  const answered = Object.values(answers).filter(Boolean).length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-[#F5F7FA] border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-[#222222] text-sm">
            Preguntas ({questions.length})
          </h3>
          <span className="text-xs text-[#5F6368]">
            {answered} de {questions.length} respondidas
          </span>
        </div>

        {questions.map((q, i) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={i}
            answer={answers[q.id] ?? ''}
            onChange={(v) => setAnswer(q.id, v)}
            disabled={pending}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#5F6368]">
          Puntaje mínimo para aprobar: <span className="font-semibold">{passingScore}%</span>
        </p>
        <button
          type="submit"
          disabled={pending || answered === 0}
          className="bg-[#00A9E0] hover:bg-[#007FA8] disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
        >
          {pending ? 'Calificando...' : 'Enviar respuestas'}
        </button>
      </div>
    </form>
  )
}
