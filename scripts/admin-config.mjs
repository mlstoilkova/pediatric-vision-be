// Generates public/admin/config.yml (the Decap CMS admin).
//
// Why a script: with Decap's i18n every nested field needs its own language flag, and the same
// handful of field types repeat a hundred times. Here that is one helper call each.
// Run with `npm run admin:config` (also runs before `npm run dev` and `npm run build`).
// Edit THIS file, not config.yml.
//
// Options (env):  ADMIN_SIMPLE=1  publish straight to the files, no draft/review steps. For local testing only.
//                 ADMIN_OUT=path  where to write the config.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const REPO = 'mlstoilkova/pediatric-vision-be';
const SITE = 'https://pediatricvision.be';
// The languages come from src/i18n/config.ts, the single place to add one.
const LOCALES = [...fs.readFileSync(new URL('../src/i18n/config.ts', import.meta.url), 'utf8').match(/locales = \[([^\]]+)\]/)[1].matchAll(/'([a-z]{2})'/g)].map((m) => m[1]);

// ---------------------------------------------------------------------------
// Field helpers. `T` = translated per language, `D` = shared (copied into every language).
// ---------------------------------------------------------------------------
const max = (n) => ['^[\\s\\S]{0,' + n + '}$', `Maximaal ${n} tekens`];
const T = (name, label, o = {}) => ({ name, label, widget: 'string', i18n: true, ...o });
const TT = (name, label, o = {}) => T(name, label, { widget: 'text', ...o });
const D = (name, label, widget, o = {}) => ({ name, label, widget, i18n: 'duplicate', ...o });
const group = (name, label, fields, o = {}) => ({ name, label, widget: 'object', collapsed: true, fields, ...o });
const items = (name, label, fields, { singular = 'item', ...o } = {}) => ({ name, label, widget: 'list', label_singular: singular, collapsed: true, fields, ...o });
const strings = (name, label, itemLabel, { long = false, singular = 'item', ...o } = {}) => ({
  name, label, widget: 'list', label_singular: singular, field: { name: 'item', label: itemLabel, widget: long ? 'text' : 'string' }, ...o,
});
const order = (label = 'Volgorde', o = {}) =>
  D('order', label, 'number', { value_type: 'int', min: 1, required: true, hint: 'Het laagste nummer komt eerst.', ...o });
const topicRelation = (name, label, o = {}) =>
  D(name, label, 'relation', { collection: 'faq-topics', value_field: '{{slug}}', search_fields: ['title'], display_fields: ['title'], required: false, ...o });
const articleRelation = (name, label, o = {}) =>
  T(name, label, { widget: 'relation', collection: 'articles', value_field: '{{slug}}', search_fields: ['title'], display_fields: ['title'], required: false, ...o });
const image = (name, label, o = {}) => D(name, label, 'image', { required: true, choose_url: false, ...o });
const alt = (name = 'imageAlt', label = 'Beschrijving van de afbeelding (alt-tekst)') =>
  T(name, label, { required: true, pattern: max(140), hint: 'Beschrijf kort wat er te zien is. Voor slechtzienden en zoekmachines.' });

// Everything inside a translated group is translated unless it says otherwise.
function withDefaults(fields) {
  return fields.map((f) => {
    const out = { ...f, i18n: f.i18n === undefined ? true : f.i18n };
    if (out.fields) out.fields = withDefaults(out.fields);
    if (out.field) out.field = withDefaults([out.field])[0];
    if (out.types) out.types = out.types.map((t) => ({ ...t, fields: withDefaults(t.fields) }));
    return out;
  });
}

const MD_BUTTONS = ['bold', 'italic', 'link', 'heading-two', 'heading-three', 'bulleted-list', 'numbered-list'];
const MD_SMALL = ['bold', 'italic', 'link', 'bulleted-list', 'numbered-list'];
const markdown = (name, label, o = {}) =>
  T(name, label, { widget: 'markdown', buttons: MD_BUTTONS, modes: ['rich_text', 'raw'], editor_components: [], ...o });

