# Research Strategy

## Topic
Comprehensive hybrid-rag-fusion system analysis: pipeline architecture, scoring calibration, automation opportunities, dead code/bugs, and alignment with sk-code-opencode and sk-doc standards.

## Key Questions (remaining)
- [x] Q1. Can the 4-stage pipeline be improved? Missing/redundant stages? Better orchestration? Pipeline contract violations? **Answer: YES -- 20 concrete improvements identified across 6 categories (Correctness, Architecture, Observability, Dead Code, Performance, Testing), prioritized into 4 tiers. Top 5 quick wins: (1) unify 3 score resolution chains, (2) add model ID to embedding cache key, (3) batch BM25 N+1 query, (4) add failed/error state to signal metadata, (5) add end-to-end pipeline latency metric. Top 2 strategic initiatives: (1) weight coherence unification (3 conflicting systems -> 1 intent-aware system across all 5 channels), (2) eval-to-scoring feedback loop (close the gap between measurement and calibration of 30+ hardcoded constants). Full roadmap in iteration-016.md.**
- [x] Q3. What manual steps can be automated? Developer UX friction? Self-tuning opportunities? Tool naming/parameter clarity? **Answer: 5 automation gaps found: (a) file-watcher is opt-in not default-on, (b) no scheduled stale-entry cleanup, (c) no simplified search tool (memory_search has 28 params), (d) all 32 tools flat with no grouping, (e) post-save async operations have no progress feedback. Tool naming is consistent (`{domain}_{action}`) except `memory_drift_why` (should be causal group) and TriggerArgs snake_case inconsistency. No self-tuning exists -- eval measures quality but cannot auto-calibrate weights (see Q10).**
- [x] Q4. Graph channel still NULL? Dead code paths? Error handling gaps? **Answer: Graph channel is NOT NULL/dead. It is a complete, default-ON system (SPECKIT_GRAPH_UNIFIED, default-on semantics) with: FTS5-backed causal edge search + LIKE fallback, typed-degree as 5th RRF channel, 3 graph signals (momentum, causal depth via Tarjan SCC, graph-walk 2-hop), community detection with BFS + Louvain escalation, session caching, and constitutional memory exclusion. Error handling is defensive (try/catch with warn + empty return on all paths). No dead code found in graph modules.**
- [x] Q5. Misalignments between code and sk-code-opencode? Between docs and sk-doc? Between 80K spec.md and actual code? **DEFINITIVE ANSWER (iter-17): 29 misalignments compiled across 4 categories: (A) 5 spec-vs-code (4-vs-5+ channels, "15+ signals" vs 12 steps, "cosine dedup" vs SHA-256, 76 flags vs spec's governance model, 3 divergent score resolution chains), (B) 10 code-vs-standards (zero orchestrator error handling, 28 warn-and-continue catch blocks, no E2E latency metric, 3 flag semantics undocumented, FSRS race condition, BM25 N+1, embedding cache ignores model ID, redundant requireDb, dead confidence field, duplicate `minQualityScore` param), (C) 9 dead code items (applyIntentWeights export, detectIntent alias, GRAPH_WEIGHT_BOOST, graphWeight interface fields, 5-factor model, RSF fusion, temporal-contiguity.ts, PIPELINE_V2 flag, confidence field), (D) 5 naming issues (Hydra/Speckit dual-naming, graphUnified overlap, memory_drift_why misname, TriggerArgs snake_case, implicit flag categories). Severity: 5 HIGH, 9 MEDIUM, 15 LOW. Top 5: 76-flag sprawl, 3 score resolution chains, zero orchestrator error handling, 5+ channels undocumented, 3 conflicting weight systems. 7 spec claims CONFIRMED correct: RRF K=60, Pipeline V2 always-on, Graph default-ON, FSRS v4 constants, MMR in Stage 3, cross-encoder 3-provider, 32 MCP tools.**
- [x] Q8. What error handling patterns are used across the pipeline? Silent failures? Swallowed exceptions? Missing error context? **Answer: The dominant pattern is per-step try/catch with console.warn + silent continue. Stage 2 has 16 catch blocks, Stage 1 has 8, Stage 3 has 4 -- totaling 28 pipeline catch blocks all following warn-and-continue. The orchestrator (79 lines) has ZERO error handling. Critical gaps: (a) no distinction between "feature off" vs "feature crashed" in metadata, (b) no circuit-breaker for DB failures (4 redundant requireDb attempts), (c) FSRS write-back has read-then-write lost-update race, (d) pipeline never uses the structured error infrastructure (MemoryError, buildErrorResponse, withTimeout), (e) silent quality degradation is the dominant failure mode -- all 9 signal steps can fail without caller awareness.**
- [x] Q9. Does feature flag governance follow the 6-flag limit? Are there sunset dates? Flag dependency cycles? **Answer: Massively exceeds any 6-flag limit -- 76 unique SPECKIT_ env vars exist across lib/. NO central registry/manifest. NO sunset dates, NO expiry mechanisms, NO version gates. Only one @deprecated flag (PIPELINE_V2, always true). Two flag dependency chains: (1) GRAPH_WALK_ROLLOUT falls back to GRAPH_SIGNALS, (2) ENTITY_LINKING documents requiring AUTO_ENTITIES but does NOT enforce it. Three distinct flag semantics (default-ON via isFeatureEnabled, default-OFF via explicit === 'true', multi-state). 12 flags are legacy HYDRA_* aliases. Flag sprawl is a major governance gap.**
- [x] Q10. Is the eval/measurement infrastructure (13+ files in lib/eval/) connected to the pipeline? Ground truth quality? **Answer: The eval system is structurally complete and correctly connected. Ablation framework (773 LOC) implements one-at-a-time channel ablation with 9-metric breakdown, sign-test statistical significance, and channel contribution ranking. It connects bidirectionally to hybrid-search.ts (ablation calls search, search respects disabled channel flags). Ground truth is 2,591-line JSON with 7 intent types, 7 query categories, 4-point relevance scale. 12 metrics (7 core + 5 diagnostic) are implemented as pure functions. Separate eval DB (5 tables, WAL mode) isolates eval from production. CRITICAL GAP: No feedback loop -- eval measures quality but cannot calibrate scoring weights. Ground truth memoryIds are hardcoded and may become stale if DB is rebuilt. token_usage metric is a stub (always 0). Eval is MCP-tool accessible (eval_run_ablation, eval_reporting_dashboard) but gated behind SPECKIT_ABLATION=true.**
- [x] Q11. Is the save pipeline (handlers/save/) robust? Memory quality gates effective? Dedup working? **Answer: The save pipeline is architecturally robust -- 7-module decomposition with 3-layer dedup (same-path hash, cross-path hash, semantic PE gate), 4-dimension quality loop (triggers/anchors/budget/coherence, threshold 0.6, 2 auto-fix retries), 5-action PE arbitration (CREATE/REINFORCE/SUPERSEDE/UPDATE/CREATE_LINKED), append-only versioning for updates, 4-step post-insert enrichment with per-step try/catch, and 5-dimensional tenant isolation. THREE gaps found: (a) embedding cache key ignores model ID -- model swap produces stale embeddings, (b) no transaction isolation around dedup check-then-insert (concurrent saves can create duplicates), (c) quality loop content mutations create caller-contract dependency -- fixedContent MUST be consumed or content_hash mismatches.**
- [x] Q13. Are the 32 MCP tool names and parameters intuitive? What UX friction exists for developers? **Answer: 32 tools across 7 groups with consistent `{domain}_{action}` naming. TWO naming issues: (a) `memory_drift_why` should be `memory_causal_trace` (misfiled outside causal group), (b) TriggerArgs uses snake_case (`session_id`, `include_cognitive`) while all other interfaces use camelCase. MAJOR UX issue: `memory_search` has 28 parameters including a duplicate (`minQualityScore` + `min_quality_score`). No "simple search" variant exists. All 32 tools appear flat with no grouping.**
- [x] Q14. What indexing/ingest automation gaps exist? File-watcher, incremental reindex, stale entry cleanup? **Answer: File-watcher is MATURE (417 LOC, chokidar, debounce, SHA256 dedup, bounded concurrency, SQLITE_BUSY retry, AbortController cancellation) but OPT-IN via feature flag. Incremental indexing exists with mtime fast-path + content-hash comparison. Stale cleanup is PARTIAL: file-watcher handles individual unlink events, incremental-index detects deleted files during scan, but no scheduled/automated bulk stale cleanup exists. Requires manual `memory_index_scan` call.**
- [x] Q15. Is query expansion/classification actually improving results or adding latency for no gain? **Answer: TWO separate expansion systems exist in mutual exclusion. (1) Rule-based synonym expansion (27-entry vocab map, max 3 variants) runs ONLY in deep mode -- each variant triggers a FULL hybrid search with its own embedding generation, creating a 3x latency multiplier with no caching. (2) R12 embedding expansion runs on standard hybrid searches -- mines terms from top-5 similar memories and runs a parallel 2nd hybrid search. R12/R15 mutual exclusion correctly suppresses expansion on simple queries (<=3 terms). CRITICAL GAP: Neither system has metrics or eval hooks to measure whether expansion improves recall. The eval/ablation framework tests channels but not expansion variants. Deep mode expansion has unbounded latency cost. R12 expansion mines terms from the same semantic neighborhood already found by vector search -- narrow improvement window. Confidence field in query-classifier output is computed but never consumed by any caller (dead data).**
- [x] Q16. What are the hot paths? Any N+1 queries? P95 latency concerns? **Answer: 5 performance concerns found. (a) BM25 spec-folder filter is a classic N+1 query -- each result triggers an individual `SELECT spec_folder FROM memory_index WHERE id = ?` inside a `.filter()` loop (50 results = 50 queries). (b) Deep-mode expansion triggers 3x full hybrid search (sequential, no embedding cache). (c) R12 expansion doubles pipeline cost for non-simple queries. (d) MMR re-fetches embeddings from Vec0 that were already loaded during vector search (duplicate read, not N+1). (e) Local reranker processes candidates sequentially (PERF CHK-113). Timing instrumentation exists in cross-encoder (circuit breaker + latency tracker), stage4-filter (durationMs), and vector-index-queries, but NO end-to-end pipeline latency metric exists. The orchestrator has zero timing code.**
- [x] Q17. Are session/collaboration features (shared spaces, session isolation) production-ready? **Answer: Session features are production-ready but feature-flagged. Session-boost (213 LOC) correctly implements attention-based score boosting with combined cap=0.20, batched DB queries, and graceful degradation. Session-transition (191 LOC) is pure observability (trace metadata). Shared spaces (607 LOC) are architecturally complete but default-OFF: deny-by-default membership, 4 conflict resolution strategies, kill switch, cohort rollout, governance audit integration, transactional conflict recording. ONE performance issue: assertSharedSpaceAccess has a redundant double-query (getAllowedSharedSpaceIds already retrieves the needed data, then a second query re-checks role).**
- [x] Q12. Is the cognitive subsystem (11 files in lib/cognitive/) over-engineered? Actual impact on retrieval quality? **Answer: NOT over-engineered. 4,644 LOC across 11 modules; 10 of 11 are production-integrated (4,463 LOC). Only temporal-contiguity.ts (181 LOC) has zero production callers. The subsystem has a clear 4-layer architecture: (a) Foundation: rollout-policy (64 LOC, 6 consumers) + fsrs-scheduler (395 LOC), (b) Session: working-memory (765 LOC, Miller's Law capacity, LRU eviction, event decay), (c) Quality: prediction-error-gate + tier-classifier + pressure-monitor, (d) Enhancement: co-activation (deep pipeline integration in hybrid-search + stage2-fusion), adaptive-ranking (shadow-mode proposals), archival-manager, attention-decay (facade). cognitive.ts config (115 LOC) is slightly over-engineered for 2 env vars. Co-activation is a core retrieval quality feature, not optional. Shadow-mode ranking creates observe-propose-evaluate loop (no automated feedback).**
- [x] Q6. Do intent-classifier.ts per-intent weights interact correctly with the 12-step Stage 2 scoring order? **Answer: Yes, interaction is correct. Intent is classified via `classifyIntent()` in hybrid-search.ts, passed to pipeline config. Stage 2 receives intent weights via `config.intentWeights` and calls its own `applyIntentWeightsToResults()` (step 10). All 7 intent weight triplets sum to 1.0. HOWEVER: the intent-classifier's own `applyIntentWeights()` export is DEAD CODE -- Stage 2 reimplements the same logic with typed PipelineRow inputs and superior recency computation. The orphaned function should be removed.**
- [x] Q7. Are the two parallel scoring models (5-factor vs legacy 6-factor) both actively used, or is one dead code? **Answer: Legacy 6-factor is the ONLY live model. The 5-factor model exists, is tested, and is structurally complete, but `use_five_factor_model: true` is never passed in production code (0 hits in lib/). It is opt-in dead code -- ready to activate but dormant. The models have different factor sets: legacy uses similarity/importance/recency/popularity/tierBoost/retrievability; 5-factor uses temporal/usage/importance/pattern/citation.**

## Answered Questions
- [x] Q2. Is 15+ signal scoring calibrated? Are RRF/RSF weights data-driven or arbitrary? **Answer: All 30+ scoring constants are hardcoded. Only RRF K=60 (SIGIR 2009) and FSRS constants (FSRS v4) have literature citations. No data-driven calibration, no A/B framework, no runtime tuning except K and two feature flags. RSF is dormant/shadow-only; only RRF is live. Three score resolution chains have divergent fallback orders (potential bug). Two parallel scoring models (5-factor + legacy 6-factor) coexist.**
- [x] Q6. Do intent-classifier.ts per-intent weights interact correctly with the 12-step Stage 2 scoring order? **Answer: Yes, interaction is correct but with dead code. See Q6 entry above.**
- [x] Q18. Test coverage completeness -- which critical paths are untested? **Answer: 284 test files provide broad coverage. All 4 pipeline stages have test files but Stage 4 has NO dedicated file. 7 critical untested paths: (a) FSRS write-back lost-update race -- decay-delete-race.vitest.ts tests a DIFFERENT race (working_memory attention score T214), (b) score resolution divergence -- only 1 test in mcp-response-envelope, not the 3 internal resolution functions, (c) pipeline orchestrator error cascading -- 0 tests, (d) cross-encoder circuit breaker -- 0 tests, (e) BM25 spec-folder filter N+1 query -- 0 tests, (f) RSF activation path (shadow-to-production switch) -- 0 tests, (g) concurrent save dedup race / embedding cache model-swap -- 0 tests. Strong edge case coverage for empty results, null inputs, and boundary values across scoring/fusion/graph modules.**

## What Worked
- [iter-1] Reading types.ts first gave complete type contracts; made all subsequent stage reads highly productive
- [iter-1] Pipeline directory is self-contained (8 files, ~3100 LOC total); no external dependencies needed for architecture understanding
- [iter-1] Identifying 3 different score-resolution orderings (types.ts, ranking-contract.ts, stage4-filter.ts) as a latent bug cluster
- [iter-2] Side-by-side comparison of the 3 score resolution functions confirmed the bug: different field precedence AND inconsistent similarity/100 handling
- [iter-2] Reading rrf-fusion.ts fully gave complete RRF constant catalog in one pass; reading composite-scoring.ts top section gave all weight tables
- [iter-2] Discovering RSF is dormant/shadow-only simplifies the architecture analysis (only 1 live fusion algorithm)
- [iter-2] The `withSyncedScoreAliases` pattern explains why the divergent fallback orders may not always manifest -- but error/skip paths remain vulnerable
- [iter-3] Reading graph-search-fn.ts and graph-signals.ts in full gave complete graph subsystem understanding in one pass
- [iter-3] Grep for `use_five_factor_model: true` across production code was the definitive test for Q7 (0 production hits)
- [iter-3] The graph channel is far more mature than expected -- Tarjan SCC, Louvain modularity, 3-part debounce hash, constitutional exclusion
- [iter-4] Reading the 3 search classifier files in parallel gave complete two-axis classification understanding (intent + complexity) in one pass
- [iter-4] Grep for `applyIntentWeights[^T]` across lib/ was the decisive dead-code test (zero imports = conclusive negative evidence)
- [iter-4] Tracing the intent weight flow from hybrid-search.ts -> stage2-fusion.ts fully answered Q6
- [iter-5] Reading rrf-fusion.ts and adaptive-fusion.ts in full gave complete fusion algorithm picture in one pass
- [iter-5] Cross-referencing weight systems across 3 files (hybrid-search, adaptive-fusion, rrf-fusion) revealed the weight incoherence gap -- no single file shows the conflict
- [iter-5] Reading query-router.ts in full revealed clean tier-to-channel mapping with 2-channel minimum invariant
- [iter-6] Grep for `catch\s*\(` with +2 context lines across pipeline/ gave complete error handling census (28 blocks) in one action
- [iter-6] Reading errors/core.ts first gave the error infrastructure vocabulary, making the pipeline's non-use immediately visible
- [iter-6] orchestrator.ts is only 79 lines -- reading it in full instantly revealed the zero-error-handling gap
- [iter-7] `grep -ohr | sort -u` gave complete flag census (76 unique names) in one bash command -- far more efficient than reading individual files
- [iter-7] Reading search-flags.ts in full was highest-ROI: 23 flag definitions with JSDoc defaults, deprecation markers, and dependency notes in 252 lines
- [iter-8] Reading ablation-framework.ts in full was highest-ROI: complete eval architecture, pipeline connection, statistical methods, and output format in one 773-line pass
- [iter-8] Grep for eval/ablation references in lib/search/ confirmed bidirectional pipeline connection with 1 tool call
- [iter-9] Reading save/index.ts barrel export first gave complete 7-module architecture in 48 lines
- [iter-9] Reading dedup.ts and pe-gating.ts in full revealed 3-layer dedup architecture (hash-exact, cross-path hash, semantic PE gate) invisible from any single file
- [iter-9] Reading quality-loop.ts in full (700 LOC) gave complete quality scoring model + auto-fix system + eval integration in one pass
- [iter-10] Grep-first approach (all cognitive imports across codebase) gave complete 11-module integration map in one action -- revealed 10/11 production-integrated without reading each module
- [iter-10] LOC census (wc -l on all 11 files) gave quantitative over-engineering assessment data in one bash command
- [iter-11] Grep for tool names in tool-schemas.ts was highest-ROI: complete 32-tool inventory + naming analysis in one call
- [iter-11] Reading tools/types.ts in full gave all 28+ parameter interfaces at once -- enabled instant complexity ranking without per-tool schema reads
- [iter-12] Reading the 3 query intelligence modules (expander, classifier, embedding-expansion) together gave complete expansion architecture in one pass -- each is self-contained
- [iter-12] Stage1-candidate-gen.ts is the single integration point for all expansion systems -- reading it confirmed the mode-based dispatch (deep vs standard) as the critical branching logic
- [iter-13] Grep-first for `.prepare(` and `Date.now` across lib/search/ gave complete DB query census (80 hits) and timing instrumentation map (60 hits) in just 2 tool calls -- revealed BM25 N+1 and missing end-to-end timing without per-file reads
- [iter-13] Reading session-boost.ts, session-transition.ts, and shared-spaces.ts in full answered both Q16 and Q17 in a single iteration -- all three modules are self-contained and well-documented
- [iter-14] Grep-first verification approach was extremely efficient -- each claim confirmed/falsified with 1-2 targeted searches. rrf-fusion.ts full read was highest-ROI (answered claims 1, 4, and partially 2 in one read)
- [iter-16] Pure synthesis iteration: reading 6 prior iteration files gave complete evidence base. Categorization framework (6 categories) and effort/impact matrix emerged naturally from grouping ~60 scattered findings into 20 prioritized items
- [iter-17] Strategy.md answered-question summaries served as high-ROI index into which iterations had Q5-relevant findings. 4-category misalignment framework (spec-vs-code, code-vs-standards, dead code, naming) with severity ratings gave comprehensive Q5 closure
- [iter-21] Comparing the live packet `description.json` to active `spec.md` and `plan.md` contract sections surfaced the renamed-folder drift immediately; checking the research state log against the missing file confirmed the canonical research artifact gap without a broad tree reread

## What Failed
- [iter-1] Dispatch context had wrong path prefix (shared/ instead of mcp_server/); required Glob discovery step (1 extra tool call)
- [iter-2] composite-scoring.ts exceeded 10K token read limit; required a 2-read strategy (offset pagination)
- [iter-3] Dispatch context had wrong path prefix again (shared/ instead of mcp_server/) -- required Glob discovery (recurring issue, 2nd occurrence)
- [iter-4] Dispatch context paths wrong for 3rd consecutive time (shared/ prefix). Persistent orchestrator issue
- [iter-5] No failures this iteration -- all target files were in the correct paths as provided
- [iter-6] No failures this iteration -- all target files at expected paths
- [iter-7] Dispatch context paths wrong for 4th time (shared/ prefix). Required Glob discovery (2 extra tool calls). Recurring orchestrator issue
- [iter-8] Grep path lib/pipeline was wrong (5th occurrence). Correct path is lib/search/. Recovered with retry on correct path
- [iter-9] No failures this iteration -- all target files at expected paths
- [iter-10] Dispatch context paths wrong for 6th time (shared/ prefix). Required Glob discovery (2 extra tool calls). Recurring orchestrator issue
- [iter-11] No failures this iteration -- all target files at expected paths
- [iter-12] No failures this iteration -- all target files at expected paths
- [iter-13] No failures this iteration -- all target files at expected paths
- [iter-14] macOS grep -P (PCRE) not available -- required fallback to standard grep patterns (1 retry). composite-scoring.ts no longer exists at shared/algorithms/ path -- likely renamed or consolidated
- [iter-15] Grep-census across 284 test files was extremely efficient -- multiple grep patterns in one bash call gave complete coverage maps. Targeted describe/it census of key files confirmed depth without reading full test bodies
- [iter-15] No failures this iteration -- all target paths correct
- [iter-16] No failures -- pure synthesis iteration with no external research actions
- [iter-17] No failures -- pure synthesis iteration compiling Q5 definitive answer from 16 prior iterations
- [iter-18] Batch grep verification was extremely efficient -- 5+ findings verified in one bash call. Embedding-cache.ts read was highest-ROI: definitively refuted Finding 6 with 2 lines of evidence
- [iter-20] No failures -- gap analysis iteration used directory listing + cross-referencing, no external research targets
- [iter-19] Three prior synthesis iterations (16, 17, 18) served as pre-digested evidence: iter-16 for effort/impact, iter-17 for misalignment taxonomy, iter-18 for cross-validation verdicts. Unified these into P0/P1/P2 x S/M/L x 1-5 impact scoring with sprint-level roadmap. Adding test coverage gaps (Category G) as separate from the bugs they validate was an important structural decision
- [iter-20] Directory listing with LOC counts gave complete 28-subdirectory coverage map in one bash command. Cross-referencing against strategy.md iteration log made gap analysis systematic. Quantified the 42% investigated / 58% uninvestigated split that was invisible during the campaign
- [iter-21] The requested root review scope had no initialized deep-review state files, and the epic packet had only deep-research state plus `deep-research-strategy.md`; review continuation had to fall back to those artifacts as the nearest available state source

## Exhausted Approaches (do not retry)
[None yet]

## Next Focus
DEEP REVIEW FOLLOW-UP: fix the renamed-packet slug drift inside `012-pre-release-remediation/spec.md` and `plan.md`, then resolve whether `research/research.md` should be restored or all canonical references should move to the `research/` directory bundle. After those two traceability fixes, re-run validator-facing integrity review on the parent and root packet surfaces.

## Known Context
Prior research exists in research/research.md (consolidated from 002-hybrid-rag-fusion and 006-hybrid-rag-fusion-logic-improvements). The epic is 78.9% complete (S0-S3 done, S4-S9 pending). The system has 4 search channels (vector, BM25, FTS5, graph), 15+ scoring signals, and 32 MCP tools. Prior analysis campaign (w1-w7 files) exists in scratch/ from a different methodology.

## Research Boundaries
- Max iterations: 20
- Convergence threshold: 0.02
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Anti-premature-convergence: phased question injection at iter 5 and 10, domain rotation, iterations 18-20 exempt
- Current segment: 1
- Started: 2026-03-20T09:49:38Z

## Iteration Plan
### Phase 1: Broad Survey (1-4)
1. Pipeline architecture audit (4 stages, orchestrator, data flow)
2. Scoring system deep dive (15+ signals, fusion, calibration)
3. Graph channel + search subsystem status
4. Cross-system alignment scan

### Phase 2: Deep Investigation (5-9)
5. Fusion strategy (RRF vs RSF vs adaptive, intent weights)
6. Error handling + edge cases
7. Feature flag governance
8. Eval/measurement infrastructure quality
9. Save pipeline + memory quality gates

### Phase 3: Automation & UX (10-13)
10. Developer UX audit (tool naming, parameters, error messages)
11. Automation opportunities (indexing, ingest, file-watcher)
12. Cognitive subsystem review
13. Query intelligence effectiveness

### Phase 4: Cross-Cutting (14-17)
14. spec.md vs code reality check
15. Test coverage analysis
16. Performance & scalability
17. Session/collaboration features readiness

### Phase 5: Synthesis & Cross-Validation (18-20, convergence-exempt)
18. Cross-validate top 10 findings
19. Recommendation synthesis
20. Gap analysis + research debt inventory
