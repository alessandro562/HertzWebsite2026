import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import ArtistIndexRow from '@/components/artists/ArtistIndexRow'
import { ARTISTS } from '@/content/artists'
import styles from './artists.module.css'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'I resident del collettivo Hertz: DJ e producer di Bologna e dintorni, minimal & deep tech. Bio, mix e date.',
  alternates: { canonical: '/artists' },
}

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

export default function ArtistsPage() {
  return (
    <main id="main">
      <Section surface="cold-blue" space="lg">
        <PageHeader
          index="03"
          kicker="The collective"
          title="On the same frequency."
          intro={<p className="hz-mono">Resident roster · Bologna · Keep the groove</p>}
          aside={<p className="hz-mono">{ROSTER.length} residents</p>}
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
