# HERTZ · Newsletter → database (Neon via Vercel)

Il pop-up newsletter raccoglie le email (`POST /api/newsletter`). Per **salvarle
in un database** basta collegare un DB Neon dal pannello di Vercel: le variabili
d'ambiente le mette Vercel **in automatico** e la tabella si **crea da sola** al
primo iscritto. Nessuna chiave da copiare a mano, nessuno SQL da eseguire.

Finché non colleghi il DB, il pop-up funziona ma gli iscritti restano solo nei
Runtime Logs di Vercel (non persistiti).

## 1. Crea il database (dentro Vercel)
1. Vai su **vercel.com** → apri il progetto **`hertzv2`**.
2. Tab **Storage** → **Create Database** (o **Connect Store**).
3. Scegli **Neon** (Postgres serverless, free tier) → **Continue** e conferma.
4. Quando chiede a quale progetto collegarlo, seleziona **hertzv2** e ambiente
   **Production** (puoi includere anche Preview/Development).

Vercel aggiunge da solo la connection string come **`DATABASE_URL`** (più altre
`POSTGRES_*`): il codice le legge automaticamente, non devi copiare nulla.

## 2. Redeploy
Le variabili valgono dai deploy successivi:
**Deployments → ⋯ (sul deploy più recente) → Redeploy**.

Fatto: al primo che si iscrive, la tabella `newsletter_subscribers` viene creata
in automatico e ogni iscritto viene salvato (email unica, niente doppioni).

## Dove vedere gli iscritti
- Da **Vercel → Storage → (il tuo DB Neon) → Open in Neon**, oppure sulla
  dashboard **neon.tech** → progetto → **SQL Editor / Tables**.

```sql
-- Primi 100 iscritti (gadget alla prima data 26/27 al Kindergarten)
select email, created_at
from newsletter_subscribers
order by created_at asc
limit 100;

-- Totale iscritti
select count(*) from newsletter_subscribers;
```

## Schema (creato automaticamente dal codice)
Per riferimento, la tabella che l'app crea da sola:
```sql
create table if not exists newsletter_subscribers (
  id          bigint generated always as identity primary key,
  email       text        not null unique,
  consent     boolean     not null default true,
  source      text        default 'popup',
  user_agent  text,
  created_at  timestamptz not null default now()
);
```

## Test rapido
```bash
curl -X POST https://hertzclubbing.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","consent":"yes"}'
# → {"ok":true,"message":"You're on the list.","duplicate":false}
# ripetendo la STESSA email → "duplicate":true  (prova che sta salvando)
```
