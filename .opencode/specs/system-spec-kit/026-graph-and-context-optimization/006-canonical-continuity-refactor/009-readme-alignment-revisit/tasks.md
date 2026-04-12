---
title: "018 / 009 — README revisit tasks"
description: "Completed task log for the 016 README release-alignment revisit."
trigger_phrases: ["009 revisit tasks", "readme revisit tasks", "phase 018 readme alignment tasks"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/009-readme-alignment-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the completed 009 revisit tasks"
    next_safe_action: "Use the README ledger as the next release-alignment baseline"
    key_files: ["tasks.md", "implementation-summary.md"]
---
# Tasks: 018 / 009 — README revisit
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

- [x] T001 Read the 016 `003-readme-alignment` packet docs and extract the exact target set from the source README audit.
- [x] T002 Confirm the target set contains 34 existing files and 0 deleted/N/A files.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Drift Review

- [x] T003 Scan the target set for pre-018 continuity wording (manual continuity-artifact phrasing, deprecated archive-active-state language, and stale resume wording), then extend that sweep across first-party `system-spec-kit` READMEs.
- [x] T004 Separate legitimate current references from real README drift.

### Content Updates

- [x] T005 Update the one drifted audit file plus 10 additional first-party README surfaces flagged by the deeper sweep (11 total).
- [x] T006 Re-read every edited file to confirm the new wording landed.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Record the reviewed/updated counts in this packet.
- [x] T008 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/009-readme-alignment-revisit` -> `RESULT: PASSED` (0 errors, 0 warnings).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The 34-file target set was reviewed.
- [x] The 11-file drift subset was updated.
- [x] The packet contains explicit evidence and passes strict validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source map: [016 003 README audit](../../z_archive/z_archive/016-release-alignment/003-readme-alignment/readme-audit.md)
- Evidence ledger: [implementation summary](./implementation-summary.md)
- Parent packet: [018 parent spec](../spec.md)
<!-- /ANCHOR:cross-refs -->
