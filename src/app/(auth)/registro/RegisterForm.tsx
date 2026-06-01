'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerAction } from '@/lib/auth/actions'

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {})

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5">Nombre</label>
          <input name="first_name" type="text" placeholder="Ana" required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
            disabled={pending} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5">Apellido</label>
          <input name="last_name" type="text" placeholder="García" required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
            disabled={pending} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Correo electrónico</label>
        <input name="email" type="email" placeholder="tu@gehsuites.com" required autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Contraseña</label>
        <input name="password" type="password" placeholder="Mínimo 8 caracteres" required autoComplete="new-password"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5">Confirmar contraseña</label>
        <input name="confirm_password" type="password" placeholder="Repite tu contraseña" required autoComplete="new-password"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] disabled:opacity-50"
          disabled={pending} />
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" required className="mt-0.5 accent-[#00A9E0]" />
        <label htmlFor="terms" className="text-xs text-[#5F6368]">
          Acepto los{' '}
          <Link href="/terminos" className="text-[#00A9E0] hover:underline">términos y condiciones</Link>
          {' '}y la{' '}
          <Link href="/privacidad" className="text-[#00A9E0] hover:underline">política de privacidad</Link>
        </label>
      </div>

      <button type="submit" disabled={pending}
        className="w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {pending ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
