---
title: "018 / 008 — command revisit plan"
description: "Evidence-first plan for rechecking the 016 command targets against the Phase 018 continuity model."
trigger_phrases: ["008 revisit plan", "command revisit plan", "phase 018 command parity"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
_memory:
  continuity:
    packet_pointer: "018/008-018-cmd-memory-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the command-surface revisit plan for the 016 release-alignment targets"
    next_safe_action: "Reuse the blocked-wrapper list if mirror parity is retried in a different runtime"
    key_files: ["plan.md", "implementation-summary.md"]
---
# Implementation Plan: 018 / 008 — command revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 008 is a fixed-scope command parity pass. The work starts from the exact 016 command reference map, scans the 44 reviewed files for pre-018 continuity language, patches the 20 editable drifted surfaces, re-reads every edited file, records the seven stale `.agents/commands/**` mirror wrappers that this sandbox will not let us modify, then closes the packet with strict validation and an evidence summary.

### Technical Context

- Documentation-only revisit scoped to the 44 files from the [016 002 reference map](../../016-release-alignment/002-cmd-memory-and-speckit/reference-map.md)
- Canonical contract: `generate-context.js`, `handover -> _memory.continuity -> spec docs`, and no archived active-state language in operator-facing command docs
- Verification surface: authoritative command docs plus explicit read-only wrapper evidence
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] The source-of-truth target list is locked to the [016 002 reference map](../../016-release-alignment/002-cmd-memory-and-speckit/reference-map.md).
- [x] The review pass stays inside the extracted 44-file set.
- [x] Every edited file is re-read after patching.
- [x] Every stale-but-blocked wrapper mirror is recorded with the observed sandbox failure.
- [x] The final packet must pass `validate.sh --strict`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet is documentation-only. The implementation surface is limited to authoritative command docs, repo-level command catalogs, and one command-adjacent agent surface; runtime logic and command executors were not changed.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconstruct the 016 Scope

- [x] Read the 016 packet docs and extract the exact command target set from the source reference map.
- [x] Confirm the review set contains 44 existing files and 0 deleted target files.

### Phase 2: Review for Phase 018 Drift

- [x] Scan the target set for stale save-path, resume-ladder, active-state, and memory-file-first wording.
- [x] Separate legitimate current references, especially the constitutional-memory workflow, from real command drift.

### Phase 3: Patch and Re-Read

- [x] Update the 20 editable drifted files.
- [x] Re-read the edited files to confirm the Phase 018 wording landed.

### Phase 4: Record Blocked Mirrors

- [x] Re-read the stale `.agents/commands/**` mirrors and confirm their remaining pre-018 wording.
- [x] Record the `Operation not permitted` sandbox block observed when attempting to write under `.agents/commands/`.

### Phase 5: Close the Packet

- [x] Write packet-local evidence in the task ledger, checklist, and implementation summary.
- [x] Run strict validation for this packet.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|------|--------|
| Scope lock | Re-extract the 016 file list from the source reference map |
| Drift sweep | `rg` scan for save/recovery wording inside the 44-file target set |
| Edit verification | Re-read every edited file after patching |
| Sandbox verification | `touch .agents/commands/.codex-write-test` to prove writes under `.agents/commands/` fail in this runtime |
| Packet validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict [packet-path]` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| 016 packet docs | Green | Already read before implementation |
| Root 018 packet docs | Green | Re-read to anchor the revisit to the current continuity contract |
| Authoritative `.opencode/command/**` surfaces | Green | Writable and updated in this run |
| `.agents/commands/**` mirror wrappers | Amber | Readable but not writable in this sandbox (`Operation not permitted`) |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If this packet must be reverted, restore the prior wording in the 20 updated authoritative files, then rerun the 44-file command drift sweep and `validate.sh --strict` on this packet. The blocked wrapper list should remain as an audit trail until mirror writes are possible again.
<!-- /ANCHOR:rollback -->
