import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import ArtistIndexRow from '@/components/artists/ArtistIndexRow'
import FrequencyCut from '@/motion/FrequencyCut'
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
        <div className={styles.roster}>
          {ROSTER.map((a, i) => (
            <ArtistIndexRow key={a.slug} artist={a} first={i === 0} />
          ))}
        </div>
      </Section>

      <Section surface="white" space="md">
        <FrequencyCut variant="editorial" trigger="inView" className={styles.closingCut} />
        <p className={styles.closing}>
          Residents and back-to-backs for your room, festival or showcase —{' '}
          <Link href="/bookings" className={styles.closingLink}>
            booking &amp; contact ↗
          </Link>
        </p>
      </Section>
    </main>
  )
}
