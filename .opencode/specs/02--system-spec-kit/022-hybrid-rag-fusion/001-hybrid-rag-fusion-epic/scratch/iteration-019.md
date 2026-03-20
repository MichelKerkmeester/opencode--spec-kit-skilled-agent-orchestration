# Iteration 19: Recommendation Synthesis -- Prioritized Improvement Catalog

## Focus
Compile ALL findings from iterations 1-18 into a categorized, prioritized recommendation catalog. Each recommendation includes priority (P0/P1/P2), effort (S/M/L), impact (1-5), source iterations, and cross-validation status from iteration 18. This is the penultimate synthesis iteration, producing the actionable output of the entire 20-iteration research campaign.

## Method
Pure synthesis of findings from:
- Iteration 16 (Q1 synthesis: 20 pipeline improvements)
- Iteration 17 (Q5 synthesis: 29 misalignments across 4 categories)
- Iteration 18 (cross-validation: 6 confirmed, 3 modified, 1 refuted)
- Strategy.md answered-question summaries (Q1-Q18)

Cross-validation corrections applied: Finding 6 (embedding cache) REFUTED and removed; Finding 3 (flag count) corrected to 81; Finding 5 (FSRS location) corrected; Finding 7 (param count) corrected to 31.

---

## Category A: Bugs / Correctness Issues (Must-Fix)

### A1. Three Divergent Score Resolution Chains
- **Priority:** P0 (critical) | **Effort:** S | **Impact:** 4/5
- **Description:** Three separate functions resolve "final score" with different field precedence orders: `resolveEffectiveScore()` (types.ts), `compareDeterministicRows()` (ranking-contract.ts), `extractScoringValue()` (stage4-filter.ts). When `withSyncedScoreAliases()` runs, divergence is masked. On error/early-return paths where aliases are unsynced, sorting and filtering disagree on rank order. Additionally, `extractScoringValue` uses raw similarity (not /100), creating a 100x scale mismatch in Stage 4 evidence-gap analysis.
- **Fix:** Unify to a single canonical function (the one in types.ts), replace all 3 call sites.
- **Cross-validation:** CONFIRMED (iter-18). All 3 chains still exist with different fallback orders.
- **Source iterations:** 1, 2, 14, 16, 17, 18

### A2. FSRS Write-Back Lost-Update Race Condition
- **Priority:** P2 (improvement) | **Effort:** S | **Impact:** 2/5
- **Description:** FSRS `strengthenOnAccess` performs read-then-write (SELECT stability, compute, UPDATE stability) without transaction isolation. Two concurrent searches reading the same memory lose one FSRS update. SQLite single-writer prevents corruption but spaced-repetition accuracy degrades.
- **Fix:** Wrap in BEGIN IMMEDIATE transaction or use UPDATE with computed expression (`UPDATE ... SET stability = computedExpression(stability)`).
- **Cross-validation:** MODIFIED (iter-18). The write-back path is not in fsrs.ts (which is read-only computation); actual location is in the `trackAccess` parameter flow, likely in Stage 2 or search tools.
- **Source iterations:** 6, 16, 17, 18

### A3. Constitutional Injection Can Bypass Archive Filtering
- **Priority:** P2 (improvement) | **Effort:** S | **Impact:** 2/5
- **Description:** In Stage 1, constitutional rows injected via vector search bypass `applyArchiveFilter` (which only runs for R8 summary hits). Archived constitutional memories could enter the pipeline.
- **Fix:** Add archive check to constitutional injection path.
- **Cross-validation:** Not cross-validated in iter-18 (low priority).
- **Source iterations:** 1, 16

### A4. Concurrent Save Dedup Race (No Transaction Isolation)
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 3/5
- **Description:** No transaction isolation around dedup check-then-insert in save pipeline. Two concurrent saves of similar content can both pass the dedup check and create duplicates. The 3-layer dedup (hash-exact, cross-path hash, semantic PE gate) is correct for sequential saves but not concurrent ones.
- **Fix:** Wrap dedup-check + insert in a serializable transaction, or use INSERT ... ON CONFLICT for hash-based layers.
- **Cross-validation:** Not cross-validated in iter-18.
- **Source iterations:** 9

