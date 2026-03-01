---
title: "Implementation Summary: Sprint 7 — Long Horizon"
description: "Sprint 7 implementation summary: R13-S3 ablation framework + reporting dashboard, S1 content normalization, R5 NO-GO decision, feature flag audit, DEF-014 closure"
# SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2
trigger_phrases:
  - "sprint 7 implementation"
  - "sprint 7 summary"
  - "long horizon implementation"
  - "ablation framework implementation"
  - "content normalizer implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Sprint 7 — Long Horizon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

## Overview

Sprint 7 implemented the final phase (Phase 8 of 8) of the Hybrid RAG Fusion Refinement specification (Spec 140). Scope followed the "minimum viable+" scenario: R13-S3 full reporting + ablation studies (P1 mandatory), S1 smarter content generation, R5 INT8 decision (NO-GO), feature flag sunset audit (T005a), DEF-014 structuralFreshness closure, and PageIndex cross-reference review. R8 memory summaries and S5 cross-document entity linking were skipped per scale gate evaluation.

**Schema version**: 18 (unchanged from Sprint 6a) | **New tests**: 149 | **Files created**: 6 | **Files modified**: 2

---

## Changes Made

### T004: R13-S3 Full Reporting + Ablation Studies (P1 — Required)

**File created:** `mcp_server/lib/eval/ablation-framework.ts` (~290 LOC)

- `runAblation(searchFn, config)`: Dependency-injected search function, runs baseline then per-channel-disabled variants
- `toHybridSearchFlags(disabled)`: Maps disabled channel set to feature flag overrides
- Sign test statistical significance (exact binomial distribution) with verdict classification: CRITICAL / important / likely useful / negligible / likely redundant / possibly harmful / HARMFUL
- `storeAblationResults(report)`: Persists to `eval_metric_snapshots` with negative timestamp IDs for ablation runs
- `formatAblationReport(report)`: Markdown-formatted ablation report
- Feature flag: `SPECKIT_ABLATION=true` (default OFF)
- Fail-safe: try-catch wrapping all channel ablation, partial results on individual channel failure

**File created:** `mcp_server/lib/eval/reporting-dashboard.ts` (~290 LOC)

- `generateDashboardReport(config?)`: Aggregates per-sprint and per-channel metrics from `eval_metric_snapshots`
- `formatReportText(report)` / `formatReportJSON(report)`: Text and JSON output formats
- Types: `ReportConfig`, `MetricSummary`, `SprintReport`, `TrendEntry`, `DashboardReport`
- Sprint label derived from `metadata` JSON column in eval DB
- `isHigherBetter()` helper for trend direction (recall/precision/ndcg = higher-better; latency = lower-better)
- Read-only module: queries eval DB, no writes

**Test files:**
- `tests/s7-ablation-framework.vitest.ts` — 39 tests
- `tests/s7-reporting-dashboard.vitest.ts` — 34 tests

**Design decisions:**
- Ablation uses dependency injection for search function (testable without full pipeline)
- Sign test chosen over t-test for robustness with small query sets
- Negative timestamp IDs distinguish ablation runs from production eval runs
- Channel set: `ALL_CHANNELS = ['vector', 'bm25', 'fts5', 'graph', 'trigger']` — trigger is caller-gated because trigger matching runs outside `hybridSearch`
- R13-S3 acceptance criterion: ablation framework can isolate contribution of at least 1 individual channel — MET

### T002: S1 Smarter Memory Content Generation

**File created:** `mcp_server/lib/parsing/content-normalizer.ts` (~230 LOC)

- **7 primitives**: `stripYamlFrontmatter`, `stripAnchors`, `stripHtmlComments`, `stripCodeFences`, `normalizeMarkdownTables`, `normalizeMarkdownLists`, `normalizeHeadings`
- **2 composites**: `normalizeContentForEmbedding(content)`, `normalizeContentForBM25(content)`
- Pipeline order: frontmatter → anchors → HTML comments → code fences → tables → lists → headings → whitespace collapse
- Pure TypeScript, zero external dependencies
- No feature flag — always active (normalization is non-destructive improvement)

