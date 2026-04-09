---
title: "Deep Review Iteration 001 — D1 Correctness"
iteration: 001
dimension: D1 Correctness
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T04:06:40Z
status: insight
---

# Iteration 001 — D1 Correctness

## Focus
This pass followed the strategy's first D1 target set: the layered `shared-payload.ts` contract plus packet 005, 006, and 011 closeout docs and focused tests. The goal was to verify that the shared certainty and trust-axis additions stayed additive and that packet 011's claimed end-to-end trust preservation was actually implemented on the resume/bootstrap seam.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` (490 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` (366 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` (597 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` (271 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` (286 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-provisional-measurement-contract/spec.md` (230 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-provisional-measurement-contract/implementation-summary.md` (91 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-structural-trust-axis-contract/spec.md` (229 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-structural-trust-axis-contract/implementation-summary.md` (81 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md` (234 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md` (81 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts` (224 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts` (92 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts` (226 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
1. Packet `011` does not actually preserve structural trust through the shipped `session_resume` payload, even though REQ-002 and the implementation summary say resume-path trust axes are preserved end to end. The real `session-resume.ts` payload builder emits the `structural-context` section with certainty only and no `structuralTrust` object, so `session-bootstrap.ts` cannot reuse resume-emitted trust and instead falls back to synthesizing trust locally. The focused regression test passed because it mocked a resume payload that already contained `structuralTrust`, which hides the missing runtime emission path.

```json
{
  "claim": "Packet 011 leaves session_resume unable to preserve structural trust end to end, so bootstrap synthesizes trust instead of forwarding runtime-emitted resume trust.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:64",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:94",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:46",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:79",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:533",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:542",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:251",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:138",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:164"
  ],
  "counterevidenceSought": "Checked the shipped session_resume payload builder and grep hits for any parserProvenance/evidenceStatus/freshnessAuthority or structuralTrust emission in session-resume.ts.",
  "alternativeExplanation": "The team may have intended direct session_resume preservation to stay deferred to packet 012, with packet 011 limited to bootstrap and graph emission only.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if another shipped resume serialization path outside the reviewed session-resume payload section injects structuralTrust before the MCP response is returned, or if packet 011 is formally re-scoped to exclude resume preservation."
}
```

### P2 — Suggestions
None this iteration

## Cross-References
Packet `011` depends on packet `006`'s vocabulary but currently relies on bootstrap-side fallback (`buildStructuralContextTrust`) instead of a real resume-preservation seam. That makes packet `011` look complete from bootstrap tests while `session_resume.ts` still behaves like the pre-preservation owner.

## Next Focus Recommendation
Stay on D1 Correctness for iteration 002 and review the `session-bootstrap.ts` / `session-resume.ts` / packet `012` boundary to determine whether the fix belongs in packet 011, packet 012, or both. Validate whether the cached SessionStart consumer packet accidentally became the first true resume-trust carrier while 011 overclaimed delivery.

## Metrics
- newFindingsRatio: 1.0 (new findings this iter / total findings cumulative)
- filesReviewed: 14
- status: insight