### A5. Quality Loop Content Mutations Create Caller-Contract Dependency
- **Priority:** P2 (improvement) | **Effort:** S | **Impact:** 2/5
- **Description:** The quality-loop's auto-fix feature mutates content (fixedContent). Callers MUST consume the fixed content or content_hash will mismatch. This is an implicit contract that is not enforced or documented.
- **Fix:** Return a new object (immutable pattern) instead of mutating, or assert hash consistency at the save boundary.
- **Cross-validation:** Not cross-validated in iter-18.
- **Source iterations:** 9

---

## Category B: Architecture Improvements (High-Impact)

### B1. Pipeline Orchestrator Error Handling
- **Priority:** P0 (critical) | **Effort:** M | **Impact:** 5/5
- **Description:** The 79-line orchestrator calls all 4 stages with bare `await`. Zero try/catch, zero timeout protection, zero partial-result fallback, zero circuit breaker. Any unhandled exception crashes the entire pipeline with an unstructured error. The structured error infrastructure (MemoryError, buildErrorResponse, withTimeout) exists in the codebase but is never used by the pipeline.
- **Fix:** Wrap each stage in try/catch with structured MemoryError, add withTimeout per stage, return partial results when later stages fail (Stage 1 results are still valuable if Stage 2 crashes). Add end-to-end pipeline latency tracking (Date.now start/end).
- **Cross-validation:** CONFIRMED (iter-18). 79 lines, zero try/catch/throw/error.
- **Source iterations:** 1, 6, 13, 16, 17, 18

### B2. Weight Coherence Unification (3 Systems -> 1)
- **Priority:** P0 (critical) | **Effort:** L | **Impact:** 5/5
- **Description:** Three conflicting channel weight systems coexist:
  (a) hybrid-search.ts hardcodes: vector=1.0, fts=0.8, bm25=0.6, graph=0.5
  (b) adaptive-fusion.ts has 7 intent-specific weight profiles but only applies to 2 of 5 channels
  (c) rrf-fusion.ts has GRAPH_WEIGHT_BOOST=1.5 that is dead code (overridden by explicit weight=0.5)
  Additionally, `FusionWeights.graphWeight` is declared, set in all 7 intent profiles, but never consumed by `adaptiveFuse()`. This creates a false sense of intent-aware graph weighting.
- **Fix:** Extend adaptive fusion to accept all 5 channels. Route intent-specific weights from adaptive-fusion through RRF. Remove dead GRAPH_WEIGHT_BOOST. Requires ablation testing to validate new weights.
- **Cross-validation:** Partially confirmed via iter-18 (dead GRAPH_WEIGHT_BOOST and unused graphWeight confirmed in iter-5).
- **Source iterations:** 5, 16, 17

### B3. Eval-to-Scoring Feedback Loop
- **Priority:** P1 (important) | **Effort:** L | **Impact:** 5/5
- **Description:** The eval system (ablation framework, 12 metrics, ground truth corpus) can measure retrieval quality but has zero mechanism to feed results back into 30+ hardcoded scoring constants. Ablation results go into `eval_metric_snapshots` but no pipeline code reads from that table.
- **Fix:** Build calibration workflow: (1) run ablation, (2) identify underperforming channels/signals, (3) propose weight adjustments, (4) dark-run comparison, (5) commit new weights.
- **Cross-validation:** CONFIRMED (iter-18) -- 4/5 hardcoded constants spot-checked positive.
- **Source iterations:** 2, 8, 16

### B4. Stage 2 Monolith Decomposition
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 3/5
- **Description:** Stage 2 is 854 lines with 12 sequential scoring operations (9 scoring + 2 annotation + 1 validation) in a single function. Steps 8-9 (anchor metadata, validation metadata) are pure annotation. FSRS write-back (step 3) is a DB side-effect mixed with scoring.
- **Fix:** Extract annotation steps into Stage 2b "enrich" phase. Extract FSRS write-back into post-pipeline side-effect. Reduces Stage 2 to pure scoring.
- **Cross-validation:** Not re-verified but structural claim from iter-1 reading.
- **Source iterations:** 1, 16

