'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Artist } from '@/content/artists'
import ImageFrame from '@/components/ui/ImageFrame'
import ImageReveal from '@/motion/ImageReveal'
import ViewMorph from '@/motion/ViewMorph'
import FrequencyCut from '@/motion/FrequencyCut'
import ArtistSignalGlyph from './ArtistSignalGlyph'
import styles from './ArtistIndexRow.module.css'

const REVEAL_VARIANT = {
  '01': 'print',
  '02': 'vertical',
  '03': 'horizontal',
  '04': 'frequency',
} as const

/**
 * ArtistIndexRow — modulo editoriale del roster (non una card). Il numero
 * di catalogo (`n`) guida la composizione via CSS (`data-n`): lato/larghezza
 * della foto, posizione di N°·freq, allineamento del testo e trattamento
 * tipografico del nome cambiano per ciascun artista — coerenti come sistema,
 * mai identici. Nessuna invenzione: solo dati reali (n, freq, role, foto).
 */
export default function ArtistIndexRow({ artist, first = false }: { artist: Artist; first?: boolean }) {
  const [hoverKey, setHoverKey] = useState(0)
  const reveal = REVEAL_VARIANT[artist.n as keyof typeof REVEAL_VARIANT] ?? 'print'
  const [firstName, ...rest] = artist.name.split(' ')
  const lastName = rest.join(' ')

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className={styles.row}
      data-n={artist.n}
      data-first={first || undefined}
      onMouseEnter={() => setHoverKey((k) => k + 1)}
    >
      <div className={styles.photo}>
        <ImageReveal variant={reveal} duration="editorial" className={styles.photoReveal}>
          <ViewMorph name={`artist-portrait-${artist.slug}`}>
            <ImageFrame src={artist.portrait} alt={artist.name} ratio="4 / 5" className={styles.photoFrame} />
          </ViewMorph>
        </ImageReveal>
      </div>

      <div className={styles.text}>
        <span className={styles.tag}>
          <span className="hz-mono" aria-hidden="true">
            {artist.n} · {artist.freq}
          </span>
          <ArtistSignalGlyph n={artist.n} freq={artist.freq} size="sm" className={styles.tagGlyph} />
        </span>

        <ViewMorph name={`artist-name-${artist.slug}`}>
          <span className={styles.name}>
            <span className={styles.nameLine}>{firstName}</span>
            {lastName && <span className={styles.nameLine}>{lastName}</span>}
          </span>
        </ViewMorph>

        <span className={styles.role}>{artist.role}</span>

        <span className={styles.watermark} aria-hidden="true">
          {artist.freq}
        </span>
      </div>

      <FrequencyCut variant="micro" trigger="manual" playKey={hoverKey} className={styles.sweep} />
    </Link>
  )
}
