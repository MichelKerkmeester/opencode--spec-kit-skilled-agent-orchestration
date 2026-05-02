---
title: "Implementation Plan: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Three-phase rollout (Validator+Template, Generator+Create, Resume+Docs) of the phase-parent lean-trio policy."
trigger_phrases:
  - "phase parent plan"
  - "phase parent rollout"
  - "phase parent validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation"
    last_updated_at: "2026-04-27T08:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md three-phase rollout"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase Parent Documentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ (validator rules), TypeScript/JavaScript (generator), Markdown (templates and docs) |
| **Framework** | system-spec-kit (validator orchestrator, template architecture, memory generator, command surface) |
| **Storage** | Filesystem only — `graph-metadata.json` carries the new `derived.last_active_child_id` pointer |
| **Testing** | Bash test fixtures under `scripts/tests/`, vitest where the generator has TS coverage |

### Overview
Sharpen the phase-parent contract so a spec folder containing phase children only requires the lean trio (`spec.md`, `description.json`, `graph-metadata.json`). Two existing facts make this a surgical change rather than a redesign: `validate.sh` already detects phase children via `has_phase_children()`, and `continuity-freshness.ts` already passes when `implementation-summary.md` is missing. The plan therefore adds a single phase-parent branch to two validator rules, one new minimalist spec template, a generator routing branch that promotes continuity into `graph-metadata.json` instead of the parent's `implementation-summary.md`, and a resume redirect — wrapped in three sequenced sub-phases so the validator and generator ship together, the new templates and create-script wire-up land before the docs sweep, and the resume command + hook brief catch up last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] spec.md REQ-001 through REQ-006 (P0) are unambiguous and have measurable acceptance criteria
- [ ] Detection rule (≥1 NNN child + ≥1 child has spec.md OR description.json) is the single source of truth across shell + JS
- [ ] Tolerant migration policy decided (no auto-deletion of legacy heavy parent docs)
- [ ] AGENTS.md sync triad (root + Barter + fs-enterprises) accounted for in scope

### Definition of Done
- [ ] All P0 acceptance criteria met; P1 deferrals user-approved
- [ ] `validate.sh --strict` passes on a fresh phase-parent fixture with only `{spec.md, description.json, graph-metadata.json}`
- [ ] `validate.sh --strict` still passes on `026-graph-and-context-optimization/` with no new errors (regression baseline preserved)
- [ ] Tests for `is_phase_parent()` shell + `isPhaseParent()` JS pass and agree on every fixture case
- [ ] `/spec_kit:resume` round-trip on a phase parent reaches the active child without reading parent's `plan.md`/`tasks.md`/`implementation-summary.md`
- [ ] CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md, system-spec-kit SKILL.md updated and consistent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered policy enforcement: detection → validator → template → generator → command/hook → documentation. Each layer reads the same detection contract, so policy diverging at one layer becomes a test failure rather than silent drift.

### Key Components

- **`is_phase_parent()` / `isPhaseParent()`** — single-source-of-truth detection. Rule: folder has ≥1 direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND ≥1 such child has `spec.md` OR `description.json`. Lives in `scripts/lib/shell-common.sh` (shell) and `mcp_server/lib/spec/is-phase-parent.ts` (JS, exported to `dist/` for runtime).
- **Validator phase-parent branch** — early returns in `check-files.sh` (require only `spec.md`) and `check-level-match.sh` (skip level-match enforcement). Other rules (anchors, frontmatter, graph-metadata, continuity-freshness) already work correctly for the lean parent.
- **`templates/phase_parent/spec.md`** — minimalist spec template with embedded content-discipline comment (FORBIDDEN content list: merge/migration/consolidation narratives; REQUIRED content: root purpose + sub-phase manifest + what needs done).
- **`templates/context-index.md`** — separate template for migration-bridge use cases. NOT part of the lean trio; reached for only when a parent has restructured.
- **`generate-context.js` phase-parent branch** — when target spec folder is a phase parent, write `derived.last_active_child_id` and `derived.last_active_at` into `graph-metadata.json`; do NOT inject `_memory.continuity` into a parent `implementation-summary.md` (which need not exist).
- **`/spec_kit:resume` redirect** — phase-parent target reads pointer, recurses into the active child, and applies the existing child resume ladder. `--no-redirect` bypass available.
- **Hook brief startup-context** — same redirect surfaced in skill-advisor-hook brief output.

### Data Flow

