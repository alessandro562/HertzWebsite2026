'use client'

import type { Lang } from '@/lib/i18n'
import styles from './LangToggle.module.css'

const LANGS: Lang[] = ['en', 'it']

/**
 * Switch EN / IT controllato. Compare solo sulle superfici bilingui
 * (bookings, registrazione evento). Stato tenuto dal componente padre.
 */
export default function LangToggle({
  value,
  onChange,
  className = '',
}: {
  value: Lang
  onChange: (l: Lang) => void
  className?: string
}) {
  return (
    <div className={`${styles.toggle} ${className}`.trim()} role="group" aria-label="Language / Lingua">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={styles.btn}
          data-active={value === l || undefined}
          aria-pressed={value === l}
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
