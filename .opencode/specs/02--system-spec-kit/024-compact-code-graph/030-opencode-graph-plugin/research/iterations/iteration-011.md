# Research Iteration 011: Graph Retrieval Shaping and Semantic Bridge Quality

## Focus

Use `opencode-lcm` to find net-new improvements for the existing graph-facing retrieval surfaces: `code_graph_context`, `code_graph_query`, seed resolution, budget shaping, and semantic bridge behavior.

## Findings

### `seed.query` Exists But Is Barely Used

Our current graph bridge already carries richer seed payloads, including `query`, but seed resolution mostly uses:

- file
- line proximity
- symbol identity
- confidence sorting

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:100-153`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:11-16`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:181-290`]

`opencode-lcm`'s query-variant and token-filtering approach suggests we should use `seed.query` as a second-stage tie breaker for ambiguous seeds.

### `code_graph_context` Has A First-Anchor Bias

Current context formatting guarantees the first section gets special treatment, so anchor ordering dominates output quality. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:68-99`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:281-320`]

This would improve if we reranked anchors with more than confidence:

- semantic score
- working-set recency
- graph resolution confidence

`WorkingSetTracker` already gives us useful recency/frequency signals for that rerank step. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:50-63`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:135-147`]

### We Still Slice Too Early

`code_graph_query` and parts of the graph pipeline mostly slice raw frontiers directly to limits. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:35-50`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:181-200`]

`opencode-lcm` is better at:

- overfetching
- deduping
- reranking
- applying quotas
- stopping early with telemetry

[SOURCE: `external/opencode-lcm-master/src/store.ts:2953-3038`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3056-3221`] [SOURCE: `external/opencode-lcm-master/src/store-search.ts:37-47`] [SOURCE: `external/opencode-lcm-master/src/store-search.ts:131-178`] [SOURCE: `external/opencode-lcm-master/src/store-search.ts:241-275`]

### The Semantic Bridge Needs Low-Signal Suppression

Weak or ambiguous prompts currently lean toward hybrid behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:118-179`]

`opencode-lcm` explicitly applies low-signal suppression and lightweight stopword filtering. [SOURCE: `external/opencode-lcm-master/src/utils.ts:296-328`]

That would reduce noisy semantic seeding into the graph path.

## Recommendations

1. Use `seed.query` or snippet tokens to break ties inside seed resolution.
2. Rerank anchors before formatting using confidence + semantic score + working-set score.
3. Shift graph budgeting from slice-first to overfetch-then-trim with light telemetry.
4. Add a low-signal suppression gate to the semantic bridge.

## Duplication Check

This is new relative to earlier packet research because it maps fine-grained LCM retrieval mechanics directly onto the current graph tools:

- unused `seed.query`
- first-anchor bias
- slice-first behavior
- missing low-signal suppression
