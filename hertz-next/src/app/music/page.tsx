import type { Metadata } from 'next'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import MixRow from '@/components/music/MixRow'
import { ARTISTS } from '@/content/artists'
import { SITE } from '@/lib/site'
import { getArtwork } from '@/lib/soundcloud'
import styles from './music.module.css'

export const metadata: Metadata = {
  title: 'Music',
  description:
    'Le trasmissioni Hertz: set e mix dei resident su SoundCloud, e i resident da seguire su Spotify. Minimal & deep tech.',
  alternates: { canonical: '/music' },
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
  return (
    <main id="main">
      {/* ── header editoriale + barra piattaforme ── */}
      <Section surface="paper" space="md">
        <div className={styles.head}>
          <p className={`${styles.kicker} hz-mono`}>03 / Music</p>
          <h1 className={styles.title}>The selection.</h1>
          <div className={styles.headRow}>
            <p className={styles.intro}>
              The records that build the Hertz floor: resident sets and studio cuts, minimal &amp;
              deep tech, selection first. No autoplay, play on tap.
            </p>
            <div className={styles.platformBar}>
              <a
                href={SITE.soundcloud}
                target="_blank"
                rel="noreferrer"
                className={styles.chip}
                aria-label="SoundCloud"
              >
                <img src={SC_LOGO} alt="SoundCloud" className={styles.chipLogo} />
                <span className={`${styles.chipMeta} hz-mono`}>Sets <Arrow /></span>
              </a>
              <a href="#spotify" className={styles.chip} aria-label="Spotify">
                <img src={SP_LOGO} alt="Spotify" className={styles.chipLogo} />
                <span className={`${styles.chipMeta} hz-mono`}>Residents ↓</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SOUNDCLOUD ── */}
      <Section surface="white" space="md" id="soundcloud">
        <div className={styles.platHead}>
          <img src={SC_LOGO} alt="SoundCloud" className={styles.platLogo} />
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
            <img src={SP_LOGO} alt="Spotify" className={styles.platLogo} />
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
                  <img src={a.portrait} alt={a.name} loading="lazy" decoding="async" />
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
