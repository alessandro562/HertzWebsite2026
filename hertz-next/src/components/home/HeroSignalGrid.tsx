'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroSignalGrid.module.css'

/**
 * Hero · SIGNAL GRID DEFORMATION (produzione).
 * La griglia editoriale (linee sottili, rigorosa) è lo scheletro della
 * composizione: una frequenza la attraversa comprimendo/espandendo le colonne
 * e flettendo le righe, poi torna ORDER. Non è un equalizzatore: è la struttura
 * che si deforma. Espone il campo di spostamento via `onWave` così che titolo,
 * foto e metadata possano "cavalcare" la loro colonna e tornare allineati.
 * Tech: SVG (un path ricomposto per frame) + rAF. Reduced-motion = statico.
 */
export default function HeroSignalGrid({
  onWave,
  className = '',
}: {
  onWave?: (dispAt: (x01: number) => number) => void
  className?: string
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const onWaveRef = useRef(onWave)
  onWaveRef.current = onWave

  useEffect(() => {
    const path = pathRef.current
    const wrap = wrapRef.current
    if (!path || !wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    const COLS = 12
    const ROWS = 7
    let raf = 0
    let running = false
    let start = 0

    function build(t: number) {
      const cycle = 9 // s
      const phase = (t % cycle) / cycle
      const sweep = phase < 0.66 ? phase / 0.66 : 1 // 0→1 durante lo sweep, poi ORDER
      const active = phase < 0.66 ? Math.sin((phase / 0.66) * Math.PI) : 0
      const waveX = W * (1.15 - sweep * 1.3)
      const sigma = W * 0.14
      const disp = (x: number) => {
        const d = x - waveX
        return Math.exp(-(d * d) / (2 * sigma * sigma)) * active
      }
      const AX = W * 0.05
      const AY = H * 0.09
      const colW = W / COLS
      const rowH = H / ROWS
      let d = ''
      for (let i = 0; i <= COLS; i++) {
        const x0 = i * colW
        const x = x0 + Math.sin((x0 - waveX) * 0.02) * AX * disp(x0)
        d += `M${x.toFixed(1)},0 L${x.toFixed(1)},${H} `
      }
      for (let j = 0; j <= ROWS; j++) {
        const y0 = j * rowH
        let seg = `M0,${y0.toFixed(1)} `
        for (let x = 0; x <= W; x += 26) {
          const y = y0 + Math.cos((x - waveX) * 0.02) * AY * disp(x)
          seg += `L${x.toFixed(1)},${y.toFixed(1)} `
        }
        d += seg
      }
      path!.setAttribute('d', d)

      // campo di spostamento normalizzato (~ -1..1) per il contenuto:
      // stessa matematica delle colonne → il titolo/foto cavalca la sua colonna
      onWaveRef.current?.((x01: number) => {
        const x = x01 * W
        const g = disp(x)
        return Math.sin((x - waveX) * 0.02) * g
      })
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
      if (reduce) build(7.5) // frame statico rigoroso (fase ORDER)
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
