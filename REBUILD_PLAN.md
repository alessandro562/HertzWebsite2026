# HERTZ · Piano di ricostruzione sito

Ricostruzione completa di `hertzclubbing.com` su stack moderno, mantenendo i **contenuti e gli asset reali**, buttando **tutto il design**. Fondato sull'ispezione del repo `alessandro562/HertzWebsite2026`.

---

## Principio guida (leggere una volta, applicare sempre)

Il sito ha **due layer**. Non confonderli mai:

- **Layer contenuto** = 162 foto (`assets/`, `uploads/`, `media/`), `events-data.js`, le bio artisti, il copy. → **Si salva. È la tua materia prima. Non si tocca mai più: cambia solo come lo mostri.**
- **Layer design** = `index.html` con React+Babel in-browser da unpkg, tutti gli `hertz-v8*.jsx`, `hertz-system.css` (82KB). → **Si butta. Non si migra una riga.**

Non stai "cambiando lo stile a un sito". Stai **estraendo il contenuto una volta** e **ricostruendo la presentazione da zero** sopra di esso.

### Stack: north star vs. v1

Il documento di ChatGPT è una buona stella polare ma è massimalista (richiede un team di 3–5 specialisti, lo dice lui stesso). **Non adottarlo tutto insieme o il progetto non esce.** Stack v1 lean:

| Ruolo | v1 (adesso) | v2 (dopo) |
|---|---|---|
| Framework | Next.js + TypeScript + Vercel | — |
| Motion UI | **Motion for React** (`motion`) | — |
| Scroll | Lenis | — |
| 3D | **un solo** momento WebGL (R3F) | shader GLSL, scene multiple |
| Contenuti | `events.ts` / `artists.ts` tipizzati | Sanity CMS |
| Video/asset AI | Higgsfield · Motion.so | Mux delivery |
| Vettoriale | — | Rive |
| Authoring 3D | — | Blender / Theatre.js |

**Motion ≠ Motion.so.** `Motion for React` (motion.dev) è la libreria di animazione dentro il sito. `Motion.so` è il generatore di video MP4 (connettore). Sono due cose diverse, servono entrambe.

---

## FASE 0 · Decisioni brand + setup

**Obiettivo:** bloccare l'identità *prima* di scrivere UI. Il tuo motivo per rifare il sito è la brand identity: decidila, non improvvisarla in corsa.

**Azioni:**

