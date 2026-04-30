---
title: "Feature Specification: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Follow-on packet for the phase-parent lean-trio policy. Adds the generator pointer-write branch, create.sh template swap, context-index template, hook brief redirect, content-discipline validator, and end-to-end test."
trigger_phrases:
  - "phase parent generator"
  - "phase parent pointer"
  - "phase parent followon"
  - "last_active_child_id"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T12:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec.md for follow-on deferred items"
    next_safe_action: "Author plan.md"
    blockers: []
    key_files: ["spec.md"]
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase Parent Generator Pointer + Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `014-phase-parent-documentation` |
| **Predecessor** | `001-validator-and-docs` |
| **Successor** | None (current tail of 010) |
| **Handoff Criteria** | 001 already shipped: validator phase-parent branches + detection helpers + lean template. This packet builds on that foundation additively. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 shipped the lean-trio enforcement and documentation but deferred several additive items. Today, `/spec_kit:resume` on a phase parent walks the filesystem to list children — works correctly, but each resume pays the listing cost. `create.sh --phase` scaffolds the parent with level-N templates plus the phase-parent-section addendum — the resulting surface validates as a phase parent, but it carries vestigial heavy docs that the new lean template would skip entirely. There is no automated check warning a reviewer when a phase-parent `spec.md` slips into merge/migration narrative. And no end-to-end walkthrough exists to confirm the round trip from `/spec_kit:plan :with-phases` through `/spec_kit:resume`.

### Purpose
Close the deferred items so the phase-parent surface is uniformly lean by default, resume is fastest-path, and reviewers get automated guardrails on content discipline. Each item is additive: schema already accepts the pointer fields, template already exists, validator framework already exposes the rule registry — this packet wires them up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Generator pointer-write: `mcp_server/lib/memory/generate-context.ts` phase-parent branch that writes `derived.last_active_child_id` and `derived.last_active_at` to a phase parent's `graph-metadata.json` on save, and bubble-up logic when saves run at a child of a phase parent.
- `scripts/dist/memory/generate-context.js` rebuild (ESM-aware) so runtime callers see the new behavior.
- `create.sh --phase` parent template swap: parent scaffolds from `templates/phase_parent/spec.md` instead of level-N + addendum.
- `templates/context-index.md` migration-bridge template (~40 LOC) with brief Author Instructions ("use only when reorganizing").
- `templates/resource-map.md` Author Instructions §Scope shape sharpening: at phase parents, pick parent-aggregate OR per-child mode, not both.
- `check-phase-parent-content.sh` validator (P2) that scans phase-parent `spec.md` for forbidden tokens (consolidate*, merged from, renamed from, collapsed, X→Y) and emits a warning.
- `/spec_kit:resume` enhancement to honor `derived.last_active_child_id` redirect first, falling back to listing when missing or stale (>24h).
- `references/hooks/skill-advisor-hook.md` brief assembler honoring the same redirect.
- End-to-end manual test: `/spec_kit:plan :with-phases --phases 2`, edit a child, save, then resume from parent — confirms the redirect.

