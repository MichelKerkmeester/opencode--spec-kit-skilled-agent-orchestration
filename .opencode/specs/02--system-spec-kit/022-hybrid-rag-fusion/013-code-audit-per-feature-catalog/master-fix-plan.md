# Master Fix Plan — Feature-Centric Code Audit Remediation

## Overview

**178 tasks** across 20 audit phases, organized into **5 execution waves**.
Each wave dispatches up to **10 Codex 5.3 xhigh** (via `cli-copilot`) + **1 GPT 5.4 xhigh** (via `cli-codex`).

| Priority | Tasks | Description |
|----------|-------|-------------|
| P0 | 44 | FAIL — correctness bugs, active behavior mismatches |
| P1 | 74 | WARN — behavior drift, significant code issues |
| P2 | 60 | WARN — documentation/test gaps only |
| **Total** | **178** | |

---

## Wave 1: P0 Critical Code Fixes

**Goal:** Fix all 44 P0 correctness bugs in source code.
**Agents:** 1 GPT 5.4 xhigh + 10 Codex 5.3 xhigh = 11 agents
**Estimated scope:** ~27 source files modified

### G1 (GPT 5.4 xhigh via cli-codex): Pipeline Atomicity & Transaction Safety

The hardest cluster — requires understanding transaction semantics across multiple modules.

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 014-T01 | Pipeline | DB hot rebind advances `lastDbCheck` before `reinitializeDatabase` succeeds | `mcp_server/core/db-state.ts:103-115` |
| 014-T02 | Pipeline | `atomicSaveMemory` passes no-op `dbOperation`, not truly atomic | `mcp_server/handlers/memory-save.ts:392-445` |
| 014-T03 | Pipeline | Add handler-level atomicity failure-injection tests | `mcp_server/handlers/memory-save.ts` |
| 014-T04 | Pipeline | Pending file recovery renames without DB existence check | `mcp_server/lib/storage/transaction-manager.ts:317-342` |
| 014-T05 | Pipeline | Add startup recovery tests for committed vs uncommitted pending files | `mcp_server/lib/storage/transaction-manager.ts` |
| 005-T03 | Lifecycle | Add stale-pending-file detection before rename | `mcp_server/lib/storage/transaction-manager.ts:317-337` |
| 005-T04 | Lifecycle | Add committed-vs-uncommitted crash recovery tests | `mcp_server/tests/transaction-manager.vitest.ts` |

**Files touched:** `db-state.ts`, `memory-save.ts`, `transaction-manager.ts` + tests

---

### C1: Scoring Engine — RRF, Access Tracker, Coherence

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 011-T01 | Scoring | `fuseResultsMulti` defaults `convergenceBonus` to 0 instead of `CONVERGENCE_BONUS` | `shared/algorithms/rrf-fusion.ts:22,182-185,225-229` |
| 011-T02 | Scoring | Reinstate convergence bonus in fusion corrections | `shared/algorithms/rrf-fusion.ts:22` |
| 011-T04 | Scoring | Access-tracker flush always persists +1, not accumulated count; missing `getAccessStats()` | `mcp_server/lib/storage/access-tracker.ts:72-83,118-127` |
| 011-T05 | Scoring | Coherence scoring uses text heuristics, not temporal-structural checks as documented | `mcp_server/handlers/quality-loop.ts:198-226` |

**Files touched:** `rrf-fusion.ts`, `access-tracker.ts`, `quality-loop.ts`

---

### C2: Metrics, Evaluation & Observation

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 009-T01 | Eval | `computeF1()` doesn't deduplicate IDs (unlike `computeRecall` and `computeMAP`) | `mcp_server/lib/eval/eval-metrics.ts:231-246` |
| 009-T02 | Eval | p95 observer overhead health check missing or incorrect | `mcp_server/lib/eval/shadow-scoring.ts:164-166` |
| 009-T03 | Eval | Placeholder channel attribution tests need real assertions | `mcp_server/tests/channel.vitest.ts:6-39` |
| 007-T01 | Eval | Dashboard claims `eval_final_results` but only queries 2 of 3 tables | `mcp_server/lib/eval/reporting-dashboard.ts:181-241` |
| 007-T02 | Eval | Add reporting dashboard handler-level tests | `mcp_server/handlers/eval-reporting.ts:136-157` |

