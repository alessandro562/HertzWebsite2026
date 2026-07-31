import type { Metadata } from 'next'
import BookingsClient from './BookingsClient'
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, ORG_ID, breadcrumbNode } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Book a DJ or the Hertz Format',
  description:
    'Book the Hertz format or a single resident DJ for your club, festival or showcase. Minimal and deep tech from Bologna, available anywhere.',
  keywords: ['booking dj', 'prenota dj', 'dj Bologna', 'club booking', 'festival', 'collettivo clubbing'],
  alternates: { canonical: '/bookings' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/bookings`,
    title: 'Book a DJ or the Hertz Format · Hertz Clubbing Collective',
    description:
      'Book the Hertz format or a single resident DJ for your club, festival or showcase. Based in Bologna, available anywhere.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function BookingsPage() {
  /* Servizio dichiarato: è la pagina che deve uscire quando qualcuno (o un
     assistente AI) chiede "come si prenota un dj Hertz". */
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Hertz DJ and event booking',
    serviceType: 'DJ booking',
    description:
      'Booking for the full Hertz format or a single resident DJ: clubs, festivals and showcases. Minimal and deep tech, from Bologna.',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Italy' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE.url}/bookings`,
      serviceLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: 'Bologna', addressCountry: 'IT' },
      },
    },
  }

  return (
    <>
      <JsonLd data={service} />
      <JsonLd data={breadcrumbNode([{ name: 'Bookings', path: '/bookings' }])} />
      <BookingsClient />
    </>
  )
}
