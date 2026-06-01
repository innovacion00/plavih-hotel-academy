export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'plavih-revolucionando-capacitacion-hoteleria',
    title: 'Plavih, Revolucionando la Capacitación en Hotelería a través de la Innovación',
    excerpt:
      'Cómo GEH Suites creó una plataforma de formación virtual que está cambiando la manera en que los profesionales hoteleros se capacitan en Colombia.',
    content: `
      En marzo de 2023, el equipo de innovación de GEH Suites identificó una necesidad urgente: los colaboradores del sector hotelero no contaban con herramientas de formación accesibles, prácticas y especializadas. La respuesta fue Plavih Hotel Academy.

      Plavih nació como una apuesta por modernizar la capacitación hotelera. Desde el lanzamiento del primer curso para recepcionistas en junio de 2023, la plataforma ha crecido hasta ofrecer formación para todas las áreas del hotel: operaciones, alimentos y bebidas, housekeeping, administración, liderazgo e innovación.

      Lo que distingue a Plavih de otras plataformas educativas es su enfoque 100% hotelero. Cada curso está diseñado por profesionales del sector con experiencia real en la operación diaria de hoteles. No es teoría genérica: es conocimiento aplicable desde el primer día de trabajo.

      La integración de inteligencia artificial es otro de los pilares de la plataforma. Herramientas como ValerIA, el agente inteligente de reservas, representan el futuro de la hotelería: tecnología al servicio de la hospitalidad.
    `,
    date: '2024-03-15',
    author: 'Equipo Plavih',
    category: 'Innovación',
    readTime: '4 min',
  },
  {
    slug: 'plavih-cambio-industria-hotelera',
    title: 'Plavih, un Cambio para la Industria Hotelera',
    excerpt:
      'La capacitación virtual con inteligencia artificial y aprendizaje personalizado está fortaleciendo la operación hotelera en Colombia.',
    content: `
      El sector hotelero en Colombia está experimentando una transformación acelerada. La demanda de talento humano calificado es cada vez mayor, y las plataformas de formación tradicionales no alcanzan a responder a las necesidades del mercado.

      Plavih llegó a llenar ese vacío. Con un modelo de aprendizaje flexible, accesible desde cualquier dispositivo y enfocado en competencias prácticas, la plataforma está cambiando la manera en que los hoteles forman a sus equipos.

      El aprendizaje personalizado es uno de los mayores diferenciadores. Cada colaborador puede avanzar a su propio ritmo, acceder al contenido que necesita según su cargo y área, y recibir retroalimentación continua a lo largo del proceso.

      La integración de inteligencia artificial permite que la plataforma se adapte al estilo de aprendizaje de cada usuario, sugiriendo contenidos relevantes y optimizando la experiencia formativa de forma continua.
    `,
    date: '2024-06-20',
    author: 'Equipo Plavih',
    category: 'Tecnología',
    readTime: '5 min',
  },
  {
    slug: 'educacion-hotelera-nueva-era',
    title: 'La Educación Hotelera en la Nueva Era',
    excerpt:
      'Realidad aumentada, habilidades blandas, comportamiento del consumidor y educación ejecutiva: el futuro del aprendizaje en hotelería.',
    content: `
      La industria hotelera del siglo XXI requiere profesionales que dominen no solo los aspectos técnicos de la operación, sino también las competencias blandas, el pensamiento innovador y la adaptabilidad ante un entorno en constante cambio.

      La educación hotelera moderna combina lo mejor de la experiencia presencial con las posibilidades de la tecnología digital. La realidad aumentada, la gamificación, los simuladores de servicio y los agentes de IA están redefiniendo la manera en que aprendemos y nos desarrollamos en el sector.

      En Plavih creemos que el futuro de la formación hotelera está en la personalización, la accesibilidad y la relevancia práctica. Cada curso, cada video y cada ejercicio está diseñado para que el aprendizaje ocurra en el contexto real del trabajo, no en un aula desconectada de la realidad operativa.

      El comportamiento del consumidor hotelero también está evolucionando. Los huéspedes de hoy esperan experiencias personalizadas, memorables y conectadas. Formar equipos capaces de crear esas experiencias es el reto central de la educación hotelera en la nueva era.
    `,
    date: '2024-09-10',
    author: 'Equipo Plavih',
    category: 'Educación',
    readTime: '6 min',
  },
]
