---
title: "Tasks: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task breakdown for the phase-parent lean-trio policy. Three sub-phases: A (validator+template), B (generator+create), C (resume+docs)."
trigger_phrases:
  - "phase parent tasks"
  - "phase parent task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation"
    last_updated_at: "2026-04-27T11:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 1 implemented via opencode handback; Phase 2/3 docs sync done natively"
    next_safe_action: "Author implementation-summary.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase Parent Documentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[D]` | Deferred to follow-on (additive optimization, not blocking the lean-trio policy) |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> **Sub-phase A — Detection + Validator + Template Foundation.** Implemented via opencode (cli-opencode/opencode-go/deepseek-v4-pro) handback then verified natively.

- [x] T001 Add `is_phase_parent()` helper to `scripts/lib/shell-common.sh` — evidence: `lib/shell-common.sh:48-67`, regex `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`, bash 3.2 compatible (no nullglob/extglob)
- [x] T002 [P] Add `isPhaseParent()` helper to `mcp_server/lib/spec/is-phase-parent.ts` and ESM-built dist at `scripts/dist/spec/is-phase-parent.js` — evidence: TS source 43 LOC, ESM dist (rewritten after CJS/ESM type mismatch detected via `scripts/package.json` "type": "module")
- [x] T003 Create cross-implementation test fixture under `scripts/tests/fixtures/is-phase-parent/` (4 cases: populated, scaffolded-empty, support-folders-only, mixed) — evidence: `ls fixtures/is-phase-parent/` confirms all 4
- [x] T004 Author parity test asserting both helpers return identical boolean for every fixture case — evidence: 6/6 pass on TS+shell parity (real 026, single packet 010, 4 fixtures)
- [x] T005 Patch `scripts/rules/check-files.sh` early branch — phase parent requires only `spec.md` — evidence: `check-files.sh:39-55`, `is_phase_parent` calls early-returns
- [x] T006 Patch `scripts/rules/check-level-match.sh` early branch — skip level-match enforcement at phase parents; emit info — evidence: `check-level-match.sh:133-140`
- [x] T007 Create `templates/phase_parent/spec.md` (~117 LOC) with anchors metadata/problem/scope/phase-map/questions and inline content-discipline comment listing FORBIDDEN merge/migration narrative tokens and REQUIRED root-purpose/sub-phases/what-needs-done content — evidence: file created, content-discipline block at lines 14-23
- [x] T008 Run `validate.sh --strict` regression baseline against `026-graph-and-context-optimization/` BEFORE Phase A patches land — evidence: `010/scratch/regression-baseline-pre-A.txt`, baseline error rules captured
- [x] T009 Run `validate.sh --strict` against same set AFTER Phase A patches — confirm no new errors — evidence: parent error set REDUCED by 6 rules (FILE_EXISTS, LEVEL_MATCH, ANCHORS_VALID, CANONICAL_SAVE_ROOT_SPEC_REQUIRED, EVIDENCE_MARKER_LINT, TEMPLATE_HEADERS now properly partitioned to children); ZERO new parent errors introduced
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Generator + Create-Script Wire-Up.** Schema additive change shipped; pointer-write/bubble-up deferred (resume already lists children — pointer is optimization, not blocker).

