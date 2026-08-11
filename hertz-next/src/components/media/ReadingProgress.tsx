'use client'

import { useEffect, useRef } from 'react'

/**
 * Barra di avanzamento lettura, sottile, in cima all'articolo. Scala orizzontale
 * legata alla percentuale di scroll dell'<article>. requestAnimationFrame, nessun
 * layout thrash. Puramente indicativa: resta anche in reduced-motion (non è
 * un'animazione decorativa, è un indicatore di stato).
 */
export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const article = document.querySelector('article')
    if (!article) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
      const p = total > 0 ? scrolled / total : 0
      bar.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 101,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: 'var(--hz-accent)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />
    </div>
  )
}
