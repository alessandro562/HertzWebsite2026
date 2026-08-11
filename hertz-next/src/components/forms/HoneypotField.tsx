/**
 * Honeypot anti-spam: campo nascosto agli umani (fuori schermo, aria-hidden,
 * non tabbabile) ma spesso compilato dai bot. Se arriva valorizzato, la route
 * finge il successo e scarta la richiesta (vedi looksLikeBot in lib/notify).
 */
export default function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}