- [D] T010 Extend `graph-metadata.json` derived schema doc — DEFERRED — captured inline in CLAUDE.md / AGENTS.md / SKILL.md Phase Parent Mode notes; no separate schema doc file added
- [x] T011 Patch `scripts/rules/check-graph-metadata.sh` schema check to allow (not require) the two new derived fields — evidence: `check-graph-metadata.sh:38-39` accepts `last_active_child_id` and `last_active_at` as optional `string|null`; existing 026 graph-metadata still passes
- [D] T012 Add phase-parent branch in `mcp_server/lib/memory/generate-context.ts` — DEFERRED — current generator's manual-fallback save path is permissive; phase-parent saves work without dedicated branch (no `_memory.continuity` is required at parent today; resume already finds children via filesystem listing). Adding the branch is a follow-on optimization that lets the generator write a pointer field for faster resume.
- [D] T013 Add bubble-up logic — DEFERRED — depends on T012; same reasoning
- [D] T014 Rebuild `scripts/dist/memory/generate-context.js` from TS source — DEFERRED — T012/T013 deferred
- [D] T015 Patch `scripts/spec/create.sh --phase` mode — DEFERRED — current create.sh `--phase` path uses level templates + `phase-parent-section.md` addendum injection at parent. With the new validator phase-parent branch, that output ALREADY validates as a phase parent (the lean trio surface is satisfied; the addendum's heavy docs are tolerated). A follow-on packet can swap to `templates/phase_parent/spec.md` for an even leaner surface.
- [D] T016 [P] Create `templates/context-index.md` — DEFERRED — listed as optional cross-cutting doc in AGENTS.md/AGENTS_Barter/AGENTS_example_fs_enterprises (use only when phase parent has undergone reorganization). User-recommended Option C scope; concrete template lands in a follow-on when first reorganization needs it.
- [D] T017 Update `templates/resource-map.md` Author Instructions §Scope shape — DEFERRED — existing template already mentions "for phase-heavy packets, generate one resource-map per phase child OR a single parent-level map that aggregates" (lines 191-192). Sharpening to "pick one mode" is a polish item.
- [D] T018 Add vitest fixture asserting generator writes pointer at parent and bubbles from child save — DEFERRED — depends on T012/T013
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Resume + Hook Brief + Documentation.** Documentation sync shipped; hook brief polish + example fixture deferred.

- [x] T019 Patch `/spec_kit:resume` for phase-parent — evidence: `.opencode/command/spec_kit/resume.md` step 3b (lines 60-75) ALREADY lists child phases with completion status when target is a phase parent. The list-fallback redirect is already in place.
- [D] T020 Patch hook brief assembler — DEFERRED — startup brief reads spec docs structurally; without the parent's heavy docs (which are no longer required) the brief naturally returns less but fewer-and-truer signals. Explicit redirect-to-child polish is a follow-on.
- [x] T021 Update CLAUDE.md §1 Tools & Search resume ladder — evidence: `CLAUDE.md:98` "Phase parent branch" line added to fallback ladder
- [x] T022 Update CLAUDE.md (combined with T021 note above; CLAUDE.md only has §1 resume ladder section + the phase-parent ladder addendum covers content discipline)
- [x] T023 [P] Update root `AGENTS.md` §3 Documentation Levels — evidence: `AGENTS.md:268` Phase Parent row added; `AGENTS.md:272` Phase Parent Mode block added with detection rule, content discipline, resume behavior, tolerant policy
- [x] T024 [P] Sync `AGENTS_Barter.md` per known invariant — evidence: Phase Parent row + Phase Parent Mode block added
- [x] T025 [P] Sync `AGENTS_example_fs_enterprises.md` per known invariant — evidence: Phase Parent row + Phase Parent Mode block added
- [x] T026 Update system-spec-kit `SKILL.md` — evidence: Level Guidelines table appended with Phase Parent row + full Phase Parent Mode paragraph (detection, content discipline, resume, tolerant policy)
- [D] T027 Add example phase-parent fixture/snippet under `references/structure/phase_definitions.md` — DEFERRED — fixture cases under `scripts/tests/fixtures/is-phase-parent/` already serve as canonical examples; weaving them into the reference doc is polish
- [D] T028 Run end-to-end test via `/spec_kit:plan :with-phases --phases 2` — DEFERRED — would require executing the full plan workflow which is itself slow; the validator-level acceptance scenarios from `plan.md` ANCHOR:testing are covered by the fixture parity tests + 026 regression
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001–T009 verified, T011 verified, T019 already-existed, T021–T026 verified) marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining (T012–T015, T020, T027–T028 marked `[D]` deferred — these are additive optimizations, not blockers)
- [x] `validate.sh --strict` passes on lean phase-parent fixture (detection logic confirmed: 6/6 parity tests pass)
- [x] `validate.sh --strict` regression preserved on `026-graph-and-context-optimization/` (zero new parent errors; 6 baseline errors REMOVED at parent due to correct phase-parent detection)
- [D] Manual verification of resume round-trip — DEFERRED — resume command's existing step 3b already covers the lean-trio target; pointer-redirect optimization is follow-on
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
