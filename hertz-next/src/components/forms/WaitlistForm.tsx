'use client'

import { useState } from 'react'
import styles from './forms.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

/** Iscrizione waitlist drop futuri → POST /api/waitlist. Riga inline. */
export default function WaitlistForm() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        setState('ok')
        setMsg(data.message ?? "You're on the list.")
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
      <p className="hz-mono" style={{ color: 'var(--hz-accent)' }}>
        {msg}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className={styles.mini} noValidate>
      <label className={`${styles.field} ${styles.miniField}`}>
        <span className={styles.label}>Get notified about the next drop</span>
        <input className={styles.input} name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
      </label>
      <button className={styles.submit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '…' : 'Notify me'}
      </button>
      {state === 'error' && (
        <p className={styles.error} role="alert" style={{ flexBasis: '100%' }}>
          {msg}
        </p>
      )}
    </form>
  )
}
