/* ────────────────────────────────────────────────────────────
   HERTZ · SITE CONFIG — costanti condivise (canali REALI)
   Fonte unica per email/social/dominio. I componenti importano da qui
   invece di ripetere stringhe o esporre drift morti (es. booking@hertz.cc).
   ──────────────────────────────────────────────────────────── */

/* Dominio canonico: override via NEXT_PUBLIC_SITE_URL (es. preview deploy),
   default sul dominio di lancio. Da qui derivano metadataBase, canonical,
   sitemap, robots e i link OG assoluti. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hertzclubbing.com').replace(/\/$/, '')

export const SITE = {
  name: 'Hertz Clubbing Collective',
  shortName: 'Hertz',
  city: 'Bologna, IT',
  since: 2023,
  sound: 'Minimal & deep tech',
  domain: SITE_URL.replace(/^https?:\/\//, ''),
  url: SITE_URL,
  email: 'hertzbologna@gmail.com',
  instagram: 'https://instagram.com/hertz.cc',
  instagramHandle: '@hertz.cc',
  soundcloud: 'https://soundcloud.com/hertzclubbingcollective',
  soundcloudHandle: 'hertzclubbingcollective',
  // Costanti editoriali reali (legacy): credito foto press, closer, safe-space.
  pressCredit: '@HERTZ.CC',
  closer: 'Keep the groove.',
  safeSpace:
    "No harassment, no hate, no discrimination. Respect boundaries, yours and others'. The dancefloor is for everyone.",
} as const

export const MAILTO = `mailto:${SITE.email}`

/** mailto con subject/body precompilati (per booking/reserve dai vari CTA) */
export function mailto(subject: string, body?: string): string {
  const q = new URLSearchParams({ subject, ...(body ? { body } : {}) })
  return `${MAILTO}?${q.toString()}`
}
