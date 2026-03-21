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

- [x] T010 Update parent `spec.md` to use the `213` exact-ID model, fix stale phase counts, and record current validator truth.
- [x] T011 Update parent `plan.md` to describe the alignment pass instead of the original generation wave.
- [x] T012 Update parent `tasks.md`, `checklist.md`, and `implementation-summary.md` to the exact-ID and validator-truth model.
- [x] T013 Expand `013-memory-quality-and-indexing/spec.md` from `26` top-level scenarios to `42` exact IDs.
- [x] T014 Update `013-memory-quality-and-indexing/plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the exact-ID model.
- [x] T015 Refresh the `M-007` playbook verification suite list and proof-lane wording to match the `010` closure docs.
- [x] T016 Apply the narrow `010` parent truth-cleanup for validator-support wording.
- [x] T030 Bulk-replace all `NEW-NNN` provisional markers with bare `NNN` IDs across 80 files in the spec folder.
- [x] T031 Update all root-level count references from `211` to `213` exact scenario IDs.
- [x] T032 Add scenarios `153` (JSON mode hybrid enrichment) and `154` (JSON-primary deprecation posture) to Phase 016 test inventory.
- [x] T033 Update Phase 016 exact-ID count from `21` to `23` in root phase map and sub-phase docs.
- [x] T034 Fold the normalization addendum into the parent packet's core truth-sync narrative.
- [x] T035 Verify zero stale `NEW-NNN` markers remain (excluding `G-NEW-` proper nouns).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run an exact-ID ownership audit across all 19 child `spec.md` files.
- [x] T021 Verify the audit result is `213` exact scenario IDs with `0` missing IDs and `0` duplicate owners.
- [x] T022 Re-run `validate.sh --recursive` on the parent `014-manual-testing-per-playbook/` tree and record the current `0`-error, `19`-warning result.
- [x] T023 Re-run `validate.sh` on the touched `013-memory-quality-and-indexing/` child packet.
- [x] T024 Spot-check the parent/child/docs surface for `M-005a..c`, `M-006a..c`, `M-007a..j`, and the `010` validator-support narrative.
- [x] T040 Execute spec_kit:implement across all 19 phase folders (20 agents: 5 GPT-5.4 + 15 Sonnet, 4 waves)
- [x] T041 Verdict all 209 scenarios: 153 PASS, 52 PARTIAL, 4 FAIL
- [x] T042 Fix 2 critical code bugs: graph FTS5 regression (graph-search-fn.ts), pe-gating barrel export (handlers/index.ts)
- [x] T043 Fix 4 playbook doc errors: channel enums, script path, field names, tier value
- [x] T044 Implement FUT-5 K-sensitivity reporting endpoint (k-value-analysis.ts + eval-reporting.ts)
- [x] T045 Implement Sprint 3 trace field enrichment (hybrid-search.ts Sprint3PipelineMeta)
- [x] T046 GPT-5.4 ultra-think review: 5 findings identified and fixed (graph root cause, K-sensitivity schema+data, test migration, flag drift)
- [x] T047 Harden memory generation scripts: 7 source fixes (title truncation, session status, phase classifier, decision confidence, outcome trimming, trigger phrases, embedding model)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Parent packet uses the `213` exact-ID model as the authoritative coverage unit
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
- **Review Protocol**: Use the review and release-readiness rules in `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- **Feature Catalog**: See `../../../../skill/system-spec-kit/feature_catalog/`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 2 tasks - Umbrella phase tracking
Task numbering uses gaps for future insertion
Phases 1-4 map to plan.md phases 0-5
-->
