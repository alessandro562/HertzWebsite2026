import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import EventPosterPortal from '@/components/events/EventPosterPortal'
import TicketStickyBar from '@/components/events/TicketStickyBar'
import ViewMorph from '@/motion/ViewMorph'
import Reveal, { Stagger, StaggerItem } from '@/motion/Reveal'
import {
  allEventSlugs,
  findEventBySlug,
  dowDate,
  shortDate,
  isPast,
  adjacentEvents,
  eventSlug,
} from '@/content/events'
import { ARTISTS } from '@/content/artists'
import { galleryFor } from '@/content/galleries'
import { mailto } from '@/lib/site'
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

  return (
    <main id="main">
      {/* ── titolo compositivo + poster integrato nella griglia ── */}
      <Section surface="white" space="md">
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/events">Events</Link>
          <span aria-hidden="true"> / </span>
          <span>N°{e.n}</span>
        </p>

        <div className={styles.titleZone}>
          <div className={styles.tags}>
            <ViewMorph name={`event-status-${slug}`}>
              <StatusBadge status={status} />
            </ViewMorph>
            {e.badge && <span className={`${styles.badge} hz-mono`}>{e.badge}</span>}
          </div>
          <ViewMorph name={`event-title-${slug}`}>
            <h1 className={styles.title}>{e.title}</h1>
          </ViewMorph>
        </div>

        <div className={styles.grid}>
          <EventPosterPortal
            image={e.poster}
            n={e.n}
            status={status}
            date={dowDate(e)}
            title={e.title}
            venue={e.venue}
            viewTransitionName={`event-poster-${slug}`}
            priority
            className={styles.posterSlot}
          />

          <div className={styles.meta} id="ticket-cta">
            <ViewMorph name={`event-date-${slug}`}>
              <p className={styles.when}>
                {dowDate(e)}
                {e.time ? ` · ${e.time.replace(/^[A-Z]{3} · /, '')}` : ''}
              </p>
            </ViewMorph>
            <p className={styles.where}>
              {e.venue} · {e.city}
            </p>

            <dl className={styles.facts}>
              <div>
                <dt className="hz-mono">Date</dt>
                <dd>{shortDate(e)}</dd>
              </div>
              <div>
                <dt className="hz-mono">Catalogue</dt>
                <dd>N°{e.n}</dd>
              </div>
            </dl>

            <div className={styles.cta}>
              {ticketAction && ticketHref && (
                <Button href={ticketHref} external arrow>
                  Reserve by email
                </Button>
              )}
              {!past && !e.onSale && (
                <span className={styles.soonNote}>Line-up &amp; tickets announced soon.</span>
              )}
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

      {/* ── line-up: gerarchia reale (bill → residents), niente reveal identici ── */}
      <Section surface="paper" space="lg">
        <SectionLabel kicker="Line-up" />
        <Reveal as="p" variant="mask" duration={0.8} className={styles.bill}>
          {e.bill || 'Line-up to be announced.'}
        </Reveal>
        {residents.length > 0 && (
          <div className={styles.residents}>
            <span className={`${styles.residentsLabel} hz-mono`}>Hertz on this bill</span>
            <Stagger className={styles.residentChips} gap={0.09}>
              {residents.map((a) => (
                <StaggerItem key={a.slug} variant="up" style={{ display: 'inline-flex' }}>
                  <Link href={`/artists/${a.slug}`} className={styles.chip}>
                    {a.name} ↗
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
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
