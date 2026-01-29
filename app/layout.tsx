import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

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
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '897344679901423');
              fbq('track', 'PageView');
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
