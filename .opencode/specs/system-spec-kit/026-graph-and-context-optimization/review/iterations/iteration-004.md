---
title: "Deep Review Iteration 004 — D1 Correctness"
iteration: 004
dimension: D1 Correctness
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T04:21:22Z
status: insight
---

# Iteration 004 — D1 Correctness

## Focus
This pass finished the correctness sweep across the remaining shipped packets `007`, `009`, and `010`. I reviewed the live runtime seams, focused regression tests, and packet closeout docs to check whether each packet's "implemented" claims are actually exercised by production-facing code instead of only being described or unit-tested in isolation.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` (215 lines)
- `.opencode/skill/system-spec-kit/scripts/tests/detector-regression-floor.vitest.ts.test.ts` (73 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts` (91 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` (1317 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` (299 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` (315 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts` (275 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts` (104 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` (338 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-detector-provenance-and-regression-floor/implementation-summary.md` (96 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/implementation-summary.md` (78 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/implementation-summary.md` (79 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-detector-provenance-and-regression-floor/spec.md` (228 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md` (229 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/spec.md` (236 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
- `DR-026-I004-P1-001` Packet `009` is marked implemented as a publication contract, but the shipped change set never wires that contract into any publication or export consumer. The spec still requires handler-level output behavior (`handlers` changes plus rows excluded from publication outputs with surfaced exclusion reasons), while the implementation summary explicitly says the work stopped at a reusable helper because no row-oriented handler exists yet. That leaves `REQ-001`, `REQ-002`, `SC-001`, and `SC-002` unfulfilled despite the packet's implemented closeout state.

```json
{
  "claim": "Packet 009 overclaims delivered runtime behavior because it ships only a helper-level publication gate and unit test, not a live publication/export consumer that enforces exclusion behavior.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md:73",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md:87",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md:88",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md:115",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/spec.md:116",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/implementation-summary.md:34",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/implementation-summary.md:44",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/implementation-summary.md:76",
    ".opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:47",
    ".opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:3"
  ],
  "counterevidenceSought": "I looked for a live handler or export surface consuming evaluatePublicationGate within the packet runtime scope so that row exclusion and reason surfacing would happen outside the helper unit test.",
  "alternativeExplanation": "The packet may have been intentionally downgraded to a precursor helper-only contract, but the spec status, Files to Change section, and success criteria were not rewritten to match that narrower delivery.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if a reviewed publication/export handler already consumes the helper and surfaces exclusion reasons in shipped runtime code, or if packet 009 is explicitly reclassified from implemented behavior to helper-only prerequisite work."
}
```

### P2 — Suggestions
None this iteration

## Traceability Checks (if D3)
Not applicable this iteration.

## Cross-References
Packet `009` is a different failure shape than the prior `011`/`012`/`013` D1 findings. Those packets shipped runtime seams whose tests or docs overstated end-to-end proof; packet `009` instead documents the deferral honestly in `implementation-summary.md`, but the packet still remains marked implemented against success criteria that require live publication-output behavior.

Packet `007` stayed inside its stated regression-floor boundary this pass, and packet `010` remained aligned with its lexical-path/fallback truth contract in the reviewed runtime and focused tests.

## Next Focus Recommendation
Move to `D2 Security`. Start with the shared trust/cached continuity surfaces where fail-closed behavior matters most: `shared-payload.ts`, `session-bootstrap.ts`, `session-resume.ts`, `hooks/claude/session-prime.ts`, and `ENV_REFERENCE.md`. Confirm malformed structural sections, stale continuity inputs, and cache-fed trust metadata cannot silently broaden authority.

## Metrics
- newFindingsRatio: 0.25 (new findings this iter / total findings cumulative)
- filesReviewed: 15
- status: insight
