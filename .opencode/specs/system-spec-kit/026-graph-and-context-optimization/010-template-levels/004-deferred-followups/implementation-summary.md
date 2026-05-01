---
title: "Implementation Summary: deferred-followups [template:level_3/implementation-summary.md]"
description: "Final delivery summary for the ten Gate 7 deferred followups."
trigger_phrases:
  - "deferred followups complete"
  - "round 4 complete"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "scaffold/004-deferred-followups"
    last_updated_at: "2026-05-01T20:32:55Z"
    last_updated_by: "codex"
    recent_action: "Completed deferred followups"
    next_safe_action: "Review residual Gate E note"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-deferred-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Feature** | deferred-followups |
| **Status** | Complete |
| **Completed** | 2026-05-01 |
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/004-deferred-followups` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Added `mcp_server/lib/validation/orchestrator.ts` and exported `validateFolder` from `mcp_server/api/index.ts`.
- Updated `scripts/spec/validate.sh` to use the orchestrator by default and keep legacy shell validation behind `SPECKIT_VALIDATE_LEGACY=1`.
- Added manifest-owned `versions` and per-document `sectionGates` profiles in `templates/manifest/spec-kit-docs.json`.
- Extended `level-contract-resolver.ts` and `template-structure.js` to accept nested section gates while preserving flat serialization.
- Added `inline-gate-renderer --level N --out-dir DIR file...` and batch scaffold rendering in `template-utils.sh` plus normal `create.sh`.
- Added canonical save advisory lock handling in `scripts/memory/generate-context.ts`.
- Added `SESSION_LINEAGE_BROKEN` warning semantics for non-null `parent_session_id` references.
- Added `templates/manifest/EXTENSION_GUIDE.md` and `templates/manifest/MIGRATION.md`.
- Expanded rendered-output snapshot coverage in `scaffold-golden-snapshots.vitest.ts`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the four phases in `plan.md`: low-risk manifest/docs/test work, validation orchestration and lineage warnings, CLI/rendering changes, then save locking plus migration documentation. The parent phase `graph-metadata.json` now includes `004-deferred-followups` and marks it as `derived.last_active_child_id`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001 chose a single Node validation orchestrator for maximum performance gain.
- ADR-002 chose lenient `parent_session_id` warnings for backward compatibility.
- ADR-003 chose exit codes `0/1/2/3` for success, user error, validation error, and system error.
- ADR-004 chose `spec-kit-docs.json.versions` as the template version source of truth.
- ADR-005 chose indefinite read support for legacy v2.1 template markers.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Gate A PASS: workflow-invariance, level-contract-resolver, inline-gate-renderer, and scaffold-golden-snapshots tests passed.
- Gate B PASS: fresh Level 1, 2, 3, 3+, and phase-parent scaffolds validated in strict mode.
- Gate C PASS: `003-template-greenfield-impl` validated in strict mode.
- Gate D PASS: `004-deferred-followups` validated in strict mode.
- Gate F PASS: invalid create level exits 1; missing validate folder exits 3.
- Gate G PASS: fresh Level 3 strict validation wall-clock measured 106ms against target <2000ms.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Gate E was partially annotated: the live sentinel path `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag` does not exist in the working tree; the archived path exists and reports two warnings under strict validation.
- The user-provided Gate B shell snippet reuses `TMPDIR` as a variable name, which can break later `mktemp` calls after the first `rm -rf`; verification used `WORK_TMP` instead.
- Full validation of all historical packets was not run; sentinel checks and the required A-D gates were run.
<!-- /ANCHOR:limitations -->
