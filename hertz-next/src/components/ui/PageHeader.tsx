import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

interface Props {
  index?: string
  kicker?: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  className?: string
}

/**
 * Intestazione di pagina (h1) — kicker mono + titolo signature + intro
 * misurata, con colonna aside opzionale. Superficie ereditata dalla Section.
 */
export default function PageHeader({ index, kicker, title, intro, aside, className = '' }: Props) {
  return (
    <header className={`${styles.head} ${className}`.trim()}>
      <div className={styles.main}>
        {(index || kicker) && (
          <p className={`${styles.kicker} hz-mono`}>
            {index && <span className={styles.idx}>{index}</span>}
            {kicker}
          </p>
        )}
        <h1 className={styles.title}>{title}</h1>
        {intro && <div className={styles.intro}>{intro}</div>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </header>
  )
}
