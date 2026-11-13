import { locales, type Locale } from './config';

/**
 * The single source of truth for URLs. Every page, the nav, the footer, the language
 * switcher, hreflang and (later) the sitemap read from here.
 *
 * File-name trap from the design: `clinics` is the page labelled "Afspraak" in the nav
 * (design/Aandoeningen*.dc.html) and `conditions` is the articles page labelled
 * "Aandoeningen" (design/Afspraak*.dc.html). Keys follow the content, labels follow the design.
 */
export const pageKeys = ['home', 'clinics', 'conditions', 'about', 'faq', 'privacy'] as const;
export type PageKey = (typeof pageKeys)[number];

const paths: Record<PageKey, Record<Locale, string>> = {
  home: { nl: '', en: 'en', fr: 'fr' },
  clinics: { nl: 'afspraak', en: 'en/appointment', fr: 'fr/rendez-vous' },
  conditions: { nl: 'aandoeningen', en: 'en/conditions', fr: 'fr/affections' },
  about: { nl: 'over-mij', en: 'en/about', fr: 'fr/a-propos' },
  faq: { nl: 'veelgestelde-vragen', en: 'en/faq', fr: 'fr/questions-frequentes' },
  privacy: { nl: 'privacy', en: 'en/privacy', fr: 'fr/confidentialite' },
};

/**
 * A page, or an article (which lives under the `conditions` page). An article carries its URL part per
 * language, from the article content, so the language switcher can stay on the same article.
 */
export type PageRef = { page: PageKey; articleSlugs?: Record<Locale, string> };

/** Absolute path with a trailing slash, e.g. `/`, `/en/appointment/`, `/fr/affections/trajet-de-soins-strabisme/`. */
export function pagePath(ref: PageRef, locale: Locale): string {
  let path = paths[ref.page][locale];
  if (ref.articleSlugs) path = `${path}/${ref.articleSlugs[locale]}`;
  return path ? `/${path}/` : '/';
}

/** Value for the `[...slug]` route param (undefined for the NL home page at `/`). */
export function pageSlugParam(page: PageKey, locale: Locale): string | undefined {
  return paths[page][locale] || undefined;
}

export { locales };
