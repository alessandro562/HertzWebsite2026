'use client'

import { useState } from 'react'
import ConsentField from './ConsentField'
import HoneypotField from './HoneypotField'
import styles from './forms.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

/** Form prenotazione Drop 01 → POST /api/reserve. Nessun autoplay/motion. */
export default function ReserveForm({ item = 'Lanyard · Drop 01' }: { item?: string }) {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      const r = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        setState('ok')
        setMsg(data.message ?? 'Reservation received.')
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
        <p className={styles.doneSub}>We&rsquo;ll confirm by email. Numbered 001–200, ships from Bologna.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <input type="hidden" name="item" value={item} />
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
      <label className={styles.field} style={{ maxWidth: '9rem' }}>
        <span className={styles.label}>Quantity</span>
        <input className={styles.input} name="quantity" type="number" min={1} max={10} defaultValue={1} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Note (optional)</span>
        <textarea className={styles.textarea} name="note" maxLength={600} placeholder="Anything we should know?" />
      </label>
      <HoneypotField />
      <ConsentField />
      <button className={styles.submit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Reserve'}
      </button>
      {state === 'error' && (
        <p className={styles.error} role="alert">
          {msg}
        </p>
      )}
    </form>
  )
}