**Files touched:** `eval-metrics.ts`, `shadow-scoring.ts`, `channel.vitest.ts`, `reporting-dashboard.ts`, `eval-reporting.ts`

---

### C3: Graph Signals & Causal Edges

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 010-T01 | Graph | `touchEdgeAccess` exists but has no runtime call sites | `mcp_server/lib/storage/causal-edges.ts:750-758` |
| 010-T02 | Graph | Placeholder causal-edges tests need real assertions | `mcp_server/tests/causal-edges.vitest.ts:15-220` |
| 010-T03 | Graph | Missing 7-day snapshot yields false-positive momentum (returns `current - 0`) | `mcp_server/lib/graph/graph-signals.ts:129-137,150-154` |
| 010-T04 | Graph | Graph-signals cache not invalidated on causal-edge mutations | `mcp_server/lib/storage/causal-edges.ts:202-205,474-476` |

**Files touched:** `causal-edges.ts`, `graph-signals.ts`, `causal-edges.vitest.ts`

---

### C4: Query Intelligence — Classifier, Channel, Expansion

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 012-T01 | Query | Tier classification ignores `charCount` and `stopWordRatio` despite docs | `mcp_server/lib/search/query-classifier.ts:173-179` |
| 012-T02 | Query | Classifier default-state flag contradicts itself | `mcp_server/lib/search/query-classifier.ts:132-134 vs 43-46` |
| 012-T03 | Query | Add `traceMetadata.queryComplexity` propagation tests | `mcp_server/tests/query-classifier.vitest.ts` |
| 012-T04 | Query | Channel-representation appends promoted items without re-sorting | `mcp_server/lib/search/channel-representation.ts:173-182` |
| 012-T05 | Query | Replace placeholder channel tests with behavioral assertions | `mcp_server/tests/channel.vitest.ts:10-40` |
| 012-T06 | Query | Query expansion missing test file and incomplete implementation table | `mcp_server/lib/search/stage1-candidate-gen.ts:316-349` |

**Files touched:** `query-classifier.ts`, `channel-representation.ts`, `channel.vitest.ts`, `stage1-candidate-gen.ts`

---

### C5: Validation & Schema Alignment

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 002-T01 | Mutation | `olderThanDays` — JSON schema `>=1`, Zod `>=0`, handler `<1` | `mcp_server/tool-schemas.ts:268`, `schemas/tool-input-schemas.ts:187` |
| 005-T01 | Lifecycle | Ingest handler allows 100 paths, schema caps at 50 | `mcp_server/handlers/memory-ingest.ts:34,74-76`, `schemas/tool-input-schemas.ts:309-312` |
| 005-T02 | Lifecycle | Add ingest path boundary and concurrency tests | `mcp_server/tests/handler-memory-ingest.vitest.ts` |
| 001-T04 | Retrieval | BM25 re-index gate missing from feature source table | `feature_catalog/01--retrieval/06-*.md` |

**Files touched:** `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-ingest.ts`, test files

---

### C6: Mutation Handlers — Corrections, History, Causal Graph

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 002-T02 | Mutation | `undoCorrection` deletes by `(source, target)` only — over-deletes multi-relation edges | `mcp_server/lib/learning/corrections.ts:461-478,592-598` |
| 002-T03 | Mutation | `recordHistory()` exists but is never invoked by mutation handlers | `mcp_server/lib/storage/history.ts:107-123` |
| 006-T01 | Analysis | Causal coverage inflated by orphan IDs in `causal_edges` | `mcp_server/handlers/causal-graph.ts:578-589` |
| 006-T02 | Analysis | Add orphan-edge coverage regression test | tests |
| 006-T03 | Analysis | `max_depth_reached` set for natural leaf nodes, not just truncation | `mcp_server/handlers/causal-graph.ts:122-127` |
| 006-T04 | Analysis | Add natural-leaf vs truncated-chain test | tests |

