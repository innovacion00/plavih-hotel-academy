import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Crear cuenta — Plavih Hotel Academy' }

export default function RegistroPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-[#222222] mb-1">Crear cuenta</h2>
        <p className="text-[#5F6368] text-sm mb-6">Regístrate para acceder a los cursos de Plavih</p>
        <RegisterForm />
        <p className="text-center text-sm text-[#5F6368] mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/acceder" className="text-[#00A9E0] font-medium hover:underline">Acceder</Link>
        </p>
      </div>
    </div>
  )
}
