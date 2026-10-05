// Helper function to get complete dictionary with footer translations
export async function getDictionary(lang) {
  try {
    const [homepageDict, translationDict] = await Promise.all([
      import(`@/lib/locales/${lang}/homepage.json`),
      import(`@/lib/locales/${lang}/translation.json`)
    ]);
    return {
      ...homepageDict.default,
      translation: translationDict.default
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Return empty object as fallback
    return {};
  }
}

// Get dictionary for specific module
export async function getModuleDictionary(lang, module) {
  try {
    const moduleDict = await import(`@/lib/locales/${lang}/${module}.json`);
    return moduleDict.default;
  } catch (error) {
    console.error(`Failed to load ${module} translations:`, error);
    return {};
  }
}