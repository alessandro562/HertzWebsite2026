import { upcoming, eventSlug, dowDate } from '@/content/events'
import type { NextEvent } from '@/components/home/HomeHero'

/**
 * Prossimo evento REALE (events.ts) nella forma attesa da HeroProto.
 * Condiviso dalle tre route Gate 1B: stessa composizione, stesso contenuto.
 */
export function labNext(): NextEvent | undefined {
  const e = upcoming()[0]
  if (!e) return undefined
  return {
    n: e.n,
    title: e.title,
    venue: e.venue,
    city: e.city,
    date: dowDate(e),
    slug: eventSlug(e),
    onSale: e.onSale,
    comingSoon: e.comingSoon,
  }
}
