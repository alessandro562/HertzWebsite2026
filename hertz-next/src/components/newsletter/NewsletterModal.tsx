'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import HertzLogo from '@/components/ui/HertzLogo'
import styles from './NewsletterModal.module.css'

/**
 * Pop-up newsletter di benvenuto — mostrato UNA volta per visitatore (localStorage),
 * dopo un breve ritardo (lascia finire l'intro della hero). Design on-brand:
 * superficie Signal, logo Hertz ufficiale completo, registration marks editoriali,
 * type display + label mono. Iscrizione → POST /api/newsletter → salvata su Supabase.
 * Accessibile (role=dialog, focus, ESC, scroll-lock) e reduced-motion safe.
 */
const STORAGE_KEY = 'hz_newsletter_v1'
const OPEN_DELAY = 4200 // ms: lascia sfumare l'intro della hero prima di aprire

type State = 'idle' | 'sending' | 'ok' | 'error'

export default function NewsletterModal() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const reduce = useReducedMotion()
  const emailRef = useRef<HTMLInputElement>(null)

  // gate: una sola volta per visitatore, dopo un ritardo
  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(STORAGE_KEY) != null
    } catch {
      seen = false
    }
    if (seen) return
    const t = setTimeout(() => setOpen(true), OPEN_DELAY)
    return () => clearTimeout(t)
  }, [])

  const markSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* private mode / storage disabled: pazienza, si ripresenterà */
    }
  }

  const dismiss = () => {
    markSeen()
    setOpen(false)
  }

  // ESC + scroll-lock + focus sull'email quando aperto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    const f = setTimeout(() => emailRef.current?.focus(), reduce ? 0 : 380)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      clearTimeout(f)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduce])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, source: 'popup' }),
      })
      const data = await r.json()
      if (r.ok && data.ok) {
        markSeen()
        setState('ok')
      } else {
        setState('error')
        setMsg(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setState('error')
      setMsg('Network error. Please try again.')
    }
  }

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.32, ease }}
          onClick={dismiss}
          role="presentation"
        >
          <motion.div
            className={styles.card}
            data-surface="signal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nl-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: reduce ? 0 : 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* registration marks editoriali (print language del brand) */}
            <span className={`${styles.reg} ${styles.regTl}`} aria-hidden="true" />
            <span className={`${styles.reg} ${styles.regTr}`} aria-hidden="true" />
            <span className={`${styles.reg} ${styles.regBl}`} aria-hidden="true" />
            <span className={`${styles.reg} ${styles.regBr}`} aria-hidden="true" />

            <button type="button" className={styles.close} onClick={dismiss} aria-label="Close">
              ✕
            </button>

            <HertzLogo size={44} className={styles.logo} />

            {state === 'ok' ? (
              <>
                <p className={`${styles.kicker} hz-mono`}>You&rsquo;re in</p>
                <h2 id="nl-title" className={styles.title}>
                  See you on the floor.
                </h2>
                <p className={styles.body}>
                  You&rsquo;re on the list. Watch your inbox for the next Hertz night. If you&rsquo;re
                  one of the first 100, we&rsquo;ll hand you your Hertz gadget at the opening night of
                  the 26/27 season at Kindergarten.
                </p>
                <button type="button" className={styles.submit} onClick={dismiss}>
                  Done
                </button>
              </>
            ) : (
              <>
                <p className={`${styles.kicker} hz-mono`}>The newsletter</p>
                <h2 id="nl-title" className={styles.title}>
                  Join the list.
                </h2>
                <p className={styles.body}>
                  Dates, drops and stories from the floor, straight to your inbox. No noise, just the
                  signal.
                </p>

                <p className={`${styles.promo} hz-mono`}>
                  <span className={styles.promoDot} aria-hidden="true" />
                  First 100 to sign up get a Hertz gadget at the opening night of the 26/27 season at
                  Kindergarten.
                </p>

                <form className={styles.form} onSubmit={onSubmit} noValidate>
                  <label className={styles.field}>
                    <span className={`${styles.label} hz-mono`}>Your email</span>
                    <input
                      ref={emailRef}
                      className={styles.input}
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </label>

                  {/* honeypot anti-spam (nascosto agli umani) */}
                  <div aria-hidden="true" className={styles.hp}>
                    <label>
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                    </label>
                  </div>

                  <button className={styles.submit} type="submit" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Signing you up…' : 'Sign up'}
                  </button>

                  <label className={styles.consent}>
                    <input type="checkbox" name="consent" value="yes" required className={styles.check} />
                    <span>
                      I&rsquo;ve read the{' '}
                      <Link href="/privacy" target="_blank" className={styles.link}>
                        privacy notice
                      </Link>{' '}
                      and agree to receive the Hertz newsletter.
                    </span>
                  </label>

                  {state === 'error' && (
                    <p className={`${styles.error} hz-mono`} role="alert">
                      {msg}
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
