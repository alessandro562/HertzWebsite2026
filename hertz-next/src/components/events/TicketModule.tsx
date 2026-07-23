import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import WaveformPulse from '@/motion/WaveformPulse'
import Arrow from '@/components/ui/Arrow'
import styles from './TicketModule.module.css'

/**
 * TicketModule — zona biglietti come modulo squadrato con bordo e divisioni
 * interne: stato · disponibilità/nota · azione. Gli stati sono distinguibili
 * senza affidarsi al solo colore (label + glifo + trattamento del bordo).
 * WaveformPulse è feedback, non l'unico elemento distintivo.
 */
type TicketState = 'on-sale' | 'soon' | 'sold-out' | 'external' | 'archive'

const CONFIG: Record<TicketState, { label: string; glyph: ReactNode; note: string; wave: 'active' | 'idle' | 'disabled' | 'loading' }> = {
  'on-sale': { label: 'On sale', glyph: '●', note: 'Reserve by email — we confirm shortly.', wave: 'active' },
  soon: { label: 'Coming soon', glyph: '○', note: 'Line-up & tickets announced soon.', wave: 'loading' },
  'sold-out': { label: 'Sold out', glyph: '✕', note: 'No tickets available for this date.', wave: 'disabled' },
  external: { label: 'On sale', glyph: <Arrow />, note: 'Tickets on the venue’s platform.', wave: 'active' },
  archive: { label: 'Past event', glyph: '—', note: 'This night is in the archive.', wave: 'idle' },
}

export default function TicketModule({
  state,
  href,
  external = false,
}: {
  state: TicketState
  href?: string
  external?: boolean
}) {
  const c = CONFIG[state]
  const actionable = (state === 'on-sale' || state === 'external') && !!href

  return (
    <div className={styles.module} data-state={state}>
      <div className={styles.header}>
        <span className={`${styles.status} hz-mono`}>
          <span className={styles.glyph} aria-hidden="true">
            {c.glyph}
          </span>
          {c.label}
        </span>
        <WaveformPulse state={c.wave} className={styles.wave} label={`tickets ${c.label}`} />
      </div>

      <p className={styles.note}>{c.note}</p>

      <div className={styles.action}>
        {actionable ? (
          <Button href={href!} external={external} arrow className={styles.cta}>
            {external ? 'Get tickets' : 'Reserve by email'}
          </Button>
        ) : (
          <span className={`${styles.disabled} hz-mono`}>
            {state === 'sold-out' ? 'Sold out' : state === 'archive' ? 'Archived' : 'Not yet on sale'}
          </span>
        )}
      </div>
    </div>
  )
}
