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
          Hertz is a clubbing collective from Bologna, active since 2023. We build our nights
          around the music, the sound system and the people on the floor.
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
              It began in Bologna, in 2023. Going out had become more about being seen than being
              there: rooms lit for the camera, with the music pushed somewhere into the background.
            </p>
            <p>
              We wanted the opposite. Nights built around the music, the sound system and the people
              on the floor, where the selection leads and the crowd does the rest. That&rsquo;s the
              kind of clubbing we set out to bring back.
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
              We book the artists we&rsquo;d pay to see ourselves: minimal and deep tech, the kind
              of groove that can roll for hours without ever turning into noise. And we choose rooms
              for how they sound rather than how they look, small enough to feel the kick through the
              floor, big enough to lose yourself in.
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
          Lights down, sound up, and let the record run. The floor takes it from there.
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
