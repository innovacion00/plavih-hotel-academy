export type Teacher = {
  name: string
  role: string
  bio: string
  initials: string
  color: string
}

export const teachers: Teacher[] = [
  {
    name: 'Juan López',
    role: 'Jefe de Operaciones de Hoteles',
    bio: 'Más de 15 años liderando operaciones hoteleras en Colombia. Especialista en eficiencia operativa y estándares de servicio.',
    initials: 'JL',
    color: 'bg-blue-600',
  },
  {
    name: 'Rosa Cárdenas',
    role: 'Especialista en Gestión Hotelera',
    bio: 'Experta en administración hotelera, revenue management y desarrollo de equipos de alto desempeño.',
    initials: 'RC',
    color: 'bg-cyan-600',
  },
  {
    name: 'María Villadiego',
    role: 'Especialista en Dirección Hotelera',
    bio: 'Directora hotelera con amplia experiencia en la gerencia de propiedades boutique y suites en el Caribe colombiano.',
    initials: 'MV',
    color: 'bg-teal-600',
  },
  {
    name: 'Miriam Fuentes',
    role: 'Especialista en Hospitalidad',
    bio: 'Referente en cultura del servicio y hospitalidad auténtica. Forma equipos orientados a crear experiencias memorables.',
    initials: 'MF',
    color: 'bg-blue-500',
  },
  {
    name: 'Jesús Benítez',
    role: 'Experto en Mantenimiento',
    bio: 'Técnico especializado en mantenimiento hotelero, gestión de activos y sostenibilidad en operaciones de hospedaje.',
    initials: 'JB',
    color: 'bg-sky-600',
  },
  {
    name: 'Carla Madero',
    role: 'Líder de Experiencia y Atención al Cliente',
    bio: 'Especialista en diseño de experiencias del huésped, entrenamiento en servicio al cliente y cultura de hospitalidad.',
    initials: 'CM',
    color: 'bg-indigo-500',
  },
]
