import type { Metadata } from 'next'
import HeroProto from '@/components/lab/HeroProto'
import SignalGridA from '@/components/lab/SignalGridA'
import { labNext } from '@/components/lab/nextEvent'

/**
 * GATE 1B · Direzione A — SIGNAL GRID DEFORMATION.
 * La griglia editoriale della hero (linee sottili, rigorosa) è la "materia":
 * una frequenza la attraversa comprimendo/espandendo le colonne e flettendo
 * le righe, poi torna ordinata. La composizione (titolo/foto/next-event/CTA)
 * resta stabile e leggibile. Isolato in /lab, fuori dagli indici.
 */
export const metadata: Metadata = {
  title: 'Gate 1B · A — Signal Grid Deformation · lab',
  robots: { index: false, follow: false },
}

export default function HeroSignalALab() {
  return (
    <main>
      <HeroProto next={labNext()} label="A · Signal grid deformation" grid={<SignalGridA />} />
    </main>
  )
}
