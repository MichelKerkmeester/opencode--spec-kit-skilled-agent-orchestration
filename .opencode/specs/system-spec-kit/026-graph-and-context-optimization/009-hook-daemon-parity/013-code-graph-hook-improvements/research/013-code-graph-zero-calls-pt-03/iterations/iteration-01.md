## Iteration 01

### Focus

This round rebuilt the original hypothesis chain from the prior investigation doc and then traced the current extraction, persistence, and query code paths end to end. The goal was to determine which layer could plausibly turn a function with many callees into a zero-edge `calls_from` result before spending time on deeper parser probing.

### Context Consumed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md`

### Findings

- The prior packet correctly observed that CALLS extraction still uses a regex over function-body text, but the current tree-sitter path is only AST-backed for capture discovery; both parser backends still feed the same shared `extractEdges()` CALLS routine, so “regex instead of AST” is only a partial explanation and not yet proof of the zero-edge symptom [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:29-38,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:645-648,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:942-973].
- The query layer resolves ambiguous `fq_name` and `name` subjects by ordering all matches by `file_path`, `start_line`, and `symbol_id`, then picking the first candidate while emitting only a generic ambiguity warning; that makes subject selection a plausible failure point before extraction is even considered [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190].
- `handlers/index.ts` mass-exports handler names through `lazyFunction(...)`, including both `handleMemorySearch` and `handleMemoryContext`, so the graph contains same-name wrapper nodes in an earlier-sorted file than the implementation modules themselves [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-217,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-320].
- `calls_from` and `calls_to` are read-side projections over persisted edges from `queryEdgesFrom()` and `queryEdgesTo()` with dangling-edge cleanup only, so once the correct symbolId is selected the query path should surface any stored CALLS edges rather than suppressing them [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:515-550,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823].

### Evidence

```text
const candidates = d.prepare(`
  SELECT symbol_id
  FROM code_nodes
  WHERE ${field} = ?
  ORDER BY file_path, start_line, symbol_id
```

```text
export const handleMemorySearch = lazyFunction(getMemorySearchModule, 'handleMemorySearch');
...
export const handleMemoryContext = lazyFunction(getMemoryContextModule, 'handleMemoryContext');
```

```text
const edges = extractEdges(nodes, lines, captures, detectorProvenance);
...
while ((match = callPattern.exec(bodyText)) !== null) {
```

### Negative Knowledge

- The symptom is not explained by a read-side filter in `calls_from` or `calls_to`; those handlers do not drop valid CALLS edges by kind or provenance after subject resolution [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:515-550,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823].
- CF-013 is related history, but it was scoped to post-dedup edge reconciliation and explicitly deferred DB-level edge insertion behavior, so it does not directly explain a wrong-subject zero-edge lookup [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:7-15,.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:69-71].

### New Questions

- Resolver: Does the prior packet's symbolId `0470757d9d3bfdbc` belong to the actual function node or to one of the wrapper/export nodes?
- Resolver: If the real function node is selected directly, does the current parser/database still show zero CALLS edges?
- Coverage: Does current test coverage lock in the “first candidate wins” behavior for ambiguous subjects?
- Impact: How many other `handle*` names share the same wrapper-vs-function collision pattern?

### Status

`new-territory`
