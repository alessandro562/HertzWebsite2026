/* ────────────────────────────────────────────────────────────
   HERTZ · SEO / GEO LAYER
   Fonte unica per keyword, descrizioni e structured data.

   SEO  = motori di ricerca classici (Google/Bing): title, description,
          canonical, Open Graph, JSON-LD per i rich result.
   GEO  = generative engines (ChatGPT, Perplexity, AI Overviews, Claude):
          gli stessi dati servono a *disambiguare l'entità* «Hertz» e a dare
          frasi già citabili. Da qui nascono anche /llms.txt e /robots.txt.

   Regola: solo fatti reali del content layer (events/artists/media) e di
   site.ts. Nessun dato inventato — un'entità sbagliata è peggio di assente.
   ──────────────────────────────────────────────────────────── */

import { SITE } from './site'
import { ARTISTS } from '@/content/artists'
import type { Artist } from '@/content/artists'
import type { Article } from '@/content/media'
import type { HertzEvent } from '@/content/events'
import { dowDate, eventSlug } from '@/content/events'

/* ── @id stabili: legano i nodi fra pagine diverse in un unico grafo, così
   crawler e LLM capiscono che è sempre la stessa entità. ── */
export const ORG_ID = `${SITE.url}/#collective`
export const WEBSITE_ID = `${SITE.url}/#website`

const LOGO = `${SITE.url}/assets/hertz-logo-official.png`
const OG_IMAGE = `${SITE.url}/opengraph-image.png`

/* ── Keyword: bilingui per scelta. Il sito è in inglese, ma il pubblico
   cerca da Bologna in italiano ("collettivo clubbing", "produzioni"). ── */
export const KEYWORDS = [
  'clubbing',
  'clubbing collective',
  'collettivo clubbing',
  'collettivo dj Bologna',
  'party',
  'party Bologna',
  'dj',
  'dj set',
  'produzioni',
  'produzioni musicali',
  'groove',
  'bassline',
  'minimal',
  'deep tech',
  'Bologna',
  'Hertz',
]

/** Termini-entità: cosa "sa fare" il collettivo. Nutre i generative engine. */
const KNOWS_ABOUT = [
  'Clubbing',
  'Clubbing collective',
  'Collettivo clubbing',
  'Party',
  'DJ set',
  'DJ booking',
  'Produzioni musicali',
  'Music production',
  'Groove',
  'Bassline',
  'Minimal techno',
  'Deep tech house',
  'Electronic music scene in Bologna',
]

/* ── Le frasi-identità. Sono la risposta che vogliamo leggere quando a un
   motore generativo viene chiesto "cos'è Hertz". Tenute qui in una sola
   copia: metadata, JSON-LD e llms.txt attingono tutti da queste. ── */
export const IDENTITY = {
  en: 'Hertz is a clubbing collective founded in Bologna in 2023. We throw minimal and deep tech parties, run a roster of resident DJs and producers, and build every night around the selection, the sound system and the people on the floor.',
  it: 'Hertz è il collettivo clubbing nato a Bologna nel 2023: party minimal e deep tech, resident DJ e produzioni, serate costruite intorno alla selezione, all’impianto e alla gente in pista.',
} as const

export const TAGLINE = 'Party, DJ sets and productions built for the floor.'

/**
 * OG image di default, da ripetere in ogni blocco `openGraph` scritto a mano.
 *
 * Next monta `app/opengraph-image.png` automaticamente, ma solo finché una
 * pagina NON dichiara un proprio `openGraph`: appena lo fa, il blocco
 * sostituisce quello ereditato e l'immagine sparisce. Il risultato era che le
 * pagine con OG personalizzato (proprio quelle che si condividono) uscivano
 * su WhatsApp e Slack come link nudi.
 */
