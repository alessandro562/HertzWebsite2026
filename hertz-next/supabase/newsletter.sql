-- ────────────────────────────────────────────────────────────
-- HERTZ · Newsletter subscribers — schema Supabase (Postgres)
--
-- Esegui questo SQL una volta nel tuo progetto Supabase:
--   Supabase dashboard → SQL Editor → incolla → Run.
-- Poi imposta in Vercel (Settings → Environment Variables) e in .env.local:
--   SUPABASE_URL                = https://<project>.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY   = <service_role key>   (SEGRETA, solo server)
-- ────────────────────────────────────────────────────────────

create table if not exists public.newsletter_subscribers (
  id          bigint generated always as identity primary key,
  email       text        not null unique,
  consent     boolean     not null default true,
  source      text        default 'popup',
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- ordine d'iscrizione (per la promo "primi 100")
create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at);

-- RLS attiva SENZA policy pubbliche: l'inserimento avviene solo dal server con
-- la service-role key (che bypassa RLS). La anon key non può leggere/scrivere.
alter table public.newsletter_subscribers enable row level security;

-- ── Query utili ──────────────────────────────────────────────
-- Primi 100 iscritti (gadget alla prima data 26/27 al Kindergarten):
--   select email, created_at
--   from public.newsletter_subscribers
--   order by created_at asc
--   limit 100;
--
-- Totale iscritti:
--   select count(*) from public.newsletter_subscribers;
