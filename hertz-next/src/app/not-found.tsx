import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import FrequencyCut from '@/motion/FrequencyCut'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main id="main">
      <Section surface="signal" space="lg">
        <p className={`${styles.code} hz-mono`}>404 · No signal</p>
        <h1 className={styles.title}>This frequency is off the air.</h1>
        <FrequencyCut variant="editorial" trigger="mount" className={styles.cut} />
        <p className={styles.text}>
          The page you&rsquo;re looking for isn&rsquo;t here: wrong link, or the night moved on.
        </p>
        <div className={styles.actions}>
          <Button href="/" arrow>
            Back to Hertz
          </Button>
          <Button href="/events" variant="ghost" arrow>
            See the calendar
          </Button>
        </div>
      </Section>
    </main>
  )
}

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}
