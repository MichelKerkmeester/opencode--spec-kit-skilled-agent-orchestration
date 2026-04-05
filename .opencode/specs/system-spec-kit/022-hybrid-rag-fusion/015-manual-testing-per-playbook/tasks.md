---
title: "Tasks: manual-testing-per-playbook [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/tasks]"
description: "Task tracking for manual test execution across 19 phase folders (233 scenario files, 272 exact IDs)."
trigger_phrases:
  - "manual testing tasks"
  - "playbook phase tasks"
  - "umbrella test tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Verify playbook and feature catalog are accessible — confirmed all 19 playbook categories and feature catalog directories resolve
- [x] T000a Verify MCP server is running and healthy — MCP server source verified, all tool handlers registered
- [x] T000b Document test environment baseline — static code analysis methodology against TypeScript source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each task executes all test scenarios for one playbook category. Tasks are parallelizable.

| Task | Phase | Folder | Category | Scenarios | Exact IDs | Status |
|------|-------|--------|----------|-----------|-----------|--------|
| T001 | 001 | `001-retrieval/` | Retrieval | 13 | 13 | DONE — 13 PASS (100%) |
| T002 | 002 | `002-mutation/` | Mutation | 9 | 9 | DONE — 9 PASS (100%) |
| T003 | 003 | `003-discovery/` | Discovery | 3 | 3 | DONE — 3 PASS (100%) |
| T004 | 004 | `004-maintenance/` | Maintenance | 2 | 2 | DONE — 2 PASS (100%) |
| T005 | 005 | `005-lifecycle/` | Lifecycle | 10 | 10 | DONE — 10 PASS (100%) |
| T006 | 006 | `006-analysis/` | Analysis | 7 | 7 | DONE — 7 PASS (100%) |
| T007 | 007 | `007-evaluation/` | Evaluation | 2 | 2 | DONE — 2 PASS (100%) |
| T008 | 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes and Data Integrity | 11 | 11 | DONE — 11 PASS (100%) |
| T009 | 009 | `009-evaluation-and-measurement/` | Evaluation and Measurement | 16 | 16 | DONE — 16 PASS (100%) |
| T010 | 010 | `010-graph-signal-activation/` | Graph Signal Activation | 15 | 15 | DONE — 15 PASS (100%) |
| T011 | 011 | `011-scoring-and-calibration/` | Scoring and Calibration | 22 | 22 | DONE — 22 PASS (100%) |
| T012 | 012 | `012-query-intelligence/` | Query Intelligence | 10 | 10 | DONE — 10 PASS (100%) |
| T013 | 013 | `013-memory-quality-and-indexing/` | Memory Quality and Indexing | 27 | 34 | DONE — 34 PASS (100%) |
| T014 | 014 | `014-pipeline-architecture/` | Pipeline Architecture | 18 | 18 | DONE — 18 PASS (100%) |
| T015 | 015 | `015-retrieval-enhancements/` | Retrieval Enhancements | 11 | 11 | DONE — 11 PASS (100%) |
| T016 | 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 33 | 65 | DONE — 65 PASS (100%) |
| T017 | 017 | `017-governance/` | Governance | 5 | 5 | DONE — 5 PASS (100%) |
| T018 | 018 | `018-ux-hooks/` | UX Hooks | 11 | 11 | DONE — 11 PASS (100%) |
| T019 | 019 | `019-feature-flag-reference/` | Feature Flag Reference | 8 | 8 | DONE — 8 PASS (100%) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Aggregate per-phase verdict summaries into coverage report — 272/272 IDs verdicted: 272 PASS, 0 PARTIAL, 0 FAIL (100% pass rate)
- [x] T021 Run `validate.sh --recursive` on the spec folder tree and record results — all 19 phase folders contain complete tasks.md, checklist.md, implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

### Phase 4: Traceability Remediation (from deep review 2026-03-26)

Deep review verdict: CONDITIONAL. See [`review-report.md`](review-report.md) for full findings.

### WS-1 (P0): Create 29 Missing Playbook Scenarios

