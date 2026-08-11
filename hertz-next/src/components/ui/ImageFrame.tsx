import Image from 'next/image'
import type { ReactNode } from 'react'
import GlitchFX from './GlitchFX'
import styles from './ImageFrame.module.css'

interface Props {
  src: string
  alt: string
  /** es. '4 / 5', '16 / 9'. Necessario per l'ottimizzazione (modalità fill). */
  ratio?: string
  caption?: ReactNode
  priority?: boolean
  className?: string
  /** texture glitch sulla foto (default true); false per prodotti/non-foto. */
  glitch?: boolean
  /** larghezza resa, per scegliere la variante giusta. Default: griglia editoriale. */
  sizes?: string
}

const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

/**
 * Cornice immagine responsive con aspect-lock, lazy-load e alt.
 * Usa next/image in modalità `fill`: l'ottimizzatore serve WebP alla dimensione
 * giusta invece dell'originale (prima erano JPEG da 1280-1920px renderizzati in
 * miniature). L'aspect-ratio sul box evita il layout shift.
 * Di default appoggia la texture glitch (foto): glitch={false} per i contesti
 * non fotografici (prodotti shop, cutout).
 */
export default function ImageFrame({
  src,
  alt,
  ratio,
  caption,
  priority = false,
  className = '',
  glitch = true,
  sizes = DEFAULT_SIZES,
}: Props) {
  return (
    <figure className={`${styles.frame} ${className}`.trim()}>
      <div
        className={`${styles.box}${glitch ? ' hz-glitch' : ''}`}
        data-ratio={ratio ? '' : undefined}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {ratio ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={styles.img}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
          />
        ) : (
          /* senza ratio non conosciamo le proporzioni: si resta sull'altezza
             naturale. Passare `ratio` per ottenere l'immagine ottimizzata. */
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className={styles.img} loading="lazy" decoding="async" />
        )}
        {glitch && <GlitchFX />}
      </div>
      {caption && <figcaption className={styles.cap}>{caption}</figcaption>}
    </figure>
  )
}
