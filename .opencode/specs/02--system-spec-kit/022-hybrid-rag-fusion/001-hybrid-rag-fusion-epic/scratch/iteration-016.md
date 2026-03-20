# Iteration 16: Definitive Q1 Synthesis -- Pipeline Improvement Opportunities

## Focus
Final synthesis iteration for Q1: "Can the 4-stage pipeline be improved? Missing/redundant stages? Better orchestration? Pipeline contract violations?" This iteration cross-references all pipeline-relevant findings from iterations 1-15 to produce a prioritized, categorized improvement roadmap.

## Method
No new codebase research this iteration. This is a pure synthesis of findings from iterations 1 (architecture audit), 2 (scoring deep dive), 5 (fusion strategy), 6 (error handling), 8 (eval infrastructure), 9 (save pipeline), 12 (query expansion), 13 (performance), 14 (spec vs code), and 15 (test coverage). Each improvement is categorized by effort (low/medium/high) and impact (low/medium/high) and tagged with the iteration(s) that produced the evidence.

---

## Findings: 20 Concrete Pipeline Improvement Opportunities

### CATEGORY A: Correctness Bugs (Fix First)

**A1. Three divergent score resolution chains -- latent ranking inconsistency**
- `resolveEffectiveScore()` (types.ts): intentAdjustedScore -> rrfScore -> score -> similarity/100
- `compareDeterministicRows()` (ranking-contract.ts): score -> intentAdjustedScore -> rrfScore -> similarity/100
- `extractScoringValue()` (stage4-filter.ts): rrfScore -> intentAdjustedScore -> score -> similarity (RAW, not /100)
- When `withSyncedScoreAliases()` runs, all fields are identical and divergence is masked. But error paths, early returns, or partial processing can leave aliases unsynced, at which point sorting and filtering disagree on rank order. Additionally, `extractScoringValue` does not divide similarity by 100, creating a 100x scale mismatch in Stage 4 evidence-gap analysis.
- **Effort: LOW** (unify to a single function, replace 3 call sites) | **Impact: MEDIUM** (prevents silent ranking bugs on error paths)
- [SOURCE: iter-1 F3/F9, iter-2 F1]

**A2. FSRS write-back lost-update race condition**
- `strengthenOnAccess` does read-then-write (SELECT stability -> compute -> UPDATE stability) without transaction isolation. Two concurrent searches reading the same memory produce correct individual updates but the second write silently overwrites the first. SQLite single-writer prevents corruption but one FSRS update is lost.
- **Effort: LOW** (wrap in BEGIN IMMEDIATE transaction or use UPDATE with computed expression) | **Impact: LOW** (affects spaced-repetition accuracy, not ranking correctness; mitigated by `trackAccess` opt-in)
- [SOURCE: iter-6 F5]

**A3. Embedding cache key ignores model ID**
- If the embedding model is swapped (e.g., provider change), cached embeddings from the old model persist and are returned for new queries. The cache key is content-hash only, not content-hash + model-id.
- **Effort: LOW** (add model identifier to cache key) | **Impact: MEDIUM** (stale embeddings silently degrade retrieval quality after model change)
- [SOURCE: iter-9]

**A4. Constitutional injection can bypass archive filtering**
- In Stage 1, constitutional rows injected via vector search bypass `applyArchiveFilter` (which only runs for R8 summary hits). Archived constitutional memories could enter the pipeline.
- **Effort: LOW** (add archive check to constitutional injection path) | **Impact: LOW** (constitutional memories are rarely archived, but when they are, the omission is incorrect)
- [SOURCE: iter-1 F10]

---

### CATEGORY B: Architectural Improvements (High Value)

