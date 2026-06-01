import type { Metadata } from 'next'
import Link from 'next/link'
import RecoverForm from './RecoverForm'

export const metadata: Metadata = { title: 'Recuperar contraseña — Plavih Hotel Academy' }

export default function RecuperarPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-[#222222] mb-1">Recuperar contraseña</h2>
        <p className="text-[#5F6368] text-sm mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <RecoverForm />
        <p className="text-center text-sm text-[#5F6368] mt-5">
          <Link href="/acceder" className="text-[#00A9E0] font-medium hover:underline">← Volver al acceso</Link>
        </p>
      </div>
    </div>
  )
}
