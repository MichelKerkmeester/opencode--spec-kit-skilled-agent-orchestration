---
title: "Phase Review Report: 005-code-graph-upgrades"
description: "5-iteration deep review of 005-code-graph-upgrades. Verdict CONDITIONAL with 0 P0 / 1 P1 / 0 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 005-code-graph-upgrades

## 1. Overview
Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/`. Iterations completed: 5. Stop reason: `max_iterations`. Dimensions covered: correctness, security, traceability, maintainability. Verdict: **CONDITIONAL**. Findings: 0 P0 / 1 P1 / 0 P2.

## 2. Findings
- **P1** Packet `014` claims that `session_resume` and `session_bootstrap` preserve additive graph-edge enrichment, but neither handler carries `graphEdgeEnrichment`, `edgeEvidenceClass`, or `numericConfidence`, and the cited tests do not assert those fields.

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

## 3. Traceability
Traceability is partial. The packet docs and checklist claim resume/bootstrap enrichment preservation, but the current handlers and tests do not support that claim.

## 4. Recommended Remediation
- Either implement graph-edge enrichment carriage through `session-resume.ts` and `session-bootstrap.ts`, or re-scope the packet docs so the enrichment claim stays limited to graph-local query surfaces.
- Update the cited tests so they assert the enrichment fields if the runtime preservation path is intended to exist.

## 5. Cross-References
Packet 014 does deliver the graph-local query upgrades, but its resume/bootstrap preservation story still depends on packet 011’s trust chain without actually carrying the new graph-edge enrichment through it.
