---
title: "...context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/001-sk-system-speckit-revisit/plan]"
description: "Evidence-first plan for rechecking the 016 SKILL/internal-doc targets against the Phase 018 continuity model."
trigger_phrases:
  - "007 revisit plan"
  - "system-spec-kit revisit plan"
  - "phase 018 doc parity"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/001-sk-system-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the revisit plan for the 016 SKILL/internal-doc targets"
    next_safe_action: "Reuse the updated-count ledger if another release-alignment sweep opens"
    key_files: ["plan.md", "implementation-summary.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: 018 / 007 — system-spec-kit revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 007 is a fixed-scope doc parity pass. The work starts from the exact 016 reference-map target list, scans the 63 reviewed files for pre-018 continuity language, patches only the drifted surfaces, re-reads every edited file, then closes the packet with strict validation and an evidence summary.

### Technical Context

- Documentation-only revisit scoped to the 63 files from the [016 001 reference map](../../z_archive/016-release-alignment/001-sk-system-speckit/reference-map.md)
- Canonical contract: `generate-context.js`, `handover -> _memory.continuity -> spec docs`, and four active states only
- Verification surface: packet-doc template compliance plus `validate.sh --strict`
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] The source-of-truth target list is locked to the [016 001 reference map](../../z_archive/016-release-alignment/001-sk-system-speckit/reference-map.md).
- [x] The review pass stays inside the extracted 63-file set.
- [x] Every edited file is re-read after patching.
- [x] The final packet must pass `validate.sh --strict`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet is documentation-only. The implementation surface is limited to the `system-spec-kit` skill guide, reference, feature-catalog, manual-playbook, template, and MCP README docs inside the 016 target map; no runtime code paths or data migrations changed.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconstruct the 016 Scope

- [x] Read the 016 packet docs and extract the exact file list from the source reference map.
- [x] Confirm the review set contains 63 existing files and no deleted target files.

### Phase 2: Review for Phase 018 Drift

- [x] Scan the target set for stale save-path, resume-ladder, active-state, and bootstrap terminology.
- [x] Separate legitimate current references (constitutional docs, packet `archived` status, archive-folder filtering) from real drift.

### Phase 3: Patch and Re-Read

- [x] Update the 32 drifted files.
- [x] Re-read the edited files to confirm the 018 wording landed.

### Phase 4: Close the Packet

- [x] Write packet-local evidence in the task ledger, checklist, and implementation summary.
- [x] Run strict validation for this packet.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|------|--------|
| Scope lock | Re-extract the 016 file list from the source reference map |
| Drift sweep | `rg` scan for archived-tier, memory-file-first, and bootstrap wording inside the target set |
| Edit verification | Re-read every edited file after patching |
| Packet validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict [packet-path]` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| 016 packet docs | Green | Already read before implementation |
| Root 018 packet docs | Green | Re-read to anchor the revisit to the current continuity contract |
| Writable target surfaces | Green | All 007 targets were editable in this environment |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If this packet ever needs to be reverted, restore the prior doc wording for the 32 edited files, then rerun the 63-file drift sweep and `validate.sh --strict` on this packet to confirm the rollback matches the intended historical state.
<!-- /ANCHOR:rollback -->
