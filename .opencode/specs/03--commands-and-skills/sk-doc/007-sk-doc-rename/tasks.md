---
title: "Tasks: sk-doc + sk-doc-visual Repo-Wide Rename [template:level_2/tasks.md]"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
SPECKIT_LEVEL: "2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "rename"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: sk-doc + sk-doc-visual Repo-Wide Rename

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

- [x] T001 Capture baseline token counts in Public repo (`scratch/preflight-counts.txt`).
- [x] T002 Capture baseline path inventory (`scratch/preflight-paths.txt`).
- [x] T003 [P] Capture baseline runtime symlink inventory (`scratch/preflight-symlinks.txt`).
- [x] T004 Define and persist rename map (`scratch/path-rename-map.tsv`, `scratch/path-rename-map-ordered.tsv`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Execute canonical path renames from ordered map (`scratch/path-rename-log.txt`).
- [x] T011 Apply flatten fix for nested directories introduced by initial move ordering (`scratch/path-rename-log.txt`).
- [x] T012 [P] Rename/retarget runtime symlinks in `.claude/skills` and `.gemini/skills` (`scratch/post-path-symlinks.txt`).
- [x] T013 Replace scoped legacy identifier tokens in content/config files (`scratch/content-replacement-files.txt`).
- [x] T014 Run external AGENTS match check and keep no-op on zero-match result (`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md`).
- [x] T015 Review rename output and ensure ordered map count equals execution log count (`wc -l` parity check).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Verify final remnant policy shows all zeros (`scratch/final-remnant-counts.txt`).
- [x] T021 Verify canonical skill directories and rename parity checks (`test -d`, `wc -l`).
- [x] T022 Verify canonical runtime symlink state (`scratch/post-path-symlinks.txt`).
- [x] T023 Verify external AGENTS no-match outcome (0 matches, no edit).
- [x] T024 Run spec validation and strict completion checks (`validate.sh`, `check-completion.sh --strict`).
- [x] T025 Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to completed state.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `PC-001` to `PC-006` all passing with recorded evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
