'use client'

import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { buildHertzLogoGeometry } from './hertzLogoGeometry'

/**
 * Logo 3D ufficiale Hertz in R3F.
 *
 * - GEOMETRIA: fedele al brand asset (vedi hertzLogoGeometry.ts).
 * - MATERIALE: `meshStandardMaterial` sobrio, colore SOLO da token brand
 *   (White base + rim Cold dalle luci di scena). Nessun GLSL custom, nessun
 *   colore hardcoded → impossibile che resti cyan/#144889/giallo del legacy.
 * - MOTION: NO spin 360° (rompeva la leggibilità). Tilt LIMITATO da cursore +
 *   scroll (±~13°) + micro-respiro → il wordmark resta sempre leggibile.
 */

// token brand (Pure White) — coerente col master logo bianco su Ink
const INK_WHITE = '#FFFFFF'

type Props = {
  src?: string
  scrollRef?: RefObject<number>
}

export default function HertzLogo3D({
  src = '/assets/hertz-logo-official.png',
  scrollRef,
}: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Caricamento immagine client-side (getImageData richiede il browser)
  useEffect(() => {
    let alive = true
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { if (alive) setImage(img) }
    img.onerror = () => console.warn('[HertzLogo3D] logo image not found:', src)
    img.src = src
    return () => { alive = false }
  }, [src])

  // Vettorizzazione una tantum → geometria estrusa
  const geometry = useMemo(
    () => (image ? buildHertzLogoGeometry(image) : null),
    [image],
  )
  useEffect(() => () => geometry?.dispose(), [geometry])

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return
    const t = state.clock.elapsedTime
    const px = state.pointer.x // -1..1
    const py = state.pointer.y // -1..1
    const scroll = scrollRef?.current ?? 0 // 0..1

    // Tilt LIMITATO — mai di taglio: il wordmark resta leggibile a riposo/near-rest.
    const targetRotY = px * 0.23 + Math.sin(t * 0.25) * 0.03 + scroll * 0.10
    const targetRotX = -py * 0.10 + Math.sin(t * 0.30) * 0.025
    const k = Math.min(1, delta * 4) // easing lerp frame-rate independent
    g.rotation.y += (targetRotY - g.rotation.y) * k
    g.rotation.x += (targetRotX - g.rotation.x) * k
    g.position.y = Math.sin(t * 0.4) * 0.03 - scroll * 0.25
  })

  if (!geometry) return null

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={INK_WHITE}
          roughness={0.62}
          metalness={0.15}
        />
      </mesh>
    </group>
  )
}
