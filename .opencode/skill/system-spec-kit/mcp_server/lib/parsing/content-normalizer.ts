// ───────────────────────────────────────────────────────────────
// MODULE: Content Normalizer
// ───────────────────────────────────────────────────────────────
// Feature catalog: Content-aware memory filename generation
// Smarter memory content generation
//
// Purpose: Normalize raw markdown content before it is passed to
// Embedding generation or BM25 indexing.  Raw markdown contains
// Structural noise (YAML frontmatter, HTML comment anchors, pipe
// Table syntax, fence markers, checkbox notation) that degrades
// The quality of semantic embeddings and keyword retrieval.
//
// Integration points (do NOT modify those files here — reference only):
//   - memory-parser.ts  ~line 159  : `content` is assigned from readFileWithEncoding()
// → wrap with normalizeContentForEmbedding() before passing to generateDocumentEmbedding()
//   - memory-save.ts    ~line 1093 : before generateDocumentEmbedding(parsed.content)
// → normalizeContentForEmbedding(parsed.content)
//   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
// → normalizeContentForBM25(content_text)
//
// ───────────────────────────────────────────────────────────────
// 1. PRIMITIVE STRIP / NORMALIZE HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Strip YAML frontmatter block from the top of a markdown file.
 *
 * Frontmatter is already parsed separately by memory-parser.ts into
 * structured fields (title, trigger_phrases, context_type, etc.), so
 * including it verbatim in the embedding text just adds repetitive
 * key-value noise.
 *
 * Matches the canonical `---\n…\n---` form that starts at the very
 * first character of the document.
 */
export function stripYamlFrontmatter(content: string): string {
  // Must start at position 0.  The closing `---` must be on its own line.
  // Without the `m` flag, `^` anchors to position 0 only (document start),
  // Preventing accidental matches on mid-document `---` (e.g. HR rules).
  return content.replace(/^---[\s\S]*?\n---\s*\n?/, '');
}

/**
 * Strip ANCHOR comment markers while preserving the text inside them.
 *
 * Examples removed:
 *   <!-- ANCHOR: state -->
 *   <!-- /ANCHOR: state -->
 *   <!-- ANCHOR:next-steps -->
 */
export function stripAnchors(content: string): string {
  // Opening and closing anchor tags — keep nothing (structural only)
  return content.replace(/<!--\s*\/?ANCHOR:[^>]*-->/gi, '');
}

/**
 * Strip all HTML comments.
 *
 * This catches structural markers not covered by stripAnchors(), e.g.:
 *   <!-- S1 gate: open -->
 *   <!-- TODO: remove -->
 *   <!-- prettier-ignore -->
 */
export function stripHtmlComments(content: string): string {
  // Non-greedy match to avoid swallowing multiple comments in one pass
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Strip code-fence markers while retaining the code body.
 *
 * Before:
 *   ```typescript
 *   const x = 1;
 *   ```
 *
 * After:
 *   const x = 1;
 *
 * The language identifier on the opening fence is discarded because
 * tokens like "typescript" or "json" carry no semantic signal about
 * the stored knowledge.
 */
export function stripCodeFences(content: string): string {
  // Match ``` optionally followed by a language identifier, then any content,
  // Then a closing ```.  The 's' flag makes '.' match newlines.
  return content.replace(/^```[^\n]*\n([\s\S]*?)^```\s*$/gm, '$1');
}

/**
 * Convert markdown pipe tables to plain prose.
 *
 * Separator rows (e.g. `| --- | --- |`) are dropped entirely.
 * Data rows have their cell content extracted and joined with spaces.
 *
 * Before:
 *   | Tool | Purpose | Status |
 *   | ---- | ------- | ------ |
 *   | Grep | search  | active |
 *
 * After:
 *   Tool Purpose Status
 *   Grep search active
 */
export function normalizeMarkdownTables(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Separator row — pure dashes, colons, pipes, spaces
    if (/^\|[\s|:-]+\|$/.test(trimmed)) {
      continue;
    }

    // Data / header row starting and ending with pipe
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)               // remove leading and trailing pipe
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0 && !/^[-:\s]+$/.test(cell)); // skip pure-separator cells

      if (cells.length > 0) {
        result.push(cells.join(' '));
      }
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

