# W2-A8: Content Normalizer — Implementation Notes

Sprint 7 / S1 (Smarter Memory Content Generation)
Date: 2026-02-28

---

## What was built

New file: `mcp_server/lib/parsing/content-normalizer.ts`

A pure-function TypeScript module (~230 LOC) that strips markdown
structural noise before content reaches embedding generation or BM25
indexing.  Zero external dependencies; uses only built-in string
operations and RegExp.

---

## Public API

### Primitive helpers (exported, individually testable)

| Function | Strips / Converts |
| -------- | ----------------- |
| `stripYamlFrontmatter(content)` | `---\n…\n---` block at document start |
| `stripAnchors(content)` | `<!-- ANCHOR:… -->` and `<!-- /ANCHOR:… -->` markers |
| `stripHtmlComments(content)` | All remaining `<!-- … -->` comments |
| `stripCodeFences(content)` | ` ``` ` markers + language id; keeps code body |
| `normalizeMarkdownTables(content)` | Pipe table rows → space-joined cell text; drops separator rows |
| `normalizeMarkdownLists(content)` | `- [ ]`, `- [x]`, `- `, `* `, `1. ` → bare text |
| `normalizeHeadings(content)` | `## 3. SCOPE` → `SCOPE` |

### Composite functions (the integration-facing API)

```typescript
normalizeContentForEmbedding(content: string): string
normalizeContentForBM25(content: string): string
```

Both apply the full pipeline in order:
1. stripYamlFrontmatter
2. stripAnchors
3. stripHtmlComments
4. stripCodeFences
5. normalizeMarkdownTables
6. normalizeMarkdownLists
7. normalizeHeadings
8. collapseWhitespace (internal — trims and collapses 3+ blank lines to 2)

`normalizeContentForBM25` is a separate export so BM25-specific
divergence (e.g. retaining inline backtick tokens, stemming hints)
can be added later without touching the embedding path.

---

## Integration points (files NOT modified — reference only)

### memory-parser.ts ~line 159

```typescript
// Current:
const content = readFileWithEncoding(filePath);

// After integration:
import { normalizeContentForEmbedding } from './content-normalizer';
const rawContent = readFileWithEncoding(filePath);
const content = rawContent; // keep raw for hash, title extraction, anchors
// Then when passing to embedding:
const embeddingContent = normalizeContentForEmbedding(rawContent);
```

Note: the `content` field on `ParsedMemory` should remain raw so that
anchor extraction, title extraction, trigger-phrase extraction, and
`contentHash` all operate on the original text.  Only the embedding
path should use the normalized form.

### memory-save.ts ~line 1093

```typescript
// Current:
const embedding = await generateDocumentEmbedding(parsed.content);

// After integration:
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
const embeddingText = normalizeContentForEmbedding(parsed.content);
const embedding = await generateDocumentEmbedding(embeddingText);
```

### bm25-index.ts ~line 245

```typescript
// Current:
const tokens = tokenize(content_text);

// After integration:
import { normalizeContentForBM25 } from '../lib/parsing/content-normalizer';
const tokens = tokenize(normalizeContentForBM25(content_text));
```

---

## Design decisions

1. **ParsedMemory.content stays raw** — title, trigger phrases, anchor
   extraction, and contentHash all rely on the original markdown
   structure.  Only the embedding/BM25 paths receive normalized text.

2. **Code body preserved** — `stripCodeFences` removes ` ``` ` markers
   and the language identifier but keeps the code body verbatim.
   Exact identifiers (function names, CLI flags) remain searchable in BM25.

3. **Separate BM25 export** — even though the pipeline is currently
   identical, keeping two exports avoids a future breaking change when
   BM25-specific tokenization is added.

4. **No external dependencies** — all transforms are regex + string
   operations.  This keeps the normalizer fast, side-effect-free, and
   trivially unit-testable.

5. **Order matters** — YAML frontmatter is stripped first so subsequent
   regexes don't accidentally match YAML key-value pairs.  HTML comments
   (including anchors) are stripped before table/list normalization so
   inline comments inside table cells are gone before cell extraction.

---

## Next steps

- Wire integration points in memory-parser.ts, memory-save.ts, bm25-index.ts
- Add unit tests in `mcp_server/tests/` covering each primitive helper
  and edge cases (empty string, frontmatter only, nested code fences)
- Measure embedding quality delta (cosine similarity distribution before/after)
