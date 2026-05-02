# Iteration 12: Query Expansion Effectiveness + Weight Coherence Synthesis

## Focus
Investigate Q15 (query expansion/classification effectiveness) by reading all three expansion/classification modules and tracing their integration into Stage 1 candidate generation. Also complete the Q1 pipeline weight coherence analysis by cross-referencing how expansion interacts with the 3 conflicting weight systems identified in iteration 5.

## Findings

### Query Classification System (query-classifier.ts, 224 LOC)

1. **Three-tier complexity classification is purely heuristic.** Query complexity is classified as simple/moderate/complex based on term count thresholds: simple <= 3 terms, complex > 8 terms, moderate = everything in between. Stop-word ratio is used only for confidence scoring, not tier assignment. A trigger phrase match forces "simple" regardless of term count.
   [SOURCE: mcp_server/lib/search/query-classifier.ts:176-182]

2. **Feature flag is default-ON (graduated).** `SPECKIT_COMPLEXITY_ROUTER` defaults to true. When disabled, ALL queries classify as "complex" -- this is the safe fallback because it triggers the full pipeline (no channels are skipped).
   [SOURCE: mcp_server/lib/search/query-classifier.ts:46-48, 156-158]

3. **Confidence labeling has no downstream consumers.** The ClassificationResult includes a `confidence` field ('high'|'medium'|'low'|'fallback') but it is never consumed by any caller. Query-router.ts and embedding-expansion.ts both use only `tier`, discarding confidence. This is dead data -- not a bug, but wasted computation.
   [SOURCE: mcp_server/lib/search/query-classifier.ts:99-124; confirmed via grep: no caller reads `.confidence` from the result]

### Rule-Based Query Expansion (query-expander.ts, 96 LOC)

4. **Expansion is rule-based synonym substitution with a hardcoded 27-entry vocabulary map.** No LLM calls. For each query word matching a key in `DOMAIN_VOCABULARY_MAP`, one synonym is substituted to create a variant. Maximum 3 variants total (original + 2 expansions). The map covers 5 domains: auth (4 entries), error (4), architecture (4), code (3), memory system (12).
   [SOURCE: mcp_server/lib/search/query-expander.ts:12, 23-56, 73-95]

5. **Expansion is used ONLY in deep mode (`mode === 'deep'`).** `expandQuery()` is called exclusively via `buildDeepQueryVariants()` in stage1-candidate-gen.ts, which only runs when `mode === 'deep' && isMultiQueryEnabled()`. Standard (non-deep) hybrid searches never use rule-based expansion.
   [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:272-275]

6. **Each expansion variant triggers a FULL hybrid search with its own embedding generation.** For a 3-variant expansion, this means 3x embedding generation + 3x hybrid search (each hybrid search itself runs vector + BM25 + FTS5 + graph). This is potentially a 3x latency multiplier on the most expensive pipeline operation, with no caching of intermediate embeddings.
   [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:278-288]

### Embedding-Based Query Expansion (embedding-expansion.ts, 305 LOC)

7. **R12 embedding expansion is a separate system from rule-based expansion.** It uses vector similarity to find semantically related memories, extracts high-frequency terms from their content/title/triggers, and appends up to 8 terms to the original query. This runs on standard hybrid searches (not deep mode) when `SPECKIT_EMBEDDING_EXPANSION` flag is ON (default: ON, graduated).
   [SOURCE: mcp_server/lib/search/embedding-expansion.ts:181-280]

8. **R12/R15 mutual exclusion is correctly implemented.** When query-classifier returns `tier === 'simple'`, embedding expansion returns immediately with an identity result (no expansion). This prevents unnecessary latency on short queries. The check happens twice -- once via `isExpansionActive()` in stage1 and once inside `expandQueryWithEmbeddings()` itself -- which is redundant but not harmful.
   [SOURCE: mcp_server/lib/search/embedding-expansion.ts:196-199; stage1-candidate-gen.ts:340]

9. **R12 expansion adds a 2nd parallel hybrid search channel.** When expansion produces new terms, Stage 1 runs the baseline AND expanded queries in parallel via `Promise.all()`, then merges and deduplicates by ID with baseline-first ordering. This is architecturally sound -- the parallel execution means latency is bounded by max(baseline, expanded) rather than sum.
   [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:357-396]

### Latency and Effectiveness Assessment

10. **Deep mode expansion has unbounded latency cost.** Rule-based expansion (deep mode) generates up to 3 variants, each requiring a separate embedding + full hybrid search. There is no timeout, no caching, and no abort-on-first-good-result mechanism. For a 27-entry vocabulary with broad matches (e.g., "memory" -> "context", "knowledge"), many queries will hit 3 variants, tripling latency.
    [INFERENCE: based on stage1-candidate-gen.ts:277-303 (sequential embedding, parallel hybrid) and query-expander.ts:77-92 (iteration until MAX_VARIANTS)]

