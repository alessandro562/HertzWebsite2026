import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import ArtistIndexRow from '@/components/artists/ArtistIndexRow'
import { ARTISTS } from '@/content/artists'
import styles from './artists.module.css'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'The Hertz residents: DJs and producers from Bologna and around, minimal and deep tech. Bios, mixes and dates.',
  alternates: { canonical: '/artists' },
}

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

export default function ArtistsPage() {
  return (
    <main id="main">
      <Section surface="cold-blue" space="lg">
        <PageHeader
          kicker="The collective"
          title="The residents."
          intro={<p className="hz-mono">Resident roster · Bologna · Keep the groove</p>}
          noDivider
        />
        <div className={styles.roster}>
          {ROSTER.map((a, i) => (
            <ArtistIndexRow key={a.slug} artist={a} first={i === 0} />
          ))}
        </div>
      </Section>
    </main>
  )
}
