# Code Audit Synthesis Report

**Date:** 2026-03-08
**Agents:** 30 Copilot (gpt-5.3-codex) + 5 Codex (gpt-5.4)
**Scope:** 180 features across 20 categories, ~400 TypeScript source files
**Runtime:** ~30 minutes (6 waves of 5 + 5 architectural agents)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Raw bugs/findings** | 268 (214 Stream 1 + 54 Stream 2) |
| **Unique file locations (deduped)** | ~129 (Stream 1) + ~54 (Stream 2) |
| **After full deduplication (est.)** | ~145 unique issues |
| **P0-CRITICAL** | 2 (1 deduplicated — broken import in 2 files) |
| **P1-IMPORTANT** | ~100 (deduplicated estimate) |
| **P2-MINOR** | ~43 (deduplicated estimate) |
| **Prior findings (F1-F25) verified** | F1-F11 re-checked: 4 FIXED, 3 PARTIALLY_FIXED, 2 STILL_PRESENT |
| **Agent errors** | 0 (all 35 agents completed successfully) |
| **README coverage** | 98.5% (3 files missing from hooks/README.md) |

---

## Prior Findings Cross-Reference (F1-F11)

These 8 code findings + 3 architecture findings from the 2026-03-08 cross-AI review were re-verified by S01-S03/S05:

| Prior ID | Severity | Status | Evidence |
|----------|----------|--------|----------|
| **F1** | P1 | **FIXED** | rrf-fusion.ts — cross-variant fusion no longer mixes normalized/raw convergence bonus scales; per-variant scores fused separately |
| **F2** | P1 | **FIXED** | rrf-fusion.ts — weights now sanitized with `Number.isFinite()` check before score multiplication |
| **F3** | P1 | **FIXED** | adaptive-fusion.ts — all-zero-channel case now guarded; returns empty array instead of normalizing to 1.0 |
| **F4** | P1 | **PARTIALLY_FIXED** | checkpoints.ts — `working_memory` uses `ON DELETE SET NULL` (removes cascade in new tables) but canonical schema still defines `ON DELETE CASCADE` |
| **F5** | P1 | **FIXED** | checkpoints.ts — restore path now blocks self-loop causal edges before raw insertion |
| **F6** | P1 | **PARTIALLY_FIXED** | folder-detector.ts — caller blocks unapproved absolute paths, but helper itself still accepts absolute path without root enforcement |
| **F7** | P1 | **STILL_PRESENT** | workflow.ts — HTML cleaning still regex-based; only strips subset of tags; active HTML (script, img, iframe) not sanitized |
| **F8** | P1 | **FIXED** | memory-crud-health.ts — orphan-edge auto-repair now initializes local causal-edge DB binding before cleanup |
| **F9** | P1 | **PARTIALLY_FIXED** | Error contracts improved at MCP layer but internal contracts still mixed (throw/return false/return null) |
| **F10** | P2 | **STILL_PRESENT** | Loose type contracts at boundaries; `Record<string, unknown>` inputs escape validation |
| **F11** | P1 | **STILL_PRESENT** | checkpoints.ts still writes `causal_edges` directly with SQL, bypassing `causal-edges.ts` module |

**Summary: 4 FIXED (F1, F2, F3, F5, F8) · 3 PARTIALLY_FIXED (F4, F6, F9) · 3 STILL_PRESENT (F7, F10, F11)**

> F12-F25 were documentation findings not re-verified by this code audit.

---

## P0-CRITICAL Findings (Immediate Action Required)

### P0-001: Broken import path in graph-flags.ts and causal-boost.ts

| Field | Value |
|-------|-------|
| **Files** | `mcp_server/lib/search/graph-flags.ts:6`, `mcp_server/lib/search/causal-boost.ts:9` |
| **Agent** | A16 |
| **Type** | LOGIC |
| **Description** | Broken relative import `../cache/cognitive/rollout-policy` points to non-existent module path. Can fail module load/compile for graph flag evaluation and causal boost. |
| **Evidence** | `import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';` |
| **Fix** | Change import to `../cognitive/rollout-policy` (the actual existing path). |
| **Effort** | S (2 lines, 2 files) |

---

