'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Cursos', href: '/cursos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Nuestros Clientes', href: '/clientes' },
  { label: 'Estudia con Nosotros', href: '/estudia' },
  { label: 'Nosotros', href: '/nosotros' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#00A9E0] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔔</span>
            </div>
            <div className="leading-tight">
              <span className="block text-[#005C7A] font-bold text-lg leading-none">Plavih</span>
              <span className="block text-[#00A9E0] text-[10px] font-medium uppercase tracking-widest leading-none">
                Hotel Academy
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#00A9E0]'
                    : 'text-[#5F6368] hover:text-[#00A9E0]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/acceder"
              className="text-sm font-medium text-[#005C7A] hover:text-[#00A9E0] transition-colors"
            >
              Acceder
            </Link>
            <Link
              href="/estudia"
              className="bg-[#00A9E0] hover:bg-[#007FA8] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-[#5F6368]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-1 ${
                  pathname === link.href ? 'text-[#00A9E0]' : 'text-[#5F6368]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link
                href="/acceder"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#005C7A]"
              >
                Acceder
              </Link>
              <Link
                href="/estudia"
                onClick={() => setMenuOpen(false)}
                className="bg-[#00A9E0] text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
