import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import PhotoGallery from '@/components/ui/PhotoGallery'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import PosterFX from '@/components/ui/PosterFX'
import PosterFallback from '@/components/events/PosterFallback'
import TicketModule from '@/components/events/TicketModule'
import JoinHertzList from '@/components/events/JoinHertzList'
import ViewMorph from '@/motion/ViewMorph'
import FrequencyCut from '@/motion/FrequencyCut'
import { Stagger, StaggerItem } from '@/motion/Reveal'
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
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, brandTitle, breadcrumbNode, eventDescription, eventNode } from '@/lib/seo'
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
  /* Descrizione come frase intera, non come elenco di campi: è quella che
     Google mostra sotto il titolo e che un LLM riusa per riassumere la data. */
  const desc = eventDescription(e)
  /* Il titolo porta già città e data: sono le due cose che si cercano
     ("hertz bologna agosto"), e nella SERP distinguono date omonime. Titolo
     assoluto: col suffisso pieno del template si arrivava a 74 caratteri e
     Google tagliava proprio città e data. */
  const title = brandTitle(`${e.title} — ${e.city}, ${shortDate(e)}`)
  return {
    title: { absolute: title },
    description: desc,
    keywords: [
      'party',
      'clubbing',
      'dj set',
      e.city,
      e.venue,
      ...(e.bill ? e.bill.split('·').map((s) => s.trim()) : []),
    ],
    alternates: { canonical: `/events/${slug}` },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'en_GB',
      url: `${SITE.url}/events/${slug}`,
      title,
      description: desc,
      /* Le date TBA non hanno ancora la locandina: senza fallback l'anteprima
         del link usciva completamente vuota proprio sull'evento più condiviso,
         quello appena annunciato. */
      images: e.poster ? [{ url: e.poster }] : [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    },
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
     pagina (nome/data/venue/lineup/poster); nessun prezzo/orario inventato.
     I performer sono Person con @id: la stessa entità della pagina resident,
     così i motori collegano il DJ alla data e viceversa. */
  const jsonLd = { '@context': 'https://schema.org', ...eventNode(e, residents) }

  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbNode([
          { name: 'Events', path: '/events' },
          { name: e.title, path: `/events/${slug}` },
        ])}
      />
      {/* ── hero modulare 12-col: numero laterale · poster · contenuto+ticket ── */}
      <Section
        surface="white"
        space="md"
        style={{ paddingTop: 'var(--hz-section-sm)', paddingBottom: 0 }}
      >
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/events">Events</Link>
          <span aria-hidden="true"> / </span>
          <span>{e.title}</span>
        </p>

        <div
          className={styles.hero}
          data-status={status}
          style={{ viewTransitionName: `event-frame-${slug}` } as CSSProperties}
        >
          <div className={styles.heroPoster}>
            <ViewMorph name={`event-poster-${slug}`}>
              {e.poster ? (
                <figure className={styles.posterFig}>
                  <img
                    src={e.poster}
                    alt={`Poster: ${e.title}`}
                    className={styles.posterImg}
                    loading="eager"
                    decoding="async"
                  />
                  <PosterFX tone="dark" />
                </figure>
              ) : (
                <div className={styles.posterFig} data-fallback="true">
                  <PosterFallback
                    date={dowDate(e)}
                    city={e.city}
                    className={styles.posterFallbackInner}
                  />
                </div>
              )}
            </ViewMorph>
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
              {lineupRows.length > 0 && (
                <p className={styles.heroBill}>
                  <span className={`${styles.heroBillLabel} hz-mono`}>Line-up</span>
                  <span className={styles.heroBillNames}>
                    {lineupRows.map((row, i) => (
                      <span key={`${row.name}-${i}`}>
                        {row.resident ? (
                          <Link href={`/artists/${row.resident.slug}`} className={styles.heroBillLink}>
                            {row.name}
                          </Link>
                        ) : (
                          row.name
                        )}
                        {i < lineupRows.length - 1 && <span aria-hidden="true"> · </span>}
                      </span>
                    ))}
                  </span>
                </p>
              )}
            </div>

            <div className={styles.heroTicket} id="ticket-cta">
              {past ? (
                <TicketModule state="archive" />
              ) : (
                <JoinHertzList
                  event={{ n: e.n, title: e.title, date: dowDate(e), venue: e.venue, city: e.city }}
                  soon={!e.onSale}
                  lineupReady={lineupRows.length > 0}
                />
              )}
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
        <SectionLabel kicker="Line-up" />
        <div className={styles.lineup}>
          <FrequencyCut variant="editorial" trigger="inView" className={styles.lineupCut} />
          {lineupRows.length > 0 ? (
            <Stagger className={styles.lineupList} gap={0.07}>
              {lineupRows.map((row, i) => (
                <StaggerItem key={`${row.name}-${i}`} variant="up" className={styles.lineupRow}>
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
            link={{ href: '/archive', label: `${gallery.length} frames` }}
          />
          <PhotoGallery photos={gallery} label={e.title} caption={`${e.venue} · ${e.city}`} />
        </Section>
      )}

      {/* ── precedente / successivo (timeline cronologica reale) ── */}
      {(prev || nextEvent) && (
        <Section surface="signal" space="lg">
          <SectionLabel kicker="Timeline" title="Nights either side." />
          <div className={styles.adjacent}>
            {prev && (
              <Link href={`/events/${eventSlug(prev)}`} className={styles.adjacentCard}>
                <span className={`${styles.adjacentDir} hz-mono`}>← Previous</span>
                <span className={styles.adjacentTitle}>{prev.title}</span>
                <span className={`${styles.adjacentMeta} hz-mono`}>{dowDate(prev)}</span>
              </Link>
            )}
            {nextEvent && (
              <Link href={`/events/${eventSlug(nextEvent)}`} className={styles.adjacentCard}>
                <span className={`${styles.adjacentDir} hz-mono`}>Next →</span>
                <span className={styles.adjacentTitle}>{nextEvent.title}</span>
                <span className={`${styles.adjacentMeta} hz-mono`}>{dowDate(nextEvent)}</span>
              </Link>
            )}
          </div>
        </Section>
      )}

    </main>
  )
}
