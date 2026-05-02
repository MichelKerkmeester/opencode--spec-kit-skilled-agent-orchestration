---
title: "Feature Specification: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "When a spec folder has phase children, the parent only requires the lean trio (spec.md, description.json, graph-metadata.json)."
trigger_phrases:
  - "phase parent documentation"
  - "phase parent lean trio"
  - "phased spec documentation"
  - "parent doc staleness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation"
    last_updated_at: "2026-04-27T08:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec.md for phase-parent lean-trio policy"
    next_safe_action: "Author plan.md with implementation phases A/B/C"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-phase-parent-2026-04-27"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Soft-deprecation rule for legacy heavy parent docs (Policy 2) — defer to follow-on packet?"
      - "Should `check-phase-parent-content.sh` ship in this packet (warn on merge narratives) or follow on?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Phase Parent Documentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

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
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Predecessor** | `009-hook-parity` |
| **Successor** | None (current tail of 026 active surface) |
| **Handoff Criteria** | Validator + template + generator changes ship together so existing parents (e.g. 026) keep validating under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a spec folder has phase children (e.g. `026/{007-code-graph,008-skill-advisor,...}/`), the parent currently authors a full Level 1/2/3 document set (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) describing program-level intent. As phases execute, pivot, and converge over weeks, the parent docs drift from child reality. AI assistants reading the resume ladder treat the stale parent docs as authoritative, hallucinate current state, and propose work against outdated plans.

### Purpose
A spec folder that has phase children only requires three files at the parent level: `spec.md` (root purpose + sub-phase manifest + what needs done), `description.json` (discovery metadata), and `graph-metadata.json` (children, status, continuity pointer). Everything else lives in children, where it stays accurate because it tracks one phase's actual work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validator phase-parent branch in `check-files.sh` and `check-level-match.sh` so parents with phase children only require `{spec.md, description.json, graph-metadata.json}`.
- New `templates/phase_parent/spec.md` template with content discipline (root purpose + sub-phase manifest + what needs done; NO merge/migration narratives).
- New `templates/context-index.md` template for migration-bridge use cases at parent level.
- `templates/resource-map.md` guidance update — make parent-aggregate vs per-child mode explicit at phase parents.
- `create.sh --phase` mode: parent gets the lean trio template; children continue to get level-N templates.
- `generate-context.js` phase-parent branch: skip `implementation-summary.md` continuity write at parents; instead refresh `graph-metadata.json` `derived.last_active_child_id` and `derived.last_active_at`.
- `/spec_kit:resume` phase-parent redirect: read `last_active_child_id` and recurse into the child; if missing, list children with statuses and ask.
- Hook brief startup-context note: phase parents redirect resume to active child.
- CLAUDE.md, AGENTS.md, system-spec-kit `SKILL.md` documentation updates explaining the phase-parent mode and updated resume ladder.
- `AGENTS_Barter.md` and `AGENTS_example_fs_enterprises.md` synced per known invariant.
- Tests for the new phase-parent validator branches and detection rule.

