'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { RESIDENTS, type ResidentSlug } from '@/content/events'
import ConsentField from './ConsentField'
import HoneypotField from './HoneypotField'
import type { Lang } from '@/lib/i18n'
import styles from './forms.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

const RESIDENT_NAMES = Object.values(RESIDENTS)

const T = {
  en: {
    okTitle: 'Thanks, your request reached the Hertz team.',
    okSub: 'We reply by email with availability and fees.',
    okReset: 'Send another request',
    what: 'What do you want to book?',
    optFormat: 'The format / event',
    optResident: 'A resident',
    which: 'Which resident',
    noPref: 'No preference',
    name: 'Name *',
    namePh: 'Full name',
    email: 'Email *',
    emailPh: 'you@email.com',
    org: 'Organization / promoter',
    orgPh: "Who's booking",
    venue: 'Venue / event',
    venuePh: 'Where it happens',
    city: 'City / country *',
    cityPh: 'e.g. Bologna, IT',
    date: 'Event date',
    capacity: 'Expected capacity',
    capacityPh: 'e.g. 400',
    budget: 'Budget',
    budgetPh: 'Helps us reply fast',
    details: 'Details *',
    detailsPh: "Tell us about the night: format, set length, line-up, the room, the direction you're after.",
    fine: 'The request goes straight to the Hertz team. No mail app, it all stays on this page. We reply by email.',
    submit: 'Send request',
    sending: 'Sending…',
    err: 'Something went wrong.',
    net: 'Network error. Try again.',
  },
  it: {
    okTitle: 'Grazie, la tua richiesta è arrivata al team Hertz.',
    okSub: 'Ti rispondiamo via email con disponibilità e cachet.',
    okReset: "Invia un'altra richiesta",
    what: 'Cosa vuoi prenotare?',
    optFormat: 'Il format / evento',
    optResident: 'Un resident',
    which: 'Quale resident',
    noPref: 'Nessuna preferenza',
    name: 'Nome *',
    namePh: 'Nome e cognome',
    email: 'Email *',
    emailPh: 'tua@email.com',
    org: 'Organizzazione / promoter',
    orgPh: 'Chi prenota',
    venue: 'Venue / evento',
    venuePh: 'Dove si svolge',
    city: 'Città / paese *',
    cityPh: 'es. Bologna, IT',
    date: "Data dell'evento",
    capacity: 'Capienza prevista',
    capacityPh: 'es. 400',
    budget: 'Budget',
    budgetPh: 'Ci aiuta a risponderti in fretta',
    details: 'Dettagli *',
    detailsPh: 'Raccontaci la serata: format, durata del set, line-up, la sala, la direzione che cerchi.',
    fine: 'La richiesta arriva direttamente al team Hertz. Nessuna app di posta, resta tutto su questa pagina. Ti rispondiamo via email.',
    submit: 'Invia richiesta',
    sending: 'Invio…',
    err: 'Qualcosa è andato storto.',
    net: 'Errore di rete. Riprova.',
  },
} as const

/**
 * Form booking (resident o format Hertz) → POST /api/booking. Bilingue EN/IT
 * via prop `lang` dal LangToggle di pagina. Deep-link: /bookings?resident=<slug>
 * pre-seleziona il resident; /bookings?type=format resta sul format.
 */
export default function BookingForm({ lang = 'en' }: { lang?: Lang }) {
  const t = T[lang]
  const params = useSearchParams()
  const slug = params.get('resident') as ResidentSlug | null
  const presetName = slug && RESIDENTS[slug] ? RESIDENTS[slug] : ''
  const typeParam = params.get('type')

  const [bookingType, setBookingType] = useState<'format' | 'resident'>(
    presetName || typeParam === 'resident' ? 'resident' : 'format',
  )
  const [resident, setResident] = useState(presetName)
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  // reagisce ai deep-link cambiati a pagina già aperta (es. click dal roster)
  useEffect(() => {
    if (presetName) {
      setBookingType('resident')
      setResident(presetName)
    } else if (typeParam === 'resident') {
      setBookingType('resident')
    } else if (typeParam === 'format') {
      setBookingType('format')
    }
  }, [presetName, typeParam])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    if (bookingType !== 'resident') delete payload.resident
    setState('sending')
    try {
      const r = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, lang }),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        setState('ok')
        form.reset()
      } else {
        setState('error')
        setMsg(t.err)
      }
    } catch {
      setState('error')
      setMsg(t.net)
    }
  }

  if (state === 'ok') {
    return (
      <div className={styles.done}>
        <p className={styles.doneTitle}>{t.okTitle}</p>
        <p className={styles.doneSub}>{t.okSub}</p>
        <button type="button" className={styles.doneReset} onClick={() => setState('idle')}>
          {t.okReset}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>{t.what}</span>
          <select
            className={styles.select}
            name="bookingType"
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value as 'format' | 'resident')}
          >
            <option value="format">{t.optFormat}</option>
            <option value="resident">{t.optResident}</option>
          </select>
        </label>
        {bookingType === 'resident' && (
          <label className={styles.field}>
            <span className={styles.label}>{t.which}</span>
            <select
              className={styles.select}
              name="resident"
              value={resident}
              onChange={(e) => setResident(e.target.value)}
            >
              <option value="">{t.noPref}</option>
              {RESIDENT_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>{t.name}</span>
          <input className={styles.input} name="name" type="text" required minLength={2} autoComplete="name" placeholder={t.namePh} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t.email}</span>
          <input className={styles.input} name="email" type="email" required autoComplete="email" placeholder={t.emailPh} />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>{t.org}</span>
          <input className={styles.input} name="org" type="text" placeholder={t.orgPh} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t.venue}</span>
          <input className={styles.input} name="venue" type="text" placeholder={t.venuePh} />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>{t.city}</span>
          <input className={styles.input} name="city" type="text" required minLength={2} placeholder={t.cityPh} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t.date}</span>
          <input className={styles.input} name="date" type="date" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>{t.capacity}</span>
          <input className={styles.input} name="capacity" type="text" placeholder={t.capacityPh} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t.budget}</span>
          <input className={styles.input} name="budget" type="text" placeholder={t.budgetPh} />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{t.details}</span>
        <textarea
          className={styles.textarea}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          placeholder={t.detailsPh}
        />
      </label>

      <p className={styles.fine}>{t.fine}</p>

      <HoneypotField />
      <ConsentField lang={lang} />

      <button
        className={styles.submit}
        type="submit"
        disabled={state === 'sending'}
        aria-describedby={state === 'error' ? 'booking-error' : undefined}
      >
        {state === 'sending' ? t.sending : t.submit}
      </button>
      {state === 'error' && (
        <p id="booking-error" className={styles.error} role="alert">
          {msg}
        </p>
      )}
    </form>
  )
}
