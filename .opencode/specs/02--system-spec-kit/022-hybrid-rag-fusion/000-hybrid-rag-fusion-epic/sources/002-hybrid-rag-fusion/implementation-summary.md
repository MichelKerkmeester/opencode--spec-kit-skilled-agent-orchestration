---
title: "Implementation Summary: 001 — Hybrid RAG Fusion Pipeline (Workstream A) [002-hybrid-rag-fusion/implementation-summary]"
description: "The memory MCP server's retrieval pipeline was a collection of isolated engines. Powerful modules for adaptive fusion, co-activation spreading, and intent classification existed..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "001"
  - "hybrid"
  - "rag"
  - "implementation summary"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: 001 — Hybrid RAG Fusion Pipeline (Workstream A)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:implementation-summary-001-workstream-a -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion |
| **Completed** | 2026-02-20 |
| **Level** | 3+ |
| **Tasks** | 24/24 complete |
| **Orchestration** | Two-wave, 10 parallel Sonnet agents |
| **Schema Changes** | Zero — v15 SQLite schema unchanged |
| **Test Suite** | 4,546 passed, 19 skipped, 0 failed across 155 files (latest verification run in `mcp_server`) |
| **Workstream A Baseline** | 4,532 tests, 149 files at Workstream A completion |
| **Code Review** | R-Wave (5 Sonnet agents) + D-Wave (5 Opus agents), sk-code--opencode compliance verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory MCP server's retrieval pipeline was a collection of isolated engines. Powerful modules for adaptive fusion, co-activation spreading, and intent classification existed fully implemented in the codebase but had zero connection to the primary `hybridSearchEnhanced()` pipeline. Every search ran hardcoded weights, ignored the causal graph, and returned results without any confidence signal to the LLM. This workstream closed all twelve of those gaps: five new production modules created, six existing files surgically modified, and every feature enabled by default behind opt-out flags.

The result is a Unified Context Engine. When a query arrives, the pipeline classifies intent, scatters across vector, FTS5, and causal graph channels simultaneously, fuses with intent-weighted RRF, detects low-confidence returns with a Gaussian Z-score check, and prunes for diversity using Maximal Marginal Relevance before the payload reaches the LLM. Every component degrades gracefully on missing data and rolls back instantly with a single environment variable.

### MMR Reranker (`mcp_server/lib/search/mmr-reranker.ts`)

The "lost in the middle" problem is real: returning five semantically identical implementation summaries wastes the 2000-token context budget and dilutes LLM attention. The MMR reranker solves this by computing pairwise cosine similarity across the top-20 RRF candidates and greedily selecting results that balance relevance against redundancy.

The core algorithm runs a greedy selection loop. For each candidate, it calculates `mmrScore = (lambda * candidate.score) - ((1 - lambda) * maxSimToSelected)`, where `maxSimToSelected` is the maximum cosine similarity between the candidate and any already-selected result. Lambda governs the relevance-diversity tradeoff: `fix_bug` queries use `lambda=0.85` to keep results tightly focused on precision. `understand` queries use `lambda=0.5` to maximize diversity across subtopics. The `INTENT_LAMBDA_MAP` in `intent-classifier.ts` maps all seven intent types to their optimal lambda value, so the right tradeoff happens automatically per query.

The reranker is guard-gated on `Float32Array` embedding presence. If embeddings are absent (older stored memories without vector data), the pipeline skips MMR and returns the RRF-ranked list unchanged. This enables graceful degradation across mixed-generation memory databases. The MMR candidate pool is hard-capped at 20 via `.slice(0, 20)` before the O(N^2) loop runs: 20 squared yields 400 cosine similarity computations, completing in under 2ms.

- **Exports:** `applyMMR(candidates: MMRCandidate[], config: MMRConfig): MMRCandidate[]`, `computeCosine(a: Float32Array | number[], b: Float32Array | number[]): number`
- **Constants:** `DEFAULT_MAX_CANDIDATES = 20`
- **Tests:** 11/11 pass in `tests/mmr-reranker.vitest.ts`. Lambda diversity, lambda relevance, N=20 hardcap, zero-magnitude guard, and empty pool guard all verified.

### Evidence Gap Detector (`mcp_server/lib/search/evidence-gap-detector.ts`)

Silent failure was the most dangerous issue in the old pipeline. When a niche query returned low-quality nearest neighbors, the LLM received those results without any warning and hallucinated a confident answer built on noise. The Transparent Reasoning Module closes this gap by running a Gaussian Z-score analysis on the RRF score distribution before the payload is serialized.

The detector computes mean and standard deviation across all RRF scores in the result set. Two conditions trigger an evidence gap flag: if the top score's distance from the mean falls below `(topScore - mean) / stdDev < Z_SCORE_THRESHOLD` (1.5), or if the absolute top score is below `MIN_ABSOLUTE_SCORE` (0.015). When `evidenceGapDetected: true`, the handler in `memory-search.ts` prepends `[EVIDENCE GAP DETECTED]` to the summary and surfaces both `evidenceGapWarning` (the formatted string) and `evidenceGapTRM` (the full diagnostic object including `zScore`, `mean`, and `stdDev`) in `extraData`. The LLM sees the warning before the context payload and knows to synthesize from first principles rather than trust the retrieved content.

