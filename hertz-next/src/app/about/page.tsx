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
    'Il manifesto di Hertz: perché il collettivo bolognese ha scelto il dancefloor e la selezione musicale contro lo spettacolo. From clubbers, for clubbers.',
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
          Hertz è un collettivo clubbing di Bologna, attivo dal 2023. Costruiamo le nostre
          notti intorno alla selezione, all&rsquo;impianto e al dancefloor &mdash; e alle
          persone che li riempiono.
        </p>
        <blockquote className={styles.heroQuote}>
          Troppe notti si riempivano di immagine e si svuotavano di musica.
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
              Il collettivo Hertz nasce a Bologna nel 2023 da un&rsquo;idea semplice: la notte stava
              diventando qualcosa da guardare, sempre meno qualcosa da vivere &mdash; sale costruite
              per la telecamera, con la musica relegata sullo sfondo.
            </p>
            <p>
              Così abbiamo rimesso il focus dove deve stare: la selezione, il dancefloor e
              l&rsquo;energia che costruisce la gente. Quando il groove si incastra e la bassline fa
              il suo lavoro, nessuno filma &mdash; si balla. È la notte che volevamo indietro.
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
              Prenotiamo artisti che pagheremmo per vedere noi stessi. Minimal, deep tech &mdash; il
              tipo di groove che gira per ore senza mai diventare rumore. Scegliamo le sale per come
              suonano, non per quanto sono grandi: abbastanza piccole da sentire il kick attraverso
              il pavimento, abbastanza grandi da sparirci dentro.
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
          Luci giù, impianto su, lascia correre il disco. La pista sa cosa fare.
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
              Niente molestie, niente odio, niente discriminazioni. Rispetta i confini, i tuoi e
              quelli degli altri. Siamo qui per la musica e per le persone. Il dancefloor è di tutti.
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
