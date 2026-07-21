import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import EventRow from '@/components/events/EventRow'
import MixRow from '@/components/music/MixRow'
import ViewMorph from '@/motion/ViewMorph'
import Parallax from '@/motion/Parallax'
import { Stagger, StaggerItem } from '@/motion/Reveal'
import { ARTISTS } from '@/content/artists'
import { forResident, type ResidentSlug } from '@/content/events'
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
    description: `${a.name} — ${a.role}. ${a.bio[0] ?? ''}`.trim(),
    alternates: { canonical: `/artists/${slug}` },
    openGraph: { images: [{ url: a.portrait }] },
  }
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = ARTISTS[slug as ResidentSlug]
  if (!a) notFound()

  const events = forResident(a.slug)
  const socials = [
    a.social.soundcloud && { label: 'SoundCloud', href: a.social.soundcloud },
    a.social.spotify && { label: 'Spotify', href: a.social.spotify },
    a.social.instagram && { label: 'Instagram', href: a.social.instagram },
  ].filter((s): s is { label: string; href: string } => Boolean(s))

  return (
    <main id="main">
      {/* ── identity (cold-blue) ── */}
      <Section surface="cold-blue" space="md">
        <p className={`${styles.crumb} hz-mono`}>
          <Link href="/artists">Artists</Link>
          <span aria-hidden="true"> / </span>
          <span>{a.n}</span>
        </p>

        <div className={styles.hero} data-alt={Number(a.n) % 2}>
          <span className={styles.freqMark} aria-hidden="true">
            {a.freq}
          </span>
          <div className={styles.identity}>
            <span className={`${styles.freq} hz-mono`}>{a.freq}</span>
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
              <Button href="/bookings" variant="solid" arrow>
                Booking
              </Button>
            </div>
          </div>
          <Parallax speed={38} className={styles.portrait}>
            <ViewMorph name={`artist-portrait-${a.slug}`}>
              <ImageFrame src={a.portrait} alt={a.name} ratio="4 / 5" priority />
            </ViewMorph>
          </Parallax>
        </div>
      </Section>

      {/* ── bio (white) ── */}
      <Section surface="white" space="lg">
        <div className={styles.bioGrid}>
          <SectionLabel kicker="Profile" />
          <div className={styles.bio}>
            {a.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* ── mixes (paper) ── */}
      <Section surface="paper" space="lg">
        <SectionLabel
          kicker="Selected mixes"
          title="On record."
          link={a.social.soundcloud ? { href: a.social.soundcloud, label: 'SoundCloud ↗', external: true } : undefined}
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
          <p className={styles.empty}>Mixes coming soon.</p>
        )}
      </Section>

      {/* ── live gallery (white) ── */}
      {a.gallery.length > 0 && (
        <Section surface="white" space="lg">
          <SectionLabel kicker="Live" title="On the floor." />
          <Stagger className={styles.gallery} gap={0.08}>
            {a.gallery.map((src, i) => (
              <StaggerItem key={src} variant="up">
                <ImageFrame src={src} alt={`${a.name} live — ${i + 1}`} ratio="3 / 2" />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {/* ── events (signal) ── */}
      {events.length > 0 && (
        <Section surface="signal" space="lg">
          <SectionLabel
            kicker="On the bill"
            title="Dates with the family."
            link={{ href: '/events', label: 'All events ↗' }}
          />
          <div>
            {events.slice(0, 6).map((e) => (
              <EventRow key={e.n} event={e} />
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}