**Files touched:** `corrections.ts`, `history.ts`, `causal-graph.ts` + mutation handlers + tests

---

### C7: Memory & Search — Token Budget, Reranker, Index

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 001-T01 | Retrieval | `enforceTokenBudget()` returns original result when parsing fails — budget overrun | `mcp_server/handlers/memory-context.ts:226-235` |
| 001-T02 | Retrieval | Add regression test for malformed-payload budget enforcement | tests |
| 001-T03 | Retrieval | Tier-3 score cap is 90%, not documented 50% | `mcp_server/lib/search/hybrid-search.ts:1317` |
| 011-T03 | Scoring | Local reranker uses `os.totalmem()` 8GB/2GB instead of documented 4GB/512MB free-memory | `mcp_server/lib/search/local-reranker.ts:28-35,185-190` |
| 004-T01 | Maint. | `skipped_hash` hardcoded to 0, no content-hash branch exists | `mcp_server/handlers/memory-index.ts:320-322` |

**Files touched:** `memory-context.ts`, `hybrid-search.ts`, `local-reranker.ts`, `memory-index.ts` + tests

---

### C8: Storage & Lifecycle — Archival, Folder Scoring

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 005-T05 | Lifecycle | Archival lacks vector cleanup — only BM25 synchronized | `mcp_server/lib/cognitive/archival-manager.ts:367-427` |
| 008-T04 | Bug Fix | `Math.max(...folderMemories.map(...))` spread still causes stack overflow risk | `shared/scoring/folder-scoring.ts:200,267` |
| 008-T05 | Bug Fix | Add large-array RangeError regression test | `shared/scoring/folder-scoring.ts` |

**Files touched:** `archival-manager.ts`, `folder-scoring.ts` + tests

---

### C9: Tooling Scripts

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 016-T01 | Tooling | Tree thinning feature mapped to wrong source files | `mcp_server/lib/chunking/chunk-thinning.ts:4-7,41,113-153` |
| 016-T02 | Tooling | Add tree thinning token-threshold merge tests | tests |
| 016-T03 | Tooling | Architecture boundary checker has wrong path and fragile import parsing | `scripts/evals/check-architecture-boundaries.ts:72-83,127-154` |
| 016-T04 | Tooling | Add boundary violation tests | tests |
| 016-T05 | Tooling | Progressive validation script path incorrect, test table empty | `scripts/spec/progressive-validate.sh:6-21,88-93` |

**Files touched:** `chunk-thinning.ts`, `check-architecture-boundaries.ts`, `progressive-validate.sh` + tests

---

### C10: UX Hooks & Feature Flags

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 018-T01 | UX Hooks | Aggregate repair reporting breaks on mixed outcomes | `mcp_server/handlers/memory-crud-health.ts:375-377,403-405` |
| 018-T02 | UX Hooks | `confirmName` required in schema but optional in handler | `mcp_server/handlers/checkpoints.ts:47-50`, `schemas/tool-input-schemas.ts:230-233,368` |
| 020-T01 | Flags | 5+ SPECKIT_* flags point to wrong/nonexistent source files | `mcp_server/lib/eval/ablation-framework.ts`, `search-flags.ts`, `rrf-fusion.ts` |
| 020-T02 | Flags | Add CI validation script for flag-reference source integrity | new script |

**Files touched:** `memory-crud-health.ts`, `checkpoints.ts`, `tool-input-schemas.ts`, feature catalog flag tables

---

## Wave 2: P1 Behavior Mismatch Fixes

