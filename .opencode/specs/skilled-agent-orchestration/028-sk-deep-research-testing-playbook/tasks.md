---
title: "Tasks: sk-deep-research Manual Testing Playbook [03--commands-and-skills/028-sk-deep-research-testing-playbook/tasks]"
description: "Task format: T### Description (target path)"
trigger_phrases:
  - "deep research playbook tasks"
  - "manual testing playbook tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: sk-deep-research Manual Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### Description (target path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Review the live `sk-deep-research` command, skill, README, references, assets, and Codex agent definition (`spec.md`, `plan.md`)
- [x] T002 Confirm the current `sk-doc` testing-playbook contract and template bundle (`spec.md`, `plan.md`)
- [x] T003 Confirm `.opencode/skill/sk-deep-research/` has no `manual_testing_playbook/` or `feature_catalog/` package (`spec.md`)
- [x] T004 Freeze the approved 19-scenario file map, category names, and scenario coverage in the spec packet (`spec.md`, `plan.md`)
- [ ] T005 Create the root playbook file under `manual_testing_playbook/`
- [ ] T006 Create `01--entry-points-and-modes/`
- [ ] T007 Create `02--initialization-and-state-setup/`
- [ ] T008 Create `03--iteration-execution-and-state-discipline/`
- [ ] T009 Create `04--convergence-and-recovery/`, `05--pause-resume-and-fault-tolerance/`, and `06--synthesis-save-and-guardrails/`
- [ ] T010 Build a scenario-to-source matrix covering all `DR-001` through `DR-019` files (`manual_testing_playbook/` package)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Write the root overview, realistic test model, and coverage note (root playbook file)
- [ ] T012 Write global preconditions, evidence requirements, and deterministic command notation (root playbook file)
- [ ] T013 Write integrated review protocol and release-readiness rules (root playbook file)
- [ ] T014 Write orchestration and wave-planning guidance with live-vs-reference-only notes (root playbook file)
- [ ] T015 Write 6 category summaries plus the explicit "no feature catalog yet" cross-reference section (root playbook file)
- [ ] T016 [P] Author `DR-001` through `DR-004` in `manual_testing_playbook/01--entry-points-and-modes/`
- [ ] T017 [P] Author `DR-005` through `DR-007` in `manual_testing_playbook/02--initialization-and-state-setup/`
- [ ] T018 [P] Author `DR-008` through `DR-010` in `manual_testing_playbook/03--iteration-execution-and-state-discipline/`
- [ ] T019 [P] Author `DR-011` through `DR-013` in `manual_testing_playbook/04--convergence-and-recovery/`
- [ ] T020 [P] Author `DR-014` through `DR-016` in `manual_testing_playbook/05--pause-resume-and-fault-tolerance/`
- [ ] T021 [P] Author `DR-017` through `DR-019` in `manual_testing_playbook/06--synthesis-save-and-guardrails/`
- [ ] T022 Synchronize prompt text, expected signals, and evidence rules between the root summaries and per-feature execution tables (`manual_testing_playbook/`)
- [ ] T023 Add explicit source anchors and failure triage for every feature file (`manual_testing_playbook/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Validate the root playbook with `validate_document.py` (root playbook file)
- [ ] T025 Run link, path, and feature-count parity sweeps across the package (`manual_testing_playbook/`)
- [ ] T026 Spot-check prompt synchronization and live-vs-reference-only wording in category files (`manual_testing_playbook/`)
- [ ] T027 Record validation evidence and handoff notes for the playbook implementation (`manual_testing_playbook/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] The root playbook exists and follows the integrated `sk-doc` contract
- [ ] All 19 per-feature files exist under the 6 approved category folders
- [ ] No feature catalog is handled explicitly without invented links
- [ ] Root validation and manual cross-file sweeps pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

### AI Execution Protocol

#### Pre-Task Checklist
- [x] Read the packet before editing implementation docs
- [x] Verify the 19-scenario and 6-category plan stays intact

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete the root playbook before finalizing per-feature prompts |
| TASK-SCOPE | Only modify the approved playbook package and evidence locations |
| TASK-ID | Preserve `DR-001` through `DR-019` ordering exactly |

#### Status Reporting Format
Report: `T### [STATUS] - description`

#### Blocked Task Protocol
If a task is BLOCKED, record the blocker and pause downstream scenario work.

---

<!--
Task breakdown for the approved playbook implementation.
Phase 1 is complete because this spec packet has already locked the contract and inventory.
-->
