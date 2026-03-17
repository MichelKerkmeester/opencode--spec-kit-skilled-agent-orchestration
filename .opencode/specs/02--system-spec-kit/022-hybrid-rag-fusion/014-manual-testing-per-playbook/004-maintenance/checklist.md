---
title: "Verification Checklist: manual-testing-per-playbook maintenance phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 004 maintenance manual testing packet covering EX-014 (workspace scanning and indexing) and EX-035 (startup runtime compatibility guards)."
trigger_phrases:
  - "maintenance checklist"
  - "phase 004 verification"
  - "index scan test checklist"
  - "startup guard verification checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook maintenance phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] CHK-001 [P0] EX-014 and EX-035 scenarios documented in `spec.md` with exact playbook prompts, command sequences, feature links, and pass criteria — REQ-001 (EX-014 incremental scan) and REQ-002 (EX-035 startup guard) derived from playbook rows [EVIDENCE: spec.md scope table + requirements section]
- [ ] CHK-002 [P0] Feature catalog links for the documented scenarios are verified against the cross-reference index in `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: EX-014 links to `../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`; EX-035 and NEW-100 link to `../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md`; NEW-101 links to `../../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md`]
- [ ] CHK-003 [P1] Sandbox spec folder for EX-014 identified with at least one recently modified file available for deterministic scan results [EVIDENCE: sandbox folder path confirmed in plan.md or reviewer notes]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] EX-014 command sequence matches the canonical playbook exactly — `memory_index_scan(force:false)` -> `memory_stats()` with no omissions or substitutions [EVIDENCE: spec.md scope table compared to playbook row EX-014]
- [ ] CHK-011 [P0] EX-035 command sequence matches the canonical playbook exactly — `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/startup-checks.vitest.ts` with no omissions or substitutions [EVIDENCE: spec.md scope table compared to playbook row EX-035]
- [ ] CHK-012 [P1] Pass/fail criteria in spec.md requirements match the playbook acceptance language — EX-014: changed files reflected; EX-035: all `startup-checks.vitest.ts` tests passing [EVIDENCE: spec.md REQ-001/REQ-002 vs playbook pass/fail columns]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] EX-014 execution evidence captured: scan output showing changed-file count, `memory_stats()` snapshot before and after, and no unexpected failures [EVIDENCE: EX-014 execution transcript]
- [ ] CHK-021 [P0] EX-035 execution evidence captured: full `npm test -- --run tests/startup-checks.vitest.ts` transcript with runtime mismatch, marker creation, and SQLite diagnostics tests visible and passing [EVIDENCE: EX-035 Vitest output]
- [ ] CHK-022 [P1] Verdicts assigned for both scenarios using review protocol acceptance rules — each scenario marked PASS, PARTIAL, or FAIL with explicit rationale [EVIDENCE: reviewer verdict notes per scenario]
- [ ] CHK-023 [P1] Phase coverage reported as 2/2 scenarios with no skipped test IDs [EVIDENCE: coverage summary in plan.md or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] EX-014 scan execution is restricted to the sandbox spec folder and does not modify production index entries or shared memory records [EVIDENCE: command transcript confirming `specFolder` scoping or sandbox isolation]
- [ ] CHK-031 [P0] EX-035 test run does not expose secrets, credentials, or sensitive environment variables in the Vitest output transcript [EVIDENCE: EX-035 transcript reviewed for credential leakage]
- [ ] CHK-032 [P1] `.node-version-marker` state before and after EX-035 is documented so any unintended mutation can be detected and reversed [EVIDENCE: pre/post marker state captured in reviewer notes]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are internally consistent — scope table IDs match requirements, plan phases match tasks, checklist items reference correct test IDs [EVIDENCE: cross-doc review]
- [ ] CHK-041 [P1] Feature catalog links in spec.md point to existing files in `../../feature_catalog/04--maintenance/` [EVIDENCE: file paths verified accessible]
- [ ] CHK-042 [P2] Open questions in spec.md are resolved or explicitly deferred with documented owner and resolution path [EVIDENCE: open questions section updated or linked to resolution note]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All Phase 004 artifacts are in `004-maintenance/` — `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` present in the correct folder [EVIDENCE: folder listing]
- [ ] CHK-051 [P1] Temporary files and working notes are kept in `scratch/` only — no temp files outside scratch/ [EVIDENCE: no repo temp artifacts created outside scratch/]
- [ ] CHK-052 [P2] Phase 004 context is saved to memory when execution is complete — `generate-context.js` run against `014-manual-testing-per-playbook/004-maintenance/` [EVIDENCE: memory file created in `memory/`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: _pending execution_
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