### B5. Feature Flag Governance Overhaul
- **Priority:** P1 (important) | **Effort:** L | **Impact:** 4/5
- **Description:** 81 unique SPECKIT_ env vars (corrected from 76 in iter-18) with: no central registry/manifest, no sunset dates, no expiry mechanisms, no categorization documentation. Three distinct flag semantics (default-ON graduated, default-OFF opt-in, multi-state) coexist with no documentation mapping which flags use which semantics. 12 legacy HYDRA_* aliases add confusion. Only one flag (@deprecated PIPELINE_V2) has any lifecycle annotation.
- **Fix:** Create a flag manifest (name, category, default, semantic type, sunset date, owner). Deprecate HYDRA_* aliases with removal timeline. Enforce sunset policy for new flags.
- **Cross-validation:** MODIFIED upward (iter-18) -- actual count is 81, not 76.
- **Source iterations:** 7, 14, 16, 17, 18

### B6. Signal Failure Discrimination in Stage 2 Metadata
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 3/5
- **Description:** All 9 signal steps in Stage 2 use `*Applied: false` and set to `true` on success. The 28 catch blocks leave the flag as `false`. A caller cannot distinguish "session boost was disabled by config" from "session boost crashed with a DB error." Silent quality degradation is the dominant failure mode.
- **Fix:** Add tri-state metadata per signal: `off | applied | failed` (or add `*Failed: boolean` / `*Error: string`).
- **Source iterations:** 6, 16, 17

### B7. BM25 Spec-Folder Filter N+1 Query
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 3/5
- **Description:** Each BM25 result triggers an individual `SELECT spec_folder FROM memory_index WHERE id = ?` inside a `.filter()` loop. 50 results = 50 separate DB queries.
- **Fix:** Batch IDs into single `SELECT id, spec_folder FROM memory_index WHERE id IN (?, ?, ...)` query.
- **Cross-validation:** CONFIRMED indirectly (iter-13 original evidence not re-verified in iter-18 but finding is clear from code pattern).
- **Source iterations:** 13, 16, 17

---

## Category C: Dead Code Cleanup (Low-Risk)

### C1. `applyIntentWeights()` Export in intent-classifier.ts
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** Stage 2 reimplements the same logic with typed PipelineRow inputs and superior recency computation. The orphaned function has zero imports.
- **Cross-validation:** CONFIRMED (iter-18).
- **Source iterations:** 4, 14, 16, 17, 18

### C2. `detectIntent()` Alias
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** Trivial 1-line wrapper for `classifyIntent()`. Adds API surface without value.
- **Source iterations:** 4, 17

### C3. GRAPH_WEIGHT_BOOST=1.5 in rrf-fusion.ts
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** Dead constant -- hybrid-search.ts always passes explicit weight=0.5 which overrides the boost.
- **Cross-validation:** Confirmed via iter-5 evidence.
- **Source iterations:** 5, 16, 17

### C4. `FusionWeights.graphWeight` and `graphCausalBias` Interface Fields
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** Declared in interface, set in all 7 intent profiles, never consumed by `adaptiveFuse()`.
- **Source iterations:** 5, 16, 17

### C5. 5-Factor Scoring Model (Dormant)
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** Complete but dormant. `use_five_factor_model: true` never passed in production. Either activate with A/B test or remove.
- **Cross-validation:** CONFIRMED (iter-18). Zero production callers.
- **Source iterations:** 3, 7, 16, 17, 18

### C6. RSF Fusion (Shadow-Only)
- **Priority:** P2 | **Effort:** M | **Impact:** 2/5
- **Description:** Dormant, records shadow scores only. No test verifies activation path. Only RRF is live.
- **Source iterations:** 2, 15, 16, 17

### C7. temporal-contiguity.ts (Zero Callers)
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** 181 LOC in cognitive subsystem with zero production integration. The only unused module in the 11-file cognitive subsystem.
- **Source iterations:** 10, 17

