import styles from './PosterFallback.module.css'

/**
 * PosterFallback — sostituisce ogni "POSTER · SOON" con un placeholder
 * proprietario Hertz: superficie Signal, frequency grid, numero evento,
 * data/città e il simbolo Hertz (stessa geometria di WaveformPulse, statico).
 * Nessuna diagonale/hatch da wireframe tecnico. Un solo componente riusato
 * da FeaturedEvent, EventModule ed EventPosterPortal.
 */
export default function PosterFallback({
  n,
  date,
  city,
  className = '',
}: {
  n: string
  date?: string
  city?: string
  className?: string
}) {
  return (
    <div className={`${styles.fallback} ${className}`.trim()}>
      <span className={styles.grid} aria-hidden="true" />
      <span className={`${styles.n} hz-mono`}>N°{n}</span>
      <svg className={styles.mark} viewBox="0 0 120 24" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
        <path
          d="M0,12 H44 C50,12 52,4 58,4 C64,4 66,12 72,12 H120"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {(date || city) && (
        <span className={`${styles.meta} hz-mono`}>
          {date}
          {date && city ? ' · ' : ''}
          {city}
        </span>
      )}
    </div>
  )
}
