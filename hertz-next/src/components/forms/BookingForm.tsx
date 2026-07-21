'use client'

import { useState } from 'react'
import { RESIDENTS } from '@/content/events'
import styles from './forms.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

const RESIDENT_NAMES = Object.values(RESIDENTS)

/** Form booking (resident o format Hertz) → POST /api/booking. */
export default function BookingForm() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
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
        setMsg(data.message ?? 'Booking request received.')
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
        <p className={styles.doneTitle}>{msg}</p>
        <p className={styles.doneSub}>Thanks — we read every request and reply from Bologna.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Enquiry</span>
          <select className={styles.select} name="bookingType" defaultValue="format">
            <option value="format">Hertz format / event</option>
            <option value="resident">Book a resident</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Resident (optional)</span>
          <select className={styles.select} name="resident" defaultValue="">
            <option value="">No preference</option>
            {RESIDENT_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input className={styles.input} name="name" type="text" required minLength={2} autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input className={styles.input} name="email" type="email" required autoComplete="email" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Organisation / promoter</span>
          <input className={styles.input} name="org" type="text" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Venue / event</span>
          <input className={styles.input} name="venue" type="text" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>City</span>
          <input className={styles.input} name="city" type="text" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Date (approx.)</span>
          <input className={styles.input} name="date" type="text" placeholder="e.g. Sat, Sept 2026" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.label}>Capacity</span>
          <input className={styles.input} name="capacity" type="text" placeholder="e.g. 300" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Budget (optional)</span>
          <input className={styles.input} name="budget" type="text" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Message</span>
        <textarea
          className={styles.textarea}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          placeholder="Tell us about the night — room, dates, what you have in mind."
        />
      </label>

      <button className={styles.submit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send request ↗'}
      </button>
      {state === 'error' && (
        <p className={styles.error} role="alert">
          {msg}
        </p>
      )}
    </form>
  )
}
