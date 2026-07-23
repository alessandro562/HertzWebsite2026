'use client'

import { useState } from 'react'
import styles from './ArtistSignalGlyph.module.css'

/**
 * ArtistSignalGlyph — visual signature generated from Hertz catalogue and
 * frequency metadata (n, freq, sessions), NOT a real audio analysis. A row
 * of bars whose count/heights are derived deterministically from real,
 * already-displayed data (no randomization, same input → same glyph).
 *
 * Recognizable as a single frame: a fixed short bar sequence, never an
 * equalizer loop. Hover/focus gives one short, causal response (a single
 * settle), never a continuous animation. Reduced-motion → fully static.
 */
export default function ArtistSignalGlyph({
  n,
  freq,
  sessions = 0,
  size = 'md',
  className = '',
}: {
  /** numero di catalogo, es. '01' */
  n: string
  /** frequenza identitaria, es. '120 Hz' */
  freq: string
  /** conteggio reale (date con Hertz), 0 se assente */
  sessions?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const [active, setActive] = useState(false)
  const seed = Number(n) || 1
  const hz = parseInt(freq, 10) || 120
  const bars = 7
  const heights = Array.from({ length: bars }, (_, i) => {
    // deterministico: combina indice catalogo, hz e posizione della barra
    const wave = Math.sin((i + 1) * (hz / 40) + seed) * 0.5 + 0.5
    const boost = sessions > 0 ? Math.min(sessions, 12) / 12 : 0
    return 0.25 + wave * 0.55 + boost * 0.2
  })

  return (
    <span
      className={`${styles.glyph} ${className}`.trim()}
      data-size={size}
      data-active={active || undefined}
      role="img"
      aria-label={`Hertz signal signature, N°${n}, ${freq}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={-1}
    >
      <svg viewBox="0 0 56 24" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
        {heights.map((h, i) => {
          // arrotondato: evita drift dell'ultima cifra float fra Node (SSR)
          // e il motore JS del browser (CSR) su Math.sin, che altrimenti
          // genera un mismatch di idratazione sugli attributi numerici.
          const barHeight = Math.round(h * 20 * 100) / 100
          const x = i * 8 + 1
          return (
            <rect
              key={i}
              className={styles.bar}
              x={x}
              y={Math.round(((24 - barHeight) / 2) * 100) / 100}
              width={3}
              height={barHeight}
              rx={1}
              style={{ transitionDelay: `${i * 18}ms` }}
            />
          )
        })}
      </svg>
    </span>
  )
}