// Image folders: content files live at different depths, so the public path differs.
const UPLOADS = 'src/assets/uploads';
const FROM_FOLDER_ENTRY = '../../../assets/uploads'; // src/content/<collection>/<locale>/<file>
const FROM_SINGLETON = '../../assets/uploads'; // src/content/<collection>/<file>

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
const articles = {
  name: 'articles',
  label: 'Artikels',
  label_singular: 'Artikel',
  description: 'Artikels voor ouders. Titel, samenvatting en tekst schrijf je per taal; foto, volgorde en links gelden voor alle talen.',
  folder: 'src/content/articles',
  extension: 'yml',
  format: 'yml',
  create: true,
  i18n: true,
  identifier_field: 'title',
  slug: '{{slug}}',
  summary: '{{order}}. {{title}}',
  public_folder: FROM_FOLDER_ENTRY,
  sortable_fields: [
    { field: 'order', label: 'Volgorde', default_sort: 'asc' },
    { field: 'title', label: 'Titel' },
  ],
  fields: withDefaults([
    T('title', 'Titel', { required: true, pattern: max(80), hint: 'Maximaal 80 tekens, anders past de titel niet op de kaart.' }),
    TT('summary', 'Samenvatting', { required: true, pattern: max(160), hint: 'Twee korte zinnen voor de kaart en bovenaan het artikel. Maximaal 160 tekens.' }),
    TT('homeSummary', 'Samenvatting voor de homepage', { required: false, pattern: max(160), hint: 'Optioneel. Alleen invullen als de kaart op de homepage een andere tekst moet hebben.' }),
    image('image', 'Foto'),
    alt(),
    order('Volgorde op de artikelpagina'),
    D('showOnHome', 'Toon op de homepage', 'boolean', { default: false }),
    D('homeOrder', 'Volgorde op de homepage', 'number', { value_type: 'int', min: 1, required: false, hint: 'Alleen nodig als het artikel op de homepage staat.' }),
    topicRelation('faqTopic', 'FAQ-onderwerp van dit artikel', { hint: 'De FAQ-kaart onder het artikel verwijst naar dit onderwerp.' }),
    D('publishedAt', 'Publicatiedatum', 'datetime', { required: false, date_format: 'DD-MM-YYYY', time_format: false, format: 'YYYY-MM-DD', hint: 'Optioneel. Wordt getoond als je een datum invult.' }),
    D('readingTime', 'Leestijd (minuten)', 'number', { value_type: 'int', min: 1, required: false, hint: 'Leeg laten: de leestijd wordt automatisch berekend.' }),
    T('urlSlug', 'Webadres', {
      required: false,
      pattern: ['^[a-z0-9-]*$', 'Alleen kleine letters, cijfers en streepjes'],
      hint: 'Optioneel. Leeg laten: het webadres wordt gemaakt van de titel. Per taal.',
    }),
    {
      name: 'content',
      label: 'Tekst van het artikel',
      widget: 'list',
      label_singular: 'blok',
      collapsed: false,
      i18n: true,
      hint: 'Een artikel bestaat uit blokken. Gebruik "Tekst" voor koppen, alinea’s en lijsten, en "Alarmsignalen" voor het rode kader. Je kunt blokken verslepen om ze van volgorde te wisselen.',
      types: [
        {
          name: 'text',
          label: 'Tekst',
          widget: 'object',
          summary: 'Tekst',
          fields: [markdown('text', 'Tekst', { required: true })],
        },
        {
          name: 'alarm',
          label: 'Alarmsignalen (rood kader)',
          widget: 'object',
          summary: 'Alarmsignalen {{fields.title}}',
          fields: [
            T('title', 'Titel (optioneel)', { required: false }),
            strings('items', 'Punten', 'Punt', { singular: 'punt' }),
          ],
        },
      ],
    },
  ]),
};

