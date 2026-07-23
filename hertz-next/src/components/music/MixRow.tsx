'use client'

import { useState } from 'react'
import type { Mix } from '@/content/artists'
import WaveformPulse from '@/motion/WaveformPulse'
import styles from './MixRow.module.css'

/** Riga mix → SoundCloud (nuova scheda). Play on-action, nessun autoplay.
 *  WaveformPulse sostituisce il glifo play: idle a riposo, un impulso singolo
 *  all'hover/focus (non un loop) — segnala "contenuto audio" senza player. */
export default function MixRow({
  mix,
  artist,
  index,
}: {
  mix: Mix
  artist: string
  index?: number
}) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={mix.url}
      target="_blank"
      rel="noreferrer"
      className={styles.row}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {typeof index === 'number' && (
        <span className={`${styles.n} hz-mono`}>{String(index + 1).padStart(2, '0')}</span>
      )}
      <WaveformPulse state={hover ? 'hover' : 'idle'} className={styles.play} />
      <span className={styles.main}>
        <span className={styles.title}>{mix.t}</span>
        <span className={styles.artist}>{artist}</span>
      </span>
      <span className={`${styles.tag} hz-mono`}>{mix.tag ?? 'Mix'}</span>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
    </a>
  )
}
