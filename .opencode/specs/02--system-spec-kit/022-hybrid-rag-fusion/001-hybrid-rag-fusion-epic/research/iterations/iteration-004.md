# Iteration 4: Cross-System Alignment Scan

## Focus
Compare spec.md claims against actual code reality. Investigate the intent-classifier / query-classifier / query-router triad. Determine whether `applyIntentWeights` interacts correctly with Stage 2 (Q6). Check for redundancy between query-classifier and intent-classifier. Audit capability-flags.ts governance pattern. Count actual search channels (spec says "4", code says "5").

## Findings

### F1: 5 Channels, Not 4 -- Spec Claim Mismatch
The spec.md and prior documentation claim "4 search channels" (vector, BM25, FTS5, graph). However, query-router.ts defines 5 channels:
```
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
```
The 5th channel, `degree` (typed-degree from graph subsystem), is treated as a first-class RRF channel with its own routing slot. The "complex" tier routes all 5 channels. The spec's "4 channels" claim is outdated -- degree was added as part of graph unification but documentation was not updated.
[SOURCE: mcp_server/lib/search/query-router.ts:22,39,60]

### F2: Intent Classifier and Query Classifier Are NOT Redundant -- They Serve Different Purposes
- **intent-classifier.ts** (619 lines): Classifies query *intent* (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision). Uses 3 scoring channels: keyword matching, regex patterns, and deterministic centroid embeddings (FNV-1a hash + dot product). Outputs `IntentType` + per-intent weight adjustments (recency/importance/similarity ratios).
- **query-classifier.ts** (224 lines): Classifies query *complexity* (simple, moderate, complex). Uses term count, stop-word ratio, and trigger-phrase matching. Outputs `QueryComplexityTier` for channel routing.
- **query-router.ts** (167 lines): Consumes query-classifier output to determine which channel subset to activate. Maps tiers to channel subsets: simple=2, moderate=3, complex=5 channels.

These are orthogonal classifiers: intent determines *scoring weights*, complexity determines *channel activation*. Not redundant.
[SOURCE: mcp_server/lib/search/intent-classifier.ts:1-625, query-classifier.ts:1-224, query-router.ts:1-167]

### F3: DEAD CODE -- `applyIntentWeights()` in intent-classifier.ts Is Never Called (Q6 Partial Answer)
The intent-classifier exports `applyIntentWeights()` (line 485-525), which takes `Record<string, unknown>[]` results and applies intent-based scoring. However, Grep confirms it is **never imported** by any file in `lib/`. Stage 2 has its own independently-implemented `applyIntentWeightsToResults()` (line 310-349 of stage2-fusion.ts) that takes `PipelineRow[]` and `IntentWeightsConfig`. The two functions have the same algorithmic structure (similarity * w.similarity + importance * w.importance + recency * w.recency) but different:
- Input types (generic Record vs typed PipelineRow)
- Recency computation (intent-classifier does min/max normalization from timestamps; stage2 uses `computeRecencyScore()` with importance-tier awareness)
- Similarity normalization (intent-classifier uses `similarity/100`; stage2 also does `/100` but with `resolveBaseScore` fallback)

The stage2 version is superior (typed, uses proper recency, importance-tier aware). The intent-classifier version is orphaned dead code.
[SOURCE: mcp_server/lib/search/intent-classifier.ts:485-525, mcp_server/lib/search/pipeline/stage2-fusion.ts:310-349]
[INFERENCE: Grep for `applyIntentWeights[^T]` across lib/ returned only intent-classifier.ts (definition + export), zero imports elsewhere]

### F4: Q6 Answer -- Intent Weights DO Interact With Stage 2, But Via a Different Path
The interaction path is: `hybrid-search.ts` calls `classifyIntent(query)` to get the `IntentType`, then passes the intent to the pipeline config. Stage 2 receives intent weights via `config.intentWeights` and calls its own `applyIntentWeightsToResults()`. The 7 intent types each have hardcoded weight maps:
| Intent | Recency | Importance | Similarity | ContextType |
|---|---|---|---|---|
| add_feature | 0.3 | 0.4 | 0.3 | implementation |
| fix_bug | 0.5 | 0.2 | 0.3 | implementation |
| refactor | 0.2 | 0.3 | 0.5 | implementation |
| security_audit | 0.1 | 0.5 | 0.4 | research |
| understand | 0.2 | 0.3 | 0.5 | null |
| find_spec | 0.1 | 0.5 | 0.4 | decision |
| find_decision | 0.1 | 0.5 | 0.4 | decision |

All weight triplets sum to 1.0 (verified). The weights are consumed by Stage 2 step 10 (intent-based scoring). The interaction is correct -- no misalignment between classifier output and stage2 consumption.
[SOURCE: mcp_server/lib/search/intent-classifier.ts:189-197, hybrid-search.ts:14,733, stage2-fusion.ts:719]

