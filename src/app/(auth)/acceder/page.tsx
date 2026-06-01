import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Acceder — Plavih Hotel Academy',
  description: 'Ingresa a Plavih Hotel Academy con tu cuenta GEH Suites.',
}

export default function AccederPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-[#F5F7FA] py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00A9E0] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🔔</span>
          </div>
          <h1 className="text-2xl font-bold text-[#005C7A]">Plavih</h1>
          <p className="text-[#00A9E0] text-xs font-medium uppercase tracking-widest">Hotel Academy</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-[#222222] mb-1">Acceder</h2>
          <p className="text-[#5F6368] text-sm mb-6">Ingresa con tu cuenta de GEH Suites Hotels</p>
          <LoginForm />
          <p className="text-center text-sm text-[#5F6368] mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/estudia" className="text-[#00A9E0] font-medium hover:underline">
              Estudia con nosotros
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#5F6368] mt-6">
          Una iniciativa de{' '}
          <span className="text-[#005C7A] font-medium">GEH Suites Hotels</span>
        </p>
      </div>
    </div>
  )
}
