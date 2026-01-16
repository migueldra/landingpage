import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// dynamic solo para Cloudflare Pages, no para GitHub Pages (export estático)
// Comentado para GitHub Pages - descomentar si necesitas dynamic en Cloudflare
// export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'AURA DRIVE | Difusor de Aromas Premium para tu Auto',
  description: 'Transforma tu auto en un santuario aromático con tecnología inteligente. Difusor automático con hasta 4 meses de fragancia premium. Envío a toda Colombia.',
  keywords: 'difusor auto, aromaterapia vehicular, ambientador carro, AURA DRIVE, difusor aromas Colombia',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'AURA DRIVE | Difusor de Aromas Premium para tu Auto',
    description: 'Transforma tu auto en un santuario aromático con tecnología inteligente.',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
