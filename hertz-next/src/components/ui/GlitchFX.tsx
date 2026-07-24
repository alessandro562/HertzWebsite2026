/**
 * GlitchFX — texture "glitch" INTEGRATA nella foto, da appoggiare come ultimo
 * figlio di un contenitore `.hz-glitch`. Righe fini da retinatura di stampa +
 * grana analogica. Niente aberrazione cromatica, niente glitch colorato
 * laterale. Statico → reduced-motion safe. Classi in globals.css
 * (`.hz-glitch-lines`, `.hz-glitch-grain`), condivise da tutte le foto.
 */
export default function GlitchFX() {
  return (
    <>
      <span className="hz-glitch-lines" aria-hidden="true" />
      <span className="hz-glitch-grain" aria-hidden="true" />
    </>
  )
}
