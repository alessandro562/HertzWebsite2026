import Link from 'next/link'
import { type Article, articleDate } from '@/content/media'
import ImageFrame from '@/components/ui/ImageFrame'
import styles from './ArticleCard.module.css'

/** Card articolo → pagina media. `feature` = variante grande con excerpt. */
export default function ArticleCard({ article, feature = false }: { article: Article; feature?: boolean }) {
  return (
    <Link href={`/media/${article.slug}`} className={`${styles.card} ${feature ? styles.feature : ''}`.trim()}>
      <ImageFrame
        src={article.heroImage}
        alt={article.heroImageAlt}
        ratio={feature ? '16 / 9' : '3 / 2'}
        className={styles.img}
      />
      <div className={styles.body}>
        <span className={`${styles.rubric} hz-mono`}>{article.rubric}</span>
        <span className={styles.title}>{article.title}</span>
        {feature && <span className={styles.excerpt}>{article.excerpt}</span>}
        <span className={`${styles.meta} hz-mono`}>
          {article.author} · {article.readingTimeMinutes} min · {articleDate(article)}
        </span>
      </div>
    </Link>
  )
}
