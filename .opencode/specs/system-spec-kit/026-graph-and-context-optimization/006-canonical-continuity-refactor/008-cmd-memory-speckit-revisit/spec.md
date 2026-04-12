---
title: "018 / 008 — command release-alignment revisit"
description: "Revisit the 016 command-surface release-alignment targets and align them to the Phase 018 canonical continuity contract."
trigger_phrases: ["phase 018 command revisit", "memory command revisit", "spec kit command revisit", "016 command alignment revisit"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/008-cmd-memory-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "008 revisit closed"
    next_safe_action: "See implementation-summary.md"
    key_files: ["spec.md", "implementation-summary.md"]
---
# Feature Specification: 018 / 008 — command release-alignment revisit
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
| Parent Spec | `../spec.md` |
| Parent Plan | `../plan.md` |
| Predecessor | `007-sk-system-speckit-revisit` |
| Successor | `009-readme-alignment-revisit` |
| Parent Packet | `006-canonical-continuity-refactor` |
| Source Map | [016 002 reference map](../../z_archive/z_archive/016-release-alignment/002-cmd-memory-and-speckit/reference-map.md) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

Phase 016 aligned the live `spec_kit` and `memory` command surfaces before Phase 018 replaced memory-file-first continuity with canonical spec-doc continuity, reduced the resume flow to `handover -> _memory.continuity -> spec docs`, and made `generate-context.js` the only canonical save path for session continuity. The Phase 016 command targets therefore needed a second pass to remove pre-018 continuity wording from the authoritative `.opencode/command/**` surfaces and from the repo-wide command references that point at them.

### Purpose

Review the exact 44 existing file paths extracted from the [016 002 reference map](../../z_archive/z_archive/016-release-alignment/002-cmd-memory-and-speckit/reference-map.md), update the 28 editable drifted files, and record the alternate `.agents/commands/**` wrapper files that still carry pre-018 language but cannot be edited in this sandbox because writes under `.agents/commands/` fail with `Operation not permitted`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Re-review the 44 existing file paths extracted from the [016 002 reference map](../../z_archive/z_archive/016-release-alignment/002-cmd-memory-and-speckit/reference-map.md).
- Update authoritative `.opencode/command/**` docs, YAML assets, repo-level command catalogs, and the command-adjacent `handover` agent surface where wording still described pre-018 continuity behavior.
- Record the blocked `.agents/commands/**` mirror wrappers that still need the same wording refresh but could not be edited in this environment.
- Preserve legitimate current-reality references, including constitutional memory-document management in `/memory:learn`.

### Out of Scope

- Runtime code changes under `.opencode/skill/system-spec-kit/**`.
- Files outside the exact 016 command release-alignment target list.
- Rewriting the constitutional-memory workflow so `/memory:learn` stops managing constitutional markdown files.

### Target Set Summary

| Source | Reviewed | Updated | Deleted / N/A |
|--------|----------|---------|----------------|
| 016 `002-cmd-memory-and-speckit` reference map | 44 | 28 | 0 |

### Files to Change

| Area | Description |
|------|-------------|
| `.opencode/command/spec_kit/**` | Resume/plan/implement/complete wording, YAML prompts, command-family README alignment |
| `.opencode/command/memory/**` | Save/search/manage wording aligned to canonical continuity and the three-step resume ladder |
| Repo-level command catalogs | Root README, `.opencode` README, assistant guidance docs, and setup docs |
| Handover agent surface | Command-adjacent handover language aligned to the three-step recovery model |
| `.agents/commands/**` wrappers | Reviewed and documented as sandbox-blocked where still stale |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command save-path wording must match Phase 018 | Edited authoritative command docs point to `generate-context.js` and canonical packet continuity rather than hand-authored session continuity artifacts |
| REQ-002 | Recovery wording must match Phase 018 | Edited command docs describe `handover -> _memory.continuity -> spec docs` as the primary resume ladder |
| REQ-003 | Deprecated active-state language must be removed | Edited command docs stop presenting deprecated archive-active-state wording as part of the active continuity contract |
| REQ-004 | Wrapper mirror status must be explicit | Any stale `.agents/commands/**` mirror file that cannot be edited is listed in the implementation summary with the sandbox error evidence |
| REQ-005 | Packet evidence must be auditable | The implementation summary records reviewed/updated counts, blocked wrapper list, and the strict-validation result |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- The 44-file command target set is reviewed against the Phase 018 contract.
- The 28 editable drifted files are updated and re-read.
- Remaining unchanged references are limited to legitimate constitutional memory-document management or documented sandbox-blocked mirror wrappers.
- `validate.sh --strict` passes for this packet.

### Acceptance Scenarios

- **Given** an authoritative command doc that previously described manual continuity authoring, **When** this revisit updates it, **Then** it points to `generate-context.js` and canonical packet continuity instead.
- **Given** a command or catalog surface with stale resume guidance, **When** it is patched in Phase 008, **Then** it describes `handover -> _memory.continuity -> spec docs` as the recovery ladder.
- **Given** a reviewed command target that legitimately manages constitutional memory documents, **When** it is evaluated during the revisit, **Then** it remains unchanged and is documented as intentional current-reality behavior.
- **Given** a stale wrapper mirror under `.agents/commands/**`, **When** the revisit tries to close the packet, **Then** the packet records the read-only sandbox evidence instead of pretending the mirror was updated.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | 016 reference map accuracy | Treat the 016 packet file list as the scope lock |
| Risk | Over-correcting `/memory:learn` constitutional document management | Leave legitimate constitutional memory-document references intact and document why they remain |
| Risk | Alternate wrapper mirrors drift from authoritative docs | Document every blocked `.agents/commands/**` path with the observed sandbox error so follow-on cleanup is scoped precisely |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. Open Questions

None inside the writable scope. The only unresolved drift is isolated to seven `.agents/commands/**` wrapper mirrors that this sandbox would not permit us to edit.
<!-- /ANCHOR:questions -->
