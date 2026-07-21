'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Runtime motion HERTZ (Fase 3).
 * - Lenis coordina lo smooth-scroll ed è sincronizzato con GSAP ScrollTrigger.
 * - MotionConfig(reducedMotion="user") propaga il rispetto di
 *   prefers-reduced-motion a tutti i componenti Motion for React.
 * - Con prefers-reduced-motion: reduce → scroll nativo, niente Lenis.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/** Tiene ScrollTrigger in sync con lo scroll interpolato di Lenis. */
function LenisBridge() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])
  return null
}

/** Ricalcola i trigger dopo un cambio rotta (nuova pagina montata). */
function RouteRefresh() {
  const pathname = usePathname()
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 140)
    return () => window.clearTimeout(id)
  }, [pathname])
  return null
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const inner = (
    <MotionConfig reducedMotion="user">
      <RouteRefresh />
      {children}
    </MotionConfig>
  )

  if (reduced) return inner

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <LenisBridge />
      {inner}
    </ReactLenis>
  )
}
