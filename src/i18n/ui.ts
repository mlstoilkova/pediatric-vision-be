import type { Locale } from './config';
import nl from './nl.json';
import en from './en.json';
import fr from './fr.json';

export type Ui = typeof nl;

const dictionaries: Record<Locale, Ui> = { nl, en, fr };

/** UI strings for a locale. Texts come from the doctor-approved translations (design/content/i18n). */
export function getUi(locale: Locale): Ui {
  return dictionaries[locale];
}
