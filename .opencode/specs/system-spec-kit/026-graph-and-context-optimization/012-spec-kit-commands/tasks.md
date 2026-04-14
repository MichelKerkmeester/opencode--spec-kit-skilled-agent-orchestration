---
title: "Tasks: Spec Kit Command Intake Refactor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "spec kit start"
  - "deep research spec check"
  - "delegated intake"
  - "spec kit commands"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-14T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored implementation task breakdown aligned to milestones M1-M6"
    next_safe_action: "Execute T001 through T022 in order"
    blockers: []
    key_files:
      - "start command surface"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-spec-kit-commands-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Implementation order is M1 -> M6 with regression at the end"
---
# Tasks: Spec Kit Command Intake Refactor

<!-- SPECKIT_LEVEL: 2 -->
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
## Phase 1: Setup

**M1: `/spec_kit:start` scaffolding**
- [ ] T001 Draft the `/spec_kit:start` command card contract, folder-state vocabulary, and direct versus delegated setup flow (`start command surface`). Depends on: none.
- [ ] T002 [P] Author the auto-mode `/start` workflow for create, repair, placeholder-upgrade, and optional memory-save branching (`.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`). Depends on: T001.
- [ ] T003 [P] Author the confirm-mode `/start` workflow with approvals around overwrite, repair, resume, and relationship capture (`.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`). Depends on: T001.
- [ ] T004 Finalize the shared `/start` canonical trio publication versus optional memory-save contract as one logical implementation unit. Depends on: T002, T003.

