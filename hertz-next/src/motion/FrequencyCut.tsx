'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DURATION, EASE } from '@/lib/motion/tokens'
import styles from './FrequencyCut.module.css'

/**
 * FrequencyCut — la firma di movimento Hertz, riutilizzabile.
 * Una linea attraversa una superficie, accumula tensione, genera un impulso
 * (il "morso" di frequenza), seziona/maschera, provoca un breve offset
 * controllato, poi libera lo spazio. SEMPRE causa→effetto.
 *
 * Vietato: glitch, RGB split, jitter casuale, equalizzatore, oscillazione
 * continua, neon. Nessun loop infinito: la linea attraversa e si assesta.
 *
 * Varianti (scala + durata): micro (hover/bottone/filtro) · navigation
 * (cambio pagina) · editorial (immagini/poster/sezioni) · signature (Hero).
 * `onImpulse` viene chiamato all'istante del taglio → il parent può applicare
 * il proprio offset (es. spostare/comprimere il contenuto): il movimento del
 * contenuto è EFFETTO del taglio, non decorazione parallela.
 */
type Variant = 'micro' | 'navigation' | 'editorial' | 'signature'
type Trigger = 'inView' | 'mount' | 'manual'

const SPEC: Record<Variant, { dur: keyof typeof DURATION; thickness: number; bite: number }> = {
  micro: { dur: 'ui', thickness: 1, bite: 1.8 },
  navigation: { dur: 'reveal', thickness: 1.5, bite: 2.4 },
  editorial: { dur: 'editorial', thickness: 2, bite: 2.8 },
  signature: { dur: 'signature', thickness: 3, bite: 3.2 },
}

export default function FrequencyCut({
  variant = 'editorial',
  trigger = 'inView',
  /** cambia questo valore per rieseguire (utile in demo / manual) */
  playKey,
  onImpulse,
  className = '',
}: {
  variant?: Variant
  trigger?: Trigger
  playKey?: number
  onImpulse?: () => void
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const spec = SPEC[variant]

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const line = el.querySelector<SVGLineElement>('[data-line]')
      if (!line) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(line, { scaleX: 1, autoAlpha: 0.5 }) // esito, nessun movimento
        return
      }
      gsap.ticker.lagSmoothing(0)
      const total = DURATION[spec.dur]

      const build = () => {
        gsap.killTweensOf(line)
        const tl = gsap.timeline()
        // tensione: la linea attraversa
        tl.fromTo(
          line,
          { scaleX: 0, scaleY: 1, autoAlpha: 0.7, transformOrigin: 'left center' },
          { scaleX: 1, duration: total * 0.55, ease: EASE.compression.gsap },
        )
        // impulso: morso verticale netto → effetto sul contenuto
        tl.to(line, { scaleY: spec.bite, duration: total * 0.12, ease: EASE.rupture.gsap, onStart: () => onImpulse?.() })
        tl.to(line, { scaleY: 1, duration: total * 0.12, ease: EASE.settle.gsap })
        // libera lo spazio
        tl.to(line, { autoAlpha: 0, scaleX: 0, transformOrigin: 'right center', duration: total * 0.3, ease: EASE.uiInOut.gsap }, '>-0.02')
        return tl
      }

      if (trigger === 'mount') {
        build()
      } else if (trigger === 'inView') {
        gsap.set(line, { scaleX: 0, autoAlpha: 0 })
        const io = new IntersectionObserver(
          (e) => {
            if (e[0].isIntersecting) {
              build()
              io.disconnect()
            }
          },
          { threshold: 0.3 },
        )
        io.observe(el)
        return () => io.disconnect()
      } else {
        // manual: rieseguito da playKey (dependency)
        build()
      }
    },
    { scope: root, dependencies: [playKey, variant] },
  )

  return (
    <div ref={root} className={`${styles.cut} ${className}`.trim()} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 100 4" preserveAspectRatio="none">
        <line
          data-line=""
          x1="0"
          y1="2"
          x2="100"
          y2="2"
          stroke="var(--raw-ink, #151515)"
          strokeWidth={spec.thickness}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
