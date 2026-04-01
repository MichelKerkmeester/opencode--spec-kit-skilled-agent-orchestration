---
title: "Implementation Summary [02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent]"
description: "Implementation complete: --phase-parent flag added to create.sh with nested path validation relaxation and backward compatibility."
trigger_phrases:
  - "phase 008 implementation summary"
  - "create sh nested append status"
  - "phase 008 nested append summary"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-create-sh-phase-parent |
| **Completed** | 2026-04-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Changes to `.opencode/skill/system-spec-kit/scripts/spec/create.sh`:

1. **`--parent|--phase-parent` merged parser**: Single case block with `phase_parent_flag` tracking which flag was used. Duplicate code eliminated. Conflict check rejects both flags simultaneously.
2. **`allow_nested_parent` validation mode**: Third parameter to `resolve_and_validate_spec_path()`. When `"true"`, validates leaf basename against `^[0-9]{2,3}[-]+[A-Za-z0-9._-]+$` — accepts both spec folders (`NNN-name`) and track folders (`NN--name`) while rejecting non-spec directories like `z_archive/` or `scratch/`.
3. **Parent resolution uses relaxed validation**: `resolve_and_validate_spec_path "$PHASE_PARENT" "--parent folder" "true"` passes the nested-parent flag.
4. **Help text updated**: Added `--phase-parent` description and nested `.opencode/specs/` example.
5. **Empty-string guard**: Rejects `--parent ""` and `--phase-parent ""` before filesystem access.

### Current State

`--phase-parent` is a working alias for `--parent` in phase mode. Nested parent paths under `.opencode/specs/` with track folder prefixes are accepted. Non-spec leaf directories are rejected. Backward compatibility with `--parent` is preserved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

AI agents implemented and iteratively reviewed the changes. Two review passes (10 iterations total) drove refinements: parser consolidation, leaf validation tightening, empty-string guard, and dual-flag conflict check. All modifications stayed within nested append scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Plan for `--phase-parent` support while keeping `--parent` compatible | The new name is clearer for append mode and the old one still needs to work |
| Resolve append output from the validated parent tree | It fixes the wrong-root problem for nested `.opencode/specs/` parents |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` syntax check | PASS |
| `--phase-parent` in help output | PASS |
| `--phase-parent` without `--phase` gives error | PASS |
| `--parent` backward compatibility | PASS, merged parser sets same `PHASE_PARENT` variable |
| `allow_nested_parent` validates leaf against spec/track pattern | PASS, rejects `z_archive/` etc. |
| Dual-flag conflict check | PASS, rejects `--parent X --phase-parent Y` |
| Empty-string guard | PASS, rejects `--phase-parent ""` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No end-to-end append test** The actual phase creation with a nested `.opencode/specs/` parent was not tested with real folder creation (would create permanent folders).
2. **Track folder validation** Track folders like `02--system-spec-kit` bypass basename validation entirely when used as parents — this is intentional since the approved-root check provides sufficient safety.
<!-- /ANCHOR:limitations -->

---
