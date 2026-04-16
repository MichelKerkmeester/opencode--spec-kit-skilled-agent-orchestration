# Iteration 5 - correctness - handlers

## Dispatcher
- iteration: 5 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:26:04.679Z

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
- .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`handleMemoryContext` can return over-budget structural/hybrid payloads.** `enforceTokenBudget()` runs before the handler appends `graphContext`, `queryIntentRouting`, and `structuralRoutingNudge` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1558-1577`), but the response summary still claims the final payload was trimmed to `effectiveBudget` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1582-1590`). The reviewed tests only cover raw `enforceTokenBudget()` behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:61-163`) and the presence of routing nudge fields (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:145-155`), so they do not catch final-response overflow after graph augmentation.

```json
{
  "claim": "Structural and hybrid memory_context responses can exceed the advertised token budget because graphContext/queryIntentRouting are appended after enforceTokenBudget() finishes.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1558-1560",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1562-1577",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1582-1590",
    ".opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:61-163",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:145-155"
  ],
  "counterevidenceSought": "Looked for a second budget-enforcement pass after graphContext/queryIntentRouting are attached, or an end-to-end test that asserts the final serialized response still fits effectiveBudget.",
  "alternativeExplanation": "The implementation may intend to exclude tiny metadata from budgeting, but graphContext is injected into response data and can carry non-trivial text/graph payloads.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if a downstream transport layer re-applies truncation to the fully assembled memory_context payload before callers receive it."
}
```

2. **`runEnrichmentBackfill()` leaks a process-global feature flag across concurrent requests.** The follow-up API sets `process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED = 'true'`, awaits `runMemoryIndexScan()`, then restores the prior value (`.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:111-128`). The flag reader is global (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149-152`), so any overlapping save/index request in the same Node process can observe the temporary value and run enrichment even though the API comment says this is an explicit follow-up path that should not change default behavior. The existing test only proves single-call restoration (`.opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:102-149`); it does not cover concurrent callers.

```json
{
  "claim": "runEnrichmentBackfill() can change unrelated requests' behavior because it toggles a process-wide enrichment flag around an awaited asynchronous scan.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:111-128",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149-152",
    ".opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:102-149"
  ],
  "counterevidenceSought": "Looked for request-local flag plumbing into handleMemoryIndexScan(), a mutex around runEnrichmentBackfill(), or a concurrency test proving isolation between overlapping calls.",
  "alternativeExplanation": "If the server were guaranteed to process follow-up scans strictly serially, the global env toggle would be harmless, but nothing in this API or its tests enforces that constraint.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if the runtime guarantees single-flight execution for follow-up indexing APIs or if enrichment enablement is actually snapshotted per request before the awaited work begins."
}
```

### P2 Findings
- **`handleCoverageGraphStatus` fail-opens on signal computation errors.** When `computeScopedSignals()` or `computeScopedMomentum()` throws, the handler swallows the exception and still returns `status: "ok"` with `signals = null` / `momentum = null` (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:50-60,63-86`). That makes real metric-computation failures indistinguishable from a legitimate "no signal data" result.

## Traceability Checks
- `memory_context` advertises per-mode token-budget enforcement, but the assembly order in `handleMemoryContext()` lets structural augmentation bypass that contract on the final payload.
- `runEnrichmentBackfill()` is documented in code as an explicit follow-up path "without changing the default save path"; the current process-wide env toggle does change default behavior for any concurrent request sharing the same server process.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` — required-field checks, limit/depth clamps, and response shaping align with the tool schema.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` — rejects empty payloads, invalid kinds/relations, and self-loops before `batchUpsert()`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` — the safe-swap path keeps old children live until finalization and has rollback coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:349-609`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` — batched exact-resolution passes precede LIKE fallback, and duplicate-edge insert failures do not corrupt result accounting.

## Next Focus
- Inspect session/bootstrap and coverage-graph diagnostic handlers for additional fail-open behavior, especially places where internal computation errors are converted into nominal `ok` responses.
