import styles from './KineticBand.module.css'

interface Props {
  /** parole grandi della riga 1 (bianco) */
  primary?: string[]
  /** parole/dati della riga 2 (Signal), scorre in senso opposto */
  secondary?: string[]
  labelLeft?: string
  labelRight?: string
  /** superficie: ink (default) o signal per una variante chiara */
  surface?: 'ink' | 'signal'
}

const DEF_PRIMARY = ['ORDER', 'DISORDER']
const DEF_SECONDARY = ['44.49° N', '11.34° E', 'BOLOGNA', 'CLUBBING COLLECTIVE']

/**
 * Banda cinetica ORDER / DISORDER (riferimento R1, ripulito).
 * Marquee seamless: due copie identiche della traccia dentro un contenitore
 * che trasla di -50% → loop senza salto. Righe in direzioni opposte.
 * Decorativa (aria-hidden sul marquee) ma la sezione è etichettata.
 * Reduced-motion → statica (gestito nel CSS).
 */
export default function KineticBand({
  primary = DEF_PRIMARY,
  secondary = DEF_SECONDARY,
  labelLeft = '01 / SIGNAL',
  labelRight = 'CONCEPT · EVENT DATA',
  surface = 'ink',
}: Props) {
  // traccia abbastanza lunga da coprire viewport larghi prima del loop
  const rowA = Array.from({ length: 6 }).flatMap(() => primary)
  const rowB = Array.from({ length: 4 }).flatMap(() => secondary)

  const Track = ({ words, cls }: { words: string[]; cls: string }) => (
    <div className={`${styles.track} ${cls}`}>
      {words.map((w, i) => (
        <span key={i} className={styles.word}>
          {w}
          <i className={styles.sep} aria-hidden="true">
            /
          </i>
        </span>
      ))}
    </div>
  )

  return (
    <section
      className={styles.band}
      data-surface={surface}
      aria-label="Hertz — order / disorder / Bologna clubbing collective"
    >
      <div className={styles.labels}>
        <span className="hz-mono">
          <span className={styles.idx}>{labelLeft}</span>
        </span>
        <span className="hz-mono">{labelRight}</span>
      </div>

      <div className={styles.marquee}>
        <div className={styles.inner} data-dir="left" style={{ ['--dur' as string]: '34s' }} aria-hidden="true">
          <Track words={rowA} cls={styles.rowPrimary} />
          <Track words={rowA} cls={styles.rowPrimary} />
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.inner} data-dir="right" style={{ ['--dur' as string]: '46s' }} aria-hidden="true">
          <Track words={rowB} cls={styles.rowSecondary} />
          <Track words={rowB} cls={styles.rowSecondary} />
        </div>
      </div>
    </section>
  )
}
