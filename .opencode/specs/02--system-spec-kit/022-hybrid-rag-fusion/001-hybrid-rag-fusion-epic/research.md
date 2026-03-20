---
title: "Deep Research: Hybrid RAG Fusion System -- Comprehensive Analysis"
description: "20-iteration multi-agent deep research campaign analyzing the hybrid-rag-fusion retrieval pipeline: architecture, scoring, automation, bugs, dead code, and alignment with sk-code--opencode and sk-doc standards. 25 prioritized recommendations across 7 categories."
trigger_phrases:
  - "hybrid"
  - "rag"
  - "fusion"
  - "pipeline"
  - "scoring"
  - "retrieval"
  - "deep research"
  - "analysis"
importance_tier: "critical"
contextType: "research"
---
# Deep Research: Hybrid RAG Fusion System -- Comprehensive Analysis

20-iteration multi-agent deep research campaign analyzing the 4-stage retrieval pipeline powering Spec Kit Memory's 32 MCP tools.

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
<!-- DEEP_RESEARCH_SESSION: 2026-03-20 | 20 iterations | 3 agents/iteration -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Research ID** | DR-022-001 |
| **Topic** | Comprehensive hybrid-rag-fusion system analysis |
| **Status** | COMPLETE |
| **Date Started** | 2026-03-20 |
| **Date Completed** | 2026-03-20 |
| **Researcher(s)** | Claude Opus 4.6 (orchestrator), GPT-5.4 via Codex CLI (A1), GPT-5.4 via Copilot CLI (A2), Claude Opus (native @deep-research, A3) |
| **Methodology** | 20-iteration autonomous deep research loop with 3-agent triangulation per iteration |
| **Last Updated** | 2026-03-20 |
| **System Size** | 511 TypeScript files, ~190,637 LOC, 28 lib/ subdirectories |
| **Prior Research** | R-138-003 (Skill Graph integration), 006-hybrid-rag-fusion-logic-improvements |

**Related Documents**:
- Epic spec: [spec.md](spec.md)
- Prior research: [research/](research/) (historical, pre-consolidation)
- Iteration files: [scratch/iteration-001.md](scratch/iteration-001.md) through [scratch/iteration-020.md](scratch/iteration-020.md)
- Ultra-think review: [scratch/ultra-think-review.md](scratch/ultra-think-review.md)

---

## 2. INVESTIGATION REPORT

### Request Summary

Investigate the hybrid-rag-fusion system -- a 4-stage retrieval pipeline with 5 search channels, 12 scoring steps, and 32 MCP tools -- to find improvements in logic, structure, architecture, automation, UX, bugs, and misalignments with sk-code--opencode and sk-doc standards. The epic is 78.9% complete (S0-S3 done, S4-S9 pending) with 80K+ lines of spec documentation.

### Key Findings (Top 10)

1. **Three divergent score resolution chains** (CONFIRMED): Three functions resolve "final score" with different field precedence and scale handling. Latent ranking inconsistency on error paths. [iter-1, 2, 14, 18]
2. **Zero orchestrator error handling** (CONFIRMED): The 79-line orchestrator calls 4 stages with bare `await`. No try/catch, no timeout, no partial-result fallback. Any stage throw crashes the entire pipeline. [iter-1, 6, 18]
3. **Three conflicting channel weight systems**: hybrid-search.ts, adaptive-fusion.ts, and rrf-fusion.ts each implement different weighting. `FusionWeights.graphWeight` is declared, set in 7 intent profiles, but never consumed. [iter-5, 16]
4. **81 feature flags with no governance** (MODIFIED upward from 76): No central registry, no sunset dates, no expiry. Three distinct flag semantics undocumented. 12 legacy HYDRA_* aliases. [iter-7, 18]
5. **5 search channels, not 4 as documented** (CONFIRMED): types.ts:185 explicitly lists FTS5, semantic, trigger, graph, co-activation. Spec documents only 4. [iter-3, 4, 14, 18]
6. **28 warn-and-continue catch blocks in pipeline**: No distinction between "feature off" and "feature crashed." Silent quality degradation is the dominant failure mode. [iter-6]
7. **Eval measures but cannot calibrate**: 30+ hardcoded scoring constants with no data-driven calibration mechanism. Ablation results go to DB but nothing reads them back. [iter-2, 8]
8. **31-parameter memory_search with no simple variant** (MODIFIED upward from 28): Includes duplicate `minQualityScore`/`min_quality_score`. Major UX burden. [iter-11, 18]
9. **BM25 N+1 query pattern**: Each result triggers an individual `SELECT spec_folder` inside a `.filter()` loop. 50 results = 50 queries. [iter-13]
10. **9 dead code items across pipeline**: Dormant 5-factor model, shadow-only RSF fusion, dead `applyIntentWeights` export, dead `GRAPH_WEIGHT_BOOST`, unused `temporal-contiguity.ts`, vestigial `PIPELINE_V2` flag, dead confidence field. [iter-3, 4, 5, 7, 10, 12]

### Primary Recommendation

**Unify score resolution, harden the orchestrator, and add signal failure discrimination.** These three changes (A1, B1, B6 in the recommendation catalog) address the most critical correctness and resilience gaps with moderate effort and immediate impact. Sprint 1 estimate: 3 days.

### Cross-Validation Summary

Iteration 18 independently re-verified the top 10 findings with fresh code traces:
- **Confirmed**: 6 (score chains, hardcoded constants, zero orchestrator error handling, 5 channels, dormant 5-factor, dead applyIntentWeights)
- **Modified**: 3 (flag count 76→81, param count 28→31, FSRS race location corrected)
- **Refuted**: 1 (embedding cache correctly uses compound PK `(content_hash, model_id)` -- original cache-key bug claim was incorrect)

**Research quality: 9 of 10 findings survived cross-validation.** The refuted finding (embedding cache) was removed from all recommendations.

---

