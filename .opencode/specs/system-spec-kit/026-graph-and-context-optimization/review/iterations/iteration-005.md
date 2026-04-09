---
title: "Deep Review Iteration 005 — D2 Security"
iteration: 005
dimension: D2 Security
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T04:26:36Z
status: insight
---

# Iteration 005 — D2 Security

## Focus
Reviewed the structural-trust validator and the cached continuity owner surfaces to verify that malformed or missing trust metadata fails closed instead of being silently upgraded. This D2 pass concentrated on the bootstrap/resume handoff because the current strategy explicitly called out stale cached continuity and partial trust metadata as the highest-risk trust-boundary seam.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` (490 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` (366 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` (597 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (282 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` (137 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` (271 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts` (226 lines)
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (452 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-structural-trust-axis-contract/spec.md` (229 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md` (234 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md` (81 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md` (289 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md` (94 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
1. `session_bootstrap` fails open on resume errors by stamping fallback structural trust onto the failed `resume` surface. When `handleSessionResume()` throws, bootstrap collapses the live resume output to `{ error }`, but later derives `structuralTrust` from the independent structural snapshot and applies it to both `structuralContext` and `resume`. On a ready graph snapshot that means the errored `resume` object is returned with `parserProvenance="ast"`, `evidenceStatus="confirmed"`, and `freshnessAuthority="live"` even though no resume payload emitted or validated those trust axes. Packet `011` requires malformed or missing trust metadata to fail closed, and packet `012` says rejected additive paths must keep the authoritative live path intact instead of silently guessing, so this widens authority exactly when the owner surface has already errored.

```json
{
  "claim": "session_bootstrap synthesizes graph-derived live structural trust onto an errored resume payload instead of failing closed when session_resume does not return validated trust metadata.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:201",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:251",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:258",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:63",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:93",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md:24",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/implementation-summary.md:43"
  ],
  "counterevidenceSought": "Checked whether bootstrap dropped trust fields on resume failure, whether session-prime reused the same widening pattern, and whether the shared validator itself was allowing partial trust payloads through.",
  "alternativeExplanation": "The fallback may have been intended only for the structuralContext branch, but the current implementation applies the same graph-derived trust payload to the errored resume object as well.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if a documented consumer contract explicitly permits bootstrap to annotate errored resume outputs with bootstrap-local trust metadata and downstream callers never treat those fields as resume authority."
}
```

### P2 — Suggestions
None this iteration

## Traceability Checks (if D3)
Not applicable this iteration

## Cross-References
This seam sits across packet `011`'s fail-closed trust-preservation contract and packet `012`'s additive cached-continuity authority boundary. The core validator in `shared-payload.ts` remains strict; the widening happens only after `session-bootstrap` catches the resume failure and re-annotates the owner output.

## Next Focus Recommendation
Continue the D2 pass on cached continuity rejection paths and authority separation, especially `getCachedSessionSummaryDecision()` plus the `session-prime` and hook-state consumers. The next iteration should verify that rejected or stale cached summaries stay visibly untrusted across minimal/full `session_resume` and startup hook outputs without inferred trust promotion.

## Metrics
- newFindingsRatio: 0.20 (new findings this iter / total findings cumulative)
- filesReviewed: 13
- status: insight
