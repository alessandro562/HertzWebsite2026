/* ────────────────────────────────────────────────────────────
   HERTZ · SUPABASE — persistenza iscritti newsletter (Postgres via PostgREST).
   Nessuna dipendenza: fetch nativo + service-role key (SOLO server, MAI NEXT_PUBLIC).
   Se SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY non sono configurate → no-op
   (`stored:false`): il sito gira e i lead restano nei log finché non colleghi il
   database. Schema della tabella: vedi supabase/newsletter.sql.
   ──────────────────────────────────────────────────────────── */

export interface SubscriberInput {
  email: string
  consent?: boolean
  source?: string
  userAgent?: string
}

export type SaveResult =
  | { ok: true; stored: boolean; duplicate?: boolean }
  | { ok: false; error: string }

const TABLE = 'newsletter_subscribers'

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Inserisce un iscritto. Email duplicata (vincolo UNIQUE) → 409 → trattata come
 * successo idempotente (`duplicate:true`). Supabase non configurato → `stored:false`.
 */
export async function saveSubscriber(input: SubscriberInput): Promise<SaveResult> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return { ok: true, stored: false }

  let res: Response
  try {
    res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email: input.email,
        consent: input.consent ?? true,
        source: input.source ?? 'popup',
        user_agent: input.userAgent || null,
      }),
    })
  } catch (e) {
    console.error('[SUPABASE] network error', e)
    return { ok: false, error: 'network' }
  }

  if (res.status === 201 || res.status === 200) return { ok: true, stored: true }
  // 409 = violazione UNIQUE (email già iscritta) → idempotente, va bene così
  if (res.status === 409) return { ok: true, stored: true, duplicate: true }

  const detail = await res.text().catch(() => '')
  console.error('[SUPABASE] insert failed', res.status, detail)
  return { ok: false, error: `status_${res.status}` }
}
