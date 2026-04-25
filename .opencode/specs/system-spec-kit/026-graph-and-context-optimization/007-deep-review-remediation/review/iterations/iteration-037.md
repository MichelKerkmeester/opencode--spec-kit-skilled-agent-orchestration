# Iteration 37 - maintainability - handlers

## Dispatcher
- iteration: 37 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:20:29.608Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### 1. `memory_stats.excludePatterns` claims regex support, but `handleMemoryStats()` only performs literal substring checks
- **Evidence:** `memory_stats` advertises `excludePatterns` as regexes in the public tool schema, and `handleMemoryStats()` repeats that wording in its validation error; the actual filter path lowercases each supplied pattern and runs `folderName.includes(pattern)`, so regex metacharacters are treated as plain text and valid regex exclusions do not work as documented. This is a public contract break, not just an internal implementation detail.  
  **Refs:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:229-231`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:78-81`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:186-195`

```json
{
  "claim": "memory_stats exposes excludePatterns as regex patterns, but handleMemoryStats never compiles or evaluates regexes; it lowercases each pattern string and applies folderName.includes(pattern), so documented regex semantics are broken.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:229-231",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:78-81",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:186-195"
  ],
  "counterevidenceSought": "I searched the reviewed handler/tests surfaces for any later RegExp construction or excludePatterns normalization that would restore regex behavior and found none.",
  "alternativeExplanation": "The contract may have been simplified to substring matching and the schema/error text were never updated.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade to P2 only if the public schema and handler messaging are intentionally changed to document substring matching instead of regex filtering."
}
```

### P2 Findings
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2537-2613,2650-2745` — `handleMemorySave()` maintains two large dry-run branches that assemble near-duplicate success envelopes, hints, and `would_pass` logic. This duplication is drift-prone: a future response-shape or hint change has to be made in both places, and the branches have already diverged slightly in messaging.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1240-1313` — query-intent classification and code-graph augmentation are wrapped in blanket `catch {}` fallbacks that silently degrade to semantic mode. That keeps the request alive, but it erases the distinction between “semantic was the right route” and “classification/code-graph failed,” which will make future routing regressions hard to diagnose.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:54-60` — signal/momentum computation failures are swallowed and returned as `null` with no diagnostic hint. The response shape for “graph is empty” and “signal pipeline failed” becomes indistinguishable, weakening operability and future debugging.
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:202-204`, `.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:18-21` — in the active test files reviewed here, coverage-graph tools are only asserted as registered names. I did not find behavioral tests in this pass that exercise `handleCoverageGraphStatus()` / `handleCoverageGraphUpsert()` validation, rejection, or degraded-status payloads, so the silent-failure paths above can regress without a targeted signal.

## Traceability Checks
- `deep_loop_graph_upsert` / `deep_loop_graph_status` are broadly traceable to their tool contracts: the handlers require `specFolder`, `loopType`, and `sessionId`, and `upsert.ts` enforces self-loop rejection plus relation/kind validation in line with the schema. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:71-152`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-47`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:751-815`.
- `memory_stats.excludePatterns` does **not** match its schema intent: the tool schema says “Regex patterns to exclude folders,” while the handler implements case-insensitive substring matching only. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:186-195`.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` — validation is linear and readable: namespace guards happen first, invalid node/edge kinds are rejected before persistence, and self-loop handling is separated cleanly from other validation failures.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` — canonical `.opencode/specs` preference, scoped filtering, and canonical-path deduplication are straightforward and internally consistent.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` + `.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts` — the retry loop is bounded, preserves the best-scoring state on rejection, and the reviewed tests cover the scoring/autofix primitives clearly enough to support future refactors.

## Next Focus
- Iteration 38 should stay on handler-adjacent behavior/tests: `memory-index.ts`, `memory-triggers.ts`, and `pe-gating.ts`, with emphasis on whether the large public contracts have direct behavioral coverage rather than registration/export-only tests.
