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

- [ ] CHK-010 [P0] `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` canonical in `session-types.ts` (REQ-001)
- [ ] CHK-011 [P0] All extractor files import these types from `session-types.ts`, not define locally (REQ-001)
- [ ] CHK-012 [P0] Re-exports in original files for backward compatibility (REQ-001)
- [ ] CHK-013 [P0] `SessionData` explicitly models `implementation-guide`, `preflight`, `postflight`, `continue-session` fields (REQ-002)
- [ ] CHK-014 [P0] `PhaseEntry.ACTIVITIES` is required, not optional (REQ-003)
- [ ] CHK-015 [P0] `CollectedDataFor*` subsets consolidated using `Pick`/`Omit` — no more than 2 subset interfaces remain (REQ-004)
- [ ] CHK-016 [P0] `[key: string]: unknown` removed from `SessionData` (REQ-005)
- [ ] CHK-017 [P0] `OutcomeEntry.TYPE` handling normalized — required or has explicit default (REQ-006)
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
| P0 Items | 10 | [ ]/10 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
