import styles from './Partners.module.css'

/**
 * Le "case" del collettivo — venue partner reali (Kindergarten · Bologna,
 * Buongiorno Classic · Rimini). Trattamento tipografico: i file logo forniti
 * sono line-art chiari, illeggibili sulla superficie White → si usano i nomi.
 */
const PARTNERS = [
  { name: 'Kindergarten', city: 'Bologna' },
  { name: 'Buongiorno Classic', city: 'Rimini' },
]

export default function Partners() {
  return (
    <div>
      <span className={`${styles.kicker} hz-mono`}>In collaboration with</span>
      <div className={styles.grid}>
        {PARTNERS.map((p) => (
          <div key={p.name} className={styles.card}>
            <span className={styles.name}>{p.name}</span>
            <span className={`${styles.city} hz-mono`}>{p.city}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