**M2: deep-research spec check and lock**
- [ ] T005 Patch the deep-research command card for advisory lock timing, late-INIT spec detection, and `folder_state` classification (`.opencode/command/spec_kit/deep-research.md`). Depends on: T001.
- [ ] T006 [P] Patch the deep-research auto YAML INIT phase for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected` branches (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`). Depends on: T005.
- [ ] T007 [P] Patch the deep-research confirm YAML INIT phase with the same branches plus confirm-mode conflict handling (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`). Depends on: T005.
- [ ] T008 Create the canonical spec-check protocol reference covering lock, seed-marker, host-anchor, generated-fence, audit, and idempotency rules (`spec_check_protocol reference`). Depends on: T005.
- [ ] T009 Update `sk-deep-research` to load and reference the new protocol (`.opencode/skill/sk-deep-research/SKILL.md`). Depends on: T008.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**M3: post-synthesis write-back**
- [ ] T010 Extend the deep-research command card with the generated-fence write-back and deferred-synthesis contract (`.opencode/command/spec_kit/deep-research.md`). Depends on: T005.
- [ ] T011 Patch the deep-research auto YAML SYNTHESIS phase to write or replace the generated findings block and emit typed audit events (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`). Depends on: T006, T008, T010.
- [ ] T012 Patch the deep-research confirm YAML SYNTHESIS phase to gate write-back approval and deferred-sync recovery (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`). Depends on: T007, T008, T010.

**M4: `/plan` and `/complete` delegation**
- [ ] T013 Patch the `/spec_kit:plan` command card for inline `/start` delegation, returned fields, and healthy-folder bypass (`.opencode/command/spec_kit/plan.md`). Depends on: T004.
- [ ] T014 [P] Patch the plan auto YAML to inject `/start` intake for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade` (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`). Depends on: T013.
- [ ] T015 [P] Patch the plan confirm YAML with the same delegation states plus parent-owned approval checkpoints (`.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`). Depends on: T013.
- [ ] T016 Patch the `/spec_kit:complete` command card for the same inline delegation contract (`.opencode/command/spec_kit/complete.md`). Depends on: T004.
- [ ] T017 [P] Patch the complete auto YAML for delegated intake and no-regression bypass (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`). Depends on: T016.
- [ ] T018 [P] Patch the complete confirm YAML with delegated intake approval gates (`.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`). Depends on: T016.

**M5 and M6: hardening, audit, and staged commit**
- [ ] T019 Implement normalized-topic dedupe, tracked seed-marker handling, and manual-relationship dedupe as one shared hardening unit. Depends on: T002, T003, T011, T012, T014, T015, T017, T018.
- [ ] T020 Validate repair-mode and re-entry coverage against the five-state intake contract (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`). Depends on: T019.
- [ ] T021 Implement typed audit events and exact recovery messaging for delegated intake, canonical commit, lock conflicts, and optional memory-save branching. Depends on: T019, T020.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Run packet-local regression and strict validation, including deep-research on this same packet after implementation. Depends on: T009, T011, T012, T014, T015, T017, T018, T021.
- [ ] T023 Structural parity — command cards (NFR-Q01): Run `diff -u .opencode/command/spec_kit/start.md .opencode/command/spec_kit/deep-research.md` and confirm the new `/start.md` mirrors the sibling's top-level sections, frontmatter fields (`description`, `argument-hint`, `allowed-tools`), callout style, and section ordering. Record the diff summary in `decision-record.md` or note ≥ 50% structural overlap. Depends on: T005 (or whichever task creates start.md).
- [ ] T024 Structural parity — YAML assets (NFR-Q02): Run `diff -u .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and confirm top-level key ordering (`role`, `purpose`, `action`, `operating_mode`, `user_inputs`, `field_handling`, `workflow`, `quality_gates`, `completion_report`), step-ID naming (`step_preflight_contract`, `step_create_directories`, etc.), and variable vocabulary (`spec_folder`, `execution_mode`) match verbatim where semantics overlap. Repeat for `_confirm.yaml`. Depends on: T006, T007 (or whichever tasks create the YAMLs).
- [ ] T025 sk-doc validator (NFR-Q03): Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new markdown file (`start.md`, `spec_check_protocol.md`) and every modified markdown file (`deep-research.md`, `plan.md`, `complete.md`, `sk-deep-research/SKILL.md`). Zero errors required. Template-inherited warnings acknowledged in output. Depends on: all M1-M4 tasks.
- [ ] T026 Non-regression of existing convention (NFR-Q04): Grep modified `plan.md`, `complete.md`, `deep-research.md` and their YAMLs to confirm no renamed step IDs, no removed anchor comments, no changed section ordering. `git diff --stat` the target files and verify only additions (no deletions) of existing section headers or step_ID lines. Depends on: T014, T015, T017, T018.
- [ ] T027 Structural overlap measurement (NFR-Q05): For each new file, compute `diff -u <new> <nearest-sibling> | grep -c "^[+-]"` vs total-line-count; overlap must be ≥ 50 percent (i.e. diff-changed lines ≤ 50% of total). Record measurement for each new file. Justify divergences > 50% in `decision-record.md` architecture section. Depends on: T023, T024.
- [ ] T028 README & SKILL reference sweep (NFR-Q06, part 1): Run `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` from repo root. Also explicitly include the root `README.md` in the sweep. Produce a list of every matched file. Expected matches (sanity): root `README.md`, `.opencode/README.md`, `.opencode/skill/system-spec-kit/{README,SKILL}.md`, `.opencode/skill/sk-deep-research/{README,SKILL}.md`, `.opencode/skill/sk-deep-review/{README,SKILL}.md`, `.opencode/skill/skill-advisor/README.md`, `.opencode/install_guides/README.md`, template READMEs. Record matched-file count and any surprising hits. Depends on: M1-M7.
- [ ] T029 README & SKILL content update (NFR-Q06, part 2): For each file from T028, update stale references. Required changes per file category:
      - Root `README.md`: add `/spec_kit:start` to command inventory; update `/spec_kit:deep-research` description to note spec.md anchoring; update `/spec_kit:plan` and `/spec_kit:complete` descriptions to note smart delegation; update command-chain diagram.
      - `.opencode/README.md`: same command inventory additions.
      - `system-spec-kit` README + SKILL: add `/spec_kit:start` to lifecycle description; reference `spec_check_protocol.md`.
      - `sk-deep-research` README + SKILL: document the `spec.md` integration, `folder_state` classification, and lock lifecycle.
      - `sk-deep-review`: only if it cross-references deep-research spec behavior.
      - `skill-advisor` README: if it lists speckit commands in a routing table, add `/start`.
      - `install_guides/README.md`: if it enumerates commands.
      - Template READMEs: only if they mention specific command names.
      Preserve NFR-Q04 discipline: additions and in-place clarifications only. Depends on: T028.
- [ ] T030 README & SKILL audit verification (NFR-Q06, part 3): Re-run the T028 sweep. For each matched file, grep for: (a) `/spec_kit:start` is mentioned where appropriate, (b) deep-research descriptions include `spec.md` or `spec_check_protocol` keyword, (c) plan/complete descriptions include `delegate`, `folder_state`, or `start` keyword, (d) no README still describes a stale state. Record verification-pass per file in `implementation-summary.md`. Depends on: T029.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Packet-local regression and strict validation evidence captured
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS
- 30 atomic tasks mapped to milestones M1-M8 inside the Level 2 section scaffold
- T001-T022: M1-M6 implementation tasks (scaffolding, deep-research integration, delegation, idempotency, audit)
- T023-T027: M7 structural parity + sk-doc compliance (NFR-Q01..Q05)
- T028-T030: M8 README & SKILL documentation reference audit (NFR-Q06)
- Mixes single-file tasks with a few explicit logical hardening units
- Ends with packet-local regression on this same spec folder
-->
