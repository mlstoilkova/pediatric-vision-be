import { defineCollection, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defaultLocale, locales, type Locale } from './i18n/config';

/*
  All editable content. One file per language: src/content/<collection>/<locale>/<file>.
  The same layout is what the admin (public/admin/config.yml, Decap i18n "multiple_folders") reads and writes.

  Rules used below:
  - Text a translator fills in is `.default('')`. An empty value falls back to the Dutch text (see src/lib/content.ts),
    so a half-translated page never breaks the build.
  - Shared values (order, links, images) are copied into every language file by the admin ("duplicate").
  - Max lengths on titles and summaries keep cards from breaking; every image needs alt text.
*/

// The admin writes an empty optional field as `null`. Treat null like "not set" everywhere.
const nn = <T extends z.ZodType>(schema: T) => z.preprocess((value) => (value === null ? undefined : value), schema) as unknown as T;
const text = (max = 400) => nn(z.string().max(max).default(''));
const url = z.url();
const order = z.number().int();

// ---------- Clinics: Home "Drie locaties", Klinieken, booking bar, footer ----------
const clinics = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/clinics' }),
  schema: ({ image }) =>
    z.object({
      // Translated per language (empty: falls back to the Dutch file)
      city: text(30),
      addressLine1: text(60),
      addressLine2: text(60),
      photoAlt: text(140),
      // Shared: the admin copies these into every language file
      name: z.string().max(60),
      website: url,
      phone: z.string().max(25),
      mapsUrl: url,
      bookingUrl: url,
      photo: image(),
      order,
    }),
});

// ---------- Articles ----------
// An article is an ordered list of blocks: Markdown text, and "alarm" (red-flag) blocks that render
// in the blush box. Blocks can be reordered in the admin, so a red-flag box can sit anywhere in the text.
const articleBlock = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({
    type: z.literal('alarm'),
    title: nn(z.string().optional()),
    items: nn(z.array(z.string()).default([])),
  }),
]);

const articles = defineCollection({
  loader: glob({ pattern: '*/*.yml', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      /** URL part (not called "slug": the content loader would use that as the entry id). Empty: made from the title. */
      urlSlug: nn(z.string().max(80).optional()),
      // Translated per language (empty: falls back to the Dutch article)
      title: text(80),
      summary: text(160),
      /** Optional shorter text for the card on the homepage. */
      homeSummary: nn(z.string().max(160).optional()),
      imageAlt: text(140),
      // Shared
      image: image(),
      /** Shown when set. */
      publishedAt: nn(z.coerce.date().optional()),
      /** Minutes. Empty: counted from the text. */
      readingTime: nn(z.number().int().positive().optional()),
      showOnHome: nn(z.boolean().default(false)),
      homeOrder: nn(order.optional()),
      order,
      /** FAQ topic (file name in faq-topics) the article's FAQ card links to. */
      faqTopic: nn(z.string().optional()),
      content: nn(z.array(articleBlock).default([])),
    }),
});

// ---------- FAQ: topics and questions ----------
// A topic's file name is its anchor (e.g. #brillen). It never changes when the title is renamed.
const faqTopics = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/faq-topics' }),
  schema: z.object({ title: text(60), order }),
});

// The answer is the Markdown body of the file.
const faqQuestions = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/faq-questions' }),
  schema: z.object({ topic: z.string(), order, question: text(160) }),
});

// ---------- Singletons: pages, settings, legal ----------
// One file per page holding all languages: { nl: {...}, en: {...}, fr: {...} } (the layout Decap uses for
// file collections). Dutch is checked strictly. English and French are lenient: whatever is missing there
// falls back to the Dutch text, and an image that is missing there falls back to the Dutch image.
const obj = <T extends z.ZodRawShape>(shape: T) => nn(z.object(shape).prefault({} as never));
const list = <T extends z.ZodType>(item: T) => nn(z.array(item).default([]));
const str = nn(z.string().default(''));

type ImageSchema = ReturnType<ImageFunction>;

function localized<T extends z.ZodRawShape>(
  shape: (img: () => ImageSchema, optional: boolean) => T,
  { image }: { image: ImageFunction },
) {
  const strict = z.object(shape(() => image(), false));
  // English and French may leave the image out: the Dutch one is used (the admin copies it anyway)
  const lenientImage = () => nn(image().optional()) as unknown as ImageSchema;
  const lenient = () => nn(z.object(shape(lenientImage, true)).prefault({} as never));
  // One block per language from src/i18n/config.ts: adding a language there adds it here.
  const others = Object.fromEntries(locales.filter((l) => l !== defaultLocale).map((l) => [l, lenient()]));
  return z.object({ [defaultLocale]: strict, ...others } as { nl: typeof strict } & Record<Exclude<Locale, 'nl'>, ReturnType<typeof lenient>>);
}

const singleton = (file: string, base = './src/content/pages') => glob({ pattern: `${file}.yml`, base });

