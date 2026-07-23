import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import MixRow from '@/components/music/MixRow'
import WaveformPulse from '@/motion/WaveformPulse'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import styles from './music.module.css'

export const metadata: Metadata = {
  title: 'Music',
  description:
    'Le trasmissioni Hertz: set e mix dei resident su SoundCloud. Minimal & deep tech, selezione prima di tutto.',
  alternates: { canonical: '/music' },
}

const ROSTER = Object.values(ARTISTS)
  .sort((a, b) => a.n.localeCompare(b.n))
  .filter((a) => a.mixes.length > 0)

/* featured: il primo mix reale marcato "Featured" nel content layer (nessuna invenzione) */
const FEATURED = ROSTER.map((a) => {
  const mix = a.mixes.find((m) => m.tag === 'Featured')
  return mix ? { artist: a, mix } : null
}).filter((f): f is { artist: (typeof ROSTER)[number]; mix: (typeof ROSTER)[number]['mixes'][number] } => Boolean(f))[0]

export default function MusicPage() {
  return (
    <main id="main">
      <Section surface="paper" space="lg">
        <PageHeader
          index="03"
          kicker="Music"
          title="Transmissions."
          intro={
            <p>
              Recorded sets and studio cuts from the residents — the sound of the night, kept where
              it lives. Everything streams from the collective&rsquo;s SoundCloud; play on tap, no
              autoplay.
            </p>
          }
          aside={
            <Button href={SITE.soundcloud} external variant="ghost" arrow>
              SoundCloud
            </Button>
          }
        />
      </Section>

      {/* ── featured: il mix marcato reale come Featured nel content layer ── */}
      {FEATURED && (
        <Section surface="signal" space="lg">
          <SectionLabel kicker="Featured" />
          <div className={styles.featured}>
            <div className={styles.featuredArt}>
              <ImageFrame src={FEATURED.artist.portrait} alt={FEATURED.artist.name} ratio="1 / 1" />
            </div>
            <div className={styles.featuredText}>
              <span className={`${styles.featuredTag} hz-mono`}>{FEATURED.mix.tag}</span>
              <h2 className={styles.featuredTitle}>{FEATURED.mix.t}</h2>
              <div className={styles.featuredMeta}>
                <Link href={`/artists/${FEATURED.artist.slug}`} className={styles.featuredArtist}>
                  {FEATURED.artist.name}
                </Link>
              </div>
              <div className={styles.featuredAction}>
                <WaveformPulse state="idle" className={styles.featuredWave} />
                <Button href={FEATURED.mix.url} external variant="solid" arrow>
                  Play on SoundCloud
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}

      {ROSTER.map((a, i) => (
        <Section key={a.slug} surface={i % 2 === 0 ? 'white' : 'paper'} space="md">
          <SectionLabel
            index={String(i + 1).padStart(2, '0')}
            kicker={a.role.split(' · ').pop()}
            title={a.name}
            link={{ href: `/artists/${a.slug}`, label: 'Profile ↗' }}
          />
          <div>
            {a.mixes.map((m, j) => (
              <MixRow key={m.url} mix={m} artist={a.name} index={j} />
            ))}
          </div>
        </Section>
      ))}

    </main>
  )
}
