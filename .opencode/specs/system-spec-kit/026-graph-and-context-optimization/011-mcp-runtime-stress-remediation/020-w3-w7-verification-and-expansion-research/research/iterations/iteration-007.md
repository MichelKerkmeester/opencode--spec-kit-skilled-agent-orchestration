---
iteration: 7
focus: RQ7 - Adjacent pipeline integration
newInfoRatio: 0.39
status: complete
---

# Iteration 007 - Adjacent Pipelines

## Focus

Trace `memory_search`, `memory_context`, `memory_save`, advisor, and code graph surfaces to see whether they touch W3-W7 and whether they should.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:912` builds the pipeline config for `memory_search`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921` forwards tenant, user, and agent scope into the pipeline.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:949` executes the pipeline.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101` exposes rerank metadata only when Stage 3 applies rerank.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1128` builds a separate adaptive shadow proposal for memory-search ranking.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1414` classifies query intent.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1439` routes structural queries to `buildContext`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1454` routes hybrid queries to `buildContext`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1476` logs eval query metadata.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1551` carries tenant, user, and agent scope in context options.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2432` uses `findScopeFilteredCandidates` during reconsolidation.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2439` passes fixed `overfetchMultiplier: 3`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:342` accepts an optional overfetch multiplier.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:351` applies that multiplier to vector search limit.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:546` uses fixed multiplier `3` in save-time lookup.

## Findings

### F-ADJ-001 - P2 - Adjacent pipeline integration is partial and inconsistent

`memory_search` touches W4, `memory_context` has its own intent/code-graph branch, and `memory_save` has a separate fixed overfetch mechanism unrelated to W6. W3 and W6 have no production consumers; W5 is advisor-output-only; W7 is mostly test coverage.

## Integration Verdict

The systems are adjacent but not composed. The current architecture has enough local hooks to stitch them together, but there is no shared decision artifact across memory, advisor, code graph, and save-time reconsolidation.

## Opportunities

- Expose W4 gate decision metadata even when rerank is skipped.
- Let `memory_context` surface trust-tree/degraded-readiness context when it calls code graph.
- Keep `memory_save` reconsolidation separate from W6 until there is evidence that CocoIndex duplicate-density calibration is relevant to save-time vector dedup.

## Next Focus

Iteration 008 should perform the empty-folder and placeholder-directory audit requested by RQ8.
