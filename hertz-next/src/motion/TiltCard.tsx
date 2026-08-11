'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { useEnableMotion } from './useEnableMotion'

/**
 * Tilt 3D LEGGERO guidato dal puntatore: la card ruota di pochi gradi verso il
 * cursore (spring per morbidezza), con un lieve sollevamento in profondità, poi
 * torna piatta all'uscita. SSR-safe e reduced-motion aware come Parallax: il
 * transform si applica SOLO dopo il mount e senza prefers-reduced-motion → prima
 * render identica al server (nessun mismatch) e nessun movimento se l'utente ha
 * ridotto le animazioni.
 */
export default function TiltCard({
  children,
  className,
  max = 5,
  lift = 6,
  style,
}: {
  children: ReactNode
  className?: string
  /** rotazione massima in gradi su ciascun asse */
  max?: number
  /** sollevamento in profondità (px translateZ) mentre il cursore è sopra */
  lift?: number
  style?: CSSProperties
}) {
  const enabled = useEnableMotion()
  const ref = useRef<HTMLDivElement>(null)
  const spring = { stiffness: 210, damping: 20, mass: 0.5 }
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const hover = useMotionValue(0)
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)
  const sh = useSpring(hover, spring)
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const z = useTransform(sh, [0, 1], [0, lift])

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onEnter() {
    if (enabled) hover.set(1)
  }
  function onLeave() {
    hover.set(0)
    px.set(0)
    py.set(0)
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1100, ...style }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={enabled ? { rotateX, rotateY, z, transformStyle: 'preserve-3d' } : undefined}
      >
        {children}
      </motion.div>
    </div>
  )
}
