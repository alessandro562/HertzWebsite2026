'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import ImageReveal from '@/motion/ImageReveal'
import FrequencyCut from '@/motion/FrequencyCut'
import WaveformPulse from '@/motion/WaveformPulse'
import PrintInterruption from '@/motion/PrintInterruption'
import SurfaceTransition from '@/motion/SurfaceTransition'
import SignatureTitle from '@/motion/SignatureTitle'
import { DURATION, EASE, STAGGER, DISTANCE } from '@/lib/motion/tokens'
import { PRESETS } from '@/lib/motion/presets'
import s from './motion-kit.module.css'

const POSTER = '/assets/poster-v3-24apr-kindergarten.jpg'
const PHOTO = '/assets/archivio-web/26.12_Hertz-104.jpg'
const FRAG = '/assets/archivio-web/26.12_Hertz-108.jpg'

/** riga di specifica di un elemento del kit */
function Spec({
  name,
  usage,
  duration,
  ease,
  desktop,
  mobile,
  reduced,
  avoid,
  children,
}: {
  name: string
  usage: string
  duration: string
  ease: string
  desktop?: string
  mobile?: string
  reduced: string
  avoid?: string
  children: ReactNode
}) {
  return (
    <section className={s.entry}>
      <div className={s.demo}>{children}</div>
      <div className={s.meta}>
        <h2 className={s.name}>{name}</h2>
        <dl className={s.spec}>
          <div>
            <dt>Uso</dt>
            <dd>{usage}</dd>
          </div>
          <div>
            <dt>Durata</dt>
            <dd className="hz-mono">{duration}</dd>
          </div>
          <div>
            <dt>Easing</dt>
            <dd className="hz-mono">{ease}</dd>
          </div>
          {desktop && (
            <div>
              <dt>Desktop</dt>
              <dd>{desktop}</dd>
            </div>
          )}
          {mobile && (
            <div>
              <dt>Mobile</dt>
              <dd>{mobile}</dd>
            </div>
          )}
          <div>
            <dt>Reduced-motion</dt>
            <dd>{reduced}</dd>
          </div>
          {avoid && (
            <div>
              <dt>Non fare</dt>
              <dd className={s.avoid}>{avoid}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}

export default function MotionKitLab() {
  const [irKey, setIrKey] = useState(0)
  const [cutKey, setCutKey] = useState(0)
  const [wf, setWf] = useState<'idle' | 'hover' | 'active' | 'playing' | 'loading' | 'disabled'>('playing')

  return (
    <main id="main" data-surface="white" className={s.page}>
      <header className={s.head}>
        <p className="hz-mono">Hertz · Motion Kit</p>
        <h1>Movimento proprietario, limitato, riutilizzabile.</h1>
        <p className={s.lead}>
          Libreria di comportamenti derivati dal lavoro approvato (Hero, poster, superfici). Ogni voce:
          uso, durata, easing, desktop/mobile, reduced-motion, cosa non fare. Strumento di sviluppo — noindex.
        </p>
      </header>

      {/* ── TOKENS ── */}
      <section className={s.tokens}>
        <h2 className={s.name}>1 · Motion tokens</h2>
        <p className={s.sub}>Sorgente unica (lib/motion/tokens.ts). GSAP, Motion e CSS derivano da qui.</p>
        <div className={s.tokenGrid}>
          <div>
            <h3 className="hz-mono">Durations</h3>
            <ul className="hz-mono">
              {Object.entries(DURATION).map(([k, v]) => (
                <li key={k}>
                  {k} · {Math.round(v * 1000)}ms
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="hz-mono">Easings</h3>
            <ul className="hz-mono">
              {Object.entries(EASE).map(([k, v]) => (
                <li key={k}>
                  {k} · {v.css.replace('cubic-bezier', '').replace(/[()]/g, '')}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="hz-mono">Staggers</h3>
            <ul className="hz-mono">
              {Object.entries(STAGGER).map(([k, v]) => (
                <li key={k}>
                  {k} · {v}s
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="hz-mono">Distances</h3>
            <ul className="hz-mono">
              {Object.entries(DISTANCE).map(([k, v]) => (
                <li key={k}>
                  {k} · {v}px
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── IMAGE REVEAL ── */}
      <Spec
        name="2 · ImageReveal"
        usage="Rivelazione fotografica editoriale. Sostituisce clip-path/mask isolati."
        duration="editorial (750ms)"
        ease="editorialOut"
        desktop="5 varianti: print · vertical · horizontal · frequency · halftone."
        mobile="Identiche; durata invariata."
        reduced="Immagine subito visibile, nessuna maschera."
        avoid="Non animare clip-path sull'elemento osservato da whileInView (bug observer). L'immagine è sempre visibile senza JS."
      >
        <button className={s.replay} onClick={() => setIrKey((k) => k + 1)}>
          Replay ↻
        </button>
        <div className={s.irGrid} key={irKey}>
          {(['print', 'vertical', 'horizontal', 'frequency', 'halftone'] as const).map((v) => (
            <figure key={v}>
              <ImageReveal variant={v} className={s.irFrame} style={{ aspectRatio: '4 / 5' }}>
                <img src={POSTER} alt="" className={s.cover} />
              </ImageReveal>
              <figcaption className="hz-mono">{v}</figcaption>
            </figure>
          ))}
        </div>
      </Spec>

      {/* ── FREQUENCY CUT ── */}
      <Spec
        name="3 · FrequencyCut"
        usage="Firma Hertz: tensione → impulso → offset controllato → libera lo spazio. Causa→effetto."
        duration="micro (ui) · navigation (reveal) · editorial · signature"
        ease="compression + rupture + settle"
        desktop="4 varianti per scala/momento."
        mobile="Identica logica, scala ridotta dal contenitore."
        reduced="Solo l'esito (linea presente), nessun movimento."
        avoid="Niente glitch, RGB split, jitter, equalizzatore, oscillazione continua, neon."
      >
        <button className={s.replay} onClick={() => setCutKey((k) => k + 1)}>
          Replay ↻
        </button>
        <div className={s.cutGrid}>
          {(['micro', 'navigation', 'editorial', 'signature'] as const).map((v) => (
            <div key={v} className={s.cutRow}>
              <span className="hz-mono">{v}</span>
              <FrequencyCut variant={v} trigger="manual" playKey={cutKey} />
            </div>
          ))}
        </div>
      </Spec>

      {/* ── PRINT INTERRUPTION ── */}
      <Spec
        name="4 · PrintInterruption"
        usage="Sistema editoriale generale (Archive, Media, aperture). Foto dominante + frammento + bande + retino + frequenza."
        duration="editorial"
        ease="editorialOut"
        desktop="Composizione con frammento secondario e cut."
        mobile="Frammento ridotto, stessa logica."
        reduced="Immagini in posizione, nessuna sequenza."
        avoid="Non duplicare la coreografia della Hero (HeroIntroSequence resta isolata)."
      >
        <PrintInterruption
          image={PHOTO}
          alt="Hertz night"
          aspectRatio="3 / 2"
          fragment={{ src: FRAG }}
          caption={<><span>Kindergarten</span><span>PrintInterruption</span></>}
        />
      </Spec>

      {/* ── SURFACE TRANSITION ── */}
      <Spec
        name="5 · SurfaceTransition"
        usage="Passaggio proprietario tra superfici (Signal/White/Paper/Cold Blue/Ink). Linea che apre + banda che si comprime."
        duration="content (500ms)"
        ease="ease-out + compression"
        desktop="Si mette come primo figlio di una Section."
        mobile="Identica."
        reduced="Via immediata, contenuto già visibile."
        avoid="Mai una dissolvenza standard. Ink non diventa la superficie predefinita."
      >
        <div className={s.surfaceDemo} data-surface="cold-blue">
          <SurfaceTransition surface="cold-blue" />
          <div className={s.surfaceInner}>
            <span className="hz-mono">Cold Blue surface</span>
          </div>
        </div>
      </Spec>

      {/* ── WAVEFORM PULSE ── */}
      <Spec
        name="6 · WaveformPulse"
        usage="Geometria Hertz per Hero, player Music, CTA, hover artisti, conferme, cambio evento."
        duration="ui / content"
        ease="ease-out / ease-in-out"
        desktop="6 stati; animazioni continue in pausa fuori viewport."
        mobile="Identica; nessun costo infinito."
        reduced="Statica in ogni stato."
        avoid="Non deve sembrare un equalizzatore audio generico. Sottile a riposo."
      >
        <div className={s.wfRow}>
          <WaveformPulse state={wf} label={`waveform ${wf}`} className={s.wfBig} />
        </div>
        <div className={s.wfStates}>
          {(['idle', 'hover', 'active', 'playing', 'loading', 'disabled'] as const).map((st) => (
            <button key={st} className={`${s.replay} hz-mono`} data-active={wf === st} onClick={() => setWf(st)}>
              {st}
            </button>
          ))}
        </div>
      </Spec>

      {/* ── SIGNATURE TITLE ── */}
      <Spec
        name="7 · SignatureTitle"
        usage="Momenti principali soltanto. Entrata a maschera riga-per-riga; la composizione (fill/outline/offset/lock-up) resta al CSS di pagina."
        duration="editorial"
        ease="editorialOut"
        desktop="Max UNA signature typography per viewport."
        mobile="Scala compositiva, non automatica; niente font enormi ovunque."
        reduced="Testo già in posizione (nessuno slide)."
        avoid="Il testo resta HTML (no rasterizzazione); la headline finale è leggibile senza attendere l'animazione."
      >
        <SignatureTitle as="h3" className={s.sigTitle} trigger="inView">
          <span>From clubbers,</span>
          <span className={s.sigOutline}>for clubbers.</span>
        </SignatureTitle>
      </Spec>

      {/* ── POSTER MORPH + PAGE TRANSITION ── */}
      <Spec
        name="8 · PosterMorph + PageTransition"
        usage="Continuità Events→Detail (View Transitions) e cambio pagina proprietario (linea di frequenza in alto, focus a #main)."
        duration="reveal (250–600ms)"
        ease="editorialOut"
        desktop="Morph del poster in evidenza + nav-line ad ogni navigazione."
        mobile="Nav-line identica; morph dove il browser lo supporta."
        reduced="Swap istantaneo, nessun morph, focus gestito."
        avoid="Niente intro lunga ad ogni pagina; nessun morph pixel-perfect fragile; fallback = ImageReveal print."
      >
        <p className={s.note}>
          Live sul sito: apri <Link href="/events">/events</Link> e seleziona un evento — la linea di navigazione
          attraversa in alto, il poster in evidenza si espande, il focus passa a #main.
        </p>
      </Spec>

      {/* ── PRESETS ── */}
      <section className={s.tokens}>
        <h2 className={s.name}>9 · Motion presets</h2>
        <p className={s.sub}>Ricette Motion (variants + transition) da token. lib/motion/presets.ts</p>
        <table className={s.presetTable}>
          <thead>
            <tr>
              <th>Preset</th>
              <th>Uso</th>
              <th>Durata</th>
              <th>Easing</th>
              <th>Reduced</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(PRESETS).map(([k, p]) => (
              <tr key={k}>
                <td className="hz-mono">{k}</td>
                <td>{p.meta.usage}</td>
                <td className="hz-mono">{p.meta.duration}</td>
                <td className="hz-mono">{p.meta.ease}</td>
                <td>{p.meta.reduced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className={s.footer}>
        <p className="hz-mono">
          Reduced-motion: attivalo nel sistema e ricarica — ogni comportamento mostra il suo esito finale
          immediato. Il sito è completamente utilizzabile senza motion.
        </p>
      </footer>
    </main>
  )
}
