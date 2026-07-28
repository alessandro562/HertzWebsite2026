/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import Parallax from '@/motion/Parallax'
import Reveal, { Stagger, StaggerItem } from '@/motion/Reveal'
import TiltCard from '@/motion/TiltCard'
import { ARTICLES, featuredArticle, articleDate } from '@/content/media'
import styles from './media.module.css'

export const metadata: Metadata = {
  title: 'Media',
  description:
    'The Hertz editorial desk: reportage and reads on the minimal and deep tech scene, signed Hertz Redazione.',
  alternates: { canonical: '/media' },
}

export default function MediaPage() {
  const feature = featuredArticle()
  const rest = ARTICLES.filter((a) => a.slug !== feature.slug)

  return (
    <main id="main">
      {/* ── MASTHEAD ── */}
      <Section surface="white" space="lg">
        <div className={styles.masthead}>
          <span className={`${styles.mastKicker} hz-mono`}>Media — the editorial desk</span>
          <h1 className={styles.mastTitle}>
            <span className={styles.mastThin}>Clubbing</span>{' '}
            <span className={styles.mastBold}>culture.</span>
          </h1>
          <p className={styles.mastStand}>
            Reportage and arguments about the music we care about, written from the floor rather
            than the press release. Signed Hertz Redazione.
          </p>
          <div className={styles.mastMeta}>
            <span className={`${styles.mastRubrics} hz-mono`}>
              SIGNAL · DISPATCH · RESIDENT · RADAR
            </span>
          </div>
        </div>
      </Section>

      {/* ── COVER STORY ── */}
      <Section surface="white" space="md">
        <Reveal variant="up">
          <TiltCard>
            <Link href={`/media/${feature.slug}`} className={styles.cover}>
              <div className={`${styles.coverImg} hz-glitch`}>
                <Parallax speed={28} zoom className={styles.coverParallax}>
                  <img src={feature.heroImage} alt={feature.heroImageAlt} loading="eager" decoding="async" />
                </Parallax>
                <GlitchFX />
              </div>
              <div className={styles.coverBody}>
                <span className={`${styles.coverRubric} hz-mono`}>{feature.rubric}</span>
                <h2 className={styles.coverTitle}>{feature.title}</h2>
                <p className={styles.coverStand}>{feature.subtitle}</p>
                <span className={`${styles.coverMeta} hz-mono`}>
                  {feature.author} · {feature.readingTimeMinutes} min · {articleDate(feature)}
                </span>
                <span className={`${styles.coverGo} hz-mono hz-fx-arrow`}>
                  Read the story <Arrow />
                </span>
              </div>
            </Link>
          </TiltCard>
        </Reveal>
      </Section>

      {/* ── THE INDEX ── */}
      <Section surface="paper" space="lg">
        <div className={styles.indexHead}>
          <span className={`${styles.indexKicker} hz-mono`}>The index</span>
          <h2 className={styles.indexTitle}>More reading.</h2>
        </div>
        <Stagger className={styles.index} gap={0.07}>
          {rest.map((a) => (
            <StaggerItem key={a.slug} variant="up">
              <Link href={`/media/${a.slug}`} className={`${styles.entry} hz-rowfx`}>
                <div className={`${styles.entryThumb} hz-glitch`}>
                  <img src={a.heroImage} alt={a.heroImageAlt} loading="lazy" decoding="async" />
                  <GlitchFX />
                </div>
                <div className={styles.entryBody}>
                  <span className={`${styles.entryRubric} hz-mono`}>{a.rubric}</span>
                  <span className={styles.entryTitle}>{a.title}</span>
                  <span className={styles.entrySub}>{a.subtitle}</span>
                </div>
                <span className={`${styles.entryMeta} hz-mono`}>
                  {a.readingTimeMinutes} min
                  <span>{articleDate(a)}</span>
                </span>
                <span className={`${styles.entryArrow} hz-fx-arrow`} aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </main>
  )
}