## 3. EXECUTIVE OVERVIEW

### Executive Summary

This research campaign conducted 20 systematic iterations across the hybrid-rag-fusion retrieval pipeline, a 190K LOC TypeScript system powering Spec Kit Memory's 32 MCP tools. Each iteration dispatched up to 3 AI agents (Codex/GPT-5.4, Copilot/GPT-5.4, native Claude Opus) for multi-perspective analysis, with findings externalized to files for cross-iteration continuity.

The campaign answered 18 research questions spanning pipeline architecture, scoring calibration, graph channel status, error handling, feature flags, eval infrastructure, save pipeline quality, developer UX, query intelligence, performance hot paths, test coverage, and spec-vs-code alignment. It produced **25 prioritized recommendations across 7 categories** (bugs, architecture, dead code, documentation, automation, performance, testing) with a sprint-level implementation roadmap.

The pipeline's strengths are: excellent type safety with compile-time + runtime invariants, mature graph subsystem (not dead code as suspected), robust 3-layer save dedup, production-ready session/shared-space features, and a structurally complete eval/ablation framework. Its weaknesses are: zero orchestrator error handling, three conflicting weight systems, 81 ungoverned feature flags, silent quality degradation from 28 catch-and-continue blocks, and no mechanism to feed eval results back into scoring calibration.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HYBRID-RAG-FUSION PIPELINE                       │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐    │
│  │ STAGE 1  │──▶│ STAGE 2  │──▶│ STAGE 3  │──▶│   STAGE 4    │    │
│  │Candidate │   │ Fusion & │   │ Rerank & │   │  Filter &    │    │
│  │Generation│   │ Scoring  │   │Aggregate │   │  Annotate    │    │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └──────┬───────┘    │
│       │              │              │                 │             │
│  5 Channels:    12 Steps:      MMR Diversity    Score Snapshot      │
│  • Vector       • Session      Cross-Encoder    Archive Filter      │
│  • BM25         • Causal       Dedup            Constitutional      │
│  • FTS5         • Co-activ.    Ranking          Immutability ✓      │
│  • Graph        • FSRS                                              │
│  • Co-activ.    • Intent wt                                         │
│                 • Feedback                                           │
│                 • Anchors                                            │
│                 • Validation                                         │
│                                                                     │
│  ┌─────────────────────────┐   ┌────────────────────────────────┐  │
│  │   ORCHESTRATOR (79 LOC) │   │  COGNITIVE SUBSYSTEM (11 mod)  │  │
│  │  ⚠️ Zero error handling  │   │  FSRS, Working Memory, PE Gate │  │
│  │  ⚠️ No timeouts          │   │  Co-activation, Attention      │  │
│  │  ⚠️ No partial results   │   │  ✅ 10/11 production-integrated │  │
│  └─────────────────────────┘   └────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ EVAL STACK   │  │ SAVE PIPELINE│  │ 32 MCP TOOLS             │  │
│  │ Ablation     │  │ 3-layer dedup│  │ 7 groups (flat listing)  │  │
│  │ 12 metrics   │  │ Quality loop │  │ 31-param memory_search   │  │
│  │ Ground truth │  │ PE arbitrate │  │ ⚠️ No simple search       │  │
│  │ ⚠️ No feedback│  │ 5-dim tenant │  │ ⚠️ No grouping            │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Research Quality Assessment (from Ultra-Think Review)

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| **Breadth** | 3/5 | Covered retrieval core, cognitive, eval, save, DX, flags. ~42% of lib/ LOC investigated; storage, handlers, parsing, governance uninvestigated. |
| **Depth** | 4/5 | Pipeline, fusion, cognitive, save pipeline examined in detail across multiple iterations with line-level citations. |
| **Rigor** | 4/5 | Cross-validation pass (iter-18) caught 1 false positive and corrected 3 claims. Many performance claims unmeasured. |
| **Actionability** | 5/5 | 25 recommendations with P0/P1/P2 priority, S/M/L effort, impact scores, and sprint-level roadmap. |
| **Overall** | **4.0/5** | Strong but subsystem-skewed. Credible for search core; not a full-system audit. |

---

## 4. CORE ARCHITECTURE

### Pipeline Stages

The pipeline executes 4 stages sequentially via an orchestrator (`orchestrator.ts`, 79 LOC):

**Stage 1 -- Candidate Generation** (~5 search channels):
- Vector search (Voyage AI embeddings → Vec0)
- BM25 full-text search (SQLite FTS5)
- FTS5 metadata search
- Graph search (typed-degree as 5th RRF channel, Tarjan SCC, Louvain modularity)
- Co-activation spreading (deep pipeline integration)
- Query expansion: rule-based synonyms (deep mode, 27-entry vocab, 3x latency) OR R12 embedding expansion (standard mode, top-5 neighbor mining)

**Stage 2 -- Fusion & Scoring** (854 LOC, 12 sequential steps):
1. Session boost (combined cap=0.20, batched DB)
2. Causal boost
2a. Co-activation spreading
2b. Community co-retrieval (N2c)
2c. Graph signals (momentum, causal depth, 2-hop walk)
3. Testing effect (FSRS write-back, trackAccess only)
4. Intent weights (non-hybrid only -- G2 guard prevents double-counting)
5. Artifact routing weights
6. Feedback signals (learned triggers + negative feedback)
7. Artifact-based result limiting
8. Anchor metadata (annotation only)
9. Validation metadata + quality scoring

**Stage 3 -- Rerank & Aggregate**:
- MMR diversity pruning (λ=0.7 default, per-intent variants)
- Cross-encoder reranking (3-provider support, circuit breaker + latency tracker)
- Dedup (via score snapshot comparison)

**Stage 4 -- Filter & Annotate**:
- Score snapshot capture (compile-time `Readonly<>` + runtime `verifyScoreInvariant()`)
- Archive filtering
- Constitutional memory injection
- Final ranking via `extractScoringValue()` (⚠️ uses different fallback chain than types.ts canonical)

