# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

## Findings

### Finding 1: Mex keeps integrity checks cheap by scanning a small markdown surface, but staleness makes cost grow per scaffold file
- **Source**: `external/README.md`, `external/src/drift/index.ts`, `external/src/drift/checkers/staleness.ts`, `external/src/git.ts`, `external/src/drift/scoring.ts` [SOURCE: `external/README.md:72-87`; `external/src/drift/index.ts:17-67,70-110`; `external/src/drift/checkers/staleness.ts:4-56`; `external/src/git.ts:12-49`; `external/src/drift/scoring.ts:3-15`]
- **What it does**: Mex limits drift work to scaffold markdown plus a few repo files, then runs simple lexical/file checks and a constant-cost score reducer. Its main performance wrinkle is staleness: for every scaffold file, it asks git for both "days since last change" and "commits since last change," so the check stays zero-token but not free.
- **Why it matters**: This is the strongest performance argument for adopting a separate Spec Kit integrity lane. We can get fast documentation-truthfulness checks without touching hybrid retrieval, but git-backed freshness should stay advisory and scoped so the cost does not scale into every hot path.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Mex's scanner and sync flows minimize storage growth by recomputing briefs on demand, at the cost of linear repeat work
- **Source**: `external/src/scanner/index.ts`, `external/src/scanner/entry-points.ts`, `external/src/sync/brief-builder.ts`, `external/src/pattern/index.ts`, `external/README.md` [SOURCE: `external/src/scanner/index.ts:8-17,20-52`; `external/src/scanner/entry-points.ts:35-62`; `external/src/sync/brief-builder.ts:7-23,41-97,99-158`; `external/src/pattern/index.ts:11-67`; `external/README.md:165-176,178-198`]
- **What it does**: Mex does not maintain a persistent scan index for scaffold generation or repair. `init` rebuilds a structured brief from manifests, entry points, folder tree, tooling, and README; `sync` rereads the flagged file, gathers local directory context, and optionally pulls recent diffs; `pattern add` only writes one markdown file plus one index entry.
- **Why it matters**: This keeps storage growth nearly flat and startup state simple, but it means repeated `init`/`sync` runs repay filesystem and git scan costs every time. For Spec Kit, that makes Mex's approach a good fit for operator-invoked maintenance prompts, not for primary retrieval where low repeat-query latency matters more.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 3: Spec Kit's hybrid memory search intentionally pays cold-start and storage costs to buy better retrieval quality
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486-490,718-769,771-810,997-1045`; `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:73-83`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:275-282,746-769`]
- **What it does**: `memory_search` checks for external DB updates, builds a cache key, skips embedding warm-up only on cache hits, waits up to 30s for the embedding model on a cold miss, then runs the full retrieval pipeline and caches the formatted response. That pipeline sits on a persistent SQLite/vector store whose path is managed centrally and whose connections are cached across calls.
- **Why it matters**: This is the opposite of Mex's recompute-everything posture: higher storage growth and worse cold-start latency, but much better amortized query latency and relevance once the index is warm. It argues against replacing Spec Kit retrieval with markdown rescans; the right move is to add a cheap integrity preflight beside the indexed stack, not instead of it.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 4: Spec Kit already has a built-in latency ladder, and future integrity work should plug into the cheap rungs first
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:641-679,700-815,891-927`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:122-177,239-288,398-505`]
- **What it does**: `memory_context` explicitly tiers retrieval: `quick` uses trigger matching with an 800-token budget, `focused` and `deep` route into `memory_search`, and `resume` spends more to include anchored content. The trigger path itself applies cognitive decay and tier-based content loading, excludes cold/dormant material, and logs when latency exceeds a 100ms target.
- **Why it matters**: Public already has the performance control plane Mex lacks. Any new integrity surface should attach to the quick/advisory/operator layer first, because that preserves the current low-latency path for routine context loading and avoids making semantic retrieval slower just to report doc drift.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: Code graph and CocoIndex keep indexing overhead explicit and incremental instead of hiding it in startup
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`; `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:76-150`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-105`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:12-33`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-40`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`]
- **What it does**: `code_graph_scan` skips unchanged files in incremental mode, removes deleted tracked files, and only forces a full rebuild when git HEAD changes. `code_graph_context` allows inline readiness checks but explicitly refuses inline full scans, while CocoIndex exposes status and reindex as explicit operations with incremental default behavior and a bounded timeout.
- **Why it matters**: This is the right performance pattern for any future integrity subsystem that wants richer indexing: make indexing an explicit or incremental maintenance cost, not an invisible startup tax. It also gives operators observability over storage growth through graph DB stats and CocoIndex index presence rather than letting background indexes silently sprawl.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `external/README.md:72-87,165-176,178-198`
- `external/src/drift/index.ts:17-67,70-110`
- `external/src/drift/checkers/staleness.ts:4-56`
- `external/src/drift/scoring.ts:3-15`
- `external/src/git.ts:12-49`
- `external/src/scanner/index.ts:8-17,20-52`
- `external/src/scanner/entry-points.ts:35-62`
- `external/src/sync/brief-builder.ts:7-23,41-97,99-158`
- `external/src/pattern/index.ts:11-67`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486-490,718-769,771-810,997-1045`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:73-83`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:275-282,746-769`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:641-679,700-815,891-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:122-177,239-288,398-505`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:76-150`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-105`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:12-33`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-40`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`

