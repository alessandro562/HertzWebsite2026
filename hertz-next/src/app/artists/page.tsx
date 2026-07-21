import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import ArtistCard from '@/components/artists/ArtistCard'
import { ARTISTS } from '@/content/artists'
import styles from './artists.module.css'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'I resident del collettivo Hertz — DJ e producer di Bologna e dintorni, minimal & deep tech. Bio, mix e date.',
  alternates: { canonical: '/artists' },
}

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

export default function ArtistsPage() {
  return (
    <main id="main">
      <Section surface="cold-blue" space="lg">
        <PageHeader
          index="02"
          kicker="Residents"
          title="The family."
          intro={
            <p>
              A small roster we actually play alongside — selectors first, from Bologna and the
              wider Emilia-Romagna scene. No guest-name inflation: the people who build the night.
            </p>
          }
          aside={<p className="hz-mono">{ROSTER.length} residents</p>}
        />
        <div className={styles.grid}>
          {ROSTER.map((a) => (
            <ArtistCard key={a.slug} artist={a} />
          ))}
        </div>
      </Section>

      <Section surface="white" space="md">
        <div className={styles.booking}>
          <div>
            <h2 className={styles.bookingTitle}>Book the collective.</h2>
            <p className={styles.bookingText}>
              Residents and back-to-backs for your room, festival or showcase — we reply from
              Bologna.
            </p>
          </div>
          <Button href="/bookings" arrow>
            Booking &amp; contact
          </Button>
        </div>
      </Section>
    </main>
  )
}
