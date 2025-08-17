export const i18n = {
  defaultLocale: 'de',
  locales: ['de', 'en', 'fr', 'it', 'es'],
};

export const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export function getLocaleFromPath(pathname) {
  const segments = pathname.split('/');
  const locale = segments[1];
  
  if (i18n.locales.includes(locale)) {
    return locale;
  }
  
  return i18n.defaultLocale;
}