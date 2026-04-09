---
title: "Deep Review Dashboard - 008-graph-first-routing-nudge"
description: "Initial dashboard for Batch B review of 008-graph-first-routing-nudge."
---

# Deep Review Dashboard - 008-graph-first-routing-nudge

- Session: `2026-04-09T14:20:47Z-008-graph-first-routing-nudge`
- Status: `COMPLETE`
- Iterations completed: `10 / 10`
- Findings: `0 P0 / 1 P1 / 0 P2`
- Dimensions covered: `4 / 4`
- Verdict: `CONDITIONAL`
- Stop reason: `max_iterations`
- Next focus: none

*** Add File: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/008-graph-first-routing-nudge/iterations/iteration-001.md
---
title: "Deep Review Iteration 001 - D1 Correctness"
iteration: 001
dimension: D1 Correctness
session_id: 2026-04-09T14:20:47Z-008-graph-first-routing-nudge
timestamp: 2026-04-09T14:44:00Z
status: insight
---

# Iteration 001 - D1 Correctness

## Focus
Inventory the packet `008` owner surfaces and verify that every shipped routing-nudge path is readiness-gated and advisory-only.

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts`

## Findings

### P0 - Blockers
None.

### P1 - Required
1. Packet `008` claims the routing nudge only appears when graph readiness and activation scaffolding justify it, but the shipped startup or resume hook path in `session-prime.ts` emits the structural routing hint whenever `graphState === "ready"` and never checks activation scaffolding or task shape. The focused regression suite only exercises `context-server.ts`, `memory-context.ts`, and bootstrap authority preservation, so the less-gated hook path is both untested and out of contract.

```json
{
  "claim": "session-prime emits a structural routing hint on graph readiness alone, violating packet 008's promised readiness-plus-activation-scaffolding gate.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md:92",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md:120",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/implementation-summary.md:37",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/implementation-summary.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/implementation-summary.md:56",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:114",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67"
  ],
  "counterevidenceSought": "Checked the hook implementation and the focused regression file for any activation-scaffold or task-shape gate on the session-prime path.",
  "alternativeExplanation": "The generic startup hint may have been intentionally looser because SessionStart has no user task yet, but that still conflicts with the packet's shipped gating claim.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if packet 008 is explicitly re-scoped so the readiness-plus-scaffolding gate only applies to response-hint and memory-context surfaces, not the startup hook."
}
```

### P2 - Suggestions
None.

## Cross-References
`context-server.ts` and `memory-context.ts` both use stronger structural gating. The gap is isolated to the startup or resume hint surface added in `session-prime.ts`.

## Next Focus
D2 Security and authority-boundary implications of the ungated hook hint.

## Metrics
- newFindingsRatio: 1.00
- filesReviewed: 8
- status: insight
