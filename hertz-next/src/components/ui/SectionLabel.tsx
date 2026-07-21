import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './SectionLabel.module.css'

interface Props {
  index?: string
  kicker?: string
  title?: ReactNode
  link?: { href: string; label: string; external?: boolean }
  className?: string
}

/** Intestazione di sezione IN-pagina (h2) — kicker mono + titolo + link opzionale. */
export default function SectionLabel({ index, kicker, title, link, className = '' }: Props) {
  return (
    <div className={`${styles.head} ${className}`.trim()}>
      <div>
        {(index || kicker) && (
          <p className={`${styles.kicker} hz-mono`}>
            {index && <span className={styles.idx}>{index}</span>}
            {kicker}
          </p>
        )}
        {title && <h2 className={styles.title}>{title}</h2>}
      </div>
      {link &&
        (link.external ? (
          <a href={link.href} target="_blank" rel="noreferrer" className={styles.link}>
            {link.label}
          </a>
        ) : (
          <Link href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
    </div>
  )
}
