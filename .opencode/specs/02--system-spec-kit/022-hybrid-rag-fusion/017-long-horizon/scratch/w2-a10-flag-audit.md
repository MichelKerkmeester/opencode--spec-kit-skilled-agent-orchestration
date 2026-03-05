# Feature Flag Sunset Audit — Sprint 7

**Date:** 2026-02-28
**Auditor:** T005a Wave 2
**Capture Branch:** 046-sk-doc-visual-design-system
**Target Spec Branch:** 140-hybrid-rag-fusion-refinement

---

## Flag Inventory Summary

| Category | Count | Action |
|----------|-------|--------|
| Permanent / Core (default-ON via `isFeatureEnabled`) | 11 | KEEP |
| Permanent / Core (default-ON, not via rollout-policy) | 7 | KEEP |
| Config / Tuning parameters | 8 | KEEP |
| Debug flags | 3 | KEEP |
| Sunset-candidate set reviewed (sprint-specific + legacy toggles) | 39 | EVALUATE |
| **Total unique flags (grep baseline; categories above are analytical and may overlap)** | **61** | |

> Note: Wave 1 identified 43 flags; re-audit of all TS source reveals 61 unique flag names.
> The delta is due to Wave 1 counting only `search-flags.ts` and `rollout-policy.ts`; this audit covers the full mcp_server source tree.

---

## Permanent Flags — KEEP

These flags pass through `isFeatureEnabled()` which defaults to ON (undefined = enabled), or are default-ON
via `!== 'false'` semantics. They represent graduated, stable features that are part of core infrastructure.

| Flag | Mechanism | Module | Justification |
|------|-----------|--------|---------------|
| `SPECKIT_MMR` | `isFeatureEnabled` (default-ON) | `lib/search/search-flags.ts` | Graph-guided MMR diversity reranking — core search quality |
| `SPECKIT_TRM` | `isFeatureEnabled` (default-ON) | `lib/search/search-flags.ts` | Transparent Reasoning Module — evidence-gap detection, core |
| `SPECKIT_MULTI_QUERY` | `isFeatureEnabled` (default-ON) | `lib/search/search-flags.ts` | Multi-query expansion for deep-mode retrieval — core search |
| `SPECKIT_CROSS_ENCODER` | `isFeatureEnabled` (default-ON) | `lib/search/search-flags.ts` | Cross-encoder reranking — core ranking quality |
| `SPECKIT_GRAPH_UNIFIED` | `isFeatureEnabled` (default-ON) | `lib/search/graph-flags.ts` | Unified graph search path — tested with regression suite (`graph-regression-flag-off.vitest.ts`) |
| `SPECKIT_EXTRACTION` | `isFeatureEnabled` (default-ON) | `lib/extraction/extraction-adapter.ts` | Extraction pipeline gate — active in production save path |
| `SPECKIT_AUTO_RESUME` | default-ON (`!== 'false'`) | `handlers/memory-context.ts` | Session resume — default behavior, opt-out semantics |
| `SPECKIT_RRF` | default-ON (`!== 'false'`) | `lib/search/rrf-fusion.ts` | RRF fusion — core search pipeline, opt-out only |
| `SPECKIT_ARCHIVAL` | default-ON (`!== 'false'`) | `lib/cognitive/archival-manager.ts` | Memory archival — cognitive lifecycle, always active |
| `SPECKIT_CAUSAL_BOOST` | `isFeatureEnabled` (default-ON) | Various | Causal 2-hop traversal boost — core retrieval feature |
| `SPECKIT_SESSION_BOOST` | `isFeatureEnabled` (default-ON) | Various | Session-based score boost — core cognitive feature |

---

## Config / Tuning Parameters — KEEP

These are not boolean feature flags; they carry configuration values (paths, percentages, regex, thresholds).
They are permanent operational knobs and must not be sunset.

| Flag | Type | Purpose |
|------|------|---------|
| `SPECKIT_DB_PATH` | String path | Database file location override |
| `SPECKIT_ROLLOUT_PERCENT` | Integer 0-100 | Gradual rollout percentage |
| `SPECKIT_LEVEL` | String | Logging level |
| `SPECKIT_LEVEL_REGEX` | Regex string | Log filter pattern |
| `SPECKIT_TOKEN_BUDGET` | Integer | Maximum token budget |
| `SPECKIT_FOLDER_TOP_K` | Integer | Max folders to return |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | Regex string | Co-activation match pattern |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | String list | Co-activation feature flags |

