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

The save-path dedup path is now hardened around the same canonicalization principle. Instead of a single `(canonical_file_path = ? OR file_path = ?)` lookup, same-path detection performs two direct probes and keeps the newest parent-memory match. The supporting schema now includes parent-only partial indexes for the hot save-path and content-hash checks: `idx_save_parent_canonical_path` on `(spec_folder, canonical_file_path, id DESC)` and `idx_save_parent_content_hash_scope` on `(spec_folder, content_hash, embedding_status, tenant_id, user_id, agent_id, session_id, shared_space_id, id DESC) WHERE parent_id IS NULL`. Together, they remove nullable OR predicates from the save path and keep dedup lookups targeted to top-level memory rows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | `canonicalResultId()` normalization and canonical-key dedup across `combinedLexicalSearch()`, legacy `hybridSearch()`, and merge helpers |
| `mcp_server/handlers/save/dedup.ts` | Handler | Two-probe same-path lookup over canonical and raw file paths for unchanged-save detection |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Parent-only partial index creation for save-path and scoped content-hash dedup hot paths |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | `T031-LEX-05` and `T031-BASIC-04` canonical-ID dedup regression coverage for lexical and legacy hybrid flows |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | `T006b` canonical numeric/string/`mem:` fusion coverage for multi-source result merging |
| `mcp_server/tests/content-hash-dedup.vitest.ts` | `T320-1` and `T320-2` coverage for two direct save-path probes and exact scope clauses |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Verifies `idx_save_parent_canonical_path` and `idx_save_parent_content_hash_scope` exist with `WHERE parent_id IS NULL` |

---

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Canonical ID dedup hardening
- Current reality source: FEATURE_CATALOG.md
