---
title: "Tasks: manual-testing-per-playbook [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual testing tasks"
  - "playbook phase tasks"
  - "umbrella test tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook

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

- [x] T001 Re-read the parent `014` packet and all current phase folders to identify stale `195`-only and validation-pending claims.
- [x] T002 Re-read the dedicated memory section of `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` and establish the exact-ID inventory model.
- [x] T003 Capture the current parent recursive-validation result for `014-manual-testing-per-playbook/`.
- [x] T004 Confirm parent `description.json` exists and is valid JSON.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Update parent `spec.md` to use the `211` exact-ID model, fix stale phase counts, and record current validator truth.
- [x] T011 Update parent `plan.md` to describe the alignment pass instead of the original generation wave.
- [x] T012 Update parent `tasks.md`, `checklist.md`, and `implementation-summary.md` to the exact-ID and validator-truth model.
- [x] T013 Expand `013-memory-quality-and-indexing/spec.md` from `26` top-level scenarios to `42` exact IDs.
- [x] T014 Update `013-memory-quality-and-indexing/plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the exact-ID model.
- [x] T015 Refresh the `M-007` playbook verification suite list and proof-lane wording to match the `010` closure docs.
- [x] T016 Apply the narrow `010` parent truth-cleanup for validator-support wording.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run an exact-ID ownership audit across all 19 child `spec.md` files.
- [x] T021 Verify the audit result is `211` exact scenario IDs with `0` missing IDs and `0` duplicate owners.
- [x] T022 Re-run `validate.sh --recursive` on the parent `014-manual-testing-per-playbook/` tree and record the current `0`-error, `19`-warning result.
- [x] T023 Re-run `validate.sh` on the touched `013-memory-quality-and-indexing/` child packet.
- [x] T024 Spot-check the parent/child/docs surface for `M-005a..c`, `M-006a..c`, `M-007a..j`, and the `010` validator-support narrative.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Parent packet uses the `211` exact-ID model as the authoritative coverage unit
- [x] Recursive validation truth is recorded honestly for the parent packet
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: See `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- **Review Protocol**: See `../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md`
- **Feature Catalog**: See `../../../../skill/system-spec-kit/feature_catalog/`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 2 tasks - Umbrella phase tracking
Task numbering uses gaps for future insertion
Phases 1-4 map to plan.md phases 0-5
-->
