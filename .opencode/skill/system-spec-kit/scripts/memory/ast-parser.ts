// ---------------------------------------------------------------
// MODULE: Ast Parser
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. AST PARSER
// ───────────────────────────────────────────────────────────────
import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';

/** Structured markdown block emitted by parseMarkdownSections(). */
export interface ParsedSection {
  type: 'heading' | 'code' | 'table' | 'text';
  title: string | null;
  content: string;
}

function extractHeadingTitle(content: string): string | null {
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
export function parseMarkdownSections(markdown: string): ParsedSection[] {
  if (typeof markdown !== 'string' || markdown.trim().length === 0) {
    return [];
  }

  const sections: ParsedSection[] = [];
  const blocks = splitIntoBlocks(markdown);
  for (const block of blocks) {
    sections.push({
      type: block.type,
      title: block.type === 'heading' ? extractHeadingTitle(block.content) : null,
      content: block.content,
    });
  }
  return sections;
}

export {
  chunkMarkdown,
  splitIntoBlocks,
};
