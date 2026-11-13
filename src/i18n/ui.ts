import type { Locale } from './config';
import nl from './nl.json';
import en from './en.json';
import fr from './fr.json';

export type Ui = typeof nl;

const dictionaries: Record<Locale, Ui> = { nl, en, fr };

/**
 * Technical strings that are not page copy: screen-reader labels, the skip link, "opens in a new tab".
 * Everything a visitor reads as content (nav labels, buttons, CTA, footer) lives in src/content and is
 * edited in the admin.
 */
export function getUi(locale: Locale): Ui {
  return dictionaries[locale];
}