const faqTopics = {
  name: 'faq-topics',
  label: 'FAQ-onderwerpen',
  label_singular: 'FAQ-onderwerp',
  description: 'De rubrieken van de pagina Veelgestelde vragen. Een onderwerp zonder vragen wordt niet getoond.',
  folder: 'src/content/faq-topics',
  extension: 'json',
  format: 'json',
  create: true,
  i18n: true,
  identifier_field: 'title',
  slug: '{{slug}}',
  summary: '{{order}}. {{title}}',
  sortable_fields: [
    { field: 'order', label: 'Volgorde', default_sort: 'asc' },
    { field: 'title', label: 'Titel' },
  ],
  fields: withDefaults([
    T('title', 'Titel van het onderwerp', {
      required: true,
      pattern: max(60),
      hint: 'De naam van het bestand wordt de link naar dit onderwerp (bijvoorbeeld #brillen). Het onderwerp hernoemen verandert die link niet.',
    }),
    order('Volgorde van het onderwerp'),
  ]),
};

const faqQuestions = {
  name: 'faq-questions',
  label: 'FAQ-vragen',
  label_singular: 'FAQ-vraag',
  description: 'Vragen en antwoorden. Kies bij elke vraag het onderwerp waaronder ze komt.',
  folder: 'src/content/faq-questions',
  extension: 'md',
  format: 'frontmatter',
  create: true,
  i18n: true,
  identifier_field: 'question',
  slug: '{{slug}}',
  summary: '{{question}}',
  sortable_fields: [
    { field: 'topic', label: 'Onderwerp' },
    { field: 'order', label: 'Volgorde', default_sort: 'asc' },
    { field: 'question', label: 'Vraag' },
  ],
  view_groups: [{ label: 'Onderwerp', field: 'topic' }],
  fields: withDefaults([
    topicRelation('topic', 'Onderwerp', { required: true }),
    order('Volgorde binnen het onderwerp'),
    T('question', 'Vraag', { required: true, pattern: max(160) }),
    markdown('body', 'Antwoord', { required: true, buttons: MD_SMALL, hint: 'Alinea’s en opsommingen. Een lege regel begint een nieuwe alinea.' }),
  ]),
};

const clinics = {
  name: 'clinics',
  label: 'Klinieken',
  label_singular: 'Kliniek',
  description: 'Adressen, telefoonnummers en boekingslinks. Dit is de enige plek: Home, Klinieken en de footer lezen het hier.',
  folder: 'src/content/clinics',
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  i18n: true,
  identifier_field: 'name',
  slug: '{{slug}}',
  summary: '{{city}} · {{name}}',
  public_folder: FROM_FOLDER_ENTRY,
  sortable_fields: [{ field: 'order', label: 'Volgorde', default_sort: 'asc' }],
  fields: withDefaults([
    T('city', 'Stad', { required: true, pattern: max(30), hint: 'Per taal, bijvoorbeeld Louvain in het Frans.' }),
    D('name', 'Naam van de praktijk', 'string', { required: true, pattern: max(60) }),
    D('website', 'Website', 'string', { required: true, pattern: ['^https?://', 'Begin met https://'] }),
    T('addressLine1', 'Adres: straat en nummer', { required: true, pattern: max(60) }),
    T('addressLine2', 'Adres: postcode en gemeente', { required: true, pattern: max(60) }),
    D('phone', 'Telefoonnummer', 'string', { required: true, pattern: max(25), hint: 'Zoals het getoond wordt, bijvoorbeeld 016 46 56 08.' }),
    D('mapsUrl', 'Link naar Google Maps', 'string', { required: true, pattern: ['^https?://', 'Begin met https://'] }),
    D('bookingUrl', 'Link om een afspraak te maken', 'string', { required: true, pattern: ['^https?://', 'Begin met https://'], hint: 'Het boekingssysteem van de kliniek.' }),
    image('photo', 'Foto van de kliniek'),
    alt('photoAlt', 'Beschrijving van de foto (alt-tekst)'),
    order('Volgorde'),
  ]),
};

// --- Pages (one file, all languages side by side) ---------------------------
const i18nSingle = { structure: 'single_file', locales: LOCALES, default_locale: 'nl' };
const page = (name, label, description, file, fields) => ({ name, label, description, file, i18n: true, fields: withDefaults(fields) });

