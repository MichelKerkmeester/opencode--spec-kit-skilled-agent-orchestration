# Iteration 17: Definitive Q5 Compilation -- Code vs Spec and Code vs Standards Misalignments

## Focus
Compile ALL code-vs-spec and code-vs-standard misalignments discovered across iterations 1-16 into a single definitive Q5 inventory. Categorize into: (a) spec-vs-code, (b) code-vs-standards, (c) dead code, (d) naming inconsistencies. This is a synthesis iteration consolidating evidence from 16 prior iterations.

## Method
No new codebase research. Cross-referenced iteration files 001, 002, 004, 005, 007, 014, and 016 plus strategy.md question answers to extract every misalignment, dead code instance, naming issue, and code smell reported across the entire research campaign.

---

## Findings: Comprehensive Misalignment Inventory

### CATEGORY A: Spec-vs-Code Misalignments (Documentation Claims Contradicted by Code)

**A1. "4 search channels" -- spec undercounts by 1-2**
The spec and prior documentation claim "4 search channels" (vector, BM25, FTS5, graph). Code reality: `SOURCE_TYPES` in rrf-fusion.ts defines 6 labels (VECTOR, FTS, BM25, GRAPH, DEGREE, KEYWORD), and query-router.ts defines a 5-element `ChannelName` type. At least 5 channels are actively routed (vector, fts, bm25, graph, degree). The 6th label (KEYWORD) may not have a dedicated search path. The spec's "4 channels" claim is architecturally misleading.
[SOURCE: iter-4 F1, iter-14 Claim 1; rrf-fusion.ts:12-18, query-router.ts:22]

**A2. "15+ scoring signals" -- directionally correct but architecturally misleading**
Stage 2 has exactly 12 ordered scoring steps (per its own comment block at line 21 and 538 of stage2-fusion.ts). The file contains 99 `const` declarations, but many are thresholds, temporaries, and utility values. "15+ signals" is in the right ballpark but obscures the architectural truth of 12 sequential steps with nested sub-computations.
[SOURCE: iter-14 Claim 2; stage2-fusion.ts:21, :538]

**A3. "Dedup uses cosine similarity" -- false**
dedup.ts contains zero references to cosine, dotProduct, or embedding-based similarity. Its dedup mechanism is purely SHA-256 hash-based: same-path hash comparison (layer 1) and cross-path hash comparison (layer 2). Only the separate PE-gating module (pe-gating.ts, layer 3) uses semantic comparison. The claim that "dedup uses cosine similarity" conflates two distinct modules.
[SOURCE: iter-14 Claim 10; dedup.ts:9-11, :105-252]

**A4. 76 feature flags vs spec's governance model**
The spec references a bounded feature flag system with ~6 roadmap capability flags. The actual codebase contains 76 unique `SPECKIT_*` environment variable names across lib/. There is no central registry, no manifest, no sunset dates, no expiry mechanisms. Only one flag has a `@deprecated` annotation (PIPELINE_V2, always true). The gap between spec's implied governance and actual flag sprawl is enormous.
[SOURCE: iter-7 F1-F9; grep census across mcp_server/lib/]

**A5. Three divergent score resolution chains -- unstated in spec**
Three functions resolve the "final score" of a memory with different field precedence orders:
- `resolveEffectiveScore()` (types.ts): intentAdjustedScore -> rrfScore -> score -> similarity/100
- `compareDeterministicRows()` (ranking-contract.ts): score -> intentAdjustedScore -> rrfScore -> similarity/100
- `extractScoringValue()` (stage4-filter.ts): rrfScore -> intentAdjustedScore -> score -> similarity (RAW, not /100)

The spec does not document this divergence. When `withSyncedScoreAliases()` runs, all fields are identical and divergence is masked. But error paths, early returns, or partial processing can leave aliases unsynced, causing sorting and filtering to disagree. Additionally, `extractScoringValue` has a 100x scale mismatch (similarity raw vs /100).
[SOURCE: iter-1 F3/F9, iter-2 F1, iter-16 A1]

---

### CATEGORY B: Code-vs-Standards Misalignments (sk-code-opencode and Engineering Practices)

