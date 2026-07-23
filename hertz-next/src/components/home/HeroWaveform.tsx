'use client'

import { useEffect, useRef } from 'react'
import { useEnableMotion } from '@/motion/useEnableMotion'
import styles from './HeroWaveform.module.css'

/**
 * HeroWaveform — la "firma" del brand resa viva: l'impulso di frequenza del
 * mark hertz come sinusoide a destra della hero. Onda che viaggia + reattiva
 * al puntatore (il movimento del mouse eccita l'ampiezza, poi si riassesta),
 * stesso linguaggio "segnale" del campo di puntini dietro. SVG + un solo rAF,
 * currentColor via token. Reduced-motion / SSR → onda statica (nessun rAF).
 */
const W = 520
const H = 200
const N = 170
const MID = H / 2

function wavePath(phase: number, amp: number, freq: number, envPow: number) {
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const x = t * W
    // inviluppo a "pacchetto"/impulso: massimo al centro, si smorza ai bordi
    const e = Math.pow(Math.sin(Math.PI * t), envPow)
    const y = MID + amp * e * Math.sin(freq * t * Math.PI * 2 + phase)
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1)
  }
  return d
}

// pose statiche (SSR / no-JS / reduced-motion): l'onda è già visibile
const D1_STATIC = wavePath(0.3, 42, 3, 1.5)
const D2_STATIC = wavePath(0.3 * 0.82 + 1.5, 42 * 0.6, 4, 1.5)

export default function HeroWaveform({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const p1 = useRef<SVGPathElement>(null)
  const p2 = useRef<SVGPathElement>(null)
  const enabled = useEnableMotion()

  useEffect(() => {
    if (!enabled) return // resta sulle pose statiche

    let raf = 0
    let visible = true
    let phase = 0
    let amp = 28
    let ampTarget = 28
    let last = 0

    const set = (ph: number, a: number) => {
      p1.current?.setAttribute('d', wavePath(ph, a, 3, 1.5))
      p2.current?.setAttribute('d', wavePath(ph * 0.82 + 1.5, a * 0.6, 4, 1.5))
    }
    const onMove = () => {
      ampTarget = 56
    }

    function tick(ts: number) {
      if (!last) last = ts
      const dt = Math.min(0.05, (ts - last) / 1000)
      last = ts
      phase += dt * 1.7
      // idle: l'eccitazione decade, l'ampiezza torna al respiro di base
      ampTarget += (28 - ampTarget) * (1 - Math.pow(0.35, dt))
      amp += (ampTarget - amp) * (1 - Math.pow(0.015, dt))
      set(phase, amp)
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible && !raf) {
          last = 0
          raf = requestAnimationFrame(tick)
        } else if (!visible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    if (wrapRef.current) io.observe(wrapRef.current)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [enabled])

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className ?? ''}`.trim()} aria-hidden="true">
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} fill="none" preserveAspectRatio="xMidYMid meet">
        <line className={styles.axis} x1="0" y1={MID} x2={W} y2={MID} />
        <path ref={p2} className={styles.wave2} d={D2_STATIC} />
        <path ref={p1} className={styles.wave1} d={D1_STATIC} />
      </svg>
    </div>
  )
}
