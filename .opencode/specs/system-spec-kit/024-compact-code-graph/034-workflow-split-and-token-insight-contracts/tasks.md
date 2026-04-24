---
title: "Tasks: Workflow Split [system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts/tasks]"
description: "Task breakdown for 034-workflow-split-and-token-insight-contracts."
trigger_phrases:
  - "034-workflow-split-and-token-insight-contracts"
  - "tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Workflow Split and Token Insight Contracts

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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-read the research conclusions for this seam.
- [ ] T002 Verify predecessor packet status.
- [ ] T003 Confirm the first owner surfaces to modify.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Implement the bounded change described in `spec.md`.
- [ ] T012 Keep changes inside the named owner surfaces.
- [ ] T013 Update packet-local docs with any implementation truth learned along the way.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the packet's focused tests or corpus checks.
- [ ] T022 Run `validate.sh --strict` on the packet folder.
- [ ] T023 Record successor-packet handoff notes or blockers.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All packet tasks marked complete
- [ ] No blocked items remain without explicit rationale
- [ ] Focused verification evidence captured
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
