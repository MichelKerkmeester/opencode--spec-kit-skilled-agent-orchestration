## Iteration 07

### Focus

This round revisited the context deadline contract, but with a narrower question than pt-01: not just whether the deadline is latent, but whether the current boundedness story is observable and consistent enough for consumers to trust partial results.

### Context Consumed

- `iterations/iteration-06.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/028-code-graph-hook-improvements-pt-01/research.md`

### Findings

- `ContextArgs` still exposes `deadlineMs`, but `handleCodeGraphContext()` never sets it, so the bounded-work contract remains opt-in even though the handler advertises a budgeted context surface by default [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:168-176].
- Only `impact` mode enforces an elapsed-time budget inside `expandAnchor()`; `neighborhood` and `outline` loops can continue unbounded relative to `deadlineMs` once anchor expansion starts [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:73-95,189-240].
- `formatTextBrief()` truncates by character budget and may omit later sections, but the response payload does not include any explicit `truncated`, `partial`, or `omittedSections` signal, so consumers cannot distinguish true absence from budget-driven omission [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:281-327].

### Evidence

```ts
export interface ContextArgs {
  budgetTokens?: number;
  deadlineMs?: number;
  profile?: 'quick' | 'research' | 'debug';
}
```

```ts
const contextArgs: ContextArgs = {
  input: args.input,
  queryMode,
  subject: args.subject,
  budgetTokens: args.budgetTokens ?? 1200,
```

```ts
if (!isFirst && lines.join('\n').length > maxChars * 0.9) {
  lines.push(`[${sections.length - i - 1} more sections omitted — budget limit]`);
  break;
}
```

### Negative Knowledge

- This round did not uncover a new freshness-vocabulary split; that pt-01 issue remains real, but the new angle here is output-labeling and boundedness observability.
- `impact` mode is not wholly unbounded; it does have a budget breaker, which narrows the residual gap to uneven enforcement across modes.
- The handler tests currently validate readiness behavior, not deadline or partial-output semantics, so the gap is partly contractual and partly coverage-related.

### New Questions

- `Ergonomics` — Should the handler set a default `deadlineMs`, or should the contract explicitly say boundedness only applies when callers opt in?
- `Observability` — What is the minimal partial-output signal that downstream consumers need: a boolean, omitted section count, or elapsed-time note?
- `Verification` — Which tests should assert deadline behavior across all query modes, not just `impact`?

### Status

`converging`
