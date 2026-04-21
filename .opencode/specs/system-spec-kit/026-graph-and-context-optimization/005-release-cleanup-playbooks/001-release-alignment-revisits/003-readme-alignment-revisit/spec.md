---
title: "018 / 009 — README release-alignment revisit"
description: "Revisit the 016 README release-alignment targets and align them to the Phase 018 canonical continuity contract."
trigger_phrases: ["phase 018 readme revisit", "readme alignment revisit", "016 readme alignment revisit"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/003-readme-alignment-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "009 revisit closed"
    next_safe_action: "See implementation-summary.md"
    key_files: ["spec.md", "implementation-summary.md"]
---
# Feature Specification: 018 / 009 — README release-alignment revisit
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
| Parent Metadata | `../graph-metadata.json` |
| Parent Description | `../description.json` |
| Predecessor | `008-cmd-memory-speckit-revisit` |
| Successor | `010-remove-shared-memory` |
| Parent Packet | `007-release-alignment-revisits` |
| Source Map | [016 003 README audit](../../z_archive/016-release-alignment/003-readme-alignment/readme-audit.md) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

Phase 016 aligned the README surfaces across the `system-spec-kit` tree before Phase 018 replaced standalone continuity artifacts with canonical packet continuity and shortened recovery to a three-step ladder. The README surfaces therefore needed a new pass so public-facing discovery docs would describe the current save/resume contract instead of the pre-018 model.

### Purpose

Review the exact 34 existing file paths extracted from the [016 003 README audit](../../z_archive/016-release-alignment/003-readme-alignment/readme-audit.md), then extend that README-only pass with a first-party `system-spec-kit` README spot-check and stale-term sweep. Update the one remaining drifted audit-scope README plus the 10 additional subsystem README surfaces flagged by the deeper sweep, and confirm the remaining reviewed files already match the Phase 018 continuity contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Re-review the 34 existing file paths extracted from the [016 003 README audit](../../z_archive/016-release-alignment/003-readme-alignment/readme-audit.md).
- Update README and install-guide surfaces that still described pre-018 continuity behavior.
- Preserve legitimate current references such as constitutional-memory documentation and archive-folder references that remain accurate.
- Record the reviewed/updated counts inside this packet.

### Out of Scope

- Runtime code changes.
- Files outside the exact 016 README target list plus the targeted first-party `system-spec-kit` README sweep.
- Rewriting non-README docs that belong to the 007 or 008 revisit scopes.

### Target Set Summary

| Source | Reviewed | Updated | Deleted / N/A |
|--------|----------|---------|----------------|
| 016 `003-readme-alignment` audit | 34 | 1 | 0 |
| Deep-review extension: first-party `system-spec-kit` README sweep | 20 spot-checked + 89 first-party README stale-term scan | 10 | 0 |

### Files to Change

| Area | Description |
|------|-------------|
| Root and repo README surfaces | Align top-level command and continuity discovery docs |
| `system-spec-kit` README surfaces | Align save, resume, and continuity explanations to Phase 018 |
| Install guides and command-family README files | Remove stale standalone-continuity guidance |
| First-party `system-spec-kit` subsystem READMEs | Sweep for lingering pre-018 continuity terms in `mcp_server/lib/`, `scripts/`, and `shared/` README surfaces |
| Packet-local README carryovers | Keep legacy packet README references current where they remain public discovery surfaces |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README save-path wording must match Phase 018 | Reviewed README surfaces say `generate-context.js` is the canonical save path |
| REQ-002 | README recovery wording must match Phase 018 | Reviewed README surfaces describe `handover -> _memory.continuity -> spec docs` as the primary resume ladder |
| REQ-003 | Deprecated active-tier wording must be removed | Reviewed README surfaces do not present deprecated archive-active-state wording as part of the active continuity model |
| REQ-004 | Legitimate current README references must be preserved | Reviewed/no-change surfaces keep accurate constitutional-memory or archive-filter wording rather than forcing unnecessary edits |
| REQ-005 | Packet evidence must be auditable | The implementation summary records reviewed/updated counts plus the strict-validation result |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- The 34-file README target set is reviewed against the Phase 018 contract.
- A first-party `system-spec-kit` README spot-check and stale-term sweep is completed.
- The 11 drifted README surfaces are updated and re-read.
- Remaining reviewed/no-change files already reflect current reality.
- `validate.sh --strict` passes for this packet.

### Acceptance Scenarios

- **Given** a README or install guide that previously described manual continuity authoring, **When** this revisit updates it, **Then** the doc points to `generate-context.js` and canonical packet continuity.
- **Given** a README surface with stale resume guidance, **When** it is patched in Phase 009, **Then** it describes `handover -> _memory.continuity -> spec docs` as the recovery ladder.
- **Given** a reviewed README surface that already matches the Phase 018 contract, **When** the audit checks it, **Then** it stays unchanged and is counted as reviewed/no-change evidence.
- **Given** the packet enters closure, **When** strict validation is rerun after the packet-doc repairs, **Then** the packet evidence reflects the final passing result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | 016 README audit accuracy | Treat the 016 audit file list as the scope lock |
| Risk | Drifting public onboarding docs from command docs | Keep README wording aligned to the already-updated authoritative command surfaces |
| Risk | Over-correcting legitimate constitutional references | Preserve README text that correctly describes constitutional memory behavior |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. Open Questions

None. The README revisit scope and the post-018 continuity contract were fully determined before edits began.
<!-- /ANCHOR:questions -->
