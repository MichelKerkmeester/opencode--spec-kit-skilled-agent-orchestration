import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
import type { ParsedMemory } from './types.js';
declare const MARKDOWN_HEADING_RE: RegExp;
declare const MARKDOWN_BULLET_RE: RegExp;
declare function stripMarkdownDecorators(value: string): string;
declare function extractMarkdownSections(content: string): Array<{
    heading: string;
    body: string;
}>;
declare function extractMarkdownListItems(body: string): string[];
declare function extractMarkdownTableFiles(body: string): Array<{
    path?: string;
    description?: string;
}>;
declare function buildParsedMemoryEvidenceSnapshot(parsed: ParsedMemory): MemoryEvidenceSnapshot;
export { MARKDOWN_HEADING_RE, MARKDOWN_BULLET_RE, stripMarkdownDecorators, extractMarkdownSections, extractMarkdownListItems, extractMarkdownTableFiles, buildParsedMemoryEvidenceSnapshot, };
//# sourceMappingURL=markdown-evidence-builder.d.ts.map