**B1. Pipeline orchestrator has zero error handling**
The 79-line orchestrator calls all 4 stages with bare `await`. No try/catch, no timeout protection, no partial-result fallback, no circuit breaker. Any unhandled exception crashes the entire pipeline with an unstructured error. The structured error infrastructure (MemoryError, buildErrorResponse, withTimeout) exists but is never used by the pipeline.
[SOURCE: iter-6 F1/F11, iter-16 B1; orchestrator.ts]

**B2. 28 catch blocks follow warn-and-continue with no failure discrimination**
All 28 pipeline catch blocks (16 in Stage 2, 8 in Stage 1, 4 in Stage 3) use the same pattern: `console.warn` + silent continue. No distinction between "feature off by config" vs "feature crashed with error." The `*Applied: false` metadata flag is ambiguous -- callers cannot distinguish disabled from failed.
[SOURCE: iter-6 F2/F10, iter-16 C1]

**B3. No end-to-end pipeline latency metric**
Timing instrumentation exists in cross-encoder (circuit breaker + latency tracker), stage4-filter (durationMs), and vector-index-queries. The orchestrator has zero timing code. No metric captures total pipeline execution time. This violates observability standards.
[SOURCE: iter-13, iter-16 C2]

**B4. Three distinct feature flag semantics coexist with no documentation**
- Default-ON (graduated): `isFeatureEnabled()` returns true unless explicitly `=false`. Examples: SPECKIT_MMR, SPECKIT_GRAPH_SIGNALS.
- Default-OFF (opt-in): Explicit `=== 'true'` check. Examples: SPECKIT_RECONSOLIDATION, SPECKIT_FILE_WATCHER.
- Multi-state: SPECKIT_GRAPH_WALK_ROLLOUT has 3 states: 'off', 'trace_only', 'bounded_runtime'.

No documentation maps which flags use which semantics. A developer encountering an unknown flag has to read its implementation to determine default behavior.
[SOURCE: iter-7 F3; search-flags.ts:93-95, :156-169, :230-233]

**B5. FSRS write-back has read-then-write race condition**
`strengthenOnAccess` does SELECT stability -> compute -> UPDATE stability without transaction isolation. Two concurrent searches produce correct individual updates but the second silently overwrites the first. SQLite single-writer prevents corruption but one FSRS update is lost per race.
[SOURCE: iter-6 F5, iter-16 A2]

**B6. BM25 spec-folder filter uses N+1 query pattern**
Each BM25 result triggers an individual `SELECT spec_folder FROM memory_index WHERE id = ?` inside a `.filter()` loop. 50 results = 50 separate DB queries instead of one batched query.
[SOURCE: iter-13, iter-16 B5]

**B7. Embedding cache key ignores model ID**
Cache key is content-hash only, not content-hash + model-id. Model swap produces stale embeddings that are silently returned for new queries.
[SOURCE: iter-9, iter-16 A3]

**B8. Redundant requireDb() calls without circuit breaker**
Up to 4 Stage 2 steps independently call `requireDb()`. If the DB is unavailable, each step discovers this separately, logs a separate warning, and continues. No shared "DB unavailable" state.
[SOURCE: iter-6 F9, iter-16 C3]

**B9. Query classifier confidence field is computed but never consumed**
query-classifier.ts computes a confidence score in its output, but no caller reads it. Dead data that costs computation time.
[SOURCE: iter-12 (query expansion analysis)]

**B10. `memory_search` has 28 parameters including a duplicate**
`minQualityScore` (camelCase) and `min_quality_score` (snake_case) are both accepted for the same parameter. The rest of the interface uses camelCase, but TriggerArgs uses snake_case (`session_id`, `include_cognitive`). This violates consistent naming standards.
[SOURCE: iter-11; tools/types.ts]

---

### CATEGORY C: Dead Code

**C1. `applyIntentWeights()` in intent-classifier.ts -- zero imports**
The function (lines 485-525) takes generic `Record<string, unknown>[]` and applies intent scoring. Stage 2 reimplements the same logic with typed `PipelineRow` inputs and superior recency computation (`applyIntentWeightsToResults()` in stage2-fusion.ts:310-349). The intent-classifier version has zero imports across lib/.
[SOURCE: iter-4 F3, iter-14, iter-16 D1]

