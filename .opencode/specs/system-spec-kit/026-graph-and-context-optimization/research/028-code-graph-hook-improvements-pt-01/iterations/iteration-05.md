## Iteration 05
### Focus
`code_graph_context` freshness semantics versus the shared readiness contract.

### Findings
- `buildContext()` computes `metadata.freshness` from `MAX(indexed_at)` age alone, which can report `fresh/recent` even when the readiness path would classify the graph as `stale` because tracked files drifted or git HEAD changed [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:97-115,162-175; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:112-180].
- The handler emits both the readiness block and `result.metadata`, so `code_graph_context` can return two different freshness stories in the same payload without any reconciliation rule [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:178-215].
- The sibling readiness tests assert only that canonical readiness/trust fields exist; they do not check that `metadata.freshness` remains aligned with readiness decisions, so this split contract is currently unguarded [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-siblings-readiness.vitest.ts:240-294].

### New Questions
- Should `metadata.freshness` be deleted in favor of the readiness block, or derived from the same helper?
- Is `recent` still useful if it can disagree with `ready/stale/missing` in the top-level contract?
- Should `code_graph_context` surface both "persisted age" and "operational freshness" explicitly instead of overloading one field?
- Are any downstream consumers currently parsing `metadata.freshness` instead of `readiness`?

### Status
new-territory
