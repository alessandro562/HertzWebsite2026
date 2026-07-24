'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import ViewMorph from '@/motion/ViewMorph'
import PosterFX from '@/components/ui/PosterFX'
import PosterFallback from './PosterFallback'
import styles from './EventPosterPortal.module.css'

interface EventPosterPortalProps {
  /** path immagine — '' → fallback statico "Poster · Coming soon" */
  image: string
  aspectRatio?: string
  n: string
  status: Status
  date: string
  title: string
  venue: string
  /** se presente, l'intero poster è un Link (calendario → evento) */
  href?: string
  /** nome univoco per il morph cross-route (React ViewTransition) */
  viewTransitionName?: string
  priority?: boolean
  className?: string
  /** riempie l'altezza del contenitore (crop, meta in overlay) invece di
   * un aspect-ratio fisso con meta sotto — usato nell'hero del dettaglio
   * evento perché il contenuto testuale, non il poster, definisce l'altezza. */
  fill?: boolean
}

/**
 * EventPosterPortal — componente poster riutilizzabile per tutto il sito
 * (riga di calendario, card in evidenza, hero della pagina evento). Un solo
 * componente, nessuna scena costruita a mano per ogni evento.
 * Comportamenti: mask di ingresso (clip wipe), print bands + frequency cut
 * (stesso linguaggio grafico della Hero), risposta leggera al puntatore
 * (tilt, solo desktop, disattivata con prefers-reduced-motion), apertura
 * dalla riga (href + ViewMorph), fallback statico se l'immagine non c'è.
 *
 * Nota tecnica: il trigger whileInView vive su un elemento che anima SOLO
 * opacity (mai clip-path) — animare clip-path sull'elemento osservato da
 * IntersectionObserver ne azzera l'area visibile e impedisce all'observer
 * di rilevarlo come "in vista", quindi la reveal non scatta mai. Il wipe a
 * clip-path vive perciò su un figlio separato, guidato dallo stesso evento
 * di ingresso in viewport (già verificato funzionante).
 */
export default function EventPosterPortal({
  image,
  aspectRatio = '4 / 5',
  n,
  status,
  date,
  title,
  venue,
  href,
  viewTransitionName,
  priority = false,
  className = '',
  fill = false,
}: EventPosterPortalProps) {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotX = useTransform(py, [-0.5, 0.5], [3, -3])
  const rotY = useTransform(px, [-0.5, 0.5], [-3, 3])

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  const surface: ReactNode = image ? (
    <motion.div
      className={`${styles.frame} ${fill ? styles.frameFill : ''}`.trim()}
      style={fill ? undefined : { aspectRatio }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.4 }}
      onViewportEnter={() => setInView(true)}
    >
      <motion.div
        className={styles.clipInner}
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={reduce || inView ? { clipPath: 'inset(0 0 0% 0)' } : undefined}
        transition={{ duration: reduce ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={image} alt={`Poster: ${title}`} className={styles.img} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        <span className={styles.band1} aria-hidden="true" />
        <span className={styles.band2} aria-hidden="true" />
        <span className={styles.cut} aria-hidden="true" />
        <PosterFX tone="dark" />
      </motion.div>
    </motion.div>
  ) : (
    <div className={`${styles.fallback} ${fill ? styles.frameFill : ''}`.trim()} style={fill ? undefined : { aspectRatio }}>
      <PosterFallback date={date} city={venue} className={styles.fallbackInner} />
    </div>
  )

  const body = (
    <div
      className={`${styles.portal} ${fill ? styles.portalFill : ''} ${className}`.trim()}
      style={{ perspective: 1200 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        className={`${styles.tilt} ${fill ? styles.tiltFill : ''}`.trim()}
        style={{ rotateX: rotX, rotateY: rotY }}
      >
        {viewTransitionName ? <ViewMorph name={viewTransitionName}>{surface}</ViewMorph> : surface}
        {!fill && (
          <span className={`${styles.meta} ${fill ? styles.metaOverlay : ''}`.trim()} aria-hidden="true">
            <StatusBadge status={status} />
          </span>
        )}
      </motion.div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={styles.link} aria-label={`${title}, ${date}, ${venue}`}>
        {body}
      </Link>
    )
  }
  return body
}
