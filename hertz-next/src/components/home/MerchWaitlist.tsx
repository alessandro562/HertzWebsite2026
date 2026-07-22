'use client'

import { useState } from 'react'
import styles from './MerchWaitlist.module.css'

type State = 'idle' | 'sending' | 'ok' | 'error'

/** Waitlist email del drop merch (home Shop) → POST /api/waitlist. */
export default function MerchWaitlist() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setState('sending')
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        setState('ok')
      } else {
        setState('error')
        setMsg(data.error ?? 'Something went wrong.')
      }
    } catch {
      setState('error')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <div className={styles.wrap}>
      <span className={`${styles.kicker} hz-mono`}>Drop 01 · Coming soon</span>
      <h3 className={styles.title}>
        Wear the <em>frequency.</em>
      </h3>
      <p className={styles.body}>
        A capsule built for the dancefloor. Limited numbered runs, no compromise. Coming soon, leave
        your address to know first.
      </p>
      {state === 'ok' ? (
        <p className={`${styles.done} hz-mono`}>● On the list, see you on the dancefloor.</p>
      ) : (
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            className={styles.input}
            name="email"
            type="email"
            required
            placeholder="your@email.cc"
            aria-label="Email for the drop waitlist"
          />
          <button className={styles.btn} type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? '…' : 'Notify me →'}
          </button>
        </form>
      )}
      {state === 'error' && <p className={`${styles.err} hz-mono`}>{msg}</p>}
    </div>
  )
}
