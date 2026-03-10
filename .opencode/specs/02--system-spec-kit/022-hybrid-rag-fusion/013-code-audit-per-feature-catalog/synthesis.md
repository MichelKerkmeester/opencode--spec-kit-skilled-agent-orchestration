# Cross-Phase Synthesis Report — Feature-Centric Code Audit

## Executive Summary

**All 180 features audited** across 20 completed phases. Audit complete.

| Status | Count | Percentage |
|--------|-------|------------|
| FAIL   | 41    | 22.8%      |
| WARN   | 106   | 58.9%      |
| PASS   | 33    | 18.3%      |
| **Total** | **180** | **100%** |

**Only 18.3% of audited features pass clean.** The remaining 81.7% have issues ranging from catalog drift (WARN) to active bugs and behavior mismatches (FAIL).

---

## Per-Phase Results

| Phase | Category | Features | FAIL | WARN | PASS |
|-------|----------|----------|------|------|------|
| 001 | Retrieval | 9 | 3 | 5 | 1 |
| 002 | Mutation | 10 | 3 | 6 | 1 |
| 005 | Lifecycle | 7 | 3 | 4 | 0 |
| 006 | Analysis | 7 | 2 | 5 | 0 |
| 008 | Bug Fixes & Data Integrity | 11 | 3 | 7 | 1 |
| 009 | Evaluation & Measurement | 14 | 3 | 10 | 1 |
| 010 | Graph Signal Activation | 11 | 2 | 6 | 3 |
| 011 | Scoring & Calibration | 17 | 5 | 8 | 4 |
| 012 | Query Intelligence | 6 | 3 | 2 | 1 |
| 014 | Pipeline Architecture | 21 | 3 | 15 | 3 |
| 015 | Retrieval Enhancements | 9 | 2 | 6 | 1 |
| 016 | Tooling & Scripts | 8 | 4 | 4 | 0 |
| 018 | UX Hooks | 13 | 2 | 11 | 0 |
| 003 | Discovery | 3 | 0 | 3 | 0 |
| 004 | Maintenance | 2 | 1 | 1 | 0 |
| 007 | Evaluation | 2 | 1 | 1 | 0 |
| 013 | Memory Quality & Indexing | 16 | 0 | 8 | 8 |
| 017 | Governance | 2 | 0 | 0 | 2 |
| 019 | Decisions & Deferrals | 5 | 0 | 2 | 3 |
| 020 | Feature Flag Reference | 7 | 1 | 2 | 4 |
| **Total** | | **180** | **41** | **106** | **33** |

---

## Critical Bugs (FAIL — Requiring Immediate Fix)

### P0: Correctness Bugs

1. **Atomic save is not atomic** — `memory_save` passes a no-op `dbOperation` to `executeAtomicSave()`, allowing "file saved, indexing failed" partial success. Feature doc claims transactional coupling. (`014-F18`, `mcp_server/handlers/memory-save.ts:392-445`)

2. **Pending file recovery lacks DB check** — `recoverPendingFile()` renames `_pending` files purely from filesystem state without verifying the DB row exists, risking false-positive recoveries. (`014-F21`, `005-F06`, `mcp_server/lib/storage/transaction-manager.ts:317-342`)

3. **DB hot-rebind failure suppresses retries** — `checkDatabaseUpdated()` advances `lastDbCheck` before `reinitializeDatabase()` succeeds, so a failed rebind blocks retry for the same marker timestamp. (`014-F17`, `mcp_server/core/db-state.ts:103-115`)

4. **Correction undo over-deletes graph edges** — `undoCorrection` deletes causal edges by `(source_id, target_id)` only, not by relation type. Multiple relations between the same pair causes undo to remove unrelated links. (`002-F09`, `mcp_server/lib/learning/corrections.ts:461-478,592-598`)

5. **Per-memory history log is unwired** — `recordHistory()` exists but is not invoked by runtime mutation handlers. The lifecycle log is not populated. (`002-F10`, `mcp_server/lib/storage/history.ts:107-123`)

6. **Graph momentum defaults positive on missing snapshot** — Missing 7-day snapshot yields `current - 0` instead of 0, generating false-positive momentum. (`010-F05`, `mcp_server/lib/graph/graph-signals.ts:129-137,150-154`)

