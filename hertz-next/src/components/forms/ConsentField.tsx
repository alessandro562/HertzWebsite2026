import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import styles from './ConsentField.module.css'

const T = {
  en: {
    before: 'I have read the ',
    link: 'privacy notice',
    after: ' and I consent to my data being processed to answer this request. *',
  },
  it: {
    before: 'Ho letto l’',
    link: 'informativa privacy',
    after: ' e acconsento al trattamento dei miei dati per rispondere a questa richiesta. *',
  },
} as const

/**
 * Checkbox di consenso privacy, obbligatoria, condivisa da tutti i form che
 * raccolgono dati personali (booking, guest list, shop, newsletter). Il valore
 * `consent` finisce nel payload → tracciato nei log come prova del consenso.
 * Segue la lingua del form: prima era italiano fisso anche dentro form inglesi.
 */
export default function ConsentField({ lang = 'en' }: { lang?: Lang }) {
  const t = T[lang]
  return (
    <label className={styles.consent}>
      <input type="checkbox" name="consent" value="yes" required className={styles.box} />
      <span className={styles.text}>
        {t.before}
        <Link href="/privacy" target="_blank" className={styles.link}>
          {t.link}
        </Link>
        {t.after}
      </span>
    </label>
  )
}
