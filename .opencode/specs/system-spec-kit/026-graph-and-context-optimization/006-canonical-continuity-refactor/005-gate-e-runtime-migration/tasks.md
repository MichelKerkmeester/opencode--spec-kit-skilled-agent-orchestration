---
title: "Gate E — Runtime Migration Tasks"
description: "Execution tasks."
trigger_phrases: ["gate e", "tasks"]
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/005-gate-e-runtime-migration"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Marked all Gate E tasks complete with evidence references"
    next_safe_action: "Reuse task list if follow-on runtime migration work opens"
    key_files: ["tasks.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate E — Runtime Migration

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `pending` | Pending marker (not used in this closed packet) |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Historical blocked marker retained for lineage only |

Task format: `T### Description`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the operator-approved entry gate in packet wording: Gate D closed, 13 regressions green, perf targets met, Gate B cleanup complete, Gate C writer path present.
- [x] T002 Rewrite the packet spec from staged rollout language to immediate canonical migration.
- [x] T003 Rewrite the packet plan, tasks, checklist, decision record, and implementation summary to remove shadow, dual-write, observation-window, EWMA, and archived-tier continuity framing.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Locate the remaining rollout control-plane storage and determine whether canonical should be forced or the retired flag removed entirely.
- [x] T005 Remove workflow-level rollout and shadow-preview scaffolding from the active implementation path.
- [x] T006 Verify a sample save end to end against the canonical path. [Evidence: `tests/memory-save-integration.vitest.ts` passed on 2026-04-12 (`1` file / `10` tests)]
- [x] T007 [P] Update the memory command slice to canonical continuity wording.
- [x] T008 [P] Update the owned agent slices to canonical continuity wording and `/spec_kit:resume` recovery guidance.
- [x] T009 [P] Update the 8 CLI handback files to the current `generate-context.js` JSON-primary contract.
- [x] T010 [P] Finish the remaining mapped doc-parity batches outside this packet: workflow YAMLs, `sk-*` and system-spec-kit internals, top-level docs, memory-relevant sub-READMEs, and doc-parity sub-READMEs. [Evidence: Gate E handover records `178` touched files across the mapped parity batches]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify packet markdown integrity after the Gate E rewrite.
- [x] T012 Run `validate.sh --strict` on this packet and record the result. [Evidence: `PASS`, `0` errors / `0` warnings on 2026-04-12]
- [x] T013 Record the final touched-file list, validation state, and any real post-flip metrics in `implementation-summary.md`. [Evidence: summary updated with `178` touched files, strict validation, CLI contract suite, and sample-save integration]
- [x] T014 Mark packet frontmatter and closeout status as complete only after runtime verification and validator evidence exist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Canonical runtime verification is complete.
- [x] Required mapped parity surfaces are complete and recorded.
- [x] Packet validator state is attached.
- [x] `implementation-summary.md` reflects final evidence rather than placeholders.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision Record: `decision-record.md`
- Implementation Summary: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
