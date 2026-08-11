'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TypeFrequencyField.module.css'

/**
 * Proto B — TYPOGRAPHIC FREQUENCY FIELD.
 * Il titolo È la superficie del segnale. Una banda morbida (fronte d'onda)
 * attraversa il tipo e la FOTO reale del floor scorre DENTRO le lettere
 * (immagine mascherata dai glifi). Un contorno hairline resta sempre acceso →
 * il tipo non è mai illeggibile. Le due righe hanno fase sfalsata (fronte
 * diagonale) + un micro-pulse di tracking al passaggio. Il font non è
 * deformato (niente textLength): resta Helvetica Neue reale.
 * Tech: SVG <text> + <mask> + <use> (una sola geometria glifi) + rAF.
 * Reduced-motion = frame statico con la foto già versata a sinistra.
 */
const L1 = 'From clubbers,'
const L2 = 'for clubbers.'
const PHOTO = '/assets/hero-booth.jpg'

export default function TypeFrequencyField() {
  const wrapRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const line1Ref = useRef<SVGTextElement>(null)
  const line2Ref = useRef<SVGTextElement>(null)
  const gradARef = useRef<SVGLinearGradientElement>(null)
  const gradBRef = useRef<SVGLinearGradientElement>(null)
  const [vb, setVb] = useState({ x: -20, y: 0, w: 780, h: 230 })

  // 1) misura il bbox reale del tipo (a font caricato) → viewBox corretto
  useEffect(() => {
    let done = false
    const measure = () => {
      if (done || !groupRef.current) return
      const b = groupRef.current.getBBox()
      if (b.width < 2) return
      done = true
      const padX = b.height * 0.14
      const padY = b.height * 0.16
      setVb({ x: b.x - padX, y: b.y - padY, w: b.width + padX * 2, h: b.height + padY * 2 })
    }
    // il font self-hosted potrebbe non essere ancora pronto al primo paint
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure)
    }
    measure()
    return () => {
      done = true
    }
  }, [])

  // 2) animazione: banda che scorre (per riga, sfalsata) + pulse di tracking
  useEffect(() => {
    const gA = gradARef.current
    const gB = gradBRef.current
    const t1 = line1Ref.current
    const t2 = line2Ref.current
    const wrap = wrapRef.current
    if (!gA || !gB || !t1 || !t2 || !wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const W = vb.w
    const half = W * 0.3

    const apply = (xcA: number, xcB: number, pulseA: number, pulseB: number) => {
      gA.setAttribute('x1', (vb.x + xcA - half).toFixed(1))
      gA.setAttribute('x2', (vb.x + xcA + half).toFixed(1))
      gB.setAttribute('x1', (vb.x + xcB - half).toFixed(1))
      gB.setAttribute('x2', (vb.x + xcB + half).toFixed(1))
      // micro-variazione di tracking (em → unità viewBox: 1em ≈ font-size 100)
      t1.setAttribute('letter-spacing', (-3.5 + pulseA * 5).toFixed(2))
      t2.setAttribute('letter-spacing', (-3.5 + pulseB * 5).toFixed(2))
    }

    if (reduce) {
      // frame statico: banda ferma a sinistra, foto già versata nel tipo
      apply(W * 0.4, W * 0.28, 0.15, 0.05)
      return
    }

    let raf = 0
    let running = false
    let start = 0
    const cycle = 7.5 // s
    const gauss = (d: number) => Math.exp(-(d * d) / (2 * (W * 0.18) * (W * 0.18)))

    const frame = (now: number) => {
      if (!running) return
      if (!start) start = now
      const t = ((now - start) / 1000) % cycle
      const p = t / cycle // 0..1
      // fronte: entra da sinistra, esce a destra, poi breve pausa d'ordine
      const sweep = p < 0.8 ? p / 0.8 : 1
      const xcA = -0.25 * W + sweep * 1.5 * W
      const xcB = xcA - 0.14 * W // riga 2 in ritardo → fronte diagonale
      apply(xcA, xcB, gauss(xcA - W * 0.5), gauss(xcB - W * 0.5))
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !running) {
          running = true
          start = 0
          raf = requestAnimationFrame(frame)
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
    raf = requestAnimationFrame(frame)
    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [vb])

  const viewBox = `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`
  const textProps = {
    x: 0,
    fontFamily: 'var(--hz-font-display), "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    fontSize: 100,
    letterSpacing: -3.5,
  }

  return (
    <>
      <h1 className={styles.srOnly}>
        {L1} {L2}
      </h1>
      <svg
        ref={wrapRef}
        className={styles.svg}
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-hidden="true"
      >
        <defs>
          {/* geometria glifi — sorgente unica riusata da base/foto/outline */}
          <g ref={groupRef}>
            <text ref={line1Ref} y={100} {...textProps} id="tff-l1">
              {L1}
            </text>
            <text ref={line2Ref} y={190} {...textProps} id="tff-l2">
              {L2}
            </text>
          </g>
          {/* maschere glifi (bianco = visibile) */}
          <mask id="tff-g1" maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
            <use href="#tff-l1" fill="#fff" />
          </mask>
          <mask id="tff-g2" maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
            <use href="#tff-l2" fill="#fff" />
          </mask>
          {/* bande morbide (una per riga, sfalsate) */}
          <linearGradient ref={gradARef} id="tff-bandA" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.5" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient ref={gradBRef} id="tff-bandB" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.5" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="tff-mA" maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
            <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="url(#tff-bandA)" />
          </mask>
          <mask id="tff-mB" maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
            <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="url(#tff-bandB)" />
          </mask>
        </defs>

        {/* base leggibile: tipo pieno Ink */}
        <use href="#tff-l1" fill="var(--hz-ink)" />
        <use href="#tff-l2" fill="var(--hz-ink)" />

        {/* foto reale versata nel tipo, dentro la banda (riga 1) */}
        <g mask="url(#tff-mA)">
          <g mask="url(#tff-g1)">
            <image
              href={PHOTO}
              x={vb.x}
              y={vb.y}
              width={vb.w}
              height={vb.h}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </g>
        {/* riga 2 (fase sfalsata) */}
        <g mask="url(#tff-mB)">
          <g mask="url(#tff-g2)">
            <image
              href={PHOTO}
              x={vb.x}
              y={vb.y}
              width={vb.w}
              height={vb.h}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </g>

        {/* contorno sempre acceso → leggibilità garantita in transizione */}
        <use href="#tff-l1" fill="none" stroke="var(--hz-ink)" strokeWidth="0.8" />
        <use href="#tff-l2" fill="none" stroke="var(--hz-ink)" strokeWidth="0.8" />
      </svg>
    </>
  )
}
