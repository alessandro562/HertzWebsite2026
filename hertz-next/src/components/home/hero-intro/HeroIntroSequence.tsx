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

/** Foto SECONDARIE reali (retino PRE-BAKED): materia editoriale che il taglio
   di frequenza seziona ed elimina. Il DJ non è qui: È la HeroImage (vedi sotto).
   Posizioni in CSS (responsive/SSR-safe); qui solo id, sorgente, cut, entrata. */
const FRAGS = [
  { id: 'human', src: '/assets/ident-human-ht.jpg', cut: 0.5, t: 0.2 },
  { id: 'crowd', src: '/assets/ident-crowd-ht.jpg', cut: 0.72, t: 0.34 },
] as const

// clip della HeroImage: frammento (crop coerente) → banda compressa dal taglio → frame pieno.
// Desktop = foto in colonna destra (crop verticale); Mobile = foto full-width bassa (crop centrale,
// generoso fin dall'inizio: su mobile il DJ è LA fotografia dominante, non un frammento minuscolo).
const SLAB = 'inset(12% 26% 20% 42%)'
const BAND = 'inset(46% 26% 46% 42%)'
const SLAB_M = 'inset(13% 13% 13% 13%)'
const BAND_M = 'inset(43% 13% 43% 13%)'
const FULL = 'inset(0% 0% 0% 0%)'

/**
 * HeroIntroSequence — B2 "Print Interruption" come PRIMO STATO della hero.
 * Non è un intro separato: è la hero che si compone. Continuità geometrica: la
 * foto del DJ È il frammento (stesso elemento, stesso pixel) — un clip lo apre
 * dal crop al frame pieno mentre il retino si dissolve nel colore (nessun
 * crossfade fra elementi diversi). Human + dancefloor vengono sezionati ed
 * eliminati dal taglio; il DJ sopravvive e diventa la HeroImage. La linea di
 * frequenza si assesta nella waveform; il logo fa lock-up nello spazio liberato
 * e si ritrae in posizione di sistema mentre entra l'headline.
 * Reduced-motion e visite successive → stato finale diretto. Mai bloccante.
 */