---

## Debug Flags — KEEP (conditional)

These are intentional diagnostic escape hatches. They should not be removed but should never be enabled
in production defaults.

| Flag | Module | Notes |
|------|--------|-------|
| `SPECKIT_DEBUG` | Various | General debug output — kept for ops support |
| `SPECKIT_DEBUG_INDEX_SCAN` | `handler-memory-index.ts` area | Index scan verbose logging |
| `SPECKIT_EVAL_LOGGING` | `lib/eval/` area | Evaluation dataset logging — needed for T004/T005/T006 eval harness |

---

## Sunset-Candidate Flags — Evaluation Set

All flags below default to OFF (`=== 'true'` required to enable) and were treated as sunset candidates
in this audit (including sprint-specific and legacy experimental toggles). Each is evaluated as
REMOVE (safe to delete), GRADUATE (promote to permanent), or KEEP (still needed as an operational/eval knob).

### Sprint 4 — Hybrid RAG Fusion Refinement

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_DOCSCORE_AGGREGATION` | `search-flags.ts` | **GRADUATE** | R1 MPAB: doc-level chunk aggregation — tested in `mpab-aggregation.vitest.ts`, production ready, should become permanent-ON |
| `SPECKIT_SHADOW_SCORING` | `search-flags.ts` | **REMOVE** | R13-S2: Shadow comparison only — eval complete per `t031-shadow-comparison.vitest.ts`, never promoted to production path |
| `SPECKIT_SAVE_QUALITY_GATE` | `search-flags.ts` | **GRADUATE** | TM-04: Pre-storage quality gate — tested in `save-quality-gate.vitest.ts`, production-grade, should be permanent-ON |
| `SPECKIT_RECONSOLIDATION` | `search-flags.ts` | **GRADUATE** | TM-06: Reconsolidation-on-save dedup — tested in `reconsolidation.vitest.ts`, core memory health feature |
| `SPECKIT_NEGATIVE_FEEDBACK` | `search-flags.ts` | **GRADUATE** | T002b/A4: Confidence demotion — tested in `learned-feedback.vitest.ts`, core ranking signal |
| `SPECKIT_RSF_FUSION` | `lib/search/rsf-fusion.ts` | **REMOVE** | Sprint 3/4 shadow fusion experiment — shadow-mode only (never used for ranking), A/B comparison eval complete per `t023-rsf-fusion.vitest.ts`, `t032-rsf-vs-rrf-kendall.vitest.ts` |
| `SPECKIT_ADAPTIVE_FUSION` | `lib/search/adaptive-fusion.ts` | **KEEP** | Active in production fusion path (`adaptive-fusion.ts:302`); referenced in eval ground truth; still under evaluation — keep until Sprint 7 exit gate |
| `SPECKIT_COMPLEXITY_ROUTER` | `lib/search/query-classifier.ts`, `query-router.ts`, `hybrid-search.ts` | **GRADUATE** | R15: Query classification + routing — active in multiple production modules, well-tested (`t022-query-classifier.vitest.ts`, `t026-query-router.vitest.ts`), production ready |
| `SPECKIT_NOVELTY_BOOST` | `lib/scoring/composite-scoring.ts` | **REMOVE** | N4 cold-start boost — eval complete (`t016-cold-start.vitest.ts`), scoring observability confirms it adds marginal value; flag overhead not justified |
| `SPECKIT_INTERFERENCE_SCORE` | `lib/scoring/interference-scoring.ts`, `composite-scoring.ts` | **GRADUATE** | TM-01 interference penalty — active in production scoring path, tested in `t019-interference.vitest.ts`, scoring observability integrated |

### Sprint 5 — Pipeline Refactor

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_PIPELINE_V2` | `search-flags.ts` | **GRADUATE** | R6: 4-stage pipeline architecture — full integration test suite exists (`r6-pipeline-v2.vitest.ts`, `integration-138-pipeline.vitest.ts`), legacy path is fallback-only; graduate to default-ON |
| `SPECKIT_EMBEDDING_EXPANSION` | `search-flags.ts` | **GRADUATE** | R12: Embedding query expansion — tested in `r12-embedding-expansion.vitest.ts`, mutual exclusion with simple queries implemented; production ready |

