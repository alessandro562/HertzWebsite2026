import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import Arrow from '@/components/ui/Arrow'
import MixRow from '@/components/music/MixRow'
import PhotoGallery from '@/components/ui/PhotoGallery'
import ViewMorph from '@/motion/ViewMorph'
import Parallax from '@/motion/Parallax'
import { Stagger, StaggerItem } from '@/motion/Reveal'
import { ARTISTS } from '@/content/artists'
import { forResident, eventSlug, isPast, dowDate, type ResidentSlug } from '@/content/events'
import styles from './artist.module.css'

export function generateStaticParams() {
  return Object.keys(ARTISTS).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = ARTISTS[slug as ResidentSlug]
  if (!a) return {}
  return {
    title: a.name,
    description: `${a.name}, ${a.role}. ${a.bio[0] ?? ''}`.trim(),
    alternates: { canonical: `/artists/${slug}` },
    openGraph: { images: [{ url: a.portrait }] },
  }
}

/**
 * Pagina resident — struttura IDENTICA per ogni DJ, nessun riferimento a Hz.
 * Ordine ripreso dal vecchio sito: intro/ritratto → bio → gallery → listen →
 * appearances → bookings → next resident. Foto sempre verticali (4:5).
 */
export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = ARTISTS[slug as ResidentSlug]
  if (!a) notFound()

  const events = forResident(a.slug)
  const upcomingDates = events.filter((e) => !isPast(e))
  const archiveDates = events.filter((e) => isPast(e))
  const socials = [
    a.social.soundcloud && { label: 'SoundCloud', href: a.social.soundcloud },
    a.social.spotify && { label: 'Spotify', href: a.social.spotify },
    a.social.instagram && { label: 'Instagram', href: a.social.instagram },
  ].filter((s): s is { label: string; href: string } => Boolean(s))
  const bookingHref = `/bookings?resident=${a.slug}`

  /* metadata reale (origin / resident since / signature dal legacy) — no Hz */
  const meta = [
    { label: 'Origin', value: a.origin },
    { label: 'Resident since', value: a.since },
    { label: 'Signature', value: a.sets },
    { label: 'Catalogue', value: `N°${a.n}` },
    events.length > 0 && { label: 'Sessions', value: String(events.length) },
  ].filter((m): m is { label: string; value: string } => Boolean(m))

  /* navigazione ciclica al prossimo resident (per numero) */
  const roster = Object.values(ARTISTS).sort((x, y) => x.n.localeCompare(y.n))
  const nextArtist = roster[(roster.findIndex((x) => x.slug === a.slug) + 1) % roster.length]

  return (
    <main id="main">
      {/* ── 1 · intro + ritratto (cold-blue) ── */}
      <Section surface="cold-blue" space="md" style={{ paddingBottom: 'clamp(48px, 6vw, 96px)' }}>
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/artists">Artists</Link>
          <span aria-hidden="true"> / </span>
          <span>{a.n}</span>
        </p>

        <div className={styles.hero}>
          <div className={styles.identity}>
            <span className={`${styles.resTag} hz-mono`}>N°{a.n} · Resident</span>
            <ViewMorph name={`artist-name-${a.slug}`}>
              <h1 className={styles.name}>{a.name}</h1>
            </ViewMorph>
            <p className={styles.role}>{a.role}</p>
            <div className={styles.actions}>
              {socials.map((s) => (
                <Button key={s.label} href={s.href} external variant="ghost" arrow>
                  {s.label}
                </Button>
              ))}
              <Button href={bookingHref} variant="text" arrow>
                Booking
              </Button>
            </div>
            <div className={`${styles.meta} hz-mono`}>
              {meta.map((m) => (
                <span key={m.label} className={styles.metaItem}>
                  <span className={styles.metaLabel}>{m.label}</span>
                  <span className={styles.metaValue}>{m.value}</span>
                </span>
              ))}
            </div>
          </div>
          <Parallax speed={38} className={styles.portrait}>
            <ViewMorph name={`artist-portrait-${a.slug}`}>
              <ImageFrame src={a.portrait} alt={a.name} ratio="4 / 5" priority />
            </ViewMorph>
          </Parallax>
        </div>
      </Section>

      {/* ── 2 · bio (white) ── */}
      <Section
        surface="white"
        space="lg"
        style={{ paddingTop: 'clamp(72px, 8vw, 130px)', paddingBottom: 'clamp(72px, 8vw, 130px)' }}
      >
        <div className={styles.bioGrid}>
          <SectionLabel kicker="Profile" />
          <div className={styles.bio}>
            {a.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 3 · gallery (paper) — carosello card + lightbox ── */}
      {a.gallery.length > 0 && (
        <Section surface="paper" space="lg">
          <SectionLabel kicker="Gallery" title="The movement." />
          <PhotoGallery photos={a.gallery} label={a.name} />
        </Section>
      )}

      {/* ── 4 · listen (white) ── */}
      {(a.mixes.length > 0 || a.social.soundcloud || a.social.spotify) && (
        <Section surface="white" space="lg">
          <SectionLabel
            kicker="Listen"
            title="On record."
            link={
              a.social.soundcloud
                ? { href: a.social.soundcloud, label: 'SoundCloud', external: true }
                : undefined
            }
          />
          {a.mixes.length > 0 ? (
            <Stagger gap={0.06}>
              {a.mixes.map((m, i) => (
                <StaggerItem key={m.url} variant="up">
                  <MixRow mix={m} artist={a.name} index={i} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className={styles.empty}>Selected mixes coming soon.</p>
          )}
          {a.social.spotify && (
            <p className={styles.listenSpotify}>
              <a href={a.social.spotify} target="_blank" rel="noreferrer">
                Spotify: original productions, out on label <Arrow />
              </a>
            </p>
          )}
        </Section>
      )}

      {/* ── 5 · appearances / dates (paper) ── */}
      {(upcomingDates.length > 0 || archiveDates.length > 0) && (
        <Section surface="paper" space="lg">
          <SectionLabel
            kicker="Appearances"
            title="Next gigs."
            link={{ href: '/events', label: 'All events' }}
          />
          <div className={styles.dateLists}>
            {upcomingDates.length > 0 && (
              <div className={styles.dateList}>
                <span className={`${styles.dateListLabel} hz-mono`}>Upcoming</span>
                <div className={styles.timeline}>
                  {upcomingDates.map((e) => (
                    <Link key={e.n} href={`/events/${eventSlug(e)}`} className={styles.timelineRow}>
                      <span className={`${styles.timelineDate} hz-mono`}>{dowDate(e)}</span>
                      <span className={styles.timelineVenue}>
                        {e.venue} · {e.city}
                      </span>
                      <span
                        className={styles.timelineDot}
                        data-status={e.onSale ? 'on-sale' : 'soon'}
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {archiveDates.length > 0 && (
              <div className={styles.dateList}>
                <span className={`${styles.dateListLabel} hz-mono`}>Past</span>
                <div className={styles.timeline}>
                  {archiveDates.slice(0, 6).map((e) => (
                    <Link key={e.n} href={`/events/${eventSlug(e)}`} className={styles.timelineRow}>
                      <span className={`${styles.timelineDate} hz-mono`}>{dowDate(e)}</span>
                      <span className={styles.timelineVenue}>
                        {e.venue} · {e.city}
                      </span>
                      <span className={styles.timelineDot} data-status="archive" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── 6 · bookings (cold-blue) — deep-link pre-fill ── */}
      <Section surface="cold-blue" space="lg">
        <SectionLabel kicker="Bookings" title={`Book ${a.name.split(' ')[0]}.`} />
        <div className={styles.bookBar}>
          <Button href={`/bookings?resident=${a.slug}`} arrow>
            Request a booking
          </Button>
          {a.social.soundcloud && (
            <Button href={a.social.soundcloud} external variant="ghost" arrow>
              SoundCloud
            </Button>
          )}
          {a.social.spotify && (
            <Button href={a.social.spotify} external variant="ghost" arrow>
              Spotify
            </Button>
          )}
        </div>
        <p className={`${styles.bookMeta} hz-mono`}>Bologna · IT · worldwide</p>
      </Section>

      {/* ── 7 · next resident (ink) ── */}
      <Section surface="ink" space="md">
        <Link href={`/artists/${nextArtist.slug}`} className={styles.nextResident}>
          <span className={`${styles.nextLabel} hz-mono`}>Next resident</span>
          <span className={styles.nextName}>{nextArtist.name}.</span>
          <span className={`${styles.nextGo} hz-mono`}>View profile →</span>
        </Link>
      </Section>
    </main>
  )
}
