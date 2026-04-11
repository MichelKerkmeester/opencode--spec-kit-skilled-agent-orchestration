---
title: "Phase 7 Tasks: Skill Rename Breakdown"
description: "Ordered task list for the sk-improve-agent / sk-improve-prompt rename."
trigger_phrases:
  - "phase 7 tasks"
  - "skill rename tasks"
importance_tier: "normal"
contextType: "tasks"
---
# Tasks: Skill Rename — sk-improve-agent & sk-improve-prompt

<!-- ANCHOR:notation -->
## Task Notation
- `[ ]` open, `[x]` completed
- `[P]` parallelizable
- Tasks must be marked `[x]` as each one completes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (Pre-flight)

- [x] T001 Verify no pre-existing collisions for `sk-improve-agent` and `sk-improve-prompt` outside phase folder.
- [x] T002 Capture authoritative file list (`grep -rl`) for both old names. [EVIDENCE: 240 files for sk-agent-improver, 63 files for sk-prompt-improver]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Folder renames (must run before text replace)
- [x] T003 `git mv .opencode/skill/sk-agent-improver .opencode/skill/sk-improve-agent`
- [x] T004 `git mv .opencode/skill/sk-prompt-improver .opencode/skill/sk-improve-prompt`
- [x] T005 `git mv .opencode/changelog/14--sk-prompt-improver .opencode/changelog/14--sk-improve-prompt`
- [x] T006 `git mv .opencode/changelog/15--sk-agent-improver .opencode/changelog/15--sk-improve-agent`

### Mass text replace
- [x] T007 [P] Replace `sk-agent-improver` → `sk-improve-agent` across all text files via sed pipeline. [EVIDENCE: 240 files updated, residual count = 0]
- [x] T008 [P] Replace `sk-prompt-improver` → `sk-improve-prompt` across all text files via sed pipeline. [EVIDENCE: 63 files updated, residual count = 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Grep residuals: zero matches outside `.git/` and phase-007 folder. [EVIDENCE: both grep counts = 0]
- [x] T010 Spot-check high-value files: all contain new name references (agent.md=8, prompt.md=10, skill_advisor.py=73, descriptions.json=5, README.md=2, .opencode/README.md=2).
- [x] T011 `.opencode/skill/sk-improve-agent/SKILL.md` (19977 bytes) and `.opencode/skill/sk-improve-prompt/SKILL.md` (16078 bytes) both exist.
- [x] T012 `git status` shows 87 rename (R) entries covering the four folder renames.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]`.
- Zero residual matches for old names (excluding `.git/`).
- Both renamed skill folders load via SKILL.md.
- `implementation-summary.md` created with file counts and verification evidence.
- Memory save via `generate-context.js`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent spec: `../spec.md`
- Phase spec: `spec.md`
- Phase plan: `plan.md`
- Verification checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
