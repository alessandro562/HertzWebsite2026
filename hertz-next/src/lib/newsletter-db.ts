/* ────────────────────────────────────────────────────────────
   HERTZ · NEWSLETTER DB — persistenza iscritti su Postgres (Neon).
   Driver HTTP `@neondatabase/serverless` (ideale su serverless Vercel).
   La connection string arriva da Vercel (integrazione Neon → variabili iniettate
   in automatico). La tabella viene CREATA DA SOLA al primo iscritto: nessuno
   step SQL manuale. Se nessuna connection string è configurata → no-op
   (`stored:false`): il sito gira e i lead restano nei log.
   ──────────────────────────────────────────────────────────── */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

export interface SubscriberInput {
  email: string
  consent?: boolean
  source?: string
  userAgent?: string
}

export type SaveResult =
  | { ok: true; stored: boolean; duplicate?: boolean }
  | { ok: false; error: string }

/** Prima connection string disponibile tra i nomi usati da Vercel/Neon. */
function connectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL ||
    undefined
  )
}

export function isNewsletterDbConfigured(): boolean {
  return Boolean(connectionString())
}

// crea la tabella una sola volta per istanza (idempotente lato DB con IF NOT EXISTS)
let ensured: Promise<void> | null = null
function ensureTable(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (!ensured) {
    ensured = sql`
      create table if not exists newsletter_subscribers (
        id          bigint generated always as identity primary key,
        email       text        not null unique,
        consent     boolean     not null default true,
        source      text        default 'popup',
        user_agent  text,
        created_at  timestamptz not null default now()
      )
    `
      .then(() => undefined)
      .catch((e) => {
        ensured = null // permette un nuovo tentativo alla richiesta successiva
        throw e
      })
  }
  return ensured
}

/**
 * Inserisce un iscritto. Email duplicata (UNIQUE) → `on conflict do nothing`
 * → nessuna riga tornata → `duplicate:true` (idempotente). DB non configurato
 * → `stored:false`.
 */
export async function saveSubscriber(input: SubscriberInput): Promise<SaveResult> {
  const cs = connectionString()
  if (!cs) return { ok: true, stored: false }

  try {
    const sql = neon(cs)
    await ensureTable(sql)
    const rows = await sql`
      insert into newsletter_subscribers (email, consent, source, user_agent)
      values (${input.email}, ${input.consent ?? true}, ${input.source ?? 'popup'}, ${input.userAgent ?? null})
      on conflict (email) do nothing
      returning id
    `
    const duplicate = Array.isArray(rows) && rows.length === 0
    return { ok: true, stored: true, duplicate }
  } catch (e) {
    console.error('[NEWSLETTER DB] insert failed', e)
    return { ok: false, error: 'db_failed' }
  }
}
