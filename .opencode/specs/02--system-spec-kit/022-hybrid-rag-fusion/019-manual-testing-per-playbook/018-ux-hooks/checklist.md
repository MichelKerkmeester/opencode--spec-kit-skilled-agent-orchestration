---
title: "Verification Checklist: manual-testing-per-playbook ux-hooks phase [template:level_2/checklist.md]"
description: "Phase 018 verification checklist for the five UX-hooks manual test scenarios covering hook module coverage, save-path parity, success-envelope finalization, barrel synchronization, and checkpoint confirmName enforcement."
trigger_phrases:
  - "ux hooks verification checklist"
  - "phase 018 checklist"
  - "ux hooks manual test verification"
  - "mutation feedback checklist"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — all 5 scenarios with exact prompts, commands, and pass criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — preconditions, phased execution, and rollback
- [x] CHK-003 [P1] Dependencies identified and available — playbook, review protocol, feature catalog links, vitest suite, and ripgrep
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] NEW-103 vitest suite (`hooks-ux-feedback.vitest.ts`) passes with no failing assertions covering latency/cache-clear booleans and finalized hint payload
- [ ] CHK-011 [P0] NEW-104 vitest suite (`memory-save-ux-regressions.vitest.ts`) passes and assertions confirm no false `postMutationHooks` on no-op saves and atomic-save parity
- [ ] CHK-012 [P0] NEW-105 vitest suite (`context-server.vitest.ts`) passes and assertions cover appended hints, preserved `autoSurfacedContext`, and finalized token metadata
- [ ] CHK-013 [P1] NEW-106 ripgrep outputs confirm `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks` appear in both `hooks/index.ts` and `hooks/README.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 5 UX-hooks scenarios have execution evidence tied to the exact documented prompt and command sequence
- [ ] CHK-021 [P0] Every scenario has a PASS, PARTIAL, or FAIL verdict with rationale using the review protocol acceptance checks
- [ ] CHK-022 [P0] NEW-107 three-suite run (`handler-checkpoints.vitest.ts`, `tool-input-schema.vitest.ts`, `mcp-input-validation.vitest.ts`) passes and proves missing-`confirmName` rejection plus `safetyConfirmationUsed=true` success
- [ ] CHK-023 [P1] Coverage reported as 5/5 scenarios for Phase 018 with no skipped test IDs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in spec, plan, tasks, or checklist files
- [ ] CHK-031 [P0] NEW-107 confirms `confirmName` safety parameter enforcement is validated at handler, schema, and tool-type layers — no bypass path possible
- [ ] CHK-032 [P1] Checkpoint delete rejection evidence shows Zod-level error, not silent failure
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and checklist are synchronized and cross-referenced
- [x] CHK-041 [P1] All feature catalog links in scope table are verified against actual files in `../../feature_catalog/18--ux-hooks/`
- [ ] CHK-042 [P2] Evidence artifacts saved to `scratch/` before completion (if applicable)
- [x] CHK-043 [P1] Playbook scenario rows for NEW-103 through NEW-107 confirmed as source of truth for all prompt and command content in this packet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All four phase files (spec.md, plan.md, tasks.md, checklist.md) created in `019-manual-testing-per-playbook/018-ux-hooks/`
- [ ] CHK-051 [P1] Temp or scratch evidence files placed in `scratch/` only
- [ ] CHK-052 [P2] Phase 018 evidence artifacts retained for coverage report
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 2/10 |
| P1 Items | 9 | 4/9 |
| P2 Items | 3 | 0/3 |

**Verification Date**: *(pending execution)*
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
