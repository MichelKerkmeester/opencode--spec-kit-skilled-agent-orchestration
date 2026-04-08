---
title: "Tasks: FTS Capability Cascade Floor [template:level_3/tasks.md]"
description: "Task breakdown for 010-fts-capability-cascade-floor."
trigger_phrases:
  - "010-fts-capability-cascade-floor"
  - "tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: FTS Capability Cascade Floor

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

- [ ] T001 Re-read R7 and confirm the packet boundary stays limited to FTS capability-cascade hardening.
- [ ] T002 Verify phase `002-implement-cache-warning-hooks` is still blocked on this packet.
- [ ] T003 Confirm the runtime helper, handler, and test owner surfaces to modify.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Add runtime FTS5 compile-probe and degrade-case classification coverage.
- [ ] T012 Surface lexical-path and explicit fallback status on `memory_search` responses and logs.
- [ ] T013 Update packet-local docs and runtime docs so they reject any `fts4_match` claim.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Cover compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure in focused tests.
- [ ] T022 Run `validate.sh --strict` on the packet folder.
- [ ] T023 Record successor-packet handoff notes or blockers for phase `002`.
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