**Goal:** Fix all 74 P1 behavior mismatches and code issues.
**Agents:** 1 GPT 5.4 xhigh + 10 Codex 5.3 xhigh = 11 agents
**Prerequisite:** Wave 1 complete (P0 fixes landed)

### G1 (GPT 5.4 xhigh via cli-codex): Cross-Module Behavior Alignment

Complex P1 fixes requiring multi-file understanding.

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 002-T04 | Mutation | Reconsolidation gating conflict — search-flags vs bridge vs module | `search-flags.ts`, `reconsolidation.ts`, `reconsolidation-bridge.ts` |
| 013-T01 | Quality | Quality loop stricter-trimming claim not implemented | `quality-loop.ts:407-489` |
| 013-T02 | Quality | Token budget message reports wrong value | `quality-loop.ts:174` |
| 013-T03 | Quality | Token estimation ratio inconsistency — preflight 3.5 vs quality-loop 4.0 | `preflight.ts:187`, `quality-loop.ts` |
| 013-T04 | Quality | Reconsolidation defaults to OFF but catalog says ON | `reconsolidation.ts:125-127` |
| 013-T05 | Quality | Verify extraction-adapter import path for working-memory | `extraction-adapter.ts:7` |

**Files touched:** `reconsolidation.ts`, `reconsolidation-bridge.ts`, `quality-loop.ts`, `preflight.ts`, `extraction-adapter.ts`

---

### C1: Mutation & Transaction P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 002-T05 | Mutation | BM25 re-index failure not treated as transactional on metadata update | `memory-crud-update.ts:145-163` |
| 002-T06 | Mutation | Partial bulk-folder deletes possible without DB handle | `memory-crud-delete.ts:192-199` |
| 002-T07 | Mutation | Validation feedback transaction boundaries too narrow | `checkpoints.ts:342-408`, `confidence-tracker.ts:100-154` |
| 002-T08 | Mutation | Transaction-wrapper feature source table incorrect | `memory-crud-update.ts`, `memory-crud-delete.ts` |
| 002-T09 | Mutation | PE decision logging doesn't match "all decisions logged" contract | `prediction-error-gate.ts:267-281` |

---

### C2: Search & Retrieval P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 001-T05 | Retrieval | Trigger-content load failures silently blank out | `memory-triggers.ts:149-159` |
| 001-T06 | Retrieval | Wildcard re-exports on retrieval-critical surfaces | `embeddings.ts:9`, `vector-index.ts:6-10`, `path-security.ts:7` |
| 001-T07 | Retrieval | Empty catch blocks swallow errors in search modules | `vector-index-queries.ts:552-553`, `vector-index-schema.ts:790-791` |
| 001-T08 | Retrieval | 4-stage pipeline export and error handling issues | `embeddings.ts:9` |
| 012-T07 | Query | RSF shadow mode ambiguity — unclear if active or shelved | `rsf-fusion.ts:87-391`, `hybrid-search.ts:123-124` |

---

### C3: Graph & Analysis P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 010-T05 | Graph | Constitutional exclusion failure paths unhandled | graph modules |
| 010-T06 | Graph | Co-activation strength clamping missing | co-activation modules |
| 010-T07 | Graph | Edge density docs alignment | graph modules |
| 010-T08 | Graph | Causal-boost relation multiplier drift | `causal-boost.ts` |
| 010-T09 | Graph | Temporal contiguity window enforcement missing | temporal modules |
| 019-T01 | Decisions | Graph centrality feature source inventory incomplete | `graph-signals.ts:48-55` |
| 019-T02 | Decisions | Missing test references for graph momentum/causal depth | `graph-signals.ts` |

---

