'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import styles from './PhotoGallery.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Gallery fotografica riutilizzabile — carosello editoriale di card con
 * dettagli (indice, registration marks, caption in hover) + lightbox a schermo
 * intero con navigazione da tastiera. Usata su artisti, eventi, archivio.
 * `label` = riga bold (nome artista / titolo evento); `caption` = meta line.
 */
export default function PhotoGallery({
  photos,
  label,
  caption = 'Live · Hertz floor',
}: {
  photos: string[]
  label: string
  caption?: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const total = photos.length

  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false })
  const onPointerDown = (e: React.PointerEvent) => {
    const el = railRef.current
    if (!el) return
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const el = railRef.current
    if (!el || !drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startScroll - dx
  }
  const endDrag = () => {
    drag.current.down = false
  }

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, go])

  return (
    <>
      <div
        ref={railRef}
        className={styles.rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {photos.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            className={styles.card}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: Math.min(i, 5) * 0.08, ease: EASE }}
            onClick={() => {
              if (!drag.current.moved) setOpen(i)
            }}
            aria-label={`Open ${label}, frame ${i + 1}`}
          >
            <span className={`${styles.frame} hz-glitch`}>
              <img src={src} alt={`${label}, frame ${i + 1}`} loading="lazy" draggable={false} />
              <GlitchFX />
              <span className={styles.grain} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.tl}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.tr}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.bl}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.br}`} aria-hidden="true" />
              <span className={`${styles.idx} hz-mono`}>
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span className={styles.cap}>
                <span className={styles.capName}>{label}</span>
                <span className={`${styles.capMeta} hz-mono`}>{caption}</span>
                <span className={`${styles.capGo} hz-mono`}>Expand <Arrow /></span>
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <div className={`${styles.hint} hz-mono`} aria-hidden="true">
        <span>← Drag</span>
        <span>Click to expand</span>
        <span>{total} frames</span>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${label}, gallery`}
          >
            <div className={`${styles.lbBar} hz-mono`}>
              <span>
                {label} · {String(open + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button type="button" className={styles.lbClose} onClick={close} aria-label="Close">
                Close ✕
              </button>
            </div>

            <button
              type="button"
              className={`${styles.lbNav} ${styles.lbPrev}`}
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              aria-label="Previous"
            >
              ←
            </button>

            <motion.div
              key={open}
              className={styles.lbStage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.32, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={photos[open]} alt={`${label}, frame ${open + 1}`} draggable={false} />
              <span className={`${styles.lbCap} hz-mono`}>{caption}</span>
            </motion.div>

            <button
              type="button"
              className={`${styles.lbNav} ${styles.lbNext}`}
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              aria-label="Next"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
