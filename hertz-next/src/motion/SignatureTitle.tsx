'use client'

import { motion, useScroll, useTransform, type Variants } from 'motion/react'
import { Children, createElement, useRef, type ElementType, type ReactNode } from 'react'
import { useEnableMotion } from './useEnableMotion'

/**
 * Titolo SIGNATURE: entrata a maschera riga-per-riga + parallax opzionale.
 * Un nodo figlio per RIGA. La composizione (fill/outline/offset/off-grid/
 * mask-in-word) resta al CSS della pagina: qui solo il movimento.
 *
 * Struttura DOM stabile (SSR-safe): l'osservatore inView è sul contenitore
 * NON traslato; le righe animano per propagazione di variant. Reduced-motion
 * è gestito globalmente da MotionConfig; il parallax è gated via
 * useEnableMotion (off su server/reduced).
 */
interface Props {
  children: ReactNode
  as?: ElementType
  className?: string
  stagger?: number
  parallax?: number
  amount?: number
  trigger?: 'mount' | 'inView'
}

const EASE = [0.16, 1, 0.3, 1] as const
const LINE: Variants = { hidden: { y: '115%' }, show: { y: '0%' } }

export default function SignatureTitle({
  children,
  as: Tag = 'h1',
  className,
  stagger = 0.1,
  parallax = 0,
  amount = 0.3,
  trigger = 'inView',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax])
  const lines = Children.toArray(children)

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger } } }

  const rows = lines.map((line, i) => (
    <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
      <motion.span style={{ display: 'block' }} variants={LINE} transition={{ duration: 0.95, ease: EASE }}>
        {line}
      </motion.span>
    </span>
  ))

  const trig =
    trigger === 'mount'
      ? { initial: 'hidden' as const, animate: 'show' as const }
      : { initial: 'hidden' as const, whileInView: 'show' as const, viewport: { once: true, amount } }

  return (
    <motion.div ref={ref} variants={container} {...trig} style={parallax && enabled ? { y } : undefined}>
      {createElement(Tag, { className }, rows)}
    </motion.div>
  )
}
