// i18n configuration for admin panel
export const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export const defaultLanguage = 'de';

export const getLanguageName = (code) => {
  const lang = languages.find(l => l.code === code);
  return lang ? lang.name : code;
};

export const getLanguageFlag = (code) => {
  const lang = languages.find(l => l.code === code);
  return lang ? lang.flag : '🌐';
};