# Deep Research Strategy

## 2. TOPIC
Verify all Spec Kit Memory features (except shared memory) are enabled by default for all users. Optimize search result quality further. Optimize UX and auto-utilization without hooks. Check for bugs and refinement possibilities across specs 009-reindex-validator-false-positives, 010-search-retrieval-quality-fixes, 011-indexing-and-adaptive-fusion. Use cli-copilot GPT 5.4 high for supplementary investigation (1 agent per iteration).

## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which features are currently NOT enabled by default? **ANSWERED iteration 1**: 5 features are opt-in (RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP, NOVELTY_BOOST). 50 features default ON. ADAPTIVE_RANKING roadmap flag is OFF. Governance flags have a roadmap-ON/runtime-OFF discrepancy.
- [x] Q2: Are session boost, causal boost, intent weights, feedback signals, and graph signals all enabled by default? **ANSWERED iteration 1**: YES -- all five are enabled by default via `isFeatureEnabled()` in search-flags.ts.
- [x] Q3: Are there remaining search quality issues — false negatives, poor ranking, missing results — beyond what specs 009/010/011 fixed? **ANSWERED iteration 6**: No critical quality issues remain. Pipeline has 5-tier graceful fallback (hybrid->retry->FTS->BM25->structural), 25+ try/catch blocks with per-channel isolation, comprehensive null/NaN guards. One theoretical NaN edge case in reranker sort (P2-6). 10 total refinement items prioritized: 0 P0, 4 P1 (graph cap mismatch, recency boost, goal persistence, doc-type proportionality), 6 P2 (snippet metadata, constitutional limit, unused fields, circuit-breaker, trigger matching, reranker NaN). Two iteration-2 findings corrected: causal-boost import is NOT stale, session-boost null safety IS comprehensive.
- [x] Q4: Can UX and auto-utilization (auto-surface, progressive disclosure, goal refinement) be improved without requiring hooks? **ANSWERED iteration 4**: All three UX features are fully hookless and ON by default. Auto-surface fires in MCP context-server middleware on every non-memory tool call. Progressive disclosure (cursor pagination, summary layer, snippets) is enabled by default. Goal refinement runs per-session with keyword alignment boosting. Five specific improvement opportunities identified (see Q4 answer in section 6).
- [x] Q5: Are there bugs in the current implementation of the fusion pipeline (stage1-candidate-gen, stage2-fusion, stage3-rerank, stage4-filter)? **ANSWERED iteration 2**: No critical bugs found. Pipeline has 12-step signal order with G2 double-weighting prevention, proper score clamping [0,1], try/catch isolation per step, and compile-time + runtime score invariant enforcement in stage4. One fragility concern: stage2 shallow-spread clone of candidates does not deep-clone nested objects (graphContribution, sourceScores), but current code avoids in-place nested mutation. ADAPTIVE_RANKING=false is intentional (shadow/roadmap feature). Governance flag discrepancy is by design (standard feature graduation: roadmap -> shadow -> promoted -> default-on).
- [x] Q6: Are the validator fixes from spec 009 (cross-spec contamination V8, topical coherence V12) working correctly in production reindex? **ANSWERED iteration 3**: YES -- V8 has three-pronged detection (frontmatter, body-dominant, scattered) with severity=high, blockOnWrite+blockOnIndex. V12 checks trigger_phrase overlap with spec.md, severity=medium, blockOnIndex only.
- [x] Q7: Are the 6 retrieval quality fixes from spec 010 (intent propagation, folder narrowing, token budget, folder discovery boost, two-tier response, confidence floor) all working as designed? **ANSWERED iteration 3**: YES -- All 6 fixes confirmed present: intent classifyIntent+INTENT_LAMBDA_MAP, folder lookupFolders+enrichResultsWithFolderScores+twoPhaseRetrieval, token getDynamicTokenBudget with evaluationMode bypass, folder discovery as boost via isFolderScoringEnabled, two-tier metadata+content+trace response, confidence floor via truncateByConfidence+DEFAULT_MIN_RESULTS.
- [x] Q8: Is the lexical score propagation fix from spec 011 (BM25/FTS5 through RRF fusion) working correctly? **ANSWERED iteration 3**: YES -- FTS5 uses weighted BM25 scoring (title 10x, trigger 5x, path 2x, content 1x), scores propagate via sourceScores merge in mergeRawCandidate(), and surface in response envelope via 5-location fallback chain (fts_score, bm25_score, sourceScores.keyword/fts/bm25).
- [x] Q9: Are there refinement opportunities in adaptive fusion weights, convergence thresholds, or scoring parameters? **ANSWERED iteration 5**: YES -- 3 refinement opportunities: (R1) recency boost is negligibly small (max 0.02 effective), (R2) stage2 graph bonus cap (0.03) mismatches adaptive graphWeight (0.10-0.50), (R3) doc-type weight shift is flat (+/-0.1) regardless of intent profile base weights.
- [x] Q10: What is the current state of Code Graph and CocoIndex integration — are they contributing meaningfully to search results? **ANSWERED iteration 5**: Code Graph and CocoIndex are SEPARATE from memory search. The memory search pipeline uses the causal memory graph (causal_edges table) for graph signals -- 4 mechanisms: causal boost, co-activation, community detection, N2a+N2b signals. Code Graph provides structural code navigation via separate MCP tools. CocoIndex is a completely external semantic code search tool.

