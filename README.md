# Handoff: Pediatric Vision — website for Dr. Irina Balikova (pediatric ophthalmologist, Belgium)

Domain: **pediatricvision.be** (registered at Hostinger, domain only — no hosting plan).

## Overview
A warm, playful but professional website for a pediatric ophthalmologist who sees patients in three clinics (Leuven, Brussel, Aarschot). Audience: parents (primary), referring doctors, children (indirectly). Main goals: explain what the doctor treats, what to expect at a first visit, and send parents to the right clinic's **external** booking system.

Pages (each in **NL, EN and FR** — all translated): Home · Klinieken (nav label **"Afspraak"**) · Aandoeningen / "Zorg voor kinderogen" (articles + booking bar; nav label **"Aandoeningen"**) · Over mij · Artikel (template, 4 articles) · FAQ · Privacy (to build).

**Live clickable prototype:** `prototype/index.html` (open in any browser, works offline; or deploy the `prototype/` folder to Netlify Drop for a public URL). Use it to click through every page, link and language. Prototype file names: `index`, `afspraak` (= clinics), `aandoeningen` (= articles), `over-mij`, `artikel?a=…`, `faq`; EN/FR versions prefixed `en-` / `fr-`.

> ⚠️ File-name trap: in `design/`, `Aandoeningen*.dc.html` is the **clinics** page (nav label "Afspraak") and `Afspraak*.dc.html` is the **articles** page (nav label "Aandoeningen"). The menu labels were swapped late; the file names were not. Follow the labels.

## About the design files
Everything in `design/` is a **design reference built in HTML** — a high-fidelity prototype of the intended look and behaviour, **not production code**. The `*.dc.html` files use a small in-house runtime (`support.js`) and inline styles; do not ship them. Recreate the design in a proper production stack (see "Recommended stack"), using a clean component structure and real CSS.

Open any `design/*.dc.html` file directly in a browser to see it (keep `support.js` and the assets next to it). Resize the window to see the responsive behaviour.

`design/Design System.dc.html` is the **single source of truth** for tokens, components and responsive rules. Read it first.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, imagery, characters and responsive behaviour are final. Recreate pixel-accurately at 360, 390, 430, 768, 1024, 1280, 1440 and 1920px.

## Requirements from the client (decided)
| Topic | Decision |
|---|---|
| Stack | Your recommendation (suggestion below) |
| Content editing | **Web dashboard with login** ("mini WordPress"), for 2 editors: the doctor + the site owner. No code needed to edit. |
| Editable content | Articles · Clinic details (addresses, phones, booking links, photos) · Over mij texts · Homepage texts · Photos |
| Languages | **NL (default) + EN + FR** at launch. All texts are written and **reviewed by the doctor** (see `design/* EN.dc.html`, `design/* FR.dc.html`, `design/content/en|fr/`, `design/content/i18n/*.json`) — use verbatim. DE may follow — build i18n so adding a locale is trivial. |
| Hosting | Your pick (Netlify recommended). Build and deploy **directly on pediatricvision.be** from day one — no separate test URL. The domain isn't public yet. Add `noindex` until the client says "launch", then remove it and submit the sitemap. |
| Analytics | Your recommendation — prefer privacy-friendly, cookieless (e.g. Plausible, Umami, Cloudflare Web Analytics) so no cookie banner is needed. |
| Extras | SEO (titles, meta, Open Graph, sitemap.xml, robots.txt, hreflang) · Privacy/cookie page (draft a template, GDPR/Belgium) · Accessibility checklist (WCAG 2.2 AA) |

### Recommended stack (suggestion — adjust if you have a better fit)
- **Astro** (static output, fast, great i18n routing, Markdown/MDX content collections).
- **CMS with a login dashboard, git-based, free:** Decap CMS or Keystatic (or TinaCMS). Collections: `articles`, `clinics`, singleton pages `home`, `overMij`, `settings` (footer, nav labels). Media library for photos.
- **Hosting:** Netlify or Cloudflare Pages (free tier, auto-deploy on CMS save, HTTPS). Point the Hostinger DNS (A/CNAME) to it. Set up `www` → apex redirect.
- **Images:** Astro `<Image>` with responsive `srcset`, AVIF/WebP, lazy loading below the fold.

## Sitemap, URLs & link map
Suggested URLs (NL default at root, EN under `/en/`, FR under `/fr/`):