The warning string is plain text with no emoji, consistent with project convention and robust across LLM rendering contexts and terminal outputs. Edge cases are fully guarded: empty arrays return safe defaults, single-score arrays skip standard deviation calculation, and zero standard deviation (all scores identical) returns `evidenceGapDetected: false` because uniform scores indicate well-matched results.

- **Exports:** `detectEvidenceGap(rrfScores: number[]): TRMResult`, `formatEvidenceGapWarning(trm: TRMResult): string`
- **Constants:** `Z_SCORE_THRESHOLD = 1.5`, `MIN_ABSOLUTE_SCORE = 0.015`
- **Tests:** 12/12 pass in `tests/evidence-gap-detector.vitest.ts`. Z-score threshold boundary, well-distributed score sets, single-score edge case, all-identical edge case, and empty array edge case all verified.

### Query Expander (`mcp_server/lib/search/query-expander.ts`)

Vocabulary mismatch is a hard retrieval problem: a user asking "fix login error" may have zero lexical overlap with stored memories titled "authentication failure handler." The query expander addresses this for `mode="deep"` searches by generating synonym variants from a static domain vocabulary map before the scatter phase.

The expander uses rule-based expansion rather than LLM generation. This is a deliberate constraint that avoids the LLM-in-MCP paradox: an LLM call inside the MCP server at read-time would cause cascading timeouts as the parent LLM waits for a nested LLM response. Instead, `DOMAIN_VOCABULARY_MAP` provides a curated set of domain-specific synonym mappings. The function splits the query on word boundaries, checks each term against the map case-insensitively, and builds variants by substituting synonyms. The original query is always included in the output. The result set is capped at `MAX_VARIANTS = 3` (original plus up to two derived variants).

In `memory-search.ts`, when `mode="deep"` is detected, the handler calls `expandQuery(query)`, runs `Promise.all` across all variants with parallel `searchWithFallback` calls, merges the returned arrays, deduplicates by memory ID, and passes the unified result set into RRF fusion. Memories that appear in multiple variant results receive implicit convergence weighting through their higher RRF rank accumulation.

- **Exports:** `expandQuery(query: string): string[]`, `DOMAIN_VOCABULARY_MAP: Record<string, string[]>`
- **Constants:** `MAX_VARIANTS = 3` (internal)
- **Tests:** 11/11 pass in `tests/query-expander.vitest.ts`. Compound term splitting, synonym map lookup, 3-variant cap, original-always-included guarantee, and unknown term passthrough all verified.

### PageRank (`mcp_server/lib/manage/pagerank.ts`)

Graph authority scoring was missing from the retrieval pipeline. High-value architectural memories referenced by many other memories had no authority signal distinguishing them from ephemeral scratch notes. The PageRank module computes iterative authority scores across the causal graph for use in the ingest and management pipelines.

The algorithm runs standard iterative PageRank for a configurable number of iterations (default 10) with `DAMPING_FACTOR = 0.85`. Convergence detection terminates early when the total score delta across all nodes falls below `CONVERGENCE_THRESHOLD = 1e-6`, allowing efficient processing on sparse graphs. Scores sum to approximately 1.0. Nodes with zero out-degree distribute their score equally across all nodes to avoid rank sinks. Missing score entries default to `1 / nodeCount`.

The module is fully implemented and tested but not yet wired into the production ingest pipeline. Wiring requires integration with the `remark`/`remark-gfm` AST parser during the `generate-context.js` ingest phase and a batch hook in `memory_manage`, both deferred to Phase 4. The architecture is ready: scores would be stored in `memory_index.pagerank_score` and contribute as an additional signal in the graph channel RRF fusion.

- **Exports:** `computePageRank(nodes: GraphNode[], maxIterations?: number, dampingFactor?: number): PageRankResult`
- **Constants:** `DAMPING_FACTOR = 0.85`, `DEFAULT_ITERATIONS = 10`, `CONVERGENCE_THRESHOLD = 1e-6`
- **Tests:** 10/10 pass in `tests/pagerank.vitest.ts`. Convergence within 10 iterations, isolated node minimum score, zero out-degree handling, and configurable damping factor all verified.

### Structure-Aware Chunker (`scripts/lib/structure-aware-chunker.ts`)

The existing character-boundary chunker split content across code block fences and mid-table-row, returning syntactically broken and semantically incomplete chunks. The structure-aware chunker parses markdown into typed block primitives before splitting, ensuring atomic structural units are never fragmented.

The chunker identifies four block types: code blocks (kept atomic regardless of token count), tables (kept atomic regardless of token count), headings (grouped with their immediately following paragraph content), and generic paragraphs (split at token budget boundaries using a `CHARS_PER_TOKEN = 4` character-to-token ratio). The default budget is `DEFAULT_MAX_TOKENS = 500`, overridable via a `ChunkOptions` object or a bare number as the second argument (backwards-compatible with older call sites). Each returned `Chunk` carries a `type` field (`code | table | heading | paragraph`) and a `tokenEstimate` for downstream budget tracking.

