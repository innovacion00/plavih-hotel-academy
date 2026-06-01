export type Course = {
  slug: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  instructor: string
  image: string
  featured: boolean
  upcoming: boolean
  objectives: string[]
}

export const courses: Course[] = [
  {
    slug: 'recepcionista-hotel',
    title: 'Capacitación para Recepcionistas de Hotel',
    description:
      'Domina los procesos de check-in, check-out, gestión de reservas, atención al huésped y protocolos de servicio de clase mundial.',
    category: 'Operaciones',
    level: 'Básico - Intermedio',
    duration: '8 horas',
    instructor: 'Rosa Cárdenas',
    image: '/images/courses/recepcionista.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Gestionar reservas y check-in/check-out con eficiencia',
      'Aplicar protocolos de atención al huésped',
      'Resolver situaciones difíciles con profesionalismo',
      'Comunicarse de forma asertiva con clientes internos y externos',
    ],
  },
  {
    slug: 'botones-hotel',
    title: 'Capacitación para Botones de Hotel',
    description:
      'Aprende los estándares de servicio, manejo de equipaje, atención en llegada y salida del huésped y protocolos operativos.',
    category: 'Operaciones',
    level: 'Básico',
    duration: '4 horas',
    instructor: 'Juan López',
    image: '/images/courses/botones.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Asistir al huésped con cortesía y profesionalismo',
      'Manejar equipaje con cuidado y eficiencia',
      'Conocer los espacios y servicios del hotel',
      'Apoyar en la experiencia de llegada y salida',
    ],
  },
  {
    slug: 'meseros-hotel',
    title: 'Capacitación para Meseros',
    description:
      'Desarrolla habilidades en servicio en mesa, protocolo de alimentos y bebidas, presentación y atención al cliente en restaurante.',
    category: 'Alimentos & Bebidas',
    level: 'Básico - Intermedio',
    duration: '6 horas',
    instructor: 'Carla Madero',
    image: '/images/courses/meseros.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Aplicar protocolos de servicio en mesa',
      'Conocer la carta y hacer recomendaciones acertadas',
      'Gestionar tiempos y coordinación de cocina',
      'Brindar experiencias memorables en cada servicio',
    ],
  },
  {
    slug: 'camareras-hotel',
    title: 'Curso para Camareras de Hotel',
    description:
      'Aprende estándares de limpieza, presentación de habitaciones, cuidado de activos y servicio de housekeeping de clase mundial.',
    category: 'Housekeeping',
    level: 'Básico',
    duration: '5 horas',
    instructor: 'María Villadiego',
    image: '/images/courses/camareras.jpg',
    featured: false,
    upcoming: false,
    objectives: [
      'Aplicar estándares de limpieza y presentación',
      'Gestionar el inventario de habitaciones',
      'Cuidar los activos y equipos del hotel',
      'Ofrecer servicio discreto y eficiente',
    ],
  },
  {
    slug: 'conoce-geh-suites',
    title: 'Conoce GEH Suites',
    description:
      'Inducción a la cultura, valores, procesos e identidad de GEH Suites Hotels. El primer paso para ser parte de nuestro equipo.',
    category: 'Inducción',
    level: 'Básico',
    duration: '3 horas',
    instructor: 'Miriam Fuentes',
    image: '/images/courses/geh-suites.jpg',
    featured: false,
    upcoming: false,
    objectives: [
      'Conocer la historia y valores de GEH Suites',
      'Comprender la estructura organizacional',
      'Apropiarse de la cultura de servicio',
      'Conocer las políticas y reglamento interno',
    ],
  },
  {
    slug: 'induccion-contabilidad',
    title: 'Inducción para el Departamento de Contabilidad',
    description:
      'Formación específica para el área contable: procesos financieros, reportes, herramientas y estándares del sector hotelero.',
    category: 'Administrativo',
    level: 'Intermedio',
    duration: '5 horas',
    instructor: 'Juan López',
    image: '/images/courses/contabilidad.jpg',
    featured: false,
    upcoming: false,
    objectives: [
      'Conocer los procesos contables del hotel',
      'Manejar reportes financieros básicos',
      'Aplicar controles internos del área',
      'Gestionar facturación y cierres diarios',
    ],
  },
  {
    slug: 'induccion-gestion-humana',
    title: 'Inducción para el Departamento de Gestión Humana',
    description:
      'Procesos, herramientas y competencias para el equipo de talento humano en hoteles.',
    category: 'Administrativo',
    level: 'Intermedio',
    duration: '4 horas',
    instructor: 'Miriam Fuentes',
    image: '/images/courses/gestion-humana.jpg',
    featured: false,
    upcoming: false,
    objectives: [
      'Gestionar procesos de selección y contratación',
      'Aplicar políticas de bienestar laboral',
      'Manejar evaluaciones de desempeño',
      'Coordinar capacitaciones internas',
    ],
  },
  {
    slug: 'induccion-compras',
    title: 'Inducción para el Departamento de Compras',
    description:
      'Procesos de adquisición, control de inventarios, gestión de proveedores y estándares hoteleros para el área de compras.',
    category: 'Administrativo',
    level: 'Intermedio',
    duration: '4 horas',
    instructor: 'Juan López',
    image: '/images/courses/compras.jpg',
    featured: false,
    upcoming: false,
    objectives: [
      'Gestionar procesos de compras hoteleras',
      'Controlar inventarios y activos',
      'Evaluar y gestionar proveedores',
      'Aplicar controles de calidad en adquisiciones',
    ],
  },
  {
    slug: 'administradores-jefes-operacion',
    title: 'Administradores y Jefes de Operación',
    description:
      'Liderazgo, gestión de equipos, indicadores operativos y toma de decisiones para líderes hoteleros.',
    category: 'Liderazgo',
    level: 'Avanzado',
    duration: '10 horas',
    instructor: 'Rosa Cárdenas',
    image: '/images/courses/administradores.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Liderar equipos de alto desempeño',
      'Gestionar indicadores operativos (KPIs)',
      'Tomar decisiones bajo presión',
      'Implementar mejoras continuas en el servicio',
    ],
  },
  {
    slug: 'capacidades-innovacion',
    title: 'Capacidades de Innovación',
    description:
      'Desarrolla mentalidad innovadora, metodologías ágiles y herramientas para transformar la operación hotelera.',
    category: 'Innovación',
    level: 'Intermedio',
    duration: '6 horas',
    instructor: 'Jesús Benítez',
    image: '/images/courses/innovacion.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Aplicar metodologías de innovación',
      'Identificar oportunidades de mejora',
      'Diseñar soluciones creativas',
      'Gestionar el cambio organizacional',
    ],
  },
  {
    slug: 'valeria-agente-reservas',
    title: 'ValerIA: Agente Inteligente de Reservas',
    description:
      'Aprende a trabajar con inteligencia artificial aplicada a reservas hoteleras. Optimiza procesos con el agente IA de GEH Suites.',
    category: 'Tecnología e IA',
    level: 'Intermedio',
    duration: '4 horas',
    instructor: 'Jesús Benítez',
    image: '/images/courses/valeria.jpg',
    featured: true,
    upcoming: false,
    objectives: [
      'Entender cómo funciona ValerIA',
      'Optimizar el proceso de reservas con IA',
      'Resolver consultas frecuentes de huéspedes con IA',
      'Integrar IA al flujo de atención al cliente',
    ],
  },
  {
    slug: 'ingles-hotelero',
    title: 'Curso de Inglés Hotelero',
    description:
      'Comunicación efectiva en inglés para el sector hotelero: check-in, reservas, atención al cliente internacional y situaciones cotidianas.',
    category: 'Idiomas',
    level: 'Básico - Intermedio',
    duration: '12 horas',
    instructor: 'Carla Madero',
    image: '/images/courses/ingles.jpg',
    featured: false,
    upcoming: true,
    objectives: [
      'Comunicarse en inglés con huéspedes internacionales',
      'Manejar check-in y reservas en inglés',
      'Responder preguntas frecuentes en inglés',
      'Desenvolverse en situaciones hoteleras cotidianas',
    ],
  },
  {
    slug: 'revenue-management',
    title: 'Introducción al Revenue Management',
    description:
      'Fundamentos de revenue management hotelero: tarifas, ocupación, demanda y estrategias para maximizar ingresos.',
    category: 'Gestión',
    level: 'Intermedio',
    duration: '8 horas',
    instructor: 'Rosa Cárdenas',
    image: '/images/courses/revenue.jpg',
    featured: false,
    upcoming: true,
    objectives: [
      'Comprender los fundamentos del revenue management',
      'Aplicar estrategias de tarifas dinámicas',
      'Analizar indicadores clave (RevPAR, ADR, Ocupación)',
      'Optimizar ingresos según demanda',
    ],
  },
  {
    slug: 'ia-experiencia-cliente',
    title: 'Cómo utilizar la IA para mejorar la experiencia del cliente',
    description:
      'Herramientas de inteligencia artificial para personalizar la atención, anticipar necesidades y superar expectativas del huésped.',
    category: 'Tecnología e IA',
    level: 'Intermedio',
    duration: '5 horas',
    instructor: 'Jesús Benítez',
    image: '/images/courses/ia-cliente.jpg',
    featured: false,
    upcoming: true,
    objectives: [
      'Identificar herramientas de IA para hotelería',
      'Personalizar la experiencia del huésped con IA',
      'Automatizar comunicaciones y seguimientos',
      'Medir el impacto de la IA en la satisfacción',
    ],
  },
  {
    slug: 'redes-sociales-hoteles',
    title: 'Capacitación de Manejo de Redes Sociales para Hoteles',
    description:
      'Estrategias de contenido, gestión de reputación online y marketing digital para hoteles en redes sociales.',
    category: 'Marketing Digital',
    level: 'Básico - Intermedio',
    duration: '6 horas',
    instructor: 'Carla Madero',
    image: '/images/courses/redes-sociales.jpg',
    featured: false,
    upcoming: true,
    objectives: [
      'Crear contenido hotelero para redes sociales',
      'Gestionar la reputación online del hotel',
      'Responder reseñas y comentarios profesionalmente',
      'Medir el desempeño digital del hotel',
    ],
  },
]

export const featuredCourses = courses.filter((c) => c.featured && !c.upcoming)
export const upcomingCourses = courses.filter((c) => c.upcoming)
export const activeCourses = courses.filter((c) => !c.upcoming)