### C8. SPECKIT_PIPELINE_V2 Flag (Always True)
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** `isPipelineV2Enabled()` always returns true regardless of env var setting. V1 was removed. Vestigial flag.
- **Source iterations:** 7, 14, 17

### C9. Query Classifier Confidence Field (Computed, Never Consumed)
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** query-classifier.ts computes confidence score but no caller reads it. Dead data.
- **Source iterations:** 12, 15, 17

---

## Category D: Documentation / Spec Alignment (Needed)

### D1. Spec Claims "4 Channels" -- Code Has 5
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 3/5
- **Description:** types.ts:185 explicitly lists 5 channels (FTS5, semantic, trigger, graph, co-activation). Spec documents only 4. Affects architectural understanding and onboarding.
- **Fix:** Update spec.md to document all 5 channels with their roles.
- **Cross-validation:** CONFIRMED (iter-18).
- **Source iterations:** 3, 4, 14, 17, 18

### D2. Spec Claims "15+ Signals" -- Code Has 12 Steps
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** Stage 2 has exactly 12 ordered steps. "15+ signals" is directionally correct but architecturally misleading.
- **Fix:** Update spec to say "12 sequential scoring steps" with the explicit list.
- **Source iterations:** 14, 17

### D3. Spec Claims "Cosine Dedup" -- Code Uses SHA-256 Hash
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** dedup.ts uses SHA-256 hash comparison, not cosine similarity. Only pe-gating.ts uses semantic comparison.
- **Fix:** Correct spec to describe 3-layer dedup: hash-exact, cross-path hash, semantic PE gate.
- **Source iterations:** 14, 17

### D4. Feature Flag Documentation Gap
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 3/5
- **Description:** 81 flags with no manifest, no categorization, no semantic type documentation. Three distinct flag semantics (default-ON, default-OFF, multi-state) undocumented.
- **Fix:** Create FEATURE_FLAGS.md or similar manifest with name, category, default, semantic type.
- **Source iterations:** 7, 17

### D5. Hydra/Speckit Dual-Naming Confusion
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** 12 legacy HYDRA_* aliases coexist with SPECKIT_MEMORY_* canonical names. No documentation indicates which prefix is authoritative.
- **Fix:** Document SPECKIT_MEMORY_* as canonical; deprecate HYDRA_* with removal timeline.
- **Source iterations:** 4, 7, 17

### D6. `memory_drift_why` Tool Name Mismatch
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** Should be `memory_causal_trace` or similar to group with other causal tools. The "drift_why" name is semantically disconnected from its causal chain tracing function.
- **Fix:** Rename or alias to `memory_causal_trace`. Note: MCP tool names are a public API -- needs deprecation path.
- **Source iterations:** 11, 17

### D7. `graphUnified` Naming Overlap Across Modules
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** `graphUnified` in capability-flags.ts refers to roadmap phase tracking; `SPECKIT_GRAPH_UNIFIED` in rollout-policy.ts controls runtime graph behavior. Same name, different systems.
- **Source iterations:** 4, 17

---

## Category E: Automation / DX Improvements (Nice-to-Have)

### E1. File-Watcher Default-ON
- **Priority:** P2 | **Effort:** S | **Impact:** 3/5
- **Description:** File-watcher is mature (417 LOC, chokidar, debounce, SHA256 dedup, bounded concurrency) but opt-in via feature flag. Making it default-on would eliminate the most common DX friction ("forgot to reindex").
- **Source iterations:** 11, 14

### E2. No Scheduled Stale-Entry Cleanup
- **Priority:** P2 | **Effort:** M | **Impact:** 2/5
- **Description:** File-watcher handles individual unlink events. Incremental index detects deleted files during scan. But no scheduled/automated bulk stale cleanup exists.
- **Fix:** Add periodic sweep (cron-like or on-startup) that reconciles DB entries against filesystem.
- **Source iterations:** 11, 14

