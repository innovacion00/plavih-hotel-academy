'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/auth/actions'

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@gehsuites.com"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent disabled:opacity-50"
          disabled={pending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent disabled:opacity-50"
          disabled={pending}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-[#5F6368]">
          <input type="checkbox" className="accent-[#00A9E0]" />
          Recordarme
        </label>
        <Link href="/recuperar" className="text-sm text-[#00A9E0] hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Accediendo...' : 'Acceder'}
      </button>
    </form>
  )
}
