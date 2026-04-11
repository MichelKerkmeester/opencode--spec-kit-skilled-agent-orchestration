---
title: "Tasks: 041 Recursive Agent Loop [template:level_2/tasks.md]"
description: "Parent packet task tracking for the agent-improver program phases."
trigger_phrases:
  - "041 tasks"
  - "recursive agent phase tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: 041 Recursive Agent Loop

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

- [x] T001 Move the original `041` implementation docs into [`001-sk-improve-agent-mvp/`](./001-sk-improve-agent-mvp/)
- [x] T002 Move the former standalone full-skill packet into [`002-sk-improve-agent-full-skill/`](./002-sk-improve-agent-full-skill/)
- [x] T003 Keep shared research, external analysis, and memory at the root `041/` level
- [x] T004 Add new root packet docs so `041/` becomes the parent phase index
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rewrite stale `001` titles and evidence paths to the new `001-sk-improve-agent-mvp/` location
- [x] T006 Rewrite stale `002` titles, path references, and packet wording to the new `002-sk-improve-agent-full-skill/` location
- [x] T007 Update operator references such as the skill quick reference to point at the phase-based packet path
- [x] T008 Ensure future continuation is documented as new child phases under `041/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run stale-reference sweeps for removed standalone paths
- [x] T010 Run strict validation for root `041/`
- [x] T011 Run strict validation for phase `001`
- [x] T012 Run strict validation for phase `002`
- [x] T013 Update the root implementation summary with the final structure and verification evidence
<!-- /ANCHOR:phase-3 -->

---

### Documentation Alignment

- [x] T014 Create phase `003-sk-improve-agent-doc-alignment/` under the parent packet
- [x] T015 Align `sk-improve-agent` package docs with `sk-doc`
- [x] T016 Align the canonical loop command and agent docs with `sk-doc`
- [x] T017 Update parent packet `041` docs to record phase `003`
- [x] T018 Run package and document validators for the agent-improver surfaces
- [x] T019 Run strict validation for phase `003`

### Promotion Verification

- [x] T020 Create phase `004-sk-improve-agent-promotion-verification/` under the parent packet
- [x] T021 Calibrate the handover scorer narrowly for a truthful promotion verification run
- [x] T022 Generate handover and context-prime repeatability evidence in the new phase
- [x] T023 Run guarded promotion and rollback evidence for the canonical handover target
- [x] T024 Update parent packet `041` docs to record phase `004`
- [x] T025 Run strict validation for phase `004`

### Package and Runtime Alignment

- [x] T026 Create phase `005-sk-improve-agent-package-runtime-alignment/` under the parent packet
- [x] T027 Rewrite `sk-improve-agent` package docs and markdown assets to tighter `sk-doc` template fidelity
- [x] T028 Rename the canonical mutator runtime from `agent-improvement-loop` to `agent-improver` across supported runtimes
- [x] T029 Update command wrappers and workflow YAML to dispatch `@agent-improver`
- [x] T030 Resync `.agents/skills/sk-improve-agent/` from the corrected source package
- [x] T031 Repair active packet references that still presented removed mutator paths as current
- [x] T032 Update parent packet `041` docs and registry metadata to record phase `005`
- [x] T033 Re-run document, script, and strict packet validation for the aligned package/runtime surfaces

### Command Entrypoint Rename

- [x] T034 Create phase `006-sk-improve-agent-command-rename/` under the parent packet
- [x] T035 Rename the canonical command entrypoint from `agent-improvement-loop` to `agent-improver`
- [x] T036 Rename the command YAML asset files and wrapper TOMLs to the agent-improver family
- [x] T037 Update runtime agent tables, skill docs, README examples, and active packet docs to the new command name and path
- [x] T038 Update parent packet `041` docs and registry metadata to record phase `006`
- [x] T039 Re-run document, wrapper-parse, and strict packet validation for the renamed command surfaces

### Wording Alignment

- [x] T040 Create phase `007-sk-improve-agent-wording-alignment/` under the parent packet
- [x] T041 Clean up wording in the current agent-improver source package and references
- [x] T042 Clean up wording in the canonical command and mirrored wrapper prompts
- [x] T043 Clean up wording in runtime-specific agent-improver mirrors and fix runtime-path wording bugs
- [x] T044 Update parent packet `041` docs and registry metadata to record phase `007`
- [x] T045 Re-run document, TOML, and strict packet validation for the wording-cleanup pass

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Parent packet docs exist at root `041/`
- [x] All completed child phases are present and complete
- [x] Stale flat-layout references are removed
- [x] Root and all completed child phases validate strictly
- [x] The agent-improver package, command, and agent docs align with `sk-doc`
- [x] The guarded promotion path and second-target repeatability are proven with phase-local evidence
- [x] The agent-improver runtime rename and `.agents` mirror sync are fully recorded and validated
- [x] The agent-improver command entrypoint rename is fully recorded and validated
- [x] The agent-improver wording-alignment pass is fully recorded and validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
- **Phase 1**: See [`001-sk-improve-agent-mvp/`](./001-sk-improve-agent-mvp/)
- **Phase 2**: See [`002-sk-improve-agent-full-skill/`](./002-sk-improve-agent-full-skill/)
- **Phase 3**: See [`003-sk-improve-agent-doc-alignment/`](./003-sk-improve-agent-doc-alignment/)
- **Phase 4**: See [`004-sk-improve-agent-promotion-verification/`](./004-sk-improve-agent-promotion-verification/)
- **Phase 5**: See [`005-sk-improve-agent-package-runtime-alignment/`](./005-sk-improve-agent-package-runtime-alignment/)
- **Phase 6**: See [`006-sk-improve-agent-command-rename/`](./006-sk-improve-agent-command-rename/)
- **Phase 7**: See [`007-sk-improve-agent-wording-alignment/`](./007-sk-improve-agent-wording-alignment/)
<!-- /ANCHOR:cross-refs -->

---