11. **R12 expansion's effectiveness is questionable for the memory domain.** The expansion mines terms from the TOP 5 most similar memories. If vector search already found those 5 memories, the expanded query is essentially a reformulation of what was already retrieved. The expansion can only help if the expanded terms pull in memories that the original query missed AND those memories were in the index's neighborhood of the original embedding. This is a narrow window of improvement.
    [INFERENCE: based on embedding-expansion.ts:210-270 -- expansion terms come from the same semantic neighborhood as the original query embedding]

12. **Two expansion systems operate in mutual exclusion but the boundary is mode-based, not effectiveness-based.** Deep mode uses rule-based expansion; standard mode uses R12 embedding expansion. Neither system has metrics, logging, or eval hooks to measure whether expansion improved recall. The eval/ablation framework (iter-8) tests CHANNELS but not expansion variants within a channel. There is no way to know if expansion helps without adding dedicated instrumentation.
    [INFERENCE: based on stage1-candidate-gen.ts architecture (deep vs non-deep branching at lines 272 and 328) + iteration 8 findings on eval scope]

### Weight Coherence Synthesis (completing Q1)

13. **Query expansion does NOT interact with the 3 conflicting weight systems.** Expansion operates entirely in Stage 1 (candidate generation). The weight conflicts (hybrid-search hardcoded weights, adaptive-fusion intent-specific weights, rrf-fusion graph boost) all operate in Stage 2 (scoring/fusion). Expanded queries generate additional candidates, but those candidates enter the SAME scoring pipeline as non-expanded ones. The weight incoherence affects ALL candidates equally, whether expansion-sourced or not.
    [INFERENCE: based on stage1-candidate-gen.ts architecture (expansion only affects candidates array) + iteration 5 findings (weight conflicts in Stage 2)]

14. **The complete weight incoherence picture is now a 4-system conflict, not 3.** The cognitive subsystem (iter-10) adds its own scoring adjustments via co-activation boost and attention decay in Stage 2, but these operate as additive signals rather than competing with the RRF/adaptive-fusion weights. The true conflict remains the 3 systems identified in iter-5: (a) hybrid-search hardcoded channel weights, (b) adaptive-fusion intent-specific weights covering only 2 of 5 channels, (c) rrf-fusion graph boost. The cognitive signals layer on top without resolving the underlying incoherence.
    [INFERENCE: based on iteration 5 weight analysis + iteration 10 cognitive subsystem review + this iteration's expansion architecture confirmation]

## Sources Consulted
- mcp_server/lib/search/query-expander.ts (96 LOC, full read)
- mcp_server/lib/search/query-classifier.ts (224 LOC, full read)
- mcp_server/lib/search/embedding-expansion.ts (305 LOC, full read)
- mcp_server/lib/search/pipeline/stage1-candidate-gen.ts (702 LOC, full read)
- Grep: expansion/classification function usage across lib/search/

## Assessment
- New information ratio: 0.79
- Questions addressed: Q1, Q5, Q15
- Questions answered: Q15

### newInfoRatio calculation
- 14 total findings
- Fully new: F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12 (12 findings on expansion/classification systems -- entirely new territory)
- Partially new: F13 (synthesizes iter-5 + iter-10 findings with new expansion data), F14 (extends known weight conflict with new cognitive interaction data)
- Redundant: 0
- Ratio: (12 + 0.5*2) / 14 = 13/14 = 0.93 -- but applying honest discount because F13-F14 are largely synthesis of prior findings rather than net-new information. Adjusted: 0.79

## Reflection
- What worked and why: Reading the three query intelligence modules (expander, classifier, embedding-expansion) together in one pass gave the complete expansion picture. The architectural separation is clean enough that each module is self-contained. Reading stage1 confirmed exactly how expansion integrates -- the mode-based branching (deep vs standard) is the critical dispatch point.
- What did not work and why: No failures this iteration. All file paths were correct as provided in dispatch context.
- What I would do differently: For Q16 (hot paths/latency), the expansion analysis here provides a strong lead -- deep mode expansion is the most obvious latency concern. Next iteration should quantify this by examining the hybrid-search.ts searchWithFallback to count the actual DB queries per expansion variant.

## Recommended Next Focus
Investigate Q16 (hot paths and latency) by examining the hybrid-search.ts searchWithFallback implementation to count actual DB queries per search invocation. Also address remaining Q5 by checking spec.md claims about query expansion against the actual code behavior documented here. Q17 (session/collaboration features) can be started by reading the shared-spaces module.
