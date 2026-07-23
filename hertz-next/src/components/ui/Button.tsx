import Link from 'next/link'
import type { ReactNode } from 'react'
import Arrow from './Arrow'
import styles from './Button.module.css'

type Variant = 'solid' | 'ghost' | 'text'

interface Props {
  href: string
  children: ReactNode
  variant?: Variant
  external?: boolean
  arrow?: boolean
  className?: string
}

/**
 * Bottone editoriale token-driven (Link interno o <a> esterno).
 * Colori derivati dai token di superficie → si adatta a ogni sezione.
 * Target touch ≥44px.
 */
export default function Button({
  href,
  children,
  variant = 'solid',
  external = false,
  arrow = false,
  className = '',
}: Props) {
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim()
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          <Arrow />
        </span>
      )}
    </>
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
