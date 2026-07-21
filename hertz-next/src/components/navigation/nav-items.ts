/**
 * Voci di navigazione condivise tra Header e Footer.
 * NOTA (CP1.1): finché le pagine non esistono, gli href puntano ad ANCHOR
 * della homepage (niente 404). In Fase 2 diventano route reali (/events…).
 */
export const NAV_ITEMS = [
  { label: 'Events', href: '#events' },
  { label: 'Artists', href: '#artists' },
  { label: 'Music', href: '#music' },
  { label: 'Media', href: '#media' },
  { label: 'About', href: '#manifesto' },
  { label: 'Archive', href: '#archive' },
  { label: 'Shop', href: '#shop' },
] as const
