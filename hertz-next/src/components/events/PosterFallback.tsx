import styles from './PosterFallback.module.css'

/**
 * PosterFallback — placeholder proprietario quando la locandina non è ancora
 * pronta. NON un wireframe: un mini-poster tipografico che scala col contenitore
 * (font in cqi) ed è elegante sia nel thumb piccolo sia nel poster grande della
 * pagina evento. Superficie Signal con profondità, sinusoide Hertz che attraversa
 * la card come texture d'identità, wordmark in alto e data protagonista in basso
 * (weekday + giorno grande, città su hairline). Un solo componente riusato da
 * FeaturedEvent, EventModule, EventPosterPortal e la pagina evento.
 */
export default function PosterFallback({
  date,
  city,
  className = '',
}: {
  date?: string
  city?: string
  className?: string
}) {
  // "FRI 14.08" → weekday ("FRI") + giorno ("14.08"); robusto se manca lo spazio
  const parts = (date ?? '').trim().split(/\s+/).filter(Boolean)
  const dow = parts.length > 1 ? parts[0] : ''
  const day = parts.length > 1 ? parts.slice(1).join(' ') : (parts[0] ?? '')

  return (
    <div className={`${styles.fallback} ${className}`.trim()}>
      <span className={styles.texture} aria-hidden="true" />
      <svg
        className={styles.wave}
        viewBox="0 0 120 24"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0,12 H44 C50,12 52,4 58,4 C64,4 66,12 72,12 H120"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className={styles.brand}>hertz</span>

      {(dow || day || city) && (
        <div className={styles.info}>
          {dow && <span className={`${styles.dow} hz-mono`}>{dow}</span>}
          {day && <span className={styles.day}>{day}</span>}
          {city && <span className={`${styles.city} hz-mono`}>{city}</span>}
        </div>
      )}
    </div>
  )
}
