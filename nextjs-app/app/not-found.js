import { fontVariables } from '@/lib/fonts';
import NotFoundContent from '@/components/NotFoundContent';

/**
 * Global 404 for URLs outside a valid locale (e.g. /foo/homepage, /cms-test,
 * missing static files). The root layout is a pass-through, so this file
 * renders its own <html>. Next.js adds `noindex` and the 404 status itself.
 */
export default function GlobalNotFound() {
  return (
    <html lang="de" className={fontVariables}>
      <body>
        <NotFoundContent standalone />
      </body>
    </html>
  );
}
