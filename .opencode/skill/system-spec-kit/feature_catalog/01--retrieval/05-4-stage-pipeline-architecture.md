---
title: "4-stage pipeline architecture"
description: "Covers the four bounded pipeline stages (candidate generation, fusion, rerank, filter) with score-immutability enforcement."
---

# 4-stage pipeline architecture

## 1. OVERVIEW

Covers the four bounded pipeline stages (candidate generation, fusion, rerank, filter) with score-immutability enforcement.

Every search goes through four steps, like an assembly line. First, gather candidates. Second, score and rank them. Third, re-check the ranking for accuracy. Fourth, filter out anything that does not belong. Each step has one clear job and is not allowed to change results from earlier steps. This structure keeps searches predictable and prevents bugs from sneaking in between stages.

---

## 2. CURRENT REALITY

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set, and that injection path now keys scope checks off `shouldApplyScopeFiltering` so global scope enforcement is honored even without caller-supplied governance scope. Deep-mode reformulation and HyDE branches re-enter the same post-search guardrails as primary candidates before merge, so scope, tier, `contextType` and `qualityThreshold` filters are applied uniformly across expansion channels.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Session boost now preserves the original working-memory `attentionScore` signal and stores the boosted ranking value separately in `sessionBoostScore`, while co-activation spreading writes its boost back to all score aliases before the reranked set is resorted. The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. The reassembly helper now accepts both snake_case and camelCase chunk metadata (`parent_id`/`parentId`, `chunk_index`/`chunkIndex`, `chunk_label`/`chunkLabel`), so formatter-style rows still collapse back to their parent correctly. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The 4-stage pipeline is the sole runtime path. The `SPECKIT_PIPELINE_V2` environment variable is not consumed by runtime code.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Pipeline orchestration: 4-stage execution with per-stage error handling and timeouts |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1: candidate generation, channel selection, constitutional injection, scope filtering |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2: single-pass signal integration (session boost, causal boost, co-activation, graph signals, FSRS, intent weights, feedback) |
| `mcp_server/lib/search/pipeline/stage2b-enrichment.ts` | Lib | Stage 2b: anchor and validation metadata enrichment without score mutation |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Stage 3: cross-encoder reranking and MPAB chunk-to-memory aggregation |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4: memory state filtering, evidence gap detection, score immutability enforcement |
| `mcp_server/lib/search/pipeline/ranking-contract.ts` | Lib | Deterministic ranking contract and bounded Stage 2 graph-bonus cap |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Pipeline type definitions (PipelineConfig, PipelineResult, Stage*Output, Stage4ReadonlyRow) |
| `mcp_server/lib/search/pipeline/index.ts` | Lib | Pipeline barrel export |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel candidate generation engine delegated to by Stage 1 |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry for pipeline stage toggles |
| `mcp_server/lib/search/evidence-gap-detector.ts` | Lib | TRM evidence gap detection used by Stage 4 |
| `mcp_server/lib/search/cross-encoder.ts` | Lib | Cross-encoder reranking used by Stage 3 |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk collapse and parent reassembly used by Stage 3 |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata annotation used by Stage 2b |
| `mcp_server/lib/search/validation-metadata.ts` | Lib | Validation signal metadata enrichment used by Stage 2b |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/pipeline-integration.vitest.ts` | Pipeline integration tests |
| `mcp_server/tests/pipeline-v2.vitest.ts` | V2 pipeline orchestration |
| `mcp_server/tests/integration-138-pipeline.vitest.ts` | Pipeline feature-138 tests |
| `mcp_server/tests/integration-search-pipeline.vitest.ts` | Search pipeline integration |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 fusion validation |
| `mcp_server/tests/evidence-gap-detector.vitest.ts` | Evidence gap detection |
| `mcp_server/tests/cross-encoder.vitest.ts` | Cross-encoder tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/anchor-metadata.vitest.ts` | Anchor metadata tests |
| `mcp_server/tests/validation-metadata.vitest.ts` | Validation metadata tests |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: 4-stage pipeline architecture
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-26 per audit remediation
