## Iteration 02

### Focus

This round inspected whether read-path handlers behave honestly when the graph is empty or stale enough to require a full scan, but inline full scans are intentionally disabled. The key question was whether they fail closed or quietly continue with degraded outputs.

### Context Consumed

- `iterations/iteration-01.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`

### Findings

- Both `code_graph_query` and `code_graph_context` explicitly disable inline full scans on read paths by calling `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`, so empty or fully stale graphs remain unrepaired during those requests [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:595-599; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:103-106].
- After receiving readiness, neither handler gates on `readiness.action === "full_scan"`; `query.ts` immediately resolves the requested subject and continues execution, and `context.ts` immediately constructs `ContextArgs` and calls `buildContext()` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:613-727; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:168-178].
- The current regression harness only covers the "fresh" path, thrown readiness failures, and one stale transitive case; there is no test asserting a blocked response when a full scan is required but suppressed [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:98-130,239-260; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-104].

### Evidence

```ts
readiness = await ensureCodeGraphReady(process.cwd(), {
  allowInlineIndex: true,
  allowInlineFullScan: false,
});
```

```ts
const contextArgs: ContextArgs = {
  input: args.input,
  queryMode,
  subject: args.subject,
};
```

```ts
expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
  allowInlineIndex: true,
  allowInlineFullScan: false,
});
expect(parsed.data.readiness).toEqual({
```

### Negative Knowledge

- This is not the same problem as the pt-01 debounce bug; even with perfect invalidation, the handlers would still continue on a `full_scan` readiness result.
- This is also not a crash path issue; thrown readiness failures already return explicit errors in `query.ts` and explicit crash metadata in `context.ts`.
- The risk is contract honesty, not raw availability: the handlers can return apparently valid payloads while a full scan is still required.

### New Questions

- `Correctness` — Should read-path handlers hard-error on `full_scan`, or return a structured "blocked until scan" payload with no graph answers?
- `Ergonomics` — If soft continuation is intentional, where should the degraded-state warning be promoted so clients do not misread empty results?
- `Verification` — Which unit or integration tests should pin the blocked-full-scan behavior once chosen?

### Status

`new-territory`