### Out of Scope
- Migrating existing phase parents (026, etc.) to drop their heavy docs — covered by follow-on packet under Policy 2 (soft deprecation).
- Adding `check-phase-parent-content.sh` validator that scans parent spec.md for merge/migration narrative tokens — deferred to a follow-on packet (the template guidance is sufficient for the first ship).
- Changing child phase folder validation requirements — children remain Level 1/2/3 as today.
- Restructuring root `research/`, `review/`, `scratch/` support folders.
- Backfilling `last_active_child_id` for existing parents (one-time backfill is a separate concern; on first save under the new generator, the field self-populates).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Modify | Add early phase-parent branch: if `has_phase_children()` and at least one child has spec.md/description.json, require only `spec.md` (parent already validated for `description.json`/`graph-metadata.json` by other rules). |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` | Modify | Skip level-match enforcement at phase parents (level is informational only when the parent surface is the lean trio). |
| `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` | Modify | Add `is_phase_parent()` helper used by both rules (single source of truth alongside existing `has_phase_children()`). |
| `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` | Create | New minimalist phase-parent spec template. ~80 LOC. Content discipline rule embedded as inline comments. |
| `.opencode/skill/system-spec-kit/templates/context-index.md` | Create | Migration-bridge template (for cases like 026's 29→10 reorg). |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Modify | Sharpen Author Instructions §Scope shape: parent-aggregate vs per-child mode at phase parents. ~10 LOC. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | When `--phase` is used, parent scaffolds from `templates/phase_parent/spec.md` instead of `templates/level_N/spec.md`. |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (and TS source under `mcp_server/lib/`) | Modify | `isPhaseParent(specFolder)` helper; routing branch that writes `graph-metadata.json` `derived.last_active_child_id` instead of `implementation-summary.md` continuity for parents. |
| `.opencode/command/spec_kit/spec_kit_resume.md` (and YAML) | Modify | Phase-parent redirect: read pointer, recurse to child; fall back to manifest with `--no-redirect` flag. |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modify | Note phase-parent redirect in the brief assembler. |
| `CLAUDE.md` | Modify | Resume ladder addendum for phase parents (`graph-metadata.json` → child) and §3 Documentation Levels phase-parent mode. |
| `AGENTS.md` | Modify | §3 Documentation Levels: add phase-parent row; update mandatory-metadata note. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Phase-parent mode explanation in level matrix; pointers to new templates. |
| `AGENTS_Barter.md` | Modify | Sync the phase-parent rule per known invariant. |
| `AGENTS_example_fs_enterprises.md` | Modify | Sync the phase-parent rule per known invariant. |
| `.opencode/skill/system-spec-kit/scripts/tests/spec/check-files.test.sh` (or equivalent) | Modify/Create | Test phase-parent branch passes with lean trio; test legacy parent with heavy docs still passes (tolerant policy). |
| `.opencode/skill/system-spec-kit/scripts/tests/lib/is-phase-parent.test.sh` | Create | Test detection rule edge cases (empty children, NNN children without spec.md). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validator detects phase parents and requires only the lean trio at parent level. | A spec folder X with at least one child matching `^[0-9]{3}-[a-z0-9-]+$` that has `spec.md` OR `description.json` validates with exit 0 when X contains exactly `{spec.md, description.json, graph-metadata.json}` and nothing else. Test fixture lives under `scripts/tests/fixtures/phase-parent-lean/`. |
| REQ-002 | Tolerant policy preserves legacy phase parents. | A phase parent with extra heavy docs (e.g. 026 with `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) validates with exit 0 (no new errors introduced by this packet) when run with current strict mode. |
| REQ-003 | Phase-parent spec.md template forbids merge/migration narratives. | `templates/phase_parent/spec.md` contains an inline content-discipline comment block that lists FORBIDDEN content (merge/consolidation/migration history, reorganization narratives, "X collapsed into Y") and REQUIRED content (root purpose, sub-phase manifest, what needs done). Reviewable via diff. |
| REQ-004 | Generator routes parent continuity to graph-metadata.json. | When `generate-context.js` saves a phase parent, it writes `derived.last_active_child_id` and `derived.last_active_at` to `graph-metadata.json` and does NOT inject a `_memory.continuity` block into the parent's `implementation-summary.md` (parent need not have that file). Verified by integration test. |
| REQ-005 | Resume ladder honors phase-parent redirect. | `/spec_kit:resume <phase-parent-folder>` reads `graph-metadata.json` `derived.last_active_child_id`, recurses into the child, and applies the existing child resume ladder. With `--no-redirect`, shows the parent's spec.md + child manifest instead. Hook brief honors the same redirect. |
| REQ-006 | Detection rule is the single source of truth. | `is_phase_parent()` shell helper in `lib/shell-common.sh` and `isPhaseParent()` JS helper in `mcp_server/lib/` MUST agree. Both use: ≥1 direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND ≥1 such child has `spec.md` OR `description.json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | New templates ship with the policy change. | `templates/phase_parent/spec.md` and `templates/context-index.md` exist; `templates/resource-map.md` Author Instructions §Scope shape is updated. |
| REQ-008 | `create.sh --phase` produces lean parent. | Running `create.sh "Test feature" --phase --phases 3 --level 2` creates a parent with `{spec.md, description.json, graph-metadata.json}` only (no `plan.md`, `tasks.md`, etc. at parent), and three children each with full Level 2 file set. |
| REQ-009 | Documentation reflects the new mode. | CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md, and system-spec-kit SKILL.md all describe the phase-parent mode and updated resume ladder. |
| REQ-010 | Tests cover the detection edge cases. | Test cases: (a) folder with 3 children all populated → phase parent; (b) folder with 3 NNN-named subdirs but all empty → NOT a phase parent; (c) folder with `scratch/` and `research/` subdirs only → NOT a phase parent; (d) folder with one populated child + two empty → phase parent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new spec created via `/spec_kit:plan :with-phases --phases 3` produces a parent containing exactly `{spec.md, description.json, graph-metadata.json}` and three populated child folders. Strict validation on the parent and on each child returns exit 0.
- **SC-002**: An AI agent invoking `/spec_kit:resume` on a phase parent gets routed to the most recently active child, with the child's `_memory.continuity` block as the source of truth — no parent doc read.
- **SC-003**: The existing parent at `026-graph-and-context-optimization/` continues to validate under strict mode without regressions, even though it retains its heavy docs (tolerant policy).
- **SC-004**: A reviewer reading a new phase-parent spec.md sees only program purpose, sub-phase manifest, and outcomes — never merge/migration narratives. The template's inline content-discipline comment makes this explicit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Validator change silently relaxes parent rigor across all existing parents, masking gaps. | Medium | Tolerant policy keeps existing files validated by their other rules (anchors, frontmatter, placeholders); only the file-existence requirement changes. Document the soft-deprecation follow-on (Policy 2) for explicit cleanup. |
| Risk | Detection rule disagreement between shell and JS implementations causes split-brain (validator says parent, generator says child). | High | Single-source-of-truth contract: both helpers MUST match the same regex AND child-population check. Cross-implementation test fixture under `scripts/tests/fixtures/is-phase-parent/`. |
| Risk | `last_active_child_id` pointer goes stale when work happens outside `/memory:save` (e.g. raw edits). | Medium | `/spec_kit:resume` falls back to "list children with statuses" when the pointer is missing or older than 24h. Hook brief carries the same fallback. |
| Risk | Existing phase parents like 026 retain stale parent docs, undermining the staleness goal until soft-deprecation ships. | Medium | This packet ships the lean policy for NEW parents; legacy cleanup is the explicit follow-on. Document the boundary in implementation-summary.md and SKILL.md. |
| Dependency | `has_phase_children()` shell helper. | Low | Already exists in `validate.sh` line 137; promoting to `lib/shell-common.sh` is mechanical. |
| Dependency | `graph-metadata.json` schema. | Low | `derived.last_active_child_id` is additive; existing schema check (`check-graph-metadata.sh`) does not enforce its absence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Phase-parent detection adds ≤ 50ms to `validate.sh` invocation per spec folder (target: O(children listing + one stat per child), measured on 026's 10-child surface).

### Security
- **NFR-S01**: No new file-write paths introduced beyond existing canonical save/`generate-context.js` writes.

### Reliability
- **NFR-R01**: Detection rule must not produce false positives on support folders (`scratch/`, `research/`, `review/`, `z_archive/`, `z_future/`, `iterations/`, `prompts/`, `logs/`, `deltas/`, `changelog/`, `feature_catalog/`, `manual_testing_playbook/`) — the regex `^[0-9]{3}-[a-z0-9-]+$` already excludes these by name shape.
- **NFR-R02**: Resume redirect is reversible via explicit `--no-redirect` flag so users can always inspect the parent surface directly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Detection Boundaries
- A folder with NNN-named subdirs but none populated (no `spec.md` and no `description.json` in any child) → NOT a phase parent. Treated as a regular spec folder mid-decomposition. Regular Level N file requirements apply.
- A folder with ONE populated child and TWO empty NNN subdirs → IS a phase parent. The single populated child satisfies the rule.
- A nested phase-parent (parent contains phase-parent children) → recursively a phase parent. Each level applies the lean-trio rule independently.
- A folder ALSO containing legacy heavy docs at parent level → tolerant: passes validation. The heavy docs remain validated by their existing per-file rules (anchors, frontmatter, etc.) but are not REQUIRED.

### Resume Edge Cases
- `last_active_child_id` missing → list children with `derived.status` from each child's `graph-metadata.json`; ask user which to resume.
- `last_active_child_id` points to a child that was archived/removed → drop pointer, fall back to listing.
- All children completed → resume parent's spec.md with completion summary derived from children.

### Generator Edge Cases
- A `/memory:save` invoked at parent level when generator detects phase parent → write only `description.json` + `graph-metadata.json` (with new pointer); skip continuity write.
- A `/memory:save` invoked at child level → continuity goes to child's `implementation-summary.md` as today; generator ALSO updates parent's `graph-metadata.json` `derived.last_active_child_id` to point to this child.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~13 files modified/created, ~400-450 LOC across validator, templates, generator, command, docs, tests. |
| Risk | 16/25 | Validator change has wide blast radius; mitigated by tolerant policy and dual-implementation contract for detection. |
| Research | 6/20 | Existing infrastructure (`has_phase_children`, addendum templates, `graph-metadata.json` schema, `continuity-freshness` already passes when `implementation-summary.md` is missing) makes the policy mostly a sharpening, not a new design. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `check-phase-parent-content.sh` (a validator that warns on merge/migration narrative tokens like "consolidat\*", "merged from", "renamed from", "collapsed", "29→9") ship in this packet, or follow on? Recommendation: defer — strong template guidance + reviewer discipline is sufficient for v1; ship the validator only if drift recurs.
- Soft deprecation (Policy 2) — at what point do we surface a warning on legacy parents like 026 telling the user to archive heavy docs into `z_archive/legacy-parent-docs/`? Recommendation: separate follow-on packet under 026 once this lean policy has stabilized for ≥2 weeks of new parents.
- Should `last_active_child_id` be machine-derived (set by generator) or also user-overridable via a manual block in `graph-metadata.json`? Recommendation: machine-derived for the first ship; revisit if real workflows need manual pinning.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Graph Metadata**: See `../graph-metadata.json`
