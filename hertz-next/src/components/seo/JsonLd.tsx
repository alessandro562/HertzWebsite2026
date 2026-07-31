/**
 * JsonLd — inietta uno structured data block schema.org.
 *
 * Server component: il JSON finisce nell'HTML statico, quindi è leggibile
 * anche dai crawler che non eseguono JavaScript (la maggior parte dei bot
 * dei motori generativi non lo esegue).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
