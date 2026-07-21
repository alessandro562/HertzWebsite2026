'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Provider di smooth-scroll (Lenis) montato sul root della pagina.
 * Rispetta `prefers-reduced-motion`: se l'utente lo richiede, lo scroll
 * torna nativo (nessuna interpolazione) — regola permanente del brand.
 *
 * Scaffold Fase 2: qui non ci sono ancora animazioni collegate allo scroll,
 * solo lo scroll liscio di base. Le animazioni scroll-linked arriveranno
 * nelle fasi successive usando `useLenis`.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (reducedMotion) return <>{children}</>

  return <ReactLenis root>{children}</ReactLenis>
}
