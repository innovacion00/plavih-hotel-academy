import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Configuración pendiente — Plavih' }

export default function ConfiguracionPendientePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#00A9E0]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚙️</span>
        </div>
        <h1 className="text-2xl font-bold text-[#005C7A] mb-2">Configuración pendiente</h1>
        <p className="text-[#5F6368] mb-8 leading-relaxed">
          El LMS necesita credenciales de Supabase para funcionar con datos reales.
          Configura las variables de entorno o activa el modo demo.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left mb-6 shadow-sm">
          <p className="text-sm font-semibold text-[#222222] mb-3">Variables requeridas en <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code></p>
          <pre className="text-xs bg-[#F5F7FA] rounded-xl p-4 overflow-x-auto text-[#005C7A] leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
          </pre>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left mb-8">
          <p className="text-sm font-semibold text-amber-800 mb-1">¿Quieres explorar sin Supabase?</p>
          <p className="text-xs text-amber-700">
            Agrega <code className="bg-amber-100 px-1 rounded font-mono">NEXT_PUBLIC_USE_MOCKS=true</code> a tu{' '}
            <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> y reinicia el servidor.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Ir a Supabase
          </a>
          <Link
            href="/"
            className="border border-gray-300 text-[#5F6368] hover:border-[#00A9E0] hover:text-[#00A9E0] font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
