---
title: "Deep Review Iteration 003 — D1 Correctness"
iteration: 003
dimension: D1 Correctness
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T04:15:36Z
status: insight
---

# Iteration 003 — D1 Correctness

## Focus
This pass followed the strategy-assigned `013` warm-start bundle seam and its adjacent `008` routing handoff to check whether packet `012`'s already-open live-baseline proof gap was silently carried forward. The review centered on whether the shipped benchmark can actually falsify the "equal-or-better pass rate" half of R8, not just report a cheaper combined cost.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (282 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts` (259 lines)
- `.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts` (184 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/spec.md` (237 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md` (122 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md` (229 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md` (80 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
- `DR-026-I003-P1-001`: Packet `013`'s benchmark cannot detect pass-rate regressions, so it cannot honestly prove the R8 / `REQ-006` claim that the combined bundle wins on cost without losing pass rate. `REQUIRED_FINAL_FIELDS` only counts wrapper-derived fields that `runWarmStartScenario()` always populates for every variant, and the benchmark test hard-codes `28` passes for every lane. A rejected cached-continuity path or weaker follow-up resolution can change cost, but not the measured pass score.

```json
{
  "claim": "Packet 013's warm-start validation runner makes pass-rate invariant by construction, so the benchmark cannot falsify the required 'lower cost without losing pass rate' gate.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/spec.md:96",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/spec.md:103",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md:59",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md:73",
    ".opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:82",
    ".opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:191",
    ".opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:215",
    ".opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:176"
  ],
  "counterevidenceSought": "I looked for any variant-specific required field omissions, rejected-cache penalties that lower passCount, or tests asserting a failing pass-rate scenario, but every required field is filled unconditionally and every variant is asserted to total 28 passes.",
  "alternativeExplanation": "The packet may intentionally use a proxy benchmark rather than live predecessor seams, but the current spec and closeout still claim a pass-rate gate that the implemented proxy cannot actually fail.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the runner or tests are extended so rejected or degraded variants can reduce passCount, or if packet docs are narrowed to say the benchmark is cost-only and does not validate pass-rate preservation."
}
```

### P2 — Suggestions
None this iteration

## Cross-References
Packet `008` remains internally consistent with its own documented limitation that startup/resume hints are intentionally generic. That makes packet `013`'s benchmark gate more important, because the bundle packet is the place that claims the combined R2/R3/R4 path has been validated as a package.

## Next Focus Recommendation
Stay on `D1 Correctness` for one more pass and audit packets `007`, `009`, and `010` together: `evidence-gap-detector.ts`, `publication-gate.ts`, `handlers/memory-search.ts`, `sqlite-fts.ts`, and their focused tests. The next question is whether those packets contain similarly non-falsifiable truthfulness or degrade-matrix assertions hidden behind plausible fixed expectations.

## Metrics
- newFindingsRatio: 0.33 (new findings this iter / total findings cumulative)
- filesReviewed: 7
- status: insight
