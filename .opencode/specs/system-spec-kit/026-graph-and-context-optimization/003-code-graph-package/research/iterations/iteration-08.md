## Iteration 08
### Focus
Cross-surface freshness drift between readiness, context metadata, and startup/session surfaces.

### Findings
- `code_graph_context` returns two different freshness stories: `readiness` comes from `ensure-ready` mtime/git-head checks, while `metadata.freshness` is computed only from `MAX(indexed_at)` age bands (`fresh` / `recent` / `stale` / `unknown`). Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:178-215`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:100-116`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:162-175`.
- That means a recently indexed but now modified repo can report `readiness.freshness = stale` while `metadata.freshness.staleness = fresh` or `recent`, which is a stale-reader ambiguity rather than a single authoritative state. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:112-180`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:162-175`.
- Startup and session surfaces add a third state family (`ready|stale|empty|missing` or `ready|stale|missing`), so consumers are forced to reconcile multiple freshness taxonomies coming from the same package. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:213-283`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:41-157`.
- Tests cover the aligned readiness block, but not coherence between readiness and the secondary metadata freshness channel. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:115-141`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-82`.

### New Questions
- Should `metadata.freshness` be renamed to something explicitly timestamp-based, such as `scanAge`, to avoid competing with readiness?
- Would it be simpler to expose only readiness plus raw `lastPersistedAt` and remove the age-band abstraction from `code_graph_context`?
- Are any downstream consumers currently keying off `metadata.freshness.staleness` instead of the canonical readiness block?

### Status
converging
