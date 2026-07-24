import Link from 'next/link'
import styles from './ConsentField.module.css'

/**
 * Checkbox di consenso privacy, obbligatoria, condivisa da tutti i form che
 * raccolgono dati personali (booking, guest list, shop). Il valore `consent`
 * finisce nel payload → tracciato nei log come prova del consenso.
 */
export default function ConsentField() {
  return (
    <label className={styles.consent}>
      <input type="checkbox" name="consent" value="yes" required className={styles.box} />
      <span className={styles.text}>
        Ho letto l&rsquo;
        <Link href="/privacy" target="_blank" className={styles.link}>
          informativa privacy
        </Link>{' '}
        e acconsento al trattamento dei miei dati per rispondere a questa richiesta. *
      </span>
    </label>
  )
}