### E3. memory_search Has 31 Parameters (UX Burden)
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 4/5
- **Description:** 31 parameters (corrected from 28 in iter-18) including duplicate `minQualityScore` / `min_quality_score`. No "simple search" variant exists. TriggerArgs uses snake_case while all other interfaces use camelCase.
- **Fix:** Create a `memory_quick_search(query, limit?)` simplified tool. Deprecate `minQualityScore` camelCase alias. Standardize TriggerArgs to camelCase.
- **Cross-validation:** MODIFIED upward (iter-18) -- 31 params, not 28.
- **Source iterations:** 11, 17, 18

### E4. 32 MCP Tools Flat with No Grouping
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** All 32 tools appear flat with no logical grouping in tool listings. Developers must scan the full list to find the right tool.
- **Fix:** Add group/category metadata to tool schemas (search, save, lifecycle, eval, causal, shared).
- **Source iterations:** 11

### E5. No Progress Feedback for Post-Save Async Operations
- **Priority:** P2 | **Effort:** M | **Impact:** 2/5
- **Description:** Post-save operations (enrichment, embedding generation) run asynchronously with no progress feedback to the caller.
- **Source iterations:** 11

---

## Category F: Performance Optimizations (Conditional)

### F1. Deep-Mode Query Expansion: 3x Latency with No Caching
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 3/5
- **Description:** Each synonym variant triggers a full hybrid search including new embedding generation. Sequential execution, no embedding cache for variants, no latency budget.
- **Fix:** Cache variant embeddings, parallelize variant searches, add latency budget/timeout.
- **Source iterations:** 12, 15, 16

### F2. R12 Embedding Expansion Doubles Pipeline Cost
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** R12 expansion mines terms from top-5 similar memories and runs a parallel 2nd hybrid search. Mines from the same semantic neighborhood already found by vector search -- narrow improvement window. No metrics to measure whether expansion improves recall.
- **Fix:** Add metrics/eval hooks to measure expansion recall delta. Disable if delta < threshold.
- **Source iterations:** 12, 15

### F3. MMR Re-Fetches Embeddings Already Loaded
- **Priority:** P2 | **Effort:** M | **Impact:** 2/5
- **Description:** Stage 3 MMR diversity pruning re-reads embeddings from Vec0 that were already loaded in Stage 1 vector search. Duplicate read.
- **Fix:** Pass embeddings through pipeline metadata from Stage 1 to Stage 3.
- **Source iterations:** 13, 16

### F4. Shared-Space Double Query in assertSharedSpaceAccess
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** `getAllowedSharedSpaceIds` retrieves data, then a second query re-checks role. Redundant.
- **Fix:** Refactor to single query.
- **Source iterations:** 13, 16

### F5. Redundant requireDb() Calls in Stage 2
- **Priority:** P2 | **Effort:** S | **Impact:** 1/5
- **Description:** Up to 4 Stage 2 steps independently call `requireDb()`. No shared "DB unavailable" state.
- **Fix:** Call once at Stage 2 entry, pass handle to all steps.
- **Source iterations:** 6, 16, 17

---

## Category G: Test Coverage Gaps (Strengthen Confidence)

### G1. Pipeline Orchestrator Error Cascading (0 Tests)
- **Priority:** P0 (critical) | **Effort:** S | **Impact:** 4/5
- **Description:** Zero tests for orchestrator behavior when any stage throws. Prerequisite for implementing B1 fix.
- **Source iterations:** 15

### G2. Score Resolution Divergence Consistency (1 Test)
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 3/5
- **Description:** Only 1 test in mcp-response-envelope, not the 3 internal resolution functions. Need property-based tests confirming all 3 chains produce identical results when aliases are synced, and documenting divergence when unsynced.
- **Source iterations:** 15

### G3. Cross-Encoder Circuit Breaker (0 Tests)
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 3/5
- **Description:** Circuit breaker exists for cross-encoder but has zero tests.
- **Source iterations:** 15

### G4. BM25 N+1 Query Regression Test (0 Tests)
- **Priority:** P1 (important) | **Effort:** S | **Impact:** 2/5
- **Description:** No test exists for the N+1 query pattern. Need a test that verifies batched query behavior after B7 fix.
- **Source iterations:** 15

