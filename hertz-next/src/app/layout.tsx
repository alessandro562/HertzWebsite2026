import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'
import SmoothScroll from '@/motion/SmoothScroll'
import PageTransitionProvider from '@/motion/PageTransitionProvider'
import Header from '@/components/navigation/Header'
import Footer from '@/components/navigation/Footer'
import { SITE } from '@/lib/site'

/**
 * Helvetica Neue self-hosted via next/font/local (nessuna richiesta esterna).
 * Esposto come var(--font-hz); globals.css lo aggancia a --hz-font-display /
 * --hz-font-body. Pesi: Roman(400), Medium(500 · body), Bold(700 · display).
 */
const helveticaNeue = localFont({
  variable: '--font-hz',
  display: 'swap',
  src: [
    { path: './fonts/HelveticaNeue-UltraLight.otf', weight: '100', style: 'normal' },
    { path: './fonts/HelveticaNeue-Thin.otf', weight: '200', style: 'normal' },
    { path: './fonts/HelveticaNeue-Light.otf', weight: '300', style: 'normal' },
    { path: './fonts/HelveticaNeue-Roman.otf', weight: '400', style: 'normal' },
    { path: './fonts/HelveticaNeue-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/HelveticaNeue-Bold.otf', weight: '700', style: 'normal' },
  ],
})

/**
 * Mono per metadata (date/venue/status/label/archivio). IBM Plex Mono
 * self-hosted da next/font/google (build-time, nessuna richiesta runtime).
 * ABC Monument Grotesk Semi-Mono resta primo nello stack per quando licenziato.
 */
const mono = IBM_Plex_Mono({
  variable: '--font-hz-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const SITE_URL = SITE.url
const DESCRIPTION =
  'HERTZ, collettivo clubbing minimal/deep-tech con base a Bologna.'

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
  twitter: {
    card: 'summary_large_image',
    title: 'HERTZ',
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${helveticaNeue.variable} ${mono.variable}`}>
      <body>
        {/* filtro chroma: aberrazione cromatica integrata nelle foto (.hz-glitch) */}
        <svg className="hz-svg-filters" aria-hidden="true" focusable="false" width="0" height="0">
          <filter id="hz-chroma" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx="-2" dy="0" result="ro" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx="2" dy="0" result="bo" />
            <feBlend in="ro" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="bo" mode="screen" />
          </filter>
        </svg>
        <a href="#main" className="hz-skip">Vai al contenuto</a>
        <SmoothScroll>
          <Header />
          <PageTransitionProvider>{children}</PageTransitionProvider>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
