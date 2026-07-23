'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useEnableMotion } from '@/motion/useEnableMotion'
import HeroSignalGrid from './HeroSignalGrid'
import HeroWaveform from './HeroWaveform'
import styles from './HeroKinetic.module.css'

/**
 * Hero SOLO tipografia (nessuna foto). "CLUBBING COLLECTIVE" maiuscolo che
 * gioca tra SOTTILE (thin 200) e GRASSETTO (bold 700), drift orizzontale su
 * scroll. Griglia Signal ambientale dietro; la sinusoide UFFICIALE hertz,
 * viva, allineata a sinistra in basso. Reduced-motion: statico.
 */
export default function HeroKinetic() {
  const root = useRef<HTMLElement>(null)
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })

  // drift cinetico: le due parole si allontanano in senso opposto scrollando
  const xClub = useTransform(scrollYProgress, [0, 1], ['0%', '-13%'])
  const xColl = useTransform(scrollYProgress, [0, 1], ['0%', '11%'])
  const xLogo = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section ref={root} data-surface="white" className={styles.hero} id="top">
      <HeroSignalGrid className={styles.grid} />

      <div className={styles.stage}>
        <motion.div
          className={styles.top}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="hz-mono">Bologna · since 2023</span>
        </motion.div>

        <div className={styles.type}>
          <h1 className={styles.words} aria-label="Hertz — Clubbing Collective, Bologna">
            <motion.span
              className={`${styles.word} ${styles.clubbing}`}
              style={enabled ? { x: xClub } : undefined}
              initial={{ opacity: 0, y: '18%' }}
              animate={{ opacity: 1, y: '0%' }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              Clubbing
            </motion.span>
            <motion.span
              className={`${styles.word} ${styles.collective}`}
              style={enabled ? { x: xColl } : undefined}
              initial={{ opacity: 0, y: '18%' }}
              animate={{ opacity: 1, y: '0%' }}
              transition={{ duration: 0.9, delay: 0.22, ease }}
            >
              Collective
            </motion.span>
          </h1>

          <motion.p
            className={styles.tagline}
            style={enabled ? { x: xLogo } : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <span className={styles.tagThin}>Keep the</span>{' '}
            <span className={styles.tagBold}>groove.</span>
          </motion.p>

          <HeroWaveform className={styles.wave} />
        </div>
      </div>
    </section>
  )
}
