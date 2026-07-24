'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import type { NextEvent } from '@/components/home/HomeHero'
import hero from '@/components/home/HomeHero.module.css'
import proto from './HeroProto.module.css'

/**
 * Shell condivisa per i prototipi Gate 1B: la VERA composizione della hero
 * (kicker, titolo, sub, foto, prossimo evento, CTA Tickets, palette Signal,
 * griglia) riusando HomeHero.module.css. Ogni prototipo sostituisce solo la
 * "materia": grid (A), title (B) o photo/children (C).
 */
export default function HeroProto({
  next,
  label,
  grid,
  title,
  photo,
  noPhoto,
  children,
  titleRef,
  photoRef,
}: {
  next?: NextEvent
  label: string
  grid?: ReactNode
  title?: ReactNode
  photo?: ReactNode
  noPhoto?: boolean
  children?: ReactNode
  titleRef?: React.Ref<HTMLDivElement>
  photoRef?: React.Ref<HTMLElement>
}) {
  return (
    <section data-surface="signal" className={hero.hero} id="top">
      {grid ?? <div className={hero.gridlines} aria-hidden="true" />}
      {children && <div className={proto.material}>{children}</div>}

      <div className={`hz-container ${hero.inner}`}>
        <p className={`${hero.kicker} hz-mono`}>{label}</p>

        <div className={hero.stage}>
          <div className={hero.titleCol} ref={titleRef}>
            {title ?? (
              <h1 className={hero.title}>
                <span className={hero.l1}>From clubbers,</span>
                <span className={hero.l2}>for clubbers.</span>
              </h1>
            )}
            <p className={hero.sub}>
              A minimal / deep-tech clubbing collective in Bologna — a resident night, a roster, an
              editorial, built around the selection and the floor.
            </p>
          </div>

          {noPhoto ? null : (photo ?? (
            <figure className={hero.photoWrap} ref={photoRef as React.Ref<HTMLElement>}>
              <img src="/assets/hero-booth.jpg" alt="Hertz — the booth during an event" className={hero.photo} />
              <figcaption className={`${hero.photoCap} hz-mono`}>
                <span>Bologna floor</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={hero.foot}>
          {next && (
            <div className={hero.next}>
              <span className={`${hero.nextLabel} hz-mono`}>Next</span>
              <Link href={`/events/${next.slug}`} className={hero.nextTitle}>
                {next.title}
              </Link>
              <span className={`${hero.nextMeta} hz-mono`}>
                {next.date} · {next.venue} · {next.city}
              </span>
            </div>
          )}
          <div className={hero.actions}>
            <Button href={next ? `/events/${next.slug}` : '/events'}>Tickets</Button>
            <Button href="/events" variant="ghost">
              All events
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
