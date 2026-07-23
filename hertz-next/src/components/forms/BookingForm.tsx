'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { RESIDENTS, type ResidentSlug } from '@/content/events'
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
        setMsg(data.error ?? 'Something went wrong.')
      }
    } catch {
      setState('error')
      setMsg('Network error. Please try again.')
    }
  }

  if (state === 'ok') {
    return (
      <div className={styles.done}>
        <p className={styles.doneTitle}>
          Thanks, your booking request is with the Hertz team.
        </p>
        <p className={styles.doneSub}>
          We&rsquo;ll get back to you by email with availability and a fee.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>What are you booking?</span>
          <select
            className={styles.select}
            name="bookingType"
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value as 'format' | 'resident')}
          >
            <option value="format">The format / event</option>
            <option value="resident">A resident</option>
          </select>
        </label>
        {bookingType === 'resident' && (
          <label className={styles.field}>
            <span className={styles.label}>Which resident</span>
            <select
              className={styles.select}
              name="resident"
              value={resident}
              onChange={(e) => setResident(e.target.value)}
            >
              <option value="">No preference</option>
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
          <span className={styles.label}>Your name *</span>
          <input className={styles.input} name="name" type="text" required minLength={2} autoComplete="name" placeholder="Name + surname" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email *</span>
          <input className={styles.input} name="email" type="email" required autoComplete="email" placeholder="your@email.cc" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Organisation / promoter</span>
          <input className={styles.input} name="org" type="text" placeholder="Who's booking" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Venue / event</span>
          <input className={styles.input} name="venue" type="text" placeholder="Where it happens" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>City / country *</span>
          <input className={styles.input} name="city" type="text" required minLength={2} placeholder="e.g. Bologna, IT" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Event date</span>
          <input className={styles.input} name="date" type="date" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Expected capacity</span>
          <input className={styles.input} name="capacity" type="text" placeholder="e.g. 400" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Budget range</span>
          <input className={styles.input} name="budget" type="text" placeholder="Helps us answer fast" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Details *</span>
        <textarea
          className={styles.textarea}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          placeholder="Tell us about the night: format, set length, line-up, the room, the direction you're after."
        />
      </label>

      <p className={styles.fine}>
        The request is sent directly to the Hertz team. No email app, everything stays on this
        page. We reply by email.
      </p>

      <button className={styles.submit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send request'}
      </button>
      {state === 'error' && (
        <p className={styles.error} role="alert">
          {msg}
        </p>
      )}
    </form>
  )
}