## P1-IMPORTANT Findings — Top Issues by File (Deduplicated)

The following table shows unique P1 findings after deduplication. Multiple agents found the same bugs on shared source files — the "Agents" column shows how many independently identified each issue.

### Scoring & Fusion (highest impact)

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-S01 | `composite-scoring.ts:247-303` | NaN | `calculateRetrievabilityScore()` accepts negative `stability`; `Math.pow(negative, -0.5)` returns NaN that propagates through composite | S01 |
| P1-S02 | `rrf-fusion.ts:179-195` | NaN | RRF validation incomplete: `k=NaN` yields NaN division; `convergenceBonus`, `graphWeightBoost` lack finite checks; negative `list.weight` inverts instead of disabling | S01 |
| P1-S03 | `composite-scoring.ts:20,256-258,569-574` | LOGIC | Feature flag `USE_FIVE_FACTOR` hardcoded to false; 5-factor path unreachable; 6-factor path merges partial weight overrides without re-normalization | A18(×3) |
| P1-S04 | `composite-scoring.ts:505-507` | EDGE_CASE | Composite normalization edge case with identical scores or single-element arrays | A18(×3) |
| P1-S05 | `mpab-aggregation.ts:96-118` | EDGE_CASE | `computeMPAB()` lacks finite-number validation on chunk scores; Infinity/NaN propagates | A25(×3), S01 |
| P1-S06 | `shared/algorithms/rrf-fusion.ts:118-127,214-223` | LOGIC | Cross-variant fusion and channel weight handling issues | A20, A21 |
| P1-S07 | `shared/normalization.ts:25-61,117-154` | TYPE_SAFETY | Normalization functions lack finite guards; non-finite input breaks [0,1] contract | A19(×3) |

### Storage & Transactions

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-T01 | `checkpoints.ts:819-848` | LOGIC | Checkpoint restore causal-edges: direct SQL write bypasses `causal-edges.ts` module (F11 STILL_PRESENT) | A06(×4), S02, S05 |
| P1-T02 | `causal-edges.ts:157-163` | EDGE_CASE | Edge weight boundary — weight history accumulation without cap; potential unbounded growth | A08(×4) |
| P1-T03 | `causal-edges.ts:326-339` | LOGIC | Drift-why traversal: path reconstruction logic may revisit nodes in cyclic graphs | A08(×4) |
| P1-T04 | `transaction-manager.ts:291-312` | EDGE_CASE/LOGIC | Nested transaction guard: inner `runInTransaction` may fail silently if outer transaction already active | A07, A27(×3) |
| P1-T05 | `access-tracker.ts:51-62,81-99` | RESOURCE | Interval timer for flush never cleared on shutdown; unclosed timer keeps process alive | A07, A17, A18(×3), A19, A20 |
| P1-T06 | `reconsolidation.ts:503-506` | RESOURCE | Reconsolidation bridge: potential resource leak on partial failure | A22 |

### Handlers & Security

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-H01 | `checkpoints.ts:211-214,262-264` | ERROR_HANDLING | Checkpoint create/list: error handling wraps operations but doesn't clean up partial state on failure | A06(×4) |
| P1-H02 | `memory-crud-update.ts:187-200` | ERROR_HANDLING | Memory update handler: partial transaction commit on validation failure path | A03(×3), A04(×2) |
| P1-H03 | `memory-crud-delete.ts:192-199` | LOGIC | Delete handler: cascade logic missing for associated metadata/graph edges | A03(×2), A04(×2) |
| P1-H04 | `memory-bulk-delete.ts:177-182` | ERROR_HANDLING | Bulk delete: individual item failures don't roll back successfully deleted items | A03 |
| P1-H05 | `session-learning.ts:102-111` | LOGIC | Session learning: score computation may produce incorrect values when session lacks sufficient data points | A09(×3) |
| P1-H06 | `session-learning.ts:139-145` | EDGE_CASE | Session learning: empty session history produces undefined behavior in aggregation | A09(×3) |
| P1-H07 | `quality-loop.ts:121-123,383-390` | EDGE_CASE | Quality loop: concurrent invocation can produce duplicate fix attempts | A22, A20 |
| P1-H08 | `folder-detector.ts:459` | PATH_TRAVERSAL | Absolute path accepted without root enforcement (F6 PARTIALLY_FIXED) | S03 |
| P1-H09 | `workflow.ts:818` | INPUT_SANITIZATION | HTML cleaning incomplete — script/iframe/svg tags not sanitized (F7 STILL_PRESENT) | S03 |
| P1-H10 | `memory-save.ts:301-324,412-445` | LOGIC | Save handler: atomic write + index sequence — partial indexing on embedding failure path | A24, A27(×2) |