### C4: Scoring P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 011-T06 | Scoring | RRF normalization issues | `rrf-fusion.ts` |
| 011-T07 | Scoring | Folder-relevance alignment drift | `folder-scoring.ts` |
| 011-T08 | Scoring | Double-intent investigation incomplete | scoring modules |
| 011-T09 | Scoring | Negative feedback confidence signal issues | scoring modules |
| 011-T10 | Scoring | Auto-promotion catalog misalignment | `auto-promotion.ts` |
| 011-T11 | Scoring | Scoring corrections incomplete | scoring modules |
| 011-T12 | Scoring | Mutation-hook caching issues | `mutation-hooks.ts` |

---

### C5: Evaluation P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 009-T04 | Eval | Silent catches in eval modules | `eval-db.ts:168-172` |
| 009-T05 | Eval | Iteration guards missing | eval modules |
| 009-T06 | Eval | Logging gaps in measurement pipeline | eval modules |
| 009-T07 | Eval | Observability errors not surfaced | eval modules |
| 009-T08 | Eval | Baseline queries incomplete | eval modules |
| 009-T09 | Eval | Eval run ID bootstrap issues | eval modules |
| 009-T10 | Eval | Cross-AI validation fix incomplete | eval modules |

---

### C6: Bug Fix Phase P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 008-T06 | Bug Fix | Chunk collapse dedup catalog incomplete | chunk modules |
| 008-T07 | Bug Fix | Co-activation boost catalog incomplete | `co-activation.ts` |
| 008-T08 | Bug Fix | Content-hash dedup catalog incomplete | hash modules |
| 008-T09 | Bug Fix | Canonical ID dedup hardening incomplete | dedup modules |
| 008-T10 | Bug Fix | Safe-swap semantics gap | `chunking-orchestrator.ts` |
| 008-T11 | Bug Fix | Session cleanup timestamp mismatch | session modules |
| 008-T12 | Bug Fix | Working-memory table name mismatch | working-memory modules |
| 008-T13 | Bug Fix | Concurrent write stress untested | session modules |

---

### C7: Discovery & Maintenance P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 003-T01 | Discovery | Inaccurate folder total in `memory_stats` summary string | `memory-crud-stats.ts:229` |
| 003-T02 | Discovery | `requestId` missing from health error responses | `memory-crud-health.ts:206,269` |
| 019-T03 | Decisions | Entity extractor Rule-3 regex allows cross-sentence capture | `entity-extractor.ts:69` |

---

### C8: UX Hooks P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 018-T03 | UX Hooks | Mutation hook 5 empty catch blocks need logging | `mutation-hooks.ts:22-58` |
| 018-T04 | UX Hooks | Integration tests for mutation hooks missing | tests |
| 018-T05 | UX Hooks | Mixed outcomes in mutation results | mutation modules |
| 018-T06 | UX Hooks | Deletion metadata incomplete | mutation modules |
| 018-T07 | UX Hooks | Wildcard exports in hooks barrel | `hooks/index.ts:5-7` |
| 018-T08 | UX Hooks | Hook failure details not surfaced | hook modules |
| 018-T09 | UX Hooks | Hint-append failures silenced | context-server modules |
| 018-T10 | UX Hooks | Hooks README misaligned with exports | `hooks/README.md` |

---

### C9: Retrieval Enhancements P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 015-T04 | Retrieval+ | Token-estimate enforcement missing | search modules |
| 015-T05 | Retrieval+ | Wildcard exports in retrieval modules | barrel files |
| 015-T06 | Retrieval+ | Empty catch blocks in retrieval enhancements | search modules |
| 015-T07 | Retrieval+ | Context-server dispatch issues | context-server modules |
| 015-T08 | Retrieval+ | Summary search channel alignment | summary modules |
| 015-T09 | Retrieval+ | Entity linker logging gaps | `entity-linker.ts` |
| 015-T10 | Retrieval+ | Header-overhead calibration drift | search modules |

---

### C10: Feature Flag & Pipeline P1 Fixes

