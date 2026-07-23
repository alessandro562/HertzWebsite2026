/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import GlitchFX from './GlitchFX'
import styles from './ImageFrame.module.css'

interface Props {
  src: string
  alt: string
  /** es. '4 / 5', '16 / 9'. Se assente l'immagine scorre all'altezza naturale. */
  ratio?: string
  caption?: ReactNode
  priority?: boolean
  className?: string
  /** texture glitch sulla foto (default true); false per prodotti/non-foto. */
  glitch?: boolean
}

/**
 * Cornice immagine responsive con aspect-lock opzionale, lazy-load e alt.
 * <img> nativo (coerente col resto del sito); upgrade a next/image → F6.
 * Di default appoggia la texture glitch (foto): passare glitch={false} per i
 * contesti non fotografici (prodotti shop, cutout).
 */
export default function ImageFrame({
  src,
  alt,
  ratio,
  caption,
  priority = false,
  className = '',
  glitch = true,
}: Props) {
  return (
    <figure className={`${styles.frame} ${className}`.trim()}>
      <div
        className={`${styles.box}${glitch ? ' hz-glitch' : ''}`}
        data-ratio={ratio ? '' : undefined}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <img
          src={src}
          alt={alt}
          className={styles.img}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        {glitch && <GlitchFX />}
      </div>
      {caption && <figcaption className={styles.cap}>{caption}</figcaption>}
    </figure>
  )
}
