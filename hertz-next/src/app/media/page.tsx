import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ArticleCard from '@/components/media/ArticleCard'
import { ARTICLES, featuredArticle } from '@/content/media'
import styles from './media.module.css'

export const metadata: Metadata = {
  title: 'Media',
  description:
    "L'editoriale Hertz: reportage e letture sulla scena minimal & deep tech, firmati Hertz Redazione.",
  alternates: { canonical: '/media' },
}

export default function MediaPage() {
  const feature = featuredArticle()
  const rest = ARTICLES.filter((a) => a.slug !== feature.slug)

  return (
    <main id="main">
      <Section surface="white" space="lg">
        <PageHeader
          index="04"
          kicker="Media"
          title="Clubbing culture."
          intro={
            <p>
              Our editorial desk — reportage and arguments about the music we care about, written
              from the floor rather than the press release. Signed Hertz Redazione.
            </p>
          }
          aside={<p className="hz-mono">{ARTICLES.length} pieces</p>}
        />
        <div className={styles.feature}>
          <ArticleCard article={feature} feature />
        </div>
      </Section>

      <Section surface="paper" space="lg">
        <SectionLabel index="05" kicker="Latest" title="More reading." />
        <div className={styles.grid}>
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>
    </main>
  )
}
