---
title: "Deep Review Iteration 002 — D1 Correctness"
iteration: 002
dimension: D1 Correctness
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T04:12:08Z
status: insight
---

# Iteration 002 — D1 Correctness

## Focus
This pass stayed on D1 correctness to resolve whether packet `012` genuinely closed the cached SessionStart consumer seam or only documented it that way. I re-read the runtime owners (`session-resume.ts`, `session-bootstrap.ts`, `session-prime.ts`), the packet `012` spec and implementation summary, and the shipped corpus/tests to check whether the required "equal-or-better than live reconstruction" proof actually exercises the real continuity surfaces.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` (366 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` (597 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (260 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts` (224 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts` (226 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` (138 lines)
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts` (163 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md` (260 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md` (94 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
1. Packet `012` overstates its frozen-corpus proof. The spec and implementation summary require a comparison against the current live reconstruction surfaces, but the shipped corpus test never calls `handleSessionResume`, `handleSessionBootstrap`, or the `session-prime.ts` startup path. Instead it imports the helper-level gate and additive merge functions, then treats "one more populated field on a handcrafted object" as parity with live reconstruction. That leaves REQ-005 / REQ-008 / SC-004 unproven while the packet closeout claims the proof exists.

```json
{
  "claim": "Packet 012 does not actually prove equal-or-better behavior against live reconstruction, even though its spec and implementation summary say the frozen corpus does.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:112",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:114",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:122",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:142",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:155",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:159",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md:47",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md:81",
    ".opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:6",
    ".opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:138",
    ".opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:152",
    ".opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:159"
  ],
  "counterevidenceSought": "Checked whether the frozen corpus or adjacent focused tests invoked the real session_resume/session_bootstrap/session-prime surfaces or a live baseline fixture outside the helper-level test file.",
  "alternativeExplanation": "The team may have intended this corpus as a narrow helper contract and planned to validate end-to-end live-baseline parity in a later packet, but packet 012's spec and closeout currently present it as shipped acceptance evidence.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if another shipped test or verification artifact in packet 012 already compares accepted cached reuse against the real handler-level live reconstruction path and the packet docs are updated to cite that evidence."
}
```

### P2 — Suggestions
1. Add one handler-level regression that runs an accepted cached summary through `handleSessionResume`, `handleSessionBootstrap`, and the `session-prime.ts` startup branch using real hook-state fixtures. The current helper-only corpus is useful, but it leaves the user-facing continuity surfaces unexercised.

## Cross-References
Packet `013` inherits packet `012` as its guarded-consumer prerequisite, so any overstatement in `012`'s live-baseline proof weakens the warm-start bundle's readiness story as well. This is a packet-boundary evidence gap rather than a newly confirmed runtime crash.

## Next Focus Recommendation
Stay on D1 Correctness for iteration 003 and review packet `013` plus the `session-prime.ts` / warm-start handoff. Target the real startup and benchmark surfaces (`hooks/claude/session-prime.ts`, `scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts`, `013-warm-start-bundle-conditional-validation/spec.md`, and `013/.../implementation-summary.md`) to verify that packet `012`'s unproven prerequisite was not propagated into the bundle closeout.

## Metrics
- newFindingsRatio: 0.5 (new findings this iter / total findings cumulative)
- filesReviewed: 9
- status: insight
