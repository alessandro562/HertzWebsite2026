/* ────────────────────────────────────────────────────────────
   HERTZ · MOTION KIT · TOKENS
   Sorgente semantica unica del movimento. GSAP, Motion for React e CSS
   derivano TUTTI da qui — nessun valore arbitrario sparso nei componenti.

   Le durate sono in SECONDI (unità nativa di Motion/GSAP); `.ms` per CSS/DOM.
   Gli easing sono cubic-bezier: array [x1,y1,x2,y2] per Motion/GSAP, stringa
   `css` per style inline / CSS-in-JS. I valori rispecchiano i token CSS in
   `styles/tokens.css` / `styles/motion.css` (mirror manuale, vedi NOTE).
   ──────────────────────────────────────────────────────────── */

/** Durate (s). Fasce: instant 80–120 · ui 160–220 · reveal 320–480 ·
 *  editorial 600–900 · signature 1.2–2.9. */
export const DURATION = {
  instant: 0.1,
  ui: 0.2,
  reveal: 0.42,
  editorial: 0.75,
  /** valore rappresentativo; i momenti firma (Hero) definiscono la propria
   *  durata esatta (desktop 2.86, mobile 1.88) partendo da questa fascia. */
  signature: 1.4,
} as const

export type DurationToken = keyof typeof DURATION

/** Durata in millisecondi (per CSS/DOM/IntersectionObserver). */
export const durationMs = (t: DurationToken): number => Math.round(DURATION[t] * 1000)

type Bezier = [number, number, number, number]
interface Ease {
  /** array cubic-bezier per Motion for React (transition.ease) */
  readonly bezier: Bezier
  /** stringa cubic-bezier per CSS / style inline */
  readonly css: string
  /** ease NATIVO GSAP (GSAP non accetta array cubic-bezier senza CustomEase) */
  readonly gsap: string
}
const ease = (b: Bezier, gsap: string): Ease => ({
  bezier: b,
  css: `cubic-bezier(${b.join(', ')})`,
  gsap,
})

/**
 * Easing proprietari (con equivalente GSAP nativo).
 * - uiOut        micro-interazioni, entrate rapide (= --hz-ease-out)
 * - uiInOut      andata/ritorno simmetrici (= --hz-ease-in-out)
 * - editorialOut reveal editoriali morbidi (= --hz-ease-soft)
 * - compression  accelera verso un punto (taglio → compressione)
 * - rupture      scatto netto in uscita (il "morso" della frequenza)
 * - settle       assestamento con micro-overshoot controllato
 */
export const EASE = {
  uiOut: ease([0.16, 1, 0.3, 1], 'power3.out'),
  uiInOut: ease([0.65, 0, 0.35, 1], 'power2.inOut'),
  editorialOut: ease([0.22, 1, 0.36, 1], 'power3.out'),
  compression: ease([0.7, 0, 0.84, 0], 'power3.in'),
  rupture: ease([0.12, 0.85, 0.25, 1], 'power4.out'),
  settle: ease([0.34, 1.12, 0.64, 1], 'back.out(1.4)'),
} as const

export type EaseToken = keyof typeof EASE

/** Stagger fra elementi (s). */
export const STAGGER = {
  micro: 0.03,
  list: 0.06,
  lineup: 0.09,
  editorial: 0.14,
} as const

export type StaggerToken = keyof typeof STAGGER

/** Distanze di ingresso (px). */
export const DISTANCE = {
  micro: 8,
  normal: 26,
  large: 64,
} as const

export type DistanceToken = keyof typeof DISTANCE

/**
 * Helper Motion: transition {duration, ease} da token semantici.
 * Es. `transition={tr('reveal', 'editorialOut', { delay })}`
 */
export function tr(
  duration: DurationToken,
  easing: EaseToken = 'uiOut',
  extra?: { delay?: number; repeat?: number; repeatType?: 'loop' | 'reverse' | 'mirror' },
) {
  return { duration: DURATION[duration], ease: EASE[easing].bezier, ...extra }
}

/** Helper CSS: stringa `transition` (una o più proprietà) da token. */
export function cssTransition(
  properties: string | string[],
  duration: DurationToken = 'ui',
  easing: EaseToken = 'uiOut',
): string {
  const props = Array.isArray(properties) ? properties : [properties]
  return props.map((p) => `${p} ${durationMs(duration)}ms ${EASE[easing].css}`).join(', ')
}

/**
 * NOTE — mirror CSS: se cambi un valore qui, aggiorna anche
 * `styles/tokens.css` (§8 MOTION) e `styles/motion.css`. La pagina
 * `/lab/motion-kit` verifica a vista che i due mondi coincidano.
 */
