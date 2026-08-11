'use client'

import { ReactLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

/** prefers-reduced-motion via useSyncExternalStore: sottoscrizione reale al
 * media query change (non un setState sincrono dentro un effect), server
 * snapshot = false (nessun mismatch di idratazione). */
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function getReducedMotionServerSnapshot() {
  return false
}

/**
 * Runtime motion HERTZ (Fase 3).
 * - Lenis coordina lo smooth-scroll.
 * - MotionConfig(reducedMotion="user") propaga il rispetto di
 *   prefers-reduced-motion a tutti i componenti Motion for React.
 * - Con prefers-reduced-motion: reduce → scroll nativo, niente Lenis.
 *
 * Nota: qui c'era anche il ponte Lenis↔GSAP ScrollTrigger (registerPlugin +
 * update a ogni scroll + refresh a ogni cambio rotta). Nessun componente del
 * sito crea un ScrollTrigger — le due animazioni GSAP che esistono
 * (FrequencyCut, HeroIntroSequence) sono timeline pure — quindi il plugin
 * viaggiava nel bundle condiviso di OGNI rotta per non pilotare niente.
 * Rimosso: GSAP ora entra solo nei chunk che lo usano davvero. Se in futuro
 * servirà uno ScrollTrigger, il ponte va ripristinato insieme.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )

  const inner = <MotionConfig reducedMotion="user">{children}</MotionConfig>

  if (reduced) return inner

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {inner}
    </ReactLenis>
  )
}
