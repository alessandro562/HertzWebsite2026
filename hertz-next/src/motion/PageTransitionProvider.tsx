'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import styles from './PageTransitionProvider.module.css'

/**
 * PageTransitionProvider — orchestratore UNICO dei cambi pagina.
 * Responsabilità:
 * - focus management: dopo la navigazione il focus va a #main (accessibilità),
 *   con preventScroll (nessun salto), MAI al primo caricamento;
 * - transizione di navigazione proprietaria e BREVE (una linea di frequenza
 *   attraversa in alto, ~reveal), non una intro lunga a ogni pagina;
 * - reduced-motion: nessuna linea, solo focus/annuncio;
 * - browser senza View Transitions API: i morph condivisi degradano a
 *   navigazione normale (gestito da React <ViewTransition>); qui la linea resta
 *   comunque un miglioramento CSS indipendente;
 * - niente scroll hijack, niente blocco navigazione: Next/Lenis gestiscono lo
 *   scroll; questo componente non lo tocca.
 */
export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const first = useRef(true)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // linea di navigazione (skip se reduced-motion)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const line = lineRef.current
    if (line && !reduce) {
      line.classList.remove(styles.play)
      // reflow per riavviare l'animazione CSS
      void line.offsetWidth
      line.classList.add(styles.play)
    }
    // focus al contenuto principale della nuova pagina (a11y)
    const main = document.getElementById('main')
    if (main) {
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }, [pathname])

  return (
    <>
      <div ref={lineRef} className={styles.navLine} aria-hidden="true" />
      {children}
    </>
  )
}
