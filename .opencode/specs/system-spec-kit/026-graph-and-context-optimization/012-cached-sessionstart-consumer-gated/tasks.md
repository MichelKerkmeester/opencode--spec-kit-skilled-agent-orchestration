---
title: "Tasks: Cached SessionStart Consumer (Gated) [template:level_3/tasks.md]"
description: "Task breakdown for 012-cached-sessionstart-consumer-gated."
trigger_phrases:
  - "012-cached-sessionstart-consumer-gated"
  - "tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Cached SessionStart Consumer (Gated)

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

- [ ] T001 Re-read `recommendations.md:15-33` and confirm `R3` depends on `R2`.
- [ ] T002 Re-read packet `002` and confirm the producer metadata contract this packet consumes.
- [ ] T003 Confirm the consumer owner surfaces in `session-bootstrap.ts`, `session-resume.ts`, and `session-prime.ts`.
- [ ] T004 Define required fidelity and freshness gate inputs before implementation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Add the guarded cached-summary consumer path to `session-bootstrap.ts`.
- [ ] T012 Route valid cached summaries additively through `session-resume.ts` continuity paths.
- [ ] T013 Surface optional startup hints in `session-prime.ts` only when a valid cached summary exists.
- [ ] T014 Keep authority-boundary wording synchronized across packet-local docs and runtime comments if needed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Create the frozen resume corpus under `scripts/tests/`.
- [ ] T022 Compare guarded cached reuse against live reconstruction and require equal-or-better pass rate.
- [ ] T023 Run focused tests for fidelity, freshness, invalidation, and fail-closed behavior.
- [ ] T024 Run `validate.sh --strict` on the packet folder.
- [ ] T025 Record successor handoff notes for `013-warm-start-bundle-conditional-validation`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All packet tasks marked complete
- [ ] No blocked items remain without explicit rationale
- [ ] Frozen-corpus verification evidence captured
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
