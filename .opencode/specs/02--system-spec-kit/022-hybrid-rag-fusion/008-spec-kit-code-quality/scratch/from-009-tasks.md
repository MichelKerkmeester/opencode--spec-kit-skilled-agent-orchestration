---
title: "Tasks: Spec Kit Code Quality Initiative [009-spec-kit-code-quality/tasks.md]"
description: "Execution-ready task list for full review coverage, KISS+DRY hotspot refactors, README/HVR modernization, standards propagation, and final verification."
trigger_phrases:
  - "tasks"
  - "phase 009"
  - "quality initiative"
  - "refactor checklist"
SPECKIT_TEMPLATE_SOURCE: "tasks-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Spec Kit Code Quality Initiative

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline and Coverage Matrix

- [x] T001 Capture baseline verification outputs (`.opencode/skill/system-spec-kit/mcp_server`). [EVIDENCE: `scratch/verification-log.md`]
- [x] T002 Build full in-scope review matrix (`.opencode/skill/system-spec-kit/` and `mcp_server/`). [EVIDENCE: `scratch/review-summary.md`]
- [x] T003 Define hotspot scoring rubric for bloated files (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-spec-kit-code-quality/scratch/`). [EVIDENCE: `scratch/review-summary.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Full-Scope Code Review (Using `sk-code--review` + `sk-code--opencode`)

- [x] T004 Review `mcp_server/handlers` and document findings severity (`.opencode/skill/system-spec-kit/mcp_server/handlers/`). [EVIDENCE: `scratch/review-summary.md`]
- [x] T005 [P] Review `mcp_server/lib` search/parsing/storage modules (`.opencode/skill/system-spec-kit/mcp_server/lib/`). [EVIDENCE: `scratch/review-summary.md`]
- [x] T006 [P] Review `mcp_server/tests` reliability and coverage risks (`.opencode/skill/system-spec-kit/mcp_server/tests/`). [EVIDENCE: `scratch/review-summary.md`]
- [x] T007 [P] Review root scripts and utilities for bloated logic (`.opencode/skill/system-spec-kit/scripts/`). [EVIDENCE: `scratch/review-summary.md`]
- [x] T008 Consolidate findings into prioritized hotspot queue (`tasks.md` + `decision-record.md`). [EVIDENCE: `scratch/review-summary.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: KISS+DRY Refactor Plan and Execution

- [x] T009 Select top hotspot candidates with lowest-risk/high-impact profile. [EVIDENCE: `scratch/review-summary.md`]
- [x] T010 Implement bounded modular splits for selected TS/JS handlers/scripts. [EVIDENCE: `scripts/spec/archive.sh`, `mcp_server/lib/storage/transaction-manager.ts`]
- [x] T011 Implement deduplication improvements in shell/python utilities where safe. [EVIDENCE: `scripts/spec/create.sh`, `scripts/setup/check-prerequisites.sh`]
- [x] T012 Run targeted tests/lint after each refactor batch. [EVIDENCE: `scratch/verification-log.md`]
- [x] T013 Record refinement opportunities discovered during implementation. [EVIDENCE: `scratch/review-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: README Modernization and HVR Alignment

- [x] T014 Generate in-scope README inventory with explicit exclusions. [EVIDENCE: `scratch/readme-audit.json`]
- [x] T015 Update each in-scope README to the latest workflow template structure. [EVIDENCE: `scratch/readme-audit.md` (no-delta required)]
- [x] T016 Apply HVR style/voice alignment and clarity improvements. [EVIDENCE: `scratch/readme-audit.json` (`template_invalid=0`, `template_warnings=0`)]
- [x] T017 Verify vendor/generated README files remain untouched. [EVIDENCE: `scratch/readme-audit.md`]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: `sk-code--opencode` Standards Propagation (Conditional)

- [x] T018 Compare implemented patterns against existing standards artifacts. [EVIDENCE: `scratch/review-summary.md`]
- [x] T019 Update `SKILL.md`, references, assets, index, and nodes if required. [EVIDENCE: `.opencode/skill/sk-code--opencode/SKILL.md`, `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`, `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`]
- [x] T020 Record evidence for either updates applied or no-delta outcome. [EVIDENCE: `scratch/review-summary.md`]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Final Verification and Spec Closure

- [x] T021 Execute full verification command matrix from `plan.md`. [EVIDENCE: `scratch/verification-log.md`]
- [x] T022 Resolve all P0 checklist items and capture evidence links. [EVIDENCE: `checklist.md`]
- [x] T023 Run spec validation for this phase folder. [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-spec-kit-code-quality`]
- [x] T024 Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. [EVIDENCE: this update set]
- [x] T025 Publish concise closure summary and blockers/deferred items. [EVIDENCE: `scratch/review-summary.md`]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements are implemented and verified.
- [x] No unresolved `[B]` blocked task remains.
- [x] Verification matrix is complete and reproducible.
- [x] Spec validation returns no errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
