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

## Where things live
| What | Where |
|---|---|
| Design tokens (colour, radius, spacing) | `src/styles/tokens.css` (from `design/Design System.dc.html`) |
| Reset, base, type scale, character animation | `src/styles/global.css` |
| Every URL in every language | `src/i18n/routes.ts` (nav, footer, language switcher and hreflang all read it) |
| UI strings (nav, buttons, CTA, footer) | `src/i18n/{nl,en,fr}.json`, texts taken verbatim from the doctor-approved translations |
| Clinics (footer now; Home and Klinieken later) | `src/content/clinics/<locale>/<clinic>.json` |
| Header, footer, closing CTA, buttons | `src/components/` |
| Page shell, SEO tags, hreflang | `src/layouts/Base.astro` |
| Pages | `src/pages/[...slug].astro` generates all 18 URLs from the route table |

## Hidden from search engines
Every page has `noindex` until `PUBLIC_ALLOW_INDEXING=true` is set in the hosting environment (see `.env.example`).
Nothing else changes at launch.

## Adding a language
1. Add it to `src/i18n/config.ts`.
2. Add `src/i18n/<locale>.json` and import it in `src/i18n/ui.ts`.
3. Add a path per page in `src/i18n/routes.ts`.
4. Add the clinic files in `src/content/clinics/<locale>/`.

## Where the build differs from the design, on purpose
- **Footer copyright colour** is `#5B6C85`, not the design's `#98A4B6` (about 2.5:1 contrast, below WCAG AA).
- **Headings are not hyphenated.** The prototype has no `lang` attribute, so it never hyphenated. Setting `lang` correctly would have turned on `hyphens: auto` and split words like "af-spraak".
- **The footer city names are paragraphs, not `h3`s**, so heading order stays valid on every page.
- **Language choice is not stored.** The language is in the URL, and every link stays in it. No cookies or local storage are used.
- **Some UI strings are new** (not in the design) and still need the doctor's review in all three languages: `skip`, `menu.open`, `menu.close`, `newTab`, `nav.label` and `titles.privacy` in `src/i18n/*.json`. The FAQ link under the CTA comes from the Home EN/FR design pages, not the i18n files.
