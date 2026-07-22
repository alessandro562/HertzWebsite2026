/* eslint-disable @next/next/no-img-element */
import styles from './BrandIdentity.module.css'

/** Identità visiva "Clubbing Collective" — strip di 4 frame brand reali. */
const CARDS = [
  { src: '/assets/brand-1.jpg', cap: 'Made in (BO)' },
  { src: '/assets/brand-2.jpg', cap: 'Positive energy · Quality sound' },
  { src: '/assets/brand-3.jpg', cap: 'Clubbing Collective' },
  { src: '/assets/brand-4.jpg', cap: 'We live in frequency' },
]

export default function BrandIdentity() {
  return (
    <div>
      <div className={styles.head}>
        <span className={`${styles.kicker} hz-mono`}>Visual identity</span>
        <p className={styles.taglines}>
          <span>Positive energy</span>
          <span>Quality sound</span>
          <span className={styles.mark}>©© Hertz.cc · Made in (BO)</span>
        </p>
      </div>
      <div className={styles.strip}>
        {CARDS.map((c, i) => (
          <figure key={c.src} className={styles.card}>
            <img src={c.src} alt={c.cap} loading="lazy" />
            <figcaption className="hz-mono">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{c.cap}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={`${styles.railhint} hz-mono`}>
        <span>←</span>
        <span>Swipe</span>
        <span>→</span>
      </div>
    </div>
  )
}
