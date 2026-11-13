// Adding a locale (e.g. German): add it here, add src/i18n/de.json, a route entry per page in
// routes.ts, and the content files per locale. Nothing else is locale-specific.
export const locales = ['nl', 'en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'nl';

/** Name of each language, written in that language (used in the language menu). */
export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  fr: 'Français',
};

/** Short code shown on the language button. */
export const localeCodes: Record<Locale, string> = { nl: 'NL', en: 'EN', fr: 'FR' };

/** Open Graph locale. */
export const ogLocales: Record<Locale, string> = { nl: 'nl_BE', en: 'en_GB', fr: 'fr_BE' };
