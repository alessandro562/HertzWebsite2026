import type { Metadata } from 'next'
import BookingsClient from './BookingsClient'

export const metadata: Metadata = {
  title: 'Bookings',
  description:
    'Book the full Hertz format or a single resident: club, festival and showcase. Based in Bologna, available anywhere.',
  alternates: { canonical: '/bookings' },
}

export default function BookingsPage() {
  return <BookingsClient />
}