const pages = {
  name: 'pages',
  label: 'Pagina’s',
  description: 'De teksten en foto’s van elke pagina. Links NL, rechts de taal die je kiest.',
  // (No media_folder here: a relative one would be read relative to the file. The global one applies.)
  public_folder: FROM_SINGLETON,
  i18n: i18nSingle,
  files: [
    page('home', 'Home', 'De homepage.', 'src/content/pages/home.yml', [
      group('hero', 'Bovenaan', [
        T('tag', 'Label boven de titel', { pattern: max(80) }),
        T('title', 'Titel', { required: true, pattern: max(80) }),
        TT('lead', 'Inleiding', { pattern: max(220) }),
        T('secondaryLabel', 'Tweede knop (naar "De eerste raadpleging")', { pattern: max(40) }),
        image('image', 'Foto'),
        alt(),
      ], { collapsed: false }),
      group('conditions', 'Waarvoor kunt u bij ons terecht', [
        T('title', 'Titel', { pattern: max(80) }),
        TT('intro', 'Inleiding', { pattern: max(220) }),
        items('chips', 'Aandoeningen', [
          T('label', 'Naam', { required: true, pattern: max(60) }),
          articleRelation('article', 'Artikel waarnaar het verwijst', { hint: 'Leeg: verwijst naar het overzicht van artikels.' }),
        ], { singular: 'aandoening', summary: '{{fields.label}}' }),
      ]),
      group('firstVisit', 'De eerste raadpleging', [
        T('badge', 'Geel label', { pattern: max(40) }),
        T('title', 'Titel', { pattern: max(60) }),
        T('subtitle', 'Ondertitel', { pattern: max(60) }),
        items('steps', 'De drie stappen', [
          T('title', 'Titel', { required: true, pattern: max(40) }),
          TT('text', 'Tekst', { required: true, pattern: max(300) }),
        ], { singular: 'stap', summary: '{{fields.title}}', min: 3, max: 3, hint: 'Precies drie stappen, in volgorde. De pictogrammen staan vast.' }),
        T('tipLead', 'Tip: eerste zin', { pattern: max(80) }),
        TT('tipText', 'Tip: tekst', { pattern: max(220) }),
        T('faqPrompt', 'Zin boven de FAQ-link', { pattern: max(80) }),
        T('faqLabel', 'Tekst van de FAQ-link', { pattern: max(60) }),
        topicRelation('faqTopic', 'FAQ-onderwerp waarnaar de link verwijst'),
      ]),
      group('about', 'Over mij (korte versie)', [
        T('eyebrow', 'Klein label', { pattern: max(30) }),
        T('name', 'Naam', { pattern: max(60) }),
        strings('paragraphs', 'Tekst', 'Alinea', { long: true, singular: 'alinea' }),
        T('buttonLabel', 'Tekst van de knop', { pattern: max(40) }),
        image('image', 'Foto'),
        alt(),
      ]),
      group('locations', 'Drie locaties', [
        T('title', 'Titel', { pattern: max(60) }),
        TT('intro', 'Inleiding', { pattern: max(220) }),
      ]),
      group('articles', 'Zorg voor kinderogen', [
        T('title', 'Titel', { pattern: max(60) }),
        TT('intro', 'Inleiding', { pattern: max(220) }),
        T('readLabel', 'Tekst onder elke kaart', { pattern: max(40), hint: 'Bijvoorbeeld "Lees het artikel".' }),
      ]),
    ]),

    page('about', 'Over mij', 'De pagina over de arts.', 'src/content/pages/about.yml', [
      group('hero', 'Bovenaan', [
        T('eyebrow', 'Klein label', { pattern: max(30) }),
        T('name', 'Naam', { required: true, pattern: max(60) }),
        T('subtitle', 'Ondertitel', { pattern: max(160) }),
        TT('intro', 'Inleiding', { pattern: max(400) }),
        T('researchLabel', 'Tweede knop (naar "Onderzoek en publicaties")', { pattern: max(60) }),
        image('image', 'Foto'),
        alt(),
      ], { collapsed: false }),
      items('facts', 'Drie feiten', [
        T('title', 'Titel', { required: true, pattern: max(40) }),
        T('text', 'Tekst', { pattern: max(80) }),
      ], { singular: 'feit', summary: '{{fields.title}}', min: 3, max: 3 }),
      group('treatments', 'Wat ik behandel', [
        T('title', 'Titel', { pattern: max(60) }),
        TT('intro', 'Inleiding', { pattern: max(300) }),
        items('cards', 'Kaarten', [
          T('label', 'Klein label', { pattern: max(40) }),
          T('title', 'Titel', { required: true, pattern: max(80) }),
          TT('text', 'Tekst', { pattern: max(300) }),
        ], { singular: 'kaart', summary: '{{fields.title}}' }),
      ]),
      group('education', 'Opleiding en ervaring', [
        T('title', 'Titel', { pattern: max(60) }),
        TT('intro', 'Inleiding', { pattern: max(300) }),
        items('rows', 'Rijen', [
          T('label', 'Label', { required: true, pattern: max(40) }),
          TT('value', 'Tekst', { required: false, pattern: max(300), hint: 'Gebruik Tekst óf Tags.' }),
          strings('tags', 'Tags', 'Tag', { required: false, singular: 'tag', hint: 'Voor een rij met meerdere korte items, zoals specialisaties.' }),
        ], { singular: 'rij', summary: '{{fields.label}}' }),
      ]),
      group('approach', 'Mijn aanpak', [
        T('eyebrow', 'Klein label', { pattern: max(30) }),
        TT('statement', 'Uitspraak', { pattern: max(220) }),
        TT('text', 'Tekst', { pattern: max(300) }),
      ]),
      group('research', 'Onderzoek en publicaties', [
        T('title', 'Titel', { pattern: max(60) }),
        strings('paragraphs', 'Tekst', 'Alinea', { long: true, singular: 'alinea' }),
        group('card', 'Kaart met link', [
          T('eyebrow', 'Klein label', { pattern: max(30) }),
          T('title', 'Titel', { pattern: max(60) }),
          TT('text', 'Tekst', { pattern: max(220) }),
          T('linkLabel', 'Tekst van de link', { pattern: max(40) }),
          D('linkUrl', 'Link (bijvoorbeeld PubMed of ORCID)', 'string', { pattern: ['^https?://', 'Begin met https://'] }),
        ]),
      ]),
    ]),

    page('clinics', 'Klinieken', 'De pagina met de drie klinieken. De gegevens van de klinieken zelf staan onder "Klinieken".', 'src/content/pages/clinics.yml', [
      group('header', 'Bovenaan', [
        T('eyebrow', 'Klein label', { pattern: max(40) }),
        T('title', 'Titel', { required: true, pattern: max(60) }),
        TT('lead', 'Inleiding', { pattern: max(300) }),
      ], { collapsed: false }),
      group('labels', 'Labels bij elke kliniek', [
        T('address', 'Adres', { pattern: max(30) }),
        T('phone', 'Telefoon', { pattern: max(30) }),
      ]),
      group('banner', 'Groen kader "Reken op 1 tot 1,5 uur"', [
        T('pill', 'Gele pil', { pattern: max(40) }),
        TT('text', 'Tekst', { pattern: max(220) }),
        T('faqPrompt', 'Zin voor de FAQ-link', { pattern: max(40) }),
        T('faqLabel', 'Tekst van de FAQ-link', { pattern: max(60) }),
        topicRelation('faqTopic', 'FAQ-onderwerp waarnaar de link verwijst'),
        T('expectLabel', 'Tekst van de knop naar "De eerste raadpleging"', { pattern: max(60) }),
      ]),
    ]),

    page('conditions', 'Zorg voor kinderogen', 'De pagina met alle artikels. (In het menu heet ze "Aandoeningen".)', 'src/content/pages/conditions.yml', [
      group('header', 'Bovenaan', [
        T('eyebrow', 'Klein label', { pattern: max(40) }),
        T('title', 'Titel', { required: true, pattern: max(60) }),
        TT('lead', 'Inleiding', { pattern: max(300) }),
      ], { collapsed: false }),
      group('booking', 'Balk "Maak een afspraak"', [
        T('title', 'Titel', { pattern: max(60) }),
        T('text', 'Tekst', { pattern: max(120) }),
      ]),
    ]),

    page('faq', 'Veelgestelde vragen', 'De teksten rond de vragen. De vragen zelf staan onder "FAQ-vragen".', 'src/content/pages/faq.yml', [
      group('header', 'Bovenaan', [
        T('eyebrow', 'Klein label', { pattern: max(40) }),
        T('title', 'Titel', { required: true, pattern: max(60) }),
        TT('lead', 'Inleiding', { pattern: max(300) }),
      ], { collapsed: false }),
      T('topicsLabel', 'Label boven de lijst met onderwerpen', { pattern: max(40) }),
      group('help', 'Hulpvak "Staat uw vraag er niet bij?"', [
        T('text', 'Tekst', { pattern: max(120) }),
        T('linkLabel', 'Tekst van de link naar de klinieken', { pattern: max(40) }),
      ]),
    ]),

    page('article', 'Artikel (vaste teksten)', 'De vaste teksten rond elk artikel.', 'src/content/pages/article.yml', [
      T('backLabel', 'Terug-link bovenaan', { pattern: max(60) }),
      T('redFlagsLabel', 'Label van het rode kader', { pattern: max(40), hint: 'Bijvoorbeeld "Alarmsignalen".' }),
      T('alsoRead', 'Titel van "Lees ook"', { pattern: max(40) }),
      group('faqCard', 'FAQ-kaart onderaan', [
        T('title', 'Titel', { pattern: max(60) }),
        TT('text', 'Tekst', { pattern: max(220) }),
        T('buttonLabel', 'Tekst van de knop', { pattern: max(40) }),
      ]),
    ]),
  ],
};

