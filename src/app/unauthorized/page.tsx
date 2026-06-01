import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Acceso no autorizado' }

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-[#222222] mb-2">Acceso no autorizado</h1>
        <p className="text-[#5F6368] mb-8">
          No tienes permisos para acceder a esta sección. Si crees que esto es un error, contacta al administrador de la plataforma.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Ir al Dashboard
          </Link>
          <Link
            href="/"
            className="border border-gray-200 text-[#5F6368] font-medium px-6 py-2.5 rounded-full hover:bg-white transition-colors"
          >
            Sitio público
          </Link>
        </div>
      </div>
    </div>
  )
}
