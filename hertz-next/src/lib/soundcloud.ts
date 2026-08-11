/**
 * getArtwork — copertina reale della traccia via oEmbed pubblico di SoundCloud
 * (nessuna API key). Build-time only (Server Components); null se la fetch
 * fallisce, così MixRow ricade sul glifo waveform esistente.
 */
export async function getArtwork(trackUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`)
    if (!res.ok) return null
    const data = (await res.json()) as { thumbnail_url?: string }
    return data.thumbnail_url ?? null
  } catch {
    return null
  }
}
