'use client'

import { motion, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Reveal editoriale con VARIANTI (mai lo stesso movimento ovunque).
 * La struttura DOM è sempre la stessa (SSR-safe): il rispetto di
 * prefers-reduced-motion è globale via MotionConfig(reducedMotion="user"),
 * che disattiva i transform lasciando un fade non-posizionale.
 */

type RevealVariant = 'up' | 'rise' | 'fade' | 'blur' | 'left' | 'right' | 'mask'

const EASE = [0.16, 1, 0.3, 1] as const

const VARIANTS: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } },
  rise: { hidden: { opacity: 0, y: 64 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  blur: { hidden: { opacity: 0, filter: 'blur(10px)' }, show: { opacity: 1, filter: 'blur(0px)' } },
  left: { hidden: { opacity: 0, x: -44 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 44 }, show: { opacity: 1, x: 0 } },
  mask: { hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, show: { opacity: 1, clipPath: 'inset(0 0 0% 0)' } },
}

const TAGS = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  figure: motion.figure,
  article: motion.article,
} as const

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  as?: keyof typeof TAGS
  delay?: number
  duration?: number
  amount?: number
  once?: boolean
  className?: string
  style?: CSSProperties
}

export default function Reveal({
  children,
  variant = 'up',
  as = 'div',
  delay = 0,
  duration = 0.7,
  amount = 0.3,
  once = true,
  className,
  style,
}: RevealProps) {
  const M = TAGS[as]
  return (
    <M
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

/* ── Stagger: contenitore che rivela i figli in sequenza ── */
export function Stagger({
  children,
  gap = 0.08,
  amount = 0.25,
  once = true,
  className,
  style,
}: {
  children: ReactNode
  gap?: number
  amount?: number
  once?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  variant = 'up',
  duration = 0.65,
  className,
  style,
}: {
  children: ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div className={className} style={style} variants={VARIANTS[variant]} transition={{ duration, ease: EASE }}>
      {children}
    </motion.div>
  )
}