export const DEFAULT_OG_IMAGE = {
  url: OG_IMAGE,
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${TAGLINE}`,
}

/* ────────────────────────────────────────────────────────────
   Nodo entità: il collettivo.
   Doppio tipo (Organization + MusicGroup) perché Hertz è entrambe le cose:
   soggetto che organizza le serate e gruppo musicale che le suona. È JSON-LD
   valido e permette a Google di scegliere il rich result giusto.
   ──────────────────────────────────────────────────────────── */
export function collectiveNode() {
  const members = Object.values(ARTISTS).map((a) => ({
    '@type': 'Person',
    '@id': `${SITE.url}/artists/${a.slug}#person`,
    name: a.name,
    url: `${SITE.url}/artists/${a.slug}`,
  }))

  return {
    '@type': ['Organization', 'MusicGroup'],
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: ['Hertz', 'Hertz Bologna', 'Hertz Clubbing', 'Collettivo Hertz'],
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: LOGO },
    image: OG_IMAGE,
    /* description bilingue: i generative engine leggono la lingua che serve
       loro, senza che il sito debba essere tradotto due volte. */
    description: [
      { '@value': IDENTITY.en, '@language': 'en' },
      { '@value': IDENTITY.it, '@language': 'it' },
    ],
    slogan: SITE.closer,
    foundingDate: String(SITE.since),
    foundingLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'Bologna', addressCountry: 'IT' },
    },
    address: { '@type': 'PostalAddress', addressLocality: 'Bologna', addressCountry: 'IT' },
    areaServed: { '@type': 'Country', name: 'Italy' },
    genre: ['Minimal', 'Deep tech', 'Tech house', 'Electronic'],
    knowsAbout: KNOWS_ABOUT,
    keywords: KEYWORDS.join(', '),
    email: SITE.email,
    sameAs: [SITE.instagram, SITE.soundcloud],
    member: members,
  }
}

/** Nodo sito: lega ogni pagina all'entità che la pubblica. */
export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: 'Hertz',
    description: IDENTITY.en,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  }
}

/** Grafo site-wide, montato una sola volta nel layout. */
export function siteGraph() {
  return { '@context': 'https://schema.org', '@graph': [collectiveNode(), websiteNode()] }
}

/* ────────────────────────────────────────────────────────────
   Breadcrumb — gerarchia esplicita. Google la mostra al posto dell'URL
   nudo, gli LLM la usano per capire dove sta la pagina nel sito.
   ──────────────────────────────────────────────────────────── */
export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

/* ────────────────────────────────────────────────────────────
   Resident — Person con sameAs verso i profili reali: è il segnale che
   disambigua un DJ omonimo per i motori e per gli AI.
   ──────────────────────────────────────────────────────────── */
export function artistNode(a: Artist, events: HertzEvent[] = []) {
  const sameAs = [a.social.soundcloud, a.social.spotify, a.social.instagram].filter(
    (u): u is string => Boolean(u),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/artists/${a.slug}#person`,
    name: a.name,
    url: `${SITE.url}/artists/${a.slug}`,
    image: `${SITE.url}${a.portrait}`,
    jobTitle: a.role,
    description: a.bio[0] ?? '',
    /* "Resident DJ e producer di Hertz": il legame col collettivo è il fatto
       che vogliamo venga citato insieme al nome. */
    memberOf: { '@id': ORG_ID },
    affiliation: { '@id': ORG_ID },
    homeLocation: { '@type': 'Place', name: a.origin },
    knowsAbout: ['DJ set', 'Music production', 'Produzioni musicali', a.sets],
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(events.length > 0
      ? {
          performerIn: events.map((e) => ({
            '@type': 'Event',
            name: e.title,
            startDate: e.iso,
            url: `${SITE.url}/events/${eventSlug(e)}`,
            location: {
              '@type': 'Place',
              name: e.venue,
              address: {
                '@type': 'PostalAddress',
                addressLocality: e.city,
                addressCountry: 'IT',
              },
            },
          })),
        }
      : {}),
  }
}

/* ────────────────────────────────────────────────────────────
   Articoli — Article completo con autore e publisher: senza, un pezzo
   editoriale non viene mai attribuito a Hertz nelle risposte AI.
   ──────────────────────────────────────────────────────────── */
