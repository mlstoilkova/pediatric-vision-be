import { defineConfig } from 'astro/config';

// NL is the default locale and lives at the root; EN and FR live under /en/ and /fr/.
// Localized slugs (e.g. /afspraak/, /en/appointment/, /fr/rendez-vous/) come from
// src/i18n/routes.ts, which is also what the language switcher and hreflang use.
export default defineConfig({
  site: 'https://pediatricvision.be',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
});
