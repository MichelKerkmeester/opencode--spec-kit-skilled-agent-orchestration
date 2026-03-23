---
title: "Canonical ID dedup hardening"
description: "Tracks the fix for mixed ID format deduplication failures in hybrid search caused by string/number mismatches."
---

# Canonical ID dedup hardening

## 1. OVERVIEW

Tracks the fix for mixed ID format deduplication failures in hybrid search caused by string/number mismatches.

The same memory was sometimes listed multiple times in search results because different parts of the system referred to it using slightly different labels. This fix standardizes how memories are identified internally so duplicates are correctly detected and merged in the results every time.

---

## 2. CURRENT REALITY

Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | `canonicalResultId()` normalization and canonical-key dedup across `combinedLexicalSearch()`, legacy `hybridSearch()`, and merge helpers |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | `T031-LEX-05` and `T031-BASIC-04` canonical-ID dedup regression coverage for lexical and legacy hybrid flows |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | `T006b` canonical numeric/string/`mem:` fusion coverage for multi-source result merging |

---

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Canonical ID dedup hardening
- Current reality source: feature_catalog.md
