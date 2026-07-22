'use client'

import { useEffect, useState } from 'react'
import styles from './TicketStickyBar.module.css'

/**
 * Barra Tickets sticky — SOLO mobile (nascosta su desktop via CSS), appare
 * unicamente dopo che il CTA inline è scorso fuori dalla vista (mai prima:
 * niente doppio CTA visibile in cima), e solo quando l'utente ha scrollato
 * OLTRE (non quando il CTA deve ancora arrivare). Non copre mai i contenuti
 * a riposo (translateY fuori schermo), nessun blocco dello scroll.
 */
export default function TicketStickyBar({
  targetId,
  href,
  label,
}: {
  targetId: string
  href: string
  label: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [targetId])

  return (
    <div className={styles.bar} data-show={show}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.btn}
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
      >
        {label} ↗
      </a>
    </div>
  )
}