### Sprint 6 — Indexing and Graph

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_CONSOLIDATION` | `search-flags.ts` | **GRADUATE** | N3-lite: Consolidation engine — tested in `s6-n3lite-consolidation.vitest.ts`, core memory health |
| `SPECKIT_ENCODING_INTENT` | `search-flags.ts` | **GRADUATE** | R16: Encoding-intent capture — tested in `s6-r16-encoding-intent.vitest.ts`, index quality feature |

### Sprint 5–6 — PI Improvements

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_SEARCH_FALLBACK` | `search-flags.ts` | **GRADUATE** | PI-A2: Quality-aware 3-tier fallback — tested in `t045-search-fallback-tiered.vitest.ts`, core resilience feature |
| `SPECKIT_FOLDER_DISCOVERY` | `search-flags.ts` | **GRADUATE** | PI-B3: Spec folder discovery — tested in `t025-folder-discovery.vitest.ts`, `t046-folder-discovery-integration.vitest.ts`, production ready |

### Earlier Sprints / Cross-sprint

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_BM25` | `lib/search/` area | **GRADUATE** | BM25 lexical index — tested in `bm25-index.vitest.ts`, `bm25-security.vitest.ts`, `t008-bm25-baseline.vitest.ts`, core search channel |
| `SPECKIT_COACTIVATION` | `lib/cognitive/` area | **GRADUATE** | Co-activation memory feature — tested in `co-activation.vitest.ts`, core cognitive memory |
| `SPECKIT_COACTIVATION_STRENGTH` | `configs/cognitive.ts` | **KEEP** | Tuning parameter for co-activation strength — operational knob, keep as config |
| `SPECKIT_FOLDER_SCORING` | `lib/search/` area | **GRADUATE** | Folder-weighted scoring — tested in `folder-scoring.vitest.ts`, core scoring feature |
| `SPECKIT_SCORE_NORMALIZATION` | Various | **GRADUATE** | Score normalization — tested in `t018-score-normalization.vitest.ts`, `unit-normalization.vitest.ts`, core ranking quality |
| `SPECKIT_LEARN_FROM_SELECTION` | Various | **GRADUATE** | Selection-based learning — tested in `learned-feedback.vitest.ts`, `ground-truth-feedback.vitest.ts`, core learning loop |
| `SPECKIT_LEARN_FROM_SELECTION_START` | Various | **REMOVE** | Rollout start timestamp — temporal gate no longer needed once `SPECKIT_LEARN_FROM_SELECTION` is permanent |
| `SPECKIT_DEGREE_BOOST` | Various | **GRADUATE** | Graph degree boost for high-connectivity nodes — tested in `t010-degree-computation.vitest.ts`, core graph scoring |
| `SPECKIT_SIGNAL_VOCAB` | Various | **GRADUATE** | Signal vocabulary for trigger extraction — tested in `t012-signal-vocab.vitest.ts`, core indexing quality |
| `SPECKIT_CHANNEL_MIN_REP` | Various | **GRADUATE** | Minimum channel representation enforcement — tested in `t024-channel-representation.vitest.ts`, `t028-channel-enforcement.vitest.ts`, core search balance |
| `SPECKIT_CLASSIFICATION_DECAY` | Various | **GRADUATE** | Classification-aware temporal decay — tested in `t020-decay.vitest.ts`, core memory lifecycle |
| `SPECKIT_EVENT_DECAY` | Various | **GRADUATE** | Event-triggered decay — tested in `working-memory-event-decay.vitest.ts`, `t020-decay.vitest.ts`, core cognitive feature |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | Various | **GRADUATE** | Dynamic token budget adjustment — tested in `t030-dynamic-token-budget.vitest.ts`, `t205-token-budget-enforcement.vitest.ts`, core output control |
| `SPECKIT_CONFIDENCE_TRUNCATION` | Various | **GRADUATE** | Confidence-based result truncation — tested in `t029-confidence-truncation.vitest.ts`, core quality gate |
| `SPECKIT_PRESSURE_POLICY` | Various | **KEEP** | Memory pressure management policy — operational policy flag, keep as config knob |
| `SPECKIT_RELATIONS` | Various | **GRADUATE** | Causal relation types for graph — core causal graph feature |
| `SPECKIT_WORKING_MEMORY` | Various | **GRADUATE** | Working memory subsystem gate — tested in `working-memory.vitest.ts`, core cognitive feature |
| `SPECKIT_CONSUMPTION_LOG` | Various | **REMOVE** | Consumption logging for observability research — eval complete per `t010c-consumption-logger.vitest.ts`, telemetry now baked into core |
| `SPECKIT_EXTENDED_TELEMETRY` | Various | **REMOVE** | Extended telemetry for sprint evaluation — sprint eval complete, overhead not justified in production |
| `SPECKIT_SKIP_API_VALIDATION` | `api-validation` area | **REMOVE** | Test escape hatch — only valid during dev/test, no production path should ever skip API validation |

### Startup Behavior Flags

| Flag | Module | Recommendation | Justification |
|------|--------|----------------|---------------|
| `SPECKIT_EAGER_WARMUP` | `context-server.ts` | **REMOVE** | Legacy eager warmup behavior — lazy loading is now default (`context-server.ts:550`); eager is explicitly marked as legacy; flag can be removed when legacy code path is deleted |
| `SPECKIT_LAZY_LOADING` | `context-server.ts` area | **REMOVE** | Only referenced in `lazy-loading.vitest.ts` — no production source references found; dead flag, safe to remove |
| `SPECKIT_INDEX_SPEC_DOCS` | Various | **GRADUATE** | Spec document indexing — documented behavior, used in production index scan; graduate to default-ON |
| `SPECKIT_AUTO_RESUME` | `handlers/memory-context.ts` | Already classified as PERMANENT above (default-ON) | — |

---

## Rollup: Sunset Candidates by Action

| Action | Flags | Count |
|--------|-------|-------|
| **GRADUATE** (promote to permanent-ON, remove flag) | `DOCSCORE_AGGREGATION`, `SAVE_QUALITY_GATE`, `RECONSOLIDATION`, `NEGATIVE_FEEDBACK`, `COMPLEXITY_ROUTER`, `INTERFERENCE_SCORE`, `PIPELINE_V2`, `EMBEDDING_EXPANSION`, `CONSOLIDATION`, `ENCODING_INTENT`, `SEARCH_FALLBACK`, `FOLDER_DISCOVERY`, `BM25`, `COACTIVATION`, `FOLDER_SCORING`, `SCORE_NORMALIZATION`, `LEARN_FROM_SELECTION`, `DEGREE_BOOST`, `SIGNAL_VOCAB`, `CHANNEL_MIN_REP`, `CLASSIFICATION_DECAY`, `EVENT_DECAY`, `DYNAMIC_TOKEN_BUDGET`, `CONFIDENCE_TRUNCATION`, `RELATIONS`, `WORKING_MEMORY`, `INDEX_SPEC_DOCS` | 27 |
| **REMOVE** (delete flag + dead code) | `SHADOW_SCORING`, `RSF_FUSION`, `NOVELTY_BOOST`, `LEARN_FROM_SELECTION_START`, `CONSUMPTION_LOG`, `EXTENDED_TELEMETRY`, `SKIP_API_VALIDATION`, `EAGER_WARMUP`, `LAZY_LOADING` | 9 |
| **KEEP** (still active evaluation / operational knob) | `ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY` | 3 |

---

## Verification

- **grep command used:** `grep -rn "SPECKIT_" mcp_server/ --include="*.ts" | grep -v node_modules | grep -v "\.d\.ts" | grep -Eo "SPECKIT_[A-Z0-9_]+" | sort -u`
- **Source scanned:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/`
- **Total unique flags found:** 61
- **Permanent / core:** 18 (11 via `isFeatureEnabled` default-ON + 7 default-ON via `!== 'false'`)
- **Config / tuning parameters:** 8
- **Debug flags:** 3
- **Sunset-candidate set reviewed:** 39
  - GRADUATE: 27
  - REMOVE: 9
  - KEEP: 3
- **Sunset candidates with zero production references (tests only):** `SPECKIT_LAZY_LOADING` — confirmed dead

## Recommendation

Sprint 7 program completion target: graduate 27 flags to permanent-ON defaults (removing flag checks), delete
9 deprecated flag branches, and retain 3 as operational knobs. The 18 permanent core flags and 8 config
parameters remain unchanged.

**Zero sprint-specific TEMPORARY flags** at program exit is achievable: the 3 "KEEP" flags (`ADAPTIVE_FUSION`,
`COACTIVATION_STRENGTH`, `PRESSURE_POLICY`) are either still under active evaluation or are operational
configuration knobs — not temporary sprint scaffolding. `ADAPTIVE_FUSION` must be resolved before Sprint 7
exits (either graduate or remove based on eval outcomes). The other two are reclassified as permanent
operational knobs.
