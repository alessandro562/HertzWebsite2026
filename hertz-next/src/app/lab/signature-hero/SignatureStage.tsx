'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'
import styles from './signature-hero.module.css'

function subscribe() {
  return () => {}
}
function getUse3DSnapshot() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarseOrSmall =
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  return !reduce && !coarseOrSmall
}
function getUse3DServerSnapshot() {
  return false
}

/**
 * Decide COSA montare nello slot del logo:
 *  - desktop + motion consentito → Canvas R3F (dynamic, ssr:false, dopo il poster)
 *  - mobile OPPURE prefers-reduced-motion → PNG statico del logo ufficiale, niente R3F
 *
 * SSR iniziale = 'static' → il poster (PNG) è già presente prima dell'idratazione,
 * il Canvas subentra solo dopo (nessun WebGL nel critical path / LCP).
 */

const SignatureCanvas = dynamic(() => import('@/scenes/SignatureCanvas'), {
  ssr: false,
})

export default function SignatureStage() {
  const use3D = useSyncExternalStore(subscribe, getUse3DSnapshot, getUse3DServerSnapshot)

  return (
    <div className={styles.stage} aria-hidden="true">
      {use3D ? (
        <SignatureCanvas />
      ) : (
        <div className={styles.staticLogo} role="img" aria-label="Logo Hertz" />
      )}
    </div>
  )
}
