'use client'

import { useEffect, useRef } from 'react'
import { useEnableMotion } from '@/motion/useEnableMotion'
import styles from './HeroWaveform.module.css'

/**
 * HeroWaveform — la sinusoide UFFICIALE del brand: l'impulso di frequenza del
 * logo hertz (ritagliato da hertz-logo-official.png → hertz-sinusoid.png), reso
 * vivo a destra della hero. La forma d'onda ufficiale fa da maschera: dentro,
 * un fill Cold su cui scorre un impulso di luce Signal (lo "scan" del segnale),
 * + micro-parallax sul puntatore — stesso "reagisce al mouse" della griglia.
 * currentColor/token via mask. Reduced-motion / SSR → sinusoide statica.
 */
export default function HeroWaveform({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const enabled = useEnableMotion()

  useEffect(() => {
    if (!enabled) return
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    let target = 0
    let cur = 0
    const onMove = (e: PointerEvent) => {
      target = (e.clientX / window.innerWidth - 0.5) * 2 // -1..1
    }
    const tick = () => {
      cur += (target - cur) * 0.06
      el.style.setProperty('--px', cur.toFixed(3))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [enabled])

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className ?? ''}`.trim()} aria-hidden="true">
      <span className={styles.base} />
      <span className={styles.sweep} />
    </div>
  )
}
