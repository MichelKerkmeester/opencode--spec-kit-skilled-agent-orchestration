---
title: "...-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/003-readme-alignment-revisit/plan]"
description: "Evidence-first plan for rechecking the 016 README targets against the Phase 018 continuity model."
trigger_phrases:
  - "009 revisit plan"
  - "readme revisit plan"
  - "phase 018 readme parity"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/003-readme-alignment-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the README-surface revisit plan for the 016 release-alignment targets"
    next_safe_action: "Reuse the README update ledger for future alignment passes"
    key_files: ["plan.md", "implementation-summary.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: 018 / 009 — README revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 009 is a fixed-scope README parity pass. The work starts from the exact 016 README audit, scans the 34 reviewed files for pre-018 continuity language, extends the same review with a first-party `system-spec-kit` README spot-check and stale-term sweep, patches the 11 drifted README surfaces, re-reads every edited file, then closes the packet with strict validation and an evidence summary.

### Technical Context

- Documentation-only revisit scoped to the 34 files from the [016 003 README audit](../../z_archive/016-release-alignment/003-readme-alignment/readme-audit.md)
- Canonical contract: `generate-context.js`, `handover -> _memory.continuity -> spec docs`, and no archived active-state language in discovery surfaces
- Verification surface: README parity with already-updated command and skill docs plus `validate.sh --strict`
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] The source-of-truth target list is locked to the [016 003 README audit](../../z_archive/016-release-alignment/003-readme-alignment/readme-audit.md).
- [x] The review pass stays inside the extracted 34-file set plus the targeted first-party `system-spec-kit` README sweep.
- [x] Every edited file is re-read after patching.
- [x] The final packet must pass `validate.sh --strict`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet is documentation-only. The implementation surface is limited to README and install-guide discovery docs that sit on top of the already-updated command and SKILL documentation.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconstruct the 016 Scope

- [x] Read the 016 packet docs and extract the exact README target set from the source README audit.
- [x] Confirm the review set contains 34 existing files and 0 deleted target files.

### Phase 2: Review for Phase 018 Drift

- [x] Scan the target set for stale save-path, resume-ladder, and active-state wording.
- [x] Separate legitimate current references from real README drift.

### Phase 3: Patch and Re-Read

- [x] Update the one drifted audit file plus 10 additional first-party README surfaces flagged by the deeper sweep (11 total).
- [x] Re-read the edited files to confirm the Phase 018 wording landed.

### Phase 4: Close the Packet

- [x] Write packet-local evidence in the task ledger, checklist, and implementation summary.
- [x] Run strict validation for this packet.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|------|--------|
| Scope lock | Re-extract the 016 file list from the source README audit and log the first-party README extension |
| Drift sweep | `rg` scan for stale continuity wording inside the target set plus the first-party README sweep |
| Edit verification | Re-read every edited file after patching |
| Packet validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict [packet-path]` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| 016 packet docs | Green | Already read before implementation |
| Root 018 packet docs | Green | Re-read to anchor the revisit to the current continuity contract |
| Updated command surfaces | Green | README wording follows the already-updated authoritative command docs |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If this packet must be reverted, restore the prior README wording in the 11 updated files, then rerun the 34-file README drift sweep, the first-party README extension scan, and `validate.sh --strict` on this packet to confirm the rollback state.
<!-- /ANCHOR:rollback -->
