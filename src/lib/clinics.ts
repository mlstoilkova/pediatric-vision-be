import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/config';

export interface Clinic {
  /** Anchor on the clinics page: leuven, brussel, aarschot (same in every language). */
  slug: string;
  city: string;
  name: string;
  website: string;
  /** Display text for the website link, e.g. "oogartsenleuven.be". */
  websiteLabel: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  /** `tel:` URL, Belgian numbers are written with a leading 0. */
  phoneHref: string;
  mapsUrl: string;
  bookingUrl: string;
  order: number;
}

function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('0') ? `+32${digits.slice(1)}` : digits}`;
}

/** Clinics for a locale, in the order set in the CMS. */
export async function getClinics(locale: Locale): Promise<Clinic[]> {
  const entries = await getCollection('clinics', (entry) => entry.id.startsWith(`${locale}/`));
  return entries
    .map(({ id, data }) => ({
      ...data,
      slug: id.split('/')[1],
      websiteLabel: new URL(data.website).hostname.replace(/^www\./, ''),
      phoneHref: toTelHref(data.phone),
    }))
    .sort((a, b) => a.order - b.order);
}
