import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import ImageFrame from '@/components/ui/ImageFrame'
import SignatureTitle from '@/motion/SignatureTitle'
import Reveal from '@/motion/Reveal'
import Parallax from '@/motion/Parallax'
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, ORG_ID, breadcrumbNode } from '@/lib/seo'
import styles from './about.module.css'

export const metadata: Metadata = {
  /* Assoluto con suffisso corto: col template pieno il titolo arrivava a 67
     caratteri e Google tagliava proprio la firma del collettivo. */
  title: { absolute: 'Manifesto — From Clubbers, For Clubbers · Hertz' },
  description:
    'Why a Bologna collective builds parties around the music: the Hertz manifesto, active since 2023. Selection, sound system and the dancefloor, groove first.',
  keywords: ['collettivo clubbing', 'clubbing collective', 'manifesto', 'Bologna', 'clubbing', 'party'],
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/about`,
    title: 'Manifesto · Hertz Clubbing Collective',
    description:
      'Why a Bologna collective builds parties around the music, since 2023. From clubbers, for clubbers.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function AboutPage() {
  /* Questa è la pagina che risponde a "chi è Hertz": la lego esplicitamente
     all'entità del collettivo, così un motore generativo cita questa e non
     una pagina evento a caso. */
  const aboutPage = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Hertz manifesto',
    url: `${SITE.url}/about`,
    description:
      'The manifesto of Hertz, the clubbing collective founded in Bologna in 2023: nights built around the selection, the sound system and the people on the dancefloor.',
    mainEntity: { '@id': ORG_ID },
  }

  return (
    <main id="main">
      <JsonLd data={aboutPage} />
      <JsonLd data={breadcrumbNode([{ name: 'Manifesto', path: '/about' }])} />
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
          around the music, the sound system and the people on the dancefloor.
        </p>
        <blockquote className={styles.heroQuote}>
          Too many nights were built for the camera, not for the dancefloor.
        </blockquote>
        <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
          Bologna · 2023
        </span>
      </Section>

      {/* ── chapters (white, leggibili) ── */}
      <Section surface="white" space="lg">
        <div className={styles.chapter}>
          <Reveal variant="up" className={styles.chapText}>
            <span className={`${styles.chap} hz-mono`}>Origin</span>
            <p>
              It began in Bologna, in 2023. Going out had become more about being seen than being
              there: rooms lit for the camera, with the music pushed somewhere into the background.
            </p>
            <p>
              We wanted the opposite. Nights built around the music, the sound system and the people
              on the dancefloor, where the selection leads and the crowd does the rest. That&rsquo;s the
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
            <span className={`${styles.chap} hz-mono`}>The room</span>
            <p className={styles.big}>
              A room. A system. A crowd that came to dance. The rest is just volume.
            </p>
            <p>
              We book the artists we&rsquo;d pay to see ourselves: minimal and deep tech, the kind
              of groove that can roll for hours without ever turning into noise. And we choose rooms
              for how they sound rather than how they look, small enough to feel the kick through the
              dancefloor, big enough to lose yourself in.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── dancefloor climax + stats (signal) ── */}
      <Section surface="signal" space="lg">
        <p className={`${styles.chap} hz-mono`} style={{ color: 'var(--hz-ink-mute)' }}>
          The dancefloor
        </p>
        <Reveal as="p" variant="mask" duration={1} className={styles.climax}>
          Lights down, sound up, and let the record run. The dancefloor takes it from there.
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
