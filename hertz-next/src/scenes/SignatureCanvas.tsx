'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import HertzLogo3D from './HertzLogo3D'

/**
 * Canvas R3F del momento firma. Caricato SOLO via next/dynamic ssr:false
 * (vedi SignatureStage), montato dopo il poster statico.
 *
 * Luci: key bianca + rim Cold `#50778A` (token) → dà l'accento "segnale"
 * freddo sul bordo del logo senza alcun colore vietato.
 */

const COLD = '#50778A' // --raw-cold token (accento digitale, non neon)

export default function SignatureCanvas() {
  // scroll normalizzato 0..1 sull'altezza viewport, passato al logo via ref
  const scrollRef = useRef(0)

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight || 1
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / vh))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <Canvas
      camera={{ fov: 44, position: [0, 0, 7], near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-4, -1, -3]} intensity={0.9} color={COLD} />
      <group scale={0.6}>
        <HertzLogo3D scrollRef={scrollRef} />
      </group>
    </Canvas>
  )
}