## 4. NON-GOALS
- Shared memory feature (explicitly excluded by user)
- Hook-based automation (user wants hookless solutions only)
- Breaking changes to existing APIs
- New feature development beyond refinement of existing capabilities

## 5. STOP CONDITIONS
- All 10 key questions answered with evidence
- All features confirmed enabled by default (or clear action items identified)
- No more bugs or quality issues found after 3 consecutive iterations
- Convergence threshold met (newInfoRatio < 0.05 for 3+ iterations)

## 6. ANSWERED QUESTIONS
- [x] Q1: 5 features are opt-in (RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP, NOVELTY_BOOST). 50 features default ON via isFeatureEnabled(). ADAPTIVE_RANKING roadmap flag is OFF by default. Governance flags (SCOPE_ENFORCEMENT, GOVERNANCE_GUARDRAILS) have roadmap-ON/runtime-OFF discrepancy -- runtime OFF takes precedence.
- [x] Q2: All five (session boost, causal boost, intent weights, feedback signals, graph signals) are enabled by default.
- [x] Q3: No critical quality issues remain. Pipeline has 5-tier graceful fallback chain, 25+ try/catch blocks with per-channel isolation, comprehensive null/NaN guards. 10 total refinement items: 0 P0, 4 P1 (graph cap mismatch, recency boost magnitude, goal persistence, doc-type shift proportionality), 6 P2 (snippet metadata, constitutional limit, unused session fields, circuit-breaker, trigger matching, reranker NaN defense). Two iteration-2 findings corrected: causal-boost import is NOT stale (used at line 160), session-boost null safety IS comprehensive.
- [x] Q4: All UX features are fully hookless. Auto-surface fires in MCP context-server middleware on every non-memory tool call (constitutional cached 1min/10 limit, trigger-matched, 4000 token budget). Progressive disclosure defaults ON (5/page, 5-min cursor TTL, summary+snippet+cursor). Goal refinement runs per-session with keyword alignment (max 1.2x boost). Session priming (T018 Prime Package) fires on first tool call with structured bootstrap payload. Five improvement opportunities: (1) goal always set to current query instead of persisted intent, (2) snippets lack title/score metadata, (3) constitutional limit of 10 may be too low, (4) openQuestions/preferredAnchors tracked but unused in ranking, (5) no circuit-breaker on auto-surface latency.
- [x] Q5: No critical bugs in fusion pipeline. Well-defended 12-step signal order, G2 prevention, score clamping, try/catch isolation. One fragility: shallow clone of candidates in stage2 (nested objects share references). ADAPTIVE_RANKING=false is intentional (roadmap feature). Governance flag discrepancy is by design.
- [x] Q6: V8 (cross-spec contamination) uses three-pronged detection (frontmatter, body-dominant, scattered) with severity=high, blocks both write and index. V12 (topical coherence) checks trigger_phrase overlap from parent spec.md, severity=medium, blocks index only. Both rules are correctly implemented and have test coverage.
- [x] Q7: All 6 retrieval quality fixes from spec 010 are present and integrated: intent propagation (classifyIntent + INTENT_LAMBDA_MAP), folder auto-narrowing (folder-relevance.js with two-phase retrieval), token budget truncation (dynamic-token-budget.js with evaluationMode bypass), folder discovery as boost signal (isFolderScoringEnabled), two-tier metadata+content response (search-results.ts), intent confidence floor (confidence-truncation.ts with DEFAULT_MIN_RESULTS).
- [x] Q8: Lexical score propagation is working. FTS5 uses weighted BM25 (title 10x, trigger 5x, path 2x, content 1x). Scores propagate through fusion via sourceScores merge in mergeRawCandidate(). Response formatter extracts lexical scores via 5-location fallback chain (fts_score, bm25_score, sourceScores.keyword/fts/bm25).
- [x] Q9: 3 refinement opportunities in adaptive fusion: (R1) recency boost max 0.02 effective -- negligibly small, functionally decorative; (R2) STAGE2_GRAPH_BONUS_CAP=0.03 but adaptive graphWeight ranges 0.10-0.50, creating a cap/weight mismatch; (R3) DOC_TYPE_WEIGHT_SHIFT=0.1 flat shift is disproportionate when applied to low-weight channels (e.g., +50% for 0.2-base vs +12.5% for 0.4-base). Weight profiles: understand(0.7/0.2/0.1/0.15), find_spec(0.7/0.2/0.1/0.30), fix_bug(0.4/0.4/0.2/0.10), add_feature(0.5/0.3/0.2/0.20), refactor(0.6/0.3/0.1/0.15), security_audit(0.3/0.5/0.2/0.15), find_decision(0.3/0.2/0.1/0.50).
- [x] Q10: Code Graph and CocoIndex are SEPARATE from memory search pipeline. Memory search uses causal memory graph (causal_edges table in memory DB) for 4 graph mechanisms: causal boost (2-hop traversal), co-activation spreading, community detection/injection, and N2a+N2b graph signals. Code Graph (code-graph.sqlite) provides structural code navigation (functions, classes, imports, calls) via separate MCP tools. CocoIndex is an external semantic code search tool that does not feed into memory search at all. The code_graph_context tool can accept CocoIndex results as seeds but this bridges Code Graph, not memory search.