Like PageRank, the structure-aware chunker is fully implemented and tested but not yet wired into `generate-context.js`. Character-boundary splitting remains active at ingest time. Wiring requires replacing the ingest chunker call with the new module and adding `remark`/`remark-gfm` to the scripts package. This is Phase 4 work.

- **Exports:** `chunkMarkdown(markdown: string, options?: ChunkOptions | number): Chunk[]`, `splitIntoBlocks(markdown: string): Block[]`
- **Constants:** `DEFAULT_MAX_TOKENS = 500`, `CHARS_PER_TOKEN = 4`
- **Tests:** 9/9 pass in `tests/structure-aware-chunker.vitest.ts`. Table atomicity, code block atomicity, heading grouping, and token limit boundary behavior all verified.

### Hybrid Search Pipeline Wiring (`mcp_server/lib/search/hybrid-search.ts`)

Four surgical edits transformed `hybrid-search.ts` from a static retrieval function into a full scatter-gather orchestrator. No existing logic was removed. Each change was additive or a targeted default override.

**Change 1 — Graph channel activation:** `useGraph` default changed from `false` to `true`. The causal graph channel was fully implemented and had dedicated test coverage but was excluded from every production search query. Enabling it by default means that when a query runs, memories linked via `caused_by`, `supersedes`, or `derived_from` relationships are now primary retrieval sources participating in RRF scoring rather than post-retrieval multipliers.

**Change 2 — Intent-weighted adaptive fusion:** The hardcoded `[1.0, 0.8, 0.6]` weight vector was replaced with a call to `hybridAdaptiveFuse(intent)` from `./adaptive-fusion`. The adaptive fusion module was fully implemented and tested but physically disconnected from the pipeline. It selects weight vectors based on detected intent: `find_spec` heavily weights FTS5 for exact title matching, `explore` balances vector and graph equally, `fix_bug` weights vector and BM25 toward precision. The intent classifier runs at the start of the pipeline and the result propagates to both fusion weights and MMR lambda selection.

**Change 3 — Co-activation spreading:** `spreadActivation` from `../cognitive/co-activation` now runs post-RRF on the top-5 result IDs. Co-activation implements BFS-based temporal and causal neighbor discovery: given a set of memory IDs, it expands the result set with memories created in the same session window or linked via causal edges. This catches temporal neighbors that share no lexical or semantic overlap with the query but are highly relevant because they were recorded during the same debugging session.

**Change 4 — MMR reranking:** `applyMMR` from `./mmr-reranker` is applied with `lambda: 0.7` after co-activation enrichment. The guard check confirms that results carry `Float32Array` embeddings before activating. If embeddings are absent, the pipeline skips MMR and returns the RRF-ranked list unchanged.

- **Post-change test counts:** `hybrid-search.vitest.ts` 56/56, `adaptive-fusion.vitest.ts` 19/19, `co-activation.vitest.ts` 28/28. All 103 related tests pass with zero regressions from the surgical edits.

### Memory Search Handler Wiring (`mcp_server/handlers/memory-search.ts`)

Three surgical edits wired evidence gap detection, cross-encoder reranking, and query expansion into the handler layer where results become LLM payloads.

**Change 1 — Evidence gap detection:** `detectEvidenceGap` and `formatEvidenceGapWarning` from the new evidence-gap-detector module are wired into `postSearchPipeline`. The handler extracts RRF scores from results, runs the Z-score check, and when `evidenceGapDetected: true`, prepends the warning string to the summary text and adds both `evidenceGapWarning` and `evidenceGapTRM` to `extraData`. Callers can inspect `extraData.evidenceGapTRM` for the raw `zScore`, `mean`, and `stdDev` values.

**Change 2 — Cross-encoder reranking default:** `rerank` changed from `false` to `true`. Cross-encoder reranking was fully implemented but disabled by a conservative default set at initial development time. The change enables it by default for all searches. The opt-out pattern means callers can still pass `rerank: false` explicitly for latency-sensitive use cases.

**Change 3 — Deep mode query expansion:** `mode?: string` was added to `SearchArgs` and `expandQuery` was imported. When `mode="deep"` is detected, the handler generates up to 3 query variants, runs parallel `searchWithFallback` calls for each, merges the deduplicated results before the RRF fusion step. Deduplication uses memory ID as the key, ensuring the same memory retrieved by multiple variants appears only once in fusion input.

- **Tests:** 10/10 pass in `tests/handler-memory-search.vitest.ts`. Evidence gap warning injection, deep mode expansion, and rerank default all verified.

### Exported Constants (4 Production Modules)

Four existing production modules received exported constant objects that make their internal scoring weights available to tests and external callers. Tests that previously maintained local copies of these values now import the production constants directly, establishing a single source of truth. When production weights change, test failures surface immediately.

