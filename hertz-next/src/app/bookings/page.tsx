import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import BookingForm from '@/components/forms/BookingForm'
import { SITE } from '@/lib/site'
import styles from './bookings.module.css'

export const metadata: Metadata = {
  title: 'Booking & contact',
  description:
    'Porta Hertz nel tuo spazio: booking dei resident, collaborazioni evento, press & partnership. Rispondiamo da Bologna.',
  alternates: { canonical: '/bookings' },
}

const WHAT = [
  { t: 'Artist booking', d: 'A resident or a back-to-back for your room or festival.' },
  { t: 'Event collaboration', d: 'A Hertz night or takeover, built with your venue.' },
  { t: 'Press & partnerships', d: 'Editorial, media and brand collaborations.' },
]

export default function BookingsPage() {
  return (
    <main id="main">
      <Section surface="signal" space="lg">
        <PageHeader
          index="09"
          kicker="Booking & contact"
          title="Bring Hertz into your space."
          intro={
            <p>
              Residents, back-to-backs and full Hertz nights — for clubs, festivals and showcases.
              Tell us about the room and the date; we read every request and reply from Bologna.
            </p>
          }
          aside={
            <a href={`mailto:${SITE.email}`} className={`${styles.email} hz-mono`}>
              {SITE.email} ↗
            </a>
          }
        />
      </Section>

      <Section surface="white" space="lg">
        <div className={styles.grid}>
          <div className={styles.formCol}>
            <BookingForm />
          </div>
          <aside className={styles.aside}>
            <h2 className={styles.asideTitle}>What we take on.</h2>
            <ul className={styles.what}>
              {WHAT.map((w) => (
                <li key={w.t}>
                  <span className={styles.whatT}>{w.t}</span>
                  <span className={styles.whatD}>{w.d}</span>
                </li>
              ))}
            </ul>
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
