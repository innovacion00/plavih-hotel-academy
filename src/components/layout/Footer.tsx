import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#005C7A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#00A9E0] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔔</span>
              </div>
              <div className="leading-tight">
                <span className="block text-white font-bold text-lg leading-none">Plavih</span>
                <span className="block text-[#27BCEB] text-[10px] font-medium uppercase tracking-widest leading-none">
                  Hotel Academy
                </span>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Plataforma de formación virtual especializada en hotelería. Desarrollada por el equipo de innovación de GEH Suites Hotels.
            </p>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#27BCEB] mb-4">Cursos</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/cursos" className="hover:text-white transition-colors">Todos los cursos</Link></li>
              <li><Link href="/cursos/recepcionista-hotel" className="hover:text-white transition-colors">Recepcionistas</Link></li>
              <li><Link href="/cursos/botones-hotel" className="hover:text-white transition-colors">Botones</Link></li>
              <li><Link href="/cursos/meseros-hotel" className="hover:text-white transition-colors">Meseros</Link></li>
              <li><Link href="/cursos/camareras-hotel" className="hover:text-white transition-colors">Camareras</Link></li>
            </ul>
          </div>

          {/* Institución */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#27BCEB] mb-4">Institución</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">¿Quiénes somos?</Link></li>
              <li><Link href="/clientes" className="hover:text-white transition-colors">Nuestros clientes</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/estudia" className="hover:text-white transition-colors">Estudia con nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#27BCEB] mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Políticas de privacidad</Link></li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-blue-200">Ley 1581 de 2012 — Colombia</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#007FA8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} Plavih Hotel Academy. Todos los derechos reservados.
          </p>
          <p className="text-sm text-blue-200">
            Una iniciativa de{' '}
            <span className="text-[#27BCEB] font-medium">GEH Suites Hotels</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
