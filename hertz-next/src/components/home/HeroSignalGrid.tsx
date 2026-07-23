'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroSignalGrid.module.css'

/**
 * Hero · SIGNAL GRID (produzione, sobria).
 * La griglia editoriale è lo scheletro rigoroso della composizione: A RIPOSO
 * resta dritta e leggibile. Non deforma permanentemente tutta la superficie —
 * risponde dove serve: un respiro sottile localizzato nella banda della waveform,
 * un avvallamento sotto il puntatore, un'onda transitoria durante lo scroll.
 * Espone il campo di spostamento via `onWave` (piccolo a riposo → contenuto
 * fermo/leggibile). Tech: SVG (un path ricomposto per frame) + rAF.
 * Reduced-motion = griglia perfettamente statica.
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

  useEffect(() => {
    onWaveRef.current = onWave
  })

  useEffect(() => {
    if (!pathRef.current || !wrapRef.current) return
    const path = pathRef.current
    const wrap = wrapRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    let raf = 0
    let running = false
    let start = 0
    let last = 0

    // stato interattivo (tutto → 0 a riposo)
    let px = -1 // pointer x nel wrap (px), -1 = assente
    let py = -1
    let pAmp = 0 // ampiezza attuale bump puntatore
    let pTarget = 0 // target (1 mentre il puntatore si muove, poi decade)
    let sAmp = 0 // ampiezza da scroll (decade)
    let lastScrollY = window.scrollY

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

    // campo di spostamento normalizzato (~ -1..1)
    function disp(x: number, y: number, t: number): number {
      // 1) banda waveform: respiro lento e sottile, localizzato in basso
      const bandCenter = H * 0.82
      const bandSig = H * 0.16
      const bandFall = Math.exp(-((y - bandCenter) ** 2) / (2 * bandSig * bandSig))
      const band = Math.sin(x * 0.012 - t * 1.1) * bandFall * 0.4
      // 2) bump puntatore: avvallamento gaussiano attorno al cursore
      let ptr = 0
      if (px >= 0 && pAmp > 0.001) {
        const sig = W * 0.13
        const gx = Math.exp(-((x - px) ** 2) / (2 * sig * sig))
        const gy = Math.exp(-((y - py) ** 2) / (2 * (sig * 0.9) ** 2))
        ptr = Math.sin((x - px) * 0.02) * gx * gy * pAmp
      }
      // 3) scroll: onda orizzontale transitoria (decade subito)
      const scr = sAmp > 0.001 ? Math.sin(x * 0.016 + t * 2) * sAmp * 0.5 : 0
      return band + ptr + scr
    }

    // spaziatura del campo di punti (non una "rete": punti sparsi che ondeggiano)
    const stepX = () => Math.max(38, W / 34)
    const stepY = () => Math.max(38, H / 15)

    function build(t: number) {
      const AX = W * 0.05 // ampiezza spostamento X del punto
      const AY = H * 0.055 // ampiezza spostamento Y
      const sx = stepX()
      const sy = stepY()
      let d = ''
      // matrice di punti: ogni punto scivola secondo il campo (bump attorno al cursore)
      for (let x = sx / 2; x <= W; x += sx) {
        for (let y = sy / 2; y <= H; y += sy) {
          const f = disp(x, y, t)
          const dx = x + f * AX
          const dy = y + f * AY
          // "l.1 0" = segmento nullo → con linecap round è un punto pieno
          d += `M${dx.toFixed(1)},${dy.toFixed(1)}l.1 0`
        }
      }
      path.setAttribute('d', d)

      // coupling contenuto: campionato a metà altezza → a riposo ≈ 0 (leggibile)
      onWaveRef.current?.((x01: number) => disp(x01 * W, H * 0.5, t))
    }

    function buildStatic() {
      // campo di punti perfettamente regolare (nessuna deformazione)
      const sx = stepX()
      const sy = stepY()
      let d = ''
      for (let x = sx / 2; x <= W; x += sx) {
        for (let y = sy / 2; y <= H; y += sy) {
          d += `M${x.toFixed(1)},${y.toFixed(1)}l.1 0`
        }
      }
      path.setAttribute('d', d)
    }

    function loop(now: number) {
      if (!running) return
      if (!start) {
        start = now
        last = now
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = (now - start) / 1000
      // dinamica: pAmp insegue pTarget; entrambi decadono verso 0 a riposo
      pAmp += (pTarget - pAmp) * Math.min(1, dt * 8)
      pTarget *= Math.pow(0.0015, dt) // idle → il puntatore smette di eccitare
      sAmp *= Math.pow(0.03, dt) // scroll decade rapidamente
      build(t)
      raf = requestAnimationFrame(loop)
    }

    function onPointer(e: PointerEvent) {
      const r = wrap.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < -40 || y < -40 || x > r.width + 40 || y > r.height + 40) {
        px = -1
        return
      }
      px = x
      py = y
      pTarget = 1
    }
    function onScroll() {
      const y = window.scrollY
      sAmp = clamp(sAmp + Math.abs(y - lastScrollY) * 0.012, 0, 1.1)
      lastScrollY = y
    }
    function resize() {
      const r = wrap.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      wrap.querySelector('svg')?.setAttribute('viewBox', `0 0 ${W} ${H}`)
      if (reduce) buildStatic()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    if (reduce) {
      buildStatic()
      return () => ro.disconnect()
    }

    build(0) // primo frame immediato (evita 1 frame vuoto se monta a Hero già assestata)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !running) {
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
    running = true
    raf = requestAnimationFrame(loop)
    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
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
