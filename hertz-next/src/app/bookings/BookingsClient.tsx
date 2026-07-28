'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import Arrow from '@/components/ui/Arrow'
import LangToggle from '@/components/ui/LangToggle'
import BookingForm from '@/components/forms/BookingForm'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import type { Lang } from '@/lib/i18n'
import styles from './bookings.module.css'

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))

const T = {
  en: {
    kicker: 'Bookings',
    title: 'Bring Hertz to your venue.',
    intro: 'Book the full Hertz format or a single resident. Based in Bologna, available anywhere.',
    twoWays: 'Two ways to book',
    pickSignal: 'Pick your signal.',
    formatKicker: 'The format',
    formatTitle: 'Book the night.',
    formatBody:
      'The full Hertz curation brought to your space: selection, residents, sound direction and identity, all built into a single night. We treat the room like an instrument, with the right system, the right timing and a floor that came to dance.',
    formatChips: ['Club', 'Festival', 'Private', 'B2B set'],
    formatCta: 'Request the format →',
    residentKicker: 'A resident',
    residentTitle: 'Book a resident.',
    residentBody:
      'One of the four Hertz residents for a guest slot in your line-up: minimal and deep tech, the kind of groove that rolls for hours. Pick a name below, or tell us the date and we find the right hands for the room.',
    residentChips: ['Guest slot', 'Deep tech', 'Anywhere'],
    residentCta: 'Pick a resident ↓',
    rosterKicker: 'The roster',
    rosterTitle: 'Book a name.',
    resident: 'Resident',
    bookResident: 'Book this resident →',
    allResidents: 'Want to know them first? → All residents',
    sendKicker: 'Send a request',
    sendTitle: 'Send the request.',
    formIntro:
      'Send us the details of your event and we get back with availability and fees. Every request goes straight to the Hertz team.',
    preferEmail: 'Prefer email?',
  },
  it: {
    kicker: 'Bookings',
    title: 'Bring Hertz to your venue.',
    intro: 'Prenota il format completo Hertz o un singolo resident. Da Bologna, disponibili ovunque.',
    twoWays: 'Two ways to book',
    pickSignal: 'Pick your signal.',
    formatKicker: 'The format',
    formatTitle: 'Book the night.',
    formatBody:
      "La curatela Hertz al completo, portata nel tuo spazio: selezione, resident, direzione sonora e identità, costruite in un'unica serata. Trattiamo la sala come uno strumento, con l'impianto giusto, il tempo giusto e una pista venuta per ballare.",
    formatChips: ['Club', 'Festival', 'Privati', 'B2B set'],
    formatCta: 'Richiedi il format →',
    residentKicker: 'A resident',
    residentTitle: 'Book a resident.',
    residentBody:
      'Uno dei quattro resident Hertz per un guest slot nella tua line-up: minimal e deep tech, il tipo di groove che gira per ore. Scegli un nome qui sotto, oppure dicci la data e troviamo le mani giuste per la sala.',
    residentChips: ['Guest slot', 'Deep tech', 'Ovunque'],
    residentCta: 'Scegli un resident ↓',
    rosterKicker: 'The roster',
    rosterTitle: 'Book a name.',
    resident: 'Resident',
    bookResident: 'Prenota questo resident →',
    allResidents: 'Vuoi conoscerli prima? → Tutti i resident',
    sendKicker: 'Send a request',
    sendTitle: 'Send the request.',
    formIntro:
      'Mandaci i dettagli del tuo evento e ti rispondiamo con disponibilità e cachet. Ogni richiesta la legge direttamente il team Hertz.',
    preferEmail: "Preferisci l'email?",
  },
} as const

/**
 * Contenuto bookings bilingue (EN default). Il LangToggle vive qui (stato locale);
 * la pagina resta un server component solo per i metadata. Titoli/kicker restano in
 * inglese in entrambe le lingue (elementi di brand), cambia la prosa.
 */
export default function BookingsClient() {
  const [lang, setLang] = useState<Lang>('en')
  const t = T[lang]

  const paths = [
    {
      n: '01',
      kicker: t.formatKicker,
      title: t.formatTitle,
      body: t.formatBody,
      chips: t.formatChips,
      cta: { label: t.formatCta, href: '/bookings?type=format#book' },
    },
    {
      n: '02',
      kicker: t.residentKicker,
      title: t.residentTitle,
      body: t.residentBody,
      chips: t.residentChips,
      cta: { label: t.residentCta, href: '#roster' },
    },
  ]

  return (
    <main id="main">
      <Section surface="signal" space="lg">
        <PageHeader
          kicker={t.kicker}
          title={t.title}
          intro={<p className="hz-mono">{t.intro}</p>}
          aside={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--hz-space-sm)' }}>
              <LangToggle value={lang} onChange={setLang} />
              <a href={`mailto:${SITE.email}`} className={`${styles.email} hz-mono`}>
                {SITE.email} <Arrow />
              </a>
            </div>
          }
        />
      </Section>

      {/* ── two ways to book (white) ── */}
      <Section surface="white" space="lg">
        <SectionLabel kicker={t.twoWays} title={t.pickSignal} />
        <div className={styles.paths}>
          {paths.map((p) => (
            <article key={p.n} className={styles.path}>
              <span className={`${styles.pathKicker} hz-mono`}>{p.kicker}</span>
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
        <SectionLabel kicker={t.rosterKicker} title={t.rosterTitle} />
        <div className={styles.roster}>
          {ROSTER.map((a) => (
            <Link key={a.slug} href={`/bookings?resident=${a.slug}#book`} className={styles.resCard}>
              <span className={`${styles.resNum} hz-mono`}>{t.resident}</span>
              <div className={styles.resPh}>
                <ImageFrame src={a.portrait} alt={a.name} ratio="4 / 5" />
              </div>
              <span className={styles.resName}>{a.name}</span>
              <span className={styles.resRole}>{a.role}</span>
              <span className={`${styles.resGo} hz-mono`}>{t.bookResident}</span>
            </Link>
          ))}
        </div>
        <Link href="/artists" className={`${styles.allResidents} hz-mono`}>
          {t.allResidents}
        </Link>
      </Section>

      {/* ── request form (white) ── */}
      <Section surface="white" space="lg" id="book">
        <SectionLabel kicker={t.sendKicker} title={t.sendTitle} />
        <div className={styles.grid}>
          <div className={styles.formCol}>
            <p className={styles.formIntro}>{t.formIntro}</p>
            <Suspense fallback={<div />}>
              <BookingForm lang={lang} />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <div className={styles.direct}>
              <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
                {t.preferEmail}
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
