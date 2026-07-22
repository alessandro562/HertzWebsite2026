/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import ImageReveal from '@/motion/ImageReveal'
import FrequencyCut from '@/motion/FrequencyCut'
import PosterMorph from '@/motion/PosterMorph'
import PosterFallback from './PosterFallback'
import styles from './FeaturedEvent.module.css'

/**
 * FeaturedEvent — il prossimo evento come modulo full-width fortemente
 * progettato (non una riga). Frame 1px, 12 colonne (poster 5 · contenuto 7),
 * keyline interne, event number grande, poster INTEGRATO nel modulo con
 * ImageReveal + PosterMorph, una FrequencyCut come apertura strutturale
 * (breve, all'ingresso in viewport), CTA agganciata al bordo inferiore.
 * Hover (CSS): keyline che attraversa, crop-shift del poster, CTA attiva.
 */
export default function FeaturedEvent({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)

  return (
    <Link
      href={`/events/${slug}`}
      className={styles.featured}
      data-status={status}
      style={{ viewTransitionName: `event-frame-${slug}` } as CSSProperties}
    >
      <div className={styles.posterCell}>
        {event.poster ? (
          <ImageReveal variant="print" duration="editorial" className={styles.posterReveal}>
            <PosterMorph slug={slug}>
              <img src={event.poster} alt={`Poster — ${event.title}`} className={styles.poster} loading="eager" decoding="async" />
            </PosterMorph>
          </ImageReveal>
        ) : (
          <PosterFallback n={event.n} date={dowDate(event)} city={event.city} className={styles.posterSoon} />
        )}
        <div className={styles.posterTag}>
          <span className="hz-mono">N°{event.n}</span>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={`${styles.kicker} hz-mono`}>Next event</span>
          <span className={`${styles.date} hz-mono`}>
            {dowDate(event)}
            {event.time ? ` · ${event.time.replace(/^[A-Z]{3} · /, '')}` : ''}
          </span>
        </div>

        <div className={styles.cut}>
          <FrequencyCut variant="editorial" trigger="inView" />
        </div>

        <div className={styles.mid}>
          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.venue}>
            {event.venue} · {event.city}
          </p>
          {event.bill && <p className={styles.bill}>{event.bill}</p>}
        </div>

        <div className={styles.foot}>
          <span className={`${styles.footLabel} hz-mono`}>
            {status === 'on-sale' ? 'On sale now' : status === 'soon' ? 'Line-up soon' : 'Archived'}
          </span>
          <span className={styles.cta}>View event ↗</span>
        </div>
      </div>

      <span className={styles.sweep} aria-hidden="true" />
    </Link>
  )
}
