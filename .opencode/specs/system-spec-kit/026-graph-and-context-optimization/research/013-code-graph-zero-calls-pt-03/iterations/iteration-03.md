## Iteration 03

### Focus

This round measured whether the bad-subject pattern is broader than `handleMemoryContext` and translated that into a concrete remediation plan. The emphasis was on scope: if the zero-edge result comes from name collisions in wrapper/index files, the fix and regression test need to harden subject resolution across the whole handler surface rather than touching CALLS extraction.

### Context Consumed

- Prior iterations: `iterations/iteration-01.md`, `iterations/iteration-02.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

### Findings

- The shadowing pattern is class-wide, not specific to `handleMemoryContext`: `handlers/index.ts` exports many `handle*` names through `lazyFunction(...)`, including `handleMemorySearch`, `handleSessionResume`, `handleSessionHealth`, and `handleSessionBootstrap`, which creates same-name wrapper nodes before the implementation modules in sort order [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-217,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:247-320].
- The real implementation functions for sample siblings still exist in later files such as `memory-search.ts:612`, `session-resume.ts:540`, and `code-graph/query.ts:586`, so an operation-agnostic “first match wins” resolver can misroute CALLS lookups for multiple surfaces, not just `handleMemoryContext` [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:612,.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:586].
- The best-fit fix is operation-aware subject ranking: for `calls_from` and `calls_to`, prefer callable implementation kinds (`function`, `method`) before `export`, `import`, or wrapper `variable` nodes, while preserving the current ambiguity warning and falling back to the old ordering only when no callable candidate exists [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190,.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299].
- The current warning payload is too opaque to diagnose this class of error quickly because it only surfaces symbol IDs and a generic message; adding selected-candidate metadata plus candidate kinds/files would make wrapper-node traps obvious to operators and future investigation packets [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161].

### Evidence

```text
{
  "name": "handleMemorySearch",
  "rows": [
    { "kind": "export", "file_path": ".../handlers/index.ts", "outgoing": 0 },
    { "kind": "function", "file_path": ".../handlers/memory-search.ts", "outgoing": 58 }
  ]
}
```

```text
{
  "name": "handleSessionResume",
  "rows": [
    { "kind": "export", "file_path": ".../handlers/index.ts", "outgoing": 0 },
    { "kind": "function", "file_path": ".../handlers/session-resume.ts", "outgoing": 17 }
  ]
}
```

```text
{
  "name": "handleCodeGraphQuery",
  "rows": [
    { "kind": "export", "file_path": ".../code-graph/handlers/index.ts", "outgoing": 0 },
    { "kind": "function", "file_path": ".../code-graph/handlers/query.ts", "outgoing": 14 }
  ]
}
```

### Negative Knowledge

- Rewriting CALLS extraction to use AST `call_expression` nodes would be good hardening for member-call fidelity, but it is not required to fix this specific zero-edge incident because the live graph already stores CALLS edges for the real implementation symbol [iterations/iteration-02.md#evidence,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:942-973].
- This does not look like a one-off stale row in `code-graph.sqlite`; the same wrapper-vs-function shape repeats across multiple handler families and even the code-graph handler index itself [iterations/iteration-03.md#evidence,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-320,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts:5].

### New Questions

- Implementation: Should callable preference be limited to `calls_*`, or should `blast_radius` and transitive traversal inherit it too?
- Coverage: Is one synthetic ambiguity test enough, or should there be a DB-backed fixture that mirrors `handlers/index.ts` lazy exports?
- Observability: Should warnings include only candidate metadata, or should the payload also expose the selected node kind and file path directly?

### Status

`converging`
