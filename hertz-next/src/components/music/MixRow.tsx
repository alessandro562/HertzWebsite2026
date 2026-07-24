'use client'

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import type { Mix } from '@/content/artists'
import WaveformPulse from '@/motion/WaveformPulse'
import Arrow from '@/components/ui/Arrow'
import styles from './MixRow.module.css'

/** Riga mix → SoundCloud (nuova scheda). Play on-action, nessun autoplay.
 *  Copertina reale della traccia (via oEmbed, presa dal genitore) se
 *  disponibile; altrimenti WaveformPulse: idle a riposo, un impulso singolo
 *  all'hover/focus (non un loop) — segnala "contenuto audio" senza player. */
export default function MixRow({
  mix,
  artist,
  art,
}: {
  mix: Mix
  artist: string
  art?: string | null
}) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={mix.url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.row} hz-rowfx`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {art ? (
        <img src={art} alt="" className={styles.art} loading="lazy" />
      ) : (
        <WaveformPulse state={hover ? 'hover' : 'idle'} className={styles.play} />
      )}
      <span className={styles.main}>
        <span className={styles.title}>{mix.t}</span>
        <span className={styles.artist}>{artist}</span>
      </span>
      <span className={`${styles.tag} hz-mono`}>{mix.tag ?? 'Mix'}</span>
      <span className={styles.arrow} aria-hidden="true">
        <Arrow />
      </span>
    </a>
  )
}