### Search & Retrieval

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-R01 | `hybrid-search.ts:914-916` | EDGE_CASE | Hybrid search: score clamp guard may discard valid results near boundary | A01(×4), A02 |
| P1-R02 | `stage1-candidate-gen.ts:252-263,315-369` | LOGIC | Stage 1 candidate generation: BM25 fallback scoring and channel dispatch issues | A01(×3), A25(×2) |
| P1-R03 | `stage2-fusion.ts:547-551,695-699` | EDGE_CASE/LOGIC | Stage 2 fusion: convergence bonus edge case + temporal contiguity computation | A01(×3), A17 |
| P1-R04 | `graph-search-fn.ts:122-154` | LOGIC | Graph search: FTS BM25 score queried but discarded; output uses strength-only | A10, A16(×2) |
| P1-R05 | `graph-signals.ts:298-308` | LOGIC | Causal depth: BFS computes shortest depth (first-visit), not maximum depth as specified | A16(×2) |
| P1-R06 | `spec-folder-hierarchy.ts:266-283` | LOGIC | Spec folder hierarchy: recursive resolution may produce incorrect parent chain | A28(×3) |
| P1-R07 | `anchor-metadata.ts:117-143` | LOGIC | Anchor metadata enrichment: incorrect field mapping for anchor regions | A25(×3) |
| P1-R08 | `memory-summaries.ts:168-191` | LOGIC | Memory summary channel: summary generation may produce empty summaries for short memories | A28 |
| P1-R09 | `intent-classifier.ts:517-519` | LOGIC | Intent classifier: double-intent weighting when query matches multiple categories | A19 |
| P1-R10 | `local-reranker.ts:28-33,187-190` | LOGIC | Local GGUF reranker: model load path and fallback behavior issues | A20(×2) |
| P1-R11 | `channel-representation.ts:173-179` | LOGIC | Channel min representation: minimum contribution threshold miscalculated | A21 |
| P1-R12 | `vector-index-mutations.ts:355,445` | LOGIC | Vector index mutations: deferred indexing race condition on concurrent saves | A04 |
| P1-R13 | `vector-index-schema.ts:787-791` | ERROR_HANDLING | Vector index schema: migration error handling may leave schema in inconsistent state | A26(×2) |

### Graph & Cognitive

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-G01 | `co-activation.ts:131-153,349-357` | EDGE_CASE | Co-activation: parsed `related_memories` entries not type-guarded for numeric `similarity`; NaN propagation risk | A10, A16 |
| P1-G02 | `rollout-policy.ts:41-47` | LOGIC | Feature flag evaluation: `isFeatureEnabled` returns stale cached value without TTL invalidation | A10, A17, A23 |
| P1-G03 | `temporal-contiguity.ts:53-56,74` | EDGE_CASE | Temporal contiguity: timestamp parsing may produce invalid Date objects for edge cases | A17 |
| P1-G04 | `community-detection.ts:334-337` | EDGE_CASE | Community detection: debounce fingerprint uses only `COUNT(*) + MAX(id)` — not unique for stale assignments | A17 |
| P1-G05 | `working-memory.ts:554-563` | LOGIC | Working memory: session-scoped cleanup may orphan entries when session ID rotates | A02 |
| P1-G06 | `fsrs-scheduler.ts:95-113,133-145,192-199` | TYPE_SAFETY | FSRS scheduler: review interval calculation accepts unvalidated parameters; potential negative intervals | A18 |

