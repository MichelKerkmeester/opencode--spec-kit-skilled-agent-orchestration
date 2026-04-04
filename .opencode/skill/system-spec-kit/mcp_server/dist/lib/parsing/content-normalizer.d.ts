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
export declare function stripYamlFrontmatter(content: string): string;
/**
 * Strip ANCHOR comment markers while preserving the text inside them.
 *
 * Examples removed:
 *   <!-- ANCHOR: state -->
 *   <!-- /ANCHOR: state -->
 *   <!-- ANCHOR:next-steps -->
 */
export declare function stripAnchors(content: string): string;
/**
 * Strip all HTML comments.
 *
 * This catches structural markers not covered by stripAnchors(), e.g.:
 *   <!-- S1 gate: open -->
 *   <!-- TODO: remove -->
 *   <!-- prettier-ignore -->
 */
export declare function stripHtmlComments(content: string): string;
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
export declare function stripCodeFences(content: string): string;
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
export declare function normalizeMarkdownTables(content: string): string;
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
export declare function normalizeMarkdownLists(content: string): string;
/**
 * Convert markdown headings to plain section labels without hash marks.
 *
 * Before:  `## 3. SCOPE`
 * After:   `SCOPE`
 *
 * The numeric prefix (e.g. "3.") is also stripped because section
 * numbering carries no semantic meaning for retrieval.
 */
export declare function normalizeHeadings(content: string): string;
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
export declare function normalizeContentForEmbedding(content: string): string;
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
export declare function normalizeContentForBM25(content: string): string;
//# sourceMappingURL=content-normalizer.d.ts.map