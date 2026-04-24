## Iteration 07

### Focus
Review whether `skillSlug`-scoped validation actually scopes all of the surfaced telemetry and outcomes.

### Files Audited
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:299-326`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:351-425`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:97-107`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:207-226`

### Findings
- P1 `contract-boundary` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:311-315`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:325-326`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:420-423`: `skillSlug` filters only the labeled corpus and holdout rows; telemetry outcome totals are still read from the entire workspace-wide durable sink. A caller validating one skill can therefore receive subset accuracy slices paired with global accepted/corrected/ignored totals.
- P2 `observability` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:101-107`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:302-309`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:422-423`: `recordedThisRun` counts whatever outcome events were provided on that invocation, but `totals` remain workspace-global, so the output shape encourages callers to infer a scoped learning report that the implementation does not actually produce.
- P2 `docs` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:207-226`: the public README describes `skillSlug` validation and threshold semantics, but it never warns that telemetry totals are global to the workspace rather than scoped to the requested skill subset.

### Evidence
```ts
// advisor-validate.ts
const corpus = loadCorpus(workspaceRoot)
  .filter((row) => args.skillSlug ? row.skill_top_1 === args.skillSlug : true);
...
const outcomeSummary = summarizeAdvisorHookOutcomeRecords(workspaceRoot);
...
outcomes: {
  recordedThisRun: args.outcomeEvents?.length ?? 0,
  totals: outcomeSummary.totals,
}
```

### Recommended Fix
- Either scope outcome totals to the requested `skillSlug` when present or explicitly relabel/document them as workspace-global telemetry. Add a test that validates a subset skill while pre-seeding outcomes for other skills. Target files: `handlers/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, `README.md`.

### Status
converging
