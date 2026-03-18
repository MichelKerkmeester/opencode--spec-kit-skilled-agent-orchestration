---
title: "Tasks: Merge create README and install guide commands [017-create-readme-install-merger/tasks]"
description: "Task Format: T### Description (file path or artifact)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "task breakdown"
  - "merge tasks"
  - "create command unification"
  - "migration tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Merge create README and install guide commands

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

**Task Format**: `T### Description (file path or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Planning and Contract Definition

- [x] T001 Capture merge objectives and scope in `spec.md` (`.opencode/specs/03--commands-and-skills/commands/017-create-readme-install-merger/spec.md`)
- [x] T002 Document canonical naming proposal and routing model in `plan.md` (`.opencode/specs/03--commands-and-skills/commands/017-create-readme-install-merger/plan.md`)
- [x] T003 [P] Build evidence baseline table from current command assets (`.opencode/command/create/*.md` and `.opencode/command/create/assets/*.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Merge Design Preparation

- [x] T004 Define preferred unified command contract and alias mapping artifact (`.opencode/command/create/folder_readme.md`, `.opencode/command/create/doc.md`, `.opencode/command/create/install_guide.md`)
- [x] T005 Define shared setup resolver and input normalization schema (canonical wrapper + alias wrappers in markdown and TOML command surfaces)
- [x] T006 Define shared YAML kernel and operation branch boundaries (canonical wrapper routes README/install branches while legacy wrappers preserve entry compatibility)
- [x] T007 Define migration and deprecation timeline with rollback triggers (catalog/runtime refs updated; alias retirement remains explicitly pending)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Validation and Execution Readiness

- [x] T008 Build parity validation matrix for legacy and canonical invocations (`validation-matrix` artifact)
- [x] T009 Define DQI and structural validation gates for both operations (`validate_document.py` VALID for canonical + two legacy markdown wrappers; TOML parse check passed for three `.agents` wrappers)
- [x] T010 Update implementation summary after merge implementation is completed (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 2 and Phase 3 tasks marked `[x]` (T001-T010 complete)
- [x] No `[B]` blocked tasks remain
- [x] Legacy behavior parity validated before deprecating old command surfaces (static parity+safety suite PASS: 20 checks, 0 failed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Gates**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
