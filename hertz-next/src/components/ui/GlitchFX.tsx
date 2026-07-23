/**
 * GlitchFX — overlay "glitch" da appoggiare come ultimo figlio di un contenitore
 * in position:relative;overflow:hidden (o su un wrapper `.hz-glitch`). Nessun
 * layout proprio: solo grana fine costante + micro-strappi RGB che scattano
 * pochi istanti per ciclo. NIENTE scan/banda che scende. Le classi vivono in
 * globals.css (`.hz-glitch-grain / .hz-glitch-fx`), condivise da tutte le foto.
 * Reduced-motion: solo grana statica (gestito in globals.css).
 */
export default function GlitchFX() {
  return (
    <>
      <span className="hz-glitch-grain" aria-hidden="true" />
      <span className="hz-glitch-fx" aria-hidden="true" />
    </>
  )
}
