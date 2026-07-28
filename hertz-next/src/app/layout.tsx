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
  'HERTZ, a minimal and deep tech clubbing collective based in Bologna.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hertz Clubbing Collective',
    template: '%s · HERTZ',
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'HERTZ',
    url: SITE_URL,
    title: 'Hertz Clubbing Collective',
    description: DESCRIPTION,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hertz Clubbing Collective',
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${helveticaNeue.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="hz-skip">Skip to content</a>
        <SmoothScroll>
          <Header />
          <PageTransitionProvider>{children}</PageTransitionProvider>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
