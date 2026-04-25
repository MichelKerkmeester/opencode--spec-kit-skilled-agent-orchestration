## Iteration 03

### Focus

Deadline handling and whether the new `partialOutput` contract reports omitted work accurately.

### Files Audited

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:85-181`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:256-340`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:145-225`

### Findings

- `[P1][correctness] .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:116-121 increments `omittedAnchors` by exactly one and then breaks when the deadline trips before the next anchor, so responses undercount omitted anchors whenever two or more anchors remain.`
- `[P2][observability] .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:171-177 forwards that undercount directly into `metadata.partialOutput.omittedAnchors`, which makes the new partial-output metadata less trustworthy precisely when callers rely on it to gauge lost coverage.`
- `[P2][tests] .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:145-225 validates a single-anchor deadline case only, so the packet never covers the multi-anchor scenario introduced by the new metadata contract.`

### Evidence

```ts
for (const anchor of resolvedAnchors) {
  if (performance.now() - contextStart > deadlineMs) {
    partialReasons.add('deadline');
    omittedAnchors += 1;
    break;
  }
}

partialOutput: {
  isPartial: partialReasons.size > 0,
  reasons: [...partialReasons],
  omittedSections: omittedSections + formattedTextBrief.omittedSections,
  omittedAnchors,
  truncatedText: formattedTextBrief.truncated,
}
```

### Recommended Fix

- When the loop exits for deadline pressure, count every remaining unresolved anchor instead of a single placeholder increment. Add a regression with multiple anchors and a tiny `deadlineMs` budget to prove `omittedAnchors` equals the number of skipped anchors.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`

### Status

new-territory
