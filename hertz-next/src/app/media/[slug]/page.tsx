import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import ArticleCard from '@/components/media/ArticleCard'
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

  const body = articleBody(slug)
  const related = relatedArticles(slug)

  return (
    <main id="main">
      <article>
        <Section surface="white" space="md">
          <p className={`${styles.crumb} hz-mono`}>
            <Link href="/media">Media</Link>
            <span aria-hidden="true"> / </span>
            <span>{a.rubric}</span>
          </p>

          <header className={styles.head}>
            <span className={`${styles.rubric} hz-mono`}>{a.rubric}</span>
            <h1 className={styles.title}>{a.title}</h1>
            <p className={styles.lead}>{a.subtitle}</p>
            <p className={`${styles.meta} hz-mono`}>
              {a.author} · {articleDate(a)} · {a.readingTimeMinutes} min read
            </p>
          </header>

          <ImageFrame
            src={a.heroImage}
            alt={a.heroImageAlt}
            ratio="16 / 9"
            priority
            className={styles.hero}
          />
        </Section>

        <Section surface="white" space="lg">
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: body }} />
        </Section>
      </article>

      {related.length > 0 && (
        <Section surface="paper" space="lg">
          <SectionLabel kicker="Related" title="Keep reading." link={{ href: '/media', label: 'All media' }} />
          <div className={styles.related}>
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}
