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

- [x] CHK-001 [P0] Scope is locked to three discovery tests (EX-011, EX-012, EX-013) with no non-discovery scenarios included [EVIDENCE: scope table in `spec.md` lists exactly three rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` matches playbook rows for EX-011, EX-012, EX-013]
- [x] CHK-003 [P0] Feature catalog links for all three tests point to the correct `03--discovery/` files [EVIDENCE: spec.md scope table references the expected discovery catalog entries for EX-011, EX-012, and EX-013]
- [x] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections were re-verified in `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` during the 2026-03-19 post-flight pass]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-011 documents the exact MCP call `memory_list(specFolder,limit,offset)` and expected signals (paginated list, totals, resolved `sortBy`) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-011 [P0] EX-012 documents the exact MCP call `memory_stats(folderRanking:composite,includeScores:true)` and expected dashboard fields (counts, tiers, folder ranking) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-012 [P0] EX-013 documents the two-pass command sequence `memory_health(reportMode:full)` then `memory_health(reportMode:divergent_aliases)` with expected healthy/degraded status and alias-conflict diagnostics [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-013 [P0] Read-only posture is enforced: no `autoRepair: true` with `confirmed: true` calls appear in the execution plan [EVIDENCE: plan.md Phase 2 step and rollback plan both explicitly exclude auto-repair confirmation]
- [x] CHK-014 [P1] EX-013 fallback instruction was reviewed during execution, and no `index_scan(force)` remediation was required because both health checks completed without FTS mismatch [EVIDENCE: `scratch/evidence-raw.md` shows healthy full-mode diagnostics and structurally complete divergent-alias triage with `totalRowsScanned: 433` and `groups: []`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] EX-011 has been executed and raw `memory_list` output with `total`, `count`, `limit`, `offset`, and `sortBy` fields is captured as evidence [EVIDENCE: `scratch/evidence-raw.md` records the exact-match 0-result call plus the supplementary child-path call with `total: 26`, `limit: 20`, `offset: 0`, `sortBy: "created_at"`, and pagination hints]
- [x] CHK-021 [P0] EX-012 has been executed and raw `memory_stats` output with composite folder ranking, tier breakdown, and graph channel metrics is captured as evidence [EVIDENCE: `scratch/evidence-raw.md` records `folderRanking: "composite"`, score-bearing `topFolders[]`, `tierBreakdown`, `graphChannelMetrics`, `totalSpecFolders: 106`, and `lastIndexedAt`]
- [x] CHK-022 [P0] EX-013 has been executed in both modes and health diagnostics plus divergent-alias payload are captured as evidence [EVIDENCE: `scratch/evidence-raw.md` records `memory_health(reportMode: "full")` and `memory_health(reportMode: "divergent_aliases")` with complete diagnostics and triage counters]
- [x] CHK-023 [P0] Each scenario has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: `scratch/post-flight.md` Section 1 contains the verdict table and rationale for EX-011, EX-012, and EX-013]
- [x] CHK-024 [P1] Coverage summary reports 3/3 scenarios executed with no skipped test IDs [EVIDENCE: `scratch/post-flight.md` Section 2 reports `3/3` scenarios executed at `100%` coverage, with the EX-011 supplementary call documented as an execution caveat rather than a skipped test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added to discovery phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-031 [P1] EX-013 evidence capture guidance preserves `memory_health` path-sanitization behavior and does not instruct reviewers to log raw absolute paths [EVIDENCE: plan.md Phase 2 EX-013 step does not request raw path logging]
- [x] CHK-032 [P2] Open questions about alias-conflict corpus are resolved before EX-013 is executed in a shared environment to prevent unintended index exposure [EVIDENCE: `scratch/pre-flight.md` resolved clean-corpus execution as valid, and `scratch/evidence-raw.md` confirms EX-013b returned a structurally complete payload with `totalRowsScanned: 433`, `totalDivergentGroups: 0`, and `groups: []`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook EX-011, EX-012, EX-013 rows and feature catalog]
- [x] CHK-041 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, and checklist [EVIDENCE: post-flight review reconfirmed EX-011, EX-012, and EX-013 names, prompts, and command sequences match across `spec.md`, `plan.md`, and `checklist.md`]
- [x] CHK-042 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: `implementation-summary.md` exists in `003-discovery/`, updated with execution results and verdicts on 2026-03-19]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Final Phase 003 documentation is confined to the expected root docs plus execution artifacts isolated under `scratch/` [EVIDENCE: directory listing shows `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `scratch/` artifacts only within `003-discovery/`]
- [x] CHK-051 [P1] Discovery-phase artifacts are confined to the `003-discovery/` folder even though the wider workspace contains unrelated pre-existing changes [EVIDENCE: the discovery-phase additions are isolated to `003-discovery/scratch/`]
- [x] CHK-052 [P2] Memory save deferred to post-update phase so context includes final verdicts and completed checklist [EVIDENCE: deferral recorded in `scratch/post-flight.md`; memory save will follow doc updates]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
