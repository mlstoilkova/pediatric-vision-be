# Development notes

The handoff in `README.md`, `design/` and `prototype/` is the reference. This file describes the code.

## Commands
Needs Node 22.23.4 or newer (Astro 7).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run check    # type check
```

To edit content through the admin on your own computer (no login), run these in two terminals, then open
http://localhost:4321/admin/ :

```bash
npm run cms      # local file server for the admin (writes straight into src/content)
npm run dev
```

## Where things live
| What | Where |
|---|---|
| Design tokens (colour, radius, spacing) | `src/styles/tokens.css` (from `design/Design System.dc.html`) |
| Reset, base, type scale, character animation | `src/styles/global.css` |
| Every URL in every language | `src/i18n/routes.ts` (nav, footer, language switcher and hreflang all read it) |
| Which languages exist | `src/i18n/config.ts` (the schemas and the admin generator read it too) |
| Technical strings (skip link, screen-reader labels) | `src/i18n/{nl,en,fr}.json` |
| **All page copy and data** | `src/content/` (see below) |
| Content schemas | `src/content.config.ts` |
| Reading content, Dutch fallback, integrity check | `src/lib/content.ts`, `src/lib/clinics.ts` |
| Header, footer, closing CTA, buttons | `src/components/` |
| Page shell, SEO tags, hreflang | `src/layouts/Base.astro` |
| Pages | `src/pages/[...slug].astro` generates all 30 URLs (6 pages and 4 articles, in 3 languages) and picks the view |
| Page views | `src/views/` (Home, Klinieken, Zorg voor kinderogen, Article, Over mij, FAQ, Privacy) |
| Shared pieces | `src/components/` (Photo, Character, PageHead, ArticleCard, Prose for Markdown text, ...) |
| Markdown, articles, FAQ loaders | `src/lib/markdown.ts`, `articles.ts`, `faq.ts` |
| Admin config generator | `scripts/admin-config.mjs` writes `public/admin/config.yml` |

## Content
Everything a visitor reads lives in `src/content`. Nothing editable is written into a component.

| Collection | Files | Notes |
|---|---|---|
| `articles` | `articles/<lang>/<id>.yml` | An article is an ordered list of blocks: Markdown `text` blocks and `alarm` (red-flag) blocks. |
| `faq-topics` | `faq-topics/<lang>/<id>.json` | The file name is the anchor (`#brillen`); renaming the title does not change it. |
| `faq-questions` | `faq-questions/<lang>/<id>.md` | Front matter: topic, order, question. The body is the answer. |
| `clinics` | `clinics/<lang>/<id>.json` | One source for Home, Klinieken, booking bar and footer. |
| pages | `pages/<page>.yml` | One file per page holding all languages: `nl:`, `en:`, `fr:`. |
| settings | `settings/{ui,site}.yml` | Menu, buttons, CTA, footer, SEO, analytics token. |
| `legal` | `legal/privacy.yml` | Privacy and cookie policy (a Markdown body per language). |

- **Untranslated text falls back to Dutch** (`withFallback`, `getLocalized`). Only the Dutch text is required.
- **The build checks the content** (`assertContentIntegrity`): an article that links to a deleted FAQ topic, two articles with
  the same URL, or content with no Dutch original stops the build with a readable message. The live site stays as it was.
- Images live in `src/assets/uploads` and are referenced by relative path, so Astro makes right-sized AVIF/WebP at build time.
- The admin writes empty optional fields as `null`; the schemas treat `null` as "not set".

## The admin (`/admin`)
Decap CMS, in Dutch, with NL / EN / FR side by side. Editors log in with GitHub and every change is committed to the repo.

- The config is **generated** from `scripts/admin-config.mjs` (`npm run admin:config`, also runs before `dev` and `build`). Edit the script.
- The Decap app is copied from `node_modules` into `public/admin/decap` before every build (`scripts/copy-decap.mjs`), so
  `/admin` is served from our own domain, not a CDN. The copy is not committed.
- Login goes through Netlify's OAuth service. This needs, in Netlify: a GitHub OAuth app registered under
  *Site configuration > Access & security > OAuth*. Editors need write access to the (private) repository.
