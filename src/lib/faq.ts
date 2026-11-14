import { getLocalized } from './content';
import { renderMarkdown } from './markdown';
import { pagePath } from '../i18n/routes';
import type { Locale } from '../i18n/config';

export interface FaqQuestion {
  id: string;
  question: string;
  html: string;
}

export interface FaqTopic {
  /** File name: the anchor, e.g. "brillen". */
  id: string;
  title: string;
  questions: FaqQuestion[];
}

/**
 * Topics with their questions, in order. A topic without questions is left out.
 * Everything (topic nav, anchors, deep links) is generated from this: nothing is hard-coded.
 */
export async function getFaq(locale: Locale): Promise<FaqTopic[]> {
  const [topics, questions] = await Promise.all([getLocalized('faqTopics', locale), getLocalized('faqQuestions', locale)]);
  return topics
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
    .map((topic) => ({
      id: topic.id,
      title: topic.data.title,
      questions: questions
        .filter((q) => q.data.topic === topic.id)
        .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
        .map((q) => ({ id: q.id, question: q.data.question, html: renderMarkdown(q.body) })),
    }))
    .filter((topic) => topic.questions.length > 0);
}

/** Link to the FAQ page, optionally to one topic: /veelgestelde-vragen/#brillen */
export function faqHref(locale: Locale, topic?: string | null): string {
  return pagePath({ page: 'faq' }, locale) + (topic ? `#${topic}` : '');
}
