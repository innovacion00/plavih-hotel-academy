import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Plavih Hotel Academy',
    template: '%s | Plavih Hotel Academy',
  },
  description:
    'Plataforma de formación virtual especializada en hotelería para GEH Suites Hotels.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#222222]">{children}</body>
    </html>
  )
}
