---
title: "Search pipeline safety"
description: "Search pipeline safety fixed three bugs: summary quality bypass, FTS5 double-tokenization and quality floor vs RRF range mismatch."
---

# Search pipeline safety

## 1. OVERVIEW

Search pipeline safety fixed three bugs: summary quality bypass, FTS5 double-tokenization and quality floor vs RRF range mismatch.

Three bugs were quietly making search results worse. One let low-quality summaries sneak past the quality filter. Another caused search terms to be processed differently at search time versus index time, so exact matches were missed. A third was accidentally throwing away almost all results from one search method because the quality bar was set too high for that method's scoring range. Fixing these three issues made search results noticeably more accurate.

---

## 2. CURRENT REALITY

Three search pipeline issues were fixed:

**D1: Summary quality bypass:** `stage1-candidate-gen.ts` allowed R8 summary hits to bypass the `minQualityScore` filter, letting low-quality summaries enter final results. Summary candidates now pass through the same quality filter.

**D2: FTS5 double-tokenization:** `sqlite-fts.ts` and `bm25-index.ts` had separate tokenization logic, causing query terms to be tokenized differently than indexed content. Refactored to a shared `sanitizeQueryTokens()` function returning a raw token array that both callers join with their appropriate syntax.

**D3: Quality floor vs RRF range mismatch:** `channel-representation.ts` used `QUALITY_FLOOR=0.2` which filtered out virtually all RRF-sourced results (RRF scores are typically 0.01-0.03). Lowered to 0.005.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | D1: Summary quality bypass fix — summary candidates now pass through `minQualityScore` filter |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | D2: FTS5 tokenization — refactored to shared `sanitizeQueryTokens()` function |
| `mcp_server/lib/search/bm25-index.ts` | Lib | D2: BM25 tokenization — now consumes shared `sanitizeQueryTokens()` from `sqlite-fts.ts` |
| `mcp_server/lib/search/channel-representation.ts` | Lib | D3: `QUALITY_FLOOR` lowered from 0.2 to 0.005 for RRF-range compatibility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/channel-representation.vitest.ts` | Quality floor and channel representation tests |
| `mcp_server/tests/sqlite-fts.vitest.ts` | SQLite FTS5 tokenization tests |
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 tokenization tests |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Search pipeline safety
- Current reality source: FEATURE_CATALOG.md
