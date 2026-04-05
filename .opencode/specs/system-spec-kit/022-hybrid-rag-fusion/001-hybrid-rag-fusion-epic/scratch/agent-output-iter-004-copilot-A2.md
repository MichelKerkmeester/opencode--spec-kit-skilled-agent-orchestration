# Audit findings: spec claims vs code reality

## Scope

Checked:

- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/research/research/research.md`
- `intent-classifier.ts`
- `query-router.ts`
- `query-classifier.ts`
- `capability-flags.ts`
- `rollout-policy.ts`

Also traced the live wiring through `memory-search.ts`, `hybrid-search.ts`, Stage 2 pipeline code, and current startup/reinit call sites.

## 1) "4 search channels" does **not** match current code

The research doc still describes a 4-channel scatter of `vector`, `FTS5`, `BM25`, and `graph` in its "current state" diagram, with graph previously shown as a dead path.[^research-4ch]

Current runtime code is explicitly **5-channel**:

- `query-router.ts` defines all channels as `['vector', 'fts', 'bm25', 'graph', 'degree']` and routes complexity tiers across that set.[^router-5]
- `lib/search/README.md` documents the live Stage 1 pipeline as 5 channels: Vector, BM25, FTS5, Graph, Degree.[^search-readme-5]
- `hybrid-search.ts` executes all five channels when enabled and not complexity-routed away: vector, FTS, BM25, graph, then degree.[^hybrid-5]

### Which channels are actually live?

**Live in current production wiring:**

1. `vector`
2. `fts`
3. `bm25`
4. `graph`
5. `degree`

Important nuance:

- `graph` is now genuinely live because `context-server.ts` creates a real graph search function and passes it into `hybridSearch.init(...)`, and `db-state.ts` preserves that on DB reinit.[^graph-init][^graph-reinit]
- `degree` is also live, but it is a structure-aware channel derived from IDs returned by earlier channels; it only contributes when prior channels produced numeric IDs and `SPECKIT_DEGREE_BOOST` is enabled.[^hybrid-degree]
- `query-router.ts` may intentionally skip `graph` and `degree` for simple/moderate queries; "live" does not mean "always executed".[^router-defaults]

Bottom line: the "4 search channels" claim is stale. Current reality is a **5-channel hybrid pipeline**.

## 2) Intent weights flow into Stage 2 only partially, and the G2 guard is real

### How the weights are produced

`intent-classifier.ts` defines per-intent weights for `recency`, `importance`, `similarity`, plus a `contextType` hint.[^intent-weights]

`handlers/memory-search.ts` computes `detectedIntent` / `intentWeights` and passes them into `PipelineConfig`.[^memory-search-intent][^memory-search-pipeline]

### What actually reaches Stage 2

Only the numeric fields survive into pipeline config:

- `toIntentWeightsConfig()` copies `similarity`, `importance`, and `recency`
- it **drops `contextType` entirely**[^to-intent-config]

So the Stage 2 executor never sees the `contextType` hint from `intent-classifier.ts`.

### G2 guard behavior

The Stage 2 implementation is explicit:

- `executeStage2()` computes `isHybrid = config.searchType === 'hybrid'`[^stage2-hybrid]
- intent weighting only runs under `if (!isHybrid && config.intentWeights)`[^stage2-guard]

That means the **G2 double-weighting guard is correctly implemented**: Stage 2 will not re-apply intent weights to hybrid results.

### Practical effect in the main `memory_search` path

The main handler builds `searchType` as:

- `'multi-concept'` when concepts are supplied
- otherwise `'hybrid'`[^memory-search-searchtype]

There is no plain `vector` path from the main `memory_search` entrypoint here. So in typical query-driven searches, Stage 2 intent weighting usually does **not** fire because `searchType` is `hybrid`.

Instead, for hybrid searches:

- intent is used earlier in `hybrid-search.ts` to pick adaptive fusion weights[^hybrid-adaptive]
- and later to choose MMR lambda[^hybrid-mmr]

### Verdict on Q2

Per-intent weights are **not fully flowing into Stage 2**:

- `recency` / `importance` / `similarity`: yes, but only on non-hybrid searches
- `contextType`: no, it is dropped before pipeline execution

Per the G2 guard, the Stage 2 behavior itself is correct. The bigger reality gap is that the common `memory_search` path is hybrid, so Stage 2 `intentWeightsApplied` will usually remain false even though intent still affects hybrid fusion elsewhere.

## 3) `query-router.ts` and `query-classifier.ts` are not redundant

They overlap conceptually, but they have different responsibilities and both have live consumers.

### `query-classifier.ts`

Purpose: classify query complexity into `simple | moderate | complex` and expose supporting features/confidence.[^classifier-purpose]

Independent consumers:

- `query-router.ts` calls it to choose channels[^router-calls-classifier]
- `embedding-expansion.ts` also calls `classifyQueryComplexity()` directly, outside the router path (confirmed by usage search)

### `query-router.ts`

Purpose: map complexity tiers to concrete channel subsets, enforce the minimum-2-channel invariant, and provide a single `routeQuery()` convenience API.[^router-purpose]

Live consumer:

- `hybrid-search.ts` calls `routeQuery(query, options.triggerPhrases)` to determine active channels before channel execution.[^hybrid-route]

### Verdict on Q3

Not redundant.

- `query-classifier.ts` = complexity analysis
- `query-router.ts` = execution policy based on that analysis

If desired, they could be merged architecturally, but in the current code they serve distinct responsibilities and are both used.

## 4) What `capability-flags.ts` governs, and whether it enforces a 6-flag limit

`capability-flags.ts` governs the **memory roadmap snapshot**, not the full runtime feature-flag system.

It defines:

- roadmap phases: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`[^cap-phases]
- six roadmap capability booleans:
  - `lineageState`
  - `graphUnified`
  - `adaptiveRanking`
  - `scopeEnforcement`
  - `governanceGuardrails`
  - `sharedMemory`[^cap-six]

