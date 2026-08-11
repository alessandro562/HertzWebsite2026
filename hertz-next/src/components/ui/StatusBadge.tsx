import styles from './StatusBadge.module.css'

export type Status = 'on-sale' | 'soon' | 'sold-out' | 'archive'

const LABEL: Record<Status, string> = {
  'on-sale': 'On sale',
  soon: 'Soon',
  'sold-out': 'Sold out',
  archive: 'Archive',
}
const CLS: Record<Status, string> = {
  'on-sale': styles.onSale,
  soon: styles.soon,
  'sold-out': styles.soldOut,
  archive: styles.archive,
}

/** Pill di stato biglietti/archivio, colore semantico dai token funzionali. */
export default function StatusBadge({
  status,
  label,
  className = '',
}: {
  status: Status
  label?: string
  className?: string
}) {
  return (
    <span className={`${styles.badge} ${CLS[status]} ${className}`.trim()}>
      {label ?? LABEL[status]}
    </span>
  )
}
