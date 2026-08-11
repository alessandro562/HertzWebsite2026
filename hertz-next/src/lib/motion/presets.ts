import type { Variants, Transition } from 'motion/react'
import { DURATION, EASE, STAGGER, DISTANCE } from './tokens'

/* ────────────────────────────────────────────────────────────
   HERTZ · MOTION KIT · PRESETS
   Ricette riutilizzabili (Motion for React) derivate dai token. API minima:
   ogni preset espone `variants` (hidden/show) + `transition` consumabili da
   qualunque motion.* con initial="hidden"/whileInView="show", più `meta` per
   la documentazione (/lab/motion-kit). Reduced-motion è gestito globalmente
   da MotionConfig(reducedMotion="user"): i transform vengono neutralizzati,
   resta un fade non-posizionale — nessun preset lascia contenuto invisibile.
   ──────────────────────────────────────────────────────────── */

export interface MotionPreset {
  variants: Variants
  transition: Transition
  meta: {
    usage: string
    duration: keyof typeof DURATION
    ease: keyof typeof EASE
    /** override consigliato su mobile (durata più breve / distanza minore) */
    mobile?: string
    reduced: string
    avoid?: string
  }
}

const t = (duration: keyof typeof DURATION, ease: keyof typeof EASE): Transition => ({
  duration: DURATION[duration],
  ease: EASE[ease].bezier,
})

export const PRESETS = {
  fade: {
    variants: { hidden: { opacity: 0 }, show: { opacity: 1 } },
    transition: t('reveal', 'uiOut'),
    meta: { usage: 'Comparse neutre, metadata, elementi UI secondari.', duration: 'reveal', ease: 'uiOut', reduced: 'Identico (già solo opacity).' },
  },
  slide: {
    variants: { hidden: { opacity: 0, y: DISTANCE.normal }, show: { opacity: 1, y: 0 } },
    transition: t('reveal', 'editorialOut'),
    meta: { usage: 'Blocchi di testo, righe, card in entrata.', duration: 'reveal', ease: 'editorialOut', mobile: 'Distanza micro (8px).', reduced: 'Solo fade (transform neutralizzato).' },
  },
  mask: {
    variants: { hidden: { opacity: 0 }, show: { opacity: 1 } },
    transition: t('editorial', 'editorialOut'),
    meta: { usage: 'Titoli/paragrafi firma. Per le IMMAGINI usare <ImageReveal> (clip-path robusto).', duration: 'editorial', ease: 'editorialOut', reduced: 'Fade immediato.', avoid: 'Non animare clip-path sull’elemento osservato da whileInView.' },
  },
  print: {
    variants: { hidden: { opacity: 0, y: DISTANCE.large, filter: 'contrast(1.4)' }, show: { opacity: 1, y: 0, filter: 'contrast(1)' } },
    transition: t('editorial', 'editorialOut'),
    meta: { usage: 'Aperture editoriali, blocchi che entrano come materia di stampa.', duration: 'editorial', ease: 'editorialOut', reduced: 'Fade immediato.', avoid: 'Non abusarne: una apertura print per viewport.' },
  },
  cut: {
    variants: { hidden: { opacity: 0, scaleX: 0.6 }, show: { opacity: 1, scaleX: 1 } },
    transition: t('reveal', 'rupture'),
    meta: { usage: 'Elementi che entrano come effetto di un taglio di frequenza.', duration: 'reveal', ease: 'rupture', reduced: 'Fade immediato.' },
  },
  compress: {
    variants: { hidden: { opacity: 1, scaleY: 1 }, show: { opacity: 0, scaleY: 0.02 } },
    transition: t('reveal', 'compression'),
    meta: { usage: 'Uscita: elementi compressi verso un asse ed eliminati (cancellazione).', duration: 'reveal', ease: 'compression', reduced: 'Scomparsa immediata.' },
  },
  settle: {
    variants: { hidden: { opacity: 0, y: DISTANCE.micro }, show: { opacity: 1, y: 0 } },
    transition: t('ui', 'settle'),
    meta: { usage: 'Micro-assestamento con overshoot minimo (conferme, chip, hover-in).', duration: 'ui', ease: 'settle', reduced: 'Fade immediato.' },
  },
  titleReveal: {
    variants: { hidden: { y: '115%' }, show: { y: '0%' } },
    transition: t('editorial', 'editorialOut'),
    meta: { usage: 'Righe di <SignatureTitle> (una riga per figlio, overflow:hidden sul contenitore).', duration: 'editorial', ease: 'editorialOut', reduced: 'Testo già in posizione (nessuno slide).', avoid: 'Max una signature typography per viewport; il testo resta HTML.' },
  },
  staggerRows: {
    variants: { hidden: {}, show: { transition: { staggerChildren: STAGGER.list } } },
    transition: t('reveal', 'editorialOut'),
    meta: { usage: 'Contenitore liste (calendario, lineup, archivio). Ogni figlio usa `slide`.', duration: 'reveal', ease: 'editorialOut', mobile: 'Stagger micro per liste lunghe.', reduced: 'Nessuna sequenza (i figli appaiono insieme).' },
  },
  sharedPoster: {
    variants: { hidden: {}, show: {} },
    transition: t('reveal', 'editorialOut'),
    meta: { usage: 'Continuità Events→Detail: usare <PosterMorph> (View Transitions), non variants.', duration: 'reveal', ease: 'editorialOut', reduced: 'Swap istantaneo, nessun morph.', avoid: 'Nessun morph pixel-perfect fragile; fallback = ImageReveal print.' },
  },
} satisfies Record<string, MotionPreset>

export type PresetName = keyof typeof PRESETS

/** stagger container helper con token (per liste che non usano il preset diretto) */
export function staggerContainer(kind: keyof typeof STAGGER = 'list'): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: STAGGER[kind] } } }
}
