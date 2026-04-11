---
title: "Tasks: Skill Rename Closeout [042.007]"
description: "Completed documentation closeout tasks for the improver-skill rename."
trigger_phrases:
  - "042.007"
  - "skill rename tasks"
importance_tier: "normal"
contextType: "tasks"
---
# Tasks: Skill Rename Closeout

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase packet and identify stale metadata, missing template markers, and broken README links. (`spec.md`; `plan.md`; `tasks.md`; `checklist.md`; `implementation-summary.md`; `README.md`)
- [x] T002 Verify the live renamed skill and runtime-agent paths before rewriting packet references. (`.opencode/skill/sk-improve-agent/`; `.opencode/skill/sk-improve-prompt/`; `.opencode/agent/improve-agent.md`; `.claude/agents/improve-agent.md`; `.gemini/agents/improve-agent.md`; `.codex/agents/improve-agent.toml`)
- [x] T003 Confirm the renamed changelog directories are the canonical closeout targets. (`.opencode/changelog/14--sk-improve-prompt/`; `.opencode/changelog/15--sk-improve-agent/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `spec.md` into the current Level 2 template and record the completed rename truth. (`spec.md`)
- [x] T005 Rewrite `plan.md` so the packet describes the delivered rename sequence and validation path. (`plan.md`)
- [x] T006 Rewrite `tasks.md` as completed work with path-based evidence. (`tasks.md`)
- [x] T007 Refresh `checklist.md` with concrete evidence for renamed folders, updated references, and packet closeout. (`checklist.md`)
- [x] T008 Fix `implementation-summary.md` metadata and path references so it matches the completed rename state. (`implementation-summary.md`)
- [x] T009 Create a decision record capturing why `sk-improve-*` stays canonical and why runtime-agent filenames remain unchanged. (`decision-record.md`)
- [x] T010 Repair `README.md` template-reference links to the current system-spec-kit locations. (`README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify the packet references the live runtime-agent files and renamed changelog folders. (`spec.md`; `implementation-summary.md`; `decision-record.md`)
- [x] T012 Verify all checklist items include evidence and reflect the completed rename state. (`checklist.md`)
- [x] T013 Run strict validation on the phase folder until it passes cleanly. (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Runtime-agent and changelog references resolve cleanly
- [x] Strict validation passes for the phase packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