**B1. Orchestrator error handling -- zero try/catch for 4 stage calls**
- The 79-line orchestrator calls all 4 stages with bare `await`. Any unhandled exception crashes the entire pipeline with an unstructured error. No timeout protection, no partial-result fallback, no circuit breaker.
- **Recommended fix**: Wrap each stage in try/catch with structured `MemoryError`, add `withTimeout` per stage, return partial results when later stages fail (Stage 1 results are still valuable if Stage 2 crashes).
- **Effort: MEDIUM** (79 lines of orchestrator + error contract design) | **Impact: HIGH** (prevents total pipeline crashes, enables graceful degradation)
- [SOURCE: iter-1 F1, iter-6 F1/F11]

**B2. Weight coherence unification -- 3 conflicting channel weight systems**
- hybrid-search.ts hardcodes: vector=1.0, fts=0.8, bm25=0.6, graph=0.5
- adaptive-fusion.ts has 7 intent-specific weight profiles but only applies to 2 of 5 channels
- rrf-fusion.ts has GRAPH_WEIGHT_BOOST=1.5 that is dead code (overridden by hybrid-search's explicit weight=0.5)
- `FusionWeights.graphWeight` is declared in the interface, set in all 7 intent profiles, but never consumed by `adaptiveFuse()`
- **Recommended fix**: Extend adaptive fusion to accept all 5 channels. Route intent-specific weights from adaptive-fusion through RRF. Remove dead GRAPH_WEIGHT_BOOST. This is the single largest retrieval quality improvement opportunity.
- **Effort: HIGH** (touches 3 files, requires weight calibration, needs ablation testing) | **Impact: HIGH** (enables intent-aware retrieval across all channels, eliminates dead weight code)
- [SOURCE: iter-5 F2/F5/F6/F10]

**B3. Eval-to-scoring feedback loop -- measurement without calibration**
- The eval system (ablation framework, 12 metrics, ground truth corpus) can measure retrieval quality but has zero mechanism to feed results back into the 30+ hardcoded scoring constants. Ablation results go into `eval_metric_snapshots` but no pipeline code reads from that table.
- **Recommended fix**: Build a calibration workflow: (1) run ablation, (2) identify underperforming channels/signals, (3) propose weight adjustments, (4) dark-run comparison, (5) commit new weights. Could be agent-accessible via existing MCP tools.
- **Effort: HIGH** (new subsystem, requires experimental framework) | **Impact: HIGH** (transforms scoring from guesswork to data-driven; the only path to systematic improvement of all 30+ constants)
- [SOURCE: iter-2 F2, iter-8 F7]

**B4. Stage 2 monolith decomposition -- 854 lines, 12 steps, mixed concerns**
- Stage 2 applies 12 sequential scoring operations (9 scoring + 2 annotation + 1 validation) in a single 854-line function. Steps 8-9 (anchor metadata, validation metadata) are pure annotation and belong in a separate enrichment step or Stage 4.
- **Recommended fix**: Extract annotation steps (8-9) into a Stage 2b "enrich" phase. Extract FSRS write-back (step 3) into a post-pipeline side-effect. This reduces Stage 2 to pure scoring and makes the pipeline more testable.
- **Effort: MEDIUM** (refactor within existing stage boundaries, no new types needed) | **Impact: MEDIUM** (improves testability, reduces cognitive load, separates scoring from side-effects)
- [SOURCE: iter-1 F4]

**B5. BM25 spec-folder filter N+1 query**
- Each BM25 result triggers an individual `SELECT spec_folder FROM memory_index WHERE id = ?` inside a `.filter()` loop. 50 results = 50 separate DB queries.
- **Recommended fix**: Batch the IDs into a single `SELECT id, spec_folder FROM memory_index WHERE id IN (?, ?, ...)` query.
- **Effort: LOW** (single query rewrite) | **Impact: MEDIUM** (eliminates 49 redundant DB round-trips per search; directly improves P95 latency)
- [SOURCE: iter-13]

---

### CATEGORY C: Silent Quality Degradation (Observability)

**C1. No distinction between "feature off" vs "feature crashed" in metadata**
- All 9 signal steps in Stage 2 initialize `*Applied: false` and set to `true` on success. The catch blocks leave the flag as `false`. A caller cannot distinguish "session boost was disabled by config" from "session boost crashed with a DB error."
- **Recommended fix**: Add a `*Failed: boolean` or `*Error: string` field to Stage 2 metadata for each signal step. Alternatively, use a tri-state: `off | applied | failed`.
- **Effort: LOW** (add error state to existing metadata object) | **Impact: MEDIUM** (enables quality monitoring, debugging, and alerting on signal failures)
- [SOURCE: iter-6 F2/F10]

**C2. No end-to-end pipeline latency metric**
- Timing instrumentation exists in cross-encoder (circuit breaker + latency tracker), stage4-filter (durationMs), and vector-index-queries, but the orchestrator has zero timing code. No metric captures total pipeline execution time.
- **Recommended fix**: Add `Date.now()` start/end in orchestrator, report in pipeline metadata.
- **Effort: LOW** (2 lines of code in orchestrator) | **Impact: MEDIUM** (enables P50/P95 latency tracking, prerequisite for performance optimization)
- [SOURCE: iter-13]

**C3. Redundant requireDb() calls without circuit breaker**
- Up to 4 Stage 2 steps independently call `requireDb()`. If the DB is unavailable, each step discovers this separately, logs a separate warning, and continues. No shared "DB unavailable" state prevents redundant attempts.
- **Recommended fix**: Call `requireDb()` once at Stage 2 entry, pass the handle to all steps. If it fails, skip all DB-dependent steps with a single "DB unavailable" metadata flag.
- **Effort: LOW** (refactor DB handle acquisition to stage entry) | **Impact: LOW** (reduces noise in logs, minor latency improvement from avoiding redundant calls)
- [SOURCE: iter-6 F9]

---

### CATEGORY D: Dead Code and Unused Infrastructure

**D1. `applyIntentWeights()` export in intent-classifier.ts is dead code**
- Stage 2 reimplements the same logic with typed `PipelineRow` inputs and superior recency computation. The orphaned function in intent-classifier.ts has zero imports in production.
- **Effort: LOW** (delete 1 function) | **Impact: LOW** (reduces maintenance surface, eliminates confusion)
- [SOURCE: iter-4, iter-14]

**D2. GRAPH_WEIGHT_BOOST=1.5 in rrf-fusion.ts is effectively dead**
- hybrid-search.ts always passes explicit `weight: 0.5` for graph results, which overrides the default boost (boost only applies when weight is undefined).
- **Effort: LOW** (remove constant or make hybrid-search use it) | **Impact: LOW** (clarifies intent, removes misleading constant)
- [SOURCE: iter-5 F2]

**D3. 5-factor scoring model is dormant**
- The 5-factor model exists, is tested, and is structurally complete, but `use_five_factor_model: true` is never passed in production. It is opt-in dead code.
- **Effort: LOW** (either activate with A/B test or remove) | **Impact: LOW** (unless it outperforms legacy; needs eval comparison)
- [SOURCE: iter-3, iter-7]

**D4. RSF fusion is shadow-only with no activation path test**
- RSF is dormant and only records shadow scores for offline comparison. No test verifies what happens when RSF is switched to production mode.
- **Effort: MEDIUM** (write activation path tests + ensure weight system compatibility) | **Impact: LOW** (until RSF is needed for production)
- [SOURCE: iter-2 F3, iter-15 F7]

---

### CATEGORY E: Performance Optimization

**E1. Deep-mode query expansion: 3x latency with no caching**
- Each synonym variant triggers a FULL hybrid search including new embedding generation. No embedding cache for variants. Sequential execution, not parallel.
- **Recommended fix**: (1) Cache variant embeddings, (2) parallelize variant searches, (3) add latency budget/timeout for expansion.
- **Effort: MEDIUM** (caching + parallelization) | **Impact: MEDIUM** (directly reduces deep-mode P95 latency by up to 60%)
- [SOURCE: iter-12, iter-15]

**E2. MMR re-fetches embeddings already loaded during vector search**
- Stage 3 MMR diversity pruning re-reads embeddings from Vec0 that were already loaded in Stage 1 vector search. Duplicate read, not N+1.
- **Recommended fix**: Pass embeddings through pipeline metadata from Stage 1 to Stage 3.
- **Effort: MEDIUM** (requires pipeline metadata extension) | **Impact: LOW** (saves one Vec0 read per search, minor latency)
- [SOURCE: iter-13]

**E3. Shared-space double query in assertSharedSpaceAccess**
- `getAllowedSharedSpaceIds` already retrieves the needed data, then a second query re-checks role. Redundant.
- **Effort: LOW** (refactor to single query) | **Impact: LOW** (minor, only affects shared-space searches)
- [SOURCE: iter-13]

---

### CATEGORY F: Test Coverage Gaps (Strengthen Confidence)

**F1. Seven critical untested paths**
1. FSRS write-back lost-update race (0 tests -- decay-delete-race tests a DIFFERENT race)
2. Score resolution divergence consistency (1 test in envelope, not internal chains)
3. Pipeline orchestrator error cascading (0 tests)
4. Cross-encoder circuit breaker (0 tests)
5. BM25 spec-folder filter N+1 (0 tests)
6. RSF shadow-to-production activation (0 tests)
7. Concurrent save dedup race + embedding cache model-swap (0 tests each)
- **Effort: MEDIUM** (7 focused test files) | **Impact: HIGH** (prevents regression on known bugs, validates fixes for A1-A3)
- [SOURCE: iter-15]

---

## Prioritized Improvement Roadmap

### Tier 1: Quick Wins (LOW effort, MEDIUM+ impact) -- Do First
| # | Improvement | Effort | Impact | Iteration Source |
|---|------------|--------|--------|-----------------|
| A1 | Unify 3 score resolution chains | LOW | MEDIUM | iter-1, iter-2 |
| A3 | Add model ID to embedding cache key | LOW | MEDIUM | iter-9 |
| B5 | Batch BM25 spec-folder filter query | LOW | MEDIUM | iter-13 |
| C1 | Add failed/error state to signal metadata | LOW | MEDIUM | iter-6 |
| C2 | Add end-to-end pipeline latency metric | LOW | MEDIUM | iter-13 |

### Tier 2: High-Value Investments (MEDIUM effort, HIGH impact)
| # | Improvement | Effort | Impact | Iteration Source |
|---|------------|--------|--------|-----------------|
| B1 | Orchestrator error handling + timeouts | MEDIUM | HIGH | iter-1, iter-6 |
| F1 | 7 critical test coverage gaps | MEDIUM | HIGH | iter-15 |
| B4 | Stage 2 decomposition (scoring vs enrichment) | MEDIUM | MEDIUM | iter-1 |
| E1 | Deep-mode expansion caching + parallelization | MEDIUM | MEDIUM | iter-12 |

### Tier 3: Strategic Initiatives (HIGH effort, HIGH impact)
| # | Improvement | Effort | Impact | Iteration Source |
|---|------------|--------|--------|-----------------|
| B2 | Weight coherence unification (3 systems -> 1) | HIGH | HIGH | iter-5 |
| B3 | Eval-to-scoring feedback loop | HIGH | HIGH | iter-2, iter-8 |

### Tier 4: Cleanup (LOW effort, LOW impact) -- Opportunistic
| # | Improvement | Effort | Impact | Iteration Source |
|---|------------|--------|--------|-----------------|
| D1 | Remove dead `applyIntentWeights` export | LOW | LOW | iter-4, iter-14 |
| D2 | Remove/fix dead GRAPH_WEIGHT_BOOST | LOW | LOW | iter-5 |
| C3 | Single requireDb() call at Stage 2 entry | LOW | LOW | iter-6 |
| A2 | FSRS write-back transaction isolation | LOW | LOW | iter-6 |
| A4 | Archive filter for constitutional injection | LOW | LOW | iter-1 |
| E3 | Shared-space double query fix | LOW | LOW | iter-13 |
| D3 | 5-factor model: activate or remove | LOW | LOW | iter-3 |
| D4 | RSF activation path test | MEDIUM | LOW | iter-2, iter-15 |
| E2 | Pass embeddings through pipeline metadata | MEDIUM | LOW | iter-13 |

---

## Definitive Q1 Answer

**Can the 4-stage pipeline be improved?** Yes, substantially. 20 concrete improvements identified across 6 categories:

**Missing stages/capabilities:**
- No error handling at the orchestration layer (B1)
- No observability for signal failures vs disabled features (C1)
- No end-to-end latency tracking (C2)
- No feedback loop from eval measurements to scoring calibration (B3)

**Redundant/incoherent components:**
- 3 conflicting channel weight systems that partially override each other (B2)
- 3 different score resolution functions with different fallback orders (A1)
- Dead code: `applyIntentWeights` export, GRAPH_WEIGHT_BOOST, dormant 5-factor model, shadow-only RSF (D1-D4)
- Redundant requireDb() calls without shared state (C3)

**Better orchestration:**
- Stage 2 is a 854-line monolith mixing scoring, annotation, and DB side-effects (B4)
- Deep-mode expansion runs 3x sequential searches with no caching (E1)
- BM25 filter uses N+1 query pattern (B5)

**Pipeline contract issues:**
- Unsafe `as` cast from Stage 3 mutable output to Stage 4 readonly input (iter-1 F8)
- Constitutional injection timing bypasses archive filtering (A4)
- Embedding cache key ignores model identity (A3)

**The two highest-impact improvements are:**
1. **Weight coherence unification (B2)** -- eliminates the fundamental architectural inconsistency where intent-aware weights only apply to 2 of 5 channels while the other 3 use hardcoded values
2. **Eval-to-scoring feedback loop (B3)** -- the only path to systematic, data-driven calibration of 30+ hardcoded constants

## Sources Consulted
- iteration-001.md (pipeline architecture audit)
- iteration-002.md (scoring system deep dive)
- iteration-005.md (fusion strategy deep dive)
- iteration-006.md (error handling audit)
- iteration-008.md (eval infrastructure)
- iteration-015.md (test coverage analysis)
- deep-research-strategy.md (prior question answers from iters 3, 4, 7, 9, 10, 11, 12, 13, 14)

## Assessment
- New information ratio: 0.20
- Questions addressed: Q1 (definitive answer)
- Questions answered: Q1 (fully answered -- 20 improvements, prioritized, categorized)

### newInfoRatio calculation:
20 items in findings. All 20 are consolidations of previously identified issues from iterations 1-15 -- no genuinely new external information was gathered. However, the synthesis adds significant value through: (a) prioritization by effort/impact that did not exist before, (b) cross-iteration correlation (e.g., linking iter-15 test gaps to iter-6 bugs), (c) the definitive roadmap format. Applying the simplification bonus: base ratio 0.10 (consolidation-only) + 0.10 (simplification bonus for reducing ~60 scattered findings to 20 prioritized items with clear categories) = 0.20.

## Reflection
- What worked and why: Reading 6 iteration files in a single pass provided all the evidence needed. The categorization framework (Correctness/Architecture/Observability/Dead Code/Performance/Testing) emerged naturally from grouping the findings by type, and the effort/impact matrix immediately revealed the priority tiers.
- What did not work and why: N/A -- this was a pure synthesis iteration with no external research actions.
- What I would do differently: Could have also consulted iterations 3, 4, 9, 10, 11, 12, 13, 14 directly instead of relying on strategy.md summaries, but the strategy summaries proved sufficient for cross-referencing.

## Recommended Next Focus
Iteration 17: All 17 key questions are now answered. Shift to Phase 5 synthesis: cross-validate the top 10 findings with fresh codebase reads to confirm they still hold (no code changes since the analysis began).
