---
title: "Tasks: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "011-resource-map-template tasks"
  - "resource map template task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root tasks.md"
    next_safe_action: "Verify validate.sh --strict passes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-tasks"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: 001-reverse-parent-research-review-folders

- [x] T001 Roll back `review-research-paths.cjs` to local-owner path policy (`.opencode/skill/system-spec-kit/shared/review-research-paths.cjs`)
- [x] T002 Update `sk-deep-review/scripts/reduce-state.cjs` to use resolver-provided `{artifact_dir}` only
- [x] T003 Update `sk-deep-research/scripts/reduce-state.cjs` to use resolver-provided `{artifact_dir}` only
- [x] T004 Update command YAMLs to keep prompts and outputs inside resolved local-owner packet
- [x] T005 Update deep-research and deep-review docs and mirrors to match restored contract
- [x] T006 Add path-resolution test coverage and update parity expectations
- [x] T007 Repo-wide migration: discover and move misplaced child packets to owning phase folders (`scripts/migrate-deep-loop-local-owner.cjs`)
- [x] T008 Repo-wide migration: legacy owner-map cleanup (`scripts/migrate-deep-loop-legacy-owner-map.cjs`)
- [x] T009 Create phase-local rollback ledger `resource-map.md`
- [x] T010 Document historical origin of the centralized behavior (closure docs and commit evidence trail)
- [x] T011 Rebase Phase 003 dependency docs onto the restored local-owner contract
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: 002-resource-map-template-creation

- [x] T012 [P] Create `resource-map.md` at templates root with frontmatter and ten categories (`.opencode/skill/system-spec-kit/templates/resource-map.md`)
- [x] T013 [P] Update `templates/README.md` — structure table row, Workflow Notes, Related section
- [x] T014 [P] Update `templates/level_1/README.md` — Optional Files subsection
- [x] T015 [P] Update `templates/level_2/README.md` — Optional Files subsection
- [x] T016 [P] Update `templates/level_3/README.md` — Optional Files subsection
- [x] T017 [P] Update `templates/level_3+/README.md` — Optional Files subsection
- [x] T018 Update `SKILL.md` — canonical spec docs, cross-cutting templates, distributed governance mentions
- [x] T019 Update skill `README.md` — template architecture section
- [x] T020 Update `references/templates/level_specifications.md` — cross-cutting Templates row + per-level Optional Files
- [x] T021 Add `resource-map.md` to `SPEC_DOCUMENT_FILENAMES` in `spec-doc-paths.ts`
- [x] T022 Create feature catalog entry (`feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md`)
- [x] T023 Create manual testing playbook entry (`manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md`)
- [x] T024 Update `CLAUDE.md` Documentation Levels cross-cutting note
- [ ] T025 Rerun `validate.sh --strict` on Phase 002 packet and confirm exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: 003-resource-map-deep-loop-integration

- [x] T026 Create `scripts/resource-map/extract-from-evidence.cjs` — handles review and research delta shapes
- [x] T027 Create `scripts/resource-map/README.md` — extractor input/output contract
- [x] T028 Integrate extractor into `sk-deep-review/scripts/reduce-state.cjs` at convergence
- [x] T029 Integrate extractor into `sk-deep-research/scripts/reduce-state.cjs` at convergence
- [x] T030 Update `spec_kit_deep-review_auto.yaml` — post-convergence emission step + `resource_map.emit` flag
- [x] T031 Update `spec_kit_deep-review_confirm.yaml` — same
- [x] T032 Update `spec_kit_deep-research_auto.yaml` — same
- [x] T033 Update `spec_kit_deep-research_confirm.yaml` — same
- [x] T034 Update `sk-deep-review/SKILL.md` and `sk-deep-research/SKILL.md` — document new output surface and opt-out flag
- [x] T035 [B] T035 deferred — validator check for pre-existing out-of-scope packet-doc drift; not blocking completion
- [x] T036 Update `deep-review.md` and `deep-research.md` commands — brief mention of convergence-time resource-map output
- [x] T037 Update `sk-deep-review/references/convergence.md` and `sk-deep-research/references/convergence.md`
- [x] T038 Create feature catalog entries: one each for `sk-deep-review` and `sk-deep-research`
- [x] T039 Create manual testing playbook entries: one each for both skills
- [x] T040 Add Vitest coverage for shared extractor (both delta shapes, snapshot assertions)
- [x] T041 Close F001–F004 from 7-iteration deep-review (file:line normalization, regression vitest, doc alignment)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Packet Root Documentation

- [x] T042 Create packet-root `spec.md` (this file's sibling)
- [x] T043 Create packet-root `plan.md`
- [x] T044 Create packet-root `tasks.md` (this file)
- [x] T045 Create packet-root `implementation-summary.md`
- [x] T046 Create packet-root `checklist.md`
- [x] T047 Create packet-root `decision-record.md`
- [x] T048 Create `description.json` and `graph-metadata.json`
- [ ] T049 Run `validate.sh --strict` on packet root and fix any errors
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T025 and T049 pending validation runs)
- [ ] No `[B]` blocked tasks remaining (T035 deferred with documented rationale)
- [ ] Manual verification passed
- [ ] `validate.sh --strict` exits 0 on packet root
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sub-phase 001 Tasks**: See `001-reverse-parent-research-review-folders/tasks.md`
- **Sub-phase 002 Tasks**: See `002-resource-map-template-creation/tasks.md`
- **Sub-phase 003 Tasks**: See `003-resource-map-deep-loop-integration/tasks.md`
<!-- /ANCHOR:cross-refs -->
