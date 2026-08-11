'use client'

import { useEffect, useRef } from 'react'
import styles from './WaveformPulse.module.css'

/**
 * WaveformPulse — primitive SVG leggera con la geometria Hertz (linea + un
 * singolo impulso), NON un equalizzatore audio generico. Sottile a riposo.
 *
 * Stati: idle · hover · active · playing · loading · disabled.
 * Le animazioni continue (playing/loading) sono CSS (compositing-friendly) e
 * vengono messe in pausa fuori viewport via IntersectionObserver (nessun costo
 * infinito quando non è visibile). Reduced-motion → tutto statico.
 */
type State = 'idle' | 'hover' | 'active' | 'playing' | 'loading' | 'disabled'

export default function WaveformPulse({
  state = 'idle',
  className = '',
  label,
}: {
  state?: State
  className?: string
  label?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((e) => {
      el.dataset.visible = e[0].isIntersecting ? 'true' : 'false'
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      className={`${styles.wrap} ${className}`.trim()}
      data-state={state}
      data-visible="true"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg className={styles.svg} viewBox="0 0 120 24" preserveAspectRatio="none" fill="none">
        <g className={styles.travel}>
          <path
            className={styles.path}
            d="M0,12 H44 C50,12 52,4 58,4 C64,4 66,12 72,12 H120"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
  )
}
