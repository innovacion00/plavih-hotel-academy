'use client'

import { useActionState } from 'react'
import { recoverPasswordAction } from '@/lib/auth/actions'

export default function RecoverForm() {
  const [state, action, pending] = useActionState(recoverPasswordAction, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {state.success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Correo electrónico</label>
        <input name="email" type="email" placeholder="tu@gehsuites.com" required autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending || !!state.success} />
      </div>

      <button type="submit" disabled={pending || !!state.success}
        className="w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {pending ? 'Enviando...' : 'Enviar enlace'}
      </button>
    </form>
  )
}