7. **F1 metric double-counts duplicates** — `computeF1()` does not deduplicate IDs unlike `computeRecall()` and `computeMAP()`, inflating F1 for duplicate-heavy ranked lists. (`009-F02`, `mcp_server/lib/eval/eval-metrics.ts:231-246`)

8. **RRF convergence bonus lost** — `fuseResultsMulti()` defaults `convergenceBonus` to `0` instead of `CONVERGENCE_BONUS`, breaking multi-source overlap scoring. Fails T030 regression. (`011-F08/F13`, `shared/algorithms/rrf-fusion.ts:22,182-185,225-229`)

9. **Access-tracker flush semantics wrong** — Accumulator increments in 0.1 steps but flush always persists `+1`, not the accumulated count. Missing documented `getAccessStats()` API. (`011-F16`, `mcp_server/lib/storage/access-tracker.ts:72-83,118-127`)

10. **Coherence scoring is text heuristics, not temporal-structural** — `scoreCoherence()` only checks content length/headings/substance, not future references, predecessor existence, or causal-link chronology as documented. (`011-F17`, `mcp_server/handlers/quality-loop.ts:198-226`)

### P1: Behavior Mismatches

11. **Token budget enforcement fallback is a no-op** — `enforceTokenBudget()` returns original result with `truncated: false` when inner envelope parsing fails, allowing budget overruns. (`001-F01`, `mcp_server/handlers/memory-context.ts:226-235`)

12. **Tier-3 search cap is 90%, not documented 50%** — `topCap = topExisting * 0.9` in hybrid search, contradicting the "50% of existing top score" documented behavior. (`001-F08`, `mcp_server/lib/search/hybrid-search.ts:1317`)

13. **Bulk delete `olderThanDays` validation drift** — JSON schema enforces `>=1`, Zod runtime allows `0`, handler rejects `<1`. Three layers, three rules. (`002-F04`, `mcp_server/tool-schemas.ts:268`, `mcp_server/schemas/tool-input-schemas.ts:187`)

14. **Async ingest path limit inconsistency** — Handler allows 100 paths, tool schema caps at 50. (`005-F05`, `mcp_server/handlers/memory-ingest.ts:34,74-76`, `mcp_server/schemas/tool-input-schemas.ts:309-312`)

15. **Archival lacks vector cleanup** — Only BM25 is synchronized on archive; vector embeddings remain untouched despite docs claiming optional vector cleanup. (`005-F07`, `mcp_server/lib/cognitive/archival-manager.ts:367-427`)

16. **Causal stats coverage inflated by orphans** — Coverage numerator counts distinct IDs from `causal_edges` without joining `memory_index`, so orphan IDs inflate reported coverage. (`006-F02`, `mcp_server/handlers/causal-graph.ts:578-589`)

17. **`max_depth_reached` false positives** — Set for natural leaf nodes when depth `>= maxDepth - 1`, even without actual truncation. (`006-F04`, `mcp_server/handlers/causal-graph.ts:122-127`)

18. **Channel min-representation missing re-sort** — `analyzeChannelRepresentation` appends promoted items without re-sorting. (`012-F03`, `mcp_server/lib/search/channel-representation.ts:173-182`)

19. **Query router ignores documented signals** — Tier classification ignores `charCount` and `stopWordRatio` despite feature claim. (`012-F01`, `mcp_server/lib/search/query-classifier.ts:173-179`)

20. **Local reranker uses wrong memory thresholds** — Implementation checks `os.totalmem()` with 8GB/2GB thresholds instead of documented 4GB free-memory and 512MB custom-model thresholds. (`011-F14`, `mcp_server/lib/search/local-reranker.ts:28-35,185-190`)

21. **Math.max/min spread still present** — Feature claims stack-overflow elimination, but `Math.max(...folderMemories.map(...))` spread calls remain in `folder-scoring.ts:200,267`. (`008-F08`)

22. **Weight history `last_accessed` is unwired** — `touchEdgeAccess` exists but has no runtime call sites. (`010-F04`, `mcp_server/lib/storage/causal-edges.ts:750-758`)

23. **Index scan `skipped_hash` is always zero** — `skipped_hash` is hardcoded to `0` and `incremental.hash_checks` is misleadingly named (set to `toUpdate.length`, not actual hash comparisons). No content-hash branch exists in the categorization logic. (`004-F01`, `mcp_server/handlers/memory-index.ts:320-322`)

