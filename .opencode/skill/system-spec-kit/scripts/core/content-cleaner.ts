// ───────────────────────────────────────────────────────────────
// MODULE: Content Cleaner
// ───────────────────────────────────────────────────────────────
// HTML stripping and anchor escaping utilities for rendered memory content.
// Extracted from workflow.ts to reduce module size.

// ───────────────────────────────────────────────────────────────
// 1. REGEX CONSTANTS
// ───────────────────────────────────────────────────────────────

export const CODE_FENCE_SEGMENT_RE = /(```[\s\S]*?```)/g;
export const WORKFLOW_HTML_COMMENT_RE = /<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g;
export const WORKFLOW_DANGEROUS_HTML_BLOCK_RE = /<(?:iframe|math|noscript|object|script|style|svg|template)\b[^>]*>[\s\S]*?<\/(?:iframe|math|noscript|object|script|style|svg|template)>/gi;
export const WORKFLOW_BLOCK_HTML_TAG_RE = /<\/?(?:article|aside|blockquote|body|br|dd|details|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|th|thead|tr|ul)\b[^>]*\/?>/gi;
export const WORKFLOW_INLINE_HTML_TAG_RE = /<\/?(?:code|em|i|kbd|small|span|strong|sub|sup|u)\b[^>]*\/?>/gi;
export const WORKFLOW_PRESERVED_ANCHOR_ID_RE = /<a id="[^"]+"><\/a>/gi;
export const WORKFLOW_ANY_HTML_TAG_RE = /<\/?\s*[A-Za-z][\w:-]*(?:\s[^<>]*?)?\s*\/?>/g;

// ───────────────────────────────────────────────────────────────
// 2. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function stripWorkflowHtmlOutsideCodeFences(rawContent: string): string {
  const segments = rawContent.split(CODE_FENCE_SEGMENT_RE);

  return segments.map((segment) => {
    if (segment.startsWith('```')) {
      return segment;
    }

    const preservedAnchorIds: string[] = [];
    const protectedSegment = segment.replace(WORKFLOW_PRESERVED_ANCHOR_ID_RE, (match: string) => {
      const token = `__WORKFLOW_ANCHOR_ID_${preservedAnchorIds.length}__`;
      preservedAnchorIds.push(match);
      return token;
    });

    let cleaned = protectedSegment
      .replace(WORKFLOW_HTML_COMMENT_RE, '')
      .replace(WORKFLOW_DANGEROUS_HTML_BLOCK_RE, '\n')
      .replace(WORKFLOW_BLOCK_HTML_TAG_RE, '\n')
      .replace(WORKFLOW_INLINE_HTML_TAG_RE, '')
      .replace(WORKFLOW_ANY_HTML_TAG_RE, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    preservedAnchorIds.forEach((anchor, index) => {
      cleaned = cleaned.replace(`__WORKFLOW_ANCHOR_ID_${index}__`, anchor);
    });

    return cleaned;
  }).join('');
}

export function escapeLiteralAnchorExamples(input: string): string {
  return input.replace(/<!--\s*(\/?ANCHOR:[^>]+?)\s*-->/g, (_match: string, anchor: string) => (
    `&lt;!-- ${anchor.trim()} --&gt;`
  ));
}
