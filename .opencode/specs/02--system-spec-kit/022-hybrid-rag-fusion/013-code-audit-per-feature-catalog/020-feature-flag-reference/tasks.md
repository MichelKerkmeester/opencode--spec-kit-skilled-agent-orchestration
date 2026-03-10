# Tasks — 020 Feature Flag Reference

## Summary

| Priority | Count |
|----------|-------|
| P0       | 2     |
| P1       | 3     |
| P2       | 1     |
| **Total** | **6** |

---

## P0 — FAIL (Immediate Fix)

### T-01: Reconcile stale source file mappings for SPECKIT_* flags
- **Priority:** P0
- **Feature:** F-01 Search Pipeline Features (SPECKIT_*)
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:7,23,40,48,62`; `mcp_server/lib/eval/ablation-framework.ts:45-47`; `mcp_server/lib/search/search-flags.ts:186-188,195-198`; `shared/algorithms/rrf-fusion.ts`
- **Issue:** Multiple Source File mappings are stale or incorrect: `SPECKIT_ABLATION` points to `eval-metrics.ts` instead of `ablation-framework.ts`; `SPECKIT_RRF` points to non-existent `lib/search/rrf-fusion.ts` instead of `shared/algorithms/rrf-fusion.ts`; `SPECKIT_LAZY_LOADING` has no active read site; several flags point to non-authoritative barrel re-exports.
- **Fix:** Reconcile all Source File entries against actual env-var read sites. Correct `SPECKIT_ABLATION` source to `lib/eval/ablation-framework.ts`. Correct `SPECKIT_RRF` to `shared/algorithms/rrf-fusion.ts`. Remove or clarify `SPECKIT_LAZY_LOADING` entry.

### T-02: Add CI validation script for flag-reference source file integrity
- **Priority:** P0
- **Feature:** F-01 Search Pipeline Features (SPECKIT_*)
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md`
- **Issue:** No automated validation checks that each flag row's Source File exists and actually references the listed env var. Given the number of stale mappings found, future drift is likely without a CI guard.
- **Fix:** Add a CI validation script that checks Source File existence and env-var symbol presence for all flag-reference tables.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-03: Update MEMORY_DB_DIR and MEMORY_DB_PATH source file mappings
- **Priority:** P1
- **Feature:** F-04 Memory and Storage
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md:9-10`; `mcp_server/lib/search/vector-index-store.ts:214-224`; `mcp_server/lib/search/vector-index-impl.ts:4-13`
- **Issue:** Source mappings point to `vector-index-impl.ts`, which is now a barrel re-export. Active path-resolution logic is in `vector-index-store.ts`. Developers following the trace will find no implementation at the listed location.
- **Fix:** Update Source File entries for `MEMORY_DB_DIR` and `MEMORY_DB_PATH` to `lib/search/vector-index-store.ts`.

### T-04: Update EMBEDDINGS_PROVIDER source file mapping
- **Priority:** P1
- **Feature:** F-05 Embedding and API
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md:9`; `mcp_server/lib/providers/embeddings.ts:7-9`; `shared/embeddings/factory.ts:73-103`
- **Issue:** `EMBEDDINGS_PROVIDER` is mapped to `lib/providers/embeddings.ts`, which is a pure re-export. Provider selection logic is in `shared/embeddings/factory.ts`.
- **Fix:** Update `EMBEDDINGS_PROVIDER` Source File to `shared/embeddings/factory.ts`.

### T-05: Correct EMBEDDING_DIM source mapping and clarify semantics
- **Priority:** P1
- **Feature:** F-05 Embedding and API
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md:8`; `mcp_server/lib/search/vector-index-store.ts:118-140,156-157`
- **Issue:** `EMBEDDING_DIM` is mapped to `vector-index-impl.ts` (barrel re-export). Implementation uses provider-derived dimensions with a compatibility check specifically for `'768'`; setting other values would not override the provider dimension as the documentation implies.
- **Fix:** Update `EMBEDDING_DIM` Source File to `lib/search/vector-index-store.ts`. Clarify semantics in Current Reality text: it is a 768-compatibility check, not a general dimension override.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-06: Add mapping validation coverage for barrel re-export drift
- **Priority:** P2
- **Feature:** F-04 Memory and Storage / F-05 Embedding and API
- **Status:** TODO
- **Source:** `feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md`; `feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md`
- **Issue:** No automated Source File validation detects mapping drift when implementation files become barrel re-exports. No test validates that `MEMORY_DB_DIR`/`MEMORY_DB_PATH` or `EMBEDDING_DIM` are read from the documented location.
- **Fix:** Add mapping validation in CI to catch future barrel-re-export drift. Add test validating non-768 `EMBEDDING_DIM` behavior.
