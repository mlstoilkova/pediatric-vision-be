# Prompts for Claude Code — paste one at a time, check the result, then continue

1. Read README.md fully and open prototype/index.html. Propose the stack and folder structure (Astro + Decap CMS recommended). Don't write code yet — list any questions.

2. Set up the project: tokens, self-hosted Poppins, base layout (header, footer, closing CTA), NL/EN/FR routing and the language switcher. Match design/Design System.dc.html.

3. Create the content model and admin panel exactly as in "Admin panel (CMS)" in README.md — including FAQ sections and questions the doctor can add, edit, reorder and delete. Move all texts from the design files into content files (NL, EN, FR), verbatim. Nothing editable may be hard-coded in pages.

4. Build the pages one by one from the content files: Home, Klinieken, Zorg voor kinderogen + articles, Over mij, FAQ. Compare each with the prototype at 360, 768, 1024 and 1440px.

5. Add the Privacy & cookie page (template), SEO, cookieless analytics and do the accessibility pass from README.md.

6. Deploy to Netlify and connect pediatricvision.be right away: tell me exactly which DNS records to set at Hostinger, set up HTTPS and the www → apex redirect. Keep the site on noindex for now. Enable /admin login and invite two editors: [doctor's email] and [your email]. Write EDITING.md in Dutch (including how to add a FAQ section and question).

7. Launch: remove noindex, submit the sitemap to Google Search Console, and run a final check of all links, languages and forms on mobile and desktop.
