'use client'

import { useEffect, useRef } from 'react'
import styles from './SignalGridA.module.css'

/**
 * Proto A — SIGNAL GRID DEFORMATION.
 * Una griglia editoriale rigorosa (linee sottili) attraversata da una
 * frequenza che COMPRIME/ESPANDE le colonne e fa flettere le righe. Ciclo
 * ORDER → DISORDER → ORDER: il fronte d'onda passa e la griglia torna rigorosa
 * e leggibile. Non un equalizzatore: è lo scheletro della composizione che si
 * deforma. Tech: SVG (path unico ricomposto per frame) + rAF. Reduced = statico.
 */
export default function SignalGridA({ className = '' }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const wrap = wrapRef.current
    if (!path || !wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    const COLS = 16
    const ROWS = 9
    let raf = 0
    let running = false
    let start = 0

    function build(t: number) {
      // fronte d'onda: viaggia da destra a sinistra, poi pausa (ORDER)
      const cycle = 9 // s
      const phase = (t % cycle) / cycle // 0..1
      const sweep = phase < 0.66 ? phase / 0.66 : 1 // 0..1 durante lo sweep, poi fermo
      const active = phase < 0.66 ? Math.sin((phase / 0.66) * Math.PI) : 0 // intensità 0→1→0
      const waveX = W * (1.15 - sweep * 1.3) // da destra fuori campo a sinistra fuori campo
      const sigma = W * 0.14
      const disp = (x: number) => {
        const d = x - waveX
        const g = Math.exp(-(d * d) / (2 * sigma * sigma))
        return g * active
      }
      const AX = W * 0.05
      const AY = H * 0.09
      const colW = W / COLS
      const rowH = H / ROWS
      let d = ''
      // colonne verticali (x deformata → compress/expand)
      for (let i = 0; i <= COLS; i++) {
        const x0 = i * colW
        const g = disp(x0)
        const x = x0 + Math.sin((x0 - waveX) * 0.02) * AX * g
        d += `M${x.toFixed(1)},0 L${x.toFixed(1)},${H} `
      }
      // righe orizzontali (y flette vicino al fronte)
      for (let j = 0; j <= ROWS; j++) {
        const y0 = j * rowH
        let seg = `M0,${y0.toFixed(1)} `
        for (let x = 0; x <= W; x += 26) {
          const g = disp(x)
          const y = y0 + Math.cos((x - waveX) * 0.02) * AY * g
          seg += `L${x.toFixed(1)},${y.toFixed(1)} `
        }
        d += seg
      }
      path!.setAttribute('d', d)
    }

    function loop(now: number) {
      if (!running) return
      if (!start) start = now
      build((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    function resize() {
      const r = wrap!.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      wrap!.querySelector('svg')?.setAttribute('viewBox', `0 0 ${W} ${H}`)
      if (reduce) build(7.5) // frame statico rigoroso
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !reduce && !running) {
          running = true
          start = 0
          raf = requestAnimationFrame(loop)
        } else if (!e[0].isIntersecting) {
          running = false
          if (raf) cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)
    if (!reduce) {
      running = true
      raf = requestAnimationFrame(loop)
    }
    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className}`.trim()} aria-hidden="true">
      <svg className={styles.svg} preserveAspectRatio="none">
        <path ref={pathRef} className={styles.path} d="" />
      </svg>
    </div>
  )
}