24. **Reporting dashboard missing `eval_final_results` query** — Feature claims aggregation from 3 tables including `eval_final_results`, but implementation only queries `eval_metric_snapshots` and `eval_channel_results`. (`007-F02`, `mcp_server/lib/eval/reporting-dashboard.ts:181-241`)

25. **Feature flag reference source table stale** — 5+ flags point to non-existent or barrel-re-export files instead of actual implementation. `SPECKIT_RRF` points to non-existent `lib/search/rrf-fusion.ts`, `SPECKIT_LAZY_LOADING` has no active read site. (`020-F01`)

---

## Systemic Cross-Cutting Patterns

### Pattern 1: Phantom Test File (`retry.vitest.ts`)

**Severity: HIGH** — Found in **30+ feature catalog entries** across all phases.

`mcp_server/tests/retry.vitest.ts` is referenced throughout the feature catalog but does not exist in the repository. Only `retry-manager.vitest.ts` exists. This is the single most widespread catalog accuracy issue.

**Fix:** Global find-replace of stale `retry.vitest.ts` references. Either remove or point to `retry-manager.vitest.ts`.

### Pattern 2: Feature Catalog Source Table Drift

**Severity: HIGH** — Found in **60+ features**.

Feature catalog `.md` files frequently list implementation and test files that don't match where the actual code lives. Common variants:
- Source table omits the actual implementation file (behavior is in a different module)
- Source table includes unrelated files (copy-paste from template)
- Test table omits the strongest existing coverage while listing weaker/placeholder tests
- Feature bundles 5-10 fixes but source table only covers 1-2

**Fix:** Systematic source/test table audit and realignment across all 179 feature entries.

### Pattern 3: Swallowed Catch Blocks

**Severity: MEDIUM** — Found in **25+ source files**.

Silent `catch {}` blocks that return boolean/default values are widespread, particularly in:
- `mcp_server/handlers/mutation-hooks.ts:22-58` (5 empty catches)
- `mcp_server/lib/search/vector-index-queries.ts:552-553`
- `mcp_server/lib/search/vector-index-schema.ts:790-791`
- `mcp_server/lib/eval/eval-db.ts:168-172`
- `mcp_server/lib/eval/shadow-scoring.ts:164-166`
- `mcp_server/lib/telemetry/consumption-logger.ts` (3 locations)
- `mcp_server/lib/storage/access-tracker.ts`
- `mcp_server/lib/storage/causal-edges.ts:756-758`

**Fix:** Replace with structured warning logs at minimum. Critical paths (mutation hooks, DB operations) should surface errors.

### Pattern 4: Wildcard Barrel Re-exports

**Severity: LOW** — Found in **10+ barrel files**.

Files using `export * from` instead of explicit named exports:
- `mcp_server/lib/providers/embeddings.ts:9`
- `mcp_server/lib/scoring/folder-scoring.ts:7`
- `mcp_server/lib/utils/path-security.ts:7`
- `mcp_server/lib/search/vector-index.ts:6-10`
- `mcp_server/lib/errors.ts:7` / `mcp_server/lib/errors/index.ts:4-5`
- `mcp_server/hooks/index.ts:5-7`

**Fix:** Convert to explicit named exports for auditability.

### Pattern 5: Deferred/Placeholder Test Suites

**Severity: MEDIUM** — Found in **15+ test files**.

Test suites with `expect(true).toBe(true)` placeholders or deferred `it.skip` blocks that are listed in feature catalogs as providing coverage:
- `mcp_server/tests/memory-save-integration.vitest.ts` (all placeholders)
- `mcp_server/tests/causal-edges.vitest.ts` (largely placeholder)
- `mcp_server/tests/channel.vitest.ts` (placeholder stubs)
- `mcp_server/tests/handler-causal-graph.vitest.ts` (deferred)
- `mcp_server/tests/integration-causal-graph.vitest.ts` (deferred)
- `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts` (deferred)
- `mcp_server/tests/handler-session-learning.vitest.ts` (validation-heavy)
- `mcp_server/tests/search-archival.vitest.ts` (placeholder)

**Fix:** Either implement the deferred tests or remove them from feature catalog coverage claims.

### Pattern 6: Validation Rule Duplication Without Shared Constants

**Severity: MEDIUM** — Found in **5+ parameter boundaries**.