### G5. Concurrent Save Dedup Race (0 Tests)
- **Priority:** P1 (important) | **Effort:** M | **Impact:** 3/5
- **Description:** No test for concurrent save dedup. Need a concurrency test that submits N saves simultaneously and verifies exactly 1 survives.
- **Source iterations:** 15

### G6. RSF Shadow-to-Production Activation (0 Tests)
- **Priority:** P2 | **Effort:** S | **Impact:** 2/5
- **Description:** No test verifies what happens when RSF is switched from shadow to production mode.
- **Source iterations:** 15

### G7. FSRS Write-Back Race (0 Correct Tests)
- **Priority:** P2 | **Effort:** M | **Impact:** 2/5
- **Description:** Existing `decay-delete-race.vitest.ts` tests a DIFFERENT race (working_memory attention score T214). The FSRS strengthening race is untested.
- **Source iterations:** 15, 18

---

## Summary Table: Top 25 Recommendations by Priority and Impact

| Rank | ID | Category | Recommendation | Priority | Effort | Impact | Cross-Val | Source Iters |
|------|-----|----------|---------------|----------|--------|--------|-----------|-------------|
| 1 | B1 | Architecture | Orchestrator error handling + timeouts | P0 | M | 5 | CONFIRMED | 1,6,13,16-18 |
| 2 | B2 | Architecture | Weight coherence unification (3->1) | P0 | L | 5 | Partial | 5,16,17 |
| 3 | A1 | Correctness | Unify 3 score resolution chains | P0 | S | 4 | CONFIRMED | 1,2,14,16-18 |
| 4 | G1 | Testing | Orchestrator error cascade tests | P0 | S | 4 | N/A | 15 |
| 5 | B3 | Architecture | Eval-to-scoring feedback loop | P1 | L | 5 | CONFIRMED | 2,8,16 |
| 6 | B5 | Architecture | Feature flag governance overhaul | P1 | L | 4 | MODIFIED | 7,14,16-18 |
| 7 | E3 | DX | Simplified memory_search tool (31 params) | P1 | M | 4 | MODIFIED | 11,17,18 |
| 8 | B6 | Architecture | Signal failure tri-state metadata | P1 | S | 3 | N/A | 6,16,17 |
| 9 | B7 | Architecture | Batch BM25 spec-folder N+1 query | P1 | S | 3 | Indirect | 13,16,17 |
| 10 | A4 | Correctness | Concurrent save dedup transaction | P1 | M | 3 | N/A | 9 |
| 11 | B4 | Architecture | Stage 2 monolith decomposition | P1 | M | 3 | N/A | 1,16 |
| 12 | D1 | Documentation | Update spec: 5 channels not 4 | P1 | S | 3 | CONFIRMED | 3,4,14,17,18 |
| 13 | D4 | Documentation | Feature flag manifest | P1 | M | 3 | MODIFIED | 7,17 |
| 14 | F1 | Performance | Deep-mode expansion caching/parallel | P1 | M | 3 | N/A | 12,15,16 |
| 15 | G2 | Testing | Score resolution consistency tests | P1 | S | 3 | N/A | 15 |
| 16 | G3 | Testing | Cross-encoder circuit breaker tests | P1 | S | 3 | N/A | 15 |
| 17 | G5 | Testing | Concurrent save dedup race tests | P1 | M | 3 | N/A | 15 |
| 18 | E1 | DX | File-watcher default-ON | P2 | S | 3 | N/A | 11,14 |
| 19 | D2 | Documentation | Update spec: 12 steps not 15+ | P2 | S | 2 | N/A | 14,17 |
| 20 | D3 | Documentation | Correct spec: SHA-256 dedup not cosine | P2 | S | 2 | N/A | 14,17 |
| 21 | C5 | Dead Code | 5-factor model: activate or remove | P2 | S | 2 | CONFIRMED | 3,7,16-18 |
| 22 | C6 | Dead Code | RSF: test activation or remove | P2 | M | 2 | N/A | 2,15,16,17 |
| 23 | F2 | Performance | R12 expansion: add metrics | P2 | S | 2 | N/A | 12,15 |
| 24 | A2 | Correctness | FSRS write-back transaction | P2 | S | 2 | MODIFIED | 6,16-18 |
| 25 | C1-C4,C7-C9 | Dead Code | Dead code cleanup (7 items) | P2 | S | 1 | 3 CONFIRMED | various |

