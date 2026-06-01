import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <header className="py-4 px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00A9E0] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🔔</span>
          </div>
          <div className="leading-tight">
            <span className="block text-[#005C7A] font-bold text-lg leading-none">Plavih</span>
            <span className="block text-[#00A9E0] text-[10px] font-medium uppercase tracking-widest leading-none">
              Hotel Academy
            </span>
          </div>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[#5F6368]">
        © {new Date().getFullYear()} Plavih Hotel Academy · Una iniciativa de GEH Suites Hotels
      </footer>
    </div>
  )
}
