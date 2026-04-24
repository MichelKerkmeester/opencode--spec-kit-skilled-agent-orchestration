## Iteration 03

### Focus

This round followed the CocoIndex-to-code-graph bridge. The working hypothesis was that even if the graph is healthy, the bridge may be discarding semantic ranking context before graph resolution, which would make the integration correct only in the narrow line-matching sense.

### Context Consumed

- `iterations/iteration-02.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md`

### Findings

- The native CocoIndex seed shape carries `range`, `score`, and optional `snippet`, but `resolveCocoIndexSeed()` throws away `score` and `snippet` immediately and forwards only `file`, `start`, and `end` into `resolveSeed()` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:19-25,86-92].
- `resolveSeed()` is fundamentally a line-anchor resolver: it prefers exact `start_line`, then a `±5` line near-match, then the smallest enclosing symbol; `endLine` only survives into the file-anchor fallback, so multi-line semantic hits can still collapse onto the wrong symbol [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:185-246,250-260].
- After resolution, `resolveSeeds()` sorts by local graph confidence rather than the original CocoIndex relevance score, so semantic ranking order is not preserved across multiple seeds [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:275-290].

### Evidence

```ts
provider: 'cocoindex';
file: string;
range: { start: number; end: number };
score: number;
snippet?: string;
```

```ts
return resolveSeed({
  filePath: seed.file,
  startLine: seed.range.start,
  endLine: seed.range.end,
});
```

```ts
// Sort by confidence descending
refs.sort((a, b) => b.confidence - a.confidence);
return refs;
```

### Negative Knowledge

- The bridge does not fail because it lacks a file path or line range; the issue is quality loss after those inputs arrive.
- This is not a zero-results problem tied to CocoIndex availability; it is an anchoring-fidelity problem inside the code-graph side of the bridge.
- The current code already supports a richer seed type than it actually consumes, so the missing fidelity is a contract leak rather than an absent type surface.

### New Questions

- `Bridge Fidelity` — Should the resolver use `snippet`, `score`, and full range overlap to choose among candidate graph nodes?
- `Correctness` — Would preserving CocoIndex ranking in `resolveSeeds()` materially change anchor ordering for multi-seed requests?
- `Ergonomics` — Should handlers surface the original semantic score alongside graph confidence so callers can diagnose mismatches?

### Status

`new-territory`