## 7. WHAT WORKED
- [Iteration 14] Broad multi-pattern Grep for timing/latency patterns and console.warn across pipeline directory gave complete observability and logging picture in 2 searches
- [Iteration 14] Reading orchestrator.ts (195 lines total) gave the full 3-tier degradation architecture in one pass -- mandatory Stage 1, graceful Stages 2-4, cross-encoder circuit breaker
- [Iteration 14] Cross-referencing INSTALL_GUIDE.md env var docs with iteration 1 inventory (50+ vars) immediately quantified the documentation gap (only 4 of 50+ documented)
- [Iteration 15] Basic grep with sort -u gave a definitive complete list of 113 unique SPECKIT_* env vars in one command -- Perl regex (-P) failed silently in this environment
- [Iteration 15] Grep for cache/Map patterns across mcp_server found 12 module-level caches in one pass, enabling systematic bounded-ness audit
- [Iteration 15] Cross-referencing bounded graph-signals.ts enforceCacheBound() pattern with unbounded cross-encoder cache provided both the problem statement and the solution template
- [Iteration 13] Glob for `*.vitest.ts` plus targeted Grep for feature-specific terms (RECONSOLIDATION, GRAPH_WEIGHT_CAP, NOVELTY_BOOST, recency, DOC_TYPE_WEIGHT_SHIFT) across tests/ gave a complete map of which tests exist for which features in one pass
- [Iteration 13] Reading actual test assertions in search-flags.vitest.ts (line 77) revealed the explicit `expect(isReconsolidationEnabled()).toBe(false)` that will break when changing the default -- file names alone would not have caught this
- [Iteration 13] Reading stage2-fusion.vitest.ts confirmed graph bonus cap is tested at the STAGE2 level (0.03) but not the GRAPH_WEIGHT_CAP level (0.05), identifying a precise coverage gap
- [Iteration 12] Reading graph-calibration.ts (full file, 552 lines) gave the complete three-cap architecture in one pass -- STAGE2_GRAPH_BONUS_CAP(0.03), GRAPH_WEIGHT_CAP(0.05), and adaptive graphWeight(0.10-0.50) are clearly separated by concern level
- [Iteration 12] Reading constitutional injection code (stage1-candidate-gen.ts:950-1012) showed it was already well-designed with 5 guard mechanisms (limit + dedup + contextType + scope + conditional trigger), closing P1-2
- [Iteration 12] Mapping theoretical max graph contribution (0.03+0.05+0.05+0.03=0.16) confirmed GRAPH_WEIGHT_CAP=0.15 as the right value -- just below theoretical max
- [Iteration 1] Grep for SPECKIT_* across entire mcp_server codebase yielded comprehensive inventory
- [Iteration 1] Reading the three core flag files (search-flags.ts, rollout-policy.ts, capability-flags.ts) gave complete architectural picture
- [Iteration 1] Cross-referencing opencode.json with code defaults revealed redundant but documenting config
- [Iteration 2] Reading pipeline files in execution order (stage1 -> stage2 -> stage3 -> stage4) gave clear data flow and score contract understanding
- [Iteration 2] Module header I/O contracts and invariant documentation were exceptionally useful for verifying correctness
- [Iteration 2] Grep for ADAPTIVE_RANKING across tests and cognitive module confirmed intentionality via shadow/promoted/disabled mode design
- [Iteration 3] Reading TypeScript source (not compiled JS) for validator rules gave definitive evidence of V8/V12 logic
- [Iteration 3] Tracing imports in hybrid-search.ts confirmed all 6 retrieval quality fixes are wired into the pipeline
- [Iteration 3] The search-results formatter's lexical score extraction chain (5 fallback locations) confirmed propagation completeness
- [Iteration 4] Reading the three core UX modules (memory-surface.ts, progressive-disclosure.ts, session-state.ts) in sequence provided complete UX layer picture
- [Iteration 4] Grep for updateGoal/markSeen/setAnchors across handler confirmed exact wiring and revealed the goal-is-always-current-query limitation
- [Iteration 4] Tracing auto-surface from context-server dispatch through memory-surface confirmed fully hookless execution path
- [Iteration 5] Reading the canonical adaptive-fusion.ts shared module (433 lines) gave complete weight architecture in one file
- [Iteration 5] Grep for graph/cocoindex across the pipeline directory conclusively proved separation of concerns between memory graph, Code Graph, and CocoIndex
- [Iteration 6] Grep for error handling patterns (catch|fallback|empty|length===0) across the search directory gave a comprehensive map of all 25+ degradation paths in one query
- [Iteration 6] Reading specific edge case code (session-boost, reranker, stage1 quality filters) corrected two false positives from iteration 2 with high confidence
- [Iteration 7] Reading full trigger-matcher.ts (792 lines) revealed sophisticated Unicode boundary regex + n-gram candidate indexing -- corrected oversimplified "naive matching" finding from iteration 4
- [Iteration 7] Reading graph-calibration.ts full file gave definitive two-layer cap architecture with exact constants and env override paths
- [Iteration 7] Tracing recency through both folder-scoring and stage2 imports clarified the two-system architecture and identified the structural gap (no direct per-result recency in fusion)
- [Iteration 8] Reading full session-state.ts gave complete picture of P2-1/P2-2/P2-3 in one pass -- module header explicitly documents design intent (ephemeral by design), saving investigation time
- [Iteration 8] Reading ranking-contract.ts + types.ts resolveEffectiveScore together proved P2-6 NaN instability is structurally impossible with 3 defense layers
- [Iteration 8] Distinguishing query-classifier hasTriggerMatch (exact match for complexity classification) from trigger-matcher (boundary match for memory retrieval) revealed the inconsistency is partial -- different purposes but classifier could benefit from word-boundary approach
- [Iteration 9] Broad multi-pattern Grep across search directory (limit|truncat|pagina + embedding + multi.?query|expansion + length.?penal) located all relevant code for 7 edge case topics in 3 parallel searches
- [Iteration 9] Reading the shared embeddings factory.ts gave definitive provider/model/dimension configuration in one file
- [Iteration 9] Reading confidence-truncation.ts in full revealed mathematically sound elbow detection with proper edge case guards (NaN, Infinity, zero-gap, min-results floor)
- [Iteration 10] Reading flag implementation code in search-flags.ts gave definitive gating mechanism for each opt-in feature -- the double-gate pattern (explicit env check + isFeatureEnabled) for FILE_WATCHER/RERANKER_LOCAL immediately signaled external dependency concerns
- [Iteration 10] The NOVELTY_BOOST resolution was fastest: reading composite-scoring.ts showed calculateNoveltyBoost() always returns 0 with clear "eval complete, marginal value" comment
- [Iteration 10] Cross-referencing SPECKIT_RECONSOLIDATION with SPECKIT_ASSISTIVE_RECONSOLIDATION revealed the full-vs-lite reconsolidation distinction -- assistive is already graduated ON, making full reconsolidation a natural next step
- [Iteration 11] Reading the full executeStage2() function (lines 715-1102) gave definitive confirmation that recency is absent from hybrid search paths -- step 4 (intent weights) is the only recency entry point and it is explicitly skipped for hybrid via the G2 guard
- [Iteration 11] The computeRecencyScore import at line 80 was already present but unused in the main pipeline -- proving the function is available without new dependencies for the proposed step 1a
- [Iteration 11] Reading hasReconsolidationCheckpoint() in db-helpers.ts revealed the checkpoint safety gate already exists -- no new guard mechanism needed, just auto-creation of the checkpoint on first activation
- [Iteration 16] Reading session-manager.ts init() and SQLite schema setup corrected the "ephemeral by design" finding -- session state IS SQLite-persisted (session_state + session_sent_memories tables), only working-memory attention map is ephemeral
- [Iteration 16] Glob for *auto-surface* found the module at hooks/memory-surface.ts (not lib/search/ as expected) -- Glob is the right first step when dispatch suggests specific paths
- [Iteration 16] Reading profile-formatters.ts revealed 4 existing profiles (quick/research/resume/debug) that are not connected to the existing intent classifier, identifying the highest-impact improvement with minimal code change
- [Iteration 17] Reading intent-classifier.ts, profile-formatters.ts, and working-memory.ts in full (1437 lines total) gave complete architecture of both the intent and profile systems, making the gap between them immediately obvious
- [Iteration 17] Grep for classifyIntent|applyResponseProfile across handlers found exact injection points in both memory-search.ts:597/1108 and memory-context.ts:846/684
- [Iteration 17] Reading working-memory.ts schema + sessionModeRegistry identified the precise ephemeral boundary -- only the in-process Map is ephemeral, all SQLite working_memory rows persist across restarts
- [Iteration 19] Reading reconsolidation.ts executeMerge() (lines 212-300) verified the full database mutation path -- archives old memory, creates merged record, generates causal edge, refreshes BM25+interference+cache -- confirming the auto-checkpoint guard is essential
- [Iteration 19] Reading composite-scoring.ts calculateNoveltyBoost() (lines 529-531) gave instant definitive confirmation of dead code status -- underscore param + explicit JSDoc + `return 0`
- [Iteration 19] Cross-referencing 7 source files against 18 iterations of prior claims found zero contradictions -- all major findings validated

