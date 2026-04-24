## Iteration 02

### Focus

This round moved from static code reading to direct parser and SQLite validation for `handleMemoryContext`. The goal was to prove whether the current extractor really emits zero CALLS edges for the implementation function, or whether the prior observation came from selecting the wrong graph node.

### Context Consumed

- Prior iteration: `iterations/iteration-01.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

### Findings

- The original investigation targeted symbolId `0470757d9d3bfdbc`, but the current handler index defines `handleMemoryContext` as a lazy re-export at `handlers/index.ts:310`, while the real implementation function lives in `handlers/memory-context.ts:1196`; that means a same-name wrapper node exists independently of the actual function [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-311,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205].
- The current parser pipeline does extract `handleMemoryContext` as a clean `function` and persists outgoing CALLS for it, so the prior “zero function nodes / zero edges in extraction” hypothesis does not hold for the current code path [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1050-1061,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:645-648,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1342-1583].
- The ambiguity bug sits in subject selection: `resolveSubject()` still chooses the earliest matching node by path order, and the existing ambiguity regression test explicitly expects “first candidate wins” for `calls_from`, which is exactly the behavior that can redirect a CALLS query onto a zero-edge wrapper node [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:120-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:173-181,.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299].
- The query layer is therefore reporting correct edge counts for the wrong symbol, not suppressing valid CALLS edges for the implementation function; once the real function node is selected, the zero-edge claim disappears [iterations/iteration-02.md#evidence,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823].

### Evidence

```text
{
  "parseHealth": "clean",
  "totalCallEdges": 48,
  "handle": { "name": "handleMemoryContext", "kind": "function" }
}
```

```text
{
  "symbol_id": "0470757d9d3bfdbc",
  "kind": "export",
  "file_path": ".../mcp_server/handlers/index.ts",
  "outgoing": 0
}
```

```text
{
  "symbol_id": "c4a4098e032688a9",
  "kind": "function",
  "file_path": ".../mcp_server/handlers/memory-context.ts",
  "outgoing": 28
}
```

### Negative Knowledge

- The current `memory-context.ts` file is not missing function extraction; the direct parse probe returned `parseHealth: clean` and a `function` node for `handleMemoryContext` [iterations/iteration-02.md#evidence,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1705].
- This incident is not caused by imported callees being universally dropped from CALLS edges; the current persisted edge set for the real function includes imported targets such as `checkDatabaseUpdated`, `createMCPErrorResponse`, and `buildContext` [iterations/iteration-02.md#evidence,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:10,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:17-18,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:25].

### New Questions

- Impact: How many other `handle*` names have the same export/variable/function shadow pattern?
- Fix Shape: Should callable-preference live inside `resolveSubject()` or be operation-aware inside `handleCodeGraphQuery()`?
- Coverage: What is the minimal regression fixture that catches the wrapper-node trap without requiring a full DB integration test?
- Observability: What extra ambiguity metadata would have made the original bad symbol choice obvious at query time?

### Status

`new-territory`
