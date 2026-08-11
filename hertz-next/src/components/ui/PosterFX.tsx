/**
 * PosterFX — texture ELEGANTE per le locandine, da appoggiare come ultimo figlio
 * di un contenitore in position:relative;overflow:hidden (poster evento). Niente
 * CRT/scan/glitch: solo grana fine da stampa + una vignette morbida con un velo
 * Signal + registration marks agli angoli (linguaggio editoriale/print). Le
 * classi vivono in globals.css (`.hz-print-grain / .hz-print-veil / .hz-reg*`),
 * condivise senza duplicare CSS per-modulo. Reduced-motion safe (statiche).
 *
 * `tone` regola il colore dei registration marks via currentColor:
 *  - 'dark'  → poster/foto scure → marks bianchi.
 *  - 'light' → superfici chiare → marks ink.
 */
export default function PosterFX({
  tone = 'dark',
  phosphor = true,
  reg = true,
}: {
  tone?: 'dark' | 'light'
  phosphor?: boolean
  reg?: boolean
}) {
  const color = tone === 'light' ? 'var(--hz-ink)' : 'rgba(255,255,255,0.82)'
  return (
    <>
      <span className="hz-print-grain" aria-hidden="true" />
      {phosphor && <span className="hz-print-veil" aria-hidden="true" />}
      {reg && (
        <span aria-hidden="true" style={{ color }}>
          <span className="hz-reg hz-reg-tl" />
          <span className="hz-reg hz-reg-tr" />
          <span className="hz-reg hz-reg-bl" />
          <span className="hz-reg hz-reg-br" />
        </span>
      )}
    </>
  )
}