### Data Flow Contracts

```
PipelineConfig → Stage1Output { candidates: PipelineRow[], metadata }
             → Stage2Output { scored: PipelineRow[], metadata }
             → Stage3Output { reranked: PipelineRow[], metadata }
             → Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
```

Stage 4 enforces immutability at two levels:
1. **Compile-time**: `Stage4ReadonlyRow` makes score fields `Readonly<Pick<...>>`
2. **Runtime**: `captureScoreSnapshot()` before, `verifyScoreInvariant()` after

[SOURCE: mcp_server/lib/search/pipeline/types.ts:14-46, 74-105, 349-429]
[SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts:42-78]

### Orchestrator Critical Gap

The orchestrator is a pure pass-through (79 LOC) with **zero** error handling constructs -- no try/catch, no throw, no error keyword, no timeout, no circuit breaker. Any stage throw propagates as an unhandled rejection. The structured error infrastructure (`MemoryError`, `buildErrorResponse`, `withTimeout`) exists in `errors/core.ts` but is never used by the pipeline.

[SOURCE: iter-1 F1, iter-6 F1, iter-18 Finding 4 -- CONFIRMED]

---

## 5. SCORING & FUSION

### Scoring Constants

All 30+ scoring constants are hardcoded. Only 2 have literature citations:
- RRF K=60 (SIGIR 2009)
- FSRS constants (FSRS v4 specification)

No data-driven calibration, no A/B framework, no runtime tuning except K and two feature flags. The eval system measures quality via ablation but has no mechanism to feed results back into scoring constants.

[SOURCE: iter-2, iter-8 F7, iter-18 Finding 2 -- CONFIRMED]

### Fusion Algorithms

| Algorithm | Status | Role |
|-----------|--------|------|
| **RRF** (Reciprocal Rank Fusion) | LIVE | Primary fusion, K=60 |
| **RSF** (Reciprocal Score Fusion) | DORMANT | Shadow-only, records scores but doesn't affect ranking |
| **Adaptive Fusion** | PARTIAL | 7 intent-specific weight profiles, but only applies to 2 of 5 channels |

### Three Conflicting Weight Systems (B2)

1. `hybrid-search.ts` hardcodes: vector=1.0, fts=0.8, bm25=0.6, graph=0.5
2. `adaptive-fusion.ts` has 7 intent-specific weight profiles but only covers 2 channels
3. `rrf-fusion.ts` has `GRAPH_WEIGHT_BOOST=1.5` (dead code -- overridden by explicit weight=0.5)

Additionally, `FusionWeights.graphWeight` is declared in the interface, set in all 7 intent profiles, but **never consumed** by `adaptiveFuse()`. This creates a false sense of intent-aware graph weighting.

[SOURCE: iter-5 F2/F5/F6/F10, iter-16 B2]

### Score Resolution Inconsistency (A1)

Three separate functions resolve "final score" with different fallback chains:

| Function | Location | Chain |
|----------|----------|-------|
| `resolveEffectiveScore()` | types.ts:49-66 | intentAdjustedScore → rrfScore → score → similarity/100 |
| `compareDeterministicRows()` | ranking-contract.ts:36-44 | score → similarity/100 |
| `extractScoringValue()` | stage4-filter.ts:205-214 | rrfScore → intentAdjustedScore → score → similarity (RAW, not /100) |

When `withSyncedScoreAliases()` runs, divergence is masked. On error paths where aliases are unsynced, sorting and filtering disagree. The Stage 4 function also has a **100x scale mismatch** (raw similarity vs /100).

[SOURCE: iter-1 F3/F9, iter-2 F1, iter-18 Finding 1 -- CONFIRMED]

---

## 6. CONSTRAINTS & LIMITATIONS

### Coverage Limitations

| Metric | Value |
|--------|-------|
| LOC investigated | ~22,000 (~42% of lib/) |
| LOC uninvestigated | ~30,000 (~58% of lib/) |
| Files investigated | ~50 of ~150 lib/ files |
| Subsystems investigated deeply | 7 (search pipeline, fusion, queries, cognitive, eval, graph, save) |
| Subsystems NOT investigated | 16 (storage, handlers/non-save, parsing, telemetry, validation, ops, learning, config, extraction, governance, cache, chunking, providers, architecture, response, manage) |

### Largest Uninvestigated Subsystems

