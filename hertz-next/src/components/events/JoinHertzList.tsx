'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import WaveformPulse from '@/motion/WaveformPulse'
import LangToggle from '@/components/ui/LangToggle'
import ConsentField from '@/components/forms/ConsentField'
import HoneypotField from '@/components/forms/HoneypotField'
import type { Lang } from '@/lib/i18n'
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

/** PR di riferimento selezionabili in fase di registrazione (guest list). */
const PR_OPTIONS = ['Giacomo Toscani', 'Lorenzo Camiti', 'Andrea Tedeschi', 'Nicola Armanini'] as const

const T = {
  en: {
    open: 'Guest list open',
    soon: 'List opening soon',
    noteOpen: 'Hertz runs on the list only. Add your name, we confirm by email.',
    noteSoon: 'Line-up lands closer to the date. Lock your spot on the Hertz list now.',
    noteSoonReady: 'Line-up confirmed. Lock your spot on the Hertz list before it fills up.',
    cta: 'Join the Hertz list',
    guestList: 'Guest list',
    name: 'Full name',
    namePh: 'Full name',
    email: 'Email',
    emailPh: 'you@email.com',
    phone: 'Phone',
    optional: 'optional',
    pr: 'Guest-list PR',
    prPlaceholder: 'Select a PR',
    prNone: 'No PR',
    submit: 'Join the list',
    sending: 'Sending',
    fine: 'One name per person. You get a confirmation by email.',
    okTitle: "You're on the list.",
    okSub: 'Bring an ID. We confirm by email.',
    done: 'Done',
    errGeneric: 'Something went wrong.',
    errNet: 'Network error. Try again.',
    close: 'Close',
    aria: 'Join the Hertz list',
  },
  it: {
    open: 'Guest list aperta',
    soon: 'Lista in apertura',
    noteOpen: 'Hertz funziona solo su lista. Aggiungi il tuo nome, confermiamo via email.',
    noteSoon: 'La line-up arriva più vicino alla data. Intanto blocca il tuo posto sulla lista Hertz.',
    noteSoonReady: 'Line-up confermata. Blocca il tuo posto sulla lista Hertz prima che si riempia.',
    cta: 'Entra nella lista Hertz',
    guestList: 'Guest list',
    name: 'Nome e cognome',
    namePh: 'Nome e cognome',
    email: 'Email',
    emailPh: 'tua@email.com',
    phone: 'Telefono',
    optional: 'facoltativo',
    pr: 'PR di riferimento',
    prPlaceholder: 'Seleziona un PR',
    prNone: 'Nessun PR',
    submit: 'Entra in lista',
    sending: 'Invio',
    fine: 'Un nome a persona. Ricevi conferma via email.',
    okTitle: 'Sei sulla lista.',
    okSub: 'Porta un documento. Confermiamo via email.',
    done: 'Fatto',
    errGeneric: 'Qualcosa è andato storto.',
    errNet: 'Errore di rete. Riprova.',
    close: 'Chiudi',
    aria: 'Entra nella lista Hertz',
  },
} as const

/**
 * JoinHertzList — guest list per ogni evento (non passato). Hertz lavora solo
 * con le liste. Bilingue EN/IT (default EN) tramite LangToggle locale, con
 * campo "PR di riferimento" obbligatorio. Submit → POST /api/register.
 */