## 8. WHAT FAILED
- [Iteration 1] Nothing failed -- first iteration, all approaches productive
- [Iteration 2] Nothing failed -- pipeline code was accessible and well-documented
- [Iteration 3] Compiled JS search for V8/V12 returned no matches -- minification/name-mangling obscures rule IDs in dist output; had to fall back to TypeScript source
- [Iteration 4] Nothing failed -- all UX module files were accessible and well-documented
- [Iteration 5] Nothing failed -- all adaptive fusion and graph integration files were accessible
- [Iteration 6] Nothing failed -- edge case audit confirmed comprehensive error handling throughout pipeline
- [Iteration 7] Nothing failed -- all code locations found and investigated
- [Iteration 8] Searching for doc-type shift in stage2-fusion.ts returned nothing -- the logic lives in the shared adaptive-fusion module, not in pipeline stages. Required 3 progressive searches to locate (stage2 -> search dir -> shared/algorithms)
- [Iteration 9] Embeddings factory was at shared/embeddings/factory.ts not shared/mcp_server/embeddings/factory.ts -- required Glob to locate (minor cost)
- [Iteration 10] Nothing failed -- all 6 features investigated from flag definitions and implementation code
- [Iteration 11] computeRecencyScore source location required vitest cache hit (Grep found it in .tmp/vitest-tmp/ SSR build output) -- the TypeScript source exports it from folder-scoring.ts but the function body was only visible in the compiled vitest artifact. Minor cost -- the API signature and behavior were clear