Same validation rules duplicated across JSON schema, Zod schema, and handler guards with different values:
- `olderThanDays`: JSON `>=1`, Zod `>=0`, handler `<1`
- `ingest paths`: Handler allows 100, schema caps at 50
- `confirmName`: Handler optional, schema/tool-type required
- Memory thresholds: Docs say 4GB/512MB, code uses 8GB/2GB

**Fix:** Extract shared constants consumed by all validation layers.

### Pattern 7: Feature Flag Default Documentation Mismatch

**Severity: MEDIUM** — Found in **8+ features**.

Module header comments say "default: OFF/disabled" while runtime code graduates the flag to ON:
- `SPECKIT_DOCSCORE_AGGREGATION` — comment says OFF, `isMpabEnabled()` defaults ON
- `SPECKIT_LEARN_FROM_SELECTION` — comment says OFF, `isLearnedFeedbackEnabled()` defaults ON
- Folder scoring — header says disabled, `isFolderScoringEnabled()` graduated ON
- Reconsolidation — catalog says default ON, implementation requires explicit opt-in

**Fix:** Audit all flag defaults and align module comments with runtime behavior.

### Pattern 8: Missing Playbook Scenario Mapping

**Severity: LOW** — Found in **120+ features**.

Most features have no per-feature manual test playbook mapping. Phase-level EX-*/NEW-* ranges exist but are not mapped to specific features, making playbook coverage unverifiable.

**Fix:** Map each feature to specific playbook scenario(s) or document the gap explicitly.

---

## Highest-Impact Fix Opportunities

### Quick Wins (1-2 hours each)

1. **Global `retry.vitest.ts` reference cleanup** — Find-replace across 30+ catalog files
2. **Mutation hooks logging** — Add `console.warn` to 5 catch blocks in `mutation-hooks.ts`
3. **Flag default comment alignment** — Update 8+ module header comments
4. **Shared validation constants** — Extract `olderThanDays`, `maxPaths`, `confirmName` bounds

### Medium Effort (half-day each)

5. **RRF convergence bonus restoration** — Fix default in `rrf-fusion.ts`, verify T030 passes
6. **Pending file DB check** — Add existence check before rename in `transaction-manager.ts`
7. **DB rebind retry fix** — Only advance `lastDbCheck` after successful reinit
8. **Graph momentum zero-default** — Return 0 when 7-day snapshot is missing
9. **F1 deduplication** — Dedupe IDs in `computeF1()` like `computeRecall()`

### Significant Effort (1-2 days each)

10. **Feature catalog source/test table realignment** — 60+ features need table updates
11. **Placeholder test implementation** — 8+ test suites need real assertions
12. **Atomic save redesign** — Either implement true file+index transaction or rewrite docs
13. **History log wiring** — Connect `recordHistory()` to mutation handlers

---

### Additional Findings from Final Phases

**013-Memory Quality & Indexing (16 features, 0F/8W/8P):**
- Strongest phase — no FAILs. Well-structured quality gates, entity extraction, and indexing.
- Cross-cutting: token estimation inconsistency (preflight uses 3.5 chars/token, quality-loop uses 4.0).
- 3 features have stale default-on/off documentation in module comments.
- F-11: Feature catalog lists non-existent source path (`mcp_server/lib/parsing/slug-utils.ts` vs actual `scripts/utils/slug-utils.ts`).

**017-Governance (2 features, 0F/0W/2P):**
- Clean pass. Process-control features with no dedicated implementation bugs.

**019-Decisions & Deferrals (5 features, 0F/2W/3P):**
- Entity extraction Rule-3 regex allows cross-sentence capture via `[\w.-]+` period inclusion.
- Graph centrality feature catalog omits `graph-signals.ts` from source table.

**020-Feature Flag Reference (7 features, 1F/2W/4P):**
- Search pipeline flag reference table has 5+ stale source file mappings.
- `EMBEDDING_DIM` documented as general override but code only checks 768-compatibility.

---

## Audit Completion Status

| Item | Status |
|------|--------|
| Phase folders created | 20/20 |
| Checklists completed | 20/20 |
| Features audited | 180/180 |
| Synthesis report | Complete |
| Context save | Pending |

---

*Generated by 20-phase feature-centric code audit. 15 agents dispatched across Claude Opus 4.6. Completed 2026-03-10.*