export default function HeroIntroSequence({ next, staticGrid = false }: { next?: NextEvent; staticGrid?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [done, setDone] = useState(false)
  const ticketsHref = next ? `/events/${next.slug}` : '/events'
  const status = next?.onSale ? 'On sale' : next?.comingSoon ? 'Coming soon' : 'Soon'

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      // wall-clock (niente lag-smoothing) → durata coerente anche sotto carico.
      gsap.ticker.lagSmoothing(0)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hz_intro') === '1'
      // clip del DJ tarato per la colonna singola (mobile) vs colonna destra (desktop)
      const mobile = window.matchMedia('(max-width: 640px)').matches
      const slab = mobile ? SLAB_M : SLAB
      const band = mobile ? BAND_M : BAND

      // stato finale: hero a riposo (reduced-motion o visita successiva)
      const settle = () => {
        gsap.set([q(`.${s.print}`), q(`.${s.logo}`), q(`.${s.freqLine}`), q(`.${s.htOverlay}`)], { autoAlpha: 0 })
        gsap.set(q(`.${s.heroFigure}`), { autoAlpha: 1, clearProps: 'clipPath' })
        gsap.set([q(`.${s.contentReveal}`), q(`.${s.photoDetail}`), q(`.${s.wave}`), q(`.${s.grid}`)], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        })
        setDone(true)
      }
      if (reduce || seen) {
        settle()
        return
      }

      // ── stati iniziali (SSR è già nascosto via CSS; qui li posizioniamo) ──
      gsap.set(q(`.${s.grid}`), { autoAlpha: 0 })
      gsap.set(q(`.${s.hair}`), { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(q(`.${s.frag}`), { autoAlpha: 0 })
      gsap.set(q(`.${s.top}, .${s.bot}`), { xPercent: 0, yPercent: 0 })
      gsap.set(q(`.${s.band}`), { autoAlpha: 0, scaleX: 0.4, transformOrigin: 'left center' })
      gsap.set(q(`.${s.freqLine}`), { scaleX: 0, transformOrigin: 'left center', autoAlpha: 1 })
      gsap.set(q(`.${s.logo}`), { autoAlpha: 0, transformOrigin: 'left center' })
      gsap.set(q(`.${s.heroFigure}`), { autoAlpha: 0, clipPath: slab })
      gsap.set(q(`.${s.htOverlay}`), { autoAlpha: 1 })
      gsap.set([q(`.${s.contentReveal}`), q(`.${s.photoDetail}`), q(`.${s.wave}`)], { autoAlpha: 0 })
      gsap.set(q(`.${s.contentReveal}`), { y: 26 })

      const done1 = () => {
        try {
          sessionStorage.setItem('hz_intro', '1')
        } catch {}
        setDone(true)
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: done1 })

      if (mobile) {
        // ── Mobile: coreografia dedicata (NON la stessa timeline del desktop
        // riscalata) — 1 fotografia dominante (il DJ, ampio fin dall'inizio) +
        // al massimo 1 frammento secondario. Durata totale ~1,82s, fasi non
        // uniformi: manifesto → densità → taglio → espansione DJ → lock-up → Hero.

        // 0.00–0.16 · tensione (breve)
        tl.to(q(`.${s.hair}`), { scaleX: 1, duration: 0.16 }, 0)
        // 0.05–0.35 · manifesto: il DJ è già presente e ampio (nessun vuoto centrale)
        tl.to(q(`.${s.heroFigure}`), { autoAlpha: 1, duration: 0.22 }, 0.05)
        tl.fromTo(
          q(`.${s.frag}[data-id="crowd"]`),
          { autoAlpha: 0, yPercent: -14, scale: 1.05 },
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.2 },
          0.12,
        )
        tl.to(q(`.${s.hair}`), { autoAlpha: 0, duration: 0.14 }, 0.3)

        // 0.35–0.70 · densità (un solo accento grafico + micro respiro del DJ)
        tl.to(q(`.${s.band}[data-idx="0"]`), { autoAlpha: 1, scaleX: 1, duration: 0.22 }, 0.38)
        tl.to(q(`.${s.heroFigure}`), { scale: '-=0.01', duration: 0.16 }, 0.5)

        // 0.70–0.95 · RUPTURE: la lama seziona, il secondario è cancellato, il DJ sopravvive
        tl.to(q(`.${s.freqLine}`), { scaleX: 1, duration: 0.1, ease: 'power2.in' }, 0.7)
        tl.to(q(`.${s.freqLine}`), { scaleY: 2.6, duration: 0.05, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.8)
        tl.to(
          [q(`.${s.frag}[data-id="crowd"]`), q(`.${s.band}[data-idx="0"]`)],
          { yPercent: -60, scaleY: 0.05, autoAlpha: 0, transformOrigin: 'top center', duration: 0.18, ease: 'power3.in' },
          0.8,
        )
        tl.to(q(`.${s.heroFigure}`), { clipPath: band, duration: 0.1, ease: 'power3.inOut' }, 0.82)
        tl.to(q(`.${s.freqLine}`), { autoAlpha: 0, duration: 0.14 }, 0.88)

        // 0.95–1.25 · espansione: stessa continuità geometrica del desktop, ritmo compresso
        tl.to(q(`.${s.heroFigure}`), { clipPath: FULL, duration: 0.28, ease: 'power2.inOut' }, 0.95)
        tl.to(q(`.${s.htOverlay}`), { autoAlpha: 0, duration: 0.26, ease: 'power2.out' }, 0.97)

        // 1.25–1.55 · LOGO LOCK-UP: Ink su Signal, nello spazio libero SOPRA la foto
        // (mai coperto: quella zona è sempre Signal puro finché il contenuto non entra)
        tl.set(q(`.${s.logo}`), { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, 1.25)
        tl.to(q(`.${s.logo}`), { clipPath: 'inset(0 0% 0 0)', duration: 0.14, ease: 'power3.out' }, 1.25)
        tl.to(
          q(`.${s.logo}`),
          { x: -14, y: -60, scale: 0.32, autoAlpha: 0, transformOrigin: 'left center', duration: 0.16, ease: 'power2.inOut' },
          1.39,
        )

        // 1.55–1.88 · Hero completa
        tl.to(q(`.${s.grid}`), { autoAlpha: 1, duration: 0.3 }, 1.55)
        tl.to(q(`.${s.photoDetail}`), { autoAlpha: 1, duration: 0.22 }, 1.58)
        tl.to(q(`.${s.contentReveal}`), { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.02 }, 1.6)
        tl.to(q(`.${s.wave}`), { autoAlpha: 1, duration: 0.2 }, 1.6)
      } else {
        // 0.00–0.22 · tensione
        tl.to(q(`.${s.hair}`), { scaleX: 1, duration: 0.22 }, 0)

        // 0.20–0.82 · i frammenti secondari entrano come manifesto unico
        FRAGS.forEach((f) => {
          tl.fromTo(
            q(`.${s.frag}[data-id="${f.id}"]`),
            { autoAlpha: 0, xPercent: f.id === 'human' ? -14 : 0, yPercent: f.id === 'crowd' ? -16 : 0, scale: 1.06 },
            { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.34 },
            f.t,
          )
        })
        // 0.48 · la HeroImage entra come frammento (crop, retino attivo)
        tl.to(q(`.${s.heroFigure}`), { autoAlpha: 1, duration: 0.3 }, 0.48)
        tl.to(q(`.${s.band}`), { autoAlpha: 1, scaleX: 1, duration: 0.28, stagger: 0.08 }, 0.6)
        tl.to(q(`.${s.hair}`), { autoAlpha: 0, duration: 0.26 }, 0.55)

        // 0.92–1.14 · densità massima (micro assestamento)
        tl.to(q(`.${s.frag}`), { scale: '-=0.012', duration: 0.22 }, 0.92)

        // 1.18–1.40 · la frequenza attraversa (la lama)
        tl.to(q(`.${s.freqLine}`), { scaleX: 1, duration: 0.22, ease: 'power2.in' }, 1.18)

        // ── 1.40–1.62 · RUPTURE (~220ms): la composizione viene SEZIONATA ──
        // la lama "morde": breve emphasis verticale al contatto (controllato, no glitch)
        tl.to(q(`.${s.freqLine}`), { scaleY: 2.8, duration: 0.06, ease: 'power2.out', yoyo: true, repeat: 1 }, 1.4)
        // metà-alte su, metà-basse giù → separazione reale, netta, attorno all'asse
        tl.to(q(`.${s.top}`), { yPercent: -30, xPercent: -10, duration: 0.12, ease: 'power4.out' }, 1.4)
        tl.to(q(`.${s.bot}`), { yPercent: 32, xPercent: 11, duration: 0.12, ease: 'power4.out' }, 1.4)
        // il DJ viene compresso dal taglio (clip → banda sottile), ma sopravvive
        tl.to(q(`.${s.heroFigure}`), { clipPath: band, duration: 0.13, ease: 'power3.inOut' }, 1.42)

        // ── 1.56–2.06 · compressione + cancellazione secondarie, il DJ si trasforma ──
        // human + crowd + bande: compresse verso un punto di fuga ed erase
        tl.to(
          [q(`.${s.frag}`), q(`.${s.band}`)],
          { xPercent: '+=140', scaleX: 0.04, autoAlpha: 0, transformOrigin: 'right center', duration: 0.34, ease: 'power3.in', stagger: 0.03 },
          1.56,
        )
        // il DJ: banda → frame pieno + retino che si dissolve nel colore (continuo)
        tl.to(q(`.${s.heroFigure}`), { clipPath: FULL, duration: 0.48, ease: 'power2.inOut' }, 1.58)
        tl.to(q(`.${s.htOverlay}`), { autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, 1.6)
        tl.to(q(`.${s.freqLine}`), { autoAlpha: 0, duration: 0.2 }, 1.56)

        // ── 2.04–2.78 · LOGO LOCK-UP (presenza ~400ms) poi si ritrae ──
        tl.set(q(`.${s.logo}`), { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, 2.04)
        tl.to(q(`.${s.logo}`), { clipPath: 'inset(0 0% 0 0)', duration: 0.24, ease: 'power3.out' }, 2.04)
        tl.to(
          q(`.${s.logo}`),
          { x: -18, y: -140, scale: 0.2, autoAlpha: 0, transformOrigin: 'left center', duration: 0.36, ease: 'power2.inOut' },
          2.42,
        )

        // ── 2.30–2.86 · hero a riposo: grid + waveform + contenuto entrano ──
        tl.to(q(`.${s.grid}`), { autoAlpha: 1, duration: 0.5 }, 2.3)
        tl.to(q(`.${s.photoDetail}`), { autoAlpha: 1, duration: 0.4 }, 2.32)
        tl.to(q(`.${s.contentReveal}`), { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04 }, 2.34)
        tl.to(q(`.${s.wave}`), { autoAlpha: 1, duration: 0.4 }, 2.44)
      }

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
      window.addEventListener('touchstart', skip, { passive: true, once: true })
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      return () => {
        window.removeEventListener('wheel', skip)
        window.removeEventListener('touchstart', skip)
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} data-surface="signal" className={`${hero.hero} ${s.stage}`} id="top" data-intro-done={done}>
      {/* grid runtime (A): durante la sequenza resta statica (CSS, zero rAF → non
         compete con la timeline); la griglia viva monta solo a Hero assestata.
         In modalità capture (staticGrid) resta sempre statica. */}
      <div className={s.grid}>
        {staticGrid || !done ? <div className={s.gridStatic} aria-hidden="true" /> : <HeroSignalGrid />}
      </div>

      {/* PrintComposition — foto secondarie sezionate dal taglio */}
      <div className={s.print} aria-hidden="true">
        <div className={s.hair} />
        {FRAGS.map((f) => (
          <div key={f.id} data-id={f.id} className={s.frag}>
            <div
              className={s.top}
              style={{ backgroundImage: `url(${f.src})`, clipPath: `inset(0 0 ${(100 - f.cut * 100).toFixed(1)}% 0)` }}
            />
            <div
              className={s.bot}
              style={{ backgroundImage: `url(${f.src})`, clipPath: `inset(${(f.cut * 100).toFixed(1)}% 0 0 0)` }}
            />
          </div>
        ))}
        <div className={s.band} data-idx="0" style={{ left: '4%', top: '84%', width: '30%', height: '3.2%' }} />
        <div className={s.band} data-idx="1" style={{ left: '70%', top: '18%', width: '16%', height: '2.6%' }} />
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

          {/* HeroImage = il frammento DJ trasformato: stessa immagine, colore + retino overlay */}
          <figure className={s.heroFigure}>
            <img src="/assets/ident-dj.jpg" alt="Hertz — the booth during an event" className={hero.photo} />
            <img src="/assets/ident-dj-ht.jpg" alt="" aria-hidden="true" className={s.htOverlay} />
            <figcaption className={`${hero.photoCap} hz-mono ${s.photoDetail}`}>
              <span>N°{next?.n ?? '—'}</span>
              <span>Bologna floor</span>
            </figcaption>
            {/* waveform runtime — ciò in cui si assesta la linea di frequenza */}
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

        {/* Zona editoriale prossimo evento — HTML reale, CMS-driven, subito usabile */}
        <div className={`${hero.foot} ${s.contentReveal}`}>
          {next && (
            <div className={s.nextZone}>
              <div className={s.nextTop}>
                <span className="hz-mono">Next · N°{next.n}</span>
                <span className={`${s.badge} ${next.onSale ? s.badgeOn : ''} hz-mono`.trim()}>{status}</span>
              </div>
              <Link href={`/events/${next.slug}`} className={s.nextTitle}>
                {next.title}
              </Link>
              <span className={`${s.nextMeta} hz-mono`}>
                <time className={s.nextDate}>{next.date}</time> · {next.venue} · {next.city}
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
