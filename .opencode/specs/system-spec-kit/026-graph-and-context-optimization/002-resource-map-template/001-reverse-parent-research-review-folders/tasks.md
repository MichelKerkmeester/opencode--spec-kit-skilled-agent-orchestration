---
title: "...ec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/tasks]"
description: "Ordered rollback and migration tasks for restoring local-owner deep-loop packet placement."
trigger_phrases:
  - "013/001 rollback tasks"
  - "reverse parent folders tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T14:30:20+02:00"
    last_updated_by: "codex"
    recent_action: "Completed rollback, migration, and packet closure tasks"
    next_safe_action: "Phase 002 may resume on the restored contract"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
    session_dedup:
      fingerprint: "sha256:reverse-parent-research-review-folders-tasks"
      session_id: "reverse-parent-research-review-folders-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Reverse Parent Research/Review Folder Placement

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

- [x] T001 Confirm the historical origin evidence in `006-integrity-parity-closure` and follow-up commits.
- [x] T002 Finalize `review-research-paths.cjs` local-owner rollback behavior.
- [x] T003 Update `sk-deep-research/scripts/reduce-state.cjs` to rely only on resolver-provided `{artifact_dir}`.
- [x] T004 Update `sk-deep-review/scripts/reduce-state.cjs` to rely only on resolver-provided `{artifact_dir}`.
- [x] T005 [P] Update deep-research YAML assets to keep prompts, state, and synthesis inside the same resolved packet.
- [x] T006 [P] Update deep-review YAML assets to keep prompts, state, and synthesis inside the same resolved packet.
- [x] T007 [P] Update live docs, references, mirrors, and shared assets to the local-owner contract.
- [x] T008 Add focused resolver/parity verification coverage under `scripts/tests/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Scan repo specs for misplaced child packets under ancestor/root `research/` and `review/`.
- [x] T011 Derive each packet's owner from stored config/state metadata.
- [x] T012 Move misplaced research packets into the owning phase or sub-phase local `research/` folder.
- [x] T013 Move misplaced review packets into the owning phase or sub-phase local `review/` folder.
- [x] T014 Update live canonical references that must follow the new path.
- [x] T015 Add lightweight relocation notes only where navigation would otherwise break.
- [x] T016 Re-run the misplaced-packet scan and confirm root-owned packets were not moved.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Rebase `003-resource-map-deep-loop-integration` onto the restored local-owner contract.
- [x] T021 Create `resource-map.md` for this packet as the rollback ledger.
- [x] T022 Run focused verification commands and record results.
- [x] T023 Create `implementation-summary.md` with the rollback outcome, migration totals, and verification.
- [x] T024 Refresh packet metadata (`description.json`, `graph-metadata.json`) and validate this packet strictly.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 requirements from `spec.md` are satisfied.
- [x] No misplaced child packets remain under ancestor/root packet folders.
- [x] Phase 002 docs point to the restored local-owner contract.
- [x] Phase 001 packet docs, rollback ledger, and implementation summary exist.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Dependent phase**: `../003-resource-map-deep-loop-integration/`
<!-- /ANCHOR:cross-refs -->
