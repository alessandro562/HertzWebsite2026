import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import BookingForm from '@/components/forms/BookingForm'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import styles from './bookings.module.css'

export const metadata: Metadata = {
  title: 'Bookings',
  description:
    'Book the full Hertz format or a single resident — clubs, festivals and showcases. Based in Bologna, available worldwide.',
  alternates: { canonical: '/bookings' },
}

const PATHS = [
  {
    n: '01',
    kicker: 'The format',
    title: 'Book the night.',
    body: 'The full Hertz curation, dropped into your room — selection, residents, sound direction and identity, built as one night. We treat the space as an instrument: the right system, the right tempo, a floor that came to listen.',
    chips: ['Clubs', 'Festivals', 'Private', 'B2B sets'],
    cta: { label: 'Request the format →', href: '/bookings?type=format#book' },
  },
  {
    n: '02',
    kicker: 'A resident',
    title: 'Book a resident.',
    body: "One of the four Hertz residents for a guest slot on your line-up — minimal & deep-tech, the kind of groove that rolls for hours. Pick a name below, or tell us the date and we'll match the right hands to the room.",
    chips: ['Guest slot', 'Deep tech', 'Worldwide'],
    cta: { label: 'Pick a resident ↓', href: '#roster' },
  },
]

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

export default function BookingsPage() {
  return (
    <main id="main">
      <Section surface="signal" space="lg">
        <PageHeader
          index="09"
          kicker="Bookings"
          title="Bring Hertz to your room."
          intro={
            <p className="hz-mono">
              Book the full Hertz format or a single resident — based in Bologna, available
              worldwide.
            </p>
          }
          aside={
            <a href={`mailto:${SITE.email}`} className={`${styles.email} hz-mono`}>
              {SITE.email} ↗
            </a>
          }
        />
      </Section>

      {/* ── two ways to book (white) ── */}
      <Section surface="white" space="lg">
        <SectionLabel index="A" kicker="Two ways to book" title="Pick your signal." />
        <div className={styles.paths}>
          {PATHS.map((p) => (
            <article key={p.n} className={styles.path}>
              <span className={styles.pathNum} aria-hidden="true">
                {p.n}
              </span>
              <span className={`${styles.pathKicker} hz-mono`}>
                {p.n} · {p.kicker}
              </span>
              <h3 className={styles.pathTitle}>{p.title}</h3>
              <p className={styles.pathBody}>{p.body}</p>
              <div className={styles.chips}>
                {p.chips.map((c) => (
                  <span key={c} className={`${styles.chip} hz-mono`}>
                    {c}
                  </span>
                ))}
              </div>
              <Link href={p.cta.href} className={styles.pathCta}>
                {p.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* ── roster (cold-blue) ── */}
      <Section surface="cold-blue" space="lg" id="roster">
        <SectionLabel index="B" kicker="The roster" title="Book a name." />
        <div className={styles.roster}>
          {ROSTER.map((a) => (
            <Link key={a.slug} href={`/bookings?resident=${a.slug}#book`} className={styles.resCard}>
              <span className={`${styles.resNum} hz-mono`}>{a.n} · Resident</span>
              <div className={styles.resPh}>
                <ImageFrame src={a.portrait} alt={a.name} ratio="4 / 5" />
              </div>
              <span className={styles.resName}>{a.name}</span>
              <span className={styles.resRole}>{a.role}</span>
              <span className={`${styles.resGo} hz-mono`}>Book this resident →</span>
            </Link>
          ))}
        </div>
        <Link href="/artists" className={`${styles.allResidents} hz-mono`}>
          Want to know them first? → All residents
        </Link>
      </Section>

      {/* ── request form (white) ── */}
      <Section surface="white" space="lg" id="book">
        <SectionLabel index="C" kicker="Send a request" title="Make a booking request." />
        <div className={styles.grid}>
          <div className={styles.formCol}>
            <p className={styles.formIntro}>
              Send us the details of your event and we&rsquo;ll come back with availability and a
              fee. Every request is read directly by the Hertz team.
            </p>
            <Suspense fallback={<div />}>
              <BookingForm />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <div className={styles.direct}>
              <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
                Prefer email?
              </span>
              <a href={`mailto:${SITE.email}`} className={styles.directMail}>
                {SITE.email} ↗
              </a>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className={styles.directMail}>
                Instagram {SITE.instagramHandle} ↗
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  )
}
