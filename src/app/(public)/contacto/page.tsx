import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para conocer más sobre los programas de formación de Plavih Hotel Academy.',
}

export default function ContactoPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Contáctanos</h1>
          <p className="text-blue-100 max-w-xl">
            Escríbenos y con gusto te orientamos sobre nuestros programas de formación hotelera.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#005C7A] mb-2">Escríbenos</h2>
            <p className="text-[#5F6368] text-sm mb-8">
              Completa el formulario y nos comunicaremos contigo a la brevedad.
            </p>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="email">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="telefono">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-1.5" htmlFor="comentario">
                  Comentario
                </label>
                <textarea
                  id="comentario"
                  rows={5}
                  placeholder="¿En qué podemos ayudarte? Cuéntanos sobre tu hotel o tu interés en formarte con Plavih..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="autorizacion"
                  type="checkbox"
                  className="mt-0.5 accent-[#00A9E0]"
                />
                <label htmlFor="autorizacion" className="text-xs text-[#5F6368] leading-relaxed">
                  Autorizo el tratamiento de mis datos personales para recibir información sobre planes de formación,
                  promociones y novedades de Plavih Hotel Academy, conforme a la Ley 1581 de 2012.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold py-3 rounded-full transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
