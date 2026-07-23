/**
 * GlitchFX — texture "glitch" INTEGRATA nella foto, da appoggiare come ultimo
 * figlio di un contenitore `.hz-glitch` (che porta l'aberrazione cromatica via
 * filtro SVG). Qui aggiunge solo la grana fine analogica. Niente barre colorate
 * sovrapposte, niente scan. Statico → reduced-motion safe. La classe vive in
 * globals.css (`.hz-glitch-grain`), condivisa da tutte le foto.
 */
export default function GlitchFX() {
  return <span className="hz-glitch-grain" aria-hidden="true" />
}