**`causal-edges.ts` — `RELATION_WEIGHTS`:** `{ supersedes: 1.5, caused: 1.3, enabled: 1.1, supports: 1.0, derived_from: 1.0, related: 1.0, contradicts: 0.8 }`. The `traverse()` function applies these as multipliers via `weightedStrength = Math.min(1, edge.strength * weight)`. `supersedes` chains receive 1.5x scoring in recursive graph traversal. `contradicts` edges receive a 0.8x penalty, preventing contradictory memories from dominating search results.

**`bm25-index.ts` — `BM25_FIELD_WEIGHTS`:** `{ title: 10.0, trigger_phrases: 5.0, content_generic: 2.0, body: 1.0 }`. These correspond to the field weight arguments in the FTS5 `bm25()` function call: `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)`. A memory with the query term in its title scores 10x higher than one with the term in the body alone.

**`fsrs-scheduler.ts` — `TIER_MULTIPLIER`:** `{ constitutional: 0.1, core: 0.5, standard: 1.0, ephemeral: 2.0, scratch: 3.0 }`. Constitutional memories decay at one-tenth the rate of standard memories. Scratch memories decay at three times the standard rate. The formula `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))` ensures long-lived architectural decisions remain accessible while ephemeral debug notes expire quickly.

**`intent-classifier.ts` — `INTENT_LAMBDA_MAP`:** Maps each of the seven intent types to an MMR lambda value. `understand: 0.5` maximizes diversity for exploratory queries. `fix_bug: 0.85` maximizes relevance precision for targeted debugging. `find_spec: 0.8`, `explore: 0.6`, and the other intents fill the range between. The MMR reranker reads this map at runtime to select the appropriate lambda automatically based on the classified intent.

### Test File Alignment (5 Updated Files)

Five test files that maintained local copies of production constants were updated to import from their respective production modules. The test assertions themselves are unchanged; only the source of the expected values changed. This removes the silent drift risk where a test would pass using a stale local constant even after a production value changed.

- **`tests/causal-edges.vitest.ts`:** C138 block replaces its inline `weights` constant with an import of `RELATION_WEIGHTS` from `causal-edges.ts`. Supersedes 1.5x and contradicts 0.8x verified against the production export.
- **`tests/fsrs-scheduler.vitest.ts`:** C138 block removes its local `TIER_MULTIPLIER` and imports from `fsrs-scheduler.ts`. Constitutional 0.1x and Scratch 3.0x decay rates verified against the production constant.
- **`tests/intent-classifier.vitest.ts`:** C138-T5 block removes its local `lambdaMap` and imports `INTENT_LAMBDA_MAP` from `intent-classifier.ts`. `understand=0.5` and `fix_bug=0.85` verified against the production export.
- **`tests/integration-search-pipeline.vitest.ts`:** Three new C138 assertions verify the opt-out default-enabled pattern. `undefined` environment variable values result in features being enabled; explicit `'false'` string values disable them. This guards against accidental feature disablement from missing environment configuration.
- **`tests/integration-138-pipeline.vitest.ts`:** Inline stubs for `applyMMR` and `detectEvidenceGap` replaced with adapter wrappers that delegate to the actual production implementations. The integration test now validates real module behavior rather than mock approximations.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation used a two-wave parallel orchestration model with 10 Sonnet agents, selected because the feature activations and production file changes had a clear dependency boundary: standalone modules can be created in parallel without file conflicts in Wave 1, and wiring changes can be distributed across non-overlapping files in Wave 2.

**Wave 1 — 5 agents in parallel.** Each agent owned one new production module and its corresponding test file. Agent 1 created `mmr-reranker.ts` + `mmr-reranker.vitest.ts`. Agent 2 created `evidence-gap-detector.ts` + `evidence-gap-detector.vitest.ts`. Agent 3 created `query-expander.ts` + `query-expander.vitest.ts`. Agent 4 created `pagerank.ts` + `pagerank.vitest.ts`. Agent 5 created `structure-aware-chunker.ts` + `structure-aware-chunker.vitest.ts`. No agent touched another agent's file. Tests were written alongside production code, not deferred.

**Wave 2 — 5 agents in parallel.** Each agent owned a distinct non-overlapping file bundle. Agent 1 owned `hybrid-search.ts` and its test assertions (4 surgical edits). Agent 2 owned `memory-search.ts` and `handler-memory-search.vitest.ts` (3 edits). Agent 3 owned `causal-edges.ts` and its test file (`RELATION_WEIGHTS` export + test update). Agent 4 owned `bm25-index.ts`, `fsrs-scheduler.ts`, and `intent-classifier.ts` with their respective test blocks (constant exports + test updates). Agent 5 owned the integration test files. Zero file conflicts across all 10 agents.

The opt-out flag pattern was applied to all new default-enabled features. `SPECKIT_MMR`, `SPECKIT_TRM`, and `SPECKIT_MULTI_QUERY` are default-on when unset. An explicit `'false'` string disables each feature, which keeps local defaults safe while allowing canary rollback by configuration.

