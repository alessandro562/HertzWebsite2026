import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

interface Props {
  kicker?: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  className?: string
  noDivider?: boolean
}

/**
 * Intestazione di pagina (h1) — kicker mono + titolo signature + intro
 * misurata, con colonna aside opzionale. Superficie ereditata dalla Section.
 */
export default function PageHeader({
  kicker,
  title,
  intro,
  aside,
  className = '',
  noDivider = false,
}: Props) {
  return (
    <header
      className={`${styles.head} ${noDivider ? styles.noDivider : ''} ${className}`.trim()}
    >
      <div className={styles.main}>
        {kicker && <p className={`${styles.kicker} hz-mono`}>{kicker}</p>}
        <h1 className={styles.title}>{title}</h1>
        {intro && <div className={styles.intro}>{intro}</div>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </header>
  )
}