### F5: Intent Classifier Has a Sophisticated 3-Channel Architecture
The classifier uses 3 independent scoring channels with fixed blend weights:
- Centroid embedding (50%): deterministic bag-of-words with 128-dim FNV-1a hashing
- Keyword matching (35%): per-intent keyword lists with single-match penalty (0.3x discount)
- Regex patterns (15%): structural pattern matching

Plus two override mechanisms:
- Negative patterns: penalize incorrect intent matches (0.3x on first match)
- Explicit spec lookup: +0.25 boost for find_spec, 0.6x penalty for security_audit
- Minimum confidence threshold: 0.08 (below this, defaults to "understand")

Plus an MMR lambda mapping (C138): intent-to-diversity tradeoff (understand=0.5 diverse, fix_bug=0.85 relevant).
[SOURCE: mcp_server/lib/search/intent-classifier.ts:406,187,584-592]

### F6: Capability Flags Have Dual-Env Legacy Support (Governance Finding)
capability-flags.ts uses a dual-env pattern: each flag has both a `SPECKIT_MEMORY_*` canonical name and a `SPECKIT_HYDRA_*` legacy name. The resolution order is: check canonical first, then legacy, then default. This is a migration artifact -- the system was renamed from "Hydra" to "Speckit Memory Roadmap" but legacy env vars are still honored for backward compatibility. The phase defaults to `shared-rollout` (latest phase), and all 6 capability flags default to ON unless explicitly disabled.

The 6 roadmap capability flags are: lineageState, graphUnified, adaptiveRanking, scopeEnforcement, governanceGuardrails, sharedMemory. These are separate from the 3+ runtime feature flags (SPECKIT_COMPLEXITY_ROUTER, SPECKIT_GRAPH_UNIFIED, etc.) found in other modules. There is a naming overlap: `graphUnified` in capability-flags refers to roadmap phase tracking, while `SPECKIT_GRAPH_UNIFIED` in rollout-policy controls runtime graph behavior. This could cause confusion.
[SOURCE: mcp_server/lib/config/capability-flags.ts:38-54,77-84,87-98]

### F7: Query Complexity Router Is Graduated (Default ON)
`isComplexityRouterEnabled()` returns true unless `SPECKIT_COMPLEXITY_ROUTER=false`. This means the complexity-based channel routing is live in production: simple queries only use 2 channels (vector + fts), moderate use 3, complex use all 5. This is a significant performance optimization that is already deployed. The router has a minimum 2-channel invariant (vector + fts fallback) and a safe error fallback to "complex" (all channels).
[SOURCE: mcp_server/lib/search/query-classifier.ts:45-48, query-router.ts:57-61]

### F8: `detectIntent()` Is a Trivial Alias -- Code Smell
`detectIntent()` on line 464-466 is a 1-line alias for `classifyIntent()`. Both are exported. This adds API surface without value. It is a minor code smell -- not dead code (it could be imported elsewhere), but the alias pattern suggests an incomplete rename/migration.
[SOURCE: mcp_server/lib/search/intent-classifier.ts:464-466]

## Sources Consulted
- mcp_server/lib/search/intent-classifier.ts (full read, 625 lines)
- mcp_server/lib/search/query-classifier.ts (full read, 224 lines)
- mcp_server/lib/search/query-router.ts (full read, 167 lines)
- mcp_server/lib/config/capability-flags.ts (full read, 154 lines)
- mcp_server/lib/search/pipeline/stage2-fusion.ts (partial read, lines 300-349)
- Grep: `applyIntentWeights` across mcp_server/lib/ (all .ts files)
- Grep: `classifyIntent|detectIntent` across mcp_server/lib/ (all .ts files)

## Assessment
- New information ratio: 0.88 (7 of 8 findings are new; F4 partially confirms prior suspicion from iter-2)
- Questions addressed: Q5 (partial -- found dead code and naming confusion), Q6 (fully answered)
- Questions answered: Q6
- Partially answered: Q5 (found 3 misalignment types: dead applyIntentWeights export, Hydra/Speckit naming confusion, 4-vs-5 channel documentation error)

## Reflection
- What worked and why: Reading the three search classifiers in parallel gave a complete picture of the two-axis classification system (intent + complexity) in one pass. The Grep for `applyIntentWeights[^T]` was the decisive test for the dead code finding -- negative evidence (zero imports) is conclusive.
- What did not work and why: The dispatch context paths were wrong again (3rd occurrence). The `shared/` prefix does not exist. The correct root is `mcp_server/`.
- What I would do differently: For the next iteration, read stage2-fusion.ts from the beginning to understand the full 12-step scoring order and how intent weights interact with other scoring steps (not just the applyIntentWeightsToResults call).

## Recommended Next Focus
Iteration 5 should begin Phase 2 deep investigations. Focus on RRF vs RSF fusion strategy details and how the 5 channels are actually weighted in RRF. Also investigate Q1 (pipeline improvement opportunities) now that we understand both the 4-stage architecture and the 5-channel routing. Read rrf-fusion.ts fully.
