# Deep Review Iteration 001 — Cross-Cutting Audit Across 012-015

You are iteration 1/10 of a deep-review loop auditing the integrated 012-015 implementation + their 28 catalog/playbook updates. Your job is to surface findings (P0/P1/P2) on cross-cutting concerns that per-packet reviews could not catch.

## Topic + Open Questions

7 questions covering cross-cutting concerns. See full text in:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`

§3 (Q-CROSS / Q-REGRESS / Q-FLOW / Q-TEST / Q-COV / Q-DOC / Q-MAINT)

## Iteration 1 focus

**Q-CROSS** + **Q-FLOW**. Two highest-risk cross-cutting concerns.

## Required reading (cite specific lines)

1. **The 4 packet implementation-summaries** (these synthesize what each packet shipped):
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/implementation-summary.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/implementation-summary.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/implementation-summary.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/implementation-summary.md`

2. **The 4 review-report.md files** (per-packet verdicts already closed; understand what was covered vs not):
   - Same paths as above, replace `implementation-summary.md` with `review-report.md`

3. **Implementation files for cross-packet flow tracing**:
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` — `buildCopilotPromptArg`, `validateSpecFolder`, `buildTargetAuthorityPreamble`, `buildMissingAuthorityGate3Prompt` (Q-FLOW)
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` — call site (Q-FLOW)
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` — `getGraphReadinessSnapshot` (Q-CROSS w/ 013)
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` — readiness.action surface
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` — seed telemetry passthrough (Q-CROSS w/ 012)
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` — degraded test setup

## Output requirement 1: write `review/iterations/iteration-001.md` (ABSOLUTE PATH)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`

Use this structure:

```markdown
# Iteration 001 — Cross-Cutting Audit (Q-CROSS + Q-FLOW)

## Status
- Iteration: 1 / 10
- Focus: Q-CROSS + Q-FLOW
- newFindingsRatio: <decimal 0-1>
- Convergence trajectory: <one sentence>
- Verdict signal so far: <PENDING | PASS-leaning | CONDITIONAL-leaning | FAIL-leaning>

## Q-CROSS — Cross-Packet Interactions

### Findings
For each finding, structure:
- **F-NNN [Pn] [Title]**
  - Evidence: file:line + observed behavior
  - Risk: what could go wrong + likelihood
  - Recommended remediation: brief

### Notes
[any sub-questions surfaced for next iteration]

## Q-FLOW — cli-copilot Dispatch Flow End-to-End

### Findings
[same structure]

### Notes

## Sources read this iteration
- [absolute path 1]
- [absolute path 2]
- ...

## Suggested focus for iteration 002
[short paragraph]
```

## Output requirement 2: write `review/deltas/iter-001.jsonl` (ABSOLUTE PATH)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deltas/iter-001.jsonl`

Single JSONL record:

```json
{"type":"iteration","iteration":1,"newFindingsRatio":<decimal>,"status":"completed","focus":"cross-flow","dimensionsCovered":["correctness","traceability"],"newFindings":[{"id":"F-NNN","severity":"P0|P1|P2","question":"Q-CROSS|Q-FLOW","title":"...","fileRef":"path:line"}],"sourcesRead":[...],"timestamp":"<ISO 8601 UTC>"}
```

## Discipline

- **No fabrication** — every cited file:line MUST verify
- **Per-packet items already closed in `review-report.md` files are out of scope** — cross-cutting only
- **Severity floors**: P0 = blocks ship, P1 = should-fix-before-merge, P2 = nit / future work
- **Honest newFindingsRatio**: iter-1 typically 0.5-0.8; if no new findings beyond restating per-packet items, ratio is low (0.1-0.3)

## BEGIN NOW

Read the source-of-evidence paths above. Walk Q-CROSS + Q-FLOW. Write the two output files at the absolute paths specified. Begin.
