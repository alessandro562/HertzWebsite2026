/* ────────────────────────────────────────────────────────────
   HERTZ · CONTENT LAYER · MEDIA (editorial)
   Migrato da api/articles.js (bodies reali). 4 articoli reali,
   autore "Hertz Redazione". Rubriche: SIGNAL / DISPATCH / RESIDENT / RADAR.
   ──────────────────────────────────────────────────────────── */

export type Rubric = 'SIGNAL' | 'DISPATCH' | 'RESIDENT' | 'RADAR'

export interface Article {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  rubric: Rubric
  heroImage: string
  heroImageAlt: string
  author: string
  date: string // ISO
  readingTimeMinutes: number
  featured?: boolean
}

export const ARTICLES: Article[] = [
  {
    slug: 'two-speed-island-ibiza-2026',
    title: 'The Two-Speed Island: What Ibiza 2026 Is Actually Telling Us',
    subtitle:
      'A €70 million hyperclub topped the world poll in year one. Read the rest of the calendar and the split becomes impossible to miss.',
    excerpt:
      "UNVRS didn't just open big — it rewrote the rules in a single season. We read the 2026 Ibiza calendar as two scenes running on the same island at different speeds.",
    rubric: 'SIGNAL',
    heroImage: '/assets/media-unvrs.png',
    heroImageAlt: 'A hyperclub crowd under stage lights',
    author: 'Hertz Redazione',
    date: '2026-06-26',
    readingTimeMinutes: 6,
    featured: true,
  },
  {
    slug: 'sunwaves-left-home-rominimal',
    title: 'Sunwaves Left Home: The Format That Refuses to Scale',
    subtitle:
      'After 18 years on the Black Sea, the cathedral of the marathon set was pushed out of Romania.',
    excerpt:
      'Sunwaves — no VIP, booth close, six-hour sets — just lost its home to permits and pressure and decamped to Spain. Why the most music-first format in our world is also the most fragile.',
    rubric: 'DISPATCH',
    heroImage: '/assets/media-sunwaves.png',
    heroImageAlt: 'A low-lit marathon floor',
    author: 'Hertz Redazione',
    date: '2026-06-21',
    readingTimeMinutes: 6,
  },
  {
    slug: 'music-on-pacha-long-residency',
    title: 'Music On at Pacha: The Case for the Long Residency',
    subtitle:
      "Eight years on the same Friday, despite every rumour of a move. That's not nostalgia — it's a different technology.",
    excerpt:
      'Music On stayed at Pacha for 2026. The long residency builds something a festival headline slot never can — a crowd, a sound, a room.',
    rubric: 'RESIDENT',
    heroImage: '/assets/media-music-on-pacha.png',
    heroImageAlt: 'A packed floor deep into a residency night',
    author: 'Hertz Redazione',
    date: '2026-06-16',
    readingTimeMinutes: 6,
  },
  {
    slug: 'radar-vol-1-eight-names',
    title: 'Radar Vol. 1: Eight Names Moving the Groove Right Now',
    subtitle:
      'Not the most-streamed. The ones whose records keep ending up in our sets.',
    excerpt:
      "Our first artist column. Eight producers we're actually playing, from UK deep-tech and the Italian groove to Peru and the festival crossover.",
    rubric: 'RADAR',
    heroImage: '/assets/media-radar-vol-1.png',
    heroImageAlt: 'A DJ at the booth, close-up',
    author: 'Hertz Redazione',
    date: '2026-06-11',
    readingTimeMinutes: 7,
  },
]

import { ARTICLE_BODIES } from './article-bodies'

/** dd.mm.yy da ISO */
export function articleDate(a: Article): string {
  const p = a.date.split('-')
  return `${p[2]}.${p[1]}.${p[0].slice(2)}`
}

export function featuredArticle(): Article {
  return ARTICLES.find((a) => a.featured) ?? ARTICLES[0]
}

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

/** corpo HTML reale dell'articolo (da article-bodies.ts) */
export function articleBody(slug: string): string {
  return ARTICLE_BODIES[slug]?.body ?? ''
}

/** articoli correlati (oggetti Article), dai slug in article-bodies.ts */
export function relatedArticles(slug: string): Article[] {
  return (ARTICLE_BODIES[slug]?.related ?? [])
    .map(articleBySlug)
    .filter((a): a is Article => Boolean(a))
}

/** rubrica → superficie canonica (per accenti editoriali) */
export function rubricSurface(r: Rubric): 'signal' | 'paper' | 'cold-blue' | 'white' {
  switch (r) {
    case 'SIGNAL':
      return 'signal'
    case 'RESIDENT':
      return 'cold-blue'
    case 'RADAR':
      return 'paper'
    default:
      return 'white'
  }
}
