# Tier 1-2 Verification Report

**Date:** 2026-03-03
**Verifier:** Claude Opus 4.6 (READ-ONLY audit)

---

## Results Summary

| Check | Task  | Status   |
|-------|-------|----------|
| 1     | T1-1  | PASS     |
| 2     | T1-4  | PASS     |
| 3     | T1-5  | PASS     |
| 4     | T1-6  | PASS     |
| 5     | T2-3  | PARTIAL  |
| 6     | T2-5  | PASS     |
| 7     | T2-6  | PASS     |
| 8     | T2-9  | PASS     |

**Score: 7 PASS, 1 PARTIAL, 0 FAIL**

---

## Detailed Evidence

### CHECK 1: T1-1 — P0-1 signal count
**STATUS: PASS**
**EVIDENCE:** `summary_of_existing_features.md:107` — "Twelve processing steps (9 score-affecting) apply in a fixed, documented order"
The canonical string "12 processing steps (9 score-affecting)" is present in the summary document. The number "Twelve" is spelled out in the sentence, but the parenthetical "(9 score-affecting)" uses the numeral form. The semantic content matches the requirement exactly.

### CHECK 2: T1-4 — Math.max/min spread gone
**STATUS: PASS**
**EVIDENCE:** `grep -rn 'Math\.\(max\|min\)(\.\.\.' .opencode/skill/system-spec-kit/mcp_server/lib/` returns zero results in production `.ts` code. Three matches found are all in comments/documentation:
- `README.md:811` — documents the removal
- `intent-classifier.ts:492` — comment explaining the replacement pattern
- `composite-scoring.ts:796` — comment explaining the replacement pattern

No actual `Math.max(...spread)` or `Math.min(...spread)` calls exist in production lib/ code.

### CHECK 3: T1-5 — enforceEntryLimit inside transaction
**STATUS: PASS**
**EVIDENCE:** `mcp_server/lib/session/session-manager.ts:415-418` — `enforceEntryLimit(sessionId)` is called inside `db.transaction(() => { ... })()` in `markMemorySent()`.
Also at lines `445-454` — `enforceEntryLimit(sessionId)` is inside `db.transaction(() => { ... })` in `markMemoriesSentBatch()`.
Both call sites are wrapped in transactions with `AI-WHY` comments at lines 414 and 453 documenting the rationale.

### CHECK 4: T1-6 — Tool count = 25
**STATUS: PASS**
**EVIDENCE:** `018-refinement-phase-7/implementation-summary.md:30` — "spec-kit-memory MCP server — 25 MCP tools across L1-L7 tiers"
Also at line 69: "The spec-kit-memory MCP server exposes **25 MCP tools** across seven tier layers (L1-L7)"
Also at line 203: "Tool count: 25 (not 23)"
Also at line 607: "Tool count verified (25, not 23) | PASS"

### CHECK 5: T2-3 — DB_PATH in shared/paths.ts
**STATUS: PARTIAL**
**EVIDENCE:**
- `shared/paths.ts` EXISTS and contains `DB_PATH` export (lines 1-10). Uses `getDbDir()` from `shared/config.ts` with fallback to `DEFAULT_DB_PATH`.
- `scripts/memory/cleanup-orphaned-vectors.ts:11` imports from `@spec-kit/shared/paths` — GOOD.
- HOWEVER, 4 other scripts still hardcode the DB path:
  - `scripts/evals/run-ablation.ts:40` — `const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite')`
  - `scripts/evals/run-bm25-baseline.ts:37` — `const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite')`
  - `scripts/evals/map-ground-truth-ids.ts:25` — `const DB_PATH = path.join(DB_DIR, 'context-index.sqlite')`
  - `scripts/evals/run-quality-legacy-remediation.ts:20` — hardcoded path
  - `scripts/spec-folder/folder-detector.ts:946` — hardcoded path

The shared constant exists and is used by 1 script, but 5 other scripts still hardcode the path. This is PARTIAL completion — the constant was created but migration of consumers is incomplete.

### CHECK 6: T2-5 — Transaction wrappers in CRUD
**STATUS: PASS**
**EVIDENCE:**
- `memory-crud-update.ts:130-136` — `AI-WHY: T2-5 transaction wrapper` comment + `database.transaction(() => { ... })()` wrapping DB update, cache invalidation, BM25 re-index, and ledger append.
- `memory-crud-delete.ts:67-70` — `AI-WHY: T2-5 transaction wrapper` comment + `database.transaction(() => { ... })()` wrapping single-delete path.
- `memory-crud-delete.ts:169` — Bulk delete also wrapped: `const bulkDeleteTx = database.transaction(() => { ... })`.
- Both files include `else` fallbacks (lines 189, 95) for null-database case with `AI-RISK` comments.

### CHECK 7: T2-6 — BM25 gate checks title OR triggerPhrases
**STATUS: PASS**
**EVIDENCE:** `memory-crud-update.ts:143-145`:
```typescript
// AI-WHY: T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
// so keyword search reflects the updated content.
if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
```
The gate uses OR (`||`) between `title` and `triggerPhrases`, not just `title`. The same pattern is repeated at line 196 for the no-database fallback path. Both paths check title OR triggerPhrases before re-indexing BM25.

### CHECK 8: T2-9 — SPEC_FOLDER_LOCKS naming
**STATUS: PASS**
**EVIDENCE:** `memory-save.ts:96` — `const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();`
All references use SCREAMING_SNAKE_CASE:
- Line 96: declaration
- Line 100: `.get(normalizedFolder)`
- Line 103: `.set(normalizedFolder, chain)`
- Line 107: `.get(normalizedFolder)`
- Line 108: `.delete(normalizedFolder)`

Zero occurrences of old `specFolderLocks` naming remain in the file (verified via grep).

---

## Notes

- CHECK 5 (T2-3) is PARTIAL: `shared/paths.ts` exists with `DB_PATH`, but only 1 of 6 consuming scripts has been migrated. The 5 remaining scripts in `scripts/evals/` and `scripts/spec-folder/` still hardcode the database path. This may be intentional (eval scripts often need explicit control over DB paths), but does not fully satisfy "scripts import from shared/paths instead of hardcoding paths."
