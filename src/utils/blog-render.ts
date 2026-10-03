import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { blogAsset } from '../services/blog';

const markdown = new MarkdownIt({ html: true });
// HTML is useful for the existing details sections and portable survey figures.
// Allow presentation only; no scripts, handlers, embeds, arbitrary CSS or MDX evaluation.
export function renderBlog(content: string): string {
  return sanitizeHtml(markdown.render(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'details', 'summary'],
    allowedAttributes: {
      '*': ['class', 'aria-label', 'aria-labelledby', 'aria-hidden'],
      a: ['href', 'title'], img: ['src', 'alt', 'width', 'height', 'loading'],
      h3: ['id'], div: ['data-survey-visual'], figure: ['data-chart'],
      li: ['tabindex'], span: ['style'],
    },
    allowedClasses: { '*': ['survey-chart', 'not-prose', 'compact', 'workplace-charts', 'sample', 'axis',
      'chart-rows', 'chart-row', 'row-heading', 'bar-track', 'bar-fill', 'row-details', 'chart-tooltip', 'chart-note', /^language-[a-z0-9]+$/] },
    allowedStyles: { span: { width: [/^(?:100|\d{1,2})(?:\.\d+)?%$/] } },
    allowedSchemes: ['https', 'http', 'mailto'], allowedSchemesByTag: { img: ['https', 'http'] },
    allowProtocolRelative: false,
    transformTags: {
      img: (tagName, attributes) => {
        let src = '';
        try { src = blogAsset(attributes.src || ''); } catch { /* Invalid image is omitted. */ }
        return { tagName, attribs: { ...attributes, src, loading: 'lazy' } };
      },
      h3: (tagName, attributes) => {
        if (!/^survey-[a-z]+-title$/.test(attributes.id || '')) delete attributes.id;
        return { tagName, attribs: attributes };
      },
    },
  });
}
