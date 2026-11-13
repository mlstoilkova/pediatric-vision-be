export const SITE = {
  name: 'Pediatric Vision',
  url: 'https://pediatricvision.be',
  // Hidden from search engines until PUBLIC_ALLOW_INDEXING=true (see .env.example).
  noindex: import.meta.env.PUBLIC_ALLOW_INDEXING !== 'true',
} as const;

export const FEATURES = {
  // The client may remove the "Of bekijk eerst de veelgestelde vragen" link under the closing CTA.
  // Set to false to hide it on every page. (Becomes a CMS toggle in step 3.)
  ctaFaqLink: true,
};
