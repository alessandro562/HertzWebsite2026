import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import StatusBadge from '@/components/ui/StatusBadge'
import WaitlistForm from '@/components/forms/WaitlistForm'
import JsonLd from '@/components/seo/JsonLd'
import { SITE } from '@/lib/site'
import { DEFAULT_OG_IMAGE, breadcrumbNode } from '@/lib/seo'
import styles from './shop.module.css'

export const metadata: Metadata = {
  title: 'Clubber Apparel & Gadgets',
  description:
    'Hertz clubber apparel and gadgets: small numbered drops made for the floor, shipped from Bologna. The first drop is coming soon — join the list.',
  keywords: ['merch', 'clubber apparel', 'gadget', 'drop', 'Bologna', 'clubbing'],
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/shop`,
    title: 'Clubber Apparel & Gadgets · Hertz Clubbing Collective',
    description:
      'Small numbered drops made for the floor, shipped from Bologna. The first Hertz drop is coming soon.',
    images: [DEFAULT_OG_IMAGE],
  },
}

/* Cosa arriverà: categorie reali del merch Hertz (nessun prodotto ancora
   ufficiale → tutto "coming soon", nessun form di prenotazione). */
const CATEGORIES = ['Apparel', 'Outerwear', 'Headwear', 'Accessories']

export default function ShopPage() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbNode([{ name: 'Shop', path: '/shop' }])} />

      <Section surface="paper" space="lg">
        <PageHeader
          kicker="Shop"
          title="Clubber apparel."
          intro={
            <p>
              Clubber apparel and gadgets, made for the floor rather than the feed: small, numbered
              drops in limited runs, shipped from Bologna. We&rsquo;re still putting the first pieces
              together, so nothing is on sale just yet.
            </p>
          }
          aside={<StatusBadge status="soon" label="Coming soon" />}
        />
      </Section>

      <Section surface="white" space="lg">
        <SectionLabel kicker="What's coming" title="Apparel & gadgets." />
        <p className={styles.lede}>
          T-shirts and hoodies, outerwear, headwear and small accessories built around the Hertz
          identity: minimal, numbered and made to wear on the floor and off it. Every drop stays
          limited and ships from Bologna. The actual pieces, prices and how to buy will land here
          once the first run is ready.
        </p>
        <ul className={styles.cats}>
          {CATEGORIES.map((c) => (
            <li key={c} className={styles.cat}>
              <span className={styles.catName}>{c}</span>
              <StatusBadge status="soon" />
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="paper" space="md">
        <SectionLabel kicker="Stay in the loop" title="Get the first drop." />
        <p className={styles.lede}>
          Leave your email and we&rsquo;ll let you know the moment the first drop goes live.
        </p>
        <div className={styles.waitlist}>
          <WaitlistForm />
        </div>
      </Section>
    </main>
  )
}
