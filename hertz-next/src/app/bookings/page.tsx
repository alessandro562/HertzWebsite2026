import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import Arrow from '@/components/ui/Arrow'
import BookingForm from '@/components/forms/BookingForm'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import styles from './bookings.module.css'

export const metadata: Metadata = {
  title: 'Bookings',
  description:
    'Prenota il format completo Hertz o un singolo resident: club, festival e showcase. Da Bologna, disponibili ovunque.',
  alternates: { canonical: '/bookings' },
}

const PATHS = [
  {
    n: '01',
    kicker: 'The format',
    title: 'Book the night.',
    body: "La curatela Hertz al completo, portata nel tuo spazio: selezione, resident, direzione sonora e identità, costruite come un'unica serata. Trattiamo la sala come uno strumento: l'impianto giusto, il tempo giusto, una pista venuta per ascoltare.",
    chips: ['Club', 'Festival', 'Privati', 'B2B set'],
    cta: { label: 'Richiedi il format →', href: '/bookings?type=format#book' },
  },
  {
    n: '02',
    kicker: 'A resident',
    title: 'Book a resident.',
    body: 'Uno dei quattro resident Hertz per un guest slot nella tua line-up: minimal e deep tech, il tipo di groove che gira per ore. Scegli un nome qui sotto, oppure dicci la data e troviamo le mani giuste per la sala.',
    chips: ['Guest slot', 'Deep tech', 'Ovunque'],
    cta: { label: 'Scegli un resident ↓', href: '#roster' },
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
          title="Bring Hertz to your floor."
          intro={
            <p className="hz-mono">
              Prenota il format completo Hertz o un singolo resident. Da Bologna, disponibili
              ovunque.
            </p>
          }
          aside={
            <a href={`mailto:${SITE.email}`} className={`${styles.email} hz-mono`}>
              {SITE.email} <Arrow />
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
              <span className={`${styles.resGo} hz-mono`}>Prenota questo resident →</span>
            </Link>
          ))}
        </div>
        <Link href="/artists" className={`${styles.allResidents} hz-mono`}>
          Vuoi conoscerli prima? → Tutti i resident
        </Link>
      </Section>

      {/* ── request form (white) ── */}
      <Section surface="white" space="lg" id="book">
        <SectionLabel index="C" kicker="Send a request" title="Send the request." />
        <div className={styles.grid}>
          <div className={styles.formCol}>
            <p className={styles.formIntro}>
              Mandaci i dettagli del tuo evento e ti rispondiamo con disponibilità e cachet.
              Ogni richiesta la legge direttamente il team Hertz.
            </p>
            <Suspense fallback={<div />}>
              <BookingForm />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <div className={styles.direct}>
              <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
                Preferisci l&rsquo;email?
              </span>
              <a href={`mailto:${SITE.email}`} className={styles.directMail}>
                {SITE.email} <Arrow />
              </a>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className={styles.directMail}>
                Instagram {SITE.instagramHandle} <Arrow />
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  )
}
