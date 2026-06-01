'use client'

export default function MockBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between">
      <p className="text-amber-800 text-xs font-medium">
        <span className="font-bold">Modo demo activo</span> — Estás viendo datos de ejemplo.
        Configura Supabase y desactiva{' '}
        <code className="bg-amber-100 px-1 rounded font-mono">NEXT_PUBLIC_USE_MOCKS</code>
        {' '}para usar datos reales.
      </p>
      <a
        href="https://supabase.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-700 text-xs font-semibold hover:underline shrink-0 ml-4"
      >
        Configurar →
      </a>
    </div>
  )
}
