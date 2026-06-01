'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from '@/lib/auth/actions'

export default function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Nueva contraseña</label>
        <input name="password" type="password" placeholder="Mínimo 8 caracteres" required autoComplete="new-password"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Confirmar contraseña</label>
        <input name="confirm_password" type="password" placeholder="Repite la contraseña" required autoComplete="new-password"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending} />
      </div>

      <button type="submit" disabled={pending}
        className="w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {pending ? 'Actualizando...' : 'Actualizar contraseña'}
      </button>
    </form>
  )
}