| Task | Phase | Issue | File(s) |
|------|-------|-------|---------|
| 020-T03 | Flags | `MEMORY_DB_DIR`/`MEMORY_DB_PATH` source file mappings stale | `vector-index-store.ts:214-224` |
| 020-T04 | Flags | `EMBEDDINGS_PROVIDER` source mapping wrong | `shared/embeddings/factory.ts:73-103` |
| 020-T05 | Flags | `EMBEDDING_DIM` semantics misrepresented (768-check only, not general override) | `vector-index-store.ts:118-140,156-157` |
| 014-T06 | Pipeline | Chunk ordering wrong source/test tables | pipeline modules |
| 014-T07 | Pipeline | Performance improvements catalog drift | pipeline modules |
| 014-T08 | Pipeline | Activation window persistence tables wrong | pipeline modules |
| 014-T09 | Pipeline | Pipeline hardening tables wrong | pipeline modules |
| 014-T10 | Pipeline | DB_PATH feature tables wrong | pipeline modules |

---

## Wave 3: Cross-Cutting Pattern Fixes

**Goal:** Fix 8 systemic patterns identified in the synthesis report.
**Agents:** 1 GPT 5.4 xhigh + 7 Codex 5.3 xhigh = 8 agents
**Prerequisite:** Waves 1-2 complete

### G1 (GPT 5.4 xhigh via cli-codex): Shared Validation Constants

Extract duplicated validation rules into shared constants consumed by all layers.

| Pattern | Issue | Scope |
|---------|-------|-------|
| `olderThanDays` | JSON `>=1`, Zod `>=0`, handler `<1` — three layers, three rules | `tool-schemas.ts`, `tool-input-schemas.ts`, handler |
| `maxPaths` | Handler 100 vs schema 50 | `memory-ingest.ts`, `tool-input-schemas.ts` |
| `confirmName` | Handler optional vs schema required | `checkpoints.ts`, schemas |
| Memory thresholds | Docs 4GB/512MB vs code 8GB/2GB | `local-reranker.ts` |

**Deliverable:** New `mcp_server/lib/constants/validation.ts` shared constants file, all consumers updated.

---

### C1: Phantom Test File Cleanup

Global find-replace of `retry.vitest.ts` → `retry-manager.vitest.ts` across 30+ feature catalog `.md` files.

**Scope:** All files under `feature_catalog/` referencing `retry.vitest.ts`
**Deliverable:** Zero references to nonexistent `retry.vitest.ts` remain.

---

### C2: Wildcard Barrel Export Conversion

Convert `export * from` to explicit named exports in 10+ barrel files.

| File | Current |
|------|---------|
| `lib/providers/embeddings.ts:9` | `export * from` |
| `lib/scoring/folder-scoring.ts:7` | `export * from` |
| `lib/utils/path-security.ts:7` | `export * from` |
| `lib/search/vector-index.ts:6-10` | `export * from` |
| `lib/errors.ts:7` / `lib/errors/index.ts:4-5` | `export * from` |
| `hooks/index.ts:5-7` | `export * from` |

**Deliverable:** All barrel files use explicit named exports.

---

### C3: Swallowed Catch Block Remediation

Replace silent `catch {}` blocks with structured warning logs in 25+ source files.

| Priority | Files |
|----------|-------|
| Critical | `handlers/mutation-hooks.ts:22-58` (5 empty catches) |
| High | `lib/search/vector-index-queries.ts:552-553` |
| High | `lib/search/vector-index-schema.ts:790-791` |
| High | `lib/eval/eval-db.ts:168-172` |
| Medium | `lib/eval/shadow-scoring.ts:164-166` |
| Medium | `lib/telemetry/consumption-logger.ts` (3 locations) |
| Medium | `lib/storage/access-tracker.ts` |
| Medium | `lib/storage/causal-edges.ts:756-758` |

**Deliverable:** All empty catch blocks replaced with `console.warn` or structured error logging.

---

### C4: Feature Flag Default Comment Alignment

Audit all flag defaults and align module header comments with runtime behavior.

