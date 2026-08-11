'use client'

import Image from 'next/image'
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
        <Image src={art} alt="" className={styles.art} width={96} height={96} sizes="48px" />
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
