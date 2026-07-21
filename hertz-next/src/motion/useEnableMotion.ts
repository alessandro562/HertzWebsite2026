'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * True SOLO dopo il mount e se l'utente non ha prefers-reduced-motion.
 * Serve a gating gli effetti scroll-linked (parallax) senza causare mismatch
 * di idratazione: server e primo render client valgono entrambi `false`
 * (struttura identica), poi il parallax si attiva dopo il mount.
 *
 * Le animazioni "normali" (reveal/entrata) NON usano questo: restano sempre
 * montate come componenti Motion e sono gestite da MotionConfig
 * (reducedMotion="user") a livello globale, così la struttura DOM è stabile.
 */
export function useEnableMotion(): boolean {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !reduce
}
