---
title: "018 / 007 — system-spec-kit release-alignment revisit"
description: "Revisit the 016 SKILL/internal-doc release-alignment targets and align them to the Phase 018 canonical continuity contract."
trigger_phrases: ["phase 018 revisit", "system-spec-kit revisit", "canonical continuity docs", "016 release alignment revisit"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
_memory:
  continuity:
    packet_pointer: "018/007-sk-system-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "007 revisit closed"
    next_safe_action: "See implementation-summary.md"
    key_files: ["spec.md", "implementation-summary.md"]
---
# Feature Specification: 018 / 007 — system-spec-kit release-alignment revisit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P1 |
| Status | Complete |
| Created | 2026-04-12 |
| Updated | 2026-04-12 |
| Parent Packet | `006-canonical-continuity-refactor` |
| Source Map | [016 001 reference map](../../z_archive/z_archive/016-release-alignment/001-sk-system-speckit/reference-map.md) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

Phase 016 aligned the main `system-spec-kit` skill guide and internal documentation surfaces before Phase 018 removed the legacy standalone continuity model, retired deprecated archive-active-state guidance from the active contract, and made `/spec_kit:resume` a three-step ladder rooted in `handover`, `_memory.continuity`, and canonical packet docs. The 016 surfaces therefore needed a second pass so they would stop describing pre-018 save/recovery behavior.

### Purpose

Review the exact 63 file targets from the 016 SKILL/internal-doc reference map, keep the current-reality sections that already match Phase 018, and update the drifted surfaces so they consistently describe:

- canonical packet continuity rather than manual session continuity artifacts,
- four active memory states only,
- the three-step resume ladder,
- `generate-context.js` as the canonical save path,
- generated continuity artifacts in `memory/` folders as supporting outputs, not hand-authored primary context.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Re-review the 63 existing file paths extracted from the [016 001 reference map](../../z_archive/z_archive/016-release-alignment/001-sk-system-speckit/reference-map.md).
- Update SKILL, README, reference, template, install-guide, agent-guide, and MCP-server docs that still described pre-018 continuity behavior.
- Keep legitimate current-reality references intact, including:
  - constitutional memory documentation,
  - packet status values such as `archived`,
  - archive/test/scratch folder filtering in filesystem tooling.
- Record the reviewed/updated counts inside this packet.

### Out of Scope

- Runtime code changes under `mcp_server/lib/**` or `scripts/**`.
- Files outside the exact 016 target list.
- Changing packet status semantics such as `draft -> active -> complete -> archived`.

### Target Set Summary

| Source | Reviewed | Updated | Deleted / N/A |
|--------|----------|---------|----------------|
| 016 `001-sk-system-speckit` reference map | 63 | 32 | 0 |

### Files to Change

| Area | Description |
|------|-------------|
| Skill guide and README surfaces | Re-state the canonical save and resume contract |
| `references/**` | Remove standalone-continuity wording and deprecated archive-active-state guidance from active continuity docs |
| `templates/**`, `assets/**` | Rename legacy continuity wording to generated continuity artifact language where appropriate |
| Agent and install guidance surfaces | Keep recovery and save examples aligned to the Phase 018 contract |
| MCP server markdown docs | Present the active four-state model and continuity-bearing document language |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Save-path language must match Phase 018 | Reviewed docs say `generate-context.js` is the canonical save path and no longer instruct operators to hand-author packet continuity artifacts |
| REQ-002 | Recovery language must match Phase 018 | Reviewed docs describe `handover -> _memory.continuity -> spec docs` as the primary recovery ladder |
| REQ-003 | Active-state language must match Phase 018 | Reviewed docs describe only `HOT`, `WARM`, `COLD`, and `DORMANT` as active states |
| REQ-004 | Supporting artifact language must be explicit | `memory/` references describe generated continuity artifacts or constitutional docs, not the primary continuity contract |
| REQ-005 | Packet evidence must be auditable | The implementation summary records reviewed/updated counts plus the strict-validation result |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- The 63-file 016 target set is reviewed against the Phase 018 contract.
- The 32 drifted files inside that target set are updated and re-read.
- No reviewed doc still describes the active continuity ladder as memory-file-first or as a four-plus-archived active state model.
- `validate.sh --strict` passes for this packet.

### Acceptance Scenarios

- **Given** a reviewed skill or reference doc that previously told operators to hand-author continuity records, **When** the Phase 018 revisit updates it, **Then** the doc points to `generate-context.js` and generated continuity artifacts instead of manual continuity authoring.
- **Given** a reviewed save or recovery doc with stale resume guidance, **When** it is updated in this packet, **Then** it describes `handover -> _memory.continuity -> spec docs` as the recovery ladder.
- **Given** a reviewed target file that still mentions archive-related concepts for a legitimate current-reality reason, **When** it is assessed against the Phase 018 contract, **Then** it remains unchanged and is recorded as intentional rather than drift.
- **Given** the packet enters closure, **When** strict validation is rerun after the packet-doc repairs, **Then** the packet evidence reflects the final passing result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | 016 reference map accuracy | Treat the 016 packet file list as the scope lock |
| Risk | Over-correcting legitimate archive/status language | Keep packet lifecycle `archived` state docs and archive-folder filtering unchanged |
| Risk | Reintroducing deleted bootstrap concepts | Re-read every edited file after patching and re-scan the target set for stale terms |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. Open Questions

None. The revisit scope, target list, and continuity contract were fully determined by the 016 reference map plus the parent 018 packet.
<!-- /ANCHOR:questions -->
