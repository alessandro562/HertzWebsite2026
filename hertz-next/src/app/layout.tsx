import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'
import SmoothScroll from '@/motion/SmoothScroll'
import PageTransitionProvider from '@/motion/PageTransitionProvider'
import Header from '@/components/navigation/Header'
import Footer from '@/components/navigation/Footer'
import NewsletterModal from '@/components/newsletter/NewsletterModal'
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { KEYWORDS, siteGraph } from '@/lib/seo'

/**
 * Helvetica Neue self-hosted via next/font/local (nessuna richiesta esterna).
 * Esposto come var(--font-hz); globals.css lo aggancia a --hz-font-display /
 * --hz-font-body. Pesi: Roman(400), Medium(500 · body), Bold(700 · display).
 */
const helveticaNeue = localFont({
  variable: '--font-hz',
  display: 'swap',
  /* WOFF2, non OTF: l'OTF non ha compressione interna e i sei pesi pesavano
     2318 KB preloadati su OGNI pagina. Convertiti (senza subsetting, così
     accenti e simboli restano) e senza UltraLight, che nessuna regola CSS
     usa: 688 KB. */
  src: [
    { path: './fonts/HelveticaNeue-Thin.woff2', weight: '200', style: 'normal' },
    { path: './fonts/HelveticaNeue-Light.woff2', weight: '300', style: 'normal' },
    { path: './fonts/HelveticaNeue-Roman.woff2', weight: '400', style: 'normal' },
    { path: './fonts/HelveticaNeue-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/HelveticaNeue-Bold.woff2', weight: '700', style: 'normal' },
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

/* Titolo di default e template. Il template porta il nome completo del
   collettivo su OGNI pagina: "Clubbing Collective" è esattamente la query che
   vogliamo intercettare, e ripeterla costruisce l'entità agli occhi dei
   motori (e degli LLM, che leggono i <title> come etichette). */
const TITLE = 'Hertz Clubbing Collective — Party, DJ & Groove in Bologna'
const DESCRIPTION =
  'Hertz is the clubbing collective from Bologna since 2023: minimal and deep tech parties, resident DJs, productions and basslines that keep the groove.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · Hertz Clubbing Collective',
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  category: 'music',
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: '/' },
  /* Esplicito: senza max-image-preview:large Google usa la miniatura piccola
     nei risultati, e i poster degli eventi valgono molto più di così. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_GB',
    alternateLocale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${helveticaNeue.variable} ${mono.variable}`}>
      <body>
        {/* Entità Hertz + sito, una volta sola per tutte le pagine: ogni nodo
            per-pagina (Event, Person, Article) ci si aggancia via @id. */}
        <JsonLd data={siteGraph()} />
        <a href="#main" className="hz-skip">Skip to content</a>
        <SmoothScroll>
          <Header />
          <PageTransitionProvider>{children}</PageTransitionProvider>
          <Footer />
        </SmoothScroll>
        <NewsletterModal />
      </body>
    </html>
  )
}
