import { Marked } from 'marked';

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Content is written by two trusted editors, but raw HTML in the Markdown is switched off anyway:
// it is shown as text instead of being run.
const marked = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    // A long "word/word" in a heading may break after the slash on narrow screens (the prototype lets it run off the screen)
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      const withBreaks = html
        .split(/(<[^>]+>)/)
        .map((part) => (part.startsWith('<') ? part : part.replace(/\//g, '/<wbr>')))
        .join('');
      return `<h${depth}>${withBreaks}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}${attrs}>${text}</a>`;
    },
  },
});

/** Markdown to HTML (block level). Used for article text, FAQ answers and the privacy policy. */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

/** The words of a Markdown text, for the reading time. */
export function countWords(markdown: string): number {
  return markdown
    .replace(/[#*_>`\\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
