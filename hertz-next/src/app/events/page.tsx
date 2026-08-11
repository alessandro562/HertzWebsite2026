import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import DepartureBoard from '@/components/events/DepartureBoard'
import FeaturedEvent from '@/components/events/FeaturedEvent'
import ArchiveTable from '@/components/events/ArchiveTable'
import { upcoming, archive, eventSlug, eventYear, dowDate } from '@/content/events'
import { ARTISTS } from '@/content/artists'
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, breadcrumbNode, eventNode, itemListNode } from '@/lib/seo'
import styles from './events.module.css'

/* Il calendario dipende da "oggi": upcoming()/archive()/isPast() leggono
   new Date(). Senza questo, quella data resta quella del BUILD e la pagina
   continua a mostrare come prossimo un evento già passato finché non si
   rideploya. Con l'ISR la pagina si rigenera da sola: al massimo un'ora di
   ritardo sul cambio di giorno (che cade alle 02:00 italiane, quindi a
   serata finita, non nel mezzo). */
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Events, Parties & Club Nights',
  description:
    'Every Hertz party: upcoming club nights and past events in Bologna and across Italy. Line-up, venue and ticket status — minimal and deep tech, groove first.',
  keywords: ['eventi clubbing Bologna', 'party Bologna', 'club night', 'dj set', 'minimal', 'deep tech'],
  alternates: { canonical: '/events' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/events`,
    title: 'Events, Parties & Club Nights · Hertz Clubbing Collective',
    description:
      'Every Hertz party: upcoming club nights and past events in Bologna and across Italy. Line-up, venue and ticket status.',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function EventsPage() {
  const up = upcoming()
  const past = archive()
  const feature = up.find((e) => e.poster) ?? up[0]

  const pastYears = [...new Set(past.map(eventYear))]

  /* Un grafo solo: le date upcoming come Event completi (line-up reale come
     performer, agganciata alle pagine resident via @id), più il calendario in
     forma di ItemList e la briciola di navigazione. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': up.map((e) =>
      eventNode(
        e,
        e.lineup.map((s) => ARTISTS[s]).filter(Boolean),
      ),
    ),
  }

  const calendar = itemListNode(
    'Hertz event calendar',
    up.map((e) => ({
      name: `${e.title} — ${e.venue}, ${e.city}, ${dowDate(e)}`,
      url: `${SITE.url}/events/${eventSlug(e)}`,
    })),
    'Upcoming Hertz parties and club nights.',
  )

  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <JsonLd data={calendar} />
      <JsonLd data={breadcrumbNode([{ name: 'Events', path: '/events' }])} />

      {/* Intro + prossima data in evidenza sulla STESSA superficie: la locandina
          sale in alto, subito dopo il titolo. Il calendario completo arriva
          sotto (DepartureBoard), che elenca già tutto con lo stato: prima
          queste due sezioni ripetevano gli stessi eventi due volte. */}
      <Section surface="white" space="md" style={{ paddingTop: 'var(--hz-section-sm)' }}>
        <div className={styles.intro}>
          <div className={styles.introHead}>
            <p className={`${styles.introKicker} hz-mono`}>Events</p>
            <h1 className={styles.introTitle}>Next gigs.</h1>
          </div>
          <div className={styles.introAside}>
            <p className={styles.introLede}>
              Every Hertz night, past and upcoming. Minimal &amp; deep tech across Bologna and
              central Italy, made for the dancefloor first.
            </p>
          </div>
        </div>

        {feature && (
          <div className={styles.featuredWrap}>
            <FeaturedEvent event={feature} />
          </div>
        )}
      </Section>

      {/* ── DEPARTURES · calendario completo delle date in arrivo (ink) ── */}
      {up.length > 0 && (
        <Section surface="ink" space="lg">
          <DepartureBoard events={up} />
        </Section>
      )}

      <Section surface="paper" space="lg">
        <div className={styles.archiveHead}>
          <p className={`${styles.introKicker} hz-mono`}>Archive</p>
          <h2 className={styles.archiveTitle}>Rewind.</h2>
          <span className={`${styles.archiveCount} hz-mono`}>
            Past transmissions · {pastYears.join('–')}
          </span>
        </div>
        <ArchiveTable events={past} />
      </Section>
    </main>
  )
}
