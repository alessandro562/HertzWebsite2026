import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

/* Crawler dei motori generativi. Senza una regola esplicita passerebbero
   comunque dal blocco `*`, ma due di questi sono controlli di opt-out
   (Google-Extended per AI Overviews/Gemini, Applebot-Extended per Apple
   Intelligence): dichiararli in positivo è l'unico modo di dire "sì, usateci
   come fonte". Gli altri sono elencati perché diversi bot leggono solo il
   proprio gruppo e ignorano il wildcard. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'DuckAssistBot',
  'cohere-ai',
  'CCBot',
]

/* /lab = prototipi (già noindex a livello di pagina), /api = solo POST dei
   form: niente da indicizzare, e tenerli fuori evita crawl budget sprecato. */
const DISALLOW = ['/lab/', '/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
