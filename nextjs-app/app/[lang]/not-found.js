import NotFoundContent from '@/components/NotFoundContent';

// 404 inside a valid locale (missing project, unknown sub-path). Rendered
// within app/[lang]/layout.js, so <html lang> matches the URL.
export default function LocaleNotFound() {
  return <NotFoundContent />;
}
