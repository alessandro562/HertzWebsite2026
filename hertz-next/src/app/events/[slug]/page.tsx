import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import EventRow from '@/components/events/EventRow'
import {
  EVENTS,
  allEventSlugs,
  findEventBySlug,
  dowDate,
  shortDate,
  isPast,
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

  const more = [
    ...EVENTS.filter((x) => x.n !== e.n && x.venue === e.venue),
    ...EVENTS.filter((x) => x.n !== e.n && x.venue !== e.venue && isPast(x) === past),
  ]
    .filter((x, i, arr) => arr.findIndex((y) => y.n === x.n) === i)
    .slice(0, 4)

  return (
    <main id="main">
      {/* ── hero ── */}
      <Section surface="white" space="md">
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/events">Events</Link>
          <span aria-hidden="true"> / </span>
          <span>N°{e.n}</span>
        </p>

        <div className={styles.hero}>
          <div className={styles.heroMeta}>
            <div className={styles.heroTags}>
              <StatusBadge status={status} />
              {e.badge && <span className={`${styles.badge} hz-mono`}>{e.badge}</span>}
            </div>
            <h1 className={styles.title}>{e.title}</h1>
            <p className={styles.when}>
              {dowDate(e)}
              {e.time ? ` · ${e.time.replace(/^[A-Z]{3} · /, '')}` : ''}
            </p>
            <p className={styles.where}>
              {e.venue} · {e.city}
            </p>

            <div className={styles.cta}>
              {!past && e.onSale && (
                <Button
                  href={mailto(
                    `Reserve — ${e.title} (N°${e.n})`,
                    `Hi Hertz, I'd like to reserve for ${e.title} at ${e.venue}, ${e.city} on ${dowDate(e)}.`,
                  )}
                  external
                  arrow
                >
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
              <Button href={past ? '/archive' : '/events'} variant="ghost" arrow>
                {past ? 'Back to archive' : 'All events'}
              </Button>
            </div>
          </div>

          {e.poster ? (
            <ImageFrame
              src={e.poster}
              alt={`Poster — ${e.title}`}
              ratio="4 / 5"
              priority
              className={styles.poster}
            />
          ) : (
            <div className={styles.posterMissing}>
              <span className="hz-mono">Poster</span>
              <span className="hz-mono">Coming soon</span>
            </div>
          )}
        </div>
      </Section>

      {/* ── details + line-up ── */}
      <Section surface="paper" space="lg">
        <div className={styles.detailGrid}>
          <div className={styles.lineup}>
            <SectionLabel kicker="Line-up" />
            {e.bill ? (
              <p className={styles.bill}>{e.bill}</p>
            ) : (
              <p className={styles.bill}>Line-up to be announced.</p>
            )}
            {residents.length > 0 && (
              <div className={styles.residents}>
                <span className={`${styles.residentsLabel} hz-mono`}>Hertz on this bill</span>
                <div className={styles.residentChips}>
                  {residents.map((a) => (
                    <Link key={a.slug} href={`/artists/${a.slug}`} className={styles.chip}>
                      {a.name} ↗
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <dl className={styles.facts}>
            <div>
              <dt className="hz-mono">Date</dt>
              <dd>
                {dowDate(e)} · {shortDate(e)}
              </dd>
            </div>
            {e.time && (
              <div>
                <dt className="hz-mono">Time</dt>
                <dd>{e.time}</dd>
              </div>
            )}
            <div>
              <dt className="hz-mono">Venue</dt>
              <dd>{e.venue}</dd>
            </div>
            <div>
              <dt className="hz-mono">City</dt>
              <dd>{e.city}</dd>
            </div>
            <div>
              <dt className="hz-mono">Catalogue</dt>
              <dd>N°{e.n}</dd>
            </div>
          </dl>
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

      {/* ── more dates ── */}
      {more.length > 0 && (
        <Section surface="signal" space="lg">
          <SectionLabel
            kicker="More dates"
            title={past ? 'From the archive.' : 'Keep the calendar.'}
            link={{ href: '/events', label: 'All events ↗' }}
          />
          <div>
            {more.map((x) => (
              <EventRow key={x.n} event={x} />
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}
