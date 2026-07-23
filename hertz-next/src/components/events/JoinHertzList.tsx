'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import WaveformPulse from '@/motion/WaveformPulse'
import styles from './JoinHertzList.module.css'

export interface ListEvent {
  n: string
  title: string
  date: string
  venue: string
  city: string
}

type State = 'idle' | 'sending' | 'ok' | 'error'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * JoinHertzList — sostituisce il vecchio "biglietto": Hertz lavora SOLO con le
 * liste, quindi ogni evento (non passato) ha la sua guest list. Riprende la
 * struttura del modale legacy ("HERTZ LIST" / // GUEST LIST / nome·email·phone
 * / "Join the list") aggiornata al nuovo design editoriale.
 *
 * Rende: il modulo inline (stato + azione), una barra sticky solo-mobile che
 * appare dopo che il modulo esce dalla vista, e UN solo modale condiviso dai
 * due trigger. Submit → POST /api/register (notifica il crew). Esc/backdrop
 * chiudono, scroll bloccato, focus sul nome, reduced-motion sicuro.
 */
export default function JoinHertzList({ event, soon = false }: { event: ListEvent; soon?: boolean }) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const [showBar, setShowBar] = useState(false)
  const moduleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  /* sticky bar (mobile): appare quando il modulo inline è scrollato sopra la vista */
  useEffect(() => {
    const el = moduleRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const openModal = () => {
    setState('idle')
    setMsg('')
    setOpen(true)
  }

  /* Esc + blocco scroll + focus sul nome all'apertura */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => nameRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [open, close])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      const r = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          n: event.n,
          title: event.title,
          date: event.date,
          venue: event.venue,
          city: event.city,
        }),
      })
      const j = await r.json()
      if (r.ok && j.ok) {
        setState('ok')
        setMsg(j.message ?? 'Sei sulla lista.')
      } else {
        setState('error')
        setMsg(j.error ?? 'Qualcosa è andato storto.')
      }
    } catch {
      setState('error')
      setMsg('Errore di rete. Riprova.')
    }
  }

  const meta = [event.date, event.venue, event.city].filter(Boolean).join(' · ')

  return (
    <>
      {/* ── modulo inline ── */}
      <div className={styles.module} ref={moduleRef} data-soon={soon || undefined}>
        <div className={styles.header}>
          <span className={`${styles.status} hz-mono`}>
            <span className={styles.glyph} aria-hidden="true">
              {soon ? '○' : '●'}
            </span>
            {soon ? 'Lista in apertura' : 'Guest list aperta'}
          </span>
          <WaveformPulse state={soon ? 'loading' : 'active'} className={styles.wave} label="Hertz list" />
        </div>
        <p className={styles.note}>
          {soon
            ? 'La line-up arriva più vicino alla data. Intanto blocca il tuo posto sulla lista Hertz.'
            : 'Hertz funziona solo su lista. Aggiungi il tuo nome, confermiamo via email.'}
        </p>
        <div className={styles.action}>
          <button type="button" className={styles.cta} onClick={openModal}>
            Entra nella lista Hertz →
          </button>
        </div>
      </div>

      {/* ── barra sticky (solo mobile) ── */}
      <div className={styles.bar} data-show={showBar}>
        <button
          type="button"
          className={styles.barBtn}
          onClick={openModal}
          tabIndex={showBar ? 0 : -1}
          aria-hidden={!showBar}
        >
          Entra nella lista Hertz →
        </button>
      </div>

      {/* ── modale ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Entra nella lista Hertz"
          >
            <motion.div
              className={styles.card}
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            >
              <button type="button" className={styles.x} onClick={close} aria-label="Chiudi">
                ✕
              </button>

              <div className={styles.stub}>
                <span className="hz-mono">HERTZ LIST</span>
              </div>

              <div className={styles.body}>
                <p className={`${styles.kick} hz-mono`}>
                  <span className={styles.kickLine} aria-hidden="true" />
                  Guest list
                </p>
                <p className={styles.evTitle}>{event.title}</p>
                {meta && <p className={`${styles.evMeta} hz-mono`}>{meta}</p>}

                {state === 'ok' ? (
                  <div className={styles.done}>
                    <span className={styles.doneDot} aria-hidden="true" />
                    <b className={styles.doneTitle}>{msg}</b>
                    <span className={`${styles.doneEv} hz-mono`}>
                      {event.title}
                      {event.date ? ` · ${event.date}` : ''}
                    </span>
                    <p className={styles.doneSub}>Porta un documento. Confermiamo via email.</p>
                    <button type="button" className={styles.submit} onClick={close}>
                      Fatto
                    </button>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={onSubmit} noValidate>
                    <label className={styles.field}>
                      <span className={styles.label}>Nome e cognome</span>
                      <input
                        ref={nameRef}
                        className={styles.input}
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder="Nome e cognome"
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>Email</span>
                      <input
                        className={styles.input}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="tua@email.com"
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>
                        Telefono <i>facoltativo</i>
                      </span>
                      <input
                        className={styles.input}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+39 …"
                      />
                    </label>
                    <button className={styles.submit} type="submit" disabled={state === 'sending'}>
                      {state === 'sending' ? 'Invio…' : 'Entra in lista →'}
                    </button>
                    <p className={styles.fine}>Un nome a persona · ricevi conferma via email.</p>
                    {state === 'error' && (
                      <p className={styles.error} role="alert">
                        {msg}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
