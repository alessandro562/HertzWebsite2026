import type { Metadata } from 'next'
import HeroIntroSequence from '@/components/home/hero-intro/HeroIntroSequence'
import { labNext } from '@/components/lab/nextEvent'

/**
 * Harness di validazione (desktop-first) del componente live che diventerà il
 * primo stato della hero: B2 Print Interruption → hero runtime, continuo.
 * Isolato in /lab, noindex. Contenuto reale (prossimo evento).
 */
export const metadata: Metadata = {
  title: 'Hero Intro Sequence · lab',
  robots: { index: false, follow: false },
}

export default async function HeroIntroLab({ searchParams }: { searchParams: Promise<{ static?: string }> }) {
  const sp = await searchParams
  return (
    <main>
      <HeroIntroSequence next={labNext()} staticGrid={sp.static === '1'} />
      {/* spazio sotto: verifica che si possa scrollare subito (non bloccante) */}
      <section style={{ height: '60vh', display: 'grid', placeItems: 'center' }} data-surface="white">
        <p className="hz-mono" style={{ opacity: 0.6 }}>— scroll test · contenuto sotto la hero —</p>
      </section>
    </main>
  )
}