## 8b. WHAT FAILED
- [Iteration 13] Initial Glob with `*.{test,vitest,spec}.{ts,js}` picked up 100+ node_modules results, wasting a tool call. The more specific `**/tests/*.vitest.ts` pattern was needed
- [Iteration 12] graph-calibration.ts was not at lib/graph/graph-calibration.ts as expected from prior iteration references -- it is at lib/search/graph-calibration.ts. Required Glob to locate (minor cost)
- [Iteration 15] grep with -P (Perl regex) flag failed silently -- had to fall back to basic grep with [A-Z_]* pattern (minor cost, 1 extra tool call)
- [Iteration 16] auto-surface module not at lib/search/auto-surface*.ts as dispatch suggested -- it lives at hooks/memory-surface.ts. Required Glob to locate (minor cost)

## 9. EXHAUSTED APPROACHES (do not retry)
- Searching for null-pointer crashes in pipeline stages -- all functions have proper null/undefined/NaN guards with Number.isFinite() checks
- Searching for off-by-one errors in filtering -- all comparison operators verified correct (>=, inclusive)

## 10. RULED OUT DIRECTIONS
- ADAPTIVE_RANKING=false as a bug -- confirmed intentional roadmap feature with shadow mode
- Governance flag discrepancy as a bug -- confirmed standard feature graduation pathway

