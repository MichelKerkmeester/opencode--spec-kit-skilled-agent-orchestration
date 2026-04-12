---
title: "Deep Review Iteration 001 — D1 Correctness"
iteration: 001
dimension: D1 Correctness
session_id: 2026-04-09T14:31:56Z-005-code-graph-upgrades
timestamp: 2026-04-09T14:32:56Z
status: insight
---

# Iteration 001 — D1 Correctness

## Focus
Inventory the runtime lane and verify the highest-risk contract: additive graph-edge enrichment should survive the session_resume -> session_bootstrap owner chain.

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts`

## Findings
### P0 — Blockers
None this iteration

### P1 — Required
1. Packet `014` overclaims resume/bootstrap preservation for the new graph-edge enrichment fields. The spec assigns `session-resume.ts` and `session-bootstrap.ts` explicit preservation work (`spec.md:83-90` and REQ-003 at `spec.md:106`), and the implementation summary plus checklist repeat that claim (`implementation-summary.md:48`, `implementation-summary.md:75`, `checklist.md:55`). In the shipped runtime, neither handler mentions `graphEdgeEnrichment`, `edgeEvidenceClass`, or `numericConfidence`, and the supporting tests only assert `structuralTrust` plus certainty fields.

```json
{
  "claim": "Packet 014 claims resume/bootstrap preserve graph-edge enrichment, but neither handler or test currently carries or asserts those fields.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:83",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:84",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:89",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:90",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:106",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:48",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:75",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/checklist.md:55",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:518",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:587",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:246",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:326",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198",
    ".opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:228"
  ],
  "counterevidenceSought": "Searched both handlers and the claimed preservation tests for graphEdgeEnrichment, edgeEvidenceClass, and numericConfidence. No hits existed outside graph-local query surfaces.",
  "alternativeExplanation": "The implementation may have intentionally limited edge enrichment to graph-local outputs, but the packet docs and checklist were not rewritten to reflect that narrower scope.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if another shipped resume/bootstrap serialization path injects graphEdgeEnrichment before MCP responses are returned, or if packet 014 is formally re-scoped to exclude resume/bootstrap preservation."
}
```

### P2 — Suggestions
None this iteration

## Cross-References
The graph-local query improvements are real, but the owner-chain preservation claim still behaves like documentation projected ahead of runtime.

## Next Focus Recommendation
Move to D2 Security and confirm that no second authority-surface or routing-overlap problem was introduced while this preservation gap remained.

## Metrics
- newFindingsRatio: 1.0
- filesReviewed: 9
- status: insight
