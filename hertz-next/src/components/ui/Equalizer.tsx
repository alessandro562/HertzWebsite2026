/**
 * Equalizer — quattro barre di frequenza (il motivo "segnale" del brand) come
 * indicatore audio. CSS puro (classe globale `hz-eq`): a riposo statico, animato
 * quando `play` è true (traccia in evidenza) o quando la riga `hz-rowfx` è in
 * hover/focus. Reduced-motion → barre ferme. Decorativo → aria-hidden.
 */
export default function Equalizer({
  play = false,
  className,
}: {
  play?: boolean
  className?: string
}) {
  return (
    <span
      className={`hz-eq ${className ?? ''}`.trim()}
      data-play={play ? 'true' : undefined}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}
