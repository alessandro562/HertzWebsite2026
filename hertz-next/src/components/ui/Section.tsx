import type { CSSProperties, ReactNode } from 'react'

export type Surface = 'white' | 'paper' | 'signal' | 'cold-blue' | 'ink'

type Props = {
  /** Superficie del section-theme system (rimappa i token semantici). */
  surface?: Surface
  id?: string
  className?: string
  /** Spaziatura verticale di sezione. */
  space?: 'sm' | 'md' | 'lg' | 'none'
  /** Avvolge i figli in .hz-container (max-width + gutter). */
  container?: boolean
  style?: CSSProperties
  children: ReactNode
}

const SPACE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'var(--hz-section-sm)',
  md: 'var(--hz-section-md)',
  lg: 'var(--hz-section-lg)',
}

/**
 * Blocco di sezione con superficie dichiarata. Default = white (mai ink).
 * Es. <Section surface="signal" space="lg">…</Section>
 */
export default function Section({
  surface = 'white',
  id,
  className,
  space = 'md',
  container = true,
  style,
  children,
}: Props) {
  const padStyle: CSSProperties = space !== 'none' ? { paddingBlock: SPACE[space] } : {}
  return (
    <section id={id} data-surface={surface} className={className} style={{ ...padStyle, ...style }}>
      {container ? <div className="hz-container">{children}</div> : children}
    </section>
  )
}