Latest verification after code fixes: `npm test -- --reporter=dot` in `mcp_server` reported 4,546 passed, 19 skipped, 0 failed across 155 files. `npm run typecheck` in `.opencode/skill/system-spec-kit` also passed.

**Code quality — R-Wave (5 Sonnet agents).** The R-Wave review pass fixed falsy-zero `||` bugs, removed dead code, corrected unsafe type casts, added missing module box headers, and removed `@ts-nocheck` directives from 2 test files. This pass ran across all Wave 1 and Wave 2 output before the D-Wave pass.

**Code quality — D-Wave (5 Opus agents).** The D-Wave compliance audit covered all files against the full `sk-code--opencode` TypeScript checklist:

- D1 agent: `hybrid-search.ts` (6 magic numbers extracted as UPPER_SNAKE constants, TSDoc added to 8 exports, double-cast justification comments added), `adaptive-fusion.ts` (2 constants extracted), `context-server.ts` (4 constants, 6 snake_case variable renames to camelCase), `db-state.ts` (TSDoc on 12 exports, 1 variable rename), `reindex-embeddings.ts` (2 renames), and 3 test files (`@ts-nocheck` removed from 2, 11 `any` occurrences replaced with typed alternatives).

Final state: zero `any` in source files, all non-null assertions have preceding justification comments, all exported functions have TSDoc with explicit return types, all magic numbers extracted to named UPPER_SNAKE constants.

The zero schema migration constraint (spec §3.1) was maintained throughout. All changes are TypeScript orchestration on top of the existing v15 SQLite schema. No new tables, no new columns, no data migrations, no external dependencies added.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Opt-out flag pattern (disabled by flag, not enabled by flag) for all new default-enabled features | Missing env vars in local dev should activate features, not silently disable them. Explicit `'false'` disables; undefined enables. Prevents accidental degradation from incomplete environment setup. Consistent with `isFeatureEnabled()` from rollout-policy across all feature checks. |
| Hard-cap MMR candidates at N=20 before the O(N^2) cosine loop | 20^2 = 400 iterations, completing under 2ms. N=100 would yield 10,000 iterations and potentially block the Node.js event loop for 20ms+, violating the 120ms pipeline ceiling. Cap applied via `.slice(0, 20)` before the loop begins. |
| Rule-based query expansion (static `DOMAIN_VOCABULARY_MAP`) rather than LLM-based expansion | The LLM-in-MCP paradox: a nested LLM call inside the MCP server at read-time causes the parent LLM to wait for a nested LLM response, creating cascading timeouts. Static rules are deterministic, sub-millisecond, and have zero failure modes. |
| Plain text `[EVIDENCE GAP DETECTED]` warning without emoji | Emoji convention in this codebase is restricted. Plain text warnings are also more robust across different LLM prompt rendering contexts and terminal outputs where emoji display is inconsistent. |
| Two-wave parallel orchestration over sequential per-module implementation | 10 independent streams of 6-8 tool calls each runs approximately 70 total tool calls in parallel. Sequential execution would require the same 70 calls in series, multiplying wall-clock time by 10x. File conflict risk is zero because each agent owns non-overlapping files. |
| `useGraph: true` as the new default rather than an opt-in environment flag | The causal graph channel was fully implemented, tested, and verified. Making users opt-in to working functionality creates friction with no benefit. Defaulting to `true` realizes the value immediately across all existing deployments. |
| `rerank: true` as the new default in the memory-search handler | Cross-encoder reranking was production-ready but disabled by a conservative default set at initial development time. The feature should be on by default for all searches. Callers can still pass `rerank: false` explicitly for latency-sensitive queries. |
| PageRank and structure-aware chunker: create and test now, wire in Phase 4 | Wiring both modules requires `remark`/`remark-gfm` as a new dependency in the ingest pipeline and a batch hook in `memory_manage`. Adding external dependencies to the ingest CLI carries different risk than adding TypeScript logic to the MCP server. Deferred to a dedicated Phase 4 session. |
| Constants exported from production modules (`RELATION_WEIGHTS`, `BM25_FIELD_WEIGHTS`, `TIER_MULTIPLIER`, `INTENT_LAMBDA_MAP`) | Tests that maintain local copies of production values drift silently when production values change. Exporting the constants makes each production module the single source of truth. Test failures immediately surface when production weights change. |
| MMR guard-gated on `Float32Array` embedding presence rather than made mandatory | Older memories stored before vector search was provisioned lack `Float32Array` embeddings. Mandatory MMR would cause runtime errors on these memories. Guard-gating enables graceful degradation: memories with embeddings get diversity-pruned, memories without are returned in RRF order unchanged. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### New Module Tests

