## Iteration 08

### Focus

Negative-knowledge pass on the new blocked-read contract across `code_graph_query` and `code_graph_context`.

### Files Audited

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:630-650`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:135-157`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:162-188`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:99-121`

### Findings

None. Negative knowledge: both handlers now return explicit blocked payloads when readiness requires a suppressed full scan, and the paired tests cover the intended happy-path contract for that behavior.

### Evidence

```ts
return {
  status: 'blocked',
  message: `code_graph_full_scan_required: ${readiness.reason}`,
  data: buildGraphQueryPayload({
    blocked: true,
    degraded: true,
    graphAnswersOmitted: true,
    requiredAction: 'code_graph_scan',
  }, readiness, `code_graph_query ${operation} blocked payload`),
};
```

### Recommended Fix

- No new fix from this angle. Keep the existing blocked-read contract; future follow-up should focus on the gaps from iterations 1-4 instead.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`

### Status

converging
