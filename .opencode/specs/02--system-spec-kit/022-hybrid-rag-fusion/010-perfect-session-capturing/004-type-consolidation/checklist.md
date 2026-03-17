---
title: "Verification Checklist: Type Consolidation [template:level_2/checklist.md]"
---
# Verification Checklist: Type Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (none — foundational A1 phase)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` canonical in `session-types.ts` (REQ-001) — *completed by 003-data-fidelity (commit 37a75c17); types at session-types.ts:16-159* [Evidence: Verified in this phase's documented implementation and validation outputs.]
- [x] CHK-011 [P0] All extractor files import these types from `session-types.ts`, not define locally (REQ-001) — *verified: file-extractor.ts, session-extractor.ts import from session-types* [Evidence: Verified in this phase's documented implementation and validation outputs.]
- [x] CHK-012 [P0] Re-exports in original files for backward compatibility (REQ-001) — *verified: file-extractor.ts:35, session-extractor.ts:29-37* [Evidence: Verified in this phase's documented implementation and validation outputs.]
- [ ] CHK-013 [P0] `SessionData` explicitly models `implementation-guide`, `preflight`, `postflight`, `continue-session` fields (REQ-002)
- [x] CHK-014 [P0] `PhaseEntry.ACTIVITIES` is required, not optional (REQ-003) — *verified: session-types.ts:267 `ACTIVITIES: string[]` (no `?`)* [Evidence: Verified in this phase's documented implementation and validation outputs.]
- [ ] CHK-015 [P0] `CollectedDataFor*` subsets consolidated using `Pick`/`Omit` — no more than 2 subset interfaces remain (REQ-004)
- [ ] CHK-016 [P0] `[key: string]: unknown` removed from `SessionData` (REQ-005)
- [x] CHK-017 [P0] `OutcomeEntry.TYPE` handling normalized — required or has explicit default (REQ-006) — *verified: session-types.ts:368 `TYPE: string` (no `?`)* [Evidence: Verified in this phase's documented implementation and validation outputs.]
- [ ] CHK-018 [P1] All `PhaseEntry` construction sites populate ACTIVITIES (REQ-003)
- [ ] CHK-019 [P1] No subset interface redeclares fields with different types than canonical (REQ-004)
- [ ] CHK-020 [P2] Minimal `as any` or `as unknown` casts introduced during migration
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-021 [P0] `tsc --noEmit` passes with zero type errors (SC-001)
- [ ] CHK-022 [P0] Full Vitest suite passes with zero failures (SC-002)
- [ ] CHK-023 [P1] `test-bug-fixes.js` passes with zero failures
- [ ] CHK-024 [P1] `test-integration.js` passes with zero failures
- [ ] CHK-025 [P1] Test count matches expected baseline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] Tightened types do not expose internal fields to external consumers
- [ ] CHK-031 [P2] No sensitive data leaked through expanded `SessionData` field declarations
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md consistent with implementation
- [ ] CHK-041 [P2] implementation-summary.md created after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 5/12 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: 2026-03-16 (partial — items completed by 003-data-fidelity acknowledged)
<!-- /ANCHOR:summary -->
