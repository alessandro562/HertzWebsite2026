import type { Metadata } from 'next'
import { upcoming, dowDate } from '@/content/events'
import SignatureStage from './SignatureStage'
import styles from './signature-hero.module.css'

/**
 * PROTOTIPO Fase 4/5 — momento firma, isolato in /lab (non produzione).
 * Composizione statica server-rendered (poster/LCP) + logo 3D ufficiale
 * montato lazy dietro (vedi SignatureStage). NON è la home reale.
 */
export const metadata: Metadata = {
  title: 'Signature Hero · lab',
  robots: { index: false, follow: false }, // prototipo: fuori dagli indici
}

export default function SignatureHeroLab() {
  const next = upcoming()[0]

  return (
    <main className={styles.hero}>
      {/* [0] slot loop video (stub su token) — futuro asset Higgsfield.
          TODO(loop): sostituire con <video> muto/loop generato con Higgsfield
          (generate_video, asset astratto on-token, mai foto/persone finte). */}
      <div className={styles.loopSlot} aria-hidden="true" />

      {/* [1] foto floor reale (assets/), desaturata come texture di sfondo */}
      <div className={styles.photo} aria-hidden="true" />

      {/* [2] tipografia HERTZ (architettura) + logo 3D ufficiale */}
      <div className={styles.content}>
        <p className={styles.kicker}>// signature · hertz</p>
        <SignatureStage />
        <h1 id="sig-wordmark" className={styles.wordmark}>HERTZ</h1>
      </div>

      {/* [3] prossimo evento reale + CTA Tickets (sempre visibile) */}
      <div className={styles.info}>
        {next && (
          <>
            <div className={styles.eventMeta}>
              <span className={styles.cat}>{next.n}</span>
              <span>{dowDate(next)}</span>
              <span>{next.venue} · {next.city}</span>
              {next.badge && <span className={styles.badge}>{next.badge}</span>}
              {next.onSale && <span className={styles.onsale}>On sale</span>}
            </div>
            <h2 className={styles.eventTitle}>{next.title}</h2>
          </>
        )}
        <a id="sig-cta" className={styles.cta} href="#tickets">
          Tickets ↗
        </a>
      </div>
    </main>
  )
}
