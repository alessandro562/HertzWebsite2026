import type { Mix } from '@/content/artists'
import styles from './MixRow.module.css'

/** Riga mix → SoundCloud (nuova scheda). Play on-action, nessun autoplay. */
export default function MixRow({ mix, artist, index }: { mix: Mix; artist: string; index?: number }) {
  return (
    <a href={mix.url} target="_blank" rel="noreferrer" className={styles.row}>
      {typeof index === 'number' && (
        <span className={`${styles.n} hz-mono`}>{String(index + 1).padStart(2, '0')}</span>
      )}
      <span className={styles.play} aria-hidden="true">
        ▶
      </span>
      <span className={styles.main}>
        <span className={styles.title}>{mix.t}</span>
        <span className={styles.artist}>{artist}</span>
      </span>
      <span className={`${styles.tag} hz-mono`}>{mix.tag ?? 'Mix'}</span>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
    </a>
  )
}
