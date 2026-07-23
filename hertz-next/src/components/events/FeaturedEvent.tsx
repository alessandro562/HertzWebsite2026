/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import FrequencyCut from '@/motion/FrequencyCut'
import PosterFX from '@/components/ui/PosterFX'
import PosterFallback from './PosterFallback'
import styles from './FeaturedEvent.module.css'

/**
 * FeaturedEvent — prossimo evento: locandina verticale INTERA (mai croppata) a
 * sinistra, pannello editoriale a destra CENTRATO verticalmente (così lo spazio
 * attorno è bilanciato, niente vuoti). Meta pulita (N°, data, badge, stato)
 * integrata nel testo — nessuna etichetta sovrapposta alla locandina.
 */
export default function FeaturedEvent({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)
  const time = event.time ? event.time.replace(/^[A-Z]{3} · /, '') : ''
  const metaLine = [dowDate(event), time, event.badge].filter(Boolean).join(' · ')

  return (
    <Link
      href={`/events/${slug}`}
      className={styles.featured}
      data-status={status}
      style={{ viewTransitionName: `event-frame-${slug}` } as CSSProperties}
    >
      <div className={styles.posterCell}>
        {event.poster ? (
          <figure className={styles.posterFig}>
            <img
              src={event.poster}
              alt={`Poster — ${event.title}`}
              className={styles.poster}
              loading="eager"
              decoding="async"
            />
            <PosterFX tone="dark" />
          </figure>
        ) : (
          <div className={styles.posterFig} data-fallback="true">
            <PosterFallback n={event.n} date={dowDate(event)} city={event.city} className={styles.posterSoon} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <span className={`${styles.kicker} hz-mono`}>Next event · N°{event.n}</span>
            <StatusBadge status={status} />
          </div>

          <div className={styles.cut}>
            <FrequencyCut variant="editorial" trigger="inView" />
          </div>

          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.venue}>
            {event.venue} · {event.city}
          </p>
          <p className={`${styles.when} hz-mono`}>{metaLine}</p>
          {event.bill && <p className={styles.bill}>{event.bill}</p>}

          <div className={styles.foot}>
            <span className={styles.cta}>View event ↗</span>
            <span className={`${styles.footLabel} hz-mono`}>
              {status === 'on-sale' ? 'Guest list open' : status === 'soon' ? 'Line-up soon' : 'Archived'}
            </span>
          </div>
        </div>
      </div>

      <span className={styles.sweep} aria-hidden="true" />
    </Link>
  )
}
