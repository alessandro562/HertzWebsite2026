import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { allEventSlugs } from '@/content/events'
import { ARTISTS } from '@/content/artists'
import { ARTICLES } from '@/content/media'

const STATIC_ROUTES = [
  '',
  '/events',
  '/artists',
  '/music',
  '/media',
  '/about',
  '/archive',
  '/shop',
  '/bookings',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
  }))

  const eventEntries: MetadataRoute.Sitemap = allEventSlugs().map((slug) => ({
    url: `${SITE.url}/events/${slug}`,
    lastModified: now,
  }))

  const artistEntries: MetadataRoute.Sitemap = Object.keys(ARTISTS).map((slug) => ({
    url: `${SITE.url}/artists/${slug}`,
    lastModified: now,
  }))

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE.url}/media/${a.slug}`,
    lastModified: now,
  }))

  return [...staticEntries, ...eventEntries, ...artistEntries, ...articleEntries]
}
