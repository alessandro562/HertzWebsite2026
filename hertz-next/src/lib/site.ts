/* ────────────────────────────────────────────────────────────
   HERTZ · SITE CONFIG — costanti condivise (canali REALI)
   Fonte unica per email/social/dominio. I componenti importano da qui
   invece di ripetere stringhe o esporre drift morti (es. booking@hertz.cc).
   ──────────────────────────────────────────────────────────── */

export const SITE = {
  name: 'Hertz Clubbing Collective',
  shortName: 'Hertz',
  city: 'Bologna, IT',
  since: 2023,
  sound: 'Minimal & deep tech',
  domain: 'hertzclubbing.com',
  url: 'https://hertzclubbing.com',
  email: 'hertzbologna@gmail.com',
  instagram: 'https://instagram.com/hertz.cc',
  instagramHandle: '@hertz.cc',
  soundcloud: 'https://soundcloud.com/hertzclubbingcollective',
  soundcloudHandle: 'hertzclubbingcollective',
} as const

export const MAILTO = `mailto:${SITE.email}`

/** mailto con subject/body precompilati (per booking/reserve dai vari CTA) */
export function mailto(subject: string, body?: string): string {
  const q = new URLSearchParams({ subject, ...(body ? { body } : {}) })
  return `${MAILTO}?${q.toString()}`
}
