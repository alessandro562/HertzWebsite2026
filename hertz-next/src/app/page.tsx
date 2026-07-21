/**
 * PAGINA DI VERIFICA SCAFFOLD — Fase 2 (NON è la home reale).
 *
 * Serve solo a confermare che lo scaffold è cablato:
 *  - i design token di tokens.css sono attivi (bg/ink/signal/line/spazi);
 *  - l'<h1> usa il font DISPLAY (Helvetica Neue self-hosted, non Arial);
 *  - il testo mono usa il fallback ui-monospace (ABC Monument arriverà dopo);
 *  - c'è abbastanza altezza verticale per verificare lo smooth-scroll Lenis.
 *
 * Verrà cancellata/sostituita dalla home vera in Fase 3.
 * Stili inline volutamente (nessun componente riutilizzabile in Fase 2).
 */
export default function ScaffoldCheck() {
  return (
    <main
      style={{
        maxWidth: 'var(--hz-maxw)',
        margin: '0 auto',
        padding: 'var(--hz-gutter)',
      }}
    >
      <section
        style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'var(--hz-space-md)',
          borderBottom: 'var(--hz-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--hz-font-mono)',
            letterSpacing: 'var(--hz-tracking-mono)',
            textTransform: 'uppercase',
            fontSize: 'var(--hz-t-meta)',
            color: 'var(--hz-signal)',
          }}
        >
          // scaffold check · fase 2
        </p>

        <h1
          id="scaffold-h1"
          style={{
            fontFamily: 'var(--hz-font-display)',
            fontWeight: 'var(--hz-weight-display)',
            fontSize: 'var(--hz-t-hero)',
            lineHeight: 'var(--hz-leading-tight)',
            letterSpacing: '-0.02em',
          }}
        >
          HERTZ
        </h1>

        <p
          style={{
            maxWidth: '56ch',
            fontSize: 'var(--hz-t-body)',
            color: 'var(--hz-ink-mute)',
          }}
        >
          Scaffold Next.js attivo. Token da{' '}
          <code style={{ fontFamily: 'var(--hz-font-mono)' }}>tokens.css</code>, font
          display <strong>Helvetica Neue</strong> self-hosted, smooth-scroll Lenis.
          Nessuna pagina reale: solo verifica della Fase 2.
        </p>

        <p
          style={{
            fontFamily: 'var(--hz-font-mono)',
            fontSize: 'var(--hz-t-meta)',
            letterSpacing: 'var(--hz-tracking-mono)',
            color: 'var(--hz-accent)',
          }}
        >
          accent link → <a href="https://hertzclubbing.com">hertzclubbing.com</a>
        </p>
      </section>

      <section
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--hz-font-mono)',
            fontSize: 'var(--hz-t-meta)',
            letterSpacing: 'var(--hz-tracking-mono)',
            color: 'var(--hz-ink-mute)',
          }}
        >
          ↑ ↓ scorri per verificare lo smooth-scroll Lenis
        </p>
      </section>
    </main>
  )
}
