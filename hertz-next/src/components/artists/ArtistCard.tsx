import Link from 'next/link'
import type { Artist } from '@/content/artists'
import ImageFrame from '@/components/ui/ImageFrame'
import styles from './ArtistCard.module.css'

/** Card artista → pagina resident. Ritratto 4:5 + nome/ruolo/frequenza. */
export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.slug}`} className={styles.card}>
      <ImageFrame src={artist.portrait} alt={artist.name} ratio="4 / 5" className={styles.img} />
      <div className={styles.meta}>
        <span className={`${styles.n} hz-mono`}>{artist.n}</span>
        <span className={styles.name}>{artist.name}</span>
        <span className={styles.role}>{artist.role}</span>
        <span className={`${styles.freq} hz-mono`} aria-hidden="true">
          {artist.freq}
        </span>
      </div>
    </Link>
  )
}
