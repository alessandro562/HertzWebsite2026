'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Button from '@/components/ui/Button'
import HeroSignalGrid from '../HeroSignalGrid'
import type { NextEvent } from '../HomeHero'
import hero from '../HomeHero.module.css'
import s from './HeroIntroSequence.module.css'

/** Fotografie reali (pulite dal watermark), monocromia + retino PRE-BAKED
   (nessun filtro/mix-blend a runtime → leggero e fluido su device reali). */
const FRAGS = [
  { id: 'human', src: '/assets/ident-human-ht.jpg', x: 4, y: 10, w: 40, h: 80, cut: 0.5, t: 0.30 },
  { id: 'crowd', src: '/assets/ident-crowd-ht.jpg', x: 40, y: 4, w: 34, h: 62, cut: 0.74, t: 0.46 },
  { id: 'dj', src: '/assets/ident-dj-ht.jpg', x: 66, y: 26, w: 32, h: 64, cut: 0.375, t: 0.62 },
] as const

/**
 * HeroIntroSequence — B2 "Print Interruption" come PRIMO STATO della hero.
 * La sequenza non è un intro separato: si trasforma direttamente nella hero.
 * Continuità: il frammento DJ diventa la foto principale; la linea di frequenza
 * diventa la waveform runtime; il logo si ritrae verso l'angolo; headline /
 * prossimo evento / CTA entrano dallo spazio liberato; superficie Signal continua.
 * Reduced-motion e visite successive → stato finale diretto. Mai bloccante.
 */
