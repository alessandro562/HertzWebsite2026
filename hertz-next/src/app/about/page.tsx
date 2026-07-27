import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import ImageFrame from '@/components/ui/ImageFrame'
import SignatureTitle from '@/motion/SignatureTitle'
import Reveal from '@/motion/Reveal'
import Parallax from '@/motion/Parallax'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'Manifesto',
  description:
    'The Hertz manifesto: why a Bologna collective chose the floor and the selection over spectacle. From clubbers, for clubbers.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main id="main">
      {/* ── hero (ink · unico dark del percorso) ── */}
      <Section surface="ink" space="lg">
        <SignatureTitle as="h1" className={styles.heroTitle} trigger="mount" stagger={0.12}>
          <span>From clubbers,</span>
          <span>
            <em>for clubbers.</em>
          </span>
        </SignatureTitle>
        <p className={styles.heroLead}>
          A clubbing collective from Bologna, since 2023. Records, a system, the floor. And
          the people who fill it.
        </p>
        <blockquote className={styles.heroQuote}>
          Too many nights were built for the camera, not for the floor.
        </blockquote>
        <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
          Bologna · 2023
        </span>
      </Section>

      {/* ── chapters (white, leggibili) ── */}
      <Section surface="white" space="lg">
        <div className={styles.chapter}>
          <Reveal variant="up" className={styles.chapText}>
            <span className={`${styles.chap} hz-mono`}>Chapter 01 · Origin</span>
            <p>
              Bologna, 2023. The night was turning into something to film, not something to live.
              Rooms built for the camera, the music stuck in the back.
            </p>
            <p>
              So we stripped it back. Records first, proper systems, the right rooms. No spectacle,
              no filler. The floor does the rest.
            </p>
          </Reveal>
          <Parallax speed={44} className={styles.chapPhoto}>
            <ImageFrame src="/assets/alberto-b-live-3.jpg" alt="Hertz resident in the booth" ratio="4 / 5" />
          </Parallax>
        </div>

        <div className={`${styles.chapter} ${styles.reverse}`}>
          <Parallax speed={44} className={styles.chapPhoto}>
            <ImageFrame src="/assets/tommaso-manco-live-2.jpg" alt="Hertz booth and crowd" ratio="4 / 5" />
          </Parallax>
          <Reveal variant="up" className={styles.chapText}>
            <span className={`${styles.chap} hz-mono`}>Chapter 02 · The room</span>
            <p className={styles.big}>
              A room. A system. A crowd that came to dance. The rest is just volume.
            </p>
            <p>
              Artists we&rsquo;d pay to see ourselves. Minimal and deep tech, grooves that roll for
              hours and never turn to noise. Rooms picked for how they sound, not how they look.
              Small enough to feel the kick, big enough to disappear.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── floor climax + stats (signal) ── */}
      <Section surface="signal" space="lg">
        <p className={`${styles.chap} hz-mono`} style={{ color: 'var(--hz-ink-mute)' }}>
          Chapter 03 · The floor
        </p>
        <Reveal as="p" variant="mask" duration={1} className={styles.climax}>
          Lights down, system up, let the record run. The floor knows what to do.
        </Reveal>
        <Reveal variant="up" delay={0.1}>
          <dl className={styles.stats}>
          <div>
            <dt className="hz-mono">Based in</dt>
            <dd>Bologna, IT</dd>
          </div>
          <div>
            <dt className="hz-mono">Sound</dt>
            <dd>Minimal &amp; deep tech</dd>
          </div>
          <div>
            <dt className="hz-mono">Active since</dt>
            <dd>2023</dd>
          </div>
          <div>
            <dt className="hz-mono">Editions</dt>
            <dd>024+</dd>
          </div>
          <div>
            <dt className="hz-mono">Homes</dt>
            <dd>Kindergarten · Buongiorno Classic</dd>
          </div>
          </dl>
        </Reveal>
      </Section>

      {/* ── policy / safe space (paper) ── */}
      <Section surface="paper" space="lg">
        <div className={styles.policy}>
          <div>
            <span className={`${styles.chap} hz-mono`}>Hertz &amp; Kindergarten policy</span>
            <SignatureTitle as="h2" className={styles.policyTitle} stagger={0.1}>
              <span>The dancefloor</span>
              <span>is for everyone.</span>
            </SignatureTitle>
          </div>
          <Reveal variant="up" delay={0.15} className={styles.policyBodyWrap}>
            <p className={styles.policyBody}>
              No harassment, no hate, no discrimination. Respect boundaries, yours and others&rsquo;.
              We&rsquo;re here for the music and the people. The dancefloor is for everyone.
            </p>
            <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
              Safe space · Respect · Consent
            </span>
          </Reveal>
        </div>
      </Section>

    </main>
  )
}
