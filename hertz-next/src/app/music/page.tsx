import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import MixRow from '@/components/music/MixRow'
import JsonLd from '@/components/seo/JsonLd'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, breadcrumbNode, itemListNode } from '@/lib/seo'
import { getArtwork } from '@/lib/soundcloud'
import styles from './music.module.css'

export const metadata: Metadata = {
  title: 'DJ Sets, Mixes & Productions',
  description:
    'Hertz DJ sets, mixes and productions on SoundCloud and Spotify: minimal and deep tech, long grooves and basslines recorded from the floor.',
  keywords: ['dj set', 'mix', 'produzioni', 'soundcloud', 'groove', 'bassline', 'minimal', 'deep tech'],
  alternates: { canonical: '/music' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/music`,
    title: 'DJ Sets, Mixes & Productions · Hertz Clubbing Collective',
    description:
      'Hertz DJ sets, mixes and productions on SoundCloud and Spotify: minimal and deep tech, groove and bassline.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const ROSTER = Object.values(ARTISTS).sort((a, b) => a.n.localeCompare(b.n))
const WITH_MIXES = ROSTER.filter((a) => a.mixes.length > 0)
const ON_SPOTIFY = ROSTER.filter((a) => a.social.spotify)

const SC_LOGO = '/assets/logo-soundcloud-dark.png'
const SP_LOGO = '/assets/logo-spotify-dark.png'

export default async function MusicPage() {
  const allMixes = WITH_MIXES.flatMap((a) => a.mixes)
  const artworks = await Promise.all(allMixes.map((m) => getArtwork(m.url)))
  const artByUrl = new Map(allMixes.map((m, i) => [m.url, artworks[i]]))

  /* La selezione come playlist: nome del set + autore reale, così una query
     tipo "mix minimal Hertz" trova le tracce e non solo la pagina. */
  const selection = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Hertz — the selection',
    description:
      'Resident DJ sets, mixes and productions from the Hertz clubbing collective: minimal and deep tech.',
    numTracks: allMixes.length,
    url: `${SITE.url}/music`,
    track: WITH_MIXES.flatMap((a) =>
      a.mixes.map((m) => ({
        '@type': 'MusicRecording',
        name: m.t,
        url: m.url,
        byArtist: {
          '@type': 'Person',
          '@id': `${SITE.url}/artists/${a.slug}#person`,
          name: a.name,
        },
        ...(m.tag ? { genre: m.tag } : {}),
      })),
    ),
  }

  return (
    <main id="main">
      <JsonLd data={selection} />
      <JsonLd
        data={itemListNode(
          'Hertz residents on streaming',
          ROSTER.map((a) => ({ name: a.name, url: `${SITE.url}/artists/${a.slug}` })),
        )}
      />
      <JsonLd data={breadcrumbNode([{ name: 'Music', path: '/music' }])} />

      {/* ── header editoriale + barra piattaforme ── */}
      <Section surface="paper" space="md">
        <div className={styles.head}>
          <p className={`${styles.kicker} hz-mono`}>Music</p>
          <h1 className={styles.title}>The selection.</h1>
          <div className={styles.headRow}>
            <p className={styles.intro}>
              The records that build the Hertz floor: resident sets and studio cuts, minimal &amp;
              deep tech, selection first. Nothing plays on its own, so just tap to listen.
            </p>
            {/* niente aria-label sui chip: sostituiva il testo visibile
                ("Sets", "Residents") con il solo nome della piattaforma, che
                l'alt del logo già fornisce. Ora il nome accessibile contiene
                l'etichetta che si legge a schermo. */}
            <div className={styles.platformBar}>
              <a href={SITE.soundcloud} target="_blank" rel="noreferrer" className={styles.chip}>
                <Image src={SC_LOGO} alt="SoundCloud" className={styles.chipLogo} width={104} height={36} sizes="52px" />
                <span className={`${styles.chipMeta} hz-mono`}>Sets <Arrow /></span>
              </a>
              <a href="#spotify" className={styles.chip}>
                <Image src={SP_LOGO} alt="Spotify" className={styles.chipLogo} width={104} height={36} sizes="52px" />
                <span className={`${styles.chipMeta} hz-mono`}>Residents ↓</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SOUNDCLOUD ── */}
      <Section surface="white" space="md" id="soundcloud">
        {/* il logo È il titolo di sezione: incapsularlo in un h2 ripristina il
            livello mancante (la pagina saltava da h1 ai nomi degli artisti) */}
        <div className={styles.platHead}>
          <h2 className={styles.platHeading}>
            <Image src={SC_LOGO} alt="SoundCloud" className={styles.platLogo} width={240} height={84} sizes="120px" />
          </h2>
          <p className={styles.platSub}>
            The collective and every resident&rsquo;s sets, streamed straight from SoundCloud.
          </p>
          <Button href={SITE.soundcloud} external variant="ghost" arrow>
            {SITE.soundcloudHandle}
          </Button>
        </div>

        <div className={styles.groups}>
          {WITH_MIXES.map((a) => (
            <div key={a.slug} className={styles.group}>
              <div className={styles.groupHead}>
                <h3 className={styles.groupName}>{a.name}</h3>
                <Link href={`/artists/${a.slug}`} className={styles.groupLink}>
                  Profile <Arrow />
                </Link>
              </div>
              <div className={styles.groupMixes}>
                {a.mixes.map((m) => (
                  <MixRow key={m.url} mix={m} artist={a.name} art={artByUrl.get(m.url)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SPOTIFY ── */}
      {ON_SPOTIFY.length > 0 && (
        <Section surface="paper" space="md" id="spotify">
          <div className={styles.platHead}>
            <h2 className={styles.platHeading}>
              <Image src={SP_LOGO} alt="Spotify" className={styles.platLogo} width={240} height={84} sizes="120px" />
            </h2>
            <p className={styles.platSub}>Residents you can follow and stream on Spotify.</p>
          </div>

          <div className={styles.spotifyGrid}>
            {ON_SPOTIFY.map((a) => (
              <a
                key={a.slug}
                href={a.social.spotify}
                target="_blank"
                rel="noreferrer"
                className={styles.spotifyCard}
              >
                <span className={`${styles.spotifyArt} hz-glitch`}>
                  <Image src={a.portrait} alt={a.name} fill sizes="96px" />
                  <GlitchFX />
                </span>
                <div className={styles.spotifyMeta}>
                  <span className={styles.spotifyName}>{a.name}</span>
                  <span className={`${styles.spotifyGo} hz-mono`}>Open on Spotify <Arrow /></span>
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}
