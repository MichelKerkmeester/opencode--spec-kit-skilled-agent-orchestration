import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';
/** Structured markdown block emitted by parseMarkdownSections(). */
export interface ParsedSection {
    type: 'heading' | 'code' | 'table' | 'text';
    title: string | null;
    content: string;
}
/**
 * Parse markdown into structured sections for retrieval-time weighting.
 * Uses the shared chunker so code blocks/tables stay atomic.
 */
export declare function parseMarkdownSections(markdown: string): ParsedSection[];
export { chunkMarkdown, splitIntoBlocks, };
//# sourceMappingURL=ast-parser.d.ts.map