---

## Implementation Roadmap

### Sprint 1: Quick Wins (1-2 days total, all P0/P1 + Effort S)
1. A1 -- Unify score resolution chains (half day)
2. B6 -- Add signal failure tri-state metadata (half day)
3. B7 -- Batch BM25 spec-folder query (half day)
4. G1 -- Orchestrator error cascade tests (half day)
5. G2 -- Score resolution consistency tests (half day)
6. G3 -- Cross-encoder circuit breaker tests (half day)

### Sprint 2: Critical Architecture (3-5 days)
1. B1 -- Orchestrator error handling + timeouts (2 days)
2. D1 -- Update spec: 5 channels (half day)
3. D4 -- Feature flag manifest (1 day)
4. E3 -- Simplified memory_search tool (1 day)

### Sprint 3: Performance + Testing (3-5 days)
1. F1 -- Deep-mode expansion caching + parallelization (2 days)
2. A4 + G5 -- Concurrent save dedup fix + tests (1-2 days)
3. B4 -- Stage 2 decomposition (2 days)

### Epic: Strategic Initiatives (2-4 weeks)
1. B2 -- Weight coherence unification (1 week, needs ablation testing)
2. B5 -- Feature flag governance overhaul (1 week)
3. B3 -- Eval-to-scoring feedback loop (2 weeks)

---

## Cross-Validation Corrections Applied

| Finding | Original Claim | Correction | Iter-18 Verdict |
|---------|---------------|------------|-----------------|
| Flag count | 76 SPECKIT_ flags | 81 SPECKIT_ flags | MODIFIED upward |
| memory_search params | 28 parameters | 31 parameters | MODIFIED upward |
| FSRS race location | fsrs.ts | trackAccess flow (not fsrs.ts) | MODIFIED (location) |
| Embedding cache | Ignores model ID | Correctly uses compound PK (content_hash, model_id) | REFUTED -- removed from recommendations |

---

## Assessment
- New information ratio: 0.15
- Questions addressed: All Q1-Q18 (synthesis of all answered questions)
- Questions answered: N/A (synthesis iteration, no new questions)

### newInfoRatio calculation:
25 recommendations compiled. All are consolidations from iterations 1-18 with no new external research. The synthesis adds value through: (a) unified priority/effort/impact scoring not present in prior iterations, (b) implementation roadmap with sprint-level sequencing, (c) cross-validation corrections integrated into each recommendation. Base ratio: 0.05 (pure consolidation) + 0.10 (simplification bonus for reducing ~100 scattered findings from 18 iterations into 25 actionable recommendations with sprint sequencing) = 0.15.

## Reflection
- What worked and why: The three prior synthesis iterations (16, 17, 18) had already done most of the categorization work. Iteration 16 provided the effort/impact matrix, iteration 17 provided the misalignment taxonomy, and iteration 18 provided cross-validation verdicts. This iteration's primary value-add was (a) the unified priority framework (P0/P1/P2 x S/M/L x 1-5 impact), (b) the sprint-level implementation roadmap, and (c) adding the test coverage gaps (Category G) as a separate recommendation category distinct from the findings they validate.
- What did not work and why: N/A -- pure synthesis iteration.
- What I would do differently: Could have re-read iterations 1-15 directly for findings not captured in the synthesis iterations (16-17). However, strategy.md's answered-question summaries proved sufficient as an index, and the tool budget constraint made selective reading the right tradeoff.

## Recommended Next Focus
Iteration 20 (final): Gap analysis and research debt inventory. What questions remain partially answered? What areas were not investigated? What assumptions were made that should be validated? Create a "future research" section documenting open threads for the next analysis campaign.
