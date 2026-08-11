# HERTZ — hertzclubbing.com

Sito del collettivo clubbing Hertz (Bologna, minimal & deep tech). Next.js 16
(App Router, Turbopack, React 19, TypeScript), CSS Modules, motion/react + Lenis,
font self-hosted (Helvetica Neue + IBM Plex Mono).

L'app vive in questa cartella (`hertz-next/`). Buildare e sviluppare **sempre da
qui** (la root del repo contiene il sito legacy).

## Sviluppo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # build di produzione
pnpm start      # serve la build
```

Copia `.env.example` → `.env.local` e compila le variabili (vedi sotto).

## Variabili d'ambiente

| Variabile | Obbligatoria | Note |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | consigliata | Dominio canonico (canonical, sitemap, OG). Default `https://hertzclubbing.com`. |
| `RESEND_API_KEY` | per ricevere i lead | Senza, i form loggano soltanto (nessuna email). Da resend.com. |
| `RESEND_FROM` | con Resend | Mittente su **dominio verificato**. Senza, l'invio a Gmail fallisce. |
| `NOTIFY_TO` | no | Destinatario notifiche. Default `hertzbologna@gmail.com`. |
| `NEXT_PUBLIC_HERO` | no | `classic` per la hero con foto; vuoto = hero cinetica. |

## Deploy (Vercel)

- **Root Directory** del progetto Vercel = `hertz-next`.
- Build command / output: default Next.js.
- Imposta le variabili d'ambiente sopra (Production + Preview).
- I prototipi `/lab/*` sono `noindex`, esclusi dalla sitemap e restituiscono 404
  in produzione (`src/middleware.ts`).

## Note pre-lancio

- **Licenza font**: gli OTF di Helvetica Neue in `src/app/fonts/` sono a licenza
  desktop, serviti come webfont. Da regolarizzare con una licenza webfont per un
  uso pubblico.
- **Privacy/GDPR**: i form raccolgono dati personali. Vedi `/privacy` (bozza) e
  completa i dati del titolare del trattamento.
