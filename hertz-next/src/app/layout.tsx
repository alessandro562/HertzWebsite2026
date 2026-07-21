import type { Metadata } from 'next'
import localFont from 'next/font/local'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'
import SmoothScroll from '@/motion/SmoothScroll'

/**
 * Helvetica Neue self-hosted via next/font/local (nessuna richiesta esterna).
 * Esposto come var(--font-hz); globals.css lo aggancia a --hz-font-display /
 * --hz-font-body. Pesi: Roman(400), Medium(500 · body), Bold(700 · display).
 */
const helveticaNeue = localFont({
  variable: '--font-hz',
  display: 'swap',
  src: [
    { path: './fonts/HelveticaNeue-Roman.otf', weight: '400', style: 'normal' },
    { path: './fonts/HelveticaNeue-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/HelveticaNeue-Bold.otf', weight: '700', style: 'normal' },
  ],
})

const SITE_URL = 'https://hertzclubbing.com'
const DESCRIPTION =
  'HERTZ — collettivo clubbing minimal/deep-tech con base a Bologna.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HERTZ',
    template: '%s · HERTZ',
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'HERTZ',
    url: SITE_URL,
    title: 'HERTZ',
    description: DESCRIPTION,
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={helveticaNeue.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