```
[CREATE FLOW]
  /spec_kit:plan :with-phases  →  create.sh --phase
                                   ├─ parent gets templates/phase_parent/spec.md (lean)
                                   └─ each child gets templates/level_N/* (full)

[SAVE FLOW — at child]
  edit child files  →  /memory:save  →  generate-context.js
                                         ├─ writes child's _memory.continuity (today)
                                         ├─ refreshes child's description.json + graph-metadata.json (today)
                                         └─ ALSO updates parent's graph-metadata.json
                                            derived.last_active_child_id + last_active_at (NEW)

[RESUME FLOW — at parent]
  /spec_kit:resume <parent>  →  isPhaseParent(parent) === true
                              →  read parent graph-metadata.json
                                 derived.last_active_child_id
                              →  redirect to child
                              →  apply child resume ladder (handover.md → _memory.continuity → spec docs)

[VALIDATE FLOW — at parent]
  validate.sh <parent>  →  has_phase_children() === true
                        →  is_phase_parent() === true (one populated child)
                        →  check-files.sh requires only {spec.md}
                        →  check-graph-metadata.sh requires schema fields (unchanged)
                        →  check-phase-links.sh requires PHASE DOCUMENTATION MAP in spec.md (unchanged)
                        →  continuity-freshness.ts passes (implementation-summary.md missing → pass branch)
                        →  recursive validation continues into each child as today
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Detection + Validator + Template Foundation (P0)

These three pieces ship together because the validator is the contract and the template is what users author against. Without both, drift starts immediately.

- [ ] Add `is_phase_parent(folder)` to `scripts/lib/shell-common.sh`. Reuse `has_phase_children()` and add child-population check.
- [ ] Add `isPhaseParent(specFolderAbsPath)` to `mcp_server/lib/spec/is-phase-parent.ts`; build into `dist/`.
- [ ] Cross-implementation test fixture: 4 cases (populated parent, scaffolded-but-empty children, support folders only, mixed populated/empty children). Both implementations MUST produce the same boolean for every case.
- [ ] Patch `check-files.sh`: early branch when `is_phase_parent(folder)` returns 0 — required = {spec.md}; missing other files do NOT fail.
- [ ] Patch `check-level-match.sh`: skip enforcement when `is_phase_parent(folder)` returns 0; emit info-level message "phase parent: level enforcement skipped".
- [ ] Create `templates/phase_parent/spec.md` (~80 LOC) with anchors `metadata`, `problem`, `scope`, `phase-map`, `questions`. Embed inline `<!-- CONTENT DISCIPLINE -->` comment listing FORBIDDEN/REQUIRED content rules.
- [ ] Validator regression test on `026-graph-and-context-optimization/` — must continue to pass strict validation.

### Phase B: Generator + Create-Script Wire-Up (P0)

- [ ] Add `last_active_child_id: string | null` and `last_active_at: ISO_8601 | null` to `graph-metadata.json` `derived` section. Update the schema check in `check-graph-metadata.sh` to allow (but not require) these fields.
- [ ] Add phase-parent branch in `generate-context.js` (and TS source under `mcp_server/lib/`): when `isPhaseParent(specFolder)`, skip `implementation-summary.md` continuity write at parent; write the two pointer fields into parent's `graph-metadata.json`.
- [ ] When a save runs at a child, also bubble up parent's `last_active_child_id` to point to that child + stamp `last_active_at`.
- [ ] Patch `create.sh --phase` mode: parent scaffolds from `templates/phase_parent/spec.md` instead of `templates/level_N/spec.md`. Children unchanged.
- [ ] Create `templates/context-index.md` (~40 LOC) for migration-bridge use cases. Not auto-scaffolded; user adds when needed.
- [ ] Update `templates/resource-map.md` Author Instructions §Scope shape: state explicitly that at phase parents, prefer the parent-aggregate mode OR per-child resource-maps (not both). ~10 LOC.

### Phase C: Resume + Hook Brief + Documentation (P0/P1 mix)

- [ ] Patch `/spec_kit:resume` (markdown spec + YAML asset) with phase-parent redirect: pointer-found → recurse into child; pointer-missing or stale (>24h) → list children with statuses; `--no-redirect` flag bypasses.
- [ ] Patch the hook brief assembler in `references/hooks/skill-advisor-hook.md` (and any runtime brief loaders) to honor the same redirect.
- [ ] Update CLAUDE.md §1 Tools & Search resume ladder: add phase-parent branch.
- [ ] Update CLAUDE.md §3 Documentation Levels and AGENTS.md §3 Documentation Levels: add phase-parent mode row + content-discipline note.
- [ ] Mirror the AGENTS.md updates into AGENTS_Barter.md and AGENTS_example_fs_enterprises.md per the known invariant (port shared gates/runtime contracts; do NOT port skill-specific names).
- [ ] Update system-spec-kit `SKILL.md` §3 (file inventory) and level matrix to call out the phase-parent surface and pointer mechanism.
- [ ] Add an example phase-parent fixture under `templates/examples/` (or `references/structure/`) demonstrating the surface.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (shell) | `is_phase_parent()` against 4 fixture folders | bash + scripts/tests harness |
| Unit (TS) | `isPhaseParent()` against same 4 fixture folders | vitest |
| Cross-impl parity | Same input → identical boolean across both helpers | vitest snapshot + bash assertion |
| Integration | `validate.sh --strict` on lean phase-parent fixture (lean trio only) | scripts/tests/spec/check-files.test.sh |
| Regression | `validate.sh --strict` on `026-graph-and-context-optimization/` (legacy heavy parent) | scripts/tests run after Phase A |
| Generator | `generate-context.js` save at parent → writes pointer; save at child → bubbles pointer | vitest fixture |
| Resume | `/spec_kit:resume <parent>` reaches child via pointer; `--no-redirect` reads parent | bash integration test |
| Validation | `validate.sh --recursive` continues to descend into children | scripts/tests recursive fixture |

### Acceptance Scenarios

**Given** a fresh spec folder created via `/spec_kit:plan :with-phases --phases 3`, **when** I list its parent contents, **then** I see only `spec.md`, `description.json`, `graph-metadata.json`, plus three populated child folders.

**Given** a phase parent with the lean trio, **when** I run `validate.sh --strict <parent>`, **then** exit code is 0 and no `FILE_EXISTS` or `LEVEL_MATCH` errors appear.

**Given** a save runs against a child of a phase parent, **when** I read the parent's `graph-metadata.json`, **then** `derived.last_active_child_id` and `derived.last_active_at` reflect that child and the save time within ±10 seconds.

**Given** I invoke `/spec_kit:resume <phase-parent-folder>`, **when** the parent's `last_active_child_id` is populated, **then** the command recurses into that child without reading parent's `plan.md`/`tasks.md`/`implementation-summary.md`.

**Given** the existing `026-graph-and-context-optimization/` parent (legacy heavy docs), **when** I run `validate.sh --strict 026/`, **then** exit code is 0 and no NEW errors are introduced by this packet.

**Given** a folder containing three NNN-named subdirectories that are all empty, **when** `is_phase_parent()` runs, **then** it returns false and the folder is treated as a regular spec folder (not a phase parent).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `has_phase_children()` in `validate.sh` | Internal | Green | Already present; promotion to `lib/shell-common.sh` is mechanical |
| `graph-metadata.json` v1 schema | Internal | Green | Additive fields only; no breaking change to consumers |
| `continuity-freshness.ts` skip-on-missing-summary branch | Internal | Green | Already returns pass when `implementation-summary.md` is missing (verified line 165–170) |
| `templates/addendum/phase/phase-parent-section.md` | Internal | Green | Lives in `templates/addendum/phase/`; new lean template can include or reference it |
| `/spec_kit:resume` command surface | Internal | Yellow | Must be patched in Phase C; absence does not block Phase A or B |
| AGENTS sync triad (Barter + fs-enterprises) | Internal | Yellow | Required by user invariant; track in checklist as P0 |
| Code graph index | Internal | Green (stale) | Stale code graph from startup brief is not load-bearing for this packet; no scan required |
| Hook brief assembler | Internal | Yellow | Must be patched but does not block validator/generator landing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator regression on existing parents (026 et al.) OR generator writing pointer fields to wrong file OR detection helpers disagreeing.
- **Procedure**: 
  1. Revert the `check-files.sh` and `check-level-match.sh` patches (single Phase A commit).
  2. Revert `generate-context.js` phase-parent branch (single Phase B commit).
  3. Resume command + hook brief patches can stay (they only redirect; without validator/generator changes the redirect target still works).
  4. `templates/phase_parent/spec.md` and `templates/context-index.md` can stay; they are additive and cause no failure when unused.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Validator + Template) ──► Phase B (Generator + Create) ──► Phase C (Resume + Docs)
        │                                                                  ▲
        └────────── tests gate every transition ──────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase A | None | Phase B, Phase C |
| Phase B | Phase A (detection helpers must exist before generator routes on them) | Phase C |
| Phase C | Phase A and Phase B (resume redirect needs pointer field populated by generator) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase A — Detection + Validator + Template | Medium | 3–5 hours |
| Phase B — Generator + Create-Script | Medium | 3–4 hours |
| Phase C — Resume + Hook Brief + Documentation | Low–Medium | 2–4 hours |
| **Total** | | **8–13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `validate.sh --strict` regression baseline captured for `026-graph-and-context-optimization/` and at least three other phase-bearing folders before patches land
- [ ] Test fixture `scripts/tests/fixtures/is-phase-parent/` exercises all four detection cases
- [ ] Generator change is covered by a vitest fixture that asserts pointer write at parent and bubbling from child save

### Rollback Procedure
1. Revert Phase A commit(s) — restores stock `check-files.sh` and `check-level-match.sh`.
2. Revert Phase B commit(s) — restores stock `generate-context.js` and `create.sh`.
3. Templates (`templates/phase_parent/`, `templates/context-index.md`) can remain on disk; they are additive and unused when create.sh does not reference them.
4. Run `validate.sh --strict` across all spec folders under `.opencode/specs/` and confirm exit codes match the pre-deployment baseline.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: `derived.last_active_child_id` and `derived.last_active_at` fields written to existing `graph-metadata.json` files are additive. Reversal is optional; consumers ignore unknown derived keys. If desired, a one-shot `scripts/spec/strip-phase-parent-pointers.sh` can remove them.
<!-- /ANCHOR:enhanced-rollback -->
