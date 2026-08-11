import type { Metadata } from 'next'
import HeroProto from '@/components/lab/HeroProto'
import HalftoneSignal from '@/components/lab/HalftoneSignal'
import { labNext } from '@/components/lab/nextEvent'
import hero from '@/components/home/HomeHero.module.css'

/**
 * GATE 1B · Direzione C — PRINT / HALFTONE SIGNAL.
 * La foto reale del floor diventa la superficie: stampata a retino (halftone)
 * su carta Signal, in due separazioni Ink + Cold-Blue. Una frequenza la
 * attraversa (fuori registro → ritorno a registro). Poster vivente.
 * Titolo pieno (niente outline) per restare leggibile sul campo stampato.
 * Isolato in /lab, fuori dagli indici.
 */
export const metadata: Metadata = {
  title: 'Gate 1B · C — Print / Halftone Signal · lab',
  robots: { index: false, follow: false },
}

export default function HeroSignalCLab() {
  return (
    <main>
      <HeroProto
        next={labNext()}
        label="C · Print / halftone signal"
        grid={<HalftoneSignal />}
        noPhoto
        title={
          <h1 className={hero.title}>
            <span className={hero.l1}>From clubbers,</span>
            <span className={hero.l1}>for clubbers.</span>
          </h1>
        }
      />
    </main>
  )
}
