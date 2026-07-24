'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { RESIDENTS, type ResidentSlug } from '@/content/events'
import ConsentField from './ConsentField'
import HoneypotField from './HoneypotField'
import styles from './forms.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

const RESIDENT_NAMES = Object.values(RESIDENTS)

/**
 * Form booking (resident o format Hertz) → POST /api/booking.
 * Deep-link: /bookings?resident=<slug> pre-seleziona il resident e passa a
 * "resident"; /bookings?type=format resta sul format. Il campo resident viene
 * inviato solo quando l'enquiry è "resident" (montato condizionalmente).
 */
export default function BookingForm() {
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
        body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        setState('ok')
        setMsg(data.message ?? '')
        form.reset()
      } else {
        setState('error')
        setMsg(data.error ?? 'Qualcosa è andato storto.')
      }
    } catch {
      setState('error')
      setMsg('Errore di rete. Riprova.')
    }
  }

  if (state === 'ok') {
    return (
      <div className={styles.done}>
        <p className={styles.doneTitle}>
          Grazie, la tua richiesta è arrivata al team Hertz.
        </p>
        <p className={styles.doneSub}>
          Ti rispondiamo via email con disponibilità e cachet.
        </p>
        <button type="button" className={styles.doneReset} onClick={() => setState('idle')}>
          Invia un&rsquo;altra richiesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Cosa vuoi prenotare?</span>
          <select
            className={styles.select}
            name="bookingType"
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value as 'format' | 'resident')}
          >
            <option value="format">Il format / evento</option>
            <option value="resident">Un resident</option>
          </select>
        </label>
        {bookingType === 'resident' && (
          <label className={styles.field}>
            <span className={styles.label}>Quale resident</span>
            <select
              className={styles.select}
              name="resident"
              value={resident}
              onChange={(e) => setResident(e.target.value)}
            >
              <option value="">Nessuna preferenza</option>
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
          <span className={styles.label}>Nome *</span>
          <input className={styles.input} name="name" type="text" required minLength={2} autoComplete="name" placeholder="Nome e cognome" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email *</span>
          <input className={styles.input} name="email" type="email" required autoComplete="email" placeholder="tua@email.com" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Organizzazione / promoter</span>
          <input className={styles.input} name="org" type="text" placeholder="Chi prenota" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Venue / evento</span>
          <input className={styles.input} name="venue" type="text" placeholder="Dove si svolge" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Città / paese *</span>
          <input className={styles.input} name="city" type="text" required minLength={2} placeholder="es. Bologna, IT" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Data dell&rsquo;evento</span>
          <input className={styles.input} name="date" type="date" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Capienza prevista</span>
          <input className={styles.input} name="capacity" type="text" placeholder="es. 400" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Budget</span>
          <input className={styles.input} name="budget" type="text" placeholder="Ci aiuta a risponderti in fretta" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Dettagli *</span>
        <textarea
          className={styles.textarea}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          placeholder="Raccontaci la serata: format, durata del set, line-up, la sala, la direzione che cerchi."
        />
      </label>

      <p className={styles.fine}>
        La richiesta arriva direttamente al team Hertz. Nessuna app di posta, resta tutto su
        questa pagina. Ti rispondiamo via email.
      </p>

      <HoneypotField />
      <ConsentField />

      <button className={styles.submit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Invio…' : 'Invia richiesta'}
      </button>
      {state === 'error' && (
        <p className={styles.error} role="alert">
          {msg}
        </p>
      )}
    </form>
  )
}
