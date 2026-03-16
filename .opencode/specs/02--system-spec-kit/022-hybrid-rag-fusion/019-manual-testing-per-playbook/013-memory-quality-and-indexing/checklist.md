---
title: "Verification Checklist: manual-testing-per-playbook memory quality and indexing phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 013 memory-quality-and-indexing manual tests covering NEW-039 through NEW-048, NEW-069, NEW-073, NEW-111, NEW-119, NEW-131, NEW-132, NEW-133, and M-001 through M-008."
trigger_phrases:
  - "memory quality checklist"
  - "phase 013 verification"
  - "indexing checklist"
  - "M-001 M-002 M-003 M-004 M-005 M-006 M-007 M-008 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook memory quality and indexing phase

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

- [x] CHK-001 [P0] Scope is locked to 25 memory-quality-and-indexing scenarios (NEW-039 through NEW-048, NEW-069, NEW-073, NEW-111, NEW-119, NEW-131, NEW-132, NEW-133, M-001 through M-008) with no out-of-category scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 25 rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted from `../../manual_testing_playbook/manual_testing_playbook.md` for all 25 scenarios [EVIDENCE: testing strategy table in `plan.md` matches playbook rows]
- [x] CHK-003 [P0] Feature catalog links for NEW-039 through NEW-048 point to files under `../../feature_catalog/13--memory-quality-and-indexing/` numbered 01 through 10 [EVIDENCE: spec.md scope table feature catalog column]
- [x] CHK-004 [P0] Feature catalog links for NEW-069, NEW-073, NEW-111, and NEW-133 point to `13-entity-normalization-consolidation.md`, `14-quality-gate-timer-persistence.md`, `15-deferred-lexical-only-indexing.md`, and `16-dry-run-preflight-for-memory-save.md` respectively [EVIDENCE: spec.md scope table]
- [x] CHK-005 [P0] NEW-119, NEW-131, and NEW-132 are all mapped to `04-spec-folder-description-discovery.md` with explicit rationale for the cross-reference alignment [EVIDENCE: spec.md scope table mapping-note column]
- [x] CHK-006 [P0] M-001 through M-004 are mapped to nearest-category feature files with an explicit source-backed judgment note explaining why no dedicated catalog row exists [EVIDENCE: spec.md scope table mapping-note column for each M-series row]
- [x] CHK-007 [P0] M-005 maps to `17-outsourced-agent-memory-capture.md` and M-006 maps to `18-stateless-enrichment-and-alignment-guards.md` as direct user-provided mappings [EVIDENCE: spec.md scope table]
- [x] CHK-008 [P0] M-007 maps to `18-stateless-enrichment-and-alignment-guards.md` with rationale covering stateless enrichment, alignment, capture quality, and indexing readiness; M-007 open-question cross-reference to NEW-133 is noted [EVIDENCE: spec.md scope table mapping-note]
- [x] CHK-009 [P0] M-008 maps to `../../feature_catalog/02--mutation/10-per-memory-history-log.md` as a cross-category mapping with explicit rationale [EVIDENCE: spec.md scope table]
- [ ] CHK-010 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents (spec.md, plan.md, tasks.md, checklist.md) [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in each file]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] NEW-039 documents the verify-fix-verify retry-then-reject loop behavior with pass criterion: retries up to max attempts then rejects with reason [EVIDENCE: spec.md REQ-001, plan.md testing strategy row]
- [x] CHK-021 [P0] NEW-040 documents the signal vocabulary expansion with pass criterion: >=3 signal categories correctly classified from varied prompts [EVIDENCE: spec.md REQ-002, plan.md testing strategy row]
- [x] CHK-022 [P0] NEW-041 documents pre-flight token budget validation with pass criterion: save-time preflight returns expected warning/failure result without indexing side effects [EVIDENCE: spec.md REQ-003, plan.md testing strategy row]
- [x] CHK-023 [P0] NEW-042 documents the 11-sub-check description.json discovery scenario (create, stale detection, per-folder, mixed aggregation, corrupt crash guard, metadata repair, missing-file fallback, traversal rejection, CRLF frontmatter, folder routing, valid JSON output) [EVIDENCE: spec.md REQ-004]
- [x] CHK-024 [P0] NEW-043 documents the 3-layer pre-storage quality gate with pass criterion: each failure class triggers correct layer with appropriate warn/reject and decision log complete [EVIDENCE: spec.md REQ-005, plan.md testing strategy row]
- [x] CHK-025 [P0] NEW-044 documents reconsolidation thresholds: merge at >=0.88, supersede at 0.75-0.88, independent below 0.75 [EVIDENCE: spec.md REQ-006, plan.md testing strategy row]
- [x] CHK-026 [P0] NEW-045 documents smarter memory content generation with pass criterion: structure preserved, output <=2x input density, sections coherent [EVIDENCE: spec.md REQ-007, plan.md testing strategy row]
- [x] CHK-027 [P0] NEW-046 documents anchor-aware chunk thinning with pass criterion: all anchor chunks retained, filler removed, retained set non-empty [EVIDENCE: spec.md REQ-008, plan.md testing strategy row]
- [x] CHK-028 [P0] NEW-047 documents encoding-intent capture with pass criterion: correct intent label assigned per content type, labels immutable after save [EVIDENCE: spec.md REQ-009, plan.md testing strategy row]
- [x] CHK-029 [P0] NEW-048 documents auto entity extraction with pass criterion: entities extracted, normalized, persisted; denylist items absent [EVIDENCE: spec.md REQ-010, plan.md testing strategy row]
- [x] CHK-030 [P0] NEW-069 documents entity normalization consolidation with pass criterion: extractor and linker produce identical normalized entities for all test inputs including unicode [EVIDENCE: spec.md REQ-011]
- [x] CHK-031 [P0] NEW-073 documents quality gate timer persistence with pass criterion: activation timestamp persists across restart and quality gate honors the original timer [EVIDENCE: spec.md REQ-012]
- [x] CHK-032 [P0] NEW-111 documents deferred lexical-only indexing with pass criterion: embedding failure falls back to lexical-only, BM25 search works, reindex recovers full embedding [EVIDENCE: spec.md REQ-013]
- [x] CHK-033 [P0] NEW-119 documents memory filename collision resolution with pass criterion covering -1 suffix, exhausting -1..-100 producing 12-hex random fallback, repeated fallback distinctness, memorySequence coercion, and memoryNameHistory tracking [EVIDENCE: spec.md REQ-014]
- [x] CHK-034 [P0] NEW-131 documents batch backfill validation with pass criterion: description.json coverage matches active spec inventory, all files are valid JSON, C1 field-type checks pass, per-folder preferred over spec.md fallback [EVIDENCE: spec.md REQ-015]
- [x] CHK-035 [P0] NEW-132 documents description.json schema field validation with pass criterion: all 9 fields present with exact string/array-of-strings/number matrix, save updates sequence/history, regeneration repairs corrupted fields [EVIDENCE: spec.md REQ-016]
- [x] CHK-036 [P0] NEW-133 documents dry-run preflight with pass criterion: dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, rich non-dry-run save makes record searchable [EVIDENCE: spec.md REQ-017]
- [x] CHK-037 [P0] M-001 through M-004 are documented as mandatory Spec Kit Memory flows with playbook-source commands and nearest-category feature links [EVIDENCE: spec.md REQ-018 through REQ-021, plan.md testing strategy rows]
- [x] CHK-038 [P0] M-005 documents the outsourced agent memory capture round-trip with pass criterion: saved memory from outsourced agent session is searchable and contains session summary, files modified, and decisions [EVIDENCE: spec.md REQ-022]
- [x] CHK-039 [P0] M-006 documents stateless enrichment and alignment guardrails with pass criterion: stateless save succeeds for matching files, emits provenance-backed context, and blocks unrelated captures when overlap is genuinely low [EVIDENCE: spec.md REQ-023]
- [x] CHK-040 [P0] M-007 documents the full session-capturing pipeline closure suite including all ten sub-scenarios (M-007a through M-007j) covering JSON authority, stateless enrichment, native fallback chain, quality calibration, indexing readiness, insufficiency gate, alignment block, enrichment contract, OpenCode precedence, and NO_DATA_AVAILABLE behavior [EVIDENCE: spec.md REQ-024]
- [x] CHK-041 [P0] M-008 documents direct manual verification of per-memory history log behavior as a cross-category feature-09 gap closure scenario [EVIDENCE: spec.md REQ-025]
- [ ] CHK-042 [P1] Destructive scenarios (NEW-042, NEW-043, NEW-044, NEW-111, NEW-119, NEW-132, M-003, M-005, M-006, M-007, M-008) are explicitly flagged for sandbox-only execution in both spec.md and plan.md Phase 3 [EVIDENCE: plan.md Phase 3 step and risks table]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-050 [P0] All 14 non-destructive scenarios have been executed and raw evidence is captured: NEW-039, NEW-040, NEW-041, NEW-045, NEW-046, NEW-047, NEW-048, NEW-069, NEW-073, NEW-131, NEW-133, M-001, M-002, M-004 [EVIDENCE: execution logs attached]
- [ ] CHK-051 [P0] All 11 destructive/sandboxed scenarios have been executed in isolated environments and raw evidence is captured: NEW-042, NEW-043, NEW-044, NEW-111, NEW-119, NEW-132, M-003, M-005, M-006, M-007, M-008 [EVIDENCE: execution logs and sandbox teardown confirmation attached]
- [ ] CHK-052 [P0] Each of the 25 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-053 [P0] NEW-042 sandbox was fully cleaned up after execution: no stale description.json, temp files, or corrupted metadata remain in shared spec folders [EVIDENCE: directory listing or git status after sandbox teardown]
- [ ] CHK-054 [P0] M-007 ten sub-scenarios (a through j) each have distinct evidence traces and no sub-scenario's partial evidence is counted as a full PASS for the parent scenario [EVIDENCE: sub-scenario verdict table]
- [ ] CHK-055 [P1] Coverage summary reports 25/25 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
- [ ] CHK-056 [P1] NEW-073 timer persistence evidence includes a service-restart comparison showing the activation timestamp survives the restart [EVIDENCE: before/after restart artifact]
- [ ] CHK-057 [P1] NEW-111 evidence captures both the lexical-only fallback state (BM25 searchable) and the recovery state after reindexing restores full embedding [EVIDENCE: two-phase evidence artifact]
- [ ] CHK-058 [P2] M-007j NO_DATA_AVAILABLE verdict evidence is captured separately from earlier M-007 sub-scenarios to prevent cross-contamination of evidence [EVIDENCE: isolated sub-scenario log]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-060 [P0] No secrets or credentials were added to Phase 013 documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-061 [P0] Destructive scenarios are scoped to disposable sandboxes and `/tmp` paths; no instructions reference shared production spec folders for corruption, collision, or forced-save tests [EVIDENCE: plan.md Phase 3 and risks table]
- [ ] CHK-062 [P1] NEW-119 filename collision evidence capture does not log internal filesystem paths that expose workspace layout [EVIDENCE: evidence artifact uses relative paths or redacted absolute paths]
- [ ] CHK-063 [P1] M-007 evidence artifacts from stateless enrichment and alignment block sub-scenarios do not contain raw API keys, tokens, or backend credentials [EVIDENCE: evidence review before archiving]
- [ ] CHK-064 [P2] The canonical sandbox spec folder selected for NEW-042, NEW-131, and NEW-132 is documented and confirmed disposable before execution begins [EVIDENCE: open question T013 resolved]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-070 [P0] spec.md, plan.md, tasks.md, and checklist.md contain no template placeholder text [EVIDENCE: all content is derived from playbook rows and feature catalog for all 25 Phase 013 scenarios]
- [ ] CHK-071 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, tasks, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-072 [P0] The 25 REQ IDs in spec.md, the 25 testing strategy rows in plan.md, and the 25 execution tasks in tasks.md reference the same set of test IDs with no gaps or duplicates [EVIDENCE: cross-document ID reconciliation]
- [ ] CHK-073 [P1] Open questions in spec.md (sandbox selection, M-001 through M-004 catalog backfill decision) are resolved or have an explicit deferral note before phase execution begins [EVIDENCE: spec.md open questions section updated or tasks T013/T014 completed]
- [ ] CHK-074 [P1] `implementation-summary.md` is created when all 25 scenarios are executed and verified [EVIDENCE: file present in `013-memory-quality-and-indexing/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-080 [P1] Only the four phase documents (spec.md, plan.md, tasks.md, checklist.md) were created in `013-memory-quality-and-indexing/` at this stage [EVIDENCE: directory listing confirms four files]
- [ ] CHK-081 [P1] No unrelated files were added outside the `013-memory-quality-and-indexing/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-082 [P2] Memory save was triggered after phase packet creation to make Phase 013 context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 0/28 |
| P1 Items | 12 | 0/12 |
| P2 Items | 4 | 0/4 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
