---
title: "Tasks: Phase 018 — Canonical Continuity Refactor [system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/tasks]"
description: "Packet-wide coordination tasks for phase 018 and its six child gates."
trigger_phrases:
  - "phase 018 tasks"
  - "canonical continuity tasks"
  - "root packet tasks"
importance_tier: "critical"
contextType: "planning"
feature: "phase-006-canonical-continuity-refactor"
level: 2
status: planned
parent: "026-graph-and-context-optimization"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Phase 018 — Canonical Continuity Refactor

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

- [x] T001 Create the root parent `spec.md` with the overall phase-018 goal, scope, and phase map (`spec.md`)
- [x] T002 Create the root parent `plan.md` with sequencing, dependencies, and packet-closeout logic (`plan.md`)
- [x] T003 Create the root parent `tasks.md` so packet-wide work and the six gate milestones have a single coordination list (`tasks.md`)
- [x] T004 Create the parent verification shell and closeout shell (`checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Complete Gate A pre-work and mark its child packet complete (`001-gate-a-prework/`)
- [ ] T011 Complete Gate B foundation work and mark its child packet complete (`002-gate-b-foundation/`)
- [ ] T012 Complete Gate C writer-ready work and mark its child packet complete (`003-gate-c-writer-ready/`)
- [ ] T013 Complete Gate D reader-ready work and mark its child packet complete (`004-gate-d-reader-ready/`)
- [ ] T014 Complete Gate E runtime migration work and mark its child packet complete (`005-gate-e-runtime-migration/`)
- [ ] T015 Complete Gate F archive-permanence work and mark its child packet complete (`006-gate-f-archive-permanence/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Keep the parent phase map and packet status synchronized with the six child folders (`spec.md`, `plan.md`, `tasks.md`)
- [ ] T021 Run recursive strict validation as the packet progresses and resolve packet-level coordination drift before closure (`./.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T022 Refresh the parent `implementation-summary.md` with the actual delivered outcome, verification evidence, and permanence result once all six gates close (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All six child phases are closed in dependency order
- [ ] Recursive packet validation and closeout evidence are recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design grounding**: See `implementation-design.md` and `resource-map.md`
<!-- /ANCHOR:cross-refs -->