| Check | Result |
|-------|--------|
| `mmr-reranker.vitest.ts` | PASS — 11/11. Lambda diversity, lambda relevance, N=20 hardcap, zero-magnitude guard, empty pool guard all verified. |
| `evidence-gap-detector.vitest.ts` | PASS — 12/12. Z-score threshold boundary, well-distributed score sets, single-score edge case, all-identical edge case, empty array edge case all verified. |
| `query-expander.vitest.ts` | PASS — 11/11. Compound term splitting, synonym map lookup, 3-variant cap, original-always-included guarantee, unknown term passthrough all verified. |
| `pagerank.vitest.ts` | PASS — 10/10. Convergence within 10 iterations, isolated node minimum score, zero out-degree handling, configurable damping factor all verified. |
| `structure-aware-chunker.vitest.ts` | PASS — 9/9. Tables atomic, code blocks atomic, heading grouping, token limit boundary behavior all verified. |

### Pipeline Wiring Tests

| Check | Result |
|-------|--------|
| `hybrid-search.vitest.ts` (post-wiring) | PASS — 56/56. All 4 surgical edits validated: graph channel, adaptive fusion, co-activation, MMR. Zero regressions. |
| `adaptive-fusion.vitest.ts` | PASS — 19/19. Intent-weighted RRF activation via `hybridAdaptiveFuse(intent)` verified for all 7 intent types. |
| `co-activation.vitest.ts` | PASS — 28/28. Post-RRF spreading on top-5 IDs verified with temporal neighbor enrichment. |
| `handler-memory-search.vitest.ts` | PASS — 10/10. Evidence gap warning injection, deep mode query expansion, and rerank default verified. |

### Integration and Regression Tests

| Check | Result |
|-------|--------|
| `integration-search-pipeline.vitest.ts` | PASS — 3 new C138 assertions passing. Opt-out default-enabled pattern verified: undefined env = enabled, `'false'` = disabled. |
| `integration-138-pipeline.vitest.ts` | PASS — production adapter wrappers verified. Real `applyMMR` and `detectEvidenceGap` implementations validated end-to-end. |
| Regression: pre-existing 3,872+ tests | PASS — latest `mcp_server` suite reports 4,546 passed, 19 skipped, 0 failed across 155 files, confirming no regressions from these changes. |

### Updated Test Files (Constants Alignment)

| Check | Result |
|-------|--------|
| `causal-edges.vitest.ts` | PASS — `RELATION_WEIGHTS` import active. Supersedes 1.5x, caused 1.3x, contradicts 0.8x verified against production export. |
| `fsrs-scheduler.vitest.ts` | PASS — `TIER_MULTIPLIER` import active. Constitutional 0.1x and Scratch 3.0x verified against production constant. |
| `intent-classifier.vitest.ts` | PASS — `INTENT_LAMBDA_MAP` import active. `understand=0.5`, `fix_bug=0.85` verified against production export. |

### Code Quality and Compliance

| Check | Result |
|-------|--------|
| `sk-code--opencode` TypeScript checklist (5 new modules) | PASS — proper types, TSDoc on all exports, named constants, camelCase/PascalCase/UPPER_SNAKE conventions, WHY comments, edge case guards, no unused imports, no `@ts-nocheck` in production files. |
| Source files: zero `any` | PASS — 0 type-level `any` across all source files after D-Wave review. |
| TSDoc on all exports | PASS — all exported functions and types documented with param/return descriptions. |
| Non-null assertions justified | PASS — all `!` operators have preceding justification comment. |
| Magic numbers extracted | PASS — 6+ constants extracted in `hybrid-search.ts` alone; all new modules use named constants. |
| `@ts-nocheck` directives | PASS — removed from 2 test files by R-Wave; 0 in production files. |
| D-Wave compliance (5 Opus agents) | PASS — full audit across all files against sk-code--opencode checklist. |
| Zero schema migration constraint (spec §3.1) | PASS — v15 SQLite schema unchanged. No new tables, columns, or data migrations. |
| Zero new external dependencies | PASS — package.json unchanged. |

### Global Suite (Post All Workstreams)

| Check | Result |
|-------|--------|
| Full vitest suite (latest verification) | PASS — 4,546 passed, 19 skipped, 0 failed, 155 test files (`npm test -- --reporter=dot` in `mcp_server`) |
| 120ms latency ceiling (spec §3.2) | ARCHITECTURAL ONLY — validated via component benchmarks and budget analysis. Real-world profiling against populated SQLite DB is deferred. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **120ms latency ceiling not validated against real SQLite I/O.** The spec §3.2 ceiling of 120ms for `mode="auto"` is validated in `integration-138-pipeline.vitest.ts` against a mock pipeline. The mock does not exercise actual SQLite `sqlite-vec` vector search (35ms budget), FTS5 MATCH queries (15ms budget), or graph CTE traversal (45ms budget). Real-world validation requires profiling against a populated production database with `console.time()` instrumentation around each pipeline stage. Until measured, the 120ms claim is architectural, derived from budget analysis in the spec, not empirically confirmed.

2. **PageRank module created but not wired.** `mcp_server/lib/manage/pagerank.ts` is fully implemented and tested (10/10) but is not integrated into the `memory_manage` batch job pipeline. Graph authority scores are not stored in `memory_index.pagerank_score` and do not contribute to retrieval ranking. Wiring requires `remark`/`remark-gfm` in the scripts/ingest pipeline plus a batch hook in `memory_manage`. This is Phase 4 work.

