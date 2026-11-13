import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, type Locale } from '../i18n/config';
import { slugify } from './slug';

/**
 * Untranslated text falls back to Dutch: an empty string, a missing field or an empty list in
 * EN/FR is replaced by the Dutch value. Lists are translated as a whole.
 */
export function withFallback<T>(value: T | undefined, base: T): T {
  return merge(value, base) as T;
}

function merge(value: any, base: any): any {
  if (value === undefined || value === null || value === '') return base;
  if (Array.isArray(value)) return value.length ? value : base;
  if (isPlainObject(value) && isPlainObject(base)) {
    const out: Record<string, any> = { ...base };
    for (const key of Object.keys(value)) out[key] = merge(value[key], base[key]);
    return out;
  }
  return value;
}

function isPlainObject(v: unknown): v is Record<string, any> {
  // Image metadata is copied as it is
  return typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype && !('src' in v);
}

/** Pages, settings and legal: one file each, holding all languages as { nl, en, fr }. */
const SINGLETON_FILE = {
  pageHome: 'home',
  pageAbout: 'about',
  pageClinics: 'clinics',
  pageConditions: 'conditions',
  pageFaq: 'faq',
  pageArticle: 'article',
  settingsUi: 'ui',
  settingsSite: 'site',
  legal: 'privacy',
} as const;
type Singleton = keyof typeof SINGLETON_FILE;

export async function getSingleton<K extends Singleton>(
  collection: K,
  locale: Locale,
): Promise<CollectionEntry<K>['data']['nl']> {
  type Data = CollectionEntry<K>['data']['nl'];
  const file = SINGLETON_FILE[collection];
  const entry = (await getEntry(collection as any, file)) as { data: Record<Locale, Data> } | undefined;
  if (!entry) throw new Error(`Missing content file for "${collection}" (expected "${file}.yml").`);
  const dutch = entry.data[defaultLocale];
  if (locale === defaultLocale) return dutch;
  return withFallback(entry.data[locale], dutch);
}

type Folder = 'articles' | 'faqTopics' | 'faqQuestions' | 'clinics';

/**
 * The entries of a folder collection in one language, always one per Dutch entry. Whatever is missing in
 * the other language (an untranslated title, an empty answer) comes from the Dutch entry.
 * `id` is the file name, the same in every language. `body` is the Markdown body for .md collections.
 */
export async function getLocalized<K extends Folder>(
  collection: K,
  locale: Locale,
): Promise<{ id: string; data: CollectionEntry<K>['data']; body: string }[]> {
  type Entry = { id: string; data: CollectionEntry<K>['data']; body?: string };
  const all = (await getCollection(collection as any)) as Entry[];
  const byId = new Map(all.map((entry) => [entry.id, entry]));
  return all
    .filter((entry) => idParts(entry.id).locale === defaultLocale)
    .map((base) => {
      const id = idParts(base.id).name;
      const own = locale === defaultLocale ? undefined : byId.get(`${locale}/${id}`);
      return {
        id,
        data: withFallback(own?.data, base.data),
        body: own?.body?.trim() ? own.body : (base.body ?? ''),
      };
    });
}

/** The URL part of an article in one language. */
export function articleSlug(data: { urlSlug?: string; title: string }): string {
  return data.urlSlug?.trim() || slugify(data.title);
}

/** A FAQ topic's anchor (#brillen) is its file name, so it survives renaming the topic. */
export function idParts(id: string): { locale: string; name: string } {
  const [locale, ...rest] = id.split('/');
  return { locale, name: rest.join('/') };
}

/**
 * Checked on every build. A broken link between content (an article pointing at a FAQ topic that was
 * deleted, two articles with the same URL, content for an article that has no Dutch version) stops the
 * build with a readable message instead of publishing a half-broken site. The live site stays as it was.
 */
export async function assertContentIntegrity(): Promise<void> {
  const problems: string[] = [];
  const names = (entries: { id: string }[], locale: string) =>
    new Set(entries.filter((e) => idParts(e.id).locale === locale).map((e) => idParts(e.id).name));

  const [articles, topics, questions, clinics] = await Promise.all([
    getCollection('articles'),
    getCollection('faqTopics'),
    getCollection('faqQuestions'),
    getCollection('clinics'),
  ]);
  const localizedArticles = await Promise.all(locales.map(async (locale) => [locale, await getLocalized('articles', locale)] as const));

  const dutchArticles = names(articles, defaultLocale);
  const dutchTopics = names(topics, defaultLocale);
  const dutchQuestions = names(questions, defaultLocale);
  const dutchClinics = names(clinics, defaultLocale);

  for (const locale of locales) {
    // Content in another language needs a Dutch original
    for (const [label, entries, dutch] of [
      ['article', articles, dutchArticles],
      ['FAQ topic', topics, dutchTopics],
      ['FAQ question', questions, dutchQuestions],
      ['clinic', clinics, dutchClinics],
    ] as const) {
      for (const name of names(entries, locale)) {
        if (!dutch.has(name)) problems.push(`${label} "${name}" exists in ${locale} but has no Dutch version.`);
      }
    }

    // Article URLs must be unique per language (an untranslated article uses its Dutch URL)
    const seen = new Map<string, string>();
    for (const entry of localizedArticles.find(([l]) => l === locale)?.[1] ?? []) {
      const slug = articleSlug(entry.data);
      const other = seen.get(slug);
      if (other) problems.push(`Articles "${other}" and "${entry.id}" have the same URL (${locale}: ${slug}).`);
      seen.set(slug, entry.id);
    }
  }

  for (const entry of articles) {
    const { faqTopic } = entry.data;
    if (faqTopic && !dutchTopics.has(faqTopic)) problems.push(`Article "${entry.id}" links to FAQ topic "${faqTopic}", which does not exist.`);
  }
  for (const entry of questions) {
    if (!dutchTopics.has(entry.data.topic)) problems.push(`FAQ question "${entry.id}" is in topic "${entry.data.topic}", which does not exist.`);
  }

  const home = (await getEntry('pageHome', 'home'))?.data[defaultLocale];
  for (const chip of home?.conditions.chips ?? []) {
    if (chip.article && !dutchArticles.has(chip.article)) problems.push(`Home chip "${chip.label}" links to article "${chip.article}", which does not exist.`);
  }
  for (const [label, topic] of [
    ['Home', home?.firstVisit.faqTopic],
    ['Klinieken', (await getEntry('pageClinics', 'clinics'))?.data[defaultLocale].banner.faqTopic],
  ] as const) {
    if (topic && !dutchTopics.has(topic)) problems.push(`${label} links to FAQ topic "${topic}", which does not exist.`);
  }

  if (problems.length) {
    throw new Error(`Content problems:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  }
}