### Evaluation & Measurement

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-E01 | `eval-metrics.ts:191-198` | EDGE_CASE | Metric computation: division by zero when ground truth set is empty | A09(×2), A13(×2), A14, A15 |
| P1-E02 | `eval-metrics.ts:233-239` | LOGIC | NDCG computation: relevance grades may produce incorrect ideal DCG for partial results | A13(×2) |
| P1-E03 | `eval-metrics.ts:425-432` | LOGIC | MRR computation: first-match semantics incorrect when multiple relevant results exist | A15 |
| P1-E04 | `eval-db.ts:119-141` | RESOURCE | Eval database: connection not properly closed on early return paths | A13(×2) |
| P1-E05 | `eval-quality-proxy.ts:107-129` | EDGE_CASE | Quality proxy: statistical computation on small sample sizes produces unreliable estimates | A14(×2) |
| P1-E06 | `eval-logger.ts:54-56` | LOGIC | Eval logger: log rotation condition inverted; logs grow unbounded | A15 |
| P1-E07 | `bm25-baseline.ts:321-359` | EDGE_CASE | BM25 baseline: tokenization edge case with empty/whitespace-only queries | A14 |

### Pipeline & Infrastructure

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-P01 | `job-queue.ts:411-438` | LOGIC | Ingest job queue: worker retry logic may requeue same job indefinitely under failure | A07 |
| P1-P02 | `db-state.ts:111-115` | LOGIC | Cross-process DB hot rebinding: state synchronization race condition | A27(×2) |
| P1-P03 | `memory-context.ts:226-236` | LOGIC | Memory context handler: result ordering not preserved for priority-sorted retrieval | A01 |
| P1-P04 | `corrections.ts:590-598` | LOGIC | Correction tracking: undo operation doesn't restore previous state atomically | A04 |
| P1-P05 | `extraction-adapter.ts:197-201` | LOGIC | Tool-result extraction: extraction adapter silently drops malformed tool results | A23 |
| P1-P06 | `slug-utils.ts:1-1` | ERROR_HANDLING | Slug utils: missing error handling for edge-case input strings | A23 |
| P1-P07 | `file-watcher.ts:36-41,200-204,295-355` | LOGIC/RESOURCE | File watcher: race condition on rapid delete/rename; resource cleanup incomplete | A29(×4) |
| P1-P08 | `save-quality-gate.ts:593-604` | ERROR_HANDLING | Quality gate: validation errors silently swallowed on specific code paths | A22 |
| P1-P09 | `confidence-tracker.ts:155-164` | ERROR_HANDLING | Confidence tracker: error swallowing in score persistence | A19 |

### Server Integration (S05 findings)

| ID | File | Type | Description | Agents |
|----|------|------|-------------|--------|
| P1-I01 | `context-server.ts:571-681` | SIGNAL | Fatal error handlers not wired to same cleanup path; `unhandledRejection` skips cleanup, `uncaughtException` exits without awaiting async cleanup | S05 |
| P1-I02 | `context-server.ts:919-933` | SESSION | Session state recovery effectively dead; no live request flow persists session state; crash recovery/logging inert | S05 |
| P1-I03 | `session-manager.ts:161-162,178-179` | LOGIC | Session manager: session-scoped state initialization race on concurrent requests | A30, S05 |

---

## P2-MINOR Findings Summary

~43 deduplicated P2 findings across these categories:

| Category | Count | Key Patterns |
|----------|-------|-------------|
| Error swallowing / silent failures | 12 | Catch blocks that log but don't propagate; missing error returns |
| Edge case input handling | 10 | Empty arrays, zero-length strings, boundary values |
| Type safety gaps | 8 | Unsafe casts, missing type guards, `as unknown as T` patterns |
| Resource management | 5 | Unclosed handles, timer leaks on non-critical paths |
| Test quality | 4 | Tests that pass on exceptions (`expect(true).toBe(true)`), missing mocks |
| Documentation references | 4 | Feature catalog files pointing to non-existent script paths |

---

## Per-Category Bug Count

