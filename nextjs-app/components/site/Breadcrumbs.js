import Link from 'next/link';

/**
 * Visible breadcrumb trail (server component). The matching BreadcrumbList
 * JSON-LD is emitted by each page via lib/schema.js.
 * @param items [{ href?, label }] — the last item is the current page.
 */
export default function Breadcrumbs({ items = [], label }) {
  if (items.length < 2) return null;
  return (
    <nav className="crumbs t-meta" aria-label={label}>
      <ol>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {i === items.length - 1 || !item.href
              ? <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
              : <Link href={item.href}>{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
