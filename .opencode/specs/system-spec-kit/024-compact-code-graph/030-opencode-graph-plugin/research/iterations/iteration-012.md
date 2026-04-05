# Research Iteration 012: Readiness, Staleness, and Self-Healing Consistency

## Focus

Use `opencode-lcm` to find net-new improvements for status, health, ensure-ready, stale detection, and self-healing behavior in the existing graph/runtime surfaces.

## Findings

### Our Surfaces Do Not Share One Definition Of Stale

`ensureCodeGraphReady()` considers:

- git HEAD drift
- file mtime drift
- deleted tracked files

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:109-165`]

But `session_health`, startup priming, and structural bootstrap mostly reduce staleness to "older than 24h". [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:52-59`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:214-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:73-85`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:138-149`]

So one surface can say "fresh/ready" while another already knows the graph is stale.

### Read Paths Already Compute Diagnostics, Then Hide Them

`code_graph_query` and `code_graph_context` call readiness checks with inline indexing disabled, but they discard the returned `action/files/reason` payload. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:89-94`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:118-123`]

That means data can be returned without saying whether it is provisional or stale.

### Freshness And Parse Degradation Are Overloaded

In `memory-surface`, `staleFiles` is actually counting parse-health problems while freshness is determined separately from `lastScanAt`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:215-236`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:437-447`]

This makes status outputs harder to trust because "stale" can mean two different things.

### Self-Healing Looks More Successful Than It Is

During reindex, per-file persistence failures are skipped best-effort, and debounce state is process-global rather than keyed by workspace/worktree. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:183-197`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:215-223`]

`opencode-lcm`'s doctor/reporting model is stronger because it reports anomalies and applied actions more explicitly. [SOURCE: `external/opencode-lcm-master/src/index.ts:20-69`] [SOURCE: `external/opencode-lcm-master/src/store.ts:1147-1256`] [SOURCE: `external/opencode-lcm-master/src/store.ts:1375-1423`]

## Recommendations

1. Unify graph health surfaces behind one non-mutating diagnostic function.
2. Surface readiness metadata on `code_graph_query` and `code_graph_context` responses.
3. Split freshness from integrity/parse metrics in status outputs.
4. Key debounce and operational state by normalized workspace/worktree identity.

## Duplication Check

This is new relative to earlier packet research because it identifies an implementation-level operational gap:

- inconsistent stale semantics
- hidden readiness diagnostics on read paths
- parse-health mislabeled as freshness
- self-healing and debounce behavior that can look successful even when only partially correct