const pageHome = defineCollection({
  loader: singleton('home'),
  schema: ({ image }) =>
    localized(
      (img) => ({
        hero: obj({
          tag: text(80), title: text(80), lead: text(220), secondaryLabel: text(40),
          image: img(), imageAlt: text(140),
        }),
        conditions: obj({
          title: text(80), intro: text(220),
          chips: list(z.object({ label: text(60), article: str })),
        }),
        firstVisit: obj({
          badge: text(40), title: text(60), subtitle: text(60),
          steps: list(z.object({ title: text(40), text: text(300) })),
          tipLead: text(80), tipText: text(220),
          faqPrompt: text(80), faqLabel: text(60), faqTopic: str,
        }),
        about: obj({
          eyebrow: text(30), name: text(60), paragraphs: list(z.string()), buttonLabel: text(40),
          image: img(), imageAlt: text(140),
        }),
        locations: obj({ title: text(60), intro: text(220) }),
        articles: obj({ title: text(60), intro: text(220), readLabel: text(40) }),
      }),
      { image },
    ),
});

const pageAbout = defineCollection({
  loader: singleton('about'),
  schema: ({ image }) =>
    localized(
      (img) => ({
        hero: obj({
          eyebrow: text(30), name: text(60), subtitle: text(160), intro: text(400), researchLabel: text(60),
          image: img(), imageAlt: text(140),
        }),
        facts: list(z.object({ title: text(40), text: text(80) })),
        treatments: obj({
          title: text(60), intro: text(300),
          cards: list(z.object({ label: text(40), title: text(80), text: text(300) })),
        }),
        education: obj({
          title: text(60), intro: text(300),
          rows: list(z.object({ label: text(40), value: nn(z.string().optional()), tags: nn(z.array(z.string()).optional()) })),
        }),
        approach: obj({ eyebrow: text(30), statement: text(220), text: text(300) }),
        research: obj({
          title: text(60), paragraphs: list(z.string()),
          card: obj({ eyebrow: text(30), title: text(60), text: text(220), linkLabel: text(40), linkUrl: z.string().default('') }),
        }),
      }),
      { image },
    ),
});

const pageClinics = defineCollection({
  loader: singleton('clinics'),
  schema: ({ image }) =>
    localized(
      () => ({
        header: obj({ eyebrow: text(40), title: text(60), lead: text(300) }),
        labels: obj({ address: text(30), phone: text(30) }),
        banner: obj({
          pill: text(40), text: text(220), faqPrompt: text(40), faqLabel: text(60),
          faqTopic: str, expectLabel: text(60),
        }),
      }),
      { image },
    ),
});

const pageConditions = defineCollection({
  loader: singleton('conditions'),
  schema: ({ image }) =>
    localized(
      () => ({
        header: obj({ eyebrow: text(40), title: text(60), lead: text(300) }),
        booking: obj({ title: text(60), text: text(120) }),
      }),
      { image },
    ),
});

const pageFaq = defineCollection({
  loader: singleton('faq'),
  schema: ({ image }) =>
    localized(
      () => ({
        header: obj({ eyebrow: text(40), title: text(60), lead: text(300) }),
        topicsLabel: text(40),
        help: obj({ text: text(120), linkLabel: text(40) }),
      }),
      { image },
    ),
});

const pageArticle = defineCollection({
  loader: singleton('article'),
  schema: ({ image }) =>
    localized(
      () => ({
        backLabel: text(60),
        redFlagsLabel: text(40),
        alsoRead: text(40),
        faqCard: obj({ title: text(60), text: text(220), buttonLabel: text(40) }),
      }),
      { image },
    ),
});

const settingsUi = defineCollection({
  loader: singleton('ui', './src/content/settings'),
  schema: ({ image }) =>
    localized(
      () => ({
        nav: obj({ home: text(30), clinics: text(30), about: text(30), conditions: text(30) }),
        bookLabel: text(40),
        cta: obj({ title: text(80), text: text(300), faqLink: text(80) }),
        footer: obj({ privacy: text(40), faq: text(40), copyright: text(80) }),
        labels: obj({
          readArticle: text(40),
          /** "{n}" is replaced by the number of minutes. */
          readingTime: text(40),
        }),
      }),
      { image },
    ),
});

const seoPage = obj({ title: text(70), description: text(170) });

const settingsSite = defineCollection({
  loader: singleton('site', './src/content/settings'),
  schema: ({ image }) =>
    localized(
      (img) => ({
        siteName: text(40),
        /** Default meta description. */
        description: text(170),
        /** Image shown when a link to the site is shared. */
        socialImage: nn(img().optional()),
        /** Cloudflare Web Analytics token. Empty: no analytics. */
        analyticsId: str,
        seo: obj({ home: seoPage, clinics: seoPage, conditions: seoPage, about: seoPage, faq: seoPage, privacy: seoPage }),
      }),
      { image },
    ),
});

// Privacy and cookie policy: a title and a Markdown body per language.
const legal = defineCollection({
  loader: singleton('privacy', './src/content/legal'),
  schema: ({ image }) => localized(() => ({ title: text(80), body: str }), { image }),
});

export const collections = {
  clinics,
  articles,
  faqTopics,
  faqQuestions,
  legal,
  pageHome,
  pageAbout,
  pageClinics,
  pageConditions,
  pageFaq,
  pageArticle,
  settingsUi,
  settingsSite,
};
