import { serializeJsonLd } from '@/lib/schema';

/**
 * Server component that emits one JSON-LD <script>. `<` is escaped so CMS
 * text can never close the script tag.
 */
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
