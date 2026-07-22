import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import EventPosterPortal from '@/components/events/EventPosterPortal'
import TicketModule from '@/components/events/TicketModule'
import TicketStickyBar from '@/components/events/TicketStickyBar'
import ViewMorph from '@/motion/ViewMorph'
import FrequencyCut from '@/motion/FrequencyCut'
import { Stagger, StaggerItem } from '@/motion/Reveal'
import {
  allEventSlugs,
  findEventBySlug,
  dowDate,
  isPast,
  adjacentEvents,
  eventSlug,
} from '@/content/events'
import { ARTISTS } from '@/content/artists'
import { galleryFor } from '@/content/galleries'
import { mailto, SITE } from '@/lib/site'
import styles from './event.module.css'

export function generateStaticParams() {
  return allEventSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const e = findEventBySlug(slug)
  if (!e) return {}
  const desc = [`${e.venue}, ${e.city}`, dowDate(e), e.bill].filter(Boolean).join(' · ')
  return {
    title: `${e.title} · N°${e.n}`,
    description: desc,
    alternates: { canonical: `/events/${slug}` },
    openGraph: e.poster ? { images: [{ url: e.poster }] } : undefined,
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = findEventBySlug(slug)
  if (!e) notFound()

  const past = isPast(e)
  const status: Status = past ? 'archive' : e.onSale ? 'on-sale' : 'soon'
  const residents = e.lineup.map((s) => ARTISTS[s]).filter(Boolean)
  const gallery = galleryFor(e.n)
  const { prev, next: nextEvent } = adjacentEvents(e)

  const ticketAction = !past && e.onSale
  const ticketHref = ticketAction
    ? mailto(
        `Reserve — ${e.title} (N°${e.n})`,
        `Hi Hertz, I'd like to reserve for ${e.title} at ${e.venue}, ${e.city} on ${dowDate(e)}.`,
      )
    : undefined

  const ticketState = past ? 'archive' : e.onSale ? 'on-sale' : 'soon'

  /* bill → righe numerate editoriali; i nomi che corrispondono a un resident
     Hertz reale diventano link (frequency underline). Il campo lineup
     (residents reali sul cartellone) è dato separato dal testo del bill:
     eventuali resident non già citati testualmente vengono aggiunti in coda,
     senza inventare nulla — sono dati reali del content layer. */
  const billNames = e.bill
    ? e.bill.split('·').map((s) => s.trim()).filter(Boolean)
    : []
  const billRows = billNames.map((name) => ({
    name,
    resident: residents.find((a) => a.name.toLowerCase() === name.toLowerCase()),
  }))
  const matchedSlugs = new Set(billRows.map((r) => r.resident?.slug).filter(Boolean))
  const extraResidentRows = residents
    .filter((a) => !matchedSlugs.has(a.slug))
    .map((a) => ({ name: a.name, resident: a }))
  const lineupRows = [...billRows, ...extraResidentRows]

  /* structured data (schema.org Event) — solo campi reali già mostrati in
     pagina (nome/data/venue/lineup/poster); nessun prezzo/orario inventato. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.iso,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: e.venue,
      address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'IT' },
    },
    ...(e.poster ? { image: [`${SITE.url}${e.poster}`] } : {}),
    url: `${SITE.url}/events/${slug}`,
    ...(residents.length > 0
      ? { performer: residents.map((a) => ({ '@type': 'MusicGroup', name: a.name })) }
      : {}),
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  }

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── hero modulare 12-col: numero laterale · poster · contenuto+ticket ── */}
      <Section
        surface="white"
        space="md"
        style={{ paddingTop: 'var(--hz-section-sm)', paddingBottom: 0 }}
      >
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/events">Events</Link>
          <span aria-hidden="true"> / </span>
          <span>N°{e.n}</span>
        </p>

        <div
          className={styles.hero}
          data-status={status}
          style={{ viewTransitionName: `event-frame-${slug}` } as CSSProperties}
        >
          <div className={styles.heroNum} aria-hidden="true">
            <span className="hz-mono">N°{e.n}</span>
          </div>

          <div className={styles.heroPoster}>
            <EventPosterPortal
              image={e.poster}
              n={e.n}
              status={status}
              date={dowDate(e)}
              title={e.title}
              venue={e.venue}
              viewTransitionName={`event-poster-${slug}`}
              priority
              fill
              className={styles.posterSlot}
            />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroTop}>
              <ViewMorph name={`event-status-${slug}`}>
                <StatusBadge status={status} />
              </ViewMorph>
              <ViewMorph name={`event-date-${slug}`}>
                <span className={`${styles.when} hz-mono`}>
                  {dowDate(e)}
                  {e.time ? ` · ${e.time.replace(/^[A-Z]{3} · /, '')}` : ''}
                </span>
              </ViewMorph>
            </div>

            <FrequencyCut variant="editorial" trigger="inView" className={styles.heroCut} />

            <div className={styles.heroMid}>
              <ViewMorph name={`event-title-${slug}`}>
                <h1 className={styles.title}>{e.title}</h1>
              </ViewMorph>
              <p className={styles.where}>
                {e.venue} · {e.city}
              </p>
              {e.badge && <p className={`${styles.badge} hz-mono`}>{e.badge}</p>}
            </div>

            <div className={styles.heroTicket} id="ticket-cta">
              <TicketModule state={ticketState} href={ticketHref} external={false} />
            </div>

            <div className={styles.heroFoot}>
              {past && gallery.length > 0 && (
                <Button href="#gallery" variant="ghost">
                  View gallery
                </Button>
              )}
              <Button href={past ? '/archive' : '/events'} variant="text" arrow>
                {past ? 'Back to archive' : 'All events'}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── line-up: righe editoriali numerate (bill → residents reali) ──
         gap ridotto (96-120px desktop, 64-80px mobile): la Line-up è
         continuazione dell'evento, non una pagina successiva. */}
      <Section surface="paper" space="lg" style={{ paddingTop: 'clamp(64px, 9vw, 120px)' }}>
        <SectionLabel kicker="02 / Line-up" />
        <div className={styles.lineup}>
          <FrequencyCut variant="editorial" trigger="inView" className={styles.lineupCut} />
          {lineupRows.length > 0 ? (
            <Stagger className={styles.lineupList} gap={0.07}>
              {lineupRows.map((row, i) => (
                <StaggerItem key={`${row.name}-${i}`} variant="up" className={styles.lineupRow}>
                  <span className={`${styles.lineupIndex} hz-mono`}>{String(i + 1).padStart(2, '0')}</span>
                  {row.resident ? (
                    <Link href={`/artists/${row.resident.slug}`} className={styles.lineupName}>
                      {row.name}
                    </Link>
                  ) : (
                    <span className={styles.lineupNamePlain}>{row.name}</span>
                  )}
                  {row.resident && <span className={`${styles.lineupTag} hz-mono`}>Hertz resident</span>}
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className={styles.bill}>Line-up to be announced.</p>
          )}
        </div>
      </Section>

      {/* ── gallery (solo eventi con servizio fotografico reale) ── */}
      {gallery.length > 0 && (
        <Section surface="white" space="lg" id="gallery">
          <SectionLabel
            kicker="Gallery"
            title="From the night."
            link={{ href: '/archive', label: `${gallery.length} frames ↗` }}
          />
          <div className={styles.gallery}>
            {gallery.map((src, i) => (
              <ImageFrame
                key={src}
                src={src}
                alt={`${e.title} — frame ${i + 1}`}
                ratio="3 / 2"
                className={styles.galleryItem}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── precedente / successivo (timeline cronologica reale) ── */}
      {(prev || nextEvent) && (
        <Section surface="signal" space="lg">
          <SectionLabel kicker="Timeline" title="Keep the calendar." />
          <div className={styles.adjacent}>
            {prev && (
              <Link href={`/events/${eventSlug(prev)}`} className={styles.adjacentCard}>
                <span className={`${styles.adjacentDir} hz-mono`}>← Previous</span>
                <span className={styles.adjacentTitle}>{prev.title}</span>
                <span className={`${styles.adjacentMeta} hz-mono`}>
                  N°{prev.n} · {dowDate(prev)}
                </span>
              </Link>
            )}
            {nextEvent && (
              <Link href={`/events/${eventSlug(nextEvent)}`} className={styles.adjacentCard}>
                <span className={`${styles.adjacentDir} hz-mono`}>Next →</span>
                <span className={styles.adjacentTitle}>{nextEvent.title}</span>
                <span className={`${styles.adjacentMeta} hz-mono`}>
                  N°{nextEvent.n} · {dowDate(nextEvent)}
                </span>
              </Link>
            )}
          </div>
        </Section>
      )}

      {/* ── Tickets sticky mobile: appare solo quando il CTA inline è fuori
         vista, non copre mai i contenuti (compare/scompare, non fissa) ── */}
      {ticketAction && ticketHref && (
        <TicketStickyBar targetId="ticket-cta" href={ticketHref} label="Reserve by email" />
      )}
    </main>
  )
}