- `publish_mode: editorial_workflow` (Draft > In review > Ready) creates a pull request per change, so editors need write access.
- Pages, settings and privacy are single files holding all languages, because Decap only supports that layout for file
  collections. Articles, FAQ and clinics are one file per language.
- Photos are stripped of metadata (GPS, camera) and re-encoded in the browser on upload. Resizing is left to the build.

### Verified locally (Decap's local server, headless browser)
Creating, editing, reordering and deleting FAQ topics and questions; editing an article and a page; creating an article with
text and red-flag blocks; uploading a phone photo (metadata stripped); length limits blocking a save; the site building from
what the admin wrote, including untranslated entries.

### Not verified yet (needs the real GitHub login, step 6)
The GitHub login, the draft/review workflow, and the photo preview in the editor (the picker shows photos, but the small
preview of the current photo stays empty on the local server).

## Hidden from search engines
Every page has `noindex` until `PUBLIC_ALLOW_INDEXING=true` is set in the hosting environment (see `.env.example`).
Nothing else changes at launch.

## Adding a language
1. Add it to `locales` in `src/i18n/config.ts` (the schemas and the admin generator pick it up).
2. Add `src/i18n/<locale>.json`, import it in `src/i18n/ui.ts`, and add a path per page in `src/i18n/routes.ts`.
3. Content: add a `<locale>:` block to each file in `pages/`, `settings/` and `legal/`, and `<locale>/` files in the folder collections.
   (Anything left out falls back to Dutch.)

## Where the build differs from the design, on purpose
- **Footer copyright colour** is `#5B6C85`, not the design's `#98A4B6` (about 2.5:1 contrast, below WCAG AA).
- **Hyphenation follows each prototype.** The English and French prototype pages have a `lang` attribute, so their headings
  hyphenate (`hyphens: auto`) where the design asks for it; the Dutch page has none, so Dutch headings never did. Same here
  (`html:not([lang='nl'])` in `global.css`).
- **The footer city names are paragraphs, not `h3`s**, so heading order stays valid on every page.
- **Language choice is not stored.** The language is in the URL, and every link stays in it. No cookies or local storage are used.
- **Articles are blocks, not one Markdown body plus a red-flag field.** The prototype puts the red-flag box in the middle of the
  text (and the strabismus article has two), so the box has to be positionable.
- **Emoji in the article sources are dropped**, as the prototype does.
- **A long "word/word" in an article heading may break after the slash** on narrow screens. In the prototype the heading runs off
  the screen at 360px (e.g. "ophthalmologist/orthoptist").
- **Numbered lists** (amblyopia causes) are real `<ol>`s styled like the prototype's small dotted items, with the number inline.
- **Reading time is the same everywhere.** The French prototype said 3 minutes on the overview but 4 on the article page.
- **Article card images are decorative** (`alt=""`, as in the prototype: the title next to them says it). The article page keeps
  the real alt text.
- **The Klinieken banner** reproduces the layout it inherits in the prototype (stacked on tablet, plain block on mobile).
- **Anchor links** scroll with one offset (150px, 120px on mobile) so a heading is never hidden under the sticky header.
- **Some UI strings are new** (not in the design) and still need the doctor's review in all three languages: `skip`, `menu.open`,
  `menu.close`, `newTab` and `mainNav` in `src/i18n/*.json`, the alt texts of the four article images, and the privacy page title.
- **No preview pane in the admin** (the README asks for one styled with the site's CSS). The real pages now exist, so this can be added.

## Known limits
- `npm audit` reports vulnerabilities inside Decap's own dependency tree (for example an old markdown parser). They sit in the
  editor app used by the two logged-in editors; the public site is static and contains none of it.
- The first time Decap saves a file it rewrites it in its own key order and line wrapping. The content is identical; only the
  formatting changes once per file.

## How the pages were checked against the prototype
Every page, in all three languages, at 360, 768, 1024 and 1440px, was compared with its prototype page by matching every text
and image in order and measuring position and size. 106 of 108 checks match to within 1.7px, page height included. The other two
(English and French myopia article at 360px) differ by one line because of the slash break above. All 30 pages pass the axe
accessibility checks at desktop and mobile width, all 474 internal links and anchors resolve, and the home page downloads about
320 KB on a phone (the hero photo is 20 KB).
