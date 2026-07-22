/* eslint-disable @next/next/no-img-element */
import styles from './Partners.module.css'

/** Le "case" del collettivo — venue partner reali. */
const PARTNERS = [
  { src: '/assets/collab-kindergarten.png', name: 'Kindergarten' },
  { src: '/assets/collab-buongiorno-classic.png', name: 'Buongiorno Classic' },
]

export default function Partners() {
  return (
    <div>
      <span className={`${styles.kicker} hz-mono`}>In collaboration with</span>
      <div className={styles.grid}>
        {PARTNERS.map((p) => (
          <div key={p.name} className={styles.card}>
            <img src={p.src} alt={p.name} loading="lazy" />
            <span className={`${styles.name} hz-mono`}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
