# Research Iteration 3: Stage 1 flow and `channelCount`

## Scope

This iteration investigated the Stage 1 pipeline flow to answer six questions:

1. Where Stage 1 is orchestrated and where `channelCount` is set.
2. How `Stage1Input`, `Stage1Output`, and `PipelineConfig` shape that flow.
3. How `memory_search` invokes the pipeline.
4. Whether Stage 1 can bypass `collectRawCandidates()`.
5. Whether `channelCount` reflects configured channels or channels that returned results.
6. Whether `searchType: 'hybrid'` can legitimately produce `channelCount: 1`.

## Key findings

### 1. `memory_search` does **not** use the query router to choose `searchType`

`memory_search` builds `PipelineConfig` directly and sets:

- `searchType: 'multi-concept'` only when the request includes a valid `concepts` array with length >= 2.
- Otherwise it always sets `searchType: 'hybrid'`.

So the pipeline entry point is not taking a router-produced channel list and converting that into Stage 1 metadata. The handler just says "run the hybrid Stage 1 path."

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:684-721`

### 2. Stage 1 metadata comes straight from `executeStage1()`

The pipeline orchestrator simply passes the `PipelineConfig` into `executeStage1({ config })`, then returns `stage1Result.metadata` unchanged in the final `PipelineResult`.

That means the reported:

- `searchType`
- `channelCount`
- `candidateCount`

are Stage 1's own accounting, not something recomputed later by the orchestrator.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:57-78`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:182-194`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:194-210`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:323-337`

### 3. The main Stage 1 execution function is `executeStage1()`

`executeStage1()` is the Stage 1 orchestrator. It destructures `config`, initializes:

- `let candidates: PipelineRow[] = [];`
- `let channelCount = 0;`

and then enters one of three top-level branches:

- `searchType === 'multi-concept'`
- `searchType === 'hybrid'`
- `searchType === 'vector'`

At the end it emits:

```ts
metadata: {
  searchType,
  channelCount,
  candidateCount: candidates.length,
  constitutionalInjected: constitutionalInjectedCount,
  durationMs,
}
```

So the suspicious `channelCount: 1` is literally whatever value `executeStage1()` last assigned to that local variable.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:469-497`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1347-1375`

### 4. For `searchType: 'hybrid'`, Stage 1 usually calls `collectRawCandidates()` — but it counts **Stage 1 branches**, not internal hybrid lanes

Inside the `hybrid` branch, the standard path is:

- resolve/generate query embedding
- call `hybridSearch.collectRawCandidates(...)`
- assign `channelCount` based on which Stage 1 branch ran

Examples:

- plain hybrid search: `channelCount = 1`
- deep-mode query-variant fan-out: `channelCount = queryVariants.length`
- embedding-expansion dual branch: `channelCount = 2`
- deep query decomposition: `channelCount = allQueries.length`

So Stage 1's `channelCount` does **not** mean "how many underlying retrieval lanes the hybrid engine ran." It means "how many Stage 1 search branches / fan-out queries this stage launched and merged."

This explains the apparent contradiction:

- the hybrid engine's internal router guarantees at least 2 internal channels (`vector` + `fts`) via `enforceMinimumChannels()`
- but Stage 1 can still report `channelCount: 1` when it made exactly one call to `collectRawCandidates()`

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604-610`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:679-740`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:756-770`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:803-823`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:851-869`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:43-47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:83-110`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`

### 5. `collectRawCandidates()` **does** hit the hybrid router internally

`collectRawCandidates()` delegates to `executeFallbackPlan(...)`, and the hybrid fusion path underneath calls `routeQuery(query, options.triggerPhrases)`.

That internal route logic selects from:

- `vector`
- `fts`
- `bm25`
- `graph`
- `degree`

and enforces a minimum of 2 channels.

So yes: `collectRawCandidates()` is absolutely part of the normal `hybrid` Stage 1 path, and yes, the router likely still selected 2+ internal hybrid channels. But Stage 1 metadata is **not exposing that count**.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1720`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:987-1007`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:78-95`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:104-110`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`

### 6. There are real Stage 1 paths that bypass `collectRawCandidates()`

Not every Stage 1 mode goes through hybrid raw collection:

#### A. Multi-concept path

If `searchType === 'multi-concept'`, Stage 1 generates embeddings for each concept and directly calls:

`vectorIndex.multiConceptSearch(...)`

This path sets `channelCount = 1` and never touches `collectRawCandidates()`.

Source:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:569-600`

#### B. Vector path

If `searchType === 'vector'`, Stage 1 directly calls:

`vectorIndex.vectorSearch(...)`

This also sets `channelCount = 1` and bypasses hybrid raw collection entirely.

Source:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900-926`

#### C. Hybrid failure fallback

Even inside `searchType === 'hybrid'`, if `hybridSearch.collectRawCandidates(...)` throws, Stage 1 catches that and falls back to direct `vectorIndex.vectorSearch(...)`, while still setting `channelCount = 1`.

So a trace showing:

- `searchType: 'hybrid'`
- `channelCount: 1`
- `candidateCount: 0`

is consistent with either:

1. a plain single-branch hybrid attempt that returned no candidates, or
2. a hybrid failure that fell back to vector, where vector also returned no candidates.

Source:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:851-893`

### 7. `channelCount` is counting configured Stage 1 branch fan-out, not channels-that-returned-results

The assignments are explicit and branch-based:

- `channelCount = 1`
- `channelCount = 2`
- `channelCount = queryVariants.length`
- `channelCount = allQueries.length`
- `channelCount++` for extra Stage 1 add-on branches like HyDE / summary embeddings

These values are set before or independent of whether those branches ultimately produce non-empty results. They are not derived from:

- actual internal hybrid router channel count
- number of non-empty underlying lane results
- number of candidates after dedup

Therefore `channelCount` is best interpreted as:

> "How many Stage 1 retrieval branches/fan-out queries were attempted/merged at this orchestration layer?"

not:

> "How many retrieval subchannels inside hybrid search produced results?"

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:593`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:679`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:740`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:756`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:765`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:822`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:853`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:868`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:908`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1120`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1174`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1250`

## Direct answer to the suspicious trace

The trace:

- `searchType: 'hybrid'`
- `channelCount: 1`
- `candidateCount: 0`

does **not** imply that the hybrid query router selected only one internal retrieval channel.

What it most likely means is:

1. `memory_search` chose the Stage 1 `hybrid` branch at the pipeline level.
2. Stage 1 ran exactly one top-level hybrid branch (a single `collectRawCandidates()` invocation, not a deep fan-out / expansion path).
3. Inside that one call, the hybrid subsystem likely still routed to at least two internal lanes (`vector` + `fts`, maybe more).
4. Nevertheless, the overall Stage 1 call returned zero merged raw candidates.

So the current metadata is mixing two different notions of "channel":

- **pipeline/stage1 branch count**
- **hybrid internal retrieval lane count**

and the observed `1` belongs to the first meaning, not the second.

## Best next step

The next high-value check is inside `hybrid-search.ts`, not Stage 1:

1. Trace which internal lanes `routeQuery()` selected for the failing query.
2. Trace which lane(s) returned empty results.
3. Trace whether `executeFallbackPlan()` returned empty `stages[0]` / `stages[1]`, causing `collectRawCandidates()` to fall all the way through to the empty-result warning.

Concretely, inspect/log around:

- `routeQuery(...)`
- `activeChannels`
- per-lane result sizes in `collectAndFuseHybridResults(...)`
- the `executeFallbackPlan(...)` result consumed by `collectRawCandidates(...)`

That is the level where the "why did hybrid yield 0 candidates?" question now lives.
