import type { CSSProperties } from 'react'
import styles from './HertzLogo.module.css'

/**
 * Logo ufficiale Hertz completo — sinusoide (simbolo di frequenza) + wordmark.
 * Reso via CSS mask + `currentColor`: prende il colore del testo corrente,
 * quindi si adatta da solo a ogni superficie (nero su chiare, bianco su scure),
 * come faceva la vecchia scritta testuale. `size` = altezza in px del lockup.
 */
export default function HertzLogo({
  size = 40,
  className = '',
  title = 'Hertz Clubbing Collective',
}: {
  size?: number
  className?: string
  title?: string
}) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`${styles.mark} ${className}`}
      style={{ '--logo-h': `${size}px` } as CSSProperties}
    />
  )
}
