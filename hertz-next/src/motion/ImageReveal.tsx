'use client'

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { DURATION, EASE } from '@/lib/motion/tokens'
import styles from './ImageReveal.module.css'

/**
 * ImageReveal — primitive UNICA di rivelazione fotografica editoriale.
 * Sostituisce le implementazioni isolate di clip-path/mask (incl. MaskImage).
 *
 * Robustezza (requisiti Motion Kit):
 * - lo stato BASE (SSR / no-JS / errore) è SEMPRE rivelato → l'immagine è
 *   sempre accessibile, mai bloccata a opacity:0;
 * - la reveal usa un IntersectionObserver + classi CSS (NON whileInView di
 *   Framer su un elemento con clip-path animato → evita il bug per cui
 *   l'observer non rileva mai l'elemento clippato);
 * - prefers-reduced-motion → nessuna maschera, stato finale immediato;
 * - contenuto già in vista al mount → nessun flash (non viene mai clippato);
 * - transform/opacity/clip-path/mask soltanto (compositing-friendly).
 *
 * Varianti: print · vertical · horizontal · frequency · halftone.
 */
type Variant = 'print' | 'vertical' | 'horizontal' | 'frequency' | 'halftone'

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function ImageReveal({
  children,
  variant = 'vertical',
  duration = 'editorial',
  delay = 0,
  amount = 0.28,
  className = '',
  style,
}: {
  children: ReactNode
  variant?: Variant
  /** token di durata (default 'editorial') */
  duration?: keyof typeof DURATION
  delay?: number
  amount?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useIso(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return // resta rivelato

    // già (ampiamente) in vista al mount → non clippare, niente flash
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight || 0
    if (r.top < vh * (1 - amount) && r.bottom > vh * amount) return

    el.dataset.state = 'hidden' // clip senza transizione (data-armed non ancora presente)
    el.style.setProperty('--ir-dur', `${DURATION[duration] * 1000}ms`)
    el.style.setProperty('--ir-ease', EASE[variant === 'frequency' ? 'rupture' : 'editorialOut'].css)
    el.style.setProperty('--ir-delay', `${delay * 1000}ms`)

    const raf = requestAnimationFrame(() => {
      el.dataset.armed = ''
    })
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.dataset.state = 'shown'
          io.disconnect()
        }
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [variant, duration, delay, amount])

  return (
    <div ref={ref} className={`${styles.reveal} ${className}`.trim()} data-variant={variant} style={style}>
      {children}
      {(variant === 'halftone' || variant === 'print') && <span className={styles.grain} aria-hidden="true" />}
    </div>
  )
}
