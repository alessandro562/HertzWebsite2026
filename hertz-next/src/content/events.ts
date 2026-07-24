/* ────────────────────────────────────────────────────────────
   HERTZ · CONTENT LAYER · EVENTS
   Single source of truth, migrata da events-data.js (JS legacy)
   a TypeScript tipizzato. Aggiungi una data qui UNA volta:
   si aggiorna la pagina Events e ogni pagina resident.

   I path poster puntano a /assets/... (public/assets nel nuovo
   progetto). '' = poster non ancora pronto → "coming soon".
   ──────────────────────────────────────────────────────────── */

export type ResidentSlug =
  | 'federico-apadula'
  | 'tommaso-manco'
  | 'alberto-b'
  | 'leonardo-giusti';

export const RESIDENTS: Record<ResidentSlug, string> = {
  'federico-apadula': 'Federico Apadula',
  'tommaso-manco': 'Tommaso Mancò',
  'alberto-b': 'Alberto B',
  'leonardo-giusti': 'Leonardo Giusti',
};

export interface HertzEvent {
  n: string;                 // numero di catalogo
  title: string;
  venue: string;
  city: string;
  iso: string;               // 'YYYY-MM-DD' — passato/futuro derivato da oggi
  time?: string;             // es. 'SUN · 17:00 → 00:00'
  badge?: string;            // etichetta poster
  poster: string;            // path immagine ('' se coming soon)
  bill?: string;             // line-up mostrata sulla card
  lineup: ResidentSlug[];    // slug resident → guida le pagine artista
  comingSoon?: boolean;      // data TBA
  onSale?: boolean;          // true → board mostra ON SALE
  regId?: string;
}