Current consumers are snapshot/metadata oriented:

- retrieval telemetry (`createTelemetry`) embeds roadmap defaults into architecture metadata[^cap-telemetry]
- memory-state baseline snapshots include the same defaults[^cap-baseline]
- checkpoint creation writes phase/capabilities into checkpoint metadata[^cap-checkpoint]

### Does it enforce a 6-flag limit?

**No runtime "6-flag limit" enforcement exists in this file.**

What it does do:

- hard-code exactly six fields in the `MemoryRoadmapCapabilityFlags` interface and the returned object[^cap-six]

What it does **not** do:

- count flags
- validate that only six env vars exist
- reject additional capabilities elsewhere in the system

So the file models a six-capability roadmap snapshot, but it does **not** enforce a generic max-of-6 rule.

## 5) `rollout-policy.ts` is live code, but only some usages are truly progressive rollout

`rollout-policy.ts` is definitely **not dead code**.

It provides:

- `getRolloutPercent()` from `SPECKIT_ROLLOUT_PERCENT`[^rollout-core]
- deterministic identity bucketing[^rollout-core]
- `isIdentityInRollout(identity)`[^rollout-core]
- `isFeatureEnabled(flagName, identity?)`[^rollout-core]

### Confirmed runtime consumers

- `memory-context.ts` uses `isIdentityInRollout(effectiveSessionId)` to gate pressure policy and auto-resume when rollout percent is configured.[^rollout-memory-context]
- `extraction-adapter.ts` uses `isFeatureEnabled('SPECKIT_EXTRACTION', identity)`.[^rollout-extraction]
- `working-memory.ts` uses `isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)`.[^rollout-event-decay]
- `search-flags.ts` and `graph-flags.ts` use `isFeatureEnabled(...)` broadly for search/runtime feature gates such as MMR, TRM, cross-encoder, graph unified, etc.[^rollout-searchflags][^rollout-graphflags]

### Is it actually doing progressive rollout?

**Yes, but only for identity-aware call sites.**

Where an identity/session ID is passed, percentage rollout is real.

Where no identity is passed, behavior is effectively:

- explicit `false` / `0` disables
- otherwise default-on when rollout is 100
- with rollout < 100, `isFeatureEnabled()` returns false if identity is missing[^rollout-core]

So this is live rollout infrastructure, but not every caller uses it in a way that gives true per-identity progressive rollout. Some consumers are percentage-rollout capable; others are basically coarse on/off flags.

## Overall conclusion

1. The research note's 4-channel description is stale; current code is 5-channel.
2. The old "graph channel is dead in production" statement is also stale; graph is now wired at startup and on DB reinit.
3. Intent weighting is implemented with a correct G2 guard, but Stage 2 only applies it for non-hybrid searches, and `contextType` is currently dropped before pipeline execution.
4. `query-router.ts` and `query-classifier.ts` are both justified by current usage.
5. `capability-flags.ts` is a roadmap metadata snapshot module, not a universal feature gate, and it does not enforce a 6-flag ceiling.
6. `rollout-policy.ts` is live and used, though true progressive rollout depends on whether the caller passes an identity.

---

[^research-4ch]: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/research/research/research.md:118-123,148-153`
[^router-5]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:21-24,38-45,57-60`
[^router-defaults]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:52-60,95-101,119-141`
[^search-readme-5]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:41-42,87-97,100-113`
[^hybrid-5]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:558-566,605-709`
[^graph-init]: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:890-899`
[^graph-reinit]: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:41-45,57-65,88-92,106-110,182-187`
[^hybrid-degree]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:668-705`
[^intent-weights]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:16-21,189-197`
[^memory-search-intent]: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:847-867`
[^memory-search-pipeline]: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:931-968`
[^to-intent-config]: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:109-117`
[^stage2-hybrid]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:578-580`
[^stage2-guard]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:713-730`
[^memory-search-searchtype]: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:934-936`
[^hybrid-adaptive]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:732-745`
[^hybrid-mmr]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:907-909`
[^classifier-purpose]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:8-19,127-146,165-196`
[^router-calls-classifier]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:7-12,119-141`
[^router-purpose]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24-35,41-45,67-102,108-141`
[^hybrid-route]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:558-566`
[^cap-phases]: `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:10-13,56-57,86-98`
[^cap-six]: `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:15-23,38-54,101-127`
[^cap-telemetry]: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:177-211`
[^cap-baseline]: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:176-199`
[^cap-checkpoint]: `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:184-201`
[^rollout-core]: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:5-57`
[^rollout-memory-context]: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:629-645`
[^rollout-extraction]: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:71-73`
[^rollout-event-decay]: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:557-563`
[^rollout-searchflags]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:23-53`
[^rollout-graphflags]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:13-18`