**C2. `detectIntent()` alias -- trivial 1-line alias for `classifyIntent()`**
Both are exported from intent-classifier.ts. `detectIntent()` (line 464-466) is a single-line wrapper that calls `classifyIntent()`. Adds API surface without value.
[SOURCE: iter-4 F8]

**C3. `GRAPH_WEIGHT_BOOST=1.5` in rrf-fusion.ts -- overridden by explicit weight**
hybrid-search.ts always passes explicit `weight: 0.5` for graph results, which overrides the boost (boost only applies when weight is undefined). The constant is defined, documented, but functionally inert in the main pipeline.
[SOURCE: iter-5 F2, iter-16 D2]

**C4. `FusionWeights.graphWeight` and `graphCausalBias` -- declared, set, never consumed**
The `FusionWeights` interface declares both fields. All 7 intent profiles set values (graphWeight 0.10-0.50). `adaptiveFuse()` only processes `semanticWeight` and `keywordWeight`. The graph weight values are computed and returned in the result metadata but never applied to any channel scoring.
[SOURCE: iter-5 F5/F6, iter-16 B2]

**C5. 5-factor scoring model -- complete but dormant**
The 5-factor model (temporal, usage, importance, pattern, citation) exists, is tested, and is structurally complete, but `use_five_factor_model: true` is never passed in production code. Zero production callers. Only the legacy 6-factor model (similarity, importance, recency, popularity, tierBoost, retrievability) is live.
[SOURCE: iter-3, iter-7, iter-16 D3]

**C6. RSF fusion -- shadow-only with no activation path**
RSF (Reciprocal Score Fusion) is dormant and only records shadow scores for offline comparison. No test verifies what happens when RSF is switched to production mode. Only RRF is the live fusion algorithm.
[SOURCE: iter-2 F3, iter-15, iter-16 D4]

**C7. temporal-contiguity.ts -- zero production callers**
181 LOC with zero production integration. The only module in the 11-file cognitive subsystem (4,644 LOC total) that has no callers.
[SOURCE: iter-10 (cognitive subsystem review)]

**C8. SPECKIT_PIPELINE_V2 flag -- always returns true regardless of setting**
`isPipelineV2Enabled()` always returns `true`. Setting the env var to `false` still returns `true`. V1 was removed. The flag is vestigial.
[SOURCE: iter-7 F8, iter-14 Claim 3]

**C9. R12 expansion confidence field -- computed, never consumed**
query-classifier.ts outputs a confidence field that no downstream consumer reads. Dead data.
[SOURCE: iter-12]

---

### CATEGORY D: Naming Inconsistencies

**D1. Hydra/Speckit dual-environment naming**
Every roadmap capability flag exists as both `SPECKIT_MEMORY_*` (canonical) and `SPECKIT_HYDRA_*` (legacy). 12 of the 76 flags are legacy Hydra aliases. The system was renamed from "Hydra" to "Speckit Memory Roadmap" but the legacy env vars are still honored. Creates confusion about which prefix is authoritative.
[SOURCE: iter-4 F6, iter-7 F7; capability-flags.ts:38-54]

**D2. `graphUnified` naming overlap**
`graphUnified` in capability-flags.ts refers to roadmap phase tracking, while `SPECKIT_GRAPH_UNIFIED` in rollout-policy.ts controls runtime graph behavior. Same name, different systems, different semantics.
[SOURCE: iter-4 F6; capability-flags.ts vs rollout-policy.ts]

**D3. `memory_drift_why` MCP tool name -- misfiled outside causal group**
Should be `memory_causal_trace` or similar to be grouped with the other causal tools (`memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`). The `drift_why` name is semantically disconnected from its actual function (causal chain tracing).
[SOURCE: iter-11]

**D4. TriggerArgs snake_case vs camelCase inconsistency**
TriggerArgs uses `session_id` and `include_cognitive` (snake_case) while all other MCP tool parameter interfaces use camelCase. The same tool (`memory_search`) has duplicate parameters: `minQualityScore` (camelCase) and `min_quality_score` (snake_case) for the same value.
[SOURCE: iter-11; tools/types.ts]

