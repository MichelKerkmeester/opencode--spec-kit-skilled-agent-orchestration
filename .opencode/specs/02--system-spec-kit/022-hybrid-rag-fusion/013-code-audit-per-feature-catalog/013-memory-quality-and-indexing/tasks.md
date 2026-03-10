# Tasks: 013 — Memory Quality and Indexing

**Source:** checklist.md (code audit findings)
**Created:** 2026-03-10
**Features audited:** 16 (F-01 through F-16)

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 0     | No FAIL status findings |
| P1       | 5     | WARN with behavior mismatch or significant code issue |
| P2       | 5     | WARN with documentation/test gaps only |
| —        | 6     | PASS (F-02, F-04, F-07, F-08, F-13, F-14, F-15, F-16) — no tasks needed |

**Total tasks:** 10

---

## P1 — Significant Issues (WARN with behavior mismatch or code bugs)

### T-01: Fix quality loop — stricter-trimming claim not implemented in code
- **Priority:** P1
- **Feature:** F-01 Verify-Fix-Verify Memory Quality Loop
- **Status:** TODO
- **Source:** mcp_server/lib/validation/quality-loop.ts:407-489
- **Issue:** Feature description says "third try runs with stricter trimming" but the code uses the same `attemptAutoFix` logic on every retry without any escalation. The auto-fix strategy is identical across all retries.
- **Fix:** Either implement escalating strictness on retries (e.g., more aggressive trimming on third attempt), or update the feature description to match the actual identical-retry behavior.

### T-02: Fix token budget message reporting wrong value
- **Priority:** P1
- **Feature:** F-01 Verify-Fix-Verify Memory Quality Loop
- **Status:** TODO
- **Source:** mcp_server/lib/validation/quality-loop.ts:174
- **Issue:** `scoreTokenBudget` hardcodes `DEFAULT_TOKEN_BUDGET` in the issue message instead of deriving from the `charBudget` parameter. If a custom `charBudget` is passed, the message reports the wrong budget value.
- **Fix:** Replace the hardcoded `DEFAULT_TOKEN_BUDGET` reference in the issue message with the actual `charBudget` parameter value.

### T-03: Harmonize token estimation ratios between preflight and quality-loop
- **Priority:** P1
- **Feature:** F-03 Pre-flight Token Budget Validation
- **Status:** TODO
- **Source:** mcp_server/lib/validation/preflight.ts:187, quality-loop.ts CHARS_PER_TOKEN
- **Issue:** `preflight.ts` uses 3.5 chars/token while `quality-loop.ts` uses 4.0 chars/token. Two different token estimation ratios exist in the codebase for the same purpose, producing conflicting results for the same content.
- **Fix:** Harmonize to a single chars-per-token constant (shared module or import), or document the intentional difference with clear rationale.

### T-04: Fix reconsolidation feature description — code defaults to OFF, not ON
- **Priority:** P1
- **Feature:** F-06 Reconsolidation-on-Save
- **Status:** TODO
- **Source:** mcp_server/lib/storage/reconsolidation.ts:125-127
- **Issue:** Feature description says "default ON" but `isReconsolidationEnabled` requires explicit `SPECKIT_RECONSOLIDATION=true`. The code comment correctly says "defaults to OFF (opt-in)". The feature description is wrong.
- **Fix:** Update the feature description to state that reconsolidation defaults to OFF and requires explicit opt-in.

### T-05: Verify extraction-adapter.ts import path for working-memory
- **Priority:** P1
- **Feature:** F-10 Auto Entity Extraction
- **Status:** TODO
- **Source:** mcp_server/lib/indexing/extraction-adapter.ts:7
- **Issue:** `extraction-adapter.ts` imports `working-memory` from `'../cache/cognitive/working-memory'` but the file may exist at `../cognitive/working-memory.ts`. The import path includes `cache/cognitive/` which may not match the actual file location, potentially causing a runtime import error.
- **Fix:** Verify the import path resolves correctly at build/runtime. If incorrect, fix the import path to match the actual file location.

---

## P2 — Documentation/Test Gaps

### T-06: Route quality loop feature flag through search-flags.ts
- **Priority:** P2
- **Feature:** F-01 Verify-Fix-Verify Memory Quality Loop
- **Status:** TODO
- **Source:** mcp_server/lib/validation/quality-loop.ts:43
- **Issue:** `isQualityLoopEnabled` reads `process.env` directly instead of using the centralized `search-flags.ts` feature flag registry, creating maintenance risk and inconsistency with other feature flags.
- **Fix:** Route the feature flag through `search-flags.ts` for consistency with the rest of the codebase.

### T-07: Fix stale comment in save-quality-gate — says default OFF, actual is default ON
- **Priority:** P2
- **Feature:** F-05 Pre-Storage Quality Gate
- **Status:** TODO
- **Source:** mcp_server/lib/validation/save-quality-gate.ts:13
- **Issue:** Code comment says `// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)` but the actual behavior is default ON (`!== 'false'` check). Stale comment contradicts runtime behavior.
- **Fix:** Update the comment on line 13 to say "default ON" to match the actual behavior.

### T-08: Reconcile encoding-intent default-on/off documentation
- **Priority:** P2
- **Feature:** F-09 Encoding-Intent Capture at Index Time
- **Status:** TODO
- **Source:** mcp_server/lib/indexing/encoding-intent.ts:14
- **Issue:** The code comment says "opt-in, default off" while the feature description says "default ON". The actual default depends on `search-flags.ts` implementation. The local comment may be stale.
- **Fix:** Verify the actual default in `search-flags.ts` and update the module comment to match.

### T-09: Fix feature catalog source and test file paths for slug-utils
- **Priority:** P2
- **Feature:** F-11 Content-Aware Memory Filename Generation
- **Status:** TODO
- **Source:** feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md
- **Issue:** Feature catalog lists incorrect source file path (`mcp_server/lib/parsing/slug-utils.ts` instead of `scripts/utils/slug-utils.ts`) and wrong test file (`content-normalizer.vitest.ts` instead of `slug-uniqueness.vitest.ts` and `slug-utils-boundary.vitest.ts`).
- **Fix:** Update the feature catalog source path to `scripts/utils/slug-utils.ts` and test references to `slug-uniqueness.vitest.ts` and `slug-utils-boundary.vitest.ts`.

### T-10: Clarify feature catalog layers for generation-time vs index-time dedup
- **Priority:** P2
- **Feature:** F-12 Generation-Time Duplicate and Empty Content Prevention
- **Status:** TODO
- **Source:** feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md
- **Issue:** Feature mixes scripts-layer generation-time gates (`file-writer.ts` with `validateContentSubstance`/`checkForDuplicateContent`) with MCP-layer index-time dedup (`dedup.ts`). The feature description focuses on file-writer gates but the implementation table references the MCP handler dedup, which is a different mechanism.
- **Fix:** Update the feature catalog to correctly distinguish index-time dedup (MCP server layer) from generation-time dedup (scripts/core/file-writer.ts layer) and list both with their respective implementation files and tests.
