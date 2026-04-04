"use strict";
// ---------------------------------------------------------------
// MODULE: Ast Parser
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitIntoBlocks = exports.chunkMarkdown = void 0;
exports.parseMarkdownSections = parseMarkdownSections;
// ───────────────────────────────────────────────────────────────
// 1. AST PARSER
// ───────────────────────────────────────────────────────────────
const structure_aware_chunker_1 = require("@spec-kit/shared/lib/structure-aware-chunker");
Object.defineProperty(exports, "chunkMarkdown", { enumerable: true, get: function () { return structure_aware_chunker_1.chunkMarkdown; } });
Object.defineProperty(exports, "splitIntoBlocks", { enumerable: true, get: function () { return structure_aware_chunker_1.splitIntoBlocks; } });
function extractHeadingTitle(content) {
    const match = content.match(/^#{1,6}\s+(.*)$/m);
    if (!match) {
        return null;
    }
    return match[1]?.trim() ?? null;
}
/**
 * Parse markdown into structured sections for retrieval-time weighting.
 * Uses the shared chunker so code blocks/tables stay atomic.
 */
function parseMarkdownSections(markdown) {
    if (typeof markdown !== 'string' || markdown.trim().length === 0) {
        return [];
    }
    const sections = [];
    const blocks = (0, structure_aware_chunker_1.splitIntoBlocks)(markdown);
    for (const block of blocks) {
        sections.push({
            type: block.type,
            title: block.type === 'heading' ? extractHeadingTitle(block.content) : null,
            content: block.content,
        });
    }
    return sections;
}
//# sourceMappingURL=ast-parser.js.map