| Flag | Comment Says | Runtime Does |
|------|-------------|--------------|
| `SPECKIT_DOCSCORE_AGGREGATION` | OFF | `isMpabEnabled()` defaults ON |
| `SPECKIT_LEARN_FROM_SELECTION` | OFF | `isLearnedFeedbackEnabled()` defaults ON |
| Folder scoring | disabled | `isFolderScoringEnabled()` graduated ON |
| Reconsolidation | default ON | Requires explicit opt-in |

**Scope:** 8+ module files with stale header comments
**Deliverable:** All module comments match actual runtime defaults.

---

### C5: Placeholder Test Suite Implementation (Group A)

Replace `expect(true).toBe(true)` and `it.skip` with real assertions.

| Test File | Status |
|-----------|--------|
| `tests/memory-save-integration.vitest.ts` | All placeholders |
| `tests/causal-edges.vitest.ts` | Largely placeholder |
| `tests/channel.vitest.ts` | Placeholder stubs |
| `tests/handler-causal-graph.vitest.ts` | Deferred |

---

### C6: Placeholder Test Suite Implementation (Group B)

| Test File | Status |
|-----------|--------|
| `tests/integration-causal-graph.vitest.ts` | Deferred |
| `tests/integration-checkpoint-lifecycle.vitest.ts` | Deferred |
| `tests/handler-session-learning.vitest.ts` | Validation-heavy |
| `tests/search-archival.vitest.ts` | Placeholder |

---

### C7: Feature Catalog Source Table Audit (Group A — Phases 001-010)

Systematic source/test table realignment for 30+ features with wrong file mappings.

**Method per feature:**
1. `grep` for the function/class name to find actual implementation file
2. Update source table in feature `.md` file
3. Verify test file references exist

---

### C8: Feature Catalog Source Table Audit (Group B — Phases 011-020)

Same methodology for remaining 30+ features with source table drift.

---

## Wave 4: P2 Documentation & Test Gap Closure

**Goal:** Close all 60 P2 tasks — test gaps, catalog documentation, playbook mapping.
**Agents:** 1 GPT 5.4 xhigh + 8 Codex 5.3 xhigh = 9 agents
**Prerequisite:** Waves 1-3 complete

### G1 (GPT 5.4 xhigh via cli-codex): Integration Test Design

Design and implement integration test patterns for the most complex subsystems.

| Area | Scope |
|------|-------|
| Pipeline atomicity | End-to-end save-then-index failure scenarios |
| Checkpoint lifecycle | Create → list → restore → delete round-trip |
| Archival with vector cleanup | Full archival + BM25 + vector sync verification |

---

### C1: Retrieval & Mutation P2 Tests

| Task | Issue |
|------|-------|
| 001-T09 | Working-memory tool-result extraction provenance fields |
| 003-T03 | Memory_list handler edge-case test coverage |
| 004-T02 | Startup runtime compatibility guard unit tests |

---

### C2: Lifecycle & Analysis P2 Tests

All stale `retry.vitest.ts` removals and integration test additions for phases 005-006.

---

### C3: Evaluation & Measurement P2 Tests

| Task | Issue |
|------|-------|
| 009-T11 | Ceiling quality tests |
| 009-T12 | Quality-proxy tests |
| 009-T13 | Test quality improvements |
| 009-T14 | Observer overhead tests |

---

### C4: Scoring & Calibration P2 Tests

| Task | Issue |
|------|-------|
| 011-T13 | EffectiveScore fallback chain tests |
| 011-T14 | Normalized ranking tests |
| 011-T15 | Access-tracker integration tests |

---

### C5: Pipeline Architecture P2 Tasks

All stale test reference removals, MPAB default comments, learned feedback flag alignment, channel quality floor, legacy V1 cleanup, Zod validation, dynamic server instructions, embedding retry for phase 014.

---

### C6: Retrieval Enhancements P2 Tests