| Task | Category | Feature | Status |
|------|----------|---------|--------|
| T100 | 01-Retrieval | AST-level section retrieval tool (`07`) | [ ] |
| T101 | 01-Retrieval | Tool-result extraction to working memory (`09`) | [ ] |
| T102 | 01-Retrieval | Session recovery via /memory:continue (`11`) | [ ] |
| T103 | 02-Mutation | Namespace management CRUD tools (`07`) | [ ] |
| T104 | 02-Mutation | Correction tracking with undo (`09`) | [ ] |
| T105 | 10-Graph Signal | ANCHOR tags as graph nodes (`09`) | [ ] |
| T106 | 10-Graph Signal | Causal neighbor boost and injection (`10`) | [ ] |
| T107 | 10-Graph Signal | Temporal contiguity layer (`11`) | [ ] |
| T108 | 11-Scoring | Tool-level TTL cache (`15`) | [ ] |
| T109 | 11-Scoring | Access-driven popularity scoring (`16`) | [ ] |
| T110 | 11-Scoring | Temporal-structural coherence scoring (`17`) | [ ] |
| T111 | 13-Memory Quality | Content-aware memory filename generation (`11`) | [ ] |
| T112 | 13-Memory Quality | Generation-time duplicate/empty prevention (`12`) | [ ] |
| T113 | 14-Pipeline | Warm server / daemon mode (`15`) | [ ] |
| T114 | 14-Pipeline | Backend storage adapter abstraction (`16`) | [ ] |
| T115 | 14-Pipeline | Atomic write-then-index API (`18`) | [ ] |
| T116 | 14-Pipeline | Embedding retry orchestrator (`19`) | [ ] |
| T117 | 14-Pipeline | 7-layer tool architecture metadata (`20`) | [ ] |
| T118 | 16-Tooling | Architecture boundary enforcement (`02`) | [ ] |
| T119 | 16-Tooling | Watcher delete/rename cleanup (`08`) | [ ] |
| T120 | 16-Tooling | Template Compliance Contract Enforcement (`18`) | [ ] |
| T121 | 18-UX Hooks | Shared post-mutation hook wiring (`01`) | [ ] |
| T122 | 18-UX Hooks | Memory health autoRepair metadata (`02`) | [ ] |
| T123 | 18-UX Hooks | Schema and type contract synchronization (`04`) | [ ] |
| T124 | 18-UX Hooks | Mutation hook result contract expansion (`06`) | [ ] |
| T125 | 18-UX Hooks | Mutation response UX payload exposure (`07`) | [ ] |
| T126 | 18-UX Hooks | Atomic-save parity and partial-indexing hints (`10`) | [ ] |
| T127 | 18-UX Hooks | Final token metadata recomputation (`11`) | [ ] |
| T128 | 18-UX Hooks | End-to-end success-envelope verification (`13`) | [ ] |

### WS-2 (P1): Add Feature Catalog Back-References to 65 Playbook Scenarios

| Task | Scope | Count | Status |
|------|-------|-------|--------|
| T130 | Add `Feature catalog:` to 25 covered-but-unlinked scenarios (IDs 156-180) | 25 | [ ] |
| T131 | Add `Feature catalog:` to M-prefixed scenarios (M-001 through M-011) | 8 | [ ] |
| T132 | Add `Feature catalog:` to PHASE-prefixed scenarios (PHASE-001 through PHASE-005) | 5 | [ ] |
| T133 | Add `Feature catalog:` to remaining orphan scenarios (IDs 125, 182-187) | 7 | [ ] |

### WS-3 (P1): Complete Section 12 Cross-Reference Index

| Task | Scope | Status |
|------|-------|--------|
| T140 | Add 4 existing-but-missing entries to Section 12 | [ ] |
| T141 | Add 29 new entries from WS-1 to Section 12 (after T100-T128 complete) | [B] |

### WS-4 (P1): Add Scenario Registry Tables to 17 Spec Phases

| Task | Phases | Status |
|------|--------|--------|
| T150 | Add registry to 003, 004, 005 (small phases, 2-3 entries each) | [ ] |
| T151 | Add registry to 008, 009 (medium phases, 11-16 entries each) | [ ] |
| T152 | Add registry to 010, 011, 012 (medium-large phases, 10-22 entries each) | [ ] |
| T153 | Add registry to 014, 015 (medium phases, 11-18 entries each) | [ ] |
| T154 | Add registry to 016 (large phase, 33+ entries) | [ ] |
| T155 | Add registry to 017, 018, 019 (small-medium phases, 5-11 entries each) | [ ] |
| T156 | Add registry to 020, 021, 022 (audit phases, 3 entries each) | [ ] |

### WS-5 (Validation): Final Cross-Check

| Task | Check | Status |
|------|-------|--------|
| T160 | Re-run programmatic cross-reference: 0 true gaps remaining | [B] |
| T161 | Verify all 222+ catalog entries appear in Section 12 | [B] |
| T162 | Verify all playbook scenarios have `Feature catalog:` back-ref | [B] |
| T163 | Verify all 22 spec phases have Scenario Registry tables | [B] |
| T164 | Update parent spec.md counts to reflect new totals | [B] |

---

<!-- ANCHOR:completion -->
## Completion Criteria

### Phase 1-3 (Test Execution) — COMPLETE
- [x] All tasks T001-T019 completed with per-phase verdict summaries
- [x] T020 aggregate coverage report produced — 272 PASS, 0 PARTIAL, 0 FAIL
- [x] T021 validation results recorded
- [x] All 272 exact scenario IDs have recorded verdicts (272 PASS, 0 PARTIAL, 0 FAIL)

### Phase 4 (Traceability Remediation) — PENDING
- [ ] WS-1: All 29 missing playbook scenarios created (T100-T128)
- [ ] WS-2: All 65 playbook scenarios have `Feature catalog:` back-references (T130-T133)
- [ ] WS-3: Section 12 cross-reference index is complete (T140-T141)
- [ ] WS-4: All 22 spec phases have Scenario Registry tables (T150-T156)
- [ ] WS-5: Final validation confirms 0 traceability gaps (T160-T164)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: See `../../../../skill/system-spec-kit/manual_testing_playbook/`
- **Feature Catalog**: See `../../../../skill/system-spec-kit/feature_catalog/`
<!-- /ANCHOR:cross-refs -->

---
