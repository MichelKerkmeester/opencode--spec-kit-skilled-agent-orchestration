## Iteration 02

### Focus

Context seed normalization and whether the CocoIndex fidelity contract survives alternate input shapes.

### Files Audited

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:65-105`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:164-206`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:145-225`

### Findings

- `[P1][contract-boundary] .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:169-177 only keeps the CocoIndex path when `seed.file` is present, even though the handler interface and source-resolution path both accept `filePath`; `filePath`-only callers silently lose the packet's promised score/snippet/range preservation.`
- `[P2][data-loss] .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:199-205 falls back to a generic code-graph seed shape for that case, which drops `provider`, `score`, `snippet`, and `range` before `buildContext()` ever sees the request.`
- `[P2][tests] .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:184-225 only verifies the `provider: "cocoindex" + file` variant, so the `filePath` form allowed by the public handler surface is untested.`

### Evidence

```ts
if (seed.provider === 'cocoindex' && seed.file) {
  return {
    provider: 'cocoindex' as const,
    file: seed.file,
    range: seed.range ?? { start: seed.startLine ?? 1, end: seed.endLine ?? seed.startLine ?? 1 },
    score: seed.score ?? 0,
    snippet: seed.snippet,
    source,
  };
}

return {
  filePath: seed.filePath ?? seed.file ?? '',
  startLine: seed.startLine ?? seed.range?.start,
  endLine: seed.endLine ?? seed.range?.end,
  query: seed.query,
  source,
};
```

### Recommended Fix

- Treat `seed.filePath` as equivalent to `seed.file` for CocoIndex seeds and keep the provider-specific payload intact in both cases. Add a handler regression that passes a `provider: "cocoindex"` seed with `filePath` instead of `file` and asserts score/snippet/range survive the round trip.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`

### Status

new-territory
