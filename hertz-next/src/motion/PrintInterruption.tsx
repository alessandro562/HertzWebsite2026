'use client'

/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from 'react'
import ImageReveal from './ImageReveal'
import FrequencyCut from './FrequencyCut'
import styles from './PrintInterruption.module.css'

/**
 * PrintInterruption — sistema editoriale generale estratto dal linguaggio della
 * Hero (fotografia dominante · frammento secondario · bande · retino · mask ·
 * frequenza che attraversa). Riutilizzabile per aperture editoriali (Archive,
 * Media, sezioni), NON è la Hero: condivide le primitive (ImageReveal,
 * FrequencyCut) e i token, ma la coreografia specifica della Hero
 * (HeroIntroSequence) resta isolata e non viene duplicata qui.
 *
 * Reduced-motion / no-JS: le primitive lasciano immagini e contenuto visibili
 * e in posizione (nessun blocco, nessun opacity:0 residuo).
 */
export default function PrintInterruption({
  image,
  alt,
  aspectRatio = '3 / 2',
  fragment,
  caption,
  className = '',
}: {
  image: string
  alt: string
  aspectRatio?: string
  /** frammento fotografico secondario (piccolo, offset in alto a destra) */
  fragment?: { src: string; alt?: string }
  caption?: ReactNode
  className?: string
}) {
  return (
    <figure className={`${styles.print} ${className}`.trim()}>
      <ImageReveal variant="print" duration="editorial" className={styles.dominant} style={{ aspectRatio }}>
        <img src={image} alt={alt} className={styles.img} loading="lazy" decoding="async" />
      </ImageReveal>

      <span className={styles.band1} aria-hidden="true" />
      <span className={styles.band2} aria-hidden="true" />
      <FrequencyCut variant="editorial" trigger="inView" className={styles.cut} />

      {fragment && (
        <ImageReveal variant="frequency" duration="reveal" className={styles.fragment}>
          <img src={fragment.src} alt={fragment.alt ?? ''} className={styles.img} loading="lazy" decoding="async" />
        </ImageReveal>
      )}

      {caption && <figcaption className={`${styles.cap} hz-mono`}>{caption}</figcaption>}
    </figure>
  )
}
