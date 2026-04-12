---
title: "Deep Review Iteration 006 — D2 Security"
iteration: 006
dimension: D2 Security
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T05:35:47Z
status: insight
---

# Iteration 006 — D2 Security

## Focus
This iteration stayed on the packet 012 cached-continuity trust boundary, but moved past stale/invalid rejection logic into selection authority. I reviewed how `session_resume` and the SessionStart startup path choose a cached summary, whether that choice remains scoped to the active session or requested packet, and whether the focused corpus proves the fail-closed behavior the packet claims.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` (597 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (282 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` (219 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` (137 lines)
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts` (163 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/spec.md` (289 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/implementation-summary.md` (94 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
- `P1`: Unscoped cached-continuity selection is keyed to the newest hook-state file in the project, so SessionStart startup and `session_resume()` calls without `specFolder` can surface another session's cached summary without proving it belongs to the active session or requested scope. Packet 012 requires explicit scope invalidation and fail-closed reuse, but the current selection path treats "latest project state with any scope anchor" as sufficient.

```json
{
  "claim": "Unscoped cached continuity reuse accepts the newest hook-state file in the project, allowing startup and unscoped session_resume outputs to expose another session's cached summary without a current-session or requested-scope proof.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:91",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:99",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:346",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:354",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:467",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:121",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:126",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/spec.md:111",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/spec.md:123"
  ],
  "counterevidenceSought": "I looked for a call-site session binding, a required specFolder on startup/resume, or a negative test proving that unrelated recent state is rejected before hint injection.",
  "alternativeExplanation": "The product may intentionally want project-wide 'last work' continuity across new sessions, but that intent is not documented in packet 012 and does not satisfy its explicit scope/fail-closed wording.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if startup and unscoped resume are explicitly documented as project-wide continuity surfaces and the packet/test suite is updated to treat cross-session reuse as the intended contract."
}
```

### P2 — Suggestions
None this iteration

## Cross-References
Packet `002` owns the writer-side hook metadata, but this issue is entirely in the packet `012` consumer path: `loadMostRecentState()` plus unscoped callers in `session_resume` and `session-prime` create a cross-session selection heuristic that packet `002` never promised.

## Next Focus Recommendation
Stay on D2 for iteration 007 and audit the compact-recovery trust labels end to end: verify whether `pendingCompactPrime.payloadContract.provenance.trustState` can overstate authority after compaction recovery, and add a security pass over tests/docs for cross-session or cross-scope rejection coverage that packet 012 currently lacks.

## Metrics
- newFindingsRatio: 0.17 (new findings this iter / total findings cumulative)
- filesReviewed: 7
- status: insight
