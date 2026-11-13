import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per clinic per language: src/content/clinics/<locale>/<slug>.json
// Single source of truth for Home "Drie locaties", the Klinieken page, the booking bar and the footer.
const clinics = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/clinics' }),
  schema: z.object({
    city: z.string().max(40),
    name: z.string().max(80),
    website: z.url(),
    addressLine1: z.string().max(80),
    addressLine2: z.string().max(80),
    phone: z.string().max(30),
    mapsUrl: z.url(),
    bookingUrl: z.url(),
    order: z.number().int(),
  }),
});

export const collections = { clinics };