## 11. NEXT FOCUS
All 10 key questions answered. All P1, P2, edge-case, and opt-in feature topics fully triaged. Highest-impact design (P1-3 recency fusion) fully specified in iteration 11. Hookless auto-utilization deep-dived in iteration 16.

**Hookless UX improvements identified (iteration 16, designed in iteration 17):**
- HIGHEST IMPACT: Intent-to-profile auto-routing (~85 lines total, connects existing classifyIntent() to applyResponseProfile()) -- FULLY DESIGNED in iteration 17: mapping table (7 intents -> 4 profiles), injection points (memory-search.ts:597/1108, memory-context.ts:848/684), override mechanism (explicit profile wins), env var control (SPECKIT_INTENT_AUTO_PROFILE)
- MEDIUM IMPACT: Attention-enriched context hints for trigger matcher (~20 lines, working-memory top-N -> auto-surface score boost) -- DESIGNED in iteration 17
- MEDIUM IMPACT: Prime Package enrichment (add memory health, recent session state, active spec detection)
- LOW IMPACT: Dynamic progressive disclosure page size based on confidence gap elbow detection
- LOW IMPACT: Auto-context for spec neighborhood (~200-300 lines, ~4-6 hours, requires spec-folder-level causal aggregation) -- ASSESSED in iteration 17
- CLOSED: Working-memory attention persistence -- already mostly solved (SQLite-backed), only sessionModeRegistry is ephemeral (low impact, not worth migration)

**Correction (iteration 16):** Session state IS already SQLite-persisted via session_state and session_sent_memories tables. Only the working-memory attention map (cognitive/working-memory.ts) is ephemeral in-process. Iteration 4/8 "ephemeral by design" verdict was about the attention map specifically, not session state broadly.

**Opt-in Feature Verdicts (iteration 10):**
- SPECKIT_RECONSOLIDATION: **ENABLE by default** (with auto-checkpoint guard) -- implementation path designed in iteration 11
- SPECKIT_QUALITY_LOOP: **ENABLE by default** (pure algorithmic, bounded, safe) -- implementation path designed in iteration 11
- SPECKIT_FILE_WATCHER: KEEP OPT-IN (chokidar native dep, background resources)
- RERANKER_LOCAL: KEEP OPT-IN (node-llama-cpp + GGUF + RAM requirement)
- SPECKIT_NOVELTY_BOOST: NO ACTION (code permanently returns 0, env var is inert) -- cleanup task identified
- SPECKIT_MEMORY_ADAPTIVE_RANKING: KEEP OFF (roadmap feature, needs graduation)

**Actionable refinement backlog (3 items, ~3 hours total):**
- P1-3: Direct recency bonus in Stage 2 fusion (~2 hours, highest impact) -- FULLY DESIGNED in iteration 11: step 1a injection point, additive bonus with weight=0.07/cap=0.10, uses existing computeRecencyScore(), env-var tunable
- P1-4: GRAPH_WEIGHT_CAP raise from 0.05 to 0.15 (~30 min) -- DESIGNED in iteration 12: change constant in graph-calibration.ts:25, per-mechanism caps (0.03) remain as guards
- P2-4: Doc-type proportional shift (~30 minutes)

**Closed refinement items (iteration 12):**
- P1-2: Constitutional injection cap -- CLOSED (already well-designed: limit=5 + dedup + contextType + scope filtering)
- P2-NEW (hasTriggerMatch): CLOSED (different purposes by design -- exact match for complexity, boundary for retrieval)

