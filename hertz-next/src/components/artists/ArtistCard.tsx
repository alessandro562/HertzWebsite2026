import Link from 'next/link'
import type { Artist } from '@/content/artists'
import ImageFrame from '@/components/ui/ImageFrame'
import ViewMorph from '@/motion/ViewMorph'
import styles from './ArtistCard.module.css'

/** Card artista → pagina resident. Ritratto 4:5 + nome/ruolo/frequenza. */
export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.slug}`} className={styles.card}>
      <ViewMorph name={`artist-portrait-${artist.slug}`}>
        <ImageFrame src={artist.portrait} alt={artist.name} ratio="4 / 5" className={styles.img} />
      </ViewMorph>
      <div className={styles.meta}>
        <span className={`${styles.n} hz-mono`}>{artist.n}</span>
        <ViewMorph name={`artist-name-${artist.slug}`}>
          <span className={styles.name}>{artist.name}</span>
        </ViewMorph>
        <span className={styles.role}>{artist.role}</span>
        <span className={`${styles.freq} hz-mono`} aria-hidden="true">
          {artist.freq}
        </span>
      </div>
    </Link>
  )
}
