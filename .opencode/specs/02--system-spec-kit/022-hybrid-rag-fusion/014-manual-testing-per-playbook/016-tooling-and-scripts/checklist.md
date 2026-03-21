---
title: "Verification Checklist: manual-testing-per-playbook tooling-and-scripts phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 016 tooling-and-scripts manual tests covering 061, 062, 070, 089, 099, 108, 113, 127, 128, 135, 136, 137, 138, 139, 147, 149, PHASE-001, PHASE-002, PHASE-003, PHASE-004, and PHASE-005."
trigger_phrases:
  - "tooling and scripts checklist"
  - "phase 016 verification"
  - "manual tooling checklist"
  - "061 113 PHASE-005 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook tooling-and-scripts phase

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

- [x] CHK-001 [P0] Scope is locked to the 23 phase-016 scenarios (061, 062, 070, 089, 099, 108, 113, 127, 128, 135, 136, 137, 138, 139, 147, 149, PHASE-001 through PHASE-005) with no out-of-scope scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 21 rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted from `../../manual_testing_playbook/manual_testing_playbook.md` for all 16 NEW-series scenarios [EVIDENCE: testing strategy table in `plan.md` matches playbook source rows]
- [x] CHK-003 [P0] 139 is explicitly sourced from the canonical session-capturing quality section in the playbook, not from a missing standalone main-table row [EVIDENCE: spec.md risk register and open questions document the source choice]
- [x] CHK-004 [P0] PHASE-001 through PHASE-005 are linked to the correct `../../feature_catalog/feature_catalog.md` phase-system anchors and PHASE-005 is documented as cross-cutting command coverage [EVIDENCE: spec.md scope table links to the phase-system anchors]
- [x] CHK-005 [P0] Feature catalog links for all 16 NEW-series scenarios point to the correct tooling/script feature sources [EVIDENCE: spec.md scope table links verified against `../../feature_catalog/16--tooling-and-scripts/` and `../../feature_catalog/feature_catalog.md`]
- [ ] CHK-006 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL`, frontmatter, and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 061 documents the tree-thinning validation prompt with expected signals: small files merged, positive token savings, and preserved content integrity [EVIDENCE: spec.md REQ-061 and plan.md testing strategy row]
- [x] CHK-011 [P0] 062 documents the progressive-validation prompt with expected signals: levels 1-4 produce progressively stricter validation and exit codes match severity [EVIDENCE: spec.md REQ-062 and plan.md testing strategy row]
- [x] CHK-012 [P0] 070 documents the dead-code-removal audit prompt with expected signals: removed symbols have zero references and representative flows execute cleanly [EVIDENCE: spec.md REQ-070 and plan.md testing strategy row]
- [x] CHK-013 [P0] 089 documents the code-standards-alignment prompt with expected signals: zero naming, commenting, and import-order mismatches [EVIDENCE: spec.md REQ-089 and plan.md testing strategy row]
- [x] CHK-014 [P0] 099 documents the SPECKIT_FILE_WATCHER prompt with expected signals: debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently [EVIDENCE: spec.md REQ-099 and plan.md testing strategy row]
- [x] CHK-015 [P0] 113 documents the standalone admin CLI prompt covering all 4 commands (stats, bulk-delete, reindex, downgrade) with expected signals: dry-run, safety prompt, and best-effort checkpoint [EVIDENCE: spec.md REQ-113 and plan.md testing strategy row]
- [x] CHK-016 [P0] 127 documents the migration checkpoint script verification prompt with expected signal: `migration-checkpoint-scripts.vitest.ts` completes with all tests passing [EVIDENCE: spec.md REQ-127 and plan.md testing strategy row]
- [x] CHK-017 [P0] 128 documents the schema compatibility validation prompt with expected signal: `vector-index-schema-compatibility.vitest.ts` completes with all tests passing [EVIDENCE: spec.md REQ-128 and plan.md testing strategy row]
- [x] CHK-018 [P0] 135, 136, and 137 document their feature-catalog grep traceability and annotation prompts with expected signals: multi-layer hits, zero mismatches, and no orphaned references [EVIDENCE: spec.md REQ-135 through REQ-137 and plan.md rows]
- [x] CHK-019 [P0] 138 documents the MODULE header compliance prompt with expected signal: zero `TS-MODULE-HEADER` findings [EVIDENCE: spec.md REQ-138 and plan.md testing strategy row]
- [x] CHK-020 [P0] 139 documents the full M-007 closure verification prompt covering JSON authority, stateless enrichment, all native fallback chain paths (OpenCode, Claude, Codex, Copilot, Gemini), numeric quality calibration, and indexing readiness [EVIDENCE: spec.md REQ-139 and plan.md testing strategy row with full M-007 prompt]
- [x] CHK-021 [P0] 147 documents the `/memory:learn` constitutional manager prompt with expected signals: all command flows match the constitutional contract and no active docs advertise legacy behavior [EVIDENCE: spec.md REQ-147 and plan.md testing strategy row]
- [x] CHK-022 [P0] 149 documents the rendered-memory template contract prompt with expected signals: malformed files rejected before write/index, apply-mode reports are validator-clean, and active audit shows no structural violations [EVIDENCE: spec.md REQ-149 and plan.md testing strategy row]
- [x] CHK-023 [P0] PHASE-001 through PHASE-005 document their phase-system prompts with expected signals matching REQ-PHASE-001 through REQ-PHASE-005 acceptance criteria [EVIDENCE: spec.md requirements and plan.md testing strategy rows for all five PHASE IDs]
- [ ] CHK-024 [P1] Destructive test boundary is clearly stated for 099, 113, 139, 149, PHASE-002, PHASE-003, PHASE-004, and PHASE-005 — sandbox targets or disposable folders only [EVIDENCE: plan.md Phase 3 instructions reference disposable scope and cleanup rules]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All 12 non-destructive scenarios (061, 062, 070, 089, 127, 128, 135, 136, 137, 138, 147, PHASE-001) have been executed and evidence is captured [EVIDENCE: named evidence artifacts per scenario present]
- [ ] CHK-031 [P0] All 8 destructive/sandbox scenarios (099, 113, 139, 149, PHASE-002, PHASE-003, PHASE-004, PHASE-005) have been executed in disposable sandbox targets with evidence captured [EVIDENCE: named evidence artifacts and sandbox cleanup confirmation present]
- [ ] CHK-032 [P0] 127 Vitest transcript confirms `migration-checkpoint-scripts.vitest.ts` with all tests passing [EVIDENCE: Vitest output log attached]
- [ ] CHK-033 [P0] 128 Vitest transcript confirms `vector-index-schema-compatibility.vitest.ts` with all tests passing [EVIDENCE: Vitest output log attached]
- [ ] CHK-034 [P0] 139 M-007 closure evidence covers all 10 sub-steps (M-007a through M-007j) with expected behavior confirmed for each [EVIDENCE: session transcript or structured log attached]
- [ ] CHK-035 [P0] Each of the 21 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes present]
- [ ] CHK-036 [P1] Coverage summary reports 23/23 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
- [ ] CHK-037 [P2] PHASE-002 through PHASE-005 sandbox folders are confirmed removed or quarantined after evidence capture [EVIDENCE: directory listing or cleanup log]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets or credentials were added to phase-016 documents [EVIDENCE: doc-only content derived from playbook and feature catalog; no secret literals in any of the four files]
- [x] CHK-041 [P0] 113 bulk-delete coverage uses `specs/test-sandbox` or equivalent disposable scope only; no production memory folders are targeted [EVIDENCE: plan.md Phase 3 113 step specifies disposable scope]
- [x] CHK-042 [P1] 139 and 149 malformed/thin memory files are kept outside active production memory folders except when the test explicitly audits the active corpus [EVIDENCE: plan.md Phase 3 139 and 149 steps include scope boundary]
- [ ] CHK-043 [P2] Evidence logs from watcher tests (099) do not include raw absolute paths from non-sandbox directories [EVIDENCE: evidence review confirms path sanitization]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook prompts and feature catalog entries for the 23 phase-016 scenarios]
- [ ] CHK-051 [P0] All four phase documents are synchronized: scenario names, prompts, and acceptance criteria are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-052 [P1] Open question about promoting 139 to the main scenario table is acknowledged and tracked [EVIDENCE: open question entry present in spec.md]
- [ ] CHK-053 [P1] Open question about adding a dedicated PHASE-005 catalog leaf is acknowledged and tracked [EVIDENCE: open question entry present in spec.md]
- [ ] CHK-054 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `016-tooling-and-scripts/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `016-tooling-and-scripts/` during packet setup [EVIDENCE: directory listing confirms four files]
- [ ] CHK-061 [P1] No unrelated files were added outside the `016-tooling-and-scripts/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-062 [P2] Memory save was triggered after phase packet creation to make tooling-and-scripts context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 10 | 0/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
