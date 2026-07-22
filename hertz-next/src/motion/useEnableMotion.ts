'use client'

import { useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

/** nessun evento da sottoscrivere: il valore passa da false (server/primo
 * render client) a true una volta sola, subito dopo il mount. */
function subscribe() {
  return () => {}
}
function getSnapshot() {
  return true
}
function getServerSnapshot() {
  return false
}

/**
 * True SOLO dopo il mount e se l'utente non ha prefers-reduced-motion.
 * Serve a gating gli effetti scroll-linked (parallax) senza causare mismatch
 * di idratazione: server e primo render client valgono entrambi `false`
 * (struttura identica), poi il parallax si attiva dopo il mount.
 * useSyncExternalStore (non useState+useEffect) evita il set-state-in-effect.
 *
 * Le animazioni "normali" (reveal/entrata) NON usano questo: restano sempre
 * montate come componenti Motion e sono gestite da MotionConfig
 * (reducedMotion="user") a livello globale, così la struttura DOM è stabile.
 */
export function useEnableMotion(): boolean {
  const reduce = useReducedMotion()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return mounted && !reduce
}
