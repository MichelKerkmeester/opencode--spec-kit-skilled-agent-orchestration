"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Content Cleaner
// ───────────────────────────────────────────────────────────────
// HTML stripping and anchor escaping utilities for rendered memory content.
// Extracted from workflow.ts to reduce module size.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_ANY_HTML_TAG_RE = exports.WORKFLOW_PRESERVED_ANCHOR_ID_RE = exports.WORKFLOW_INLINE_HTML_TAG_RE = exports.WORKFLOW_BLOCK_HTML_TAG_RE = exports.WORKFLOW_DANGEROUS_HTML_BLOCK_RE = exports.WORKFLOW_HTML_COMMENT_RE = exports.CODE_FENCE_SEGMENT_RE = void 0;
exports.stripWorkflowHtmlOutsideCodeFences = stripWorkflowHtmlOutsideCodeFences;
exports.escapeLiteralAnchorExamples = escapeLiteralAnchorExamples;
// ───────────────────────────────────────────────────────────────
// 1. REGEX CONSTANTS
// ───────────────────────────────────────────────────────────────
exports.CODE_FENCE_SEGMENT_RE = /(```[\s\S]*?```)/g;
exports.WORKFLOW_HTML_COMMENT_RE = /<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g;
exports.WORKFLOW_DANGEROUS_HTML_BLOCK_RE = /<(?:iframe|math|noscript|object|script|style|svg|template)\b[^>]*>[\s\S]*?<\/(?:iframe|math|noscript|object|script|style|svg|template)>/gi;
exports.WORKFLOW_BLOCK_HTML_TAG_RE = /<\/?(?:article|aside|blockquote|body|br|dd|details|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|th|thead|tr|ul)\b[^>]*\/?>/gi;
exports.WORKFLOW_INLINE_HTML_TAG_RE = /<\/?(?:code|em|i|kbd|small|span|strong|sub|sup|u)\b[^>]*\/?>/gi;
exports.WORKFLOW_PRESERVED_ANCHOR_ID_RE = /<a id="[^"]+"><\/a>/gi;
exports.WORKFLOW_ANY_HTML_TAG_RE = /<\/?\s*[A-Za-z][\w:-]*(?:\s[^<>]*?)?\s*\/?>/g;
// ───────────────────────────────────────────────────────────────
// 2. FUNCTIONS
// ───────────────────────────────────────────────────────────────
function stripWorkflowHtmlOutsideCodeFences(rawContent) {
    const segments = rawContent.split(exports.CODE_FENCE_SEGMENT_RE);
    return segments.map((segment) => {
        if (segment.startsWith('```')) {
            return segment;
        }
        const preservedAnchorIds = [];
        const protectedSegment = segment.replace(exports.WORKFLOW_PRESERVED_ANCHOR_ID_RE, (match) => {
            const token = `__WORKFLOW_ANCHOR_ID_${preservedAnchorIds.length}__`;
            preservedAnchorIds.push(match);
            return token;
        });
        let cleaned = protectedSegment
            .replace(exports.WORKFLOW_HTML_COMMENT_RE, '')
            .replace(exports.WORKFLOW_DANGEROUS_HTML_BLOCK_RE, '\n')
            .replace(exports.WORKFLOW_BLOCK_HTML_TAG_RE, '\n')
            .replace(exports.WORKFLOW_INLINE_HTML_TAG_RE, '')
            .replace(exports.WORKFLOW_ANY_HTML_TAG_RE, '')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n');
        preservedAnchorIds.forEach((anchor, index) => {
            cleaned = cleaned.replace(`__WORKFLOW_ANCHOR_ID_${index}__`, anchor);
        });
        return cleaned;
    }).join('');
}
function escapeLiteralAnchorExamples(input) {
    return input.replace(/<!--\s*(\/?ANCHOR:[^>]+?)\s*-->/g, (_match, anchor) => (`&lt;!-- ${anchor.trim()} --&gt;`));
}
//# sourceMappingURL=content-cleaner.js.map