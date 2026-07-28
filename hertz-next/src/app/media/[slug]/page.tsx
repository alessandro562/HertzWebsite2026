/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import Parallax from '@/motion/Parallax'
import Reveal from '@/motion/Reveal'
import ReadingProgress from '@/components/media/ReadingProgress'
import {
  ARTICLES,
  articleBySlug,
  articleBody,
  relatedArticles,
  articleDate,
} from '@/content/media'
import styles from './article.module.css'

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = articleBySlug(slug)
  if (!a) return {}
  return {
    title: a.title,
    description: a.subtitle,
    alternates: { canonical: `/media/${slug}` },
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.subtitle,
      images: [{ url: a.heroImage }],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = articleBySlug(slug)
  if (!a) notFound()

  // enfasi *testo* legacy → <em> (fix di resa, non tocca la sorgente)
  const body = articleBody(slug).replace(/\*([^*<>\n]+)\*/g, '<em>$1</em>')
  const related = relatedArticles(slug)

  return (
    <main id="main">
      <ReadingProgress />
      <article>
        {/* ── MASTHEAD editoriale ── */}
        <Section surface="white" space="md">
          <p className={`${styles.crumb} hz-mono`}>
            <Link href="/media">Media</Link>
            <span aria-hidden="true"> — </span>
            <span>{a.rubric}</span>
          </p>

          <header className={styles.head}>
            <div className={styles.headTop}>
              <span className={`${styles.rubric} hz-mono`}>{a.rubric}</span>
              <span className={`${styles.headTime} hz-mono`}>{a.readingTimeMinutes} min read</span>
            </div>
            <h1 className={styles.title}>{a.title}</h1>
            <p className={styles.standfirst}>{a.subtitle}</p>
            <div className={styles.byline}>
              <span className={styles.bylineName}>{a.author}</span>
              <span className={`${styles.bylineDate} hz-mono`}>{articleDate(a)}</span>
            </div>
          </header>
        </Section>

        {/* ── HERO: parallax + glitch integrato ── */}
        <Section surface="white" space="sm">
          <figure className={styles.heroFig}>
            <div className={`${styles.heroFrame} hz-glitch`}>
              <Parallax speed={38} zoom className={styles.heroParallax}>
                <img src={a.heroImage} alt={a.heroImageAlt} loading="eager" decoding="async" />
              </Parallax>
              <GlitchFX />
            </div>
          </figure>
        </Section>

        {/* ── CORPO editoriale ── */}
        <Section surface="white" space="lg">
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: body }} />
          <div className={styles.outro}>
            <span className={styles.endMark} aria-hidden="true" />
            <span className={`${styles.signoff} hz-mono`}>{a.author}</span>
          </div>
        </Section>
      </article>

      {related.length > 0 && (
        <Section surface="paper" space="lg">
          <div className={styles.relHead}>
            <span className={`${styles.relKicker} hz-mono`}>Keep reading</span>
            <Link href="/media" className={`${styles.relAll} hz-mono`}>
              All media <Arrow />
            </Link>
          </div>
          <div className={styles.related}>
            {related.map((r, i) => (
              <Reveal key={r.slug} variant="up" delay={i * 0.06}>
                <Link href={`/media/${r.slug}`} className={`${styles.relCard} hz-rowfx`}>
                  <div className={styles.relBody}>
                    <span className={`${styles.relRubric} hz-mono`}>{r.rubric}</span>
                    <span className={styles.relTitle}>{r.title}</span>
                    <span className={styles.relSub}>{r.subtitle}</span>
                  </div>
                  <span className={`${styles.relArrow} hz-fx-arrow`} aria-hidden="true">
                    <Arrow />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}