| Task | Issue |
|------|-------|
| 015-T11 through T17 | Hook-level dispatch, constitutional memory, hierarchy cache, summary integration, batched edge-count, context injection, envelope validation |

---

### C7: UX Hooks P2 Tasks

| Task | Issue |
|------|-------|
| 018-T11 through T17 | Mutation response payloads, atomic duplicate no-op, partial-indexing hints, final token metadata, end-to-end envelope, contract assertions, parse-failure telemetry |

---

### C8: Tooling & Remaining P2 Tasks

Remaining P2 tasks from phases 008, 010, 012, 013, 016, 019, 020.

---

### C9: Playbook Scenario Mapping

Map each of the 178 features to specific manual test playbook scenarios (EX-*/NEW-*) or document the explicit gap.

---

## Wave 5: Verification & Validation

**Goal:** Verify all fixes, run full test suite, validate catalog accuracy.
**Agents:** 1 GPT 5.4 xhigh + 5 Codex 5.3 xhigh = 6 agents
**Prerequisite:** Waves 1-4 complete

### G1 (GPT 5.4 xhigh via cli-codex): Cross-Phase Synthesis Verification

- Re-run the 20-phase audit methodology against all modified files
- Verify all 44 P0 tasks now pass
- Update `synthesis.md` with post-fix status

### C1: Full Test Suite Execution

Run `vitest` across all test files. Verify zero regressions from Wave 1-4 changes.

### C2: Feature Catalog Source Table Verification

Automated verification that every source file listed in every feature catalog entry exists and contains the referenced symbols.

### C3: Feature Flag CI Script Validation

Run the new CI validation script (created in Wave 1, C10) against all flag-reference tables. Verify zero stale mappings.

### C4: Placeholder Test Audit

Grep all test files for `expect(true).toBe(true)` and `it.skip` patterns. Verify Wave 3 eliminated all placeholder assertions.

### C5: Catch Block Audit

Grep all source files for empty `catch` blocks. Verify Wave 3 eliminated all silent error swallowing.

---

## Execution Summary

| Wave | Focus | Agents | Tasks | Prerequisite |
|------|-------|--------|-------|--------------|
| **1** | P0 Critical Code Fixes | 1 GPT + 10 Codex | 44 | None |
| **2** | P1 Behavior Mismatch Fixes | 1 GPT + 10 Codex | 74 | Wave 1 |
| **3** | Cross-Cutting Pattern Fixes | 1 GPT + 7 Codex | ~50 | Waves 1-2 |
| **4** | P2 Documentation & Test Gaps | 1 GPT + 8 Codex | 60 | Waves 1-3 |
| **5** | Verification & Validation | 1 GPT + 5 Codex | — | Waves 1-4 |
| **Total** | | **5 GPT + 40 Codex** | **178+** | |

### Dispatch Commands

**GPT 5.4 xhigh (cli-codex):**
```bash
codex --model gpt-5.4 --effort xhigh "Depth: 1 | LEAF NESTING CONSTRAINT | [prompt]"
```

**Codex 5.3 xhigh (cli-copilot):**
```bash
copilot -p "[prompt]" --model gpt-5.3-codex --allow-all-tools --no-ask-user 2>&1
```

### File Conflict Prevention

Each agent assignment is designed so agents within the same wave do NOT modify the same files. When unavoidable (e.g., `channel.vitest.ts` touched by C2 and C4 in Wave 1), the later agent appends tests rather than overwriting.

### Progress Tracking

After each wave:
1. Verify all agent outputs via `find ... -name "*.ts" -newer [wave-start-marker]`
2. Run `vitest --run` to catch regressions
3. Update per-phase `tasks.md` status from `TODO` to `DONE`
4. Commit wave results as single commit: `fix(spec-kit): W[N] [summary]`

---

*Generated from 20-phase feature-centric code audit. 178 tasks, 44 P0, 74 P1, 60 P2. 2026-03-10.*
