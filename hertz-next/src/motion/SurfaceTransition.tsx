'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import type { Surface } from '@/components/ui/Section'
import styles from './SurfaceTransition.module.css'

/**
 * SurfaceTransition — passaggio proprietario tra superfici (Signal/White/Paper/
 * Cold Blue/Ink). NON una dissolvenza: una linea apre la nuova superficie e
 * una banda del colore si comprime rivelando il contenuto. Si mette come primo
 * figlio dentro una <Section>; copre la sezione e si ritrae all'ingresso in
 * viewport. IntersectionObserver + CSS (robusto, cheap). Reduced-motion → via
 * immediata (nessuna banda, contenuto già visibile).
 */
export default function SurfaceTransition({
  surface,
  children,
}: {
  /** colore della banda che si apre (di norma = superficie della Section) */
  surface?: Surface
  children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      el.dataset.state = 'open'
      return
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          el.dataset.state = 'open'
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.transition} data-state="closed" data-surface={surface} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.band} />
      {children}
    </div>
  )
}
