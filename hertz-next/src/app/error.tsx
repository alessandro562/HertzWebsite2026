'use client'

import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import FrequencyCut from '@/motion/FrequencyCut'
import styles from './not-found.module.css'

/** Error boundary di root — stessa lingua editoriale del 404, nessun dettaglio
 *  tecnico esposto all'utente. `reset` ritenta il render del segmento. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main">
      <Section surface="signal" space="lg">
        <p className={`${styles.code} hz-mono`}>Error · Signal lost</p>
        <h1 className={styles.title}>Something cut the signal.</h1>
        <FrequencyCut variant="editorial" trigger="mount" className={styles.cut} />
        <p className={styles.text}>An unexpected error interrupted this page. Try again, or head back.</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => reset()} className={styles.retry}>
            Try again
          </button>
          <Button href="/" arrow>
            Back to Hertz
          </Button>
        </div>
      </Section>
    </main>
  )
}
