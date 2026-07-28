import Link from 'next/link'
import type { Artist } from '@/content/artists'
import ImageFrame from '@/components/ui/ImageFrame'
import ViewMorph from '@/motion/ViewMorph'
import styles from './ArtistIndexRow.module.css'

/**
 * Card resident — UNIFORME per tutti i DJ (come il vecchio sito): stesso
 * numero, stessa foto verticale 4:5, stesso font e dimensione per il nome,
 * stesso ruolo, stesso "view profile". Nessuna variazione per artista,
 * nessun riferimento a frequenze/Hz.
 */
export default function ArtistIndexRow({ artist }: { artist: Artist; first?: boolean }) {
  return (
    <Link href={`/artists/${artist.slug}`} className={`${styles.card} hz-cardfx`}>
      <span className={`${styles.top} hz-mono`}>Resident</span>
      <div className={styles.photo}>
        <ViewMorph name={`artist-portrait-${artist.slug}`}>
          <ImageFrame src={artist.portrait} alt={artist.name} ratio="4 / 5" className={styles.photoFrame} />
        </ViewMorph>
      </div>
      <ViewMorph name={`artist-name-${artist.slug}`}>
        <span className={styles.name}>{artist.name}</span>
      </ViewMorph>
      <span className={styles.role}>{artist.role}</span>
      <span className={`${styles.go} hz-mono`}>View profile →</span>
    </Link>
  )
}
