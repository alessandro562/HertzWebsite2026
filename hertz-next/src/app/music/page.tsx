import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import MixRow from '@/components/music/MixRow'
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

const TOTAL = ROSTER.reduce((n, a) => n + a.mixes.length, 0)

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

      <Section surface="signal" space="lg">
        <div className={styles.follow}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              {TOTAL} mixes · {ROSTER.length} residents
            </p>
            <h2 className={styles.followTitle}>Follow the frequency.</h2>
          </div>
          <Button href={SITE.soundcloud} external arrow>
            {SITE.soundcloudHandle}
          </Button>
        </div>
      </Section>
    </main>
  )
}
