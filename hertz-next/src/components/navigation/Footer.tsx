import Link from 'next/link'
import { NAV_ITEMS } from './nav-items'
import styles from './Footer.module.css'

const EMAIL = 'hertzbologna@gmail.com'
const INSTAGRAM = 'https://instagram.com/hertz.cc'
const SOUNDCLOUD = 'https://soundcloud.com/hertzclubbingcollective'

/**
 * Footer editoriale su superficie Signal (chiara). Solo canali/dati REALI
 * (email, Instagram, SoundCloud). Nessun Spotify (link legacy morto).
 */
export default function Footer() {
  return (
    <footer data-surface="signal" className={styles.footer}>
      <div className="hz-container">
        <div className={styles.top}>
          <p className={styles.statement}>
            See you<br />on the floor.
          </p>
          <span className={styles.logo} aria-hidden="true">
            hertz
          </span>
        </div>

        <div className={styles.grid}>
          <nav className={styles.col} aria-label="Navigazione footer">
            <span className="hz-mono">Navigate</span>
            {NAV_ITEMS.map((i) => (
              <Link key={i.href} href={i.href} className={styles.fLink}>
                {i.label}
              </Link>
            ))}
          </nav>

          <div className={styles.col}>
            <span className="hz-mono">Connect</span>
            <a href={`mailto:${EMAIL}`} className={styles.fLink}>
              {EMAIL}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className={styles.fLink}>
              Instagram ↗
            </a>
            <a href={SOUNDCLOUD} target="_blank" rel="noreferrer" className={styles.fLink}>
              SoundCloud ↗
            </a>
            <Link href="/bookings" className={styles.fLink}>
              Booking
            </Link>
          </div>

          <div className={styles.col}>
            <span className="hz-mono">Info</span>
            <Link href="/about" className={styles.fLink}>
              About
            </Link>
            <Link href="/about" className={styles.fLink}>
              Manifesto
            </Link>
            <Link href="/privacy" className={styles.fLink}>
              Privacy
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className="hz-mono">© 2026 Hertz Clubbing Collective</span>
          <span className="hz-mono">Bologna, IT — Minimal &amp; deep tech · since 2023</span>
        </div>
      </div>
    </footer>
  )
}
