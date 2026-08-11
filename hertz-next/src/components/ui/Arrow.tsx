/**
 * Freccia inline vettoriale — MAI emoji.
 *
 * Il glifo `↗` (U+2197) viene reso da iOS/Safari come emoji blu ("smartphone
 * icon"). Questo componente lo sostituisce con un piccolo SVG a `currentColor`
 * dimensionato in `em`: eredita colore e scala dal testo, identico su ogni
 * device. Usare `<Arrow />` ovunque comparisse `↗`.
 */
export default function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'inline-block', verticalAlign: '-0.08em', flexShrink: 0 }}
    >
      <path d="M4 12 12 4M6 4H12V10" />
    </svg>
  )
}
