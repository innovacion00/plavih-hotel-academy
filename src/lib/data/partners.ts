export type Hotel = {
  name: string
  initials: string
  color: string
}

export type Partner = {
  name: string
  initials: string
  color: string
}

export const hotels: Hotel[] = [
  { name: '1525', initials: '1525', color: 'bg-yellow-600' },
  { name: 'Hotel Boquilla Suites', initials: 'BQ', color: 'bg-teal-600' },
  { name: 'Abi Inn', initials: 'AI', color: 'bg-blue-600' },
  { name: 'Hotel Aixo Suites', initials: 'AX', color: 'bg-emerald-600' },
  { name: 'Hotel Avexi Suites', initials: 'AV', color: 'bg-cyan-700' },
  { name: 'Hotel Azuán Suites', initials: 'AZ', color: 'bg-blue-700' },
  { name: 'Hotel Bocagrande', initials: 'BG', color: 'bg-green-600' },
  { name: 'Madisson Inn', initials: 'MI', color: 'bg-red-600' },
  { name: 'Marina Suites', initials: 'MS', color: 'bg-teal-700' },
  { name: 'Windsor House', initials: 'WH', color: 'bg-yellow-700' },
]

export const partners: Partner[] = [
  { name: 'GEH Suites Hotels', initials: 'GEH', color: 'bg-yellow-600' },
  { name: 'Cámara de Comercio de Santa Marta', initials: 'CC', color: 'bg-blue-600' },
  { name: 'Colombia Potencia de la Vida', initials: 'COL', color: 'bg-green-600' },
  { name: 'SGR — Sistema General de Regalías', initials: 'SGR', color: 'bg-blue-800' },
]