| Category | Features | Raw Bugs | P0 | P1 | P2 | Agent(s) |
|----------|----------|----------|----|----|-----|----------|
| 01--retrieval | 9 | 16 | 0 | 13 | 3 | A01, A02 |
| 02--mutation | 10 | 15 | 0 | 13 | 2 | A03, A04 |
| 03--discovery + 04--maintenance | 5 | 8 | 0 | 3 | 5 | A05 |
| 05--lifecycle | 7 | 16 | 0 | 10 | 6 | A06, A07 |
| 06--analysis + 07--evaluation | 9 | 22 | 0 | 18 | 4 | A08, A09 |
| 08--bug-fixes | 11 | 12 | 0 | 8 | 4 | A10, A11, A12 |
| 09--eval-measurement | 14 | 26 | 0 | 19 | 7 | A13, A14, A15 |
| 10--graph-signal | 11 | 13 | 2 | 9 | 2 | A16, A17 |
| 11--scoring | 17 | 25 | 0 | 21 | 4 | A18, A19, A20 |
| 12--query-intelligence | 6 | 6 | 0 | 3 | 3 | A21 |
| 13--memory-quality | 16 | 13 | 0 | 9 | 4 | A22, A23, A24 |
| 14--pipeline | 21 | 30 | 0 | 14 | 16 | A25, A26, A27 |
| 15--retrieval-enhancements | 9 | 6 | 0 | 4 | 2 | A28 |
| 16--tooling + 17--governance | 10 | 9 | 0 | 8 | 1 | A29 |
| 18--ux + 19--decisions + 20--flags | 25 | 8 | 0 | 1 | 7 | A30 |
| **Stream 2 cross-cutting** | — | 54 | 0 | 34 | 20 | S01-S05 |
| **TOTAL** | **180** | **268** | **2** | **~187** | **~86** | — |

---

## README Coverage Report (from S04)

| Metric | Value |
|--------|-------|
| **Total directories audited** | 38 |
| **Total .ts files checked** | 206 |
| **Listed in READMEs** | 203 |
| **Missing from READMEs** | 3 |
| **Coverage** | **98.5%** |

### Missing Files

**Directory:** `mcp_server/hooks/`
| File | Status |
|------|--------|
| `memory-surface.ts` | MISSING from hooks/README.md |
| `mutation-feedback.ts` | MISSING from hooks/README.md |
| `response-hints.ts` | MISSING from hooks/README.md |

All other 37 directories have 100% README coverage.

---

## Deduplication Log

The following bug entries were reported by multiple agents on shared source files and were merged into single entries:

| Deduplicated File | Agents | Merged Into |
|-------------------|--------|-------------|
| `tool-cache.ts:51-53` | A30 (×6) | P2 edge case |
| `memory-crud-update.ts:187-200` | A03(×3), A04(×2) | P1-H02 |
| `checkpoints.ts:819-848` | A06(×4) | P1-T01 |
| `causal-edges.ts:157-163` | A08(×4) | P1-T02 |
| `causal-edges.ts:326-339` | A08(×4) | P1-T03 |
| `access-tracker.ts:51-99` | A07, A17, A18(×3), A19, A20(×2) | P1-T05 |
| `hybrid-search.ts:914-916` | A01(×4) | P1-R01 |
| `eval-metrics.ts:191-198` | A09(×2), A13(×2), A14, A15 | P1-E01 |
| `eval-metrics.ts:469-471` | A13(×2), A15 | P2 edge case |
| `composite-scoring.ts:20,256-258` | A18(×3) | P1-S03 |
| `composite-scoring.ts:505-507` | A18(×3) | P1-S04 |
| `mpab-aggregation.ts:96-118` | A25(×3) | P1-S05 |
| `stage1-candidate-gen.ts:252-369` | A01(×3), A25(×2) | P1-R02 |
| `stage2-fusion.ts:547-551` | A01(×3) | P1-R03 |
| `spec-folder-hierarchy.ts:266-283` | A28(×3) | P1-R06 |
| `anchor-metadata.ts:117-143` | A25(×3) | P1-R07 |
| `normalization.ts:25-61,117-154` | A19(×3) | P1-S07 |
| `rollout-policy.ts:41-47` | A10, A17, A23 | P1-G02 |
| `session-learning.ts:102-111` | A09(×3) | P1-H05 |
| `session-learning.ts:139-145` | A09(×3) | P1-H06 |
| `checkpoints.ts:211-214,262-264` | A06(×4) | P1-H01 |
| `graph-signals.ts:298-308` | A16(×2) | P1-R05 |
| `transaction-manager.ts:291-312` | A07, A27(×3) | P1-T04 |
| `memory-crud-delete.ts:93-199` | A03(×2), A04(×2) | P1-H03 |
| `file-watcher.ts:36-355` | A29(×4) | P1-P07 |

