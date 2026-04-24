---
title: "...ntext-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/002-cmd-memory-speckit-revisit/tasks]"
description: "Completed task log for the 016 command release-alignment revisit."
trigger_phrases:
  - "008 revisit tasks"
  - "command revisit tasks"
  - "phase 018 command alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/002-cmd-memory-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the completed 008 revisit tasks"
    next_safe_action: "Use the blocked-wrapper notes if mirror parity becomes writable later"
    key_files: ["tasks.md", "implementation-summary.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: 018 / 008 — command revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `Reviewed` means the file was read against the Phase 018 continuity contract.
- `Updated` means the file changed in this run and was re-read after patching.
- `Blocked wrapper` means the file was read, confirmed stale, and could not be edited because `.agents/commands/` rejects writes in this sandbox.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Scope Reconstruction

- [x] T001 Read the 016 `002-cmd-memory-and-speckit` packet docs and extract the exact target set from the source reference map.
- [x] T002 Confirm the target set contains 44 existing files and 0 deleted/N/A files.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Drift Review

- [x] T003 Scan the target set for pre-018 continuity wording (manual continuity artifacts under `memory/`, deprecated archive-active-state language, and stale resume wording).
- [x] T004 Separate legitimate constitutional memory-document management from real command drift.

### Writable Updates

- [x] T005 Update the 20 editable drifted files to the Phase 018 contract.
- [x] T006 Re-read every edited file to confirm the new wording landed.

### Read-Only Mirror Audit

- [x] T007 Re-read the stale `.agents/commands/**` mirror wrappers and confirm they still carry pre-018 continuity wording.
- [x] T008 Confirm the sandbox block by attempting a benign write under `.agents/commands/` and recording the `Operation not permitted` failure.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Record the reviewed/updated counts plus the blocked-wrapper list in this packet.
- [x] T010 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/002-cmd-memory-speckit-revisit` -> `RESULT: PASSED` (0 errors, 0 warnings).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The 44-file target set was reviewed.
- [x] The 20 editable drifted files were updated.
- [x] The seven stale wrapper mirrors were documented with explicit sandbox evidence.
- [x] The packet contains explicit evidence and passes strict validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source map: [016 002 reference map](../../z_archive/016-release-alignment/002-cmd-memory-and-speckit/reference-map.md)
- Evidence ledger: [implementation summary](./implementation-summary.md)
- Parent packet: [018 parent spec](../spec.md)
<!-- /ANCHOR:cross-refs -->