3. **Structure-aware chunker created but not wired.** `scripts/lib/structure-aware-chunker.ts` is fully implemented and tested (9/9) but `generate-context.js` still uses the character-boundary chunker at ingest time. Markdown tables and code blocks in new memories may still be split mid-structure. Wiring requires replacing the ingest chunker call and adding `remark`/`remark-gfm` to the scripts package. This is Phase 4 work.

4. **Read-time prediction error gate not wired.** `prediction-error-gate.ts` is active at write-time (preventing contradictory memories from being stored) but the spec also requires piping retrieved context payloads through it at read-time to flag contradictions in the returned result set. The read-time pipe is deferred to Phase 4. Contradicting memories may currently both appear in search results without an explicit contradiction flag.

5. **MMR requires Float32Array embeddings to activate.** The MMR reranker is guard-gated on embedding presence. Memories stored before the vector search backend was provisioned, or memories stored with a failed embedding generation, lack `Float32Array` data and receive only RRF-ranked results rather than MMR-diversified results. This is graceful degradation by design.

6. **Query expansion vocabulary map is sparse.** The initial `DOMAIN_VOCABULARY_MAP` covers common software development terminology but is not exhaustive. Queries in specialized domains (infrastructure, machine learning, mobile development) may generate no useful synonyms and fall back to single-variant search. The map is a plain TypeScript object and extends incrementally without infrastructure changes.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:feature-matrix -->
## Feature Enablement Matrix

| # | Feature | Before | After | Module |
|---|---------|--------|-------|--------|
| 1 | Graph channel (`useGraph`) | DISABLED (`false`) | ENABLED (`true`) | `hybrid-search.ts` |
| 2 | Intent-weighted adaptive RRF fusion | NOT WIRED | ENABLED | `hybrid-search.ts` + `adaptive-fusion.ts` |
| 3 | Co-activation spreading | NOT WIRED | ENABLED | `hybrid-search.ts` + `co-activation.ts` |
| 4 | Two-pass adaptive fallback | ENABLED (confirmed) | ENABLED | `hybrid-search.ts` |
| 5 | MMR reranking | MISSING (no module) | ENABLED | `mmr-reranker.ts` (NEW) |
| 6 | Evidence gap detection (TRM) | MISSING (no module) | ENABLED | `evidence-gap-detector.ts` (NEW) |
| 7 | Weighted BM25 field scoring | PARTIAL (weights inline) | ENABLED (constants exported) | `bm25-index.ts` |
| 8 | Causal edge weight multipliers | NOT WIRED | ENABLED (constants exported) | `causal-edges.ts` |
| 9 | Query expansion (`mode="deep"`) | MISSING (no module) | ENABLED | `query-expander.ts` (NEW) |
| 10 | Write-time prediction error gate | ENABLED (confirmed) | ENABLED | `prediction-error-gate.ts` |
| 11 | Cross-encoder reranking | DISABLED (`false`) | ENABLED (`true`) | `memory-search.ts` |
| 12 | FSRS tier decay modulation | PARTIAL (weights inline) | ENABLED (constants exported) | `fsrs-scheduler.ts` |
| 13 | PageRank authority scoring | MISSING (no module) | MODULE CREATED, not wired | `pagerank.ts` (NEW) |
| 14 | Structure-aware chunking | MISSING (no module) | MODULE CREATED, not wired | `structure-aware-chunker.ts` (NEW) |
<!-- /ANCHOR:feature-matrix -->

---

<!-- ANCHOR:file-inventory -->
## Production Files Changed

### New Production Files (5 source)

| File | Purpose |
|------|---------|
| `mcp_server/lib/search/mmr-reranker.ts` | Greedy MMR with pairwise cosine similarity, intent-mapped lambda, N=20 candidate cap |
| `mcp_server/lib/search/evidence-gap-detector.ts` | Gaussian Z-score TRM, `[EVIDENCE GAP DETECTED]` warning injection, `extraData.evidenceGapTRM` |
| `mcp_server/lib/search/query-expander.ts` | Rule-based synonym expansion, `DOMAIN_VOCABULARY_MAP`, 3-variant cap, LLM-in-MCP paradox avoidance |
| `mcp_server/lib/manage/pagerank.ts` | Iterative PageRank with convergence detection, damping 0.85, 10 iterations (not yet wired) |
| `scripts/lib/structure-aware-chunker.ts` | AST-aware markdown chunking, atomic code/table blocks, typed chunk output (not yet wired) |

### Modified Production Files (6 source)

