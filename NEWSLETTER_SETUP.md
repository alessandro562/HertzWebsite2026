# HERTZ · Newsletter → Supabase (setup)

Il pop-up newsletter raccoglie già le email (`POST /api/newsletter`), ma per
**salvarle nel database** serve collegare Supabase. Finché non lo colleghi, gli
iscritti vengono solo loggati nei Runtime Logs di Vercel (non persistiti).

> Lo schema SQL vive anche in [`hertz-next/supabase/newsletter.sql`](hertz-next/supabase/newsletter.sql).
> Qui sotto è ripetuto per comodità: puoi copiarlo e incollarlo così com'è.

## 1. Crea un progetto Supabase
Vai su https://supabase.com → **New project** (piano gratuito ok).

## 2. Crea la tabella
Supabase dashboard → **SQL Editor** → incolla ed esegui:

```sql
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

-- RLS attiva senza policy pubbliche: si scrive SOLO dal server con la
-- service-role key (che bypassa RLS). La anon key non può leggere/scrivere.
alter table public.newsletter_subscribers enable row level security;
```

## 3. Imposta le variabili d'ambiente
Supabase → **Settings → API**: copia `Project URL` e la `service_role` key.

Poi su **Vercel** (progetto `hertzv2`) → **Settings → Environment Variables**
(e in locale in `.env.local`):

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

⚠️ Usa la **service_role** key (segreta, solo server). NON la `anon` key,
NON prefissare con `NEXT_PUBLIC`. Dopo averle aggiunte su Vercel, fai un
**Redeploy**.

## Query utili
```sql
-- Primi 100 iscritti (gadget alla prima data 26/27 al Kindergarten)
select email, created_at
from public.newsletter_subscribers
order by created_at asc
limit 100;

-- Totale iscritti
select count(*) from public.newsletter_subscribers;
```

## Test rapido
```bash
curl -X POST https://hertzclubbing.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","consent":"yes"}'
# → {"ok":true,"message":"You're on the list."}
```
Poi controlla la tabella `newsletter_subscribers` su Supabase (Table Editor).
