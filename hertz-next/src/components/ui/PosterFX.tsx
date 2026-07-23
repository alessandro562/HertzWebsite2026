/**
 * PosterFX — cluster di overlay "stampa/CRT" da appoggiare come ultimo figlio
 * di un contenitore in position:relative;overflow:hidden (poster evento, card
 * gallery, archivio). Nessun layout proprio: solo le texture (scanline + banda
 * Signal che scorre + phosphor + registration marks agli angoli), riprese dal
 * sito storico e ricolorate sulla firma Signal. Le classi vivono in globals.css
 * (`.hz-scanlines/.hz-scanband/.hz-phosphor/.hz-reg*`) così sono condivise da
 * tutti i punti del sito senza duplicare CSS per-modulo. Reduced-motion:
 * scanline statiche, banda nascosta (gestito in globals.css).
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
      <span className="hz-scanlines" aria-hidden="true" />
      {phosphor && <span className="hz-phosphor" aria-hidden="true" />}
      <span className="hz-scanband" aria-hidden="true" />
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