**Files modified:**
- `mcp_server/handlers/memory-save.ts` — Added `normalizeContentForEmbedding()` call before `generateDocumentEmbedding()` in embedding cache-miss branch (~line 1095-1099)
- `mcp_server/lib/search/bm25-index.ts` — Added `normalizeContentForBM25()` call before BM25 tokenization (~line 248-250)

**Test file:** `tests/s7-content-normalizer.vitest.ts` — 76 tests

**Design decisions:**
- Separate composites for embedding vs BM25: embedding strips more aggressively (removes code blocks), BM25 preserves structure for lexical matching
- Idempotent: running normalization twice produces same output
- Safety: never returns empty string from non-empty input

### T005: R5 INT8 Quantization Evaluation (NO-GO)

**Decision**: NO-GO — all three activation criteria unmet.

| Criterion | Threshold | Measured | Status |
|-----------|-----------|----------|--------|
| Active memories with embeddings | >10,000 | 2,412 | NOT MET (24.1%) |
| p95 search latency | >50ms | ~15ms | NOT MET (~30%) |
| Embedding dimensions | >1,536 | 1,024 | NOT MET (66.7%) |

**Rationale**: 7.1 MB storage savings (3.9% of 180 MB total DB) does not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. No memory or latency pressure exists.

**Re-evaluate when**: corpus grows ~4x (>10K memories), sustained p95 >50ms, or embedding provider changes to >1,536 dimensions.

### T005a: Feature Flag Sunset Audit

**61 unique SPECKIT_ flags** found across the codebase.

**Disposition rollup from the sunset-candidate set (see `scratch/w2-a10-flag-audit.md`):**

- GRADUATE: 27
- REMOVE: 9
- KEEP: 3

> Note: the disposition counts apply to the explicit sunset-candidate set (sprint-specific + legacy experimental toggles), not a strict partition of all 61 unique flags.

**Verification**: `grep -rn "SPECKIT_" mcp_server/ --include="*.ts" | grep -v node_modules`