1. **Tipografia — decisione da chiudere.** Il repo spedisce font **Helvetica Neue** (15 OTF in `assets/fonts/`), ma il sistema di brand è **Bricolage Grotesque + JetBrains Mono**. Sono due direzioni diverse. Scegli una e sola una, e mettila nei token. (`tokens.css` è già impostato su Bricolage/JetBrains — cambia se confermi Helvetica.)
2. **Colore — regola WCAG non negoziabile.** `#144889` blu = **solo segno grafico** (bordi, kicker, il punto ".", "blue period"). `#00d4ff` cyan = **tutto il testo/link leggibile**. Nel legacy il blu era usato come testo e falliva il contrasto: non ripeterlo.
3. **Numerazione di sezione.** Il frontend-design lo conferma: i marker numerati (//01 //02) hanno senso **solo se il contenuto è davvero una sequenza**. Nel legacy `//04` collideva tra `/media` e `/music`. Usa la numerazione dove c'è un ordine reale (roster resident, timeline), non come decoro.
4. **Dominio canonico.** Il `.env` legacy punta a `hertz.club`. Il dominio vero è **`hertzclubbing.com`**. Fissalo ovunque (canonical, OG, sitemap, `NEXT_PUBLIC_SITE_URL`).
5. **Repo/branch.** Non partire dalla root attuale.
   ```bash
   cd "~/Desktop/Hertz Website"
   git pull
   git checkout -b rebuild/creative-runtime
   ```
6. **Deploy.** Ricorda: la tua mail non è nel team Vercel → i commit vanno **firmati con l'account di Alessandro** (`alessandro@wda.company`) per far scattare i deploy.

**Fatto quando:** `tokens.css` riflette le scelte definitive di font e colore, il branch esiste, il dominio è deciso.

---

## FASE 1 · Estrai il layer contenuto

**Obiettivo:** portare asset + dati nel nuovo progetto, una volta, e non toccarli più.

**Azioni:**

1. Copia nel nuovo progetto (dopo la Fase 2) lo script `scripts/migrate-content.sh` di questo kit ed eseguilo dalla root del **repo legacy**:
   ```bash
   bash scripts/migrate-content.sh "/percorso/hertz-next"
   ```
   Copia `assets/ uploads/ media/` in `public/`. **Non** copia nessun `.html`, `.jsx`, `.css` legacy.
2. Copia `content/events.ts` e `content/artists.ts` di questo kit nel nuovo progetto. Sono **già migrati dai tuoi dati reali** e tipizzati.
3. Apri `content/artists.ts`, cerca i `// TODO:bio` e `// TODO:social` e completa i testi integrali dal legacy `hertz-artist.js` (Tommaso ha bio parziale e social mancanti).
4. I path immagine sono già `/assets/...` (root-relative per `public/`).

**Fatto quando:** `public/` contiene tutte le foto; `events.ts` e `artists.ts` compilano senza errori TS; nessun `// TODO` residuo.

---

## FASE 2 · Scaffold Next.js + design system

**Obiettivo:** progetto pulito, token attivi, zero contenuto ancora.

**Azioni:**

```bash
pnpm create next-app@latest hertz-next --typescript --eslint --app --src-dir
cd hertz-next
pnpm add motion lenis
pnpm add three @react-three/fiber @react-three/drei
```

Struttura minima:
```
src/
├── app/
│   ├── layout.tsx          # font, <SmoothScroll>, metadata canonici
│   ├── page.tsx            # home
│   ├── events/[slug]/
│   ├── artists/[slug]/
│   ├── music/  media/  manifesto/  archive/  bookings/  merch/
│   └── lab/                # ← prototipi isolati, non in produzione
├── components/{ui,navigation,sections,events,artists}/
├── content/                # events.ts, artists.ts (Fase 1)
├── motion/                 # SmoothScroll.tsx, Reveal.tsx, tokens.ts
├── scenes/                 # un solo file WebGL per la v1
└── styles/                 # globals.css, tokens.css
```

Importa `tokens.css` in `globals.css`. Carica i font (Bricolage/JetBrains via `next/font` o gli OTF legacy).

**Prompt Claude Code (atomico):**
> Configura `layout.tsx`: importa `tokens.css`, carica Bricolage Grotesque (display+body) e JetBrains Mono (mono) via `next/font`, imposta `metadataBase` su `https://hertzclubbing.com`, canonical e OpenGraph corretti. Crea `motion/SmoothScroll.tsx` (Lenis, client component) che avvolge i children in `layout`. Non costruire nessuna pagina o sezione: solo scaffold e provider.

**Fatto quando:** `pnpm dev` parte, i token sono attivi, lo scroll Lenis è liscio, `<h1>` di prova usa il font display.

---

## FASE 3 · Skeleton statico (deve già essere eccellente)

**Obiettivo:** sito completo **senza una sola animazione**. Struttura, gerarchia, tipografia, calendario, CTA. Se è bello fermo, sarà ottimo animato.

**Azioni:** costruisci pagina per pagina leggendo da `content/`. Home, Events (lista da `upcoming()`/`archive()`), pagina evento `[slug]`, Artists + `[slug]` (da `forResident()`), Manifesto, Music, Media, Archive, Bookings, Merch.

**Prompt Claude Code (una pagina alla volta):**
> Costruisci **solo** la pagina Events statica in `app/events/page.tsx`. Leggi da `content/events.ts` usando `upcoming()` e `archive()`. Due blocchi: "In arrivo" e "Archivio". Ogni riga: numero catalogo, `dowDate()`, titolo, venue · città, badge, stato ON SALE/SOON. Spigoli vivi, hairline `var(--hz-line)`, mono per i metadata. **Zero animazioni, zero WebGL.** CTA Tickets sempre visibile. Fallback "coming soon" per poster `''`.

**Fatto quando:** tutte le 10 pagine navigabili, responsive fino a mobile, contrasto a norma, nessun CTA morto (nel legacy il bottone Tickets era morto — qui deve funzionare o sparire).

---

## FASE 4 · Creative lab (qui è dove Claude Code rende)

**Obiettivo:** prototipare **una interazione alla volta**, isolata, in `/lab`. Solo quelle validate entrano in produzione.

**Errore da non fare:** chiedere "ricostruisci il sito iconico". L'AI compone sezioni generiche. Dai **spec atomiche**.

**Prototipi in ordine di priorità:**

1. `/lab/event-transition` — riga calendario → pagina evento (il momento firma)
2. `/lab/logo-3d` — logo/waveform Hertz in WebGL
3. `/lab/reveal` — grammatica di reveal riutilizzabile
4. `/lab/page-transition` — transizioni tra route

**Prompt Claude Code (esempio, il momento firma):**
> Costruisci **solo** la transizione dalla riga calendario alla pagina evento, in `app/lab/event-transition/page.tsx`. Stack: Next.js + Motion for React. Comportamento: il poster mantiene identità visiva tra le due viste (shared layout), la nav resta fissa, gli altri contenuti escono in 150ms, il poster si espande in 450ms, il titolo entra dopo la trasformazione. Vincoli: niente scroll hijacking, niente cursor follower, niente autoplay audio, fallback senza WebGL, rispetta `prefers-reduced-motion` (crossfade 200ms), mobile progettato a parte (shared-image senza WebGL), CTA Tickets sempre accessibile. Non costruire altre sezioni. Fornisci solo la route `/lab/event-transition`.

**Criteri per promuovere un prototipo in produzione:**
- è chiaro senza spiegazione
- fluido su laptop medio (mouse + touch)
- ha fallback mobile e reduced-motion
- non blocca contenuti né la CTA ticket
- è coerente col brand

**Fatto quando:** almeno il momento firma passa tutti i criteri.

---

## FASE 5 · Signature hero

**Obiettivo:** un solo momento memorabile in home. Il logo 3D / waveform + prossimo evento + CTA, con fallback mobile.

**Azioni:** integra il prototipo `/lab/logo-3d` validato. Il 3D deve **rappresentare Hertz** (frequenza/segnale), reagire a cursore/scroll, non essere "un oggetto che ruota a caso". Lazy-load del WebGL: poster statico prima, scena dopo.

**Fatto quando:** LCP < 2,5s con poster immediato, WebGL differito, fallback statico su mobile/reduced-motion.

---

## FASE 6 · Ecosistema pagine

**Obiettivo:** portare in produzione le interazioni per il resto del sito, **una per pagina** (regola: una pagina = un momento memorabile).

- **Events** → calendario trasformativo (il momento firma della Fase 4)
- **Artists** → transizione ritratto ↔ suono
- **Music** → audio-reactive leggero
- **Archive** → navigazione spaziale delle gallerie (`assets/archivio-web/`)
- **Manifesto / Media / Bookings / Merch** → reveal disciplinati, niente effetti sovrapposti

**Regola:** una sezione = un comportamento principale. Mai parallax + rotazione + testo cinetico + video insieme.

**Fatto quando:** ogni pagina ha il suo momento, nessuna ne ha più di uno.

---

## FASE 7 · Brand visuals con Higgsfield + Motion.so

**Obiettivo:** generare la **materia visiva nuova e astratta**, non sostituire le foto reali.

**Avvertimento strategico (centrale per Hertz):** la tua brand identity è floor-led — "the cleanest signal in a noisy scene". L'autenticità sono le 162 foto reali di floor, live e archivio. **Non generare mai finto pubblico o finti live con l'AI:** contraddirebbe esattamente ciò che ti distingue.

- **Foto reali** → persone, floor, eventi, ritratti resident (quello che hai già).
- **AI-gen (Higgsfield / Motion.so)** → solo astratto e brand mark: loop del logo, waveform animata, texture, teaser evento, background, sequenze di transizione.

**Catena:** Motion.so/Higgsfield generano MP4/immagini → entrano nel sito come `<video>` HTML o texture Three.js → Motion/GSAP le rendono interattive. Passa ai generatori i design token e qualche frame reale come riferimento, così restano coerenti col brand.

**Fatto quando:** hai un set di 3–4 asset astratti brand-coerenti integrati (logo loop, texture hero, 1–2 teaser), nessuno dei quali imita fotografia reale.

---

## FASE 8 · Rifinitura, performance, SEO, deploy

**Obiettivo:** premium = veloce. Un sito immersivo che scatta non è premium.

**Performance budget (obbligatorio):**
- LCP < 2,5s · INP < 200ms · CLS < 0,1 (75° percentile)
- WebGL lazy-loaded · hero video con poster prima · modello 3D iniziale < 2–3MB
- texture desktop max 2K, mobile max 1K · DPR mobile max 1.5 · post-processing mobile off
- audio solo su azione utente · pausa render fuori viewport e a scheda nascosta
- `prefers-reduced-motion` rispettato ovunque · fallback statico

**SEO (correggi i difetti noti del legacy):**
- canonical + OG su `hertzclubbing.com` (non `hertz.club`)
- copy bilingue IT-first, layer brand EN, sulle 13 pagine
- `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD Organization/LocalBusiness

**Test & deploy:**
- Lighthouse + test su dispositivo reale (non solo desktop)
- commit firmato Alessandro → preview Vercel → verifica → prod
- quando la v1 regge: promuovi `rebuild/creative-runtime` a produzione e punta il dominio

**Fatto quando:** budget rispettato su device reale, SEO a norma, deploy prod stabile.

---

## Regole permanenti

**Grammatica del motion (non una collezione di effetti):**
- *Reveal* — opacity 0→1, y 16→0, 500–700ms
- *Shift* — x 24px, blur 4→0, 320–480ms
- *Morph* — poster card → poster hero → texture WebGL
- *Pulse* — movimento proprietario Hertz (scala minima, luminosità, waveform, audio-reactive)
- *Distortion* — solo nei momenti speciali (hero, evento, archivio), mai su ogni immagine

**Ogni animazione deve rispondere a una domanda** (orienta? conferma? crea continuità? racconta? dà profondità?). Se la risposta è no, si rimuove.

**Disciplina Claude Code:** una spec atomica per volta, sempre in `/lab` prima, sempre con vincoli espliciti (no scroll hijacking, no cursor follower, fallback mobile + reduced-motion, CTA ticket accessibile). Mai "costruisci l'intero sito".

**Attenzione al look-default:** near-black + singolo accento acido (`#08080d` + `#00d4ff`) è un pattern che l'AI produce di serie. Nel tuo caso è brand consolidato — quindi va bene — ma spendi la "boldness" in **un solo** elemento firma e tieni tutto il resto disciplinato.

---

## Difetti del legacy da NON riportare

Emersi dall'ispezione del repo, da correggere alla radice nel rebuild:
- React + Babel transpilato **in-browser da unpkg** → sostituito da build Next.js
- blu `#144889` usato come **testo** (fallisce WCAG) → solo grafico
- canonical/OG su **`hertz.club`** → `hertzclubbing.com`
- **doppio design system** (`hertz-v8.jsx` + `hertz-shared.jsx`) → un solo sistema di token
- **collisione numerazione** `//04` tra `/media` e `/music` → numerazione solo dove c'è sequenza
- **CTA morti** (bottone Tickets) → funzionanti o rimossi

---

## Checklist di consegna v1

- [ ] Fase 0 — token, font, colore, dominio, branch decisi
- [ ] Fase 1 — asset in `public/`, `events.ts`/`artists.ts` senza TODO
- [ ] Fase 2 — scaffold Next.js, Lenis, font attivi
- [ ] Fase 3 — 10 pagine statiche, responsive, contrasto a norma, zero CTA morti
- [ ] Fase 4 — momento firma validato in `/lab`
- [ ] Fase 5 — signature hero con fallback, LCP < 2,5s
- [ ] Fase 6 — un momento memorabile per pagina
- [ ] Fase 7 — brand visuals AI astratti (mai finto pubblico)
- [ ] Fase 8 — performance budget, SEO, deploy prod firmato Alessandro