**Default-enable implementation work (2 items, ~2-3 hours total):**
- Enable SPECKIT_RECONSOLIDATION by default with auto-checkpoint on first activation (~1-2 hours) -- DESIGNED: change isReconsolidationEnabled() to use isFeatureEnabled(), add auto-checkpoint in reconsolidation-bridge.ts
- Enable SPECKIT_QUALITY_LOOP by default (~30 minutes, change flag check pattern) -- DESIGNED: change isQualityLoopEnabled() to use isFeatureEnabled()

**Nice-to-have (3 items, P3):**
- P3-1: "Query too broad" signal when score variance is very low (~2h, UX)
- P3-2: Post-limit diversity re-check after final .slice(0, limit) (~1h, edge case)
- P3-3: NOVELTY_BOOST dead code cleanup (~30 min) -- SCOPED in iteration 12: remove calculateNoveltyBoost() + 3 constants (NOVELTY_BOOST_MAX, NOVELTY_BOOST_HALF_LIFE_HOURS, NOVELTY_BOOST_SCORE_CAP) + test describe blocks in cold-start.vitest.ts + noveltyBoostApplied/noveltyBoostValue metadata fields

**Closed (5 items, no action):**
- P2-1: Working as designed (cursor pagination)
- P2-2: Working as designed (goal tracks current query)
- P2-3: Working as designed (ephemeral by design)
- P2-5: Already sophisticated (downgraded in iter 7)
- P2-6: Structurally impossible (3-layer NaN defense)

**Edge cases confirmed well-handled (iteration 9):**
- Result truncation: 4-layer capping architecture (per-channel, post-fusion, confidence gap, token budget)
- Embedding model: 3-provider factory with startup dimension validation, Voyage AI recommended
- Multi-query expansion: R12 embedding expansion + R15 mutual exclusion for simple queries, well-gated
- Document length bias: Two-level mitigation (BM25 normalization + cross-encoder LENGTH_PENALTY)
- Async race conditions: Not a concern -- pipeline is synchronous per-request, SQLite WAL isolation

All P1 items are now designed or closed. All P2 items are resolved except P2-4 (doc-type proportional shift, 30 min). All original 10 questions plus all refinement sub-questions are answered. NOVELTY_BOOST cleanup scoped. Feature interactions confirmed safe. hasTriggerMatch closed. Intent-to-profile auto-routing fully designed (iteration 17).

**Cross-cutting findings (iteration 14):**
- Pipeline timing: Production-grade per-stage + per-channel timing with trace exposure via `includeTrace: true`
- Error recovery: 3-tier degradation (mandatory Stage 1, graceful Stages 2-4, cross-encoder circuit breaker)
- Logging: 41+ console.warn calls across pipeline with consistent `[module-name]` prefix but no structured logger, no correlation IDs, no per-request summary line
- Database: WAL mode enforced on startup (T076), foreign keys ON, SQLite defaults appropriate for DB scale
- Env var docs: Only 4 of 50+ SPECKIT_* vars documented in INSTALL_GUIDE.md (P2 documentation gap)
- Missing circuit breaker: Embedding API path has no circuit breaker -- if provider is down, every search waits 10s timeout at Stage 1 before failing
- Cache eviction: Cross-encoder cache Map has no size limit (potential slow leak under high volume)

**New P2/P3 items from iteration 14:**
- P2-NEW: Env var reference documentation (extract from code comments to central table, ~2h)
- P3-NEW: Embedding API circuit breaker (mirror cross-encoder pattern for embedding provider, ~1-2h)
- P3-NEW: Structured pipeline completion log line (single JSON log per search, ~30min)
- P3-NEW: Cross-encoder cache size limit (add LRU eviction or max entries, ~30min)

**Iteration 15 updates:**
- Env var gap quantified precisely: 113 unique SPECKIT_* vars, only 4 documented (96% undocumented), categorized into 11 domains
- P2-NEW (env var docs) revised estimate: ~4-6 hours (was ~2h, revised upward due to 113 vars across 11 categories)
- P2-NEW: Cross-encoder cache size limit confirmed -- unbounded Map at cross-encoder.ts:115, fix designed using graph-signals enforceCacheBound pattern (~30 min)
- P3-NEW: co-activation cache size limit at co-activation.ts:80 (~15 min)
- P3-NEW: tool-cache.ts audit and bound at tool-cache.ts:67 (~15 min)
- Embedding API circuit breaker gap confirmed -- no circuit breaker anywhere in the embedding path (vector-index-store.ts or embedding factory)
- 12 module-level caches audited: 4 unbounded (cross-encoder, co-activation, tool-cache, regex), 4 properly bounded (graph signals, WeakMaps), 4 effectively bounded by key space
- Backlog completeness verified: all 9 research tracks adequately covered across 15 iterations