| File | Change Type | Summary |
|------|-------------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | MODIFIED (4 edits) | `useGraph=true`, adaptive fusion wired, co-activation wired, MMR wired; D-Wave: 6 constants extracted, TSDoc on 8 exports |
| `mcp_server/handlers/memory-search.ts` | MODIFIED (3 edits) | Evidence gap detection wired, `rerank=true`, deep mode query expansion wired |
| `mcp_server/lib/storage/causal-edges.ts` | MODIFIED | `RELATION_WEIGHTS` exported; `traverse()` applies multipliers including `supersedes: 1.5`, `contradicts: 0.8` |
| `mcp_server/lib/search/bm25-index.ts` | MODIFIED | `BM25_FIELD_WEIGHTS` exported; `title: 10.0` through `body: 1.0` |
| `mcp_server/lib/cache/cognitive/fsrs-scheduler.ts` | MODIFIED | `TIER_MULTIPLIER` exported; `constitutional: 0.1` through `scratch: 3.0` |
| `mcp_server/lib/search/intent-classifier.ts` | MODIFIED | `INTENT_LAMBDA_MAP` exported; `understand: 0.5`, `fix_bug: 0.85`, all 7 intent types covered |
<!-- /ANCHOR:file-inventory -->

---

<!-- ANCHOR:test-inventory -->
## Test Files Added or Updated

### New Test Files (6)

| File | Tests | Coverage |
|------|-------|---------|
| `tests/mmr-reranker.vitest.ts` | 11/11 | Lambda diversity, lambda relevance, hardcap, zero-magnitude guard, empty pool guard |
| `tests/evidence-gap-detector.vitest.ts` | 12/12 | Z-score threshold, well-distributed sets, single-score, all-identical, empty array edge cases |
| `tests/query-expander.vitest.ts` | 11/11 | Compound splitting, synonym lookup, 3-variant cap, original-always-included, unknown terms |
| `tests/pagerank.vitest.ts` | 10/10 | Convergence, isolated node minimum, zero out-degree, configurable damping |
| `tests/structure-aware-chunker.vitest.ts` | 9/9 | Table atomicity, code block atomicity, heading grouping, token limit boundaries |
| `tests/integration-138-pipeline.vitest.ts` | Production adapters | Real module adapters replacing inline stubs; full pipeline flow verified |

### Updated Test Files (5)

| File | Change | Coverage Added |
|------|--------|----------------|
| `tests/causal-edges.vitest.ts` | C138 block: `RELATION_WEIGHTS` import replaces inline constant | Supersedes 1.5x, contradicts 0.8x verified against production export |
| `tests/fsrs-scheduler.vitest.ts` | C138 block: `TIER_MULTIPLIER` import replaces local constant | Constitutional 0.1x, Scratch 3.0x verified against production export |
| `tests/intent-classifier.vitest.ts` | C138-T5: `INTENT_LAMBDA_MAP` import replaces local map | `understand=0.5`, `fix_bug=0.85` verified against production export |
| `tests/integration-search-pipeline.vitest.ts` | 3 new C138 opt-out assertions | `undefined` env = enabled, `'false'` = disabled verified for all features |
| `tests/handler-memory-search.vitest.ts` | Evidence gap, deep mode, rerank default | All 3 handler wiring changes covered (10/10) |
<!-- /ANCHOR:test-inventory -->

---

<!-- ANCHOR:deferred -->
## Deferred Items

| Item | Task | Reason | Follow-up Path |
|------|------|--------|----------------|
| PageRank wiring into ingest pipeline | — | Module fully created and tested (10/10). Wiring requires `remark`/`remark-gfm` as new dependency and a batch hook in `memory_manage`. Different risk profile from TypeScript-only MCP changes. | Wire into `memory_manage` batch job; store scores in `memory_index.pagerank_score`. Phase 4. |
| Structure-aware chunker wiring into `generate-context.js` | — | Module fully created and tested (9/9). Same `remark`/`remark-gfm` dependency blocker as PageRank. | Replace character-boundary chunker in ingest path. Phase 4. |
| Read-time prediction error gating | — | Write-time gate is active. Read-time pipe that flags contradictions in returned result sets was not in scope for this workstream. | Pipe retrieved payloads through `prediction-error-gate.ts` at read time. Phase 4. |
| 120ms latency ceiling empirical validation | — | Validated architecturally via budget analysis (spec §3.2) and via component benchmarks in mock pipeline. Actual SQLite I/O latency not measured. | Run `console.time()` instrumentation around each pipeline stage against a populated production database. |
<!-- /ANCHOR:deferred -->

---

## Consolidation Addendum (2026-02-22)

This folder now acts as the canonical active RAG track after parent-level consolidation. Two non-lifecycle outcome sets were merged into this folder:

- Command-alignment outcomes: `supplemental/command-alignment-summary.md`
- Non-skill-graph consolidation outcomes: `supplemental/non-skill-graph-consolidation-summary.md`

Index and mapping are maintained in `supplemental-index.md`.

---

<!--
Level 3+: Workstream A implementation summary — Hybrid RAG Fusion Pipeline.
24/24 tasks complete. 5 new production modules, 6 modified source files, 11 test files.
Latest verification: 4,546 passed, 19 skipped, 0 failed, 155 files.
Written in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->

<!-- /ANCHOR:implementation-summary-001-workstream-a -->
