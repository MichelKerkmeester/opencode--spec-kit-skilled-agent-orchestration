# W3-A14: S1 Content Normalizer — Wiring Summary

Sprint 7 / Wave 3 / Action 14
Date: 2026-02-28

---

## Overview

The `content-normalizer.ts` module (created in Wave 2) was wired into the memory pipeline at
two active integration points. The third documented point (`memory-index.ts`) was confirmed
not applicable — that handler does not call `generateDocumentEmbedding()` or store `content_text`
directly; it delegates all embedding and storage work to `memory-save.ts`.

---

## Integration Point 1 — `memory-save.ts` (embedding path)

**File:** `mcp_server/handlers/memory-save.ts`

### Import added (after line 44, before path validator)

```typescript
// Sprint 7 / S1: Content normalizer — strip markdown noise before embedding
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
```

### Call site (cache-miss branch, ~line 1095-1099)

Before:
```typescript
embedding = await embeddings.generateDocumentEmbedding(parsed.content);
```

After:
```typescript
// Sprint 7 / S1: Normalize content to strip markdown noise before embedding.
// parsed.content is kept raw for title extraction, content_hash, and all other uses.
const normalizedContent = normalizeContentForEmbedding(parsed.content);
embedding = await embeddings.generateDocumentEmbedding(normalizedContent);
```

**Invariants preserved:**
- `parsed.content` is unchanged — raw content continues to flow to title extraction,
  `content_hash` computation (`parsed.contentHash`), quality gate checks, and storage.
- Normalization applies only inside the cache-miss branch, which is the only path that
  actually generates a new embedding. Cached embeddings (from `lookupEmbedding()`) are
  returned before this branch is reached, so previously cached embeddings are not affected.

---

## Integration Point 2 — `bm25-index.ts` (BM25 rebuild loop)

**File:** `mcp_server/lib/search/bm25-index.ts`

### Import added (after `import type Database from 'better-sqlite3'`)

```typescript
// Sprint 7 / S1: Content normalizer — strip markdown noise before BM25 tokenization
import { normalizeContentForBM25 } from '../parsing/content-normalizer';
```

### Call site (rebuild loop, ~line 248-250)

Before:
```typescript
if (row.content_text) textParts.push(row.content_text);
```

After:
```typescript
// Sprint 7 / S1: Normalize content_text to strip markdown noise before BM25 tokenization.
// row.content_text is not mutated — normalization is applied only to the token input.
if (row.content_text) textParts.push(normalizeContentForBM25(row.content_text));
```

**Invariants preserved:**
- `row.content_text` in the database is not modified.
- `title`, `trigger_phrases`, and `file_path` are pushed to `textParts` without normalization
  (they are already clean token sources).
- The normalization strips YAML frontmatter, HTML comment anchors, code-fence markers,
  pipe table syntax, and checkbox notation — leaving identifier tokens (function names,
  CLI flags) intact, as `normalizeContentForBM25` keeps code-fence bodies verbatim.

---

## Integration Point 3 — `memory-index.ts` (not applicable)

**File:** `mcp_server/handlers/memory-index.ts`

Investigated. `memory-index.ts` does not:
- Call `generateDocumentEmbedding()` — confirmed via grep (0 matches).
- Store or manipulate `content_text` — confirmed via grep (0 matches on `content_text`, `content\.text`, `parsed\.content`).

All embedding and content storage for the index scan workflow is delegated to `memory-save.ts`,
which now has the normalization in place. No changes required here.

---

## Tool Call Budget

- Tool calls used: 12
- Self-governance limit: 12
- Status: within budget

---

## Files Modified

| File | Change |
|------|--------|
| `mcp_server/handlers/memory-save.ts` | Added import + `normalizeContentForEmbedding()` call at embedding cache-miss branch |
| `mcp_server/lib/search/bm25-index.ts` | Added import + `normalizeContentForBM25()` call in BM25 rebuild loop |
| `mcp_server/handlers/memory-index.ts` | No change — not applicable |