**D5. Feature flag categorization is implicit**
76 flags fall into at least 7 implicit categories (search quality, graph, eval, cognitive, governance, indexing, save pipeline) but there is no enum, manifest, or documentation mapping flags to categories. A developer encountering `SPECKIT_INTERFERENCE_SCORE` must grep to discover what it does.
[SOURCE: iter-7 F9]

---

## Summary Statistics

| Category | Count | Severity |
|----------|-------|----------|
| A: Spec-vs-code | 5 | 3 HIGH (A1, A4, A5), 2 MEDIUM (A2, A3) |
| B: Code-vs-standards | 10 | 2 HIGH (B1, B2), 5 MEDIUM (B3-B7), 3 LOW (B8-B10) |
| C: Dead code | 9 | 2 MEDIUM (C5, C6 -- substantial dormant systems), 7 LOW |
| D: Naming | 5 | 1 MEDIUM (D1), 4 LOW |
| **TOTAL** | **29** | 5 HIGH, 9 MEDIUM, 15 LOW |

### Top 5 Most Impactful Misalignments

1. **76 feature flags vs spec governance** (A4) -- Largest divergence between documentation's implied bounded system and actual flag sprawl. Root cause of multiple downstream issues (no sunset, no registry, no categorization).

2. **3 divergent score resolution chains** (A5) -- Silent ranking inconsistency on error paths. The 100x scale mismatch in `extractScoringValue` is a latent correctness bug.

3. **Zero orchestrator error handling** (B1) -- Any unhandled exception crashes the entire pipeline. Structured error infrastructure exists but is unused.

4. **5+ channels vs spec's "4 channels"** (A1) -- Documentation inaccuracy that affects architectural understanding and onboarding.

5. **3 conflicting weight systems** (B2 + C3 + C4) -- Three systems set channel weights; two contain dead values. The adaptive fusion's graphWeight is set in all 7 intent profiles but never consumed. Creates false sense of intent-aware graph weighting.

## Sources Consulted
- iteration-001.md (pipeline architecture audit)
- iteration-002.md (scoring system deep dive)
- iteration-004.md (cross-system alignment scan)
- iteration-005.md (fusion strategy deep dive)
- iteration-007.md (feature flag governance)
- iteration-014.md (spec vs code reality check -- 10 claims)
- iteration-016.md (Q1 synthesis -- 20 improvements)
- deep-research-strategy.md (all answered question summaries)

## Assessment
- New information ratio: 0.15
- Questions addressed: Q5 (definitive comprehensive answer)
- Questions answered: Q5 (upgraded from partial to definitive)

### newInfoRatio calculation:
29 items total. All 29 are consolidations of previously identified issues from iterations 1-16 -- no genuinely new external information was gathered. However, the synthesis adds value through: (a) comprehensive categorization that did not exist before (4 categories, severity ratings), (b) de-duplication and normalization across 16 iterations of findings, (c) the summary statistics and top-5 ranking. Base ratio: 0.05 (pure consolidation) + 0.10 (simplification bonus for reducing scattered findings across 16 iterations into a single structured inventory with severity ratings) = 0.15.

## Reflection
- What worked and why: Reading the strategy.md answered-question summaries provided the highest-ROI index into which iterations contained misalignment-relevant findings. The iteration-016 synthesis (Q1 answer) had already categorized many findings by effort/impact, making re-categorization by misalignment type straightforward. The 4-category framework (spec-vs-code, code-vs-standards, dead code, naming) emerged naturally from the evidence types.
- What did not work and why: N/A -- pure synthesis iteration with no external research actions.
- What I would do differently: Could have done a fresh codebase scan for additional code smells not caught in prior iterations (e.g., unused imports, inconsistent file headers), but the 12-tool-call budget and synthesis focus made this the right tradeoff.

## Recommended Next Focus
Iteration 18: Begin Phase 5 synthesis. Cross-validate the top 10 findings (A4, A5, B1, A1, B2/C3/C4, B5, B7, C5, C6, B3) with fresh codebase reads to confirm they still hold. Prioritize the 5 HIGH-severity items for spot-check verification.
