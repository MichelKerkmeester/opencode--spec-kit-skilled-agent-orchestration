---
title: "Tasks: 040 Auto Deep Research / Review [skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "040 tasks"
  - "deep research review tasks"
  - "reducer parity tasks"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/040-sk-deep-research-review-improvement-1"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: 040 Auto Deep Research / Review Improvement

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

sk-deep-research contract — Full details: [`001-sk-deep-research-improvements/tasks.md`](./001-sk-deep-research-improvements/tasks.md)

- [x] T001 Sub-phase A: Lineage schema + naming freeze + migration layer
- [x] T002 Sub-phase B: All 4 lifecycle branches (resume, restart, fork, completed-continue)
- [x] T003 Sub-phase C: Deterministic reducer + findings registry + dashboard sync + executable helpers
- [x] T004 Sub-phase D: Capability matrix + portability + parity checks + surface audit + ownership
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

sk-deep-review contract — Full details: [`002-sk-deep-review-improvements/tasks.md`](./002-sk-deep-review-improvements/tasks.md)

- [x] T005 Sub-phase A: Review naming freeze + migration layer
- [x] T006 Sub-phase B: All 4 lifecycle branches + review findings registry + dimension tracking
- [x] T007 Sub-phase C: Review reducer + lineage adoption + dimension coverage validation
- [x] T008 Sub-phase D: Parity gates + naming separation + release readiness + operator guidance
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 All four Vitest contract test files pass
- [x] T010 Both phase folders pass strict packet validation
- [x] T011 Stale-name sweep confirms legacy names only in scratch migration paths
- [x] T012 Root packet documents updated with complete status and verification evidence
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

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Phase 1 Details**: See [`001-sk-deep-research-improvements/`](./001-sk-deep-research-improvements/)
- **Phase 2 Details**: See [`002-sk-deep-review-improvements/`](./002-sk-deep-review-improvements/)
- **Research**: See [`research/research.md`](./research/research.md)
<!-- /ANCHOR:cross-refs -->

---
