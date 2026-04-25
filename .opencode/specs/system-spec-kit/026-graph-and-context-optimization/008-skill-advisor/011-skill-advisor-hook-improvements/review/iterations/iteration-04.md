## Iteration 04

### Focus
Check whether packet 014 actually converged on one shared advisor-brief renderer.

### Files Audited
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:172-183`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:208-223`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:260-287`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:98-145`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-brief-producer.vitest.ts:138-149`

### Findings
- P1 `cross-runtime` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:172-183`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:98-145`: the shared builder still uses a private `renderBrief(...)` implementation that emits `Advisor: stale - use ... (confidence ..., uncertainty ...)`, while the shared hook renderer emits `Advisor: stale; use ... 0.91/0.23 pass.`. Packet 014 therefore did not fully collapse onto one renderer contract.
- P1 `contract-boundary` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:260-271`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:317-336`: the builder stores its private `brief` string into the shared payload summary and `advisor-brief` section, so any consumer that resumes from `sharedPayload` sees a different brief format from the runtime hooks that rerender with `renderAdvisorBrief(...)`.
- P2 `coverage` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-brief-producer.vitest.ts:144-149`: the producer tests still only assert the legacy builder format (`/^Advisor: stale/`) instead of locking parity between `result.brief` and `renderAdvisorBrief(result)`, which lets this split survive unnoticed.

### Evidence
```ts
// skill-advisor-brief.ts
const prefix = freshness === 'stale' ? 'Advisor: stale - ' : 'Advisor: ';
const brief = `${prefix}use ${top.skill} (confidence ${top.confidence.toFixed(2)}, uncertainty ${top.uncertainty.toFixed(2)}).`;
```

```ts
// render.ts
return `Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.`;
```

### Recommended Fix
- Make `buildSkillAdvisorBrief` call `renderAdvisorBrief(...)` for its canonical brief text, then derive shared payload summary/sections from that same rendered string and add a parity test that compares `result.brief` against the exported renderer. Target files: `lib/skill-advisor-brief.ts`, `lib/render.ts`, `tests/legacy/advisor-brief-producer.vitest.ts`.

### Status
new-territory
