---
title: "Tasks: Skill Graph Auto-Setup"
description: "Completed packet-repair tasks for the Skill Graph Auto-Setup phase."
trigger_phrases:
  - "phase 007 tasks"
  - "skill graph auto setup tasks"
  - "packet repair tasks"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/007-skill-graph-auto-setup"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "copilot"
    recent_action: "Recorded the completed Level 2 packet-repair tasks for Phase 007."
    next_safe_action: "Use the checklist and validation output for any later packet maintenance."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0cf6d34b8d385739a1b195e9709b4a0b1225dc6062d4a9d188ec65ae4c15f3be"
      session_id: "phase-007-task-repair"
      parent_session_id: "phase-007-packet-repair"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All packet-repair tasks are complete."
---
# Tasks: Skill Graph Auto-Setup

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

- [x] T001 Inventory strict validation failures and missing packet artifacts (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Add `_memory` frontmatter and template source markers to all packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T003 [P] Create packet metadata files for discovery parity (`graph-metadata.json`, `description.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `spec.md` to the active Level 2 scaffold while preserving the original Phase 007 intent (`spec.md`)
- [x] T005 Rewrite `plan.md` to document packet normalization, evidence alignment, and verification (`plan.md`)
- [x] T006 Rewrite `tasks.md` to capture the completed packet-repair workflow (`tasks.md`)
- [x] T007 Add a Phase 007-specific verification checklist tied to init setup, lazy auto-init, startup logging, watcher logging, setup-guide coverage, and regression verification (`checklist.md`)
- [x] T008 Remove broken packet-local guide references and replace them with `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` (`spec.md`, `plan.md`, `tasks.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run strict packet validation against the target folder (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T010 Confirm the final result is a pass or warnings-only packet (`checklist.md`, validation report)
- [x] T011 Ensure the packet still documents only the completed Phase 007 implementation surface (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual packet verification and strict validation completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor Packet**: See `../006-skill-graph-sqlite-migration/spec.md`
- **External Setup Guide**: `.opencode/skill/skill-advisor/SET-UP_GUIDE.md`
<!-- /ANCHOR:cross-refs -->

---
