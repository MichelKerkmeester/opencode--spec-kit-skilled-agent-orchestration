---
title: "Phase Review Report: 008-graph-first-routing-nudge"
description: "10-iteration deep review of 008-graph-first-routing-nudge. Verdict CONDITIONAL with 0 P0 / 1 P1 / 0 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 008-graph-first-routing-nudge

## 1. Overview
Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/`. Iterations completed: 10 of 10. Stop reason: `max_iterations`. Dimensions covered: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. Verdict: CONDITIONAL. Finding counts: 0 P0 / 1 P1 / 0 P2.

## 2. Findings
### DR-008-I001-P1-001
Packet `008` claims the routing nudge only appears when graph readiness and activation scaffolding justify it, but the shipped startup or resume hook path in `session-prime.ts` emits the structural routing hint whenever `graphState === "ready"` and never checks activation scaffolding or task shape. The focused regression suite only exercises the stricter helper and response surfaces, so the hook path is both untested and out of contract.

```json
{
  "claim": "session-prime emits a structural routing hint on graph readiness alone, violating packet 008's promised readiness-plus-activation-scaffolding gate.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:92",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:120",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:37",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:56",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:114",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67"
  ],
  "counterevidenceSought": "Reviewed the hook implementation and the focused regression file for any activation-scaffold or task-shape gate on the startup hint path.",
  "alternativeExplanation": "The generic startup hint may have been intentional because SessionStart has no user task, but that scope exception is not what the packet documents or tests claim.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if packet 008 is explicitly re-scoped so the readiness-plus-scaffolding gate excludes the startup hook surface."
}
```

Iterations `006` through `010` re-sampled the same hook, helper, and evidence surfaces and did not uncover any additional drift beyond this original packet-truth gap.

## 3. Traceability
The packet's spec and implementation summary state that readiness and activation scaffolding control when hints appear, and the focused test file proves that on the `context-server.ts` helper path. That proof does not extend to `session-prime.ts`, which currently gates only on `graphState === "ready"`. The extension rerun left that mismatch unchanged.

## 4. Recommended Remediation
- Add the missing activation-scaffold or task-shape gate to [`session-prime.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts):114.
- Extend [`graph-first-routing-nudge.vitest.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts):14 with a hook-path assertion, or narrow the packet docs so they no longer claim the stricter gate on that surface.

## 5. Cross-References
`context-server.ts`, `memory-context.ts`, and bootstrap authority handling are otherwise consistent. The open gap is localized to the startup or resume hint surface, which makes this a good low-blast-radius remediation candidate.
