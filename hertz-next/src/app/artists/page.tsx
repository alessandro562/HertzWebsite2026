import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import ArtistIndexRow from '@/components/artists/ArtistIndexRow'
import JsonLd from '@/components/seo/JsonLd'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, breadcrumbNode, itemListNode } from '@/lib/seo'
import styles from './artists.module.css'

export const metadata: Metadata = {
  title: 'Resident DJs & Producers',
  description:
    'The Hertz residents: DJs and producers from Bologna working minimal and deep tech. Bios, DJ sets, productions and the dates they play next.',
  keywords: ['resident dj', 'dj Bologna', 'produttori', 'produzioni musicali', 'collettivo dj', 'minimal', 'deep tech'],
  alternates: { canonical: '/artists' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/artists`,
    title: 'Resident DJs & Producers · Hertz Clubbing Collective',
    description:
      'The Hertz residents: DJs and producers from Bologna working minimal and deep tech. Bios, DJ sets and productions.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

export default function ArtistsPage() {
  const roster = itemListNode(
    'Hertz resident DJs and producers',
    ROSTER.map((a) => ({ name: `${a.name} — ${a.role}`, url: `${SITE.url}/artists/${a.slug}` })),
    'The resident roster of the Hertz clubbing collective, Bologna.',
  )

  return (
    <main id="main">
      <JsonLd data={roster} />
      <JsonLd data={breadcrumbNode([{ name: 'Artists', path: '/artists' }])} />

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