### Out of Scope
- Soft deprecation of legacy phase-parent heavy docs (separate follow-on packet).
- Hard migration script that auto-archives legacy heavy docs to `z_archive/` (out of scope; tolerant policy stays).
- Modifying the detection rule (already locked at "≥1 NNN child + ≥1 child has spec.md OR description.json").

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Add phase-parent branch importing `isPhaseParent` (or its mcp_server twin); write pointer fields at parent saves; bubble up at child saves |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Rebuild | Compile output of TS source |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | When `--phase` mode, parent scaffolds from `templates/phase_parent/spec.md`; children unchanged |
| `.opencode/skill/system-spec-kit/templates/context-index.md` | Create | Migration-bridge template for phase parents that have undergone reorganization |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Modify | Sharpen phase-parent guidance in Author Instructions §Scope shape |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | Create | P2 token-scanning validator for phase-parent content discipline |
| `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register `PHASE_PARENT_CONTENT` rule (severity warn) |
| `.opencode/command/spec_kit/resume.md` and `assets/spec_kit_resume_*.yaml` | Modify | Honor `last_active_child_id` redirect first; list-fallback when missing |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modify | Note phase-parent redirect in brief assembler |
| `.opencode/skill/system-spec-kit/scripts/tests/memory/phase-parent-pointer.test.ts` (or vitest equivalent) | Create | Assert generator writes pointer at parent save and bubbles up from child save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generator writes pointer at parent saves. | When `/memory:save` runs against a phase parent (`isPhaseParent(folder) === true`), `generate-context.ts` updates the parent's `graph-metadata.json` `derived.last_active_child_id` (set to `null` since the save is at parent level) and `derived.last_active_at` (current ISO_8601). Test: vitest fixture asserts the field is written and matches schema. |
| REQ-002 | Bubble-up from child saves. | When `/memory:save` runs against a child whose direct parent is a phase parent, the generator ALSO updates the parent's `graph-metadata.json` `derived.last_active_child_id` to that child's packet id and stamps `last_active_at`. Test: vitest fixture asserts both child and parent files updated atomically. |
| REQ-003 | `create.sh --phase` parent uses the lean template. | Running `bash create.sh "Test feat" --phase --phases 2 --level 2` produces a parent containing exactly `{spec.md, description.json, graph-metadata.json}` (the spec.md sourced from `templates/phase_parent/spec.md` with phase-map filled). Children unchanged: each gets the level-N templates as today. |
| REQ-004 | `/spec_kit:resume` honors the pointer first. | When resume target is a phase parent and `derived.last_active_child_id` is non-null and `last_active_at` is within 24h, recurse directly into that child without listing. When pointer is null/stale, fall back to existing list-children behavior. `--no-redirect` flag bypasses the redirect entirely. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `templates/context-index.md` exists. | File present with Author Instructions explaining when to use (reorganization only, optional, never auto-scaffolded). ~40 LOC. |
| REQ-006 | `templates/resource-map.md` Author Instructions sharpened. | §Scope shape clearly states at phase parents, prefer parent-aggregate OR per-child mode, not both — pick one and document choice in Scope line. |
| REQ-007 | Hook brief assembler honors phase-parent redirect. | `skill-advisor-hook.md` (and runtime brief loaders) include phase-parent redirect note in startup context output. |
| REQ-008 | End-to-end walkthrough documented. | `/spec_kit:plan :with-phases --phases 2 "test-feature"` followed by edits + save + resume reaches the active child via pointer. Trace logged under `scratch/e2e-trace.txt`. |

### P2 - Optional (defer with reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | `check-phase-parent-content.sh` validator. | Scans phase-parent `spec.md` for forbidden narrative tokens (consolidate*, merged from, renamed from, collapsed, X→Y). Emits warning via validator-registry as severity `warn`. Acceptable to defer if reviewer discipline holds. |

### Acceptance Scenarios

**Given** a save targets a phase parent, **when** the generator completes, **then** the parent's `graph-metadata.json` stores `derived.last_active_child_id = null` and a fresh `derived.last_active_at`.

**Given** a save targets a direct child of a phase parent, **when** the generator completes, **then** the parent's `graph-metadata.json` points `derived.last_active_child_id` at the child's packet id.

**Given** `create.sh --phase --phases 2` creates a new parent, **when** the parent folder is listed, **then** it contains the lean trio only: `spec.md`, `description.json`, and `graph-metadata.json`.

**Given** `/spec_kit:resume` targets a phase parent with a fresh pointer, **when** `--no-redirect` is absent, **then** the workflow resolves directly to the active child instead of listing all children.

**Given** `/spec_kit:resume --no-redirect` targets a phase parent with a fresh pointer, **when** the workflow reaches phase-parent handling, **then** it skips pointer redirect and shows the parent surface plus child manifest.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A phase-parent save through `/memory:save` writes the pointer fields, observable in `graph-metadata.json` derived block.
- **SC-002**: A child save bubbles up to populate the parent's pointer with the child's packet id within 1 second of the child save completing.
- **SC-003**: `/spec_kit:resume` on a phase parent with a fresh pointer (<24h) skips the listing step and lands directly in the active child.
- **SC-004**: A new `/spec_kit:plan :with-phases --phases 2` produces a parent with exactly `{spec.md, description.json, graph-metadata.json}` — no `plan.md`, `tasks.md`, `checklist.md` at parent level.
- **SC-005**: Reviewer running `validate.sh --strict` against a phase parent that contains "consolidated 29 phases into 9" gets a `PHASE_PARENT_CONTENT` warning (when REQ-009 ships).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generator pointer-write conflicts with concurrent saves at multiple children. | Medium | Atomic file write via temp + rename; pointer reflects whichever child saved last (eventually consistent semantics; resume's 24h staleness window absorbs short races). |
| Risk | `create.sh --phase` template swap breaks existing scripts that depend on parent having `plan.md`. | Low | Validator already tolerates phase parents lacking heavy docs; downstream scripts that hard-code parent's plan.md path are out of scope but discoverable via grep — flag any during review. |
| Risk | Pointer-redirect surprises users who expect to read the parent's spec.md. | Low | `--no-redirect` flag preserves explicit-parent path; resume command output names the redirect target so user can backtrack. |
| Dependency | `isPhaseParent()` ESM JS at `scripts/dist/spec/is-phase-parent.js`. | Green | Already shipped in 001. |
| Dependency | `templates/phase_parent/spec.md`. | Green | Already shipped in 001. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pointer-write adds <50ms to a save (single JSON read/write of the parent graph-metadata.json).
- **NFR-P02**: Bubble-up adds <100ms (one extra parent file write atop the child save).
- **NFR-P03**: Resume redirect via pointer is at least 50% faster than the listing fallback on a 10-child phase parent.

### Security
- **NFR-S01**: No new file-write paths beyond canonical save / `generate-context.js` / `create.sh`.

### Reliability
- **NFR-R01**: Pointer staleness (>24h) triggers fallback to listing — pointer never silently misleads.
- **NFR-R02**: Atomic writes prevent torn pointer state under concurrent saves.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Pointer Edge Cases
- Pointer references an archived/removed child → resume detects missing child folder, drops the pointer, falls back to listing.
- Pointer set during save at parent (no specific child) → `last_active_child_id` is `null`, `last_active_at` stamps the parent save itself; resume falls back to listing.
- Multiple children saving simultaneously → last writer wins; eventually consistent.

### create.sh Edge Cases
- `--phase` mode with `--level 1` for parent → still uses lean template (level number is meaningless at phase parent; surface is fixed at the trio).
- `--phase` invoked on an existing folder that already has heavy docs → tolerant policy preserves them; lean template authoring is opt-in via re-scaffolding.

### Validator Edge Cases
- `check-phase-parent-content.sh` runs only when `is_phase_parent($folder)` returns true — non-phase folders skip it.
- A spec.md that legitimately discusses "merged" in code-comment context (not as a packet narrative) — token scanner's heuristic accepts surrounding code fences as exempt zone.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~9 files modified/created, ~250-350 LOC total |
| Risk | 12/25 | Generator change has moderate blast radius (every save path goes through it); mitigated by additive-only contract and existing test coverage |
| Research | 4/20 | All design groundwork done in 001; this packet is straight implementation |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the pointer's staleness threshold be configurable (env var) instead of hard-coded 24h? Recommendation: defer until real workflows show the boundary matters.
- Should `check-phase-parent-content.sh` ship as `severity: warn` (advisory) or `severity: error` (block)? Recommendation: warn for v1; promote to error only if drift recurs after first deployment.
- Is bubble-up always desired, or should it be opt-in per save? Recommendation: always-on; it's cheap and lets resume skip listing.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessor (Phase 1 — already shipped)**: See `../001-validator-and-docs/`
