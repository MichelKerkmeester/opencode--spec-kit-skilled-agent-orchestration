---
title: "018 / 007 — system-spec-kit revisit tasks"
description: "Completed task log for the 016 SKILL/internal-doc revisit."
trigger_phrases: ["007 revisit tasks", "system-spec-kit revisit tasks", "phase 018 release-alignment tasks"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-release-alignment-revisits/001-sk-system-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the completed 007 revisit tasks"
    next_safe_action: "Use the updated-count ledger for future release-alignment deltas"
    key_files: ["tasks.md", "implementation-summary.md"]
---
# Tasks: 018 / 007 — system-spec-kit revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `Reviewed` means the file was read against the Phase 018 continuity contract.
- `Updated` means the file changed in this run and was re-read after patching.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Scope Reconstruction

- [x] T001 Read the 016 `001-sk-system-speckit` packet docs and extract the exact target set from the source reference map.
- [x] T002 Confirm the target set contains 63 existing files and 0 deleted/N/A files.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Drift Review

- [x] T003 Scan the target set for pre-018 continuity wording (manual continuity artifacts, deprecated archive-active-state language, legacy bootstrap wording, and stale recovery phrasing).
- [x] T004 Separate legitimate current references from real drift so archive-folder filtering, packet status values, and constitutional docs stay accurate.

### Content Updates

- [x] T005 Update the 32 drifted files to the Phase 018 contract.
- [x] T006 Re-read every edited file to confirm the new wording landed.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Record the reviewed/updated counts in this packet.
- [x] T008 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-release-alignment-revisits/001-sk-system-speckit-revisit` -> `RESULT: PASSED` (0 errors, 0 warnings).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The 63-file target set was reviewed.
- [x] The 32-file drift subset was updated.
- [x] The packet contains explicit evidence and passes strict validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source map: [016 001 reference map](../../z_archive/016-release-alignment/001-sk-system-speckit/reference-map.md)
- Evidence ledger: [implementation summary](./implementation-summary.md)
- Parent packet: [018 parent spec](../spec.md)
<!-- /ANCHOR:cross-refs -->
