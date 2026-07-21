import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Il repo legacy alla root ha un package-lock.json: senza questo pin,
  // Turbopack inferisce la root del workspace sulla cartella legacy.
  // Fissiamo la root su questa app Next.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // React <ViewTransition> per i morph condivisi (calendario→evento,
    // artisti→dettaglio). Progressive enhancement: senza supporto browser
    // la navigazione resta normale.
    viewTransition: true,
  },
}

export default nextConfig