## Assessment
- **New information ratio**: 0.23
- **Questions addressed**: how Mex's adopted patterns affect latency; what storage growth each approach implies; where indexing overhead lands; how startup cost differs between markdown-only and indexed retrieval systems
- **Questions answered**: Mex's integrity lane is cheap because it stays lexical and markdown-scoped, but its git freshness checks scale per scaffold file; Spec Kit's search stack is deliberately heavier because it trades persistent index/storage cost for retrieval quality and warm-query speed; Public already has the right performance architecture if integrity work stays separated from hot retrieval and indexing remains explicit or incremental
- **Novelty justification**: prior iterations identified what to adopt, but this pass adds the missing cost model showing which recommendations are cheap enough for always-on use versus which must stay opt-in or index-backed

## Ruled Out
- Replacing Spec Kit hybrid retrieval with Mex-style markdown rescans, because the cold-start savings would come at too high a relevance and repeat-query latency cost
- Running git-based staleness checks inside every startup/context path, because Mex's own implementation scales that work per scaffold file
- Coupling a future integrity lane to automatic code-graph or CocoIndex rebuilds, because Public already has a better pattern: explicit or incremental index maintenance
- Using Mex's single drift score as the primary operator metric for Public's mixed retrieval stack, because it would hide which cost center failed: lexical integrity, semantic retrieval, or index freshness

## Reflection
- **What worked**: tracing the exact hot paths in Mex (`runDriftCheck`, scanner, sync brief builder) against Spec Kit's retrieval/index handlers made the trade-off concrete: recompute-on-demand versus persistent indexed retrieval
- **What did not work**: neither codebase includes a direct benchmark harness for these exact scenarios, so the analysis had to rely on implementation cost structure rather than measured timings from a shared fixture corpus
- **What I would do differently**: next pass, pair this qualitative cost model with a tiny benchmark matrix that measures advisory integrity latency, warm/cold `memory_search`, incremental/full `code_graph_scan`, and incremental/full `ccc_reindex` on one fixed repo snapshot

## Recommended Next Focus
Turn the performance model into rollout guardrails: define maximum acceptable latency for advisory integrity checks, when git-backed freshness is allowed to run, storage-growth observability requirements for graph/vector indexes, and which operations must remain explicit rather than startup-triggered.


Total usage est:        1 Premium request
API time spent:         3m 45s
Total session time:     4m 5s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 16.8k out, 1.0m cached, 6.6k reasoning (Est. 1 Premium request)