| Page (nav label NL / EN / FR) | NL | EN | FR |
|---|---|---|---|
| Home | `/` | `/en/` | `/fr/` |
| Klinieken (Afspraak / Appointment / Rendez-vous) | `/afspraak/` | `/en/appointment/` | `/fr/rendez-vous/` |
| Zorg voor kinderogen (Aandoeningen / Conditions / Affections) | `/aandoeningen/` | `/en/conditions/` | `/fr/affections/` |
| Artikel | `/aandoeningen/<slug>/` | `/en/conditions/<slug>/` | `/fr/affections/<slug>/` |
| Over mij | `/over-mij/` | `/en/about/` | `/fr/a-propos/` |
| FAQ | `/veelgestelde-vragen/` | `/en/faq/` | `/fr/questions-frequentes/` |
| Privacy | `/privacy/` | `/en/privacy/` | `/fr/confidentialite/` |

Link map (all already wired in the prototype):
- Logo → Home. Nav (order as in design): Home · [articles page, label "Aandoeningen"] · Over mij · [clinics page, label "Afspraak"] (active item = blush pill `#F9DDD8`, weight 600). Do **not** add FAQ to the menu yet — client is deciding.
- Every internal **"Maak een afspraak"** button (header, hero, closing CTA) → Klinieken page.
- Home hero "Wat kunt u verwachten" → `#verwachtenB` (De eerste raadpleging section on Home).
- Home condition chips: Amblyopie → article amblyopie · Scheelzien → article strabisme · Myopie management → article myopie · all other chips → articles overview until dedicated articles exist.
- Home "Lees meer over mij →" → Over mij. Home article cards → their article.
- Footer city links (Leuven / Brussel / Aarschot) → Klinieken `#leuven` / `#brussel` / `#aarschot` (anchor scroll with ~120px offset for the sticky header).
- Klinieken: city chips → same-page anchors; per clinic: website ↗, address → Google Maps ↗, phone → `tel:`, **"Maak een afspraak ↗" → the clinic's external booking system (new tab)**. The ↗ is intentional: it signals leaving the site. Keep it.
- Afspraak: booking bar (LEUVEN↗ BRUSSEL↗ AARSCHOT↗) → external booking systems; article cards → article.
- Artikel: "← Zorg voor kinderogen" → articles overview; "Lees ook" → the other articles; FAQ card under "Lees ook" → FAQ, anchored to the relevant topic (myopie → `#brillen`; strabisme/amblyopie/pseudostrabisme → `#lui-oog-scheelzien`).
- FAQ entry points: footer link (all pages) · Home line under "De eerste raadpleging" → `#oogonderzoek` · Klinieken "Reken op 1 tot 1,5 uur" banner → `#oogonderzoek` · article FAQ card · text link under the closing CTA button ("Of bekijk eerst de veelgestelde vragen") — the client may remove this last one later, keep it easy to toggle.
- Language switcher keeps the user on the same page (and same article) in the other language.
- Footer: Privacy Policy → `/privacy/`; FAQ → FAQ page.
- Over mij: "Bekijk op PubMed ↗" → PubMed search for Balikova I (replace with the doctor's own list/ORCID if supplied).

External booking URLs, addresses, phones: see `design/Aandoeningen.dc.html` (also in the brief). These must be editable in the CMS (`clinics` collection: city, name, website, address, mapsUrl, phone, bookingUrl, photo, order).

## Screens
All pages share: sticky **header**, closing **CTA panel** "Klaar om een afspraak te maken?" (with thumbs-up character; not on the clinics/articles pages), and **footer**. Copy in all three languages must be taken verbatim from the design files (the doctor has approved recent NL corrections on Home).

1. **Home** (`Home.dc.html`) — Hero (photo + H1 "Kinderoogheelkunde…", primary + secondary buttons) → "Waarvoor kunt u bij ons terecht" (condition chips + bird) → "De eerste raadpleging" (3 numbered step cards on a mint panel + juggler tip "Voorzie zeker voldoende tijd!") + FAQ line → Over mij teaser (photo + text + soft button) → "Drie locaties" (3 clinic cards + locations character) → "Zorg voor kinderogen" (3 article cards: Myopie, Amblyopie, Strabisme — on mint panel + bird; each ends with "Lees het artikel →") → CTA → footer.
2. **Klinieken** (`Aandoeningen.dc.html`, nav label "Afspraak") — Page header (eyebrow "Afspraak maken", H1 "Klinieken", lead, city anchor chips, locations character) → 3 large clinic cards (photo/text 50/50, photo alternates sides on desktop, info rows Adres/Telefoon, primary "Maak een afspraak ↗") → mint info banner "Reken op 1 tot 1,5 uur" with juggler + FAQ link.
3. **Over mij** (`Over mij.dc.html`) — Profile intro (photo : text = 1 : 2.6, H1 "Dr. Irina Balikova" clamp(28px,3.4vw,44px), navy subtitle, 2 buttons) → 3 low-contrast fact cards → "Wat ik behandel" (2 cards) → "Opleiding en ervaring" (mint panel, label/value timeline rows, quiet specialisation tags) → "Mijn aanpak" statement (star-with-hat character) → "Onderzoek en publicaties" (text + PubMed card) → CTA.
4. **Zorg voor kinderogen** (`Afspraak.dc.html`, nav label "Aandoeningen") — Page header (flower character) → booking bar (3 outlined external city buttons) → featured article (wide, image 7 : text 5) → 3 article cards. Cards show a 14px line **clock icon + "N min lezen"** (no category tags) and "Lees het artikel →".
5. **Artikel** (`Artikel.dc.html?a=myopie|strabisme|amblyopie|pseudostrabisme`) — Back link, reading time, H1, lead (summary), wide image (radius 28), 720px text column: H2s, paragraphs (17px/1.7), bullet lists (coral 8px dots; sub-items hollow navy 6px dots), **red-flag block** (blush `#F9DDD8`, radius 26, attention-triangle character, eyebrow "Alarmsignalen"), "Lees ook" (other articles), mint FAQ card, CTA. Source texts: `design/content/*.md` — the prototype parses them heuristically; in production model them as proper Markdown/MDX with a `redFlags` field or a custom block in the CMS.

6. **FAQ** (`FAQ.dc.html`; sections and questions fully editable in the admin panel) — Page header (eyebrow "Voor ouders", yellow question-mark-with-glasses character `assets/characters/character-question-mark-glasses.png`) → two columns: sticky topic nav + mint "Staat uw vraag er niet bij?" box (left, 250px) and accordions grouped in 3 topics (`#oogonderzoek`, `#brillen`, `#lui-oog-scheelzien`) on the right. Accordion = native `<details>`, cream radius 22, + icon in a peach circle that rotates to a coral × when open. Mobile: topics become wrapping pills above, help box hidden. CMS: `faq` collection (topic, question, answer rich text, order, locale).

Article metadata to support in CMS: title, slug, summary, image, readingTime (auto), publishedAt (show date — brief asks for it; dates not supplied yet), body, redFlags, locale.

## Admin panel (CMS) — build BEFORE launch
The doctor (and the site owner) must be able to edit the site without code. Build this together with the pages, not after: all editable content lives in content files that the pages read.

**Recommended:** Decap CMS (or Keystatic) at `/admin`, git-based, free, hosted with the site on Netlify (Netlify Identity / Git Gateway, or GitHub login). Every save triggers a rebuild (~1 min).

**Users:** 2 editors — doctor + site owner. Invite-only, no public sign-up. Enable the **editorial workflow** (Draft → In review → Ready) so the owner can check before publishing.

**Admin UI language:** Dutch (Decap supports `locale: nl`).

**i18n:** NL / EN / FR side-by-side per entry (Decap `i18n: structure: multiple_folders`, locales nl/en/fr, default nl). Untranslated fields fall back to NL.

**Collections**
| Collection | Fields | Notes |
|---|---|---|
| Artikels | title, slug, summary, image (+alt), body (Markdown), redFlags (list: title + items), publishedAt, readingTime (auto), showOnHome (bool), order | Body supports headings, bullets, sub-bullets. Red flags render the blush block. |
| FAQ-onderwerpen | title, anchor slug (auto from title), order | The doctor can **add, rename, reorder and delete sections**. Start with: Het oogonderzoek, Brillen, Lui oog en scheelzien. |
| FAQ-vragen | topic (relation → FAQ-onderwerpen), question, answer (Markdown: paragraphs + bullets), order | The doctor can **add, edit, reorder and delete questions** in any section. The FAQ page, its topic nav and the deep links (`#oogonderzoek` etc.) are generated from this — nothing hard-coded. A section with no questions is hidden. |
| Klinieken | city, name, website, address, mapsUrl, phone, bookingUrl, photo (+alt), order | Feeds Home "Drie locaties", Klinieken page, booking bar, footer. Single source of truth. |
| Pagina's (singletons) | Home (hero title/lead, section titles & intros, 3 steps, tip, condition chips + link target), Over mij (intro, facts, treatments, timeline rows, approach, publications text + link), Footer & CTA texts | Keep layout fixed; only text/photos editable. |
| Instellingen | site title, meta descriptions per page, social image, analytics ID | |

**Media:** uploads go to `/public/uploads`; resize/convert at build time (AVIF/WebP, max 2000px) so a 13 MB phone photo can't slow the site.

**Guardrails:** required fields, max lengths on titles/summaries (so cards don't break), image alt text required, preview pane styled with the site's CSS.

**Deliverable:** `EDITING.md` (Dutch, with screenshots) for the doctor: log in, edit a text, add an article, change a phone number/booking link, replace a photo, publish.

## Responsive behaviour (critical — mirror exactly)
Breakpoints: **≤760 mobile · 761–1100 tablet (shared) · 761–820 tablet-768 specifics · >1100 desktop.** Side padding 40px, 22px ≤640. Max content width 1280px.

Mobile (≤760):
- Header: 3-track grid `1fr auto 1fr` — burger left, logo 112px centred, language pill right ("NL ▼", hairline border, teal `#00788C` text, 42px) opening a small NL/EN/FR menu. After scrolling past the hero (≈260px) the header shrinks: logo 86px, toggle hidden. Burger opens full-width menu (cream items, active = blush) + coral "Maak een afspraak".
- Hero stacks: photo on top, text below on the page colour, followed by a 1px hairline divider fading at both ends.
- All H2 = hero H1 size: `clamp(25px,7.2vw,34px)`, lh 1.16.
- Section characters move to the top-right of the heading (80px); heading + intro get `padding-right:84px`.
- Condition chips 44px tall, 15px, 8px gaps.
- Steps single column, 36px apart, step text 15px; juggler tip floats right with text wrapping, lead line bold navy 18px, no background.
- Location cards stacked, photo 110px. Article cards on Home: horizontal **swipe row** with scroll-snap, cards 78% wide.
- Footer: logo + 3 outlined city buttons (44px, one row); addresses hidden.

Tablet (761–1100): text-over-photo hero, height `max(490px,53vw)`, image `object-position: calc(88% + 30px) center`, intro max-width 19em · compact chips · steps 2×2 with the tip filling cell 4 · compact footer as mobile.
Tablet-768 only (761–820): characters top-right of headings (100px) · Over mij photo 250px + text, photo top-aligned · location & article cards 3-up compact (images 120px, titles 17px, text 15px).

Desktop (>1100): centred logo with nav pills + language dropdown below; grids `repeat(auto-fit,minmax(268–276px,1fr))` → 3 per row; full footer with clinic details.

## Design tokens
Colours — page `#F3EFEA` · cream/card `#FFFDFA` · peach `#FDF3EA` · blush/hover `#F9DDD8` · coral/action `#F48D99` (hover `#EF7382`) · mint panel `#BFE3E0` · mint light `#E0F0F0` · badge `#E4F1F0` · brand teal `#00859C` (teal **text** `#00788C`) · ink `#14243D` · navy `#1B3E70` · body `#41536D` · muted `#5B6C85` · hairlines `#E2DBD1` / `rgba(27,62,112,.18)`.
Typography — **Poppins** 400/500/600/700. Hero H1 clamp(32px,4vw,58px)/1.2/−.025em/700 · page H1 clamp(30px,4.2vw,56px) · H2 clamp(28px,3.4vw,46px)/1.08/−.02em/700 · step H3 clamp(20px,1.7vw,26px)/700 · card H3 21px/600/1.28 · lead 18px/1.6–1.7 · body 16px/1.6–1.65 · eyebrow 13px/700/.11em uppercase. Text minimum 13px.
Spacing — section top `clamp(56px,7vw,96px)`; heading→content 34–40px (28 mobile); card gaps 18/14/12.
Radius — pills 999 · CTA panel 36 · cards 28 · step/tip 26 · photos 20–22 · panels 16.
Depth — flat; only floating menus use `0 16px 38px rgba(20,36,61,.16)`. Sticky header `#F3EFEAF2` + `backdrop-filter: blur(10px)`.
Motion — characters gently bob (`translateY(-10px)` + ±1.5° rotate, 5.5–8s ease-in-out infinite). Respect `prefers-reduced-motion` (disable).
Buttons — primary coral/ink/700 · secondary cream/navy · dark navy (closing CTA only) · soft peach with coral → · text link underlined, ↗ for external. All ≥44px tall.

## Voice & copy
- Doctor speaks in first person ("Ik ontvang…").
- **Parents → u / uw. Children → je / jouw.** EN: "you". FR: parents **vous**, children **tu**; French typography (non-breaking space before ? ! : ; %, "Dr" without full stop). EN uses British spelling.
- Use sentence case; CTA wording always "Maak een afspraak" / "Book an appointment" / "Prendre rendez-vous".
- Article type naming: "Zorgtraject" (not "Zorgpad").

## Interactions & state
- Header shrink on scroll (threshold 260px, 220ms transitions on padding/logo width).
- Mobile menu open/close; language dropdown (desktop) / language pill menu (mobile) switches locale (route change to `/en/…` equivalent, persist choice).
- Anchor links scroll with sticky-header offset.
- Cards: whole card is the link; hover background → `#F9DDD8`. Chips hover → coral.
- External links: `target="_blank" rel="noopener"`.

## SEO
Unique `<title>`/meta description per page and locale, Open Graph/Twitter image, `hreflang` NL/EN/FR + `x-default`, `sitemap.xml`, `robots.txt`, canonical URLs, `lang` attribute, semantic headings (one H1 per page). Structured data: `Physician` / `MedicalClinic` (three locations with address + phone), `Article` for articles, `BreadcrumbList`.

## Privacy & analytics
- Draft a **Privacy & Cookie policy** template (NL + EN + FR) for a Belgian medical practice website under GDPR: controller details (placeholders), what is collected (analytics only, no forms), cookieless analytics statement, external booking platforms are third parties with their own policies, Google Fonts (prefer self-hosting Poppins to avoid third-party requests), rights + contact, Belgian DPA (Gegevensbeschermingsautoriteit). Mark placeholders clearly for the client to complete.
- If the chosen analytics is cookieless, no consent banner is needed; otherwise add a compliant consent banner.

## Accessibility checklist (WCAG 2.2 AA)
Contrast ≥4.5:1 for text (use `#00788C`, never plain teal/coral, for text on light backgrounds) · tap targets ≥44px · visible focus styles (add: 2px navy outline, 3px offset) · skip-to-content link · keyboard-operable menu and language switcher (`aria-expanded`, Esc closes) · decorative characters `alt=""` · meaningful alt on photos · `prefers-reduced-motion` · form-free site but correct landmarks (`header`, `nav`, `main`, `footer`) · language attributes on EN/NL content · zoom to 200% without loss.

## Assets
- `design/assets/` — logo (SVG), hero photo, doctor photo, clinic photos, article images, character SVGs (`assets/characters/`), icons.
- `design/*.png` — the exact character and step-icon renders used on the pages (preferred over the SVG variants where both exist).
- `design/content/*.md` — article texts NL; `content/en/`, `content/fr/` — translations; `content/i18n/en.json`, `fr.json` — UI string translations (NL → EN/FR); `articles-meta.json` — translated titles/summaries; `articles.json` — slugs, images.
- `design-brief.md` — the original client brief (clinic data, booking links, bio, tone).
- Do not redraw, recolour or replace the approved characters. Character placements per section are listed in the Design System (section "Characters & icons").


## Files
- `design/<Page>.dc.html` (NL), `design/<Page> EN.dc.html`, `design/<Page> FR.dc.html` for Home, Aandoeningen (= clinics), Afspraak (= articles), Over mij, Artikel, FAQ — page references.
- `prototype/` — self-contained clickable prototype of all 18 pages (the "live prototype").
- `design/Design System.dc.html` — tokens, components, page patterns, responsive rules, characters, accessibility & voice.
- `design/support.js` — prototype runtime only (needed to open the reference files; not for production).

## Open items for the client
1. **Privacy text** — template to be drafted by you; client fills placeholders.
2. **FAQ in main menu** — client is asking the doctor; don't add yet.
3. **Article publication dates** — not supplied yet; field must exist.
4. **Article source texts** contain typos/inconsistent spellings (e.g. "Zonnenbril" on Home step 3, "strabismechirurgie" vs "strabismuschirurgie") Flag the rest for the doctor; don't silently rewrite medical content.
5. **EN/FR translations** — done and **reviewed by the doctor**; use them verbatim.
6. **Condition chips without an article** link to the articles overview for now.

## Suggested build order for Claude Code (build directly on pediatricvision.be)
1. Scaffold project + tokens + Poppins (self-hosted) + base layout (header/footer/CTA).
2. Build components from the Design System; verify each at all breakpoints.
3. Pages (NL) → content collections + CMS config → EN + FR routes using the existing translations.
4. SEO, analytics, privacy page, a11y pass (axe + keyboard test).
5. Deploy (Netlify/Cloudflare Pages), connect pediatricvision.be DNS at Hostinger, HTTPS, redirects.
6. Write a short `EDITING.md` for the doctor: how to log in, add an article, change a clinic's phone/booking link, replace a photo.
