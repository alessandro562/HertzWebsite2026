import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Il repo legacy alla root ha un package-lock.json: senza questo pin,
  // Turbopack inferisce la root del workspace sulla cartella legacy.
  // Fissiamo la root su questa app Next.
  turbopack: {
    root: __dirname,
  },
  images: {
    // copertine delle tracce servite da SoundCloud (oEmbed, build-time):
    // senza questo next/image le rifiuta e restano originali da 500x500.
    remotePatterns: [{ protocol: 'https', hostname: 'i1.sndcdn.com' }],
  },
  experimental: {
    // React <ViewTransition> per i morph condivisi (calendario→evento,
    // artisti→dettaglio). Progressive enhancement: senza supporto browser
    // la navigazione resta normale.
    viewTransition: true,
  },
  // Header di sicurezza di base (safe, non-CSP). Una CSP stretta richiede
  // nonce per gli inline di Next → follow-up dedicato.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
