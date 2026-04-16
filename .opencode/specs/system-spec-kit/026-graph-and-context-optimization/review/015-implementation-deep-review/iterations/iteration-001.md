# Iteration 1 - inventory - handlers+server_core

## Dispatcher
- iteration: 1 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:20:37.508Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/api/index.ts
- .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- .opencode/skill/system-spec-kit/mcp_server/core/config.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/index.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **The published `deep_loop_graph_*` MCP surface is dead at runtime.** `tool-schemas.ts:749-842` advertises four L9 coverage-graph tools, but `tools/index.ts:17-39` never registers a coverage-graph dispatcher, and the only dispatch modules actually wired there are `contextTools`, `memoryTools`, `causalTools`, `checkpointTools`, `lifecycleTools`, `codeGraphTools`, and `skillGraphTools`. `tools/lifecycle-tools.ts:38-69` also has no `deep_loop_graph_*` cases, so `context-server.ts:962-966` falls through to `Unknown tool: ${name}` for every one of those public tool names. The break is deeper than dispatch: `schemas/tool-input-schemas.ts:408-447,449-482,546-559` omits all four tool names from `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`, so there is no schema registration for them either.

```json
{
  "claim": "All four deep_loop_graph_* tools are exposed in the public MCP catalog but are not callable in the running server.",
  "evidenceRefs": [
    "mcp_server/tool-schemas.ts:749-842",
    "mcp_server/tools/index.ts:17-39",
    "mcp_server/tools/lifecycle-tools.ts:38-69",
    "mcp_server/context-server.ts:962-966",
    "mcp_server/schemas/tool-input-schemas.ts:408-447",
    "mcp_server/schemas/tool-input-schemas.ts:449-482",
    "mcp_server/schemas/tool-input-schemas.ts:546-559"
  ],
  "counterevidenceSought": "Searched the entire mcp_server/tools/ tree for deep_loop_graph_* cases or a coverage-graph dispatcher module and found none.",
  "alternativeExplanation": "The tools could have been intentionally staged behind a feature flag, but there is no gating branch or fallback registration in the runtime path.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if there is another dispatcher module or runtime registration path that actually routes these four tool names before context-server throws Unknown tool."
}
```

2. **`deep_loop_graph_status` does not return the fields its own public contract promises.** The published schema description says the tool reports “schema version” and “DB file size” (`tool-schemas.ts:815-816`), but the handler payload at `handlers/coverage-graph/status.ts:63-84` only emits namespace, counts, breakdowns, `lastIteration`, `signals`, and `momentum`. There is no schema-version field, no database size field, and no downstream wrapper in the reviewed server-core path that appends them, so dashboard consumers cannot obtain the advertised health metadata.

```json
{
  "claim": "deep_loop_graph_status is contract-incomplete: the handler omits schemaVersion and DB size even though the public tool definition promises both.",
  "evidenceRefs": [
    "mcp_server/tool-schemas.ts:815-816",
    "mcp_server/handlers/coverage-graph/status.ts:63-84"
  ],
  "counterevidenceSought": "Checked the reviewed server-core path for any post-handler envelope augmentation of deep_loop_graph_status and found only the raw handler payload being returned.",
  "alternativeExplanation": "A higher layer could theoretically inject those fields, but no such augmentation exists in the reviewed dispatch path.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if another runtime layer appends schemaVersion and database-size fields before the MCP response is emitted."
}
```

### P2 Findings
- **Handler/storage scope logic is internally inconsistent.** `handlers/checkpoints.ts:245-260` treats missing checkpoint metadata as a match for scoped requests, while `lib/storage/checkpoints.ts:419-430,1420-1448` enforces strict metadata equality and rejects unscoped checkpoints for scoped access. Storage currently preserves correctness, but the duplicated, weaker handler predicate is misleading dead logic around `checkpoint_list`, `checkpoint_restore`, and `checkpoint_delete`.
- **`deep_loop_graph_query` collapses two documented query modes into the same implementation branch.** `handlers/coverage-graph/query.ts:66-77` maps both `uncovered_questions` and `coverage_gaps` to `findCoverageGaps()`, even though the public tool text distinguishes those modes (`tool-schemas.ts:797-810`) and the helper itself describes broader loop-type-dependent semantics (`lib/coverage-graph/coverage-graph-query.ts:91-176`).
- **The test net is largely string-based and missed the broken coverage-graph tool surface.** `tests/context-server.vitest.ts:202-205,208-258,2328-2331` checks that the names exist in `tool-schemas.ts` and that context-server delegates dispatch, but it never verifies that `tools/index.ts` or `schemas/tool-input-schemas.ts` actually register the same tool names. `tests/tool-input-schema.vitest.ts:67-177` covers many tools but not any `deep_loop_graph_*` case, and the only dedicated coverage-graph contract file we found is archived and still targets obsolete `graph_upsert` / `graph_query` names (`tests/archive/coverage-graph-tools.vitest.ts:45-117`).

## Traceability Checks
- **Mismatch confirmed:** the L9 coverage-graph tools are documented as public (`tool-schemas.ts:749-842`) but are not implemented as callable runtime tools because both dispatch registration and schema registration are missing.
- **Mismatch confirmed:** `deep_loop_graph_status` promises health metadata beyond what the handler actually serializes, so the implementation does not yet satisfy its published output contract.

## Confirmed-Clean Surfaces
- **`api/index.ts` / `api/indexing.ts`** — clean, narrow public API surface; `runEnrichmentBackfill()` restores `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` in a `finally` block (`api/indexing.ts:112-129`), so there is no obvious env-leak bug in the reviewed path.
- **`hooks/claude/session-prime.ts` + `hooks/claude/shared.ts`** — recovered compact payloads are sanitized before output (`shared.ts:99-123`), and the compact flow clears the cached prime only after writing stdout (`session-prime.ts:254-262`), avoiding the obvious prompt-injection and data-loss footguns I looked for.
- **`core/config.ts`** — runtime DB path resolution enforces a workspace/home/tmp allowlist and strips `MEMORY_DB_PATH` to a basename inside the approved directory (`core/config.ts:44-80`), which is the right fail-closed posture for this server-core layer.

## Next Focus
- Iteration 2 should stay on runtime wiring and adjacent handlers: verify `handlers/index.ts` / tool-module parity for other late-added tools, then pivot into the next server-core slice where schema descriptions, dispatcher coverage, and executable tests can drift independently.
