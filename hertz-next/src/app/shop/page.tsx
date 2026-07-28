import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import StatusBadge from '@/components/ui/StatusBadge'
import ReserveForm from '@/components/forms/ReserveForm'
import WaitlistForm from '@/components/forms/WaitlistForm'
import styles from './shop.module.css'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Hertz uniform: Drop 01 Lanyard, woven nylon, numbered 001-200, shipped from Bologna. Reserve by email.',
  alternates: { canonical: '/shop' },
}

const SPECS = ['001 / 200', 'Woven nylon', 'Black · 5 cm', 'Ships from Bologna']
const CATEGORIES = ['Apparel', 'Outerwear', 'Headwear']

export default function ShopPage() {
  return (
    <main id="main">
      <Section surface="paper" space="lg">
        <PageHeader
          index="07"
          kicker="Shop"
          title="Clubber apparel."
          intro={
            <p>
              Small, numbered drops made for the floor, not the feed. Reserve by email; we confirm
              and ship from Bologna. First object below.
            </p>
          }
          aside={<StatusBadge status="soon" label="Coming soon" />}
        />
      </Section>

      <Section surface="white" space="lg">
        <div className={styles.product}>
          <ImageFrame
            src="/assets/merch-lanyard-drop01.webp"
            alt="Hertz lanyard, Drop 01"
            ratio="1 / 1"
            priority
            glitch={false}
            className={styles.visual}
          />
          <div className={styles.info}>
            <span className={`${styles.dropTag} hz-mono`}>Drop 01</span>
            <h2 className={styles.title}>Lanyard</h2>
            <p className={styles.desc}>
              Woven nylon, 5 cm, black. 200 pieces per drop, numbered 001-200, ships from Bologna.
              Reserve now. We confirm as soon as the run is ready.
            </p>
            <ul className={styles.specs}>
              {SPECS.map((s) => (
                <li key={s} className="hz-mono">
                  {s}
                </li>
              ))}
            </ul>
            <div className={styles.form}>
              <ReserveForm item="Lanyard · Drop 01" />
            </div>
          </div>
        </div>
      </Section>

      <Section surface="paper" space="md">
        <SectionLabel index="08" kicker="More soon" title="The rest of the kit." />
        <ul className={styles.cats}>
          {CATEGORIES.map((c) => (
            <li key={c} className={styles.cat}>
              <span className={styles.catName}>{c}</span>
              <StatusBadge status="soon" />
            </li>
          ))}
        </ul>
        <div className={styles.waitlist}>
          <WaitlistForm />
        </div>
      </Section>
    </main>
  )
}
