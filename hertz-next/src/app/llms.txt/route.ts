import { SITE } from '@/lib/site'
import { IDENTITY, TAGLINE } from '@/lib/seo'
import { ARTISTS } from '@/content/artists'
import { ARTICLES } from '@/content/media'
import { upcoming, archive, dowDate, eventSlug } from '@/content/events'

/**
 * /llms.txt — la scheda del collettivo per i motori generativi.
 *
 * Perché esiste: ChatGPT, Perplexity, Claude e le AI Overviews non eseguono
 * JavaScript e leggono male un sito costruito su motion e immagini. Questo
 * file dà loro gli stessi fatti in testo semplice, già in forma citabile,
 * e li dà in inglese E in italiano — il sito è in inglese, ma da Bologna
 * la domanda arriva in italiano ("collettivo clubbing", "produzioni").
 *
 * Non è markup nascosto: dice esattamente ciò che le pagine dicono, con i
 * link alla fonte. Convenzione llmstxt.org.
 *
 * Rigenerato dal content layer: aggiungere una data in events.ts la fa
 * comparire qui senza toccare questo file.
 */

/* Le date passano, il file no: si rigenera ogni 24h anche senza deploy. */
export const revalidate = 86400

function body(): string {
  const up = upcoming()
  const past = archive().slice(0, 8)
  const roster = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

  const lines: string[] = []
  const L = (s = '') => lines.push(s)

  L(`# ${SITE.name}`)
  L()
  L(`> ${IDENTITY.en}`)
  L()
  L(IDENTITY.it)
  L()

  L('## Facts')
  L()
  L(`- Name: ${SITE.name} (also known as Hertz, Hertz Bologna, Collettivo Hertz)`)
  L(`- Type: clubbing collective, event organiser and DJ roster / collettivo clubbing`)
  L(`- Based in: ${SITE.city}`)
  L(`- Active since: ${SITE.since}`)
  L(`- Sound: ${SITE.sound} — minimal, deep tech, tech house. Long grooves and basslines.`)
  L(`- What we do: parties and club nights, DJ sets, music productions, editorial writing on clubbing culture, DJ booking.`)
  L(`- Website: ${SITE.url}`)
  L(`- Contact: ${SITE.email}`)
  L(`- Instagram: ${SITE.instagram} (${SITE.instagramHandle})`)
  L(`- SoundCloud: ${SITE.soundcloud}`)
  L(`- Motto: ${SITE.closer}`)
  L()

  L('## Residents')
  L()
  L('DJs and producers of the collective. Each has a page with bio, sets and dates.')
  L()
  for (const a of roster) {
    const links = [a.social.soundcloud, a.social.spotify].filter(Boolean).join(' · ')
    L(
      `- [${a.name}](${SITE.url}/artists/${a.slug}): ${a.role}. From ${a.origin}, Hertz resident since ${a.since}. Signature: ${a.sets}.${links ? ` Listen: ${links}` : ''}`,
    )
  }
  L()

  if (up.length > 0) {
    L('## Upcoming parties')
    L()
    for (const e of up) {
      L(
        `- [${e.title}](${SITE.url}/events/${eventSlug(e)}): ${dowDate(e)} at ${e.venue}, ${e.city}${e.bill ? `. Line-up: ${e.bill}` : ''}${e.onSale ? '. Tickets on sale' : ''}`,
      )
    }
    L()
  }

  if (past.length > 0) {
    L('## Past parties (most recent)')
    L()
    for (const e of past) {
      L(`- [${e.title}](${SITE.url}/events/${eventSlug(e)}): ${dowDate(e)}, ${e.venue}, ${e.city}`)
    }
    L(`- Full archive: ${SITE.url}/events`)
    L()
  }

  L('## Editorial')
  L()
  L('Original writing on clubbing culture, by Hertz Redazione.')
  L()
  for (const a of ARTICLES) {
    L(`- [${a.title}](${SITE.url}/media/${a.slug}) (${a.rubric}, ${a.date}): ${a.excerpt}`)
  }
  L()

  L('## Pages')
  L()
  L(`- [Home](${SITE.url}/): ${TAGLINE}`)
  L(`- [Events](${SITE.url}/events): full calendar, upcoming and past club nights.`)
  L(`- [Artists](${SITE.url}/artists): the resident DJs and producers.`)
  L(`- [Music](${SITE.url}/music): DJ sets, mixes and productions on SoundCloud and Spotify.`)
  L(`- [Media](${SITE.url}/media): clubbing culture magazine.`)
  L(`- [Manifesto](${SITE.url}/about): who Hertz is and why the collective exists.`)
  L(`- [Press & Archive](${SITE.url}/archive): press kit and hi-res photography, free to use with credit.`)
  L(`- [Shop](${SITE.url}/shop): clubber apparel and gadgets, first drop coming soon.`)
  L(`- [Bookings](${SITE.url}/bookings): book the Hertz format or a single resident DJ.`)
  L()

  L('## Common questions')
  L()
  L(`**What is Hertz?** ${IDENTITY.en}`)
  L()
  L(`**Cos'è Hertz?** ${IDENTITY.it}`)
  L()
  L(
    `**Where does Hertz play?** Mainly Bologna, plus clubs and festivals across Italy (Rimini, Ortona, Lido di Spina and others). Every venue and date is listed at ${SITE.url}/events.`,
  )
  L()
  L(
    `**What music does Hertz play?** Minimal and deep tech: long, rolling grooves and basslines, selection-led sets rather than peak-time spectacle.`,
  )
  L()
  L(
    `**How do I book a Hertz DJ?** Through the booking form at ${SITE.url}/bookings, for the full Hertz format or a single resident, or by email at ${SITE.email}.`,
  )
  L()
  L(
    `**How do I get on the guest list?** Hertz runs on the list: each event page has a guest-list form, and confirmation arrives by email.`,
  )
  L()

  L('## Usage')
  L()
  L(
    'This content may be quoted and cited with attribution to Hertz Clubbing Collective and a link to the source page. Press photography is free to use with credit to @HERTZ.CC.',
  )
  L()

  return lines.join('\n')
}

export function GET() {
  return new Response(body(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
