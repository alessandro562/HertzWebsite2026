'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from './nav-items'
import styles from './Header.module.css'

/**
 * Header sticky con CONTRASTO ADATTIVO: adotta il `data-surface` della sezione
 * sotto la barra → testo sempre leggibile su ogni superficie, con un backdrop
 * leggero (surface-matched, no glassmorphism) solo dopo lo scroll.
 * Include MobileMenu full-screen (target ≥44px).
 */
export default function Header() {
  const ref = useRef<HTMLElement>(null)
  const [surface, setSurface] = useState('signal')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const header = ref.current
    if (!header) return
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 8)
      const y = header.getBoundingClientRect().bottom - 1
      const sections = Array.from(document.querySelectorAll('main [data-surface]'))
      let surf = 'signal'
      for (const s of sections) {
        const r = s.getBoundingClientRect()
        if (r.top <= y && r.bottom > y) {
          surf = s.getAttribute('data-surface') || 'signal'
          break
        }
      }
      setSurface(surf)
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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      ref={ref}
      className={styles.header}
      data-surface={surface}
      data-scrolled={scrolled}
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="HERTZ — home">
          hertz
        </Link>

        <nav className={styles.nav} aria-label="Navigazione primaria">
          {NAV_ITEMS.map((i) => (
            <Link key={i.href} href={i.href} className={styles.link}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/events" className={styles.tickets}>
            Tickets
          </Link>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={styles.menu}
        data-surface="paper"
        data-open={open}
        hidden={!open}
      >
        <nav className={styles.menuNav} aria-label="Menu">
          {NAV_ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={styles.menuLink}
              onClick={() => setOpen(false)}
            >
              {i.label}
            </Link>
          ))}
          <Link
            href="/events"
            className={styles.menuTickets}
            onClick={() => setOpen(false)}
          >
            Tickets ↗
          </Link>
        </nav>
      </div>
    </header>
  )
}
