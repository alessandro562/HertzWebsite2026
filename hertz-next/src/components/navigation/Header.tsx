'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from './nav-items'
import { SITE } from '@/lib/site'
import Arrow from '@/components/ui/Arrow'
import HertzLogo from '@/components/ui/HertzLogo'
import styles from './Header.module.css'

/**
 * Header sticky con CONTRASTO ADATTIVO: adotta il `data-surface` della sezione
 * sotto la barra → testo sempre leggibile su ogni superficie, con un backdrop
 * leggero (surface-matched, no glassmorphism) solo dopo lo scroll.
 * Include MobileMenu full-screen (target ≥44px).
 */
export default function Header() {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const [surface, setSurface] = useState('signal')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  /* stato "scrollato": controllo a buon mercato, coalescato in rAF */
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Superficie sotto la barra via IntersectionObserver.
     Prima girava a ogni frame di scroll (con Lenis: di continuo, coda di
     decelerazione inclusa) e faceva una querySelectorAll + un
     getBoundingClientRect per sezione, cioè 9 letture di layout sincrone a
     60fps sulla home. Ora il browser ci avvisa solo quando una sezione
     attraversa la fascia di 1px subito sotto l'header. */
  useEffect(() => {
    const header = ref.current
    if (!header || typeof IntersectionObserver === 'undefined') return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [data-surface]'))
    if (sections.length === 0) return

    const h = header.getBoundingClientRect().height || 64
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSurface(e.target.getAttribute('data-surface') || 'signal')
          }
        }
      },
      { rootMargin: `-${Math.round(h)}px 0px -${Math.max(0, window.innerHeight - h - 1)}px 0px` },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  /* Menu mobile: scroll-lock + ESC + gestione del focus (entra nel menu
     all'apertura, ciclo Tab confinato, ritorno al burger alla chiusura). */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null)

    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      // il burger/Close resta raggiungibile: fa parte del ciclo
      const items = [...focusables(), burgerRef.current].filter(Boolean) as HTMLElement[]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (active && !items.includes(active)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      burgerRef.current?.focus()
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
        <Link href="/" className={styles.logo} aria-label="HERTZ, home">
          <HertzLogo size={40} title="Hertz, home" />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((i) => (
            <Link key={i.href} href={i.href} className={styles.link}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/bookings" className={styles.tickets}>
            <span className={styles.ticketsWave} aria-hidden="true" />
            Bookings
          </Link>
          <button
            ref={burgerRef}
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
        ref={menuRef}
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
              <span className={styles.menuLabel}>{i.label}</span>
            </Link>
          ))}
          <Link
            href="/bookings"
            className={styles.menuTickets}
            onClick={() => setOpen(false)}
          >
            <span className={styles.menuLabel}>Bookings</span>
            <Arrow />
          </Link>
        </nav>
        <div className={styles.menuConnect}>
          <a href={`mailto:${SITE.email}`} className={styles.menuConnectLink}>
            {SITE.email}
          </a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className={styles.menuConnectLink}>
            Instagram <Arrow />
          </a>
          <a href={SITE.soundcloud} target="_blank" rel="noreferrer" className={styles.menuConnectLink}>
            SoundCloud <Arrow />
          </a>
        </div>
      </div>
    </header>
  )
}
