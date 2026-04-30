---
title: "Tasks: References and READMEs Lean-Trio Sync"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "13-file doc-sync task list. Three sub-phases ordered by severity: Critical, Medium, Low + Verification."
trigger_phrases:
  - "phase parent doc sync tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/003-references-and-readme-sync"
    last_updated_at: "2026-04-27T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md task list"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: References and READMEs Lean-Trio Sync

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> **Sub-phase A — Critical Contradictions.** Five fixes that contradict shipped behavior. Highest priority.

- [ ] T001 Patch `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` parent structure block (lines 86–109): replace with lean trio (parent = spec.md + description.json + graph-metadata.json only); remove `memory/` subfolder from child examples; append paragraph naming `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) as detection sources of truth, and citing `templates/phase_parent/spec.md` as the parent template
- [ ] T002 Patch `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` Output Format (lines 254–288): add a "Phase Parent Save Routing" sub-section explaining at-parent (write `last_active_child_id = null` + `last_active_at = now` to `graph-metadata.json`, no implementation-summary.md continuity) and at-child-of-phase-parent (bubble up child's `packet_id`); cite `scripts/memory/generate-context.ts:372` (`atomicWriteJson`) and `:428` (`updatePhaseParentPointersAfterSave`); add a Phase Parent variant to the Output Location code block at lines 283–288
- [ ] T003 Patch `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`: add `PHASE_PARENT_CONTENT` row to the rule summary table (severity: warn, category: authored_template); add a Phase Parent row to the FILE_EXISTS required-files matrix showing the lean trio; add a new dedicated rule section after FILE_EXISTS describing detection (`is_phase_parent` true), forbidden tokens (`consolidat[a-z]*`, `merged from`, `renamed from`, `collapsed`, `[0-9]+→[0-9]+`, `reorganization`), code-fence + HTML-comment awareness, and remediation (move narrative to `context-index.md`); wrap the forbidden-token examples inside HTML comment or fenced code block to avoid self-referential validator triggers
- [ ] T004 Patch top-level `.opencode/skill/system-spec-kit/README.md`: (a) add Phase Parent row to level matrix table around lines 261–266; (b) add phase-parent-vs-child distinction note to Spec Folder Structure diagram around lines 276–291; (c) update Phase Decomposition section (lines 305–323) naming `templates/phase_parent/spec.md` as the parent template and noting validators skip heavy-doc checks at phase parents; (d) append `PHASE_PARENT_CONTENT` mention to validation-rules description block around line 327
- [ ] T005 Patch `.opencode/skill/system-spec-kit/templates/README.md`: (a) add two rows to the §2 STRUCTURE table between lines 53 and 55 — one for `phase_parent/` (lean spec.md for phase-decomposed root specs) and one for `context-index.md` (optional migration bridge); (b) add a "Phase Parent Folder" sentence to §5 PHASE SYSTEM (lines 93–105) pointing to `templates/phase_parent/spec.md` and clarifying parent receives the lean trio only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Medium Clarity Gaps.** Five MEDIUM clarifications. Most can be done in parallel after Phase 1 lands.

- [ ] T006 [P] Patch `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md` §8 PHASE FOLDER ADDENDA (lines 233–240): rewrite to clarify phase parents are NOT subject to Level 1–3+ structural contracts and use `templates/phase_parent/spec.md` exclusively; phase children still follow normal level contracts; add note that phase-parent spec.md must avoid migration narratives (PHASE_PARENT_CONTENT advisory)
- [ ] T007 [P] Patch `.opencode/skill/system-spec-kit/references/intake-contract.md`: (a) §1 OVERVIEW append a phase-parent note explaining when target is a phase parent the intake publishes only the lean trio and skips level/addendum composition; (b) §14 REFERENCE table add a row pointing to `templates/phase_parent/spec.md` (lean trio template)
- [ ] T008 [P] Patch `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` after line 507 (CONTEXT SAVE & HANDOVER): add a "Phase-Parent Resume Ladder" block describing pointer-first via `derived.last_active_child_id` (<24h fresh) → recurse to child; null/stale/missing → list children with statuses; `--no-redirect` shows parent surface
- [ ] T009 [P] Patch `.opencode/skill/system-spec-kit/assets/template_mapping.md` Required Templates by Level (around lines 99–104): add a Phase Parent block stating required = `spec.md` + `description.json` + `graph-metadata.json` (lean trio); prohibited = `plan.md`/`tasks.md`/`checklist.md`/`decision-record.md`/`implementation-summary.md` (children only); optional = `context-index.md` (migration bridge)
- [ ] T010 Patch `.opencode/command/spec_kit/plan.md` `:with-phases` workflow description: add an explicit sentence stating the parent created by `create.sh --phase` uses `templates/phase_parent/spec.md` (lean trio only); plan/tasks/checklist/decisions live in phase children
- [ ] T011 Patch `.opencode/command/spec_kit/complete.md` `:with-phases` workflow description: same lean-parent statement as plan.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Low Clarifications + Final Sweep.** Two minor doc touch-ups + 4 verification runs.

- [ ] T012 [P] Patch `.opencode/skill/system-spec-kit/references/structure/folder_routing.md`: add a footnote near the explicit-target-priority discussion clarifying that an explicit `[spec-folder]` CLI argument always wins over auto-detect; at a phase parent this means the pointer-write path runs at parent (writes null) rather than at the most-recent child
- [ ] T013 [P] Patch `.opencode/skill/system-spec-kit/references/config/hook_system.md` SessionStart hook lifecycle description (around line 44): add one sentence confirming `resume` priming respects the phase-parent pointer redirect already documented in `references/hooks/skill-advisor-hook.md`
- [ ] T014 Stale-phrase grep sweep (SC-001): `grep -nrE "├── plan\.md.*coordination|memory/.*Parent-level context" .opencode/skill/system-spec-kit/references/` MUST return zero matches
- [ ] T015 Cross-doc consistency grep (SC-002): `grep -lE "Phase Parent Mode|lean trio|last_active_child_id|PHASE_PARENT_CONTENT" .opencode/skill/system-spec-kit/{SKILL.md,README.md,references/structure/phase_definitions.md,references/memory/save_workflow.md,references/validation/validation_rules.md,references/validation/template_compliance_contract.md,references/intake-contract.md,references/workflows/quick_reference.md,templates/README.md,assets/template_mapping.md} 2>/dev/null` MUST list ALL 10 P0+P1 target files
- [ ] T016 `validate.sh --strict` on `003-references-and-readme-sync/` — confirm L2 contract passes modulo SPEC_DOC_INTEGRITY forward-reference noise
- [ ] T017 `validate.sh --strict` regression on `026-graph-and-context-optimization/` — confirm parent-level error rules unchanged from current baseline (3 rules: FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_INTEGRITY, TEMPLATE_SOURCE)
- [ ] T018 `/memory:save` against `003` (dogfood pointer): confirm `010/graph-metadata.json` `derived.last_active_child_id` updates to `.../003-references-and-readme-sync` and `derived.last_active_at` is fresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001–T005, T015–T017) marked `[x]` with evidence
- [ ] All P1 tasks (T006–T011) marked `[x]` OR explicit user-approved deferral
- [ ] No `[B]` blocked tasks remaining
- [ ] T014 grep sweep returns zero stale matches
- [ ] T015 cross-doc grep includes all 10 target files
- [ ] T017 026 regression: zero new error rules vs current baseline
- [ ] T018 pointer dogfood: 010 graph-metadata.json updated correctly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessors (shipped)**: See `../001-validator-and-docs/` and `../002-generator-and-polish/`
- **Plan source (audit findings)**: `/Users/michelkerkmeester/.claude/plans/do-a-deep-dive-peaceful-pine.md`
<!-- /ANCHOR:cross-refs -->
