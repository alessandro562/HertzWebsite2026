import Image from 'next/image'
import styles from './Partners.module.css'

/**
 * Le "case" del collettivo — venue partner reali (Kindergarten · Bologna,
 * Buongiorno Classic · Rimini). I marchi forniti sono line-art chiari: si
 * mostrano su pannello scuro (ink) così restano leggibili, con nome + città.
 */
const PARTNERS = [
  {
    name: 'Kindergarten',
    city: 'Bologna',
    logo: '/assets/collab-kindergarten.png',
  },
  {
    name: 'Buongiorno Classic',
    city: 'Rimini',
    logo: '/assets/collab-buongiorno-classic.png',
  },
]

export default function Partners() {
  return (
    <div>
      <span className={`${styles.kicker} hz-mono`}>In collaboration with</span>
      <div className={styles.grid}>
        {PARTNERS.map((p) => (
          <div key={p.name} className={`${styles.card} hz-cardfx`}>
            <div className={styles.panel} data-surface="ink">
              <Image
                src={p.logo}
                alt={`${p.name} logo`}
                className={styles.logo}
                width={440}
                height={437}
                sizes="220px"
              />
            </div>
            <div className={styles.caption}>
              <span className={styles.name}>{p.name}</span>
              <span className={`${styles.city} hz-mono`}>{p.city}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
