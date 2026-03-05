---
title: "Plan: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/plan]"
description: "This Level 3+ architectural upgrade involves modifying the core retrieval engine (hybrid-search.ts, rrf-fusion.ts) which dictates the performance of the entire system. Consequen..."
trigger_phrases:
  - "plan"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Plan: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR: plan-approach-138 -->
## 1. Execution Approach
This Level 3+ architectural upgrade involves modifying the core retrieval engine (`hybrid-search.ts`, `rrf-fusion.ts`) which dictates the performance of the entire system. Consequently, the upgrade is structured in highly granular, non-breaking deployment phases. 

The strategy utilizes **"Dark Launching"** via Feature Flags (e.g., `SPECKIT_MMR=false` by default during initial commits). This approach allows developers to introduce new computational overhead gradually, verifying that latency remains within the 120ms ceiling for `mode="auto"` (per spec.md Section 3.2) via the `memory_stats` health checks before making the new algorithms the default.
<!-- /ANCHOR: plan-approach-138 -->

<!-- ANCHOR: plan-phases-138 -->
## 2. Phased Rollout and Architecture Blueprint

### Phase 0: Quick Wins (Activate Existing Assets)
*   **Objective:** Eliminate integration fragmentation. Connect already-tested, fully functional modules into the primary execution path.
*   **Key Actions:** 
    *   Set `useGraph: true` to elevate causal relationships from post-retrieval multipliers to primary retrieval sources.
    *   Un-flag `adaptive-fusion.ts` to allow dynamic RRF weighting based on the detected intent.
    *   Inject `co-activation.ts` BFS spreading algorithm.
    *   Implement 0-result two-pass adaptive fallbacks. If `similarity=0.3` returns 0 rows, instantly re-execute the scatter query at `0.17`.

### Phase 1: Diversity and Confidence (The Core Upgrade)
*   **Objective:** Maximize the 2000-token LLM payload budget while eliminating "silent failure" hallucinations.
*   **Key Actions:** 
    *   Write the `applyMMR()` algorithm. This requires computing O(N²) pairwise cosine similarities for the top-20 RRF candidates to select the 5 most diverse chunks.
    *   Calculate Z-scores (Mean, StdDev) on RRF ranks to build the Transparent Reasoning Module (TRM). If Z-score < 1.5 or the absolute top score is < 0.015, inject `[EVIDENCE GAP DETECTED]` warnings into the MCP markdown string.

### Phase 2: Graph Intelligence & Field Weights
*   **Objective:** Apply mathematical precision to exact-match text and graph edge paths natively in SQLite.
*   **Key Actions:** 
    *   Upgrade the SQLite FTS5 query in `memory_search` to use `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)`. This violently scales the importance of `title` matches (10x) and `trigger_phrases` (5x) over generic content matches (2x) without any JS parsing latency.
    *   Update `causal-edges.ts` recursive CTEs to add relationship weight multipliers (`supersedes`=1.5x, `contradicts`=0.8x, `caused`=1.3x) directly in the SQL engine to ensure the Graph channel produces highly ranked nodes.

### Phase 3: Multi-Query Retrieval
*   **Objective:** Overcome vocabulary mismatch and prompt fragility for analytical searches (RAG Fusion).
*   **Key Actions:** 
    *   Introduce rule-based, template synonym expansion exclusively for `mode="deep"`. 
    *   If a user asks "Fix login error", internally expand to `["fix authentication bug", "login failure handler"]` and execute all 3 variants (original + 2 derived) in a `Promise.all` scatter-gather block.

### Phase 4: Indexing Quality & Authority Extraction
*   **Objective:** Improve chunk integrity and pre-compute foundational value.
*   **Key Actions:** 
    *   Replace naive sliding-window text chunkers with AST-based `remark-gfm` atomic block parsing during `generate-context.js` ingest. Ensure codeblocks are never split.
    *   Inject an asynchronous PageRank calculation into `memory_manage` batch jobs to pre-calculate graph authority, storing it in `memory_index`.
    *   Auto-extract `derived_from` entities via fast regex during `memory_save` to densify the graph.

### Phase 5: Test Coverage (Accompanies Each Phase)
*   **Objective:** Ensure every new feature and every modified module has corresponding vitest coverage. Tests are written alongside implementation, not deferred.
*   **Strategy:**
    *   **New modules** (mmr-reranker, evidence-gap-detector, query-expander, structure-aware-chunker, pagerank) each get a dedicated `*.vitest.ts` file.
    *   **Modified modules** (adaptive-fusion, hybrid-search, co-activation, bm25-index, causal-edges, rrf-fusion, intent-classifier, fsrs-scheduler, prediction-error-gate) get new `describe()` blocks appended to their existing test files.
    *   **Integration:** One end-to-end pipeline test (`integration-138-pipeline.vitest.ts`) validates the complete scatter→fuse→MMR→TRM flow under the 120ms latency ceiling.
    *   **Regression:** Feature flag `false` tests ensure the existing pipeline is unaffected by new code paths.