**Test Coverage Impact (iteration 13):**
- P1-3 (recency fusion): No existing test -- NEW test needed in stage2-fusion.vitest.ts
- P1-4 (GRAPH_WEIGHT_CAP): Partial coverage (stage2 tests 0.03 cap, not 0.05 cap) -- NEW test for graph-calibration
- RECONSOLIDATION default: 3+ assertions will BREAK in search-flags.vitest.ts + reconsolidation.vitest.ts -- UPDATE existing
- QUALITY_LOOP default: Indirect coverage only -- VERIFY + update flag defaults
- P2-4 (doc-type shift): No existing test -- NEW test for adaptive-fusion
- P3 NOVELTY_BOOST cleanup: ~200 lines of tests to REMOVE from cold-start.vitest.ts
- P3 hasTriggerMatch: No test -- optional (P3 priority)

**Implementation roadmap compiled (iteration 18):**
- 14 actionable items organized into 5 sprints across 5 phases (A-E)
- Phase A: Feature Defaults (DEF-1, DEF-2) -- ~1.5h, LOW risk
- Phase B: Fusion Refinements (P1-3, P1-4, P2-4) -- ~3h, LOW risk
- Phase C: UX Optimization (UX-1, UX-2, CACHE-1) -- ~2h, VERY LOW risk
- Phase D: Cleanup (CLEAN-1, CLEAN-2, CACHE-2) -- ~0.75h, ZERO risk
- Phase E: Infrastructure (INFRA-1, INFRA-2, UX-3) -- ~8-14h, MEDIUM risk
- Phases A-D total: ~7.25h (well-designed, ready to implement)
- Full backlog total: ~15-21h
- Dependency graph and implementation order defined in iteration-018.md
- No unresolved contradictions across 17 iterations (3 self-corrections verified)
- newInfoRatio trend: 0.71 -> 0.64 -> 0.57 -> 0.43 -> 0.43 -> 0.50 -> 0.57 -> 0.30 (expected decline for synthesis)

**Validation results (iteration 19):**
- RECONSOLIDATION: CONFIRMED safe to enable by default -- merge path IS destructive (archives old, creates merged) but hasReconsolidationCheckpoint() gate prevents activation without explicit checkpoint. Auto-checkpoint design validated.
- QUALITY_LOOP: CONFIRMED purely algorithmic, no I/O, no side effects. NUANCE: enabling enforcement means low-quality saves that previously got warnings will now be rejected. This is desired but should be documented.
- Stage 2 recency injection point: CONFIRMED at step 1a (between session boost and causal boost, ~line 780-790 of stage2-fusion.ts)
- GRAPH_WEIGHT_CAP=0.05: CONFIRMED exact at graph-calibration.ts:25
- NOVELTY_BOOST: CONFIRMED always returns 0, underscore-prefixed param, JSDoc explicitly says "inert"
- No missed features found
- Phase A safe for existing users (test assertions will break, quality enforcement may reject previously-warned saves)

All 7 verification targets passed. No contradictions with prior iterations. Research is complete.

Recommend: final iteration (20) for research.md polish with complete roadmap section and memory save for future sessions.

## 12. KNOWN CONTEXT
- **Spec 009**: Fixed false-positive validator rules (V8 cross-spec contamination, V12 topical coherence) that blocked 36+ memory files from reindex. 184 files on disk, only 56 in database before fix.
- **Spec 010**: Fixed 6 retrieval quality issues: intent propagation bug, silent folder auto-narrowing, aggressive token budget truncation, folder discovery as boost signal, two-tier metadata+content response, intent confidence floor.
- **Spec 011**: Fixed CocoIndex (stale venv/LMDB), Code Graph (lazy-init), adaptive fusion env vars (added to all 7 MCP configs), lexical score propagation (BM25/FTS5 through RRF).
- **Sub-phases of 011**: 8 phases (001-wire-promotion-gate through 008-create-sh-phase-parent) covering promotion gates, threshold persistence, feedback labels, access signal paths, e2e integration tests, default-on boost rollout, external graph memory research, create.sh phase parent.
- Memory context search returned 0 results for this specific topic — first-principles investigation required.

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current segment: 1
- Started: 2026-04-01T07:15:00Z
