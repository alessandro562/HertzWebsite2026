import type { Metadata } from 'next'
import HeroProto from '@/components/lab/HeroProto'
import TypeFrequencyField from '@/components/lab/TypeFrequencyField'
import { labNext } from '@/components/lab/nextEvent'

/**
 * GATE 1B · Direzione B — TYPOGRAPHIC FREQUENCY FIELD.
 * Il titolo della hero è la "materia": una frequenza lo attraversa e la foto
 * reale del floor scorre dentro le lettere, con contorno sempre leggibile.
 * Il resto della composizione (kicker/foto/next-event/CTA) resta stabile.
 * Isolato in /lab, fuori dagli indici.
 */
export const metadata: Metadata = {
  title: 'Gate 1B · B — Typographic Frequency Field · lab',
  robots: { index: false, follow: false },
}

export default function HeroSignalBLab() {
  return (
    <main>
      <HeroProto next={labNext()} label="B · Typographic frequency field" title={<TypeFrequencyField />} noPhoto />
    </main>
  )
}