*   **Coverage Targets:** Unit 80%, Integration 70% for all new/modified modules.
<!-- /ANCHOR: plan-phases-138 -->

<!-- ANCHOR: plan-rollout-138 -->
## 3. Rollout and Rollback Strategy (Runbook)

### Step 1: Commit Phase (Dark Launch)
1. Merge PRs with all feature flags explicitly set to `false` in the deployment environment.
   * `SPECKIT_MMR: false`
   * `SPECKIT_TRM: false`
   * `SPECKIT_MULTI_QUERY: false`
2. Run unit tests (`npm run test:search`) to ensure the baseline static-weight pipeline remains uncorrupted.

### Step 2: Canary/Monitor Phase
1. Enable `SPECKIT_MMR: true` locally.
2. Force `mode="deep"` for 24 hours. 
3. Monitor `memory_stats` payload sizes. Ensure the payload character count is reduced by at least 15% (proving redundancy was eliminated).
4. Profile the Node.js event loop during MMR execution using `console.time('MMR_O(N^2)')`. Ensure the timer remains under `10ms` for N=20 candidates.

### Step 3: Default Phase
1. Flip `SPECKIT_MMR` and `SPECKIT_TRM` to `true` in the production environment.
2. Push cache invalidation signal: Force `bypassCache=true` on the MCP client's next startup to wipe the old static-weight cache entries.

### Step 4: Emergency Rollback
If `memory_stats` latency exceeds 150ms average for `mode="auto"`, or if LLMs complain about missing context:
1. Revert environment variables instantly:
   ```bash
   export SPECKIT_MMR=false
   export SPECKIT_TRM=false
   export SPECKIT_MULTI_QUERY=false
   ```
2. Restart the MCP server. Zero database/schema changes are required, ensuring instant, safe rollbacks.
<!-- /ANCHOR: plan-rollout-138 -->

<!-- ANCHOR: plan-risks-138 -->
## 4. Risk Matrix & Mitigation

| Risk ID | Description | Severity | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R01** | MMR O(N²) calculation blocks the single-threaded Node.js event loop. | High | Low | Hardcap MMR input candidates to N=20 maximum via `.slice(0, 20)` before applying the algorithm. 20² = 400 iterations, taking <2ms. |
| **R02** | Multi-Query generates bizarre variants, destroying relevance. | Medium | Medium | Limit server-side expansion to predefined template rules (e.g., synonym maps, term decomposition) rather than unconstrained generation. |
| **R03** | FTS5 weights (`bm25`) cause non-vector results to overwhelm RRF. | High | Low | Apply a specific multiplier to the FTS5 rank in `adaptive-fusion.ts` to ensure it only dominates if the user's intent is `find_spec` or `find_decision`. |
| **R04** | "LLM-in-MCP Paradox" causes API timeouts. | Critical | Zero | Completely banned. No LLM calls will be made from within the MCP server during read-time retrieval. |
<!-- /ANCHOR: plan-risks-138 -->

---

## Technical Context

- Stack: TypeScript + SQLite + vitest.
- Primary files: `hybrid-search.ts`, `intent-classifier.ts`, `mmr-reranker.ts`.
- Constraints: no schema migration, bounded latency, backward-compatible contracts.

## Implementation

1. Enable dormant graph/adaptive fusion paths.
2. Add centroid intent scoring internals.
3. Add/adjust tests for centroid behavior.
4. Re-run targeted suite and update phase docs.

## Testing Strategy

- Run `vitest` for `intent-classifier.vitest.ts`.
- Verify no regressions in scoring boundaries and type contracts.

## Dependencies

- Existing SGQS/graph channel code from sibling phases.
- Existing toolchain (`node`, `npm`, `vitest`).

## Rollback

- Restore prior scoring blend in `intent-classifier.ts` if regressions appear.
- Keep additive exports backward compatible to minimize rollback scope.

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scoped files and validation commands before edits.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Validate context before modification and verify after changes |
| TASK-SCOPE | Restrict edits to declared phase files |

### Status Reporting Format
- STATE: current checkpoint
- ACTIONS: files/commands run
- RESULT: pass/fail and next action

### Blocked Task Protocol
1. Mark BLOCKED with evidence.
2. Attempt one bounded workaround.
3. Escalate with options if unresolved.

## Consolidation Addendum (2026-02-22)

- This lifecycle plan remains the single canonical plan for the active RAG track.
- Command-alignment consolidation evidence is tracked in `supplemental/command-alignment-summary.md`.
- Non-skill-graph consolidation evidence is tracked in `supplemental/non-skill-graph-consolidation-summary.md`.
- Cross-document pointers are indexed in `supplemental-index.md`.