const settings = {
  name: 'settings',
  label: 'Instellingen',
  description: 'Menu, knoppen, footer, afspraak-balk en zoekmachine-instellingen.',
  public_folder: FROM_SINGLETON,
  i18n: i18nSingle,
  files: [
    page('ui', 'Menu, knoppen, afspraak-balk en footer', 'De teksten die op elke pagina terugkomen.', 'src/content/settings/ui.yml', [
      group('nav', 'Menu', [
        T('home', 'Home', { pattern: max(30) }),
        T('clinics', 'Afspraak', { pattern: max(30) }),
        T('about', 'Over mij', { pattern: max(30) }),
        T('conditions', 'Aandoeningen', { pattern: max(30) }),
      ], { collapsed: false }),
      T('bookLabel', 'Tekst van de knop "Maak een afspraak"', { required: true, pattern: max(40) }),
      group('cta', 'Afspraak-balk onderaan de pagina’s', [
        T('title', 'Titel', { pattern: max(80) }),
        TT('text', 'Tekst', { pattern: max(300) }),
        T('faqLink', 'Link naar de FAQ onder de knop', { pattern: max(80) }),
      ]),
      group('footer', 'Footer', [
        T('privacy', 'Link naar het privacybeleid', { pattern: max(40) }),
        T('faq', 'Link naar de FAQ', { pattern: max(40) }),
        T('copyright', 'Copyright', { pattern: max(80) }),
      ]),
      group('labels', 'Vaste woorden', [
        T('readArticle', 'Onder elke artikelkaart', { pattern: max(40), hint: 'Bijvoorbeeld "Lees het artikel".' }),
        T('readingTime', 'Leestijd', { pattern: max(40), hint: 'Schrijf {n} waar het aantal minuten moet komen, bijvoorbeeld "{n} min lezen".' }),
      ]),
    ]),

    page('site', 'Website en zoekmachines', 'Naam van de website, beschrijving voor Google en statistieken.', 'src/content/settings/site.yml', [
      D('siteName', 'Naam van de website', 'string', { required: true, pattern: max(40) }),
      TT('description', 'Standaardbeschrijving voor zoekmachines', { required: true, pattern: max(170), hint: 'Wat Google onder de titel toont. Maximaal 170 tekens.' }),
      image('socialImage', 'Afbeelding bij het delen van een link', { required: false, hint: 'Optioneel. Wordt getoond als iemand de website deelt op WhatsApp of sociale media.' }),
      D('analyticsId', 'Cloudflare Web Analytics-token', 'string', { required: false, hint: 'Leeg laten: geen statistieken.' }),
      group(
        'seo',
        'Titel en beschrijving per pagina',
        ['home', 'clinics', 'conditions', 'about', 'faq', 'privacy'].map((key) =>
          group(key, { home: 'Home', clinics: 'Klinieken', conditions: 'Zorg voor kinderogen', about: 'Over mij', faq: 'Veelgestelde vragen', privacy: 'Privacybeleid' }[key], [
            T('title', 'Titel voor zoekmachines', { required: false, pattern: max(70), hint: 'Optioneel. Leeg: de titel van de pagina.' }),
            TT('description', 'Beschrijving voor zoekmachines', { required: false, pattern: max(170), hint: 'Optioneel. Leeg: de inleiding van de pagina.' }),
          ]),
        ),
      ),
    ]),
  ],
};

