---
title: "Tasks: sk-deep-research Path Migration [skilled-agent-orchestration/035-sk-deep-research-path-migration/tasks]"
description: "Task Format: T### [P?] Description (file path or file family)"
trigger_phrases:
  - "deep-research migration tasks"
  - "research packet task breakdown"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/035-sk-deep-research-path-migration"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: sk-deep-research Path Migration

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

**Task Format**: `T### [P?] Description (file path or file family)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the target research and review packet layouts in `spec.md`, `plan.md`, and `decision-record.md`
- [x] T002 Freeze the no-`output/` rule and preserved review-report location (`spec.md`, `decision-record.md`)
- [x] T003 Enumerate migration surfaces across commands, skills, runtime agents, `system-spec-kit`, tests, and tracked packet corpus (`spec.md`, `plan.md`)
- [x] T004 Confirm the legacy-path whitelist and tracked corpus scope before implementation (`plan.md`, implementation evidence`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update research auto workflow paths to the `research/` packet root and research iteration folder (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- [x] T006 Update research confirm workflow paths to the `research/` packet root and research iteration folder (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`)
- [x] T007 Update review auto workflow logic so review iterations always land in `review/iterations/` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`)
- [x] T008 Update review confirm workflow logic so review iterations always land in `review/iterations/` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`)
- [x] T009 [P] Update the command entrypoint packet explanations (`.opencode/command/spec_kit/deep-research.md`)
- [x] T010 [P] Update canonical runtime packet guidance and parity surfaces touched in this migration
- [x] T011 [P] Update mirrored runtime agent guidance in the touched `.opencode` and `.claude` surfaces
- [x] T012 [P] Update `sk-deep-research` docs, references, assets, diagrams, and playbooks (`.opencode/skill/sk-deep-research/`)
- [x] T013 [P] Update `system-spec-kit` helper logic, docs, shell outputs, fixtures, and scoring or migration support for the new packet roots (`.opencode/skill/system-spec-kit/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Add and run targeted tests for artifact routing, memory type classification, folder scoring, and spec-doc indexing (`.opencode/skill/system-spec-kit/mcp_server/tests/`)
- [x] T015 Run command or workflow validation coverage for the touched command surfaces (`node scripts/tests/test-phase-command-workflows.js`, now 72/72)
- [x] T016 Build and run the migration utility over tracked `.opencode/specs/` packets (`.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts`)
- [x] T017 Run repo-wide path sweeps for stale canonical references (`find .opencode/specs ...` zero-count checks after migration)
- [x] T018 Validate the 035 packet with strict spec validation and confirm migrated corpus state with post-migration sweeps
- [x] T019 Update `implementation-summary.md` with implemented results, verification evidence, and residual risks once migration work is complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All migration tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Commands, skills, runtime agents, and helper logic agree on the same packet layout for the touched implementation surfaces
- [x] Tracked spec packets use the canonical research packet and review iteration structure in the migrated corpus
- [x] Verification evidence is recorded in `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture decisions**: See `decision-record.md`

### AI Execution Protocol

#### Pre-Task Checklist
- [x] Read the target workflow, helper, or doc surfaces before editing them
- [x] Confirm the packet layout and no-`output/` rule in `spec.md`
- [x] Freeze the migration whitelist before running any automated corpus move

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Update the command contract before helper logic and corpus migration |
| TASK-SCOPE | Touch only the file families listed in this packet unless a direct blocker proves more scope is required |
| TASK-VERIFY | Run the planned validation sweeps and targeted tests before claiming migration completion |
| TASK-REPORT | Record pending verification or residual tolerance explicitly in `checklist.md` and `implementation-summary.md` |

#### Status Reporting Format
Report progress as: `Phase N - [STATUS] - file family - next step`

#### Blocked Task Protocol
If a task is blocked, mark it `[B]`, document the blocker, and halt closeout claims until the contract mismatch is resolved or explicitly deferred.
<!-- /ANCHOR:cross-refs -->
