---
title: "Verification Checklist: manual-testing-per-playbook pipeline-architecture phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 014 pipeline-architecture manual tests covering NEW-049 through NEW-146 (18 scenarios spanning 4-stage pipeline flow, scoring safeguards, runtime safety, DB coordination, and lineage recovery)."
trigger_phrases:
  - "pipeline architecture checklist"
  - "phase 014 verification"
  - "manual pipeline architecture checklist"
  - "NEW-049 NEW-050 NEW-051 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook pipeline-architecture phase

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

- [x] CHK-001 [P0] Scope is locked to 18 pipeline-architecture scenarios (NEW-049, NEW-050, NEW-051, NEW-052, NEW-053, NEW-054, NEW-067, NEW-071, NEW-076, NEW-078, NEW-080, NEW-087, NEW-095, NEW-112, NEW-115, NEW-129, NEW-130, NEW-146) with no out-of-category scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 18 rows]
- [x] CHK-002 [P0] Exact prompts and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` for all 18 scenarios [EVIDENCE: testing-strategy table in `plan.md` matches playbook rows for all 18 IDs]
- [x] CHK-003 [P0] Feature catalog links for all 18 scenarios point to the correct `14--pipeline-architecture/` files, including shared lineage coverage for NEW-129 and NEW-130 [EVIDENCE: spec.md scope table links the correct feature file for each scenario]
- [x] CHK-004 [P0] The 18-scenario count is resolved: the original 17 explicit IDs plus NEW-146 (recovered from category cross-reference) are all present [EVIDENCE: spec.md open questions section documents the mismatch and resolution]
- [ ] CHK-005 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] NEW-049 documents 4-stage pipeline sequencing with the prompt `Trace one query through all 4 stages.` and PASS criteria (all 4 stages execute; stage-4 scores unchanged) [EVIDENCE: spec.md REQ-NEW-049 and plan.md testing-strategy table]
- [x] CHK-011 [P0] NEW-050 documents MPAB chunk-to-memory aggregation with the prompt `Verify MPAB chunk aggregation (R1).` and PASS criteria (computed score matches manual calculation within 0.001 tolerance) [EVIDENCE: spec.md REQ-NEW-050 and plan.md testing-strategy table]
- [x] CHK-012 [P0] NEW-051 documents chunk ordering preservation with the prompt `Validate chunk ordering preservation (B2).` and PASS criteria (marker sequence in collapsed output matches original save order) [EVIDENCE: spec.md REQ-NEW-051 and plan.md testing-strategy table]
- [x] CHK-013 [P0] NEW-052 documents template anchor optimization with the prompt `Verify template anchor optimization (S2).` and PASS criteria (anchor metadata present; scores identical with/without enrichment) [EVIDENCE: spec.md REQ-NEW-052 and plan.md testing-strategy table]
- [x] CHK-014 [P0] NEW-053 documents validation signals as retrieval metadata with the prompt `Validate S3 retrieval metadata weighting.` and PASS criteria (all multipliers in [0.8, 1.2]; zero validations = 1.0) [EVIDENCE: spec.md REQ-NEW-053 and plan.md testing-strategy table]
- [x] CHK-015 [P0] NEW-054 documents learned relevance feedback with the prompt `Verify learned relevance feedback (R11).` and PASS criteria (triggers learned only with queryId; safeguard limits enforced) [EVIDENCE: spec.md REQ-NEW-054 and plan.md testing-strategy table]
- [x] CHK-016 [P0] NEW-067 documents search pipeline safety with the prompt `Validate search pipeline safety bundle.` and PASS criteria (pipeline handles summary/lexical heavy queries with correct filtering and tokenization) [EVIDENCE: spec.md REQ-NEW-067 and plan.md testing-strategy table]
- [x] CHK-017 [P0] NEW-071 documents performance improvements with the prompt `Verify performance improvements (Sprint 8).` and PASS criteria (optimized paths active; heavy query timing shows no regressions) [EVIDENCE: spec.md REQ-NEW-071 and plan.md testing-strategy table]
- [x] CHK-018 [P0] NEW-076 documents activation window persistence with the prompt `Verify activation window persistence.` and PASS criteria (timestamp survives restart; warn-only behavior maintained) [EVIDENCE: spec.md REQ-NEW-076 and plan.md testing-strategy table]
- [x] CHK-019 [P0] NEW-078 documents legacy V1 pipeline removal with the prompt `Verify legacy V1 removal.` and PASS criteria (zero V1 pipeline references; all queries use V2 exclusively) [EVIDENCE: spec.md REQ-NEW-078 and plan.md testing-strategy table]
- [x] CHK-020 [P0] NEW-080 is flagged as state-changing (pipeline and mutation hardening) with the prompt `Validate phase-017 pipeline and mutation hardening.` and PASS criteria (all mutation paths atomic; no partial state on error; cleanup complete) [EVIDENCE: spec.md REQ-NEW-080, plan.md Phase 3, and rollback plan]
- [x] CHK-021 [P0] NEW-087 documents DB_PATH extraction and import standardization with the prompt `Validate DB_PATH extraction/import standardization.` and PASS criteria (all entry points resolve the same DB path; env var precedence consistent) [EVIDENCE: spec.md REQ-NEW-087 and plan.md testing-strategy table]
- [x] CHK-022 [P0] NEW-095 documents strict Zod schema validation with the prompt `Validate SPECKIT_STRICT_SCHEMAS enforcement.` and PASS criteria (strict mode rejects unknown params; passthrough mode allows them) [EVIDENCE: spec.md REQ-NEW-095 and plan.md testing-strategy table]
- [x] CHK-023 [P0] NEW-112 is flagged as state-changing (cross-process DB hot rebinding) with the prompt `Validate cross-process DB hot rebinding via marker file.` and PASS criteria (server detects marker file; reinitializes DB; returns non-stale data; health is healthy) [EVIDENCE: spec.md REQ-NEW-112, plan.md Phase 3, and rollback plan]
- [x] CHK-024 [P0] NEW-115 is flagged as state-changing (transaction atomicity on rename failure) with the prompt `Simulate rename failure after DB commit and verify pending file survives` and PASS criteria (pending file survives; recovery function can find and process it) [EVIDENCE: spec.md REQ-NEW-115, plan.md Phase 3, and rollback plan]
- [x] CHK-025 [P0] NEW-129 documents lineage state active projection and asOf resolution with the prompt `Run the lineage state verification suite.` and PASS criteria (vitest suite passes; transcript shows valid and malformed lineage cases) [EVIDENCE: spec.md REQ-NEW-129 and plan.md testing-strategy table]
- [x] CHK-026 [P0] NEW-130 is flagged as state-changing (lineage backfill rollback drill) with the prompt `Run the lineage backfill + rollback verification suite.` and PASS criteria (vitest suite passes; execution and rollback evidence captured) [EVIDENCE: spec.md REQ-NEW-130, plan.md Phase 3, and rollback plan]
- [x] CHK-027 [P0] NEW-146 documents dynamic server instructions at MCP initialization with the prompt `Validate dynamic server instructions at MCP initialization.` and PASS criteria (enabled mode emits overview with counts/channels; disabled mode yields empty string) [EVIDENCE: spec.md REQ-NEW-146 and plan.md testing-strategy table]
- [ ] CHK-028 [P1] Destructive scenarios (NEW-080, NEW-112, NEW-115, NEW-130) carry explicit sandbox, checkpoint, and rollback guidance in `plan.md` Phase 3 [EVIDENCE: plan.md Phase 3 step lists checkpoint, mutated resource, and rollback evidence for each destructive scenario]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-040 [P0] All 14 non-destructive scenarios (NEW-049, NEW-050, NEW-051, NEW-052, NEW-053, NEW-054, NEW-067, NEW-071, NEW-076, NEW-078, NEW-087, NEW-095, NEW-129, NEW-146) have been executed and raw command outputs or transcripts are captured as evidence [EVIDENCE: execution logs attached]
- [ ] CHK-041 [P0] All 4 destructive scenarios (NEW-080, NEW-112, NEW-115, NEW-130) have been executed in disposable sandboxes and rollback evidence is captured [EVIDENCE: sandbox/checkpoint artifacts attached for each]
- [ ] CHK-042 [P0] Each of the 18 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-043 [P0] Coverage summary confirms 18/18 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
- [ ] CHK-044 [P1] Any PARTIAL or FAIL verdicts have triage notes that identify the failing acceptance check and link to the review protocol rule [EVIDENCE: triage notes in scenario evidence or scratch/]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] No secrets or credentials were added to pipeline-architecture phase documents [EVIDENCE: doc-only content; no secret literals in any of the four files]
- [x] CHK-051 [P0] Destructive scenario guidance does not instruct operators to apply mutations in shared or production environments [EVIDENCE: plan.md Phase 3 restricts all destructive scenarios to disposable sandboxes or isolated worktrees]
- [ ] CHK-052 [P1] DB_PATH and env var values used during NEW-087 and NEW-112 evidence capture are sanitized before attaching to phase documents [EVIDENCE: evidence notes confirm path sanitization applied]
- [ ] CHK-053 [P2] NEW-115 rename-failure simulation is confined to a disposable worktree so no production pending files are affected [EVIDENCE: worktree name and isolation evidence confirmed before scenario run]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows and feature catalog for the 18 pipeline-architecture scenarios]
- [ ] CHK-061 [P0] All four phase documents are synchronized: scenario names, prompts, and execution types are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-062 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `014-pipeline-architecture/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `014-pipeline-architecture/` [EVIDENCE: directory listing confirms four files]
- [ ] CHK-071 [P1] No unrelated files were added outside the `014-pipeline-architecture/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-072 [P2] Memory save was triggered after phase packet creation to make pipeline-architecture context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