export default function JoinHertzList({
  event,
  soon = false,
  lineupReady = false,
}: {
  event: ListEvent
  soon?: boolean
  /** true quando la line-up è già annunciata: il copy non promette più "arriva vicino alla data" */
  lineupReady?: boolean
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [open, setOpen] = useState(false)
  /* La modale va montata in <body> (vedi il portal in fondo), ma createPortal
     ha bisogno del document: in SSR non esiste. Monta al primo effetto. */
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const [showBar, setShowBar] = useState(false)
  const moduleRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()
  const t = T[lang]

  useEffect(() => setMounted(true), [])

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

  /* Esc + blocco scroll + focus sul nome all'apertura + Tab confinato nella
     scheda (senza, il tab usciva dalla modale e girava per la pagina sotto,
     che è comunque inerte) + ritorno del focus al pulsante alla chiusura */
  useEffect(() => {
    if (!open) return
    const restore = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(
        cardRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (active && !items.includes(active)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => nameRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(timer)
      restore?.focus?.()
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
          lang,
        }),
      })
      const j = await r.json()
      if (r.ok && j.ok) {
        setState('ok')
      } else {
        setState('error')
        setMsg(t.errGeneric)
      }
    } catch {
      setState('error')
      setMsg(t.errNet)
    }
  }

  const meta = [event.date, event.venue, event.city].filter(Boolean).join(' · ')

  return (
    <>
      {/* ── modulo inline ── */}
      {/* lang segue il LangToggle: senza, uno screen reader legge l'italiano
          con voce inglese (la pagina è <html lang="en">). */}
      <div className={styles.module} ref={moduleRef} data-soon={soon || undefined} lang={lang}>
        <div className={styles.header}>
          <span className={`${styles.status} hz-mono`}>
            <span className={styles.glyph} aria-hidden="true">
              {soon ? '○' : '●'}
            </span>
            {soon ? t.soon : t.open}
          </span>
          <div className={styles.headRight}>
            <WaveformPulse state={soon ? 'loading' : 'active'} className={styles.wave} label="Hertz list" />
            <LangToggle value={lang} onChange={setLang} />
          </div>
        </div>
        <p className={styles.note}>{soon ? (lineupReady ? t.noteSoonReady : t.noteSoon) : t.noteOpen}</p>
        <div className={styles.action}>
          <button type="button" className={styles.cta} onClick={openModal}>
            {t.cta} →
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
          {t.cta} →
        </button>
      </div>

      {/* ── modale ──
          Montata in <body>, non qui dove vive il componente. Il contenitore
          della pagina evento porta un `view-transition-name` (il morph
          calendario→evento) e quello crea un contesto di impilamento: lasciata
          in loco, la modale restava intrappolata lì dentro e la nav — che ha uno
          z-index molto più basso — le finiva sopra. Nessun z-index può
          rimediarci dall'interno, l'unica soluzione è uscire dal contesto. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
          <motion.div
            className={styles.overlay}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={t.aria}
            lang={lang}
          >
            <motion.div
              ref={cardRef}
              className={styles.card}
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            >
              <button type="button" className={styles.x} onClick={close} aria-label={t.close}>
                ✕
              </button>

              <div className={styles.stub}>
                <span className="hz-mono">HERTZ LIST</span>
                <LangToggle value={lang} onChange={setLang} />
              </div>

              <div className={styles.body}>
                <p className={`${styles.kick} hz-mono`}>
                  <span className={styles.kickLine} aria-hidden="true" />
                  {t.guestList}
                </p>
                <p className={styles.evTitle}>{event.title}</p>
                {meta && <p className={`${styles.evMeta} hz-mono`}>{meta}</p>}

                {state === 'ok' ? (
                  <div className={styles.done}>
                    <span className={styles.doneDot} aria-hidden="true" />
                    <b className={styles.doneTitle}>{t.okTitle}</b>
                    <span className={`${styles.doneEv} hz-mono`}>
                      {event.title}
                      {event.date ? ` · ${event.date}` : ''}
                    </span>
                    <p className={styles.doneSub}>{t.okSub}</p>
                    <button type="button" className={styles.submit} onClick={close}>
                      {t.done}
                    </button>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={onSubmit}>
                    <label className={styles.field}>
                      <span className={styles.label}>{t.name}</span>
                      <input
                        ref={nameRef}
                        className={styles.input}
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder={t.namePh}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>{t.email}</span>
                      <input
                        className={styles.input}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={t.emailPh}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>
                        {t.phone} <i>{t.optional}</i>
                      </span>
                      <input
                        className={styles.input}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+39 …"
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>{t.pr}</span>
                      <select className={styles.select} name="pr" required defaultValue="">
                        <option value="" disabled>
                          {t.prPlaceholder}
                        </option>
                        {PR_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                        <option value="none">{t.prNone}</option>
                      </select>
                    </label>
                    <HoneypotField />
                    <ConsentField lang={lang} />
                    <button
        className={styles.submit}
        type="submit"
        disabled={state === 'sending'}
        aria-describedby={state === 'error' ? 'join-error' : undefined}
      >
                      {state === 'sending' ? `${t.sending}…` : `${t.submit} →`}
                    </button>
                    <p className={styles.fine}>{t.fine}</p>
                    {state === 'error' && (
                      <p id="join-error" className={styles.error} role="alert">
                        {msg}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
