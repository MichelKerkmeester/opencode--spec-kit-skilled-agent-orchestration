---
title: "Verification Checklist: manual-testing-per-playbook discovery phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 003 discovery manual tests covering EX-011 (memory_list), EX-012 (memory_stats), and EX-013 (memory_health)."
trigger_phrases:
  - "discovery checklist"
  - "phase 003 verification"
  - "manual discovery checklist"
  - "EX-011 EX-012 EX-013 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook discovery phase

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

- [x] CHK-001 [P0] Scope is locked to three discovery tests (EX-011, EX-012, EX-013) with no non-discovery scenarios included [EVIDENCE: scope table in `spec.md` lists exactly three rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` matches playbook rows for EX-011, EX-012, EX-013]
- [x] CHK-003 [P0] Feature catalog links for all three tests point to the correct `03--discovery/` files [EVIDENCE: spec.md links `01-memory-browser-memorylist.md`, `02-system-statistics-memorystats.md`, `03-health-diagnostics-memoryhealth.md`]
- [ ] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-011 documents the exact MCP call `memory_list(specFolder,limit,offset)` and expected signals (paginated list, totals, resolved `sortBy`) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-011 [P0] EX-012 documents the exact MCP call `memory_stats(folderRanking:composite,includeScores:true)` and expected dashboard fields (counts, tiers, folder ranking) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-012 [P0] EX-013 documents the two-pass command sequence `memory_health(reportMode:full)` then `memory_health(reportMode:divergent_aliases)` with expected healthy/degraded status and alias-conflict diagnostics [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-013 [P0] Read-only posture is enforced: no `autoRepair: true` with `confirmed: true` calls appear in the execution plan [EVIDENCE: plan.md Phase 2 step and rollback plan both explicitly exclude auto-repair confirmation]
- [ ] CHK-014 [P1] EX-013 fallback instruction (`Run index_scan(force) if FTS mismatch`) from the playbook is reflected in the plan or open questions [EVIDENCE: triage/remediation instruction present]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] EX-011 has been executed and raw `memory_list` output with `total`, `count`, `limit`, `offset`, and `sortBy` fields is captured as evidence [EVIDENCE: execution log attached]
- [ ] CHK-021 [P0] EX-012 has been executed and raw `memory_stats` output with composite folder ranking, tier breakdown, and graph channel metrics is captured as evidence [EVIDENCE: execution log attached]
- [ ] CHK-022 [P0] EX-013 has been executed in both modes and health diagnostics plus divergent-alias payload are captured as evidence [EVIDENCE: execution logs for full and divergent_aliases modes attached]
- [ ] CHK-023 [P0] Each scenario has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-024 [P1] Coverage summary reports 3/3 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added to discovery phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-031 [P1] EX-013 evidence capture guidance preserves `memory_health` path-sanitization behavior and does not instruct reviewers to log raw absolute paths [EVIDENCE: plan.md Phase 2 EX-013 step does not request raw path logging]
- [ ] CHK-032 [P2] Open questions about alias-conflict corpus are resolved before EX-013 is executed in a shared environment to prevent unintended index exposure [EVIDENCE: open questions in spec.md addressed or deferred]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook EX-011, EX-012, EX-013 rows and feature catalog]
- [ ] CHK-041 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-042 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `003-discovery/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `003-discovery/` [EVIDENCE: directory listing confirms four files]
- [ ] CHK-051 [P1] No unrelated files were added outside the `003-discovery/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-052 [P2] Memory save was triggered after phase packet creation to make discovery context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 7 | 0/7 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