export const EVENTS: HertzEvent[] = [
  // ── upcoming ──
  { n: '026', title: 'Hertz at Atrium', venue: "Noah's Dream", city: 'Ortona', iso: '2026-06-28',
    time: 'SUN · H18 → LATE', badge: 'Guest', poster: '/assets/poster-v3-28giu-atrium.jpg',
    bill: "Danilo D'Arrezzo · Federico Apadula · Adime", lineup: ['federico-apadula'], onSale: true,
    regId: 'hertz-x-atrium-280626' },
  { n: '027', title: 'Hertz at Buongiorno Classic', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-06-28',
    time: 'SUN · 17:00 → 00:00', badge: 'Collaboration', poster: '/assets/poster-v3-28giu-buongiorno.jpg',
    bill: 'Tommaso Mancò · Alberto B', lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'], onSale: true,
    regId: 'hertz-x-buongiorno-classic-280626' },
  { n: '028', title: 'Hertz Downtown', venue: 'Il Pallone', city: 'Bologna', iso: '2026-07-04',
    time: 'SAT · 19:30 → 23:30', badge: 'Downtown Gig', poster: '/assets/poster-v3-04lug-pallone.jpg',
    bill: 'Federico Apadula · Leonardo Giusti · SeaRock', lineup: ['federico-apadula', 'leonardo-giusti'], onSale: true,
    regId: 'hertz-downtown-il-pallone-040726' },
  { n: '029', title: 'Hertz at Barracuda Club', venue: 'Barracuda', city: 'Ferrara', iso: '2026-07-25',
    badge: 'Collaboration', poster: '', lineup: [], comingSoon: true },
  { n: '030', title: 'Hertz at Buongiorno Classic', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-07-26',
    time: 'SUN · 05:00 → 00:00', badge: 'Collaboration', poster: '/assets/poster-v3-26lug-buongiorno.jpg',
    bill: 'Antonio Pica · Da Vid · Jay De Lys · Joey Daniel · Hertz',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'], onSale: true,
    regId: 'hertz-x-buongiorno-classic-260726' },
  { n: '031', title: 'Hertz at Buongiorno Classic', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-08-15',
    badge: 'Collaboration', poster: '', lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'], comingSoon: true },
  { n: '032', title: 'Hertz at Barracuda Club', venue: 'Barracuda', city: 'Ferrara', iso: '2026-08-14',
    badge: 'Collaboration', poster: '', lineup: [], comingSoon: true },

  // ── archive ──
  { n: '025', title: 'Take Notes × Buongiorno Classic', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-05-31',
    badge: 'Guest / Showcase', poster: '/assets/poster-v3-31mag-takenotes.jpg', lineup: [] },
  { n: '024', title: 'Hertz at Cassero', venue: 'Cassero', city: 'Bologna', iso: '2026-05-29',
    badge: 'Collab', poster: '/assets/poster-v3-29mag-cassero.jpg',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'] },
  { n: '023', title: 'Hertz at Kindergarten', venue: 'Kindergarten', city: 'Bologna', iso: '2026-04-24',
    badge: 'Hertz Event', poster: '/assets/poster-v3-24apr-kindergarten.jpg',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b', 'leonardo-giusti'] },
  { n: '022', title: 'Hertz at Kindergarten', venue: 'Kindergarten', city: 'Bologna', iso: '2026-02-27',
    badge: 'Hertz Event', poster: '/assets/poster-v3-27feb-kindergarten.jpg',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'] },
  { n: '021', title: 'Hertz at Kindergarten', venue: 'Kindergarten', city: 'Bologna', iso: '2025-12-26',
    badge: 'Hertz Event', poster: '/assets/poster-v3-26dic-kindergarten.jpg',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b', 'leonardo-giusti'] },
  { n: '020', title: 'Buongiorno Classic Goes To Hertz', venue: 'Numa Club', city: 'Bologna', iso: '2025-11-22',
    badge: 'Collab', poster: '/assets/poster-v3-22nov-numa.jpg',
    lineup: ['federico-apadula', 'tommaso-manco', 'alberto-b'] },
  { n: '019', title: 'Hertz at Kindergarten', venue: 'Kindergarten', city: 'Bologna', iso: '2025-10-24',
    badge: 'Hertz Event', poster: '/assets/poster-v3-24ott-kindergarten.jpg',
    lineup: ['federico-apadula', 'alberto-b'] },
  { n: '018', title: 'Classic Airlines / Boarding Pass', venue: 'Classic Airlines', city: 'Rimini', iso: '2025-09-21',
    badge: 'Collab', poster: '/assets/poster-v3-21set-classicairlines.jpg',
    lineup: ['federico-apadula'] },
];

/* ── helper puri (nessun side-effect, testabili) ── */

const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function endOfDay(iso: string): number | null {
  const p = iso?.split('-');
  return p && p.length >= 3
    ? new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime()
    : null;
}

export function residentName(slug: string): string {
  return RESIDENTS[slug as ResidentSlug] ?? slug;
}

export function isPast(e: HertzEvent, now: Date = new Date()): boolean {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ms = endOfDay(e.iso);
  return ms != null && ms < today;
}

/** dd.mm.yy */
export function shortDate(e: HertzEvent): string {
  const p = e.iso.split('-');
  return `${p[2]}.${p[1]}.${p[0].slice(2)}`;
}

/** FRI 24.04 */
export function dowDate(e: HertzEvent): string {
  const p = e.iso.split('-');
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  return `${DOW[d.getDay()]} ${p[2]}.${p[1]}`;
}

/** eventi di un resident, dal più recente */
export function forResident(slug: ResidentSlug): HertzEvent[] {
  return EVENTS
    .filter((e) => e.lineup.includes(slug))
    .sort((a, b) => (endOfDay(b.iso) ?? 0) - (endOfDay(a.iso) ?? 0));
}

export function upcoming(now: Date = new Date()): HertzEvent[] {
  return EVENTS.filter((e) => !isPast(e, now))
    .sort((a, b) => (endOfDay(a.iso) ?? 0) - (endOfDay(b.iso) ?? 0));
}

export function archive(now: Date = new Date()): HertzEvent[] {
  return EVENTS.filter((e) => isPast(e, now))
    .sort((a, b) => (endOfDay(b.iso) ?? 0) - (endOfDay(a.iso) ?? 0));
}

/** slug URL-safe da testo libero */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** slug stabile e univoco di un evento: numero di catalogo + titolo.
 *  Il prefisso `n` garantisce unicità (più date condividono lo stesso titolo). */
export function eventSlug(e: HertzEvent): string {
  return `${e.n}-${slugify(e.title)}`;
}

export function findEventBySlug(slug: string): HertzEvent | undefined {
  return EVENTS.find((e) => eventSlug(e) === slug);
}

/** anno (numero) di un evento, per raggruppare l'archivio */
export function eventYear(e: HertzEvent): number {
  return +e.iso.slice(0, 4);
}

/** tutti gli slug (per generateStaticParams) */
export function allEventSlugs(): string[] {
  return EVENTS.map(eventSlug);
}

/** evento precedente/successivo in ordine cronologico (tutta la timeline,
 *  non solo upcoming o solo archive) — per la navigazione N°→N°±1 nella
 *  pagina di dettaglio. */
export function adjacentEvents(e: HertzEvent): { prev?: HertzEvent; next?: HertzEvent } {
  const sorted = [...EVENTS].sort((a, b) => (endOfDay(a.iso) ?? 0) - (endOfDay(b.iso) ?? 0));
  const i = sorted.findIndex((x) => x.n === e.n);
  return { prev: i > 0 ? sorted[i - 1] : undefined, next: i >= 0 && i < sorted.length - 1 ? sorted[i + 1] : undefined };
}
