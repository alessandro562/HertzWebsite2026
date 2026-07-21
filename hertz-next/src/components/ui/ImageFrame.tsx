/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import styles from './ImageFrame.module.css'

interface Props {
  src: string
  alt: string
  /** es. '4 / 5', '16 / 9'. Se assente l'immagine scorre all'altezza naturale. */
  ratio?: string
  caption?: ReactNode
  priority?: boolean
  className?: string
}

/**
 * Cornice immagine responsive con aspect-lock opzionale, lazy-load e alt.
 * <img> nativo (coerente col resto del sito); upgrade a next/image → F6.
 */
export default function ImageFrame({ src, alt, ratio, caption, priority = false, className = '' }: Props) {
  return (
    <figure className={`${styles.frame} ${className}`.trim()}>
      <div className={styles.box} data-ratio={ratio ? '' : undefined} style={ratio ? { aspectRatio: ratio } : undefined}>
        <img
          src={src}
          alt={alt}
          className={styles.img}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      {caption && <figcaption className={styles.cap}>{caption}</figcaption>}
    </figure>
  )
}
