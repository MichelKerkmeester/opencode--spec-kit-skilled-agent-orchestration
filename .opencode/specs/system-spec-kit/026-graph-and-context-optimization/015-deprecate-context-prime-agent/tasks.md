---
title: "Tasks: Deprecate context-prime Agent [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "deprecate context-prime"
  - "phase 015"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Deprecate context-prime Agent

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

- [x] T001 Read the bound packet docs before editing (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Read every targeted runtime file before deletion or modification (`.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`, `CLAUDE.md`)
- [x] T003 Confirm the scoped verification surface for the runtime agent directories and `CLAUDE.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Delete the OpenCode `context-prime` runtime definition (`.opencode/agent/`)
- [x] T012 Delete the Claude `context-prime` runtime definition (`.claude/agents/`)
- [x] T013 Delete the Codex `context-prime` runtime mirror (`.codex/agents/context-prime.toml`)
- [x] T014 Delete the Gemini `context-prime` runtime definition (`.gemini/agents/`)
- [x] T015 Remove stale `@context-prime` guidance from the OpenCode and Codex orchestrators (`.opencode/agent/orchestrate.md`, `.codex/agents/orchestrate.toml`)
- [x] T016 Remove the deprecated root agent entry (`CLAUDE.md`)
- [x] T017 Update the phase packet closeout docs (`spec.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run the scoped zero-match grep for `context-prime`
- [x] T022 Run `validate.sh --strict` on the Phase 015 packet
- [x] T023 Run `git diff --check` on the touched files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