/**
 * Normalize markdown list notation to clean prose tokens.
 *
 * Handles:
 *   - GitHub-style task checkboxes:  `- [ ] T001 [P] Implement…`  →  `[ ] T001 [P] Implement…`
 *   - Checked checkboxes:            `- [x] Done item`             →  `[x] Done item`
 *   - Plain list bullets:            `- item` / `* item`           →  `item`
 *   - Ordered list numbers:          `1. item`                      →  `item`
 *
 * Leading whitespace (indentation for nested lists) is preserved so
 * that hierarchical structure is still represented via spacing.
 */
export function normalizeMarkdownLists(content: string): string {
  return content
    // Preserve checklist state markers while dropping the bullet itself.
    .replace(/^(\s*)[-*]\s+(\[[ xX]\])\s*/gm, '$1$2 ')
    // Plain unordered list bullets
    .replace(/^(\s*)[-*]\s+/gm, '$1')
    // Ordered list numbers
    .replace(/^(\s*)\d+\.\s+/gm, '$1');
}

/**
 * Convert markdown headings to plain section labels without hash marks.
 *
 * Before:  `## 3. SCOPE`
 * After:   `SCOPE`
 *
 * The numeric prefix (e.g. "3.") is also stripped because section
 * numbering carries no semantic meaning for retrieval.
 */
export function normalizeHeadings(content: string): string {
  return content.replace(
    /^#{1,6}\s+(?:\d+\.\s+)?(.+)$/gm,
    (_match, heading: string) => heading.trim()
  );
}

// ───────────────────────────────────────────────────────────────
// 2. WHITESPACE CLEANUP

// ───────────────────────────────────────────────────────────────
/**
 * Collapse runs of blank lines to a single blank line, and trim
 * leading / trailing whitespace from the whole document.
 *
 * This is applied as the final step in all public normalization
 * functions to ensure a clean, compact result.
 */
function collapseWhitespace(content: string): string {
  return content
    .replace(/\n{3,}/g, '\n\n')   // 3+ consecutive newlines → 2
    .trim();
}

// ───────────────────────────────────────────────────────────────
// 3. PUBLIC COMPOSITE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Normalize markdown content for use in embedding generation.
 *
 * Applies the full normalization pipeline in order:
 *   1. Strip YAML frontmatter      — already parsed into structured fields
 *   2. Strip anchor markers        — structural noise
 *   3. Strip remaining HTML comments — structural noise
 *   4. Strip code-fence markers    — keep code body, drop ``` + lang id
 *   5. Normalize pipe tables       — extract cell text
 *   6. Normalize list notation     — drop bullet / checkbox syntax
 *   7. Normalize headings          — drop `##` hash marks
 *   8. Collapse excess whitespace  — final cleanup
 *
 * The result is a clean prose representation suitable for semantic
 * embedding models (nomic-embed-text-v1.5 and compatible providers).
 *
 * Integration point:
 *   memory-parser.ts  ~line 159 after `readFileWithEncoding()`,
 *   memory-save.ts    ~line 1093 before `generateDocumentEmbedding()`.
 */
export function normalizeContentForEmbedding(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let normalized = content;
  normalized = stripYamlFrontmatter(normalized);
  normalized = stripAnchors(normalized);
  normalized = stripHtmlComments(normalized);
  normalized = stripCodeFences(normalized);
  normalized = normalizeMarkdownTables(normalized);
  normalized = normalizeMarkdownLists(normalized);
  normalized = normalizeHeadings(normalized);
  normalized = collapseWhitespace(normalized);

  return normalized;
}

/**
 * Normalize markdown content for use in BM25 keyword indexing.
 *
 * BM25 benefits from the same structural noise removal as the
 * embedding pipeline.  Code fence markers (``` + lang id) are stripped
 * but the code body is preserved so that exact identifier tokens
 * (function names, class names, CLI flags) remain searchable.
 *
 * Pipeline:
 *   1. Strip YAML frontmatter
 *   2. Strip anchor markers
 *   3. Strip remaining HTML comments
 *   4. Strip code-fence markers only (keep body)
 *   5. Normalize pipe tables
 *   6. Normalize list notation
 *   7. Normalize headings
 *   8. Collapse excess whitespace
 *
 * Integration point:
 *   bm25-index.ts ~line 245 where `content_text` is used for token building.
 */
export function normalizeContentForBM25(content: string): string {
  // The BM25 pipeline currently delegates to the same normalization
  // Steps as the embedding pipeline (frontmatter, anchors, HTML
  // Comments, code fences, tables, lists, headings, whitespace).
  // A separate entry point exists so BM25-specific adjustments
  // (e.g. preserving backtick inline code, adding stemming hints)
  // Can diverge in the future without modifying the embedding path.
  return normalizeContentForEmbedding(content);
}
