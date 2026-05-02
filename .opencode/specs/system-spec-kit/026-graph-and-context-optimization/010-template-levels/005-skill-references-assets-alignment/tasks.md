---
title: "Tasks: skill references assets alignment [template:level_3/tasks.md]"
description: "Completed task list for auditing SKILL.md, references, and Markdown assets."
trigger_phrases:
  - "skill references assets alignment tasks"
  - "round 5 tasks"
  - "system spec kit audit tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "scaffold/005-skill-references-assets-alignment"
    last_updated_at: "2026-05-02T06:36:10Z"
    last_updated_by: "codex"
    recent_action: "completed tasks"
    next_safe_action: "review"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/SKILL.md"
      - ".opencode/skill/system-spec-kit/references/"
      - ".opencode/skill/system-spec-kit/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-references-assets-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: skill references assets alignment

<!-- SPECKIT_LEVEL: 3 -->

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

SKILL.md sweep.

- [x] T101 Inventory `SKILL.md` stale and vocabulary hits
- [x] T102 Triage `SKILL.md` hit context
- [x] T103 Apply `SKILL.md` stale-reference edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

References sweep.

- [x] T201 Inventory all `references/` Markdown files
- [x] T202 Audit `references/hooks/`
- [x] T203 Audit `references/structure/`
- [x] T204 Audit `references/templates/`
- [x] T205 Audit `references/validation/`
- [x] T206 Audit `references/workflows/`
- [x] T207 Audit root `references/` Markdown files
- [x] T208 Add current-feature mentions where naturally relevant
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Assets sweep and verification.

- [x] T301 Inventory all Markdown files in `assets/`
- [x] T302 Audit `assets/complexity_decision_matrix.md`
- [x] T303 Audit `assets/level_decision_matrix.md`
- [x] T304 Audit `assets/parallel_dispatch_config.md`
- [x] T305 Audit `assets/template_mapping.md`
- [x] T306 Audit any other Markdown assets found in inventory
- [x] T307 Cross-check `references/templates/template_guide.md` against `templates/README.md`
- [x] T308 Run Gate A stale-pattern grep
- [x] T309 Run Gate B workflow-invariance vitest
- [x] T310 Run Gate C 005 packet strict validation
- [x] T311 Run Gate D 003 and 004 packet regression validation
- [x] T312 Run Gate E sentinel packet validation
- [x] T313 Update parent `graph-metadata.json`
- [x] T314 Complete checklist and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates A through E recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
