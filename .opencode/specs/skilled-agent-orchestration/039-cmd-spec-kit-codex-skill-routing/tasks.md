---
title: "Tasks: Codex command discoverability routing update [03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "039 tasks"
  - "codex shortlist tasks"
  - "research packet tasks"
importance_tier: "normal"
contextType: "research"
---
# Tasks: Codex command discoverability routing update

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

- [x] T001 Read `research/research.md` and confirm the original conclusion was a four-command minimal recommendation (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research/research.md`)
- [x] T002 Read the current Level 1 templates for `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` (`.opencode/skill/system-spec-kit/templates/level_1/`)
- [x] T003 Read the existing packet docs and confirm this update stays scoped to the 039 folder (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `spec.md` with the original research recommendation, the user override, and the 12-command surface (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/spec.md`)
- [x] T005 Update `plan.md` with the downstream quick-reference target and `.opencode/skill/system-spec-kit/SKILL.md` pointer-only rule (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/plan.md`)
- [x] T006 Update `tasks.md` to track the packet refresh work inside this folder (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/tasks.md`)
- [x] T007 Update `implementation-summary.md` so it states what changed in the packet and what remains downstream (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/implementation-summary.md`)
- [x] T008 Update `research/research.md` so it keeps the four-command recommendation while noting the chosen override (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run strict spec validation for this folder and review the result (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/`)
- [ ] T010 Check that no placeholder text remains in the touched files (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/`)
- [ ] T011 Confirm the docs use repo-relative file paths and keep the implementation recommendation narrow (`.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research packet**: See `research/research.md`
- **Next implementation targets**:
  - system-spec-kit quick reference as the primary all-commands short list surface
  - `.opencode/skill/system-spec-kit/SKILL.md` as pointer only
<!-- /ANCHOR:cross-refs -->

---
