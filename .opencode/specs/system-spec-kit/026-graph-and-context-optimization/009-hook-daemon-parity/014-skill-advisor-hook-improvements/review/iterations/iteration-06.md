## Iteration 06

### Focus
Inspect durable telemetry error handling, especially how corrupted JSONL sink data affects `advisor_validate`.

### Files Audited
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:338-346`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:391-418`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:301-326`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:10-49`

### Findings
- P1 `error-path` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:400-406`: `readAdvisorHookOutcomeRecords(...)` blindly `JSON.parse`s every retained line and performs no validation or recovery, so a single truncated or malformed outcome record in the durable tmpdir sink turns outcome reading into a hard exception.
- P1 `observability` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:338-346`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:409-418`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:325-326`: diagnostics records are corruption-tolerant because invalid lines are filtered, but outcome records are not. `advisor_validate` reads the outcome summary unguarded, so one bad line can abort the entire validation surface even though the packet markets durable telemetry as resilient cross-process state.
- P2 `coverage` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:10-34`: the validator suite only checks output schema and prompt privacy; it does not exercise corrupted diagnostics or outcomes files, so this failure mode is currently untested.

### Evidence
```ts
// metrics.ts
return readJsonlLines(durableMetricsPath(workspaceRoot, 'outcomes'))
  .slice(-limit)
  .map((line) => JSON.parse(line) as AdvisorHookOutcomeRecord);
```

```ts
// advisor-validate.ts
const telemetryHealth = readAdvisorHookHealthSection(workspaceRoot);
const outcomeSummary = summarizeAdvisorHookOutcomeRecords(workspaceRoot);
```

### Recommended Fix
- Make outcome reading mirror diagnostics reading: parse defensively, validate record shape, drop corrupt lines, and add a regression test that seeds malformed telemetry JSONL to confirm `advisor_validate` still returns a prompt-safe report. Target files: `lib/metrics.ts`, `handlers/advisor-validate.ts`, `tests/handlers/advisor-validate.vitest.ts`.

### Status
new-territory
