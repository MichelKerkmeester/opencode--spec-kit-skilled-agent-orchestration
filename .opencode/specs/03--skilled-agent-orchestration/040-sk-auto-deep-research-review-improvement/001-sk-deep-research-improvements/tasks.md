---
title: "Tasks: Phase 1 -- sk-deep-research Improvements [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep research tasks"
  - "phase 1 tasks"
  - "reducer tasks"
  - "runtime parity tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: Phase 1 -- sk-deep-research Improvements

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Review parent recommendations and current deep-research contract surfaces (`../research/recommendations-sk-deep-research.md`, target files)
- [x] T002 Audit strict-validation issues in the named phase packet (`spec.md`, `plan.md`, `tasks.md`)
- [x] T003 [P] Inspect runtime mirrors and workflow assets for lineage, reducer, and naming drift (`.opencode/agent/deep-research.md`, `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md`, `.codex/agents/deep-research.toml`, workflow YAML)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define lineage schema and event vocabulary in the deep-research references (`../../../../skill/sk-deep-research/references/state_format.md`, `../../../../skill/sk-deep-research/references/loop_protocol.md`)
- [x] T005 Freeze canonical naming and migration guidance across docs, assets, and workflow YAML (`../../../../skill/sk-deep-research/**/*`, workflow YAML)
- [x] T006 Add the findings registry contract, reducer-owned dashboard/strategy language, and machine-owned markers (`../../../../skill/sk-deep-research/assets/*`, references)
- [x] T007 Create the runtime capability matrix and align all runtime mirrors to the same contract (`../../../../skill/sk-deep-research/references/capability_matrix.md`, runtime mirrors)
- [x] T008 Restore this phase packet to the active Level 1 template (`spec.md`, `plan.md`, `tasks.md`)
- [x] T009 Implement executable reducer idempotency and integrity tests (`../../../../skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`, `../../../../skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`)
- [x] T010 Extract a concrete portability adapter layer or real capability-matrix lookup path from command execution logic (`../../../../skill/sk-deep-research/scripts/runtime-capabilities.cjs`, `../../../../skill/sk-deep-research/scripts/reduce-state.cjs`, workflow YAML)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Validate changed deep-research Markdown surfaces with `validate_document.py`
- [x] T012 Parse changed JSON, YAML, and TOML assets successfully
- [x] T013 Re-run strict packet validation until the phase folder is fully green
- [x] T014 Confirm every remaining Phase 1 requirement is complete and reflected in packet status, tasks, and implementation summary (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed for every Phase 1 requirement
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Parent research**: See [../research/recommendations-sk-deep-research.md](../research/recommendations-sk-deep-research.md)
<!-- /ANCHOR:cross-refs -->

---
