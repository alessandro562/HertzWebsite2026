/* ────────────────────────────────────────────────────────────
   HERTZ · CONTENT LAYER · ARTISTS (resident)
   Migrata da hertz-artist.js. I campi verificabili (nome, ruolo,
   freq, social, portrait, gallery) sono completi. Le bio vanno
   copiate integralmente dal sorgente legacy in fase di migrazione:
   dove manca il testo completo trovi // TODO:bio.

   Path immagine → /assets/... (public/assets nel nuovo progetto).

   // TODO:data — `social.booking` usa 'booking@hertz.cc' su tutti e 4 i
   // resident (valore ereditato dal sorgente legacy), mentre il dominio
   // sitewide reale è hertzclubbing.com e l'email di contatto generale in
   // src/lib/site.ts è hertzbologna@gmail.com. Non ho unificato questo
   // campo perché non so se booking@hertz.cc è un alias attivo distinto
   // (es. inbox booking dedicata) o un refuso del sito legacy: richiede
   // conferma umana della fonte corretta prima di essere corretto o rimosso.
   ──────────────────────────────────────────────────────────── */

import type { ResidentSlug } from './events';

export interface Mix {
  t: string;
  url: string;
  tag?: string;
}

export interface Social {
  soundcloud?: string;
  spotify?: string;
  instagram?: string;
  booking?: string;
}

export interface Artist {
  slug: ResidentSlug;
  name: string;
  role: string;
  n: string;        // numero
  freq: string;     // "frequenza" identitaria, es. '120 Hz'
  portrait: string;
  gallery: string[];
  bio: string[];
  mixes: Mix[];
  social: Social;
}

export const ARTISTS: Record<ResidentSlug, Artist> = {
  'federico-apadula': {
    slug: 'federico-apadula',
    name: 'Federico Apadula',
    role: 'Founder · Art Director · DJ & Producer',
    n: '01',
    freq: '120 Hz',
    portrait: '/assets/dj-apadula.jpg',
    gallery: [
      '/assets/federico-apadula-live-1.jpg',
      '/assets/federico-apadula-live-2.jpg',
      '/assets/federico-apadula-live-3.jpg',
      '/assets/federico-apadula-live-4.jpg',
    ],
    bio: [
      "Founder and Art Director of the Hertz collective, Federico Apadula has shaped the project's sonic identity for years, pursuing a precise artistic vision built on the centrality of musical selection.",
      // TODO:bio — completa i paragrafi restanti da hertz-artist.js
    ],
    mixes: [
      { t: 'Tomi & Kesh × Federico Apadula', tag: 'Featured', url: 'https://soundcloud.com/tomi-and-kesh/tomi-kesh-federico-apadula' },
      { t: 'Live @ Sonder — City Hall, Barcelona', url: 'https://soundcloud.com/hertzclubbingcollective/federico-apadula-sonder-city-hall-barcelona-16-03-24-opening-chicks-luv-us' },
      { t: 'MMM077 — Special Guest Mix', url: 'https://soundcloud.com/lambertogabrieli/mmm077-federico-apadula-special-guest-mix-jun-2021' },
    ],
    social: {
      soundcloud: 'https://soundcloud.com/federico-apadula',
      spotify: 'https://open.spotify.com/artist/0hS1cnWGJvml5gSHRKHtGi',
      booking: 'booking@hertz.cc',
    },
  },

  'tommaso-manco': {
    slug: 'tommaso-manco',
    name: 'Tommaso Mancò',
    role: 'DJ & Producer',
    n: '02',
    freq: '128 Hz',
    portrait: '/assets/dj-manco.jpg',
    gallery: [
      '/assets/tommaso-manco-live-1.jpg',
      '/assets/tommaso-manco-live-2.jpg',
      '/assets/tommaso-manco-live-3.jpg',
      '/assets/tommaso-manco-live-4.jpg',
    ],
    bio: [
      'Born in 2001, Tommaso Mancò is a DJ from Abruzzo who discovered his passion for electronic music among the iconic parties of the Romagna riviera. It was there that he started building his musical culture and shaping his artistic identity.',
      // TODO:bio — completa da hertz-artist.js
    ],
    mixes: [], // TODO:mixes — verifica in hertz-artist.js
    social: {
      // TODO:social — soundcloud/spotify da verificare in hertz-artist.js
      booking: 'booking@hertz.cc',
    },
  },

  'alberto-b': {
    slug: 'alberto-b',
    name: 'Alberto B',
    role: 'DJ & Producer',
    n: '03',
    freq: '125 Hz',
    portrait: '/assets/dj-alberto.jpg',
    gallery: [
      '/assets/alberto-b-live-1.jpg',
      '/assets/alberto-b-live-2.jpg',
      '/assets/alberto-b-live-3.jpg',
      '/assets/alberto-b-live-4.jpg',
    ],
    bio: [
      "Producer and DJ based in Bologna, Alberto B brings a producer's ear to every set: textured, layered, always searching. His sound moves through deep tech and groove with a level of detail that rewards close listening.",
      // TODO:bio — completa da hertz-artist.js
    ],
    mixes: [
      { t: 'Hot Girl', url: 'https://soundcloud.com/alberto-baccianti/alberto-b-hot-girl' },
      { t: 'In My Zone', url: 'https://soundcloud.com/alberto-baccianti/in-my-zone' },
      { t: 'You Should B Dancing', url: 'https://soundcloud.com/alberto-baccianti/alberto-b-you-should-b-dancing' },
    ],
    social: {
      soundcloud: 'https://soundcloud.com/alberto-baccianti',
      spotify: 'https://open.spotify.com/artist/7kHLiQODROJuJtGEgAYd8d',
      booking: 'booking@hertz.cc',
    },
  },

  'leonardo-giusti': {
    slug: 'leonardo-giusti',
    name: 'Leonardo Giusti',
    role: 'DJ & Producer',
    n: '04',
    freq: '126 Hz',
    portrait: '/assets/dj-giusti.jpg',
    gallery: [
      '/assets/leonardo-giusti-live-1.jpg',
      '/assets/leonardo-giusti-live-2.jpg',
      '/assets/leonardo-giusti-live-3.jpg',
      '/assets/leonardo-giusti-live-4.jpg',
    ],
    bio: [
      "Born in Bologna in 2004, Leonardo Giusti was drawn to electronic music from a very young age, gradually shaping a sonic identity rooted in the more groove-driven shades of Tech House and Minimal Deep Tech.",
      "Ambitious, driven and constantly evolving, Leonardo is one of the emerging names of Bologna's new electronic scene: a young DJ with a clear vision, a strong desire to grow, and the goal of turning every set into a genuine experience for the floor.",
    ],
    mixes: [
      { t: 'Live @ Hertz / Kindergarten — 26.12.2025', tag: 'Featured', url: 'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-hertz-kindergarten-italy-26122025' },
      { t: 'Live @ Zanzibar', url: 'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-zanzibar' },
      { t: 'REC013', url: 'https://soundcloud.com/leonardo-giusti-286676267/rec013' },
    ],
    social: {
      soundcloud: 'https://soundcloud.com/leonardo-giusti-286676267',
      booking: 'booking@hertz.cc',
    },
  },
};

/* NOTA: il profilo di Matteo Fava non è ancora nel sorgente legacy:
   servono file sorgente e verifica prima di aggiungerlo qui. */
