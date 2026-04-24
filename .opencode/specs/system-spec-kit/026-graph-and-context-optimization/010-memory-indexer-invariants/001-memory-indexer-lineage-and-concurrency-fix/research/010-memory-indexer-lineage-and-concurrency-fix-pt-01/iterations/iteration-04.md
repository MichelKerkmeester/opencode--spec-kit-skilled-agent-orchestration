## Iteration 04

### Focus
Exact scope of the `fromScan` bypass: confirm what it disables, what it leaves intact, and whether the packet preserved normal `memory_save` semantics.

### Findings
- `memory_index_scan` now threads `fromScan: true` through every scan-originated `indexSingleFile()` call while keeping `scanBatchSize = BATCH_SIZE`, so B2 removed the batch-size-1 workaround rather than serializing the whole scan. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:141-153`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:409-422`)
- Inside `processPreparedMemory()`, the only code gated by `!fromScan` is the transactional complement recheck that can raise `candidate_changed` immediately before commit. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2365-2394`)
- Save-time reconsolidation planning still runs before the write transaction regardless of `fromScan`, so B2 bypasses only the commit-time planner-vs-commit recheck and not the broader reconsolidation pipeline. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2220-2258`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:742-819`)
- The paired real-path regressions prove the conditional behavior: `fromScan: true` skips `findScopeFilteredCandidates()`, while omitting `fromScan` still returns a `candidate_changed` failure with persisted reconsolidation state. (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:742-819`)

### New Questions
- Once that transactional recheck is skipped, what concurrency protection still exists inside one process and across multiple processes?
- Does the scan path remain safe when many sibling docs in the same spec folder index concurrently inside a batch?
- Is the `fromScan` capability constrained to scan-only callers, or could another internal path misuse it?
- Do scoped saves (tenant/user/session) have dedicated `fromScan` coverage?

### Status
converging