**Key recommendations**: 27 flags are ready to graduate to permanent-ON defaults (removing flag checks). 9 flags are identified as dead code for removal. 3 flags remain active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`). Full audit in `scratch/w2-a10-flag-audit.md`.

### T006a: DEF-014 structuralFreshness() Disposition

**Disposition**: CLOSED — concept dropped, never implemented as code.

Zero references to `structuralFreshness` exist anywhere in the codebase. The function appears exclusively in spec and planning documents as a deferred design concept from the parent spec. No code to remove or modify.

### T001: R8 Memory Summaries — SKIPPED

**Scale gate result**: 2,411 active memories with embeddings < 5,000 threshold.
Query: `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`
Decision: Skip T001 entirely per gating condition.
Note: R8 gate captured 2,411; later R5 captured 2,412 after one additional successful embedding was indexed.

### T003: S5 Cross-Document Entity Linking — SKIPPED

**Scale gate**: 2,411 memories > 1,000 threshold — technically MET.
**Entity gate**: Zero entities exist in the system — R10 auto entity extraction (Sprint 6b) was never built (entire Sprint 6b deferred). No entity catalog, no entity extraction code.
Decision: Skip T003 — no entities to link regardless of memory count.

### T-PI-S7: PageIndex Cross-References — Reviewed

- **PI-A5 (verify-fix-verify)**: Existing R13-S3 eval infrastructure already provides the "verify" phase; the reporting dashboard adds per-sprint trend detection. No new implementation needed.
- **PI-B1 (tree thinning)**: Already implemented in Sprint 5 (`chunk-thinning.ts` from Sprint 6a). No new code needed for Sprint 7.

---

## Feature Flag Inventory

| Flag | Sprint | Default | Status |
|------|--------|---------|--------|
| SPECKIT_MMR | 0 | ON | Keep — core pipeline |
| SPECKIT_TRM | 0 | ON | Keep — core pipeline |
| SPECKIT_MULTI_QUERY | 0 | ON | Keep — core pipeline |
| SPECKIT_CROSS_ENCODER | 0 | ON | Keep — core pipeline |
| SPECKIT_SEARCH_FALLBACK | 3 | OFF | GRADUATE — promote to ON |
| SPECKIT_FOLDER_DISCOVERY | 3 | OFF | GRADUATE — promote to ON |
| SPECKIT_DOCSCORE_AGGREGATION | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_SHADOW_SCORING | 4 | OFF | REMOVE — eval complete |
| SPECKIT_SAVE_QUALITY_GATE | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_RECONSOLIDATION | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_NEGATIVE_FEEDBACK | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_PIPELINE_V2 | 5 | OFF | GRADUATE — promote to ON |
| SPECKIT_EMBEDDING_EXPANSION | 5 | OFF | GRADUATE — promote to ON |
| SPECKIT_CONSOLIDATION | 6 | OFF | GRADUATE — promote to ON |
| SPECKIT_ENCODING_INTENT | 6 | OFF | GRADUATE — promote to ON |
| SPECKIT_ABLATION | 7 | OFF | NEW — R13-S3 ablation |

**Default active**: 4 (Sprint 0 core) + 1 new. **Threshold**: <=6 MET.

---

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| s7-ablation-framework | 39 | PASS |
| s7-reporting-dashboard | 34 | PASS |
| s7-content-normalizer | 76 | PASS |
| **Sprint 7 total** | **149** | **ALL PASS** |

---

## Issues Resolved

1. **S1 integration ordering**: Content normalization must occur before both embedding generation and BM25 indexing. Wired into two separate code paths: `memory-save.ts` (embedding) and `bm25-index.ts` (BM25).
2. **R10 dependency gap (S5)**: Sprint 6b entity extraction was never built, leaving zero entities in the system. S5 correctly identified as unskippable despite memory count gate being met.
3. **R5 recall discrepancy**: Spec 140 mentions 1-2% recall loss for INT8, but research document cites 5.32% (HuggingFace benchmark on e5-base-v2 768-dim). Discrepancy unresolved (OQ-002) — contributes to NO-GO decision.

---

## Scope Decisions

| Task | Decision | Rationale |
|------|----------|-----------|
| T001 (R8) | SKIPPED | 2,411 < 5,000 memories threshold |
| T002 (S1) | COMPLETED | Content normalizer with 76 tests |
| T003 (S5) | SKIPPED | Zero entities (R10 never built) |
| T004 (R13-S3) | COMPLETED | Ablation + reporting, 73 tests |
| T005 (R5) | NO-GO | All 3 criteria unmet |
| T005a (Flags) | COMPLETED | 61 flags audited |
| T006a (DEF-014) | CLOSED | Never implemented |
| T-PI-S7 | REVIEWED | Existing infra sufficient |

**Scenario executed**: Minimum viable+ (R13-S3 + S1 + decisions + audit) — 16-22h estimated effort range.

---

## Deferred (None — Final Sprint)

Sprint 7 is the final sprint. No successor sprint exists. Items deferred from Sprint 7:
- **R8 (T001)**: Activates when active-with-embeddings count exceeds 5,000
- **S5 (T003)**: Activates when entity infrastructure (R10) is built and >50 verified entities exist
- **R5 (T005)**: Re-evaluate when >10K memories OR >50ms latency OR >1,536 dimensions
- **Flag graduation (T005a)**: 27 flags recommended for graduation, 9 for removal — execution deferred to separate maintenance task

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
- **Decisions**: See `scratch/w2-a9-decisions.md`
- **Flag Audit**: See `scratch/w2-a10-flag-audit.md`
- **R5 Analysis**: See `scratch/w1-a5-r5-decision.md`