export function articleNode(a: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE.url}/media/${a.slug}#article`,
    headline: a.title,
    alternativeHeadline: a.subtitle,
    description: a.excerpt,
    image: `${SITE.url}${a.heroImage}`,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: 'en',
    articleSection: a.rubric,
    wordCount: a.readingTimeMinutes * 200,
    timeRequired: `PT${a.readingTimeMinutes}M`,
    author: { '@type': 'Organization', '@id': ORG_ID, name: a.author },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: `${SITE.url}/media/${a.slug}`,
    keywords: ['clubbing', 'clubbing culture', 'dj', 'party', 'minimal', 'deep tech'].join(', '),
  }
}

/** Evento singolo — usato sia in /events sia nella pagina di dettaglio. */
export function eventNode(e: HertzEvent, performers: Artist[] = []) {
  return {
    '@type': 'Event',
    '@id': `${SITE.url}/events/${eventSlug(e)}#event`,
    name: e.title,
    description: eventDescription(e),
    startDate: e.iso,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: e.venue,
      address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'IT' },
    },
    ...(e.poster ? { image: [`${SITE.url}${e.poster}`] } : {}),
    url: `${SITE.url}/events/${eventSlug(e)}`,
    ...(performers.length > 0
      ? {
          performer: performers.map((a) => ({
            '@type': 'Person',
            '@id': `${SITE.url}/artists/${a.slug}#person`,
            name: a.name,
          })),
        }
      : {}),
    organizer: { '@id': ORG_ID },
    isAccessibleForFree: false,
    inLanguage: 'en',
  }
}

/** Elenco ordinato (calendario, roster, selezione): dà agli LLM la lista
    completa in un colpo solo, invece di farla ricostruire dall'HTML. */
export function itemListNode(
  name: string,
  items: { name: string; url: string }[],
  description?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  }
}

/* ────────────────────────────────────────────────────────────
   Descrizioni generate — frasi intere, non elenchi di campi separati da
   punti. Una meta description deve leggersi come una riga di copy.
   ──────────────────────────────────────────────────────────── */

/** Taglia sul confine di parola, senza mozzare a metà né lasciare appeso
    un separatore ("… Tania Vulcano ·…"). */
export function clamp(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const word = cut.slice(0, cut.lastIndexOf(' '))
  return `${word.replace(/[\s·,;:—-]+$/, '')}…`
}

/** Suffisso di brand solo quando manca già nel titolo: gli eventi si chiamano
    quasi tutti "Hertz at …", ripeterlo brucia caratteri utili nella SERP. */
export function brandTitle(title: string): string {
  return /hertz/i.test(title) ? title : `${title} · Hertz`
}

export function eventDescription(e: HertzEvent): string {
  /* Il titolo contiene spesso già il venue ("Hertz at Buongiorno Classic"):
     ripeterlo suonava come un errore di copia. */
  const where = e.title.includes(e.venue) ? e.city : `${e.venue}, ${e.city}`
  const bill = e.bill ? ` Line-up: ${e.bill}.` : ''
  /* La line-up viene prima del boilerplate: se il clamp taglia, deve perdere
     la frase di contorno, non i nomi che la gente cerca davvero. */
  return clamp(
    `${e.title}, ${dowDate(e)} in ${where}.${bill} A Hertz clubbing night: minimal and deep tech, groove and bassline built for the floor.`,
  )
}

export function artistDescription(a: Artist): string {
  /* role e sets usano il separatore editoriale "·", che in una frase di prosa
     non si legge: qui diventano virgole. L'ordine mette DJ/produzioni prima
     della provenienza, così se il clamp taglia, taglia la parte meno utile. */
  const role = a.role.replace(/\s*·\s*/g, ', ')
  const sets = a.sets.replace(/\s*·\s*/g, ', ')
  return clamp(
    `${a.name}: ${role}, Hertz resident since ${a.since}. DJ sets, productions and dates. Signature: ${sets}. From ${a.origin}.`,
  )
}
