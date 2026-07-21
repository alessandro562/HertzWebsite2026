'use client'

import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Reveal fotografico a maschera (clip-path wipe) — l'immagine si scopre da un
 * bordo netto invece del solito fade verticale. Struttura DOM stabile;
 * reduced-motion gestito globalmente da MotionConfig.
 */
type Dir = 'up' | 'down' | 'left' | 'right'

const HIDDEN: Record<Dir, string> = {
  up: 'inset(100% 0 0 0)',
  down: 'inset(0 0 100% 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
}

export default function MaskImage({
  children,
  direction = 'up',
  duration = 1,
  delay = 0,
  amount = 0.3,
  className,
  style,
}: {
  children: ReactNode
  direction?: Dir
  duration?: number
  delay?: number
  amount?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ clipPath: HIDDEN[direction] }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
