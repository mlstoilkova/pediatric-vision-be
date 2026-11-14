import type { ImageMetadata } from 'astro';
import { getLocalized, articleSlug } from './content';
import { countWords, renderMarkdown } from './markdown';
import { locales, type Locale } from '../i18n/config';
import { pagePath, type PageRef } from '../i18n/routes';

export type ArticleBlock =
  | { type: 'text'; html: string }
  | { type: 'alarm'; title?: string; items: string[] };

export interface Article {
  /** File name, the same in every language. */
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Text for the card on the homepage (falls back to the summary). */
  homeSummary: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Minutes: the editor's number, or counted from the text. */
  readingTime: number;
  publishedAt?: Date;
  showOnHome: boolean;
  homeOrder: number;
  order: number;
  faqTopic?: string;
  blocks: ArticleBlock[];
  href: string;
}

const WORDS_PER_MINUTE = 200;

/** All articles in one language, in the order of the articles page. Untranslated text falls back to Dutch. */
export async function getArticles(locale: Locale): Promise<Article[]> {
  const entries = await getLocalized('articles', locale);
  return entries
    .map(({ id, data }) => {
      const blocks: ArticleBlock[] = data.content.map((block) =>
        block.type === 'text'
          ? { type: 'text', html: renderMarkdown(block.text) }
          : { type: 'alarm', title: block.title || undefined, items: block.items },
      );
      const words = data.content.reduce(
        (sum, block) => sum + (block.type === 'text' ? countWords(block.text) : block.items.join(' ').split(/\s+/).length),
        0,
      );
      const slug = articleSlug(data);
      return {
        id,
        slug,
        title: data.title,
        summary: data.summary,
        homeSummary: data.homeSummary || data.summary,
        image: data.image,
        imageAlt: data.imageAlt,
        readingTime: data.readingTime ?? Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        publishedAt: data.publishedAt ?? undefined,
        showOnHome: data.showOnHome,
        homeOrder: data.homeOrder ?? 99,
        order: data.order,
        faqTopic: data.faqTopic ?? undefined,
        blocks,
        href: pagePath({ page: 'conditions', articleSlugs: slugsFor(slug) }, locale),
      } satisfies Article;
    })
    .sort((a, b) => a.order - b.order);
}

// The path helper needs a slug for every language; this one is only used for the current language's link.
function slugsFor(slug: string) {
  return Object.fromEntries(locales.map((l) => [l, slug])) as Record<Locale, string>;
}

/** The URL part of one article in every language, so the language switcher stays on the same article. */
export async function getArticleSlugs(id: string): Promise<Record<Locale, string>> {
  const out = {} as Record<Locale, string>;
  for (const locale of locales) {
    const article = (await getArticles(locale)).find((a) => a.id === id);
    out[locale] = article?.slug ?? id;
  }
  return out;
}

/** Link to an article in one language by its id, e.g. from a homepage chip. */
export async function articleHref(id: string, locale: Locale): Promise<string | undefined> {
  const article = (await getArticles(locale)).find((a) => a.id === id);
  return article?.href;
}

export type { PageRef };