const legal = {
  name: 'legal',
  label: 'Privacybeleid',
  description: 'De tekst van het privacy- en cookiebeleid.',
  i18n: i18nSingle,
  files: [
    page('privacy', 'Privacy- en cookiebeleid', 'Een sjabloon voor een Belgische praktijk. Vul de gemarkeerde gegevens aan.', 'src/content/legal/privacy.yml', [
      T('title', 'Titel', { required: true, pattern: max(80) }),
      markdown('body', 'Tekst', { required: false, buttons: MD_BUTTONS }),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// The config
// ---------------------------------------------------------------------------
const simple = process.env.ADMIN_SIMPLE === '1';

const config = {
  // Logging in: GitHub, through Netlify's OAuth service (no server of our own).
  // Needs a GitHub OAuth app registered in Netlify: Site configuration > Access & security > OAuth.
  backend: {
    name: 'github',
    repo: REPO,
    branch: 'main',
    base_url: 'https://api.netlify.com',
    auth_endpoint: 'auth',
    squash_merges: true,
    commit_messages: {
      create: 'Nieuw {{collection}}: {{slug}}',
      update: 'Aangepast {{collection}}: {{slug}}',
      delete: 'Verwijderd {{collection}}: {{slug}}',
      uploadMedia: 'Afbeelding toegevoegd: {{path}}',
      deleteMedia: 'Afbeelding verwijderd: {{path}}',
    },
  },
  // On localhost, `npx decap-server` lets you edit the local files without logging in. Ignored on the live site.
  local_backend: true,
  // Draft > In review > Ready. The owner can check what the doctor wrote before it goes live.
  publish_mode: simple ? 'simple' : 'editorial_workflow',
  locale: 'nl',
  site_url: SITE,
  display_url: SITE,
  logo: { src: '/favicon.svg', show_in_header: true },
  editor: { preview: false },
  slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
  i18n: { structure: 'multiple_folders', locales: LOCALES, default_locale: 'nl' },
  // Photos: stripped of metadata (location, camera) and re-encoded. The site itself serves right-sized
  // AVIF/WebP versions made at build time, so a big phone photo never slows the website down.
  media_folder: UPLOADS,
  public_folder: FROM_FOLDER_ENTRY,
  media_processing: { enabled: true, quality: 85, strip_metadata: true },
  collections: [articles, faqTopics, faqQuestions, clinics, pages, settings, legal],
};

const header = `# GENERATED by scripts/admin-config.mjs. Do not edit this file; edit the script and run \`npm run admin:config\`.\n`;
const out = process.env.ADMIN_OUT ?? path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public', 'admin', 'config.yml');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, header + YAML.stringify(config, { lineWidth: 0 }));
console.log(`admin config written to ${path.relative(process.cwd(), out)}${simple ? ' (simple mode)' : ''}`);