export default function HeroIntroSequence({ next, staticGrid = false }: { next?: NextEvent; staticGrid?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const djFrag = useRef<HTMLDivElement>(null)
  const photoFig = useRef<HTMLElement>(null)
  const [done, setDone] = useState(false)
  const ticketsHref = next ? `/events/${next.slug}` : '/events'

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      // l'intro dura ~3s: niente lag-smoothing (timeline a wall-clock, coerente
      // anche sotto carico di compositing) e nessun fast-forward al ritorno tab.
      gsap.ticker.lagSmoothing(0)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hz_intro') === '1'

      // stato finale: hero a riposo (reduced-motion o visita successiva)
      const settle = () => {
        gsap.set(q(`.${s.print}`), { autoAlpha: 0 })
        gsap.set(q(`.${s.logo}`), { autoAlpha: 0 })
        gsap.set(q(`.${s.freqLine}`), { autoAlpha: 0 })
        gsap.set([q(`.${s.contentReveal}`), q(`.${s.photoReveal}`), q(`.${s.wave}`), q(`.${s.grid}`)], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          clearProps: 'clipPath',
        })
        setDone(true)
      }
      if (reduce || seen) {
        settle()
        return
      }

      // misura la posizione finale della foto → il frammento DJ ci atterra
      const rootRect = root.current!.getBoundingClientRect()
      const pr = photoFig.current!.getBoundingClientRect()
      const dr = djFrag.current!.getBoundingClientRect()
      const target = {
        x: pr.left - dr.left,
        y: pr.top - dr.top,
        sx: pr.width / dr.width,
        sy: pr.height / dr.height,
      }

      gsap.set(q(`.${s.grid}`), { autoAlpha: 0 })
      gsap.set(q(`.${s.hair}`), { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(q(`.${s.frag}`), { autoAlpha: 0 })
      gsap.set(q(`.${s.band}`), { autoAlpha: 0, scaleX: 0.4, transformOrigin: 'left center' })
      gsap.set(q(`.${s.freqLine}`), { scaleX: 0, transformOrigin: 'left center', autoAlpha: 1 })
      gsap.set(q(`.${s.logo}`), { autoAlpha: 0, scale: 1.04, transformOrigin: 'left center' })
      gsap.set([q(`.${s.contentReveal}`), q(`.${s.wave}`)], { autoAlpha: 0 })
      gsap.set(q(`.${s.contentReveal}`), { y: 26 })
      gsap.set(q(`.${s.photoReveal}`), { autoAlpha: 0 })

      const done1 = () => {
        try {
          sessionStorage.setItem('hz_intro', '1')
        } catch {}
        setDone(true)
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: done1 })

      // 0.00–0.30 · tensione
      tl.to(q(`.${s.hair}`), { scaleX: 1, duration: 0.3 }, 0)
      // 0.30–1.15 · i frammenti entrano come manifesto unico
      FRAGS.forEach((f) => {
        tl.fromTo(
          q(`.${s.frag}[data-id="${f.id}"]`),
          { autoAlpha: 0, xPercent: f.id === 'human' ? -14 : f.id === 'dj' ? 16 : 0, yPercent: f.id === 'crowd' ? -18 : 0, scale: 1.06 },
          { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.42 },
          f.t,
        )
      })
      tl.to(q(`.${s.band}`), { autoAlpha: 1, scaleX: 1, duration: 0.4, stagger: 0.1 }, 0.6)
      tl.to(q(`.${s.hair}`), { autoAlpha: 0, duration: 0.3 }, 0.7)

      // 1.15–1.55 · densità massima (micro assestamento)
      tl.to(q(`.${s.frag}`), { scale: '-=0.01', duration: 0.3 }, 1.15)

      // 1.55–1.78 · la frequenza attraversa
      tl.to(q(`.${s.freqLine}`), { scaleX: 1, duration: 0.23, ease: 'power2.in' }, 1.55)

      // 1.78–2.02 · RUPTURE (~220ms): shear + frammenti in direzioni opposte
      tl.to(q(`.${s.top}`), { xPercent: -6, duration: 0.11, ease: 'power4.out' }, 1.8)
      tl.to(q(`.${s.bot}`), { xPercent: 8, duration: 0.11, ease: 'power4.out' }, 1.8)
      tl.to(q(`.${s.frag}[data-id="human"]`), { xPercent: -5, duration: 0.12 }, 1.82)
      tl.to(q(`.${s.frag}[data-id="crowd"]`), { xPercent: 6, duration: 0.12 }, 1.82)

      // 2.02–2.42 · compressione verso l'asse + cancellazione (human/crowd) ;
      // il frammento DJ atterra sulla foto della hero
      tl.to(
        [q(`.${s.frag}[data-id="human"]`), q(`.${s.frag}[data-id="crowd"]`), q(`.${s.band}`)],
        { xPercent: '+=120', scaleX: 0.05, autoAlpha: 0, transformOrigin: 'right center', duration: 0.38, ease: 'power3.in', stagger: 0.03 },
        2.02,
      )
      tl.to(q(`.${s.top}, .${s.bot}`), { xPercent: 0, duration: 0.2 }, 2.02)
      tl.to(
        q(`.${s.frag}[data-id="dj"]`),
        { x: target.x, y: target.y, scaleX: target.sx, scaleY: target.sy, transformOrigin: 'top left', duration: 0.42, ease: 'power2.inOut' },
        2.0,
      )
      // la foto reale della hero si rivela nello stesso punto (stessa immagine → continuo)
      tl.to(q(`.${s.photoReveal}`), { autoAlpha: 1, duration: 0.25 }, 2.34)
      tl.to(q(`.${s.frag}[data-id="dj"]`), { autoAlpha: 0, duration: 0.2 }, 2.42)
      tl.to(q(`.${s.freqLine}`), { autoAlpha: 0, duration: 0.2 }, 2.42)

      // 2.40–2.72 · lock-up logo grande nello spazio liberato, poi si ritrae
      tl.set(q(`.${s.logo}`), { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, 2.4)
      tl.to(q(`.${s.logo}`), { clipPath: 'inset(0 0% 0 0)', duration: 0.26 }, 2.4)
      tl.to(q(`.${s.logo}`), { x: -18, y: -140, scale: 0.2, autoAlpha: 0, transformOrigin: 'left center', duration: 0.42, ease: 'power2.inOut' }, 2.74)

      // 2.60–3.10 · headline / evento / CTA entrano dallo spazio liberato + grid + waveform runtime
      tl.to(q(`.${s.grid}`), { autoAlpha: 1, duration: 0.5 }, 2.6)
      tl.to(q(`.${s.contentReveal}`), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 2.62)
      tl.to(q(`.${s.wave}`), { autoAlpha: 1, duration: 0.5 }, 2.7)

      // hook di validazione: ?seek mette in pausa la timeline per screenshot per-fase
      if (new URLSearchParams(window.location.search).has('seek')) {
        tl.pause(0)
        ;(window as unknown as { __tl?: gsap.core.Timeline }).__tl = tl
      }

      // skip implicito: qualsiasi interazione porta subito allo stato finale
      const skip = () => {
        if (tl.progress() > 0.02 && tl.progress() < 1) {
          tl.progress(1)
        }
      }
      window.addEventListener('wheel', skip, { passive: true, once: true })
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      return () => {
        window.removeEventListener('wheel', skip)
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} data-surface="signal" className={`${hero.hero} ${s.stage}`} id="top" data-intro-done={done}>
      {/* grid runtime (A) — statica in modalità capture (screenshot WebGL bloccano) */}
      <div className={s.grid}>
        {staticGrid ? <div className={s.gridStatic} aria-hidden="true" /> : <HeroSignalGrid />}
      </div>

      {/* PrintComposition — materia editoriale */}
      <div className={s.print} aria-hidden="true">
        <div className={s.hair} />
        {FRAGS.map((f) => {
          const isDj = f.id === 'dj'
          return (
            <div
              key={f.id}
              ref={isDj ? djFrag : undefined}
              data-id={f.id}
              className={s.frag}
              style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%` }}
            >
              <div
                className={s.top}
                style={{ backgroundImage: `url(${f.src})`, clipPath: `inset(0 0 ${(100 - f.cut * 100).toFixed(1)}% 0)` }}
              />
              <div
                className={s.bot}
                style={{ backgroundImage: `url(${f.src})`, clipPath: `inset(${(f.cut * 100).toFixed(1)}% 0 0 0)` }}
              />
            </div>
          )
        })}
        <div className={s.band} style={{ left: '4%', top: '84%', width: '30%', height: '3.2%' }} />
        <div className={s.band} style={{ left: '76%', top: '20%', width: '14%', height: '2.6%' }} />
      </div>

      {/* FrequencyCut */}
      <div className={s.freqLine} aria-hidden="true" />

      {/* LogoLockup — file ufficiale, mai ridisegnato */}
      <img className={s.logo} src="/assets/hertz-logo-official.png" alt="Hertz" aria-hidden="true" />

      {/* HeroContent + HeroImage (stato finale della hero) */}
      <div className={`hz-container ${hero.inner}`}>
        <p className={`${hero.kicker} hz-mono ${s.contentReveal}`}>Clubbing collective · Bologna · since 2023</p>

        <div className={hero.stage}>
          <div className={hero.titleCol}>
            <h1 className={`${hero.title} ${s.contentReveal}`}>
              <span className={hero.l1}>From clubbers,</span>
              <span className={hero.l2}>for clubbers.</span>
            </h1>
            <p className={`${hero.sub} ${s.contentReveal}`}>
              A minimal / deep-tech clubbing collective in Bologna — a resident night, a roster, an editorial, built
              around the selection and the floor.
            </p>
          </div>

          <figure className={`${hero.photoWrap} ${s.photoReveal}`} ref={photoFig}>
            <img src="/assets/ident-dj.jpg" alt="Hertz — the booth during an event" className={hero.photo} />
            <figcaption className={`${hero.photoCap} hz-mono`}>
              <span>N°{next?.n ?? '—'}</span>
              <span>Bologna floor</span>
            </figcaption>
            {/* waveform runtime — ciò in cui si trasforma la linea di frequenza */}
            <svg className={s.wave} viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,30 L150,30 C168,30 176,30 190,30 C205,30 208,8 222,6 C236,4 240,30 256,30 C270,30 360,30 600,30"
                fill="none"
                stroke="var(--hz-ink)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </figure>
        </div>

        <div className={`${hero.foot} ${s.contentReveal}`}>
          {next && (
            <div className={hero.next}>
              <span className={`${hero.nextLabel} hz-mono`}>Next · N°{next.n}</span>
              <Link href={`/events/${next.slug}`} className={hero.nextTitle}>
                {next.title}
              </Link>
              <span className={`${hero.nextMeta} hz-mono`}>
                {next.date} · {next.venue} · {next.city}
              </span>
            </div>
          )}
          <div className={hero.actions}>
            <Button href={ticketsHref}>Tickets</Button>
            <Button href="/events" variant="ghost">
              All events
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