**Total raw entries:** 268 → **~145 unique issues after deduplication**

---

## Prioritized Fix List

### Tier 1: Immediate (P0 + high-impact P1) — Effort: S-M

| Priority | ID | File | Fix | Effort |
|----------|-----|------|-----|--------|
| 1 | P0-001 | `graph-flags.ts:6`, `causal-boost.ts:9` | Fix broken import path `../cache/cognitive/rollout-policy` → `../cognitive/rollout-policy` | **S** |
| 2 | P1-T05 | `access-tracker.ts:51-99` | Clear flush interval timer on shutdown; add `dispose()` method | **S** |
| 3 | P1-S01 | `composite-scoring.ts:247-303` | Guard negative `stability` with `Math.abs()` or clamp to 0; add `Number.isFinite()` check on output | **S** |
| 4 | P1-S02 | `rrf-fusion.ts:179-195` | Add finite/non-negative validation for `k`, `convergenceBonus`, `graphWeightBoost`, `list.weight` | **S** |
| 5 | P1-I01 | `context-server.ts:571-681` | Unify fatal error handlers through single `fatalShutdown()` with deadline | **M** |
| 6 | P1-H09 | `workflow.ts:818` | Replace regex HTML strip with DOMPurify or comprehensive tag allowlist | **M** |
| 7 | P1-H08 | `folder-detector.ts:459` | Add approved-root validation inside `resolveSessionSpecFolderPaths` | **S** |

### Tier 2: Important (transaction/storage safety) — Effort: M

| Priority | ID | File | Fix | Effort |
|----------|-----|------|-----|--------|
| 8 | P1-T01 | `checkpoints.ts:819-848` | Route checkpoint edge restore through `causal-edges.ts` public API (F11) | **M** |
| 9 | P1-T04 | `transaction-manager.ts:291-312` | Add nested transaction guard / savepoint support | **M** |
| 10 | P1-H02 | `memory-crud-update.ts:187-200` | Wrap update + validation in single transaction with proper rollback | **M** |
| 11 | P1-E01 | `eval-metrics.ts:191-198` | Add empty ground-truth guard returning 0/undefined instead of dividing by zero | **S** |
| 12 | P1-R05 | `graph-signals.ts:298-308` | Replace first-visit BFS with longest-path DAG traversal for causal depth | **M** |

### Tier 3: Quality hardening (NaN guards, type safety) — Effort: S each

| Priority | ID | Pattern | Fix | Effort |
|----------|-----|---------|-----|--------|
| 13 | P1-S05 | `mpab-aggregation.ts` | Add `Number.isFinite()` guards on chunk scores | **S** |
| 14 | P1-S07 | `shared/normalization.ts` | Add finite-input validation; return 0 for non-finite | **S** |
| 15 | P1-G01 | `co-activation.ts` | Type-guard parsed `related_memories` similarity field | **S** |
| 16 | P1-G06 | `fsrs-scheduler.ts` | Clamp review interval parameters to valid ranges | **S** |

### Tier 4: README gaps — Effort: S

| Priority | ID | File | Fix | Effort |
|----------|-----|------|-----|--------|
| 17 | README | `hooks/README.md` | Add missing entries: `memory-surface.ts`, `mutation-feedback.ts`, `response-hints.ts` | **S** |

---

## Verification Checklist

- [x] All 35 output files exist and are non-empty (A01-A30: 211-462 lines each; S01-S05: 180-1423 lines each)
- [x] No `AGENT_ERROR` markers in any output file
- [x] Synthesis covers all 180 features via 30 per-feature agents
- [x] README coverage report accounts for all 38 project READMEs (34 mcp_server + 4 shared)
- [x] P0 findings flagged for immediate remediation (1 unique issue, 2 files)
- [ ] `npm run check` and `npm run check:full` — to be run after fixes

---

*Generated by Claude Opus 4.6 from 35-agent code audit outputs (30 Copilot gpt-5.3-codex + 5 Codex gpt-5.4)*
