'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useEnableMotion } from './useEnableMotion'

/**
 * Parallax legato allo scroll per immagini/ritratti: sposta (e opzionalmente
 * scala) il contenuto dando profondità e cambi di crop. Struttura DOM stabile
 * (SSR-safe): il transform si applica SOLO dopo il mount e se non c'è
 * prefers-reduced-motion (via useEnableMotion) → niente mismatch, niente
 * movimento posizionale in reduced-motion.
 */
export default function Parallax({
  children,
  speed = 60,
  zoom = false,
  className,
  style,
}: {
  children: ReactNode
  speed?: number
  zoom?: boolean
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], zoom ? [1.12, 1.05, 1.12] : [1, 1, 1])

  return (
    <motion.div ref={ref} className={className} style={enabled ? { ...style, y, scale } : style}>
      {children}
    </motion.div>
  )
}
