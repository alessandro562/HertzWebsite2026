'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Gate del pop-up newsletter: decide SE mostrarlo (una volta per visitatore,
 * dopo un ritardo che lascia finire l'intro della hero) e solo allora importa
 * la scheda. È montato nel layout, quindi su ogni pagina: tenerlo minuscolo
 * significa che chi l'ha già visto, o chi non arriva al ritardo, non scarica
 * mai il chunk della scheda (motion + logo + form + CSS).
 */
const NewsletterCard = dynamic(() => import('./NewsletterCard'), { ssr: false })

const STORAGE_KEY = 'hz_newsletter_v1'
const OPEN_DELAY = 4200 // ms: lascia sfumare l'intro della hero prima di aprire

export default function NewsletterModal() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(STORAGE_KEY) != null
    } catch {
      seen = false
    }
    if (seen) return
    const t = setTimeout(() => setMounted(true), OPEN_DELAY)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <NewsletterCard
      onDismissed={() => {
        try {
          localStorage.setItem(STORAGE_KEY, '1')
        } catch {
          /* private mode / storage disabled: pazienza, si ripresenterà */
        }
      }}
      onClosed={() => setMounted(false)}
    />
  )
}
