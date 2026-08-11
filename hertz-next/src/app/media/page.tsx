/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import Parallax from '@/motion/Parallax'
import Reveal, { Stagger, StaggerItem } from '@/motion/Reveal'
import TiltCard from '@/motion/TiltCard'
import JsonLd from '@/components/seo/JsonLd'
import { ARTICLES, featuredArticle, articleDate } from '@/content/media'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, ORG_ID, WEBSITE_ID, breadcrumbNode, itemListNode } from '@/lib/seo'
import styles from './media.module.css'

export const metadata: Metadata = {
  title: 'Clubbing Culture Magazine',
  description:
    'Clubbing culture from Hertz Redazione: reportage and arguments on the minimal and deep tech scene, written from the dancefloor, not from the press release.',
  keywords: ['clubbing culture', 'magazine clubbing', 'scena minimal', 'deep tech', 'reportage', 'dj'],
  alternates: { canonical: '/media' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/media`,
    title: 'Clubbing Culture Magazine · Hertz Clubbing Collective',
    description:
      'Reportage and arguments on the minimal and deep tech scene, written from the dancefloor. Signed Hertz Redazione.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function MediaPage() {
  const feature = featuredArticle()
  const rest = ARTICLES.filter((a) => a.slug !== feature.slug)

  /* Blog dichiarato: rende esplicito che Hertz pubblica editoriale proprio,
     non solo date. È il segnale che porta le citazioni sugli articoli. */
  const desk = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE.url}/media#blog`,
    name: 'Hertz — clubbing culture',
    description:
      'The Hertz editorial desk: reportage and arguments on clubbing culture and the minimal and deep tech scene.',
    url: `${SITE.url}/media`,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    blogPost: ARTICLES.map((a) => ({
      '@type': 'Article',
      '@id': `${SITE.url}/media/${a.slug}#article`,
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      url: `${SITE.url}/media/${a.slug}`,
      image: `${SITE.url}${a.heroImage}`,
      author: { '@type': 'Organization', '@id': ORG_ID, name: a.author },
    })),
  }

  return (
    <main id="main">
      <JsonLd data={desk} />
      <JsonLd
        data={itemListNode(
          'Hertz editorial',
          ARTICLES.map((a) => ({ name: a.title, url: `${SITE.url}/media/${a.slug}` })),
        )}
      />
      <JsonLd data={breadcrumbNode([{ name: 'Media', path: '/media' }])} />

      {/* ── MASTHEAD ── */}
      <Section surface="white" space="lg">
        <div className={styles.masthead}>
          <span className={`${styles.mastKicker} hz-mono`}>Media · the editorial desk</span>
          <h1 className={styles.mastTitle}>
            <span className={styles.mastThin}>Clubbing</span>{' '}
            <span className={styles.mastBold}>culture.</span>
          </h1>
          <p className={styles.mastStand}>
            Reportage and arguments about the music we care about, written from the dancefloor rather
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
