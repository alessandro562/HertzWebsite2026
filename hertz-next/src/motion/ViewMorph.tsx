import type {} from 'react/experimental'
import { ViewTransition } from 'react'
import type { ReactNode } from 'react'

/**
 * Morph condiviso cross-route (React <ViewTransition>): lo stesso `name` su
 * due pagine fa animare l'elemento da una posizione/size all'altra durante la
 * navigazione (riga calendario → pagina evento, card artista → dettaglio).
 *
 * Progressive enhancement: senza supporto browser la navigazione resta
 * normale (nessuna animazione). Server-compatibile (nessun hook).
 * `name` DEVE essere unico nella pagina.
 */
export default function ViewMorph({ name, children }: { name: string; children: ReactNode }) {
  return <ViewTransition name={name}>{children}</ViewTransition>
}
