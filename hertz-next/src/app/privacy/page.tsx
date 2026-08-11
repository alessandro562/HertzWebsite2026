import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import { SITE } from '@/lib/site'
import styles from './privacy.module.css'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Informativa sul trattamento dei dati personali raccolti tramite i moduli del sito Hertz (booking, guest list, shop).',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    /* pagina interamente in italiano sotto <html lang="en"> */
    <main id="main" lang="it">
      <Section surface="white" space="lg">
        <PageHeader
          kicker="Legal"
          title="Informativa privacy."
          intro={
            <p className="hz-mono">
              Come trattiamo i dati personali raccolti tramite i moduli del sito. Ultimo
              aggiornamento: bozza.
            </p>
          }
        />

        <div className={styles.prose}>
          <p className={styles.note}>
            Bozza da completare con i dati del titolare e la revisione legale prima della
            pubblicazione.
          </p>

          <h2>1. Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento è{' '}
            <mark className={styles.ph}>[Hertz · ragione sociale / nome del titolare]</mark>,{' '}
            <mark className={styles.ph}>[indirizzo]</mark>,{' '}
            <mark className={styles.ph}>[P.IVA / C.F.]</mark>. Per qualsiasi richiesta relativa ai
            tuoi dati puoi scrivere a{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>

          <h2>2. Quali dati raccogliamo</h2>
          <p>
            Raccogliamo solo i dati che ci fornisci volontariamente compilando i moduli del sito:
          </p>
          <ul>
            <li>
              <strong>Booking</strong> (artisti / format): nome, email, e in via facoltativa
              organizzazione, venue, città, data, capienza, budget e i dettagli della richiesta.
            </li>
            <li>
              <strong>Guest list eventi</strong>: nome, email e, in via facoltativa, telefono.
            </li>
            <li>
              <strong>Shop</strong> (prenotazione / lista d&rsquo;attesa): nome ed email.
            </li>
          </ul>
          <p>Non raccogliamo categorie particolari di dati e non profiliamo gli utenti.</p>

          <h2>3. Perché li trattiamo</h2>
          <p>
            Usiamo i dati esclusivamente per rispondere alla tua richiesta (booking, iscrizione
            alla guest list, prenotazione di un prodotto) e gestire la relativa comunicazione via
            email. Non inviamo comunicazioni promozionali senza un consenso separato.
          </p>

          <h2>4. Base giuridica</h2>
          <p>
            Il trattamento si fonda sul tuo <strong>consenso</strong> (art. 6.1.a GDPR), prestato
            spuntando la casella dedicata al momento dell&rsquo;invio, e sull&rsquo;esecuzione di
            misure precontrattuali richieste da te (art. 6.1.b GDPR).
          </p>

          <h2>5. Come li trattiamo e per quanto</h2>
          <p>
            Le richieste ci arrivano via email attraverso il fornitore{' '}
            <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">
              Resend
            </a>{' '}
            (fornitore dell&rsquo;infrastruttura di invio, che può comportare un trasferimento verso
            gli Stati Uniti con adeguate garanzie). Conserviamo i dati per il tempo necessario a
            gestire la richiesta e comunque non oltre{' '}
            <mark className={styles.ph}>[periodo di conservazione, es. 24 mesi]</mark>, salvo
            obblighi di legge.
          </p>

          <h2>6. A chi li comunichiamo</h2>
          <p>
            I dati non vengono diffusi né venduti. Possono essere trattati dai fornitori tecnici
            necessari a erogare il servizio (hosting su Vercel, invio email tramite Resend), che
            agiscono come responsabili del trattamento.
          </p>

          <h2>7. I tuoi diritti</h2>
          <p>
            Puoi in ogni momento esercitare i diritti di accesso, rettifica, cancellazione,
            limitazione, opposizione e portabilità, e revocare il consenso, scrivendo a{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Hai inoltre diritto di proporre
            reclamo all&rsquo;Autorità Garante per la protezione dei dati personali.
          </p>

          <h2>8. Cookie</h2>
          <p>
            Questo sito <strong>non utilizza cookie di profilazione né strumenti di analisi</strong>
            . Vengono impiegati esclusivamente i cookie tecnici necessari al funzionamento. Se in
            futuro introdurremo strumenti di misurazione, aggiorneremo questa informativa e
            richiederemo il consenso.
          </p>
        </div>
      </Section>
    </main>
  )
}
