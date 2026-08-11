import type { ReactNode } from 'react'
import ViewMorph from './ViewMorph'

/**
 * PosterMorph — continuità Events → Event Detail. Standardizza la nomenclatura
 * del morph condiviso del poster (View Transitions API via React <ViewTransition>).
 * Lo stesso `slug` sulle due pagine fa espandere il poster dalla posizione/scala
 * della card d'anteprima a quella del dettaglio, con metadata (titolo/data)
 * ancorati alla griglia da nomi coordinati.
 *
 * Robustezza: nessun morph pixel-perfect fragile. Dove il browser non supporta
 * le View Transitions, o su reduced-motion, la navigazione resta normale e il
 * poster del dettaglio entra con <ImageReveal variant="print"> (fallback
 * coerente, nessun hard cut, nessun layout shift).
 *
 * Il trattamento del gruppo (espansione editoriale, non dissolvenza) è in
 * `styles/motion.css` via ::view-transition-group.
 */
export default function PosterMorph({
  slug,
  children,
}: {
  slug: string
  children: ReactNode
}) {
  return <ViewMorph name={`event-poster-${slug}`}>{children}</ViewMorph>
}

/** nomi coordinati per i metadata che restano ancorati durante il morph */
export const morphNames = (slug: string) => ({
  poster: `event-poster-${slug}`,
  title: `event-title-${slug}`,
  date: `event-date-${slug}`,
  status: `event-status-${slug}`,
})