| Subsystem | Files | LOC | Risk |
|-----------|-------|-----|------|
| **storage/** | 13 | 7,148 | DB schema, migrations, SQLite ops, Vec0. Performance/correctness findings depend on storage assumptions. |
| **handlers/** (non-save) | ~32 | ~11,280 | MCP-to-lib bridge: validation, authz, request shaping, error propagation. |
| **parsing/** | 4 | 1,915 | Content extraction shapes what gets indexed. Affects recall even if pipeline is perfect. |
| **governance/** | 2 | 710 | Tenant/user isolation claims are unverified. |

### Performance Claims Without Measurement

All performance findings are architectural inferences, not benchmarks:
- BM25 N+1 overhead may be negligible with SQLite prepared statements
- Deep-mode 3x latency depends on unmeasured embedding generation time
- R12 expansion "doubles cost" assumes sequential execution
- MMR re-fetch may hit SQLite page cache

### Correctness Claims Without Reproduction

- Score resolution divergence: `withSyncedScoreAliases` may fully mask in practice
- FSRS lost-update race: SQLite single-writer may prevent at DB level
- Concurrent save dedup race: file-based invocation may make concurrent saves rare
- Constitutional archive bypass: archived constitutionals may never exist

[SOURCE: iter-20 §2a-2c]

---

## 7. SEARCH CHANNELS & INTEGRATION

### Graph Channel (Q4 -- NOT Dead Code)

The graph channel is a complete, default-ON system with:
- FTS5-backed causal edge search + LIKE fallback
- Typed-degree as 5th RRF channel
- 3 graph signals: momentum, causal depth (Tarjan SCC), graph-walk (2-hop)
- Community detection: BFS + Louvain escalation
- Session caching + constitutional memory exclusion
- Controlled by `SPECKIT_GRAPH_UNIFIED` (default-on semantics)

Error handling is defensive (try/catch with warn + empty return on all paths). No dead code found in graph modules.

[SOURCE: iter-3; strategy Q4 answer]

### Cognitive Subsystem (Q12 -- NOT Over-Engineered)

4,644 LOC across 11 modules; 10 of 11 are production-integrated (4,463 LOC). Architecture:

| Layer | Modules | LOC |
|-------|---------|-----|
| Foundation | rollout-policy (64, 6 consumers), fsrs-scheduler (395) | 459 |
| Session | working-memory (765, Miller's Law capacity, LRU eviction, event decay) | 765 |
| Quality | prediction-error-gate, tier-classifier, pressure-monitor | ~1,200 |
| Enhancement | co-activation, adaptive-ranking (shadow-mode), archival-manager, attention-decay | ~2,000 |

Only `temporal-contiguity.ts` (181 LOC) has zero production callers -- the sole dead code in the subsystem.

[SOURCE: iter-10; strategy Q12 answer]

### Eval/Ablation Framework (Q10)

Structurally complete and correctly connected:
- Ablation framework (773 LOC): one-at-a-time channel ablation, 9-metric breakdown, sign-test significance
- Bidirectional pipeline connection: ablation calls search, search respects disabled flags
- Ground truth: 2,591-line JSON, 7 intent types, 7 query categories, 4-point relevance scale
- 12 metrics (7 core + 5 diagnostic) as pure functions
- Separate eval DB (5 tables, WAL mode)

**Critical gap**: No feedback loop. Eval measures quality but cannot calibrate weights. `eval_metric_snapshots` table is written but never read by pipeline code. `token_usage` metric is a stub (always 0).

[SOURCE: iter-8; strategy Q10 answer]

### Save Pipeline (Q11)

Architecturally robust 7-module decomposition:
- 3-layer dedup: same-path hash, cross-path hash, semantic PE gate
- 4-dimension quality loop: triggers/anchors/budget/coherence (threshold 0.6, 2 auto-fix retries)
- 5-action PE arbitration: CREATE/REINFORCE/SUPERSEDE/UPDATE/CREATE_LINKED
- Append-only versioning, 4-step post-insert enrichment, 5-dimensional tenant isolation

Three gaps: (a) ~~embedding cache key ignores model ID~~ REFUTED -- cache correctly uses compound PK, (b) no transaction isolation for concurrent dedup, (c) quality loop content mutations create implicit caller contract.

[SOURCE: iter-9; strategy Q11 answer; iter-18 Finding 6 -- REFUTED]

---

## 8. RECOMMENDATION CATALOG

25 recommendations across 7 categories, ordered by priority and impact. Cross-validation status from iteration 18 where applicable.

### Category A: Bugs / Correctness (5 items)

| ID | Recommendation | Priority | Effort | Impact | Cross-Val |
|----|---------------|----------|--------|--------|-----------|
| A1 | Unify 3 score resolution chains to single canonical function | P0 | S | 4/5 | CONFIRMED |
| A2 | FSRS write-back: wrap in BEGIN IMMEDIATE transaction | P2 | S | 2/5 | MODIFIED (location) |
| A3 | Constitutional injection: add archive check | P2 | S | 2/5 | N/A |
| A4 | Concurrent save dedup: add transaction isolation | P1 | M | 3/5 | N/A |
| A5 | Quality loop mutations: return new object (immutable pattern) | P2 | S | 2/5 | N/A |

### Category B: Architecture (7 items)

| ID | Recommendation | Priority | Effort | Impact | Cross-Val |
|----|---------------|----------|--------|--------|-----------|
| B1 | Orchestrator: structured error handling + timeouts + partial results | P0 | M | 5/5 | CONFIRMED |
| B2 | Weight coherence: unify 3 systems into 1 intent-aware system | P0 | L | 5/5 | Partial |
| B3 | Eval-to-scoring feedback loop | P1 | L | 5/5 | CONFIRMED |
| B4 | Stage 2 decomposition: scoring / enrichment / side-effects | P1 | M | 3/5 | N/A |
| B5 | Feature flag governance: manifest, owners, sunset dates | P1 | L | 4/5 | MODIFIED |
| B6 | Signal failure tri-state metadata: off / applied / failed | P1 | S | 3/5 | N/A |
| B7 | BM25 spec-folder filter: batch N+1 query | P1 | S | 3/5 | Indirect |

### Category C: Dead Code Cleanup (9 items)

| ID | Item | Priority | Effort |
|----|------|----------|--------|
| C1 | `applyIntentWeights()` export in intent-classifier.ts (0 imports) | P2 | S |
| C2 | `detectIntent()` alias (trivial wrapper) | P2 | S |
| C3 | `GRAPH_WEIGHT_BOOST=1.5` (dead, overridden by explicit 0.5) | P2 | S |
| C4 | `FusionWeights.graphWeight` + `graphCausalBias` (set, never consumed) | P2 | S |
| C5 | 5-factor scoring model (dormant, 0 production activations) | P2 | S |
| C6 | RSF fusion (shadow-only, no activation test) | P2 | M |
| C7 | `temporal-contiguity.ts` (181 LOC, 0 callers) | P2 | S |
| C8 | `SPECKIT_PIPELINE_V2` flag (always true, V1 removed) | P2 | S |
| C9 | Query classifier confidence field (computed, never consumed) | P2 | S |

### Category D: Documentation / Spec Alignment (7 items)

| ID | Recommendation | Priority | Effort |
|----|---------------|----------|--------|
| D1 | Update spec: 5 channels, not 4 | P1 | S |
| D2 | Update spec: 12 scoring steps, not "15+ signals" | P2 | S |
| D3 | Correct spec: SHA-256 hash dedup, not cosine | P2 | S |
| D4 | Create feature flag manifest (81 flags) | P1 | M |
| D5 | Document SPECKIT_MEMORY_* as canonical; deprecate HYDRA_* | P2 | S |
| D6 | Rename `memory_drift_why` → `memory_causal_trace` | P2 | S |
| D7 | Disambiguate `graphUnified` across modules | P2 | S |

### Category E: Automation / DX (5 items)

| ID | Recommendation | Priority | Effort | Impact |
|----|---------------|----------|--------|--------|
| E1 | File-watcher default-ON (mature 417 LOC, currently opt-in) | P2 | S | 3/5 |
| E2 | Scheduled stale-entry cleanup (no automated bulk sweep) | P2 | M | 2/5 |
| E3 | Simplified `memory_quick_search(query, limit?)` tool | P1 | M | 4/5 |
| E4 | MCP tool grouping metadata (32 tools flat) | P2 | S | 2/5 |
| E5 | Progress feedback for post-save async operations | P2 | M | 2/5 |

### Category F: Performance (5 items)

| ID | Recommendation | Priority | Effort | Impact |
|----|---------------|----------|--------|--------|
| F1 | Deep-mode expansion: cache embeddings, parallelize, latency budget | P1 | M | 3/5 |
| F2 | R12 expansion: add metrics, disable if recall delta < threshold | P2 | S | 2/5 |
| F3 | MMR: pass embeddings through pipeline metadata (avoid re-fetch) | P2 | M | 2/5 |
| F4 | Shared-space: eliminate double query in assertSharedSpaceAccess | P2 | S | 1/5 |
| F5 | Stage 2: single requireDb() call at entry | P2 | S | 1/5 |

### Category G: Test Coverage Gaps (7 items)

| ID | Gap | Priority | Effort | Impact |
|----|-----|----------|--------|--------|
| G1 | Pipeline orchestrator error cascading (0 tests) | P0 | S | 4/5 |
| G2 | Score resolution divergence consistency (1 test) | P1 | S | 3/5 |
| G3 | Cross-encoder circuit breaker (0 tests) | P1 | S | 3/5 |
| G4 | BM25 N+1 query regression (0 tests) | P1 | S | 2/5 |
| G5 | Concurrent save dedup race (0 tests) | P1 | M | 3/5 |
| G6 | RSF shadow-to-production activation (0 tests) | P2 | S | 2/5 |
| G7 | FSRS write-back race (0 correct tests -- existing test covers different race) | P2 | M | 2/5 |

---

## 9. CROSS-VALIDATION RESULTS

Iteration 18 independently re-verified the top 10 findings:

| # | Finding | Prior Claim | Fresh Evidence | Verdict |
|---|---------|-------------|----------------|---------|
| 1 | Score resolution chains | 3 divergent chains | All 3 confirmed at exact lines | **CONFIRMED** |
| 2 | Hardcoded constants | 30+ without calibration | 4/5 spot-checks positive | **CONFIRMED** |
| 3 | Feature flag count | 76 unique flags | 81 unique flags (83 minus 2 regex fragments) | **MODIFIED ↑** |
| 4 | Orchestrator errors | 0 error handling | 79 lines, 0 try/catch/throw/error | **CONFIRMED** |
| 5 | FSRS race location | Race in fsrs.ts | fsrs.ts is read-only; race is in trackAccess flow | **MODIFIED (location)** |
| 6 | Embedding cache key | Ignores model ID | Compound PK `(content_hash, model_id)`, correct lookups | **REFUTED** |
| 7 | memory_search params | 28 parameters | 31 fields in SearchArgs interface | **MODIFIED ↑** |
| 8 | Channel count | 5 channels not 4 | types.ts:185 lists 5 explicitly | **CONFIRMED** |
| 9 | 5-factor model | 0 production activations | 0 callers of `use_five_factor_model: true` in lib/ | **CONFIRMED** |
| 10 | Dead applyIntentWeights | 0 imports | 0 imports; Stage 2 has own reimplementation | **CONFIRMED** |

**Key insight**: The refuted embedding-cache finding demonstrates why cross-validation is essential. Without iteration 18, a false positive would have propagated into final recommendations.

[SOURCE: scratch/iteration-018.md]

---

## 10. TESTING & COVERAGE

### Quantitative Coverage

- **284 test files** across the codebase
- All 4 pipeline stages have test files, but **Stage 4 has no dedicated test file**
- Strong edge case coverage: empty results, null inputs, boundary values across scoring/fusion/graph

### 7 Critical Untested Paths

1. **FSRS write-back lost-update race**: Existing `decay-delete-race.vitest.ts` tests a DIFFERENT race (working_memory attention score T214)
2. **Score resolution divergence**: Only 1 test in mcp-response-envelope, not the 3 internal functions
3. **Pipeline orchestrator error cascading**: 0 tests for any-stage-throws behavior
4. **Cross-encoder circuit breaker**: 0 tests
5. **BM25 spec-folder filter N+1**: 0 tests
6. **RSF shadow-to-production activation**: 0 tests
7. **Concurrent save dedup race / embedding cache model-swap**: 0 tests

### Test Quality Blind Spots

Iteration 15 counted test files and identified gaps, but did NOT assess:
- Assertion density per test
- Unit vs integration balance
- Mock fidelity
- Mutation testing resistance

[SOURCE: iter-15; strategy Q18 answer]

---

## 11. PERFORMANCE ANALYSIS

### Identified Hot Paths

| Path | Issue | Severity | Evidence Level |
|------|-------|----------|---------------|
| BM25 spec-folder filter | N+1 query: 50 results = 50 individual SELECTs | Medium | Code pattern (no benchmark) |
| Deep-mode expansion | 3x full hybrid search per query (sequential, no cache) | High | Code path (no timing) |
| R12 embedding expansion | 2nd hybrid search for non-simple queries | Medium | Code path (no timing) |
| MMR re-fetch | Embeddings loaded again from Vec0 (loaded in Stage 1) | Low | Code path (may hit page cache) |
| Local reranker | Sequential candidate processing (PERF CHK-113) | Low | Code note |

### Timing Instrumentation

Existing instrumentation:
- Cross-encoder: circuit breaker + latency tracker
- Stage 4 filter: `durationMs` field
- Vector index queries: timing decorators

**Missing**: End-to-end pipeline latency metric. The orchestrator has zero timing code. No way to measure total p95 latency.

### Expansion Systems

Two separate expansion systems in mutual exclusion:

| System | Mode | Mechanism | Latency Impact |
|--------|------|-----------|---------------|
| Rule-based synonyms | Deep only | 27-entry vocab, max 3 variants, each triggers full search | 3x (unmeasured) |
| R12 embedding expansion | Standard | Mines terms from top-5 neighbors, parallel 2nd search | 2x (unmeasured) |

Neither has metrics or eval hooks. R12 mines from the same semantic neighborhood already found by vector search -- narrow improvement window.

---

## 12. ERROR HANDLING & RESILIENCE

### Error Pattern Census

| Component | Catch Blocks | Pattern |
|-----------|-------------|---------|
| Stage 2 | 16 | warn-and-continue |
| Stage 1 | 8 | warn-and-continue |
| Stage 3 | 4 | warn-and-continue |
| Orchestrator | **0** | No error handling |
| **Total pipeline** | **28** | Silent degradation |

### Structured Error Infrastructure (Unused)

The codebase has well-designed error infrastructure that the pipeline never uses:
- `MemoryError` class with error codes
- `buildErrorResponse()` for structured MCP responses
- `withTimeout()` utility for deadline enforcement
- Located in `errors/core.ts` (1,221 LOC across 3 files)

### Critical Error Handling Gaps

1. **No distinction between feature-off and feature-crashed**: All 28 catch blocks leave `*Applied: false`. Callers cannot distinguish disabled from crashed.
2. **No circuit-breaker for DB failures**: 4 Stage 2 steps independently call `requireDb()`. No shared "DB unavailable" state.
3. **FSRS write-back race**: Read-then-write without transaction isolation. Lost updates degrade spaced-repetition accuracy.
4. **Pipeline never uses structured errors**: 28 warn-and-continue blocks vs structured `MemoryError` infrastructure.
5. **Silent quality degradation**: All 9 signal steps can fail without caller awareness. This is the dominant failure mode.

[SOURCE: iter-6; strategy Q8 answer]

---

## 13. RESEARCH DEBT & FUTURE WORK

### Top 15 Research Debt Items (from iter-20)

| ID | Area | Files | LOC | Priority | Why |
|----|------|-------|-----|----------|-----|
| RD-01 | storage/ deep dive | 13 | 7,148 | HIGH | Largest uninvestigated. All perf/correctness assumptions depend on it. |
| RD-02 | handlers/ audit (non-save) | ~32 | ~11,280 | HIGH | MCP-to-lib bridge. Validation, authz, error propagation. |
| RD-03 | Governance verification | 2 | 710 | HIGH | Tenant isolation claims unverified. |
| RD-04 | parsing/ quality | 4 | 1,915 | MEDIUM | Content quality affects all downstream search. |
| RD-05 | telemetry/ connection | 4 | 1,668 | MEDIUM | May connect to pipeline timing gaps. |
| RD-06 | validation/ completeness | 2 | 1,457 | MEDIUM | Input validation at MCP boundary unknown. |
| RD-07 | Provider resilience | 2 | 621 | MEDIUM | Voyage AI, Vec0, onnxruntime fallback behavior. |
| RD-08 | Security posture | - | - | MEDIUM | Path traversal, SQL parameterization, API keys. |
| RD-09 | Test quality assessment | 284 | - | LOW | Assertion density, mock fidelity, mutation resistance. |
| RD-10 | Performance benchmarks | - | - | LOW | Actual timing data for all hot-path claims. |
| RD-11 | ops/ purpose | 2 | 1,144 | LOW | Unknown purpose. |
| RD-12 | learning/ quality | 2 | 994 | LOW | Learning Index calculation quality. |
| RD-13 | config/ fragmentation | 3 | 920 | LOW | Centralized vs fragmented config. |
| RD-14 | extraction/ coverage | 4 | 960 | LOW | Content extraction quality. |
| RD-15 | chunking/ strategy | 2 | 448 | LOW | Chunk size, overlap handling. |

### Recommended Next Campaign

Start with RD-01 (storage/) and RD-02 (handlers/) -- together they cover 18,428 LOC and would bring investigated coverage from 42% to ~60%.

---

## 14. MCP TOOLS & DEVELOPER EXPERIENCE

### Tool Inventory

32 MCP tools across 7 functional groups (all displayed flat with no grouping):

| Group | Tools | Key Issues |
|-------|-------|------------|
| Search | memory_search, memory_context | 31-param search, no simple variant |
| Save | memory_save | Post-save async has no progress feedback |
| Lifecycle | memory_list, memory_delete, memory_update, memory_validate | Consistent naming |
| Causal | memory_causal_link, memory_causal_stats, memory_causal_unlink | `memory_drift_why` misnamed (should be causal group) |
| Eval | eval_run_ablation, eval_reporting_dashboard | Gated behind SPECKIT_ABLATION=true |
| Shared | shared_space_upsert, shared_space_membership_set, shared_memory_enable, shared_memory_status | Default-OFF |
| Ops | memory_health, memory_stats, memory_index_scan, checkpoint_*, ingest_*, memory_bulk_delete | Operational |

### Naming Consistency

- **Consistent**: `{domain}_{action}` pattern across 30 of 32 tools
- **Inconsistent**: `memory_drift_why` (should be `memory_causal_trace`)
- **Inconsistent**: TriggerArgs uses snake_case (`session_id`, `include_cognitive`) while all other interfaces use camelCase
- **Duplicate parameter**: `minQualityScore` + `min_quality_score` in SearchArgs

### UX Friction

1. **31 parameters on memory_search** -- no simplified `memory_quick_search(query, limit?)`
2. **32 tools flat** -- no category/group metadata for tool listing
3. **File-watcher opt-in** -- most common DX friction is forgetting to reindex
4. **No progress feedback** for async post-save operations

[SOURCE: iter-11; strategy Q13/Q14 answers]

---

## 15. DEAD CODE & FEATURE FLAGS

### Dead Code Inventory (9 items)

| Item | Location | LOC | Status | Evidence |
|------|----------|-----|--------|----------|
| `applyIntentWeights()` | intent-classifier.ts:485 | ~50 | 0 imports | iter-4, 18 CONFIRMED |
| `detectIntent()` | intent-classifier.ts | ~5 | Trivial wrapper | iter-4 |
| `GRAPH_WEIGHT_BOOST=1.5` | rrf-fusion.ts | 1 | Overridden by explicit 0.5 | iter-5 |
| `FusionWeights.graphWeight` + `graphCausalBias` | adaptive-fusion.ts | ~20 | Set, never consumed | iter-5 |
| 5-factor scoring model | composite-scoring.ts | ~200 | 0 production activations | iter-3, 18 CONFIRMED |
| RSF fusion | rsf-fusion.ts | ~150 | Shadow-only | iter-2 |
| `temporal-contiguity.ts` | cognitive/ | 181 | 0 callers | iter-10 |
| `SPECKIT_PIPELINE_V2` | search-flags.ts | ~10 | Always true, V1 removed | iter-7 |
| Query classifier confidence | query-classifier.ts | ~5 | Computed, never consumed | iter-12 |

**Decision needed**: Activate with A/B coverage (5-factor, RSF) or remove. The dormant code represents ~400 LOC of untested activation paths.

### Feature Flag Sprawl (81 flags)

| Category | Count | Examples |
|----------|-------|---------|
| Default-ON (graduated) | ~20 | SPECKIT_GRAPH_UNIFIED, SPECKIT_SESSION_BOOST |
| Default-OFF (opt-in) | ~40 | SPECKIT_ABLATION, SPECKIT_SHARED_MEMORY |
| Multi-state | ~5 | Various |
| Legacy HYDRA_* aliases | 12 | SPECKIT_HYDRA_ADAPTIVE_RANKING, etc. |
| Deprecated | 1 | SPECKIT_PIPELINE_V2 (@deprecated, always true) |

**No central registry.** No manifest. No sunset dates. No expiry mechanisms. No categorization documentation. Three distinct flag semantics coexist with no documentation mapping which flags use which.

Two dependency chains found:
1. `GRAPH_WALK_ROLLOUT` → falls back to `GRAPH_SIGNALS`
2. `ENTITY_LINKING` documents requiring `AUTO_ENTITIES` but does NOT enforce

[SOURCE: iter-7; strategy Q9 answer; iter-18 Finding 3 -- MODIFIED to 81]

---

## 16. METHODOLOGY & ACKNOWLEDGEMENTS

### Research Protocol

- **Method**: 20-iteration autonomous deep research loop with externalized state (JSONL + strategy.md)
- **Agents per iteration**: Up to 3 (Codex CLI/GPT-5.4 as A1, Copilot CLI/GPT-5.4 as A2, native Claude Opus as A3)
- **Canonical findings**: A3 (native agent); A1/A2 provide supplementary perspectives
- **Anti-convergence measures**: Threshold 0.02, phased question injection at iterations 5 and 10, domain rotation, iterations 18-20 convergence-exempt
- **Post-research review**: Ultra-think (GPT-5.4 via Copilot) scored top 20 on 5-dimension rubric

### Phase Structure

| Phase | Iterations | Focus |
|-------|-----------|-------|
| 1: Broad Survey | 1-4 | Pipeline architecture, scoring, graph, alignment |
| 2: Deep Investigation | 5-9 | Fusion strategy, errors, flags, eval, save |
| 3: Automation & UX | 10-13 | Cognitive, DX, automation, query intelligence |
| 4: Cross-Cutting | 14-17 | Spec verification, test coverage, performance, sessions |
| 5: Synthesis | 18-20 | Cross-validation, recommendations, gap analysis |

### Questions Answered (18 of 18)

All 18 research questions were answered with evidence. See [strategy.md](scratch/deep-research-strategy.md) for complete Q&A with citations.

### Research Contributors

| Agent | Role | Iterations |
|-------|------|------------|
| Claude Opus 4.6 | Orchestrator, research.md synthesis | All |
| Claude Opus (@deep-research) | Native A3 agent, canonical findings | 1-20 |
| GPT-5.4 (Codex CLI) | Supplementary A1 agent | 1-10, 14+ |
| GPT-5.4 (Copilot CLI) | Supplementary A2 agent | 1-6+ |
| GPT-5.4 (Ultra-Think) | Post-research review, scoring, blind spots | Post-20 |

---

## APPENDIX A: IMPLEMENTATION ROADMAP

### Sprint 1: Quick Wins (1-2 days, P0/P1 + Effort S)

1. **A1** -- Unify score resolution chains (half day)
2. **B6** -- Add signal failure tri-state metadata (half day)
3. **B7** -- Batch BM25 spec-folder query (half day)
4. **G1** -- Orchestrator error cascade tests (half day)
5. **G2** -- Score resolution consistency tests (half day)
6. **G3** -- Cross-encoder circuit breaker tests (half day)

### Sprint 2: Critical Architecture (3-5 days)

1. **B1** -- Orchestrator error handling + timeouts (2 days)
2. **D1** -- Update spec: 5 channels (half day)
3. **D4** -- Feature flag manifest (1 day)
4. **E3** -- Simplified memory_search tool (1 day)

### Sprint 3: Performance + Testing (3-5 days)

1. **F1** -- Deep-mode expansion caching + parallelization (2 days)
2. **A4 + G5** -- Concurrent save dedup fix + tests (1-2 days)
3. **B4** -- Stage 2 decomposition (2 days)

### Epic: Strategic Initiatives (2-4 weeks)

1. **B2** -- Weight coherence unification (1 week, needs ablation testing)
2. **B5** -- Feature flag governance overhaul (1 week)
3. **B3** -- Eval-to-scoring feedback loop (2 weeks)

---

## APPENDIX B: ULTRA-THINK REVIEW SCORES

Top 20 recommendations scored on 5 dimensions (max 25 each):

| Rank | ID | Recommendation | Total |
|------|-----|---------------|-------|
| 1 | A1 | Unify score resolution | **25/25** |
| 2 | B1 | Orchestrator error handling | **24/25** |
| 3 | B6 | Signal tri-state metadata | **22/25** |
| 4 | B2 | Weight coherence unification | **22/25** |
| 5 | B3 | Eval-to-scoring feedback loop | **21/25** |
| 6 | B5 | Feature flag governance | **20/25** |
| 7 | G1 | Orchestrator error tests | **20/25** |
| 8 | -- | E2E latency instrumentation | **20/25** |
| 9 | A4 | Save dedup transaction | **18/25** |
| 10 | B7 | BM25 N+1 batch | **18/25** |

Full scores: [scratch/ultra-think-review.md](scratch/ultra-think-review.md)

---

## APPENDIX C: CONVERGENCE REPORT

| Metric | Value |
|--------|-------|
| Total iterations | 20 |
| Questions asked | 18 |
| Questions answered | 18 (100%) |
| Stop reason | max_iterations_reached |
| Final newInfoRatio | 0.30 (iter-20, gap analysis) |
| Convergence threshold | 0.02 (never triggered due to domain rotation + phased injection) |
| Stuck threshold | 5 (never triggered) |
| Agent outputs: A3 (native) | 20/20 |
| Agent outputs: A1 (Codex) | In progress |
| Agent outputs: A2 (Copilot) | In progress |

The research did NOT converge prematurely. The anti-convergence measures (lowered threshold, phased question injection, domain rotation, exempt iterations 18-20) successfully sustained productive investigation through all 20 iterations.

**newInfoRatio progression**: 1.0 → 1.0 → 0.91 → 0.88 → 0.82 → 0.91 → 0.91 → 0.91 → 0.91 → 0.91 → 0.92 → 0.79 → 0.87 → 0.55 → 0.73 → 0.20 → 0.15 → 0.40 → 0.15 → 0.30

The ratio dipped below 0.20 only in synthesis iterations (16, 17, 19) which consolidate rather than discover. Investigation iterations maintained high ratios throughout.

---

## APPENDIX D: ITERATION INDEX

| Iter | Focus | Findings | Key Evidence |
|------|-------|----------|-------------|
| 1 | Pipeline architecture audit | 10 | Score resolution chains, orchestrator gap, Stage 2 monolith |
| 2 | Scoring system deep dive | 10 | 30+ hardcoded constants, RSF dormant, weight fallback chains |
| 3 | Graph channel + search status | 11 | Graph NOT dead, 5 channels not 4, 5-factor dormant |
| 4 | Cross-system alignment scan | 8 | Intent classifier dead code, HYDRA aliases |
| 5 | Fusion strategy | 11 | 3 weight systems, adaptive partial, RRF channel minimum |
| 6 | Error handling + edge cases | 11 | 28 catch blocks, 0 orchestrator handling, FSRS race |
| 7 | Feature flag governance | 11 | 76→81 flags, 3 semantics, 12 HYDRA aliases |
| 8 | Eval infrastructure | 11 | Ablation complete, no feedback loop, ground truth quality |
| 9 | Save pipeline | 11 | 3-layer dedup, PE arbitration, quality loop |
| 10 | Cognitive subsystem | 11 | 10/11 integrated, temporal-contiguity dead, NOT over-engineered |
| 11 | Developer UX audit | 12 | 31-param search, 32 flat tools, file-watcher opt-in |
| 12 | Query expansion | 14 | Two expansion systems, no metrics, confidence field dead |
| 13 | Performance + sessions | 15 | BM25 N+1, session-boost mature, shared-spaces complete |
| 14 | Spec vs code check | 10 | 5 claims verified, 5 falsified |
| 15 | Test coverage | 11 | 284 files, 7 critical gaps, Stage 4 no dedicated test |
| 16 | Q1 synthesis | 20 | 20 pipeline improvements, 6 categories |
| 17 | Q5 synthesis | 29 | 29 misalignments, 4 categories |
| 18 | Cross-validation | 10 | 6 confirmed, 3 modified, 1 refuted |
| 19 | Recommendations | 25 | 25 items, 7 categories, sprint roadmap |
| 20 | Gap analysis | 15 | 42% coverage, 15 research debt items |

---

## APPENDIX E: HISTORICAL RESEARCH REFERENCE

Prior research campaigns for this epic (consolidated from separate spec folders):
- **R-138-003** (2026-02-20): Skill Graph integration roadmap. Complete.
- **006-hybrid-rag-fusion-logic-improvements**: Logic improvement analysis. Content merged into this epic.
- **w1-w7 files** (2026-03-18): Cross-AI review campaign (Codex + validation). Complete.

See `research/` subfolder and `scratch/w1-*.md` through `scratch/w7-*.md` for historical artifacts.

---

<!-- CHANGELOG
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-20 | 2.0.0 | Complete rewrite: 20-iteration deep research synthesis | Claude Opus 4.6 + multi-agent |
| 2026-02-20 | 1.0.0 | Initial consolidated research (R-138-003 + 006 merge) | Various |
-->
