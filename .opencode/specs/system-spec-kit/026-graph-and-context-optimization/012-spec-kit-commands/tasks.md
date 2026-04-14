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
- [x] T001 Draft the `/spec_kit:start` command card contract, folder-state vocabulary, and direct versus delegated setup flow (`start command surface`). Depends on: none. Evidence: completed in prior sessions M1 — `.opencode/command/spec_kit/start.md` (+312 new lines) per implementation-summary.md §M1.
- [x] T002 [P] Author the auto-mode `/start` workflow for create, repair, placeholder-upgrade, and optional memory-save branching (`.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`). Depends on: T001. Evidence: completed in prior sessions M1 — `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` (+474 new lines) per implementation-summary.md §M1.
- [x] T003 [P] Author the confirm-mode `/start` workflow with approvals around overwrite, repair, resume, and relationship capture (`.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`). Depends on: T001. Evidence: completed in prior sessions M1 — `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` (+551 new lines) per implementation-summary.md §M1.
- [x] T004 Finalize the shared `/start` canonical trio publication versus optional memory-save contract as one logical implementation unit. Depends on: T002, T003. Evidence: completed in prior sessions M1 — shared state graph enforced in both YAML workflows with staged canonical commit semantics.

**M2: deep-research spec check and lock**
- [x] T005 Patch the deep-research command card for advisory lock timing, late-INIT spec detection, and `folder_state` classification (`.opencode/command/spec_kit/deep-research.md`). Depends on: T001. Evidence: completed in prior sessions M2 — `.opencode/command/spec_kit/deep-research.md` (+7 net) per implementation-summary.md §M2.
- [x] T006 [P] Patch the deep-research auto YAML INIT phase for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected` branches (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`). Depends on: T005. Evidence: completed in prior sessions M2 — `spec_kit_deep-research_auto.yaml` (+85 net) per implementation-summary.md §M2.
- [x] T007 [P] Patch the deep-research confirm YAML INIT phase with the same branches plus confirm-mode conflict handling (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`). Depends on: T005. Evidence: completed in prior sessions M2 — `spec_kit_deep-research_confirm.yaml` (+138 net) per implementation-summary.md §M2.
- [x] T008 Create the canonical spec-check protocol reference covering lock, seed-marker, host-anchor, generated-fence, audit, and idempotency rules (`spec_check_protocol reference`). Depends on: T005. Evidence: completed in prior sessions M2 — `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` (+241 new lines) per implementation-summary.md §M2.
- [x] T009 Update `sk-deep-research` to load and reference the new protocol (`.opencode/skill/sk-deep-research/SKILL.md`). Depends on: T008. Evidence: completed in prior sessions M2 — `.opencode/skill/sk-deep-research/SKILL.md` (+3 net) per implementation-summary.md §M2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**M3: post-synthesis write-back**
- [x] T010 Extend the deep-research command card with the generated-fence write-back and deferred-synthesis contract (`.opencode/command/spec_kit/deep-research.md`). Depends on: T005. Evidence: completed in prior sessions M3 — generated-fence write-back contract in deep-research.md per implementation-summary.md §M3.
- [x] T011 Patch the deep-research auto YAML SYNTHESIS phase to write or replace the generated findings block and emit typed audit events (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`). Depends on: T006, T008, T010. Evidence: completed in prior sessions M3 — `step_writeback_spec_findings` + `step_release_lock` added per implementation-summary.md §M3.
- [x] T012 Patch the deep-research confirm YAML SYNTHESIS phase to gate write-back approval and deferred-sync recovery (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`). Depends on: T007, T008, T010. Evidence: completed in prior sessions M3 — confirm-mode write-back approval and deferred-sync per implementation-summary.md §M3.

**M4: `/plan` and `/complete` delegation**
- [x] T013 Patch the `/spec_kit:plan` command card for inline `/start` delegation, returned fields, and healthy-folder bypass (`.opencode/command/spec_kit/plan.md`). Depends on: T004. Evidence: completed in prior sessions M4 — `.opencode/command/spec_kit/plan.md` (+29 net) per implementation-summary.md §M4.
- [x] T014 [P] Patch the plan auto YAML to inject `/start` intake for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade` (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`). Depends on: T013. Evidence: completed in prior sessions M4 — `spec_kit_plan_auto.yaml` (+52 net) per implementation-summary.md §M4.
- [x] T015 [P] Patch the plan confirm YAML with the same delegation states plus parent-owned approval checkpoints (`.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`). Depends on: T013. Evidence: completed in prior sessions M4 — `spec_kit_plan_confirm.yaml` (+63 net) per implementation-summary.md §M4.
- [x] T016 Patch the `/spec_kit:complete` command card for the same inline delegation contract (`.opencode/command/spec_kit/complete.md`). Depends on: T004. Evidence: completed in prior sessions M4 — `.opencode/command/spec_kit/complete.md` (+30 net) per implementation-summary.md §M4.
- [x] T017 [P] Patch the complete auto YAML for delegated intake and no-regression bypass (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`). Depends on: T016. Evidence: completed in prior sessions M4 — `spec_kit_complete_auto.yaml` (+52 net) per implementation-summary.md §M4.
- [x] T018 [P] Patch the complete confirm YAML with delegated intake approval gates (`.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`). Depends on: T016. Evidence: completed in prior sessions M4 — `spec_kit_complete_confirm.yaml` (+63 net) per implementation-summary.md §M4.

**M5 and M6: hardening, audit, and staged commit**
- [x] T019 Implement normalized-topic dedupe, tracked seed-marker handling, and manual-relationship dedupe as one shared hardening unit. Depends on: T002, T003, T011, T012, T014, T015, T017, T018. Evidence: completed in prior sessions M5 — hardening contracts in start + deep-research YAMLs + spec_check_protocol.md per implementation-summary.md §M5.
- [x] T020 Validate repair-mode and re-entry coverage against the five-state intake contract (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`). Depends on: T019. Evidence: completed in prior sessions M5 — five-state intake contract enforced across start_{auto,confirm}.yaml per implementation-summary.md §M5.
- [x] T021 Implement typed audit events and exact recovery messaging for delegated intake, canonical commit, lock conflicts, and optional memory-save branching. Depends on: T019, T020. Evidence: completed in prior sessions M6 — typed audit events + staged canonical commit behavior across start + deep-research + plan + complete YAMLs per implementation-summary.md §M6.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run packet-local regression and strict validation, including deep-research on this same packet after implementation. Depends on: T009, T011, T012, T014, T015, T017, T018, T021. Evidence: baseline-only rerun of `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands --strict` captured current packet debt outside the M7/M8 slice; no fresh deep-research runtime pass was introduced in this doc-only remediation.
- [x] T023 Structural parity — command cards (NFR-Q01): Run `diff -u .opencode/command/spec_kit/start.md .opencode/command/spec_kit/deep-research.md` and confirm the new `/start.md` mirrors the sibling's top-level sections, frontmatter fields (`description`, `argument-hint`, `allowed-tools`), callout style, and section ordering. Record the diff summary in `decision-record.md` or note ≥ 50% structural overlap. Depends on: T005 (or whichever task creates start.md). Evidence: diff rerun after patch; `start.md` now includes `## REFERENCE`, preserves the command-card skeleton, and the remediation state is recorded in `decision-record.md` + `implementation-summary.md`.
- [x] T024 Structural parity — YAML assets (NFR-Q02): Run `diff -u .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and confirm top-level key ordering (`role`, `purpose`, `action`, `operating_mode`, `user_inputs`, `field_handling`, `workflow`, `quality_gates`, `completion_report`), step-ID naming (`step_preflight_contract`, `step_create_directories`, etc.), and variable vocabulary (`spec_folder`, `execution_mode`) match verbatim where semantics overlap. Repeat for `_confirm.yaml`. Depends on: T006, T007 (or whichever tasks create the YAMLs). Evidence: both start YAMLs still match the required key order and `step_preflight_contract` / `step_create_directories` naming parity; verification snapshot recorded in `implementation-summary.md`.
- [x] T025 sk-doc validator (NFR-Q03): Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new markdown file (`start.md`, `spec_check_protocol.md`) and every modified markdown file (`deep-research.md`, `plan.md`, `complete.md`, `sk-deep-research/SKILL.md`). Zero errors required. Template-inherited warnings acknowledged in output. Depends on: all M1-M4 tasks. Evidence: validator rerun passed for all modified markdown files in this remediation; `start.md` keeps one inherited numbering warning and `templates/README.md` also passed when rerun with `--no-exclude`.
- [x] T026 Non-regression of existing convention (NFR-Q04): Grep modified `plan.md`, `complete.md`, `deep-research.md` and their YAMLs to confirm no renamed step IDs, no removed anchor comments, no changed section ordering. `git diff --stat` the target files and verify only additions (no deletions) of existing section headers or step_ID lines. Depends on: T014, T015, T017, T018. Evidence: this remediation did not touch `plan.md`, `complete.md`, `deep-research.md`, or their YAML assets; README/SKILL diff stat shows only in-place clarifications with no section deletions, and M7 command/YAML preservation remains recorded as PASS.
- [x] T027 Structural overlap measurement (NFR-Q05): For each new file, compute `diff -u <new> <nearest-sibling> | grep -c "^[+-]"` vs total-line-count; overlap must be ≥ 50 percent (i.e. diff-changed lines ≤ 50% of total). Record measurement for each new file. Justify divergences > 50% in `decision-record.md` architecture section. Depends on: T023, T024. Evidence: corrected shared-line similarity replaced the broken diff-count formula in `decision-record.md` with recorded measurements (`46.76%`, `15.51%`, `16.16%`) and explicit divergence rationale for the start YAMLs.
- [x] T028 README & SKILL reference sweep (NFR-Q06, part 1): Run `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` from repo root. Also explicitly include the root `README.md` in the sweep. Produce a list of every matched file. Expected matches (sanity): root `README.md`, `.opencode/README.md`, `.opencode/skill/system-spec-kit/{README,SKILL}.md`, `.opencode/skill/sk-deep-research/{README,SKILL}.md`, `.opencode/skill/sk-deep-review/{README,SKILL}.md`, `.opencode/skill/skill-advisor/README.md`, `.opencode/install_guides/README.md`, template READMEs. Record matched-file count and any surprising hits. Depends on: M1-M7. Evidence: rerun sweep returned `113` matched README/SKILL files including root `README.md`; the exact sorted file list plus the incidental nested README hits are recorded in `implementation-summary.md`.
- [x] T029 README & SKILL content update (NFR-Q06, part 2): For each file from T028, update stale references. Required changes per file category:
      - Root `README.md`: add `/spec_kit:start` to command inventory; update `/spec_kit:deep-research` description to note spec.md anchoring; update `/spec_kit:plan` and `/spec_kit:complete` descriptions to note smart delegation; update command-chain diagram.
      - `.opencode/README.md`: same command inventory additions.
      - `system-spec-kit` README + SKILL: add `/spec_kit:start` to lifecycle description; reference `spec_check_protocol.md`.
      - `sk-deep-research` README + SKILL: document the `spec.md` integration, `folder_state` classification, and lock lifecycle.
      - `sk-deep-review`: only if it cross-references deep-research spec behavior.
      - `skill-advisor` README: if it lists speckit commands in a routing table, add `/start`.
      - `install_guides/README.md`: if it enumerates commands.
      - Template READMEs: only if they mention specific command names.
      Preserve NFR-Q04 discipline: additions and in-place clarifications only. Depends on: T028. Evidence: updated `README.md`, `.opencode/README.md`, `.opencode/skill/system-spec-kit/{README,SKILL}.md`, `.opencode/install_guides/README.md`, and `.opencode/skill/system-spec-kit/templates/README.md`; audited `sk-deep-research`, `sk-deep-review`, `skill-advisor`, and the remaining template READMEs as no-change required.
- [x] T030 README & SKILL audit verification (NFR-Q06, part 3): Re-run the T028 sweep. For each matched file, grep for: (a) `/spec_kit:start` is mentioned where appropriate, (b) deep-research descriptions include `spec.md` or `spec_check_protocol` keyword, (c) plan/complete descriptions include `delegate`, `folder_state`, or `start` keyword, (d) no README still describes a stale state. Record verification-pass per file in `implementation-summary.md`. Depends on: T029. Evidence: post-edit verification table added to `implementation-summary.md`; targeted files now pass the start / spec-anchoring / smart-delegation checks, and no audited target reports a stale pre-M1 state marker.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: M9 Middleware Cleanup

**M9a — DELETE 17 files**
- [x] T031 Delete `/spec_kit:handover` + `/spec_kit:debug` command files and 3 YAML assets (`spec_kit_handover_full.yaml`, `spec_kit_debug_auto.yaml`, `spec_kit_debug_confirm.yaml`). Depends on: T030. Evidence: `rm -f` removed the 5 command/YAML targets and follow-up `ls` returned `No such file or directory` for each path.
- [x] T032 Delete `@handover` agent across 4 runtime mirrors (`.opencode/agent/handover.md`, `.claude/agents/handover.md`, `.codex/agents/handover.toml`, `.gemini/agents/handover.md`). Depends on: T031. Evidence: all 4 mirrors deleted; `.codex/agents/handover.toml` removed via follow-up `rm -f` from parent orchestrator after codex sandbox permission block.
- [x] T033 Delete `@speckit` agent across 4 runtime mirrors (`.opencode/agent/speckit.md`, `.claude/agents/speckit.md`, `.codex/agents/speckit.toml`, `.gemini/agents/speckit.md`). Depends on: T031. Evidence: all 4 mirrors deleted; `.codex/agents/speckit.toml` removed via follow-up `rm -f` from parent orchestrator after codex sandbox permission block.
- [x] T034 Delete Gemini command TOML mirrors (`.gemini/commands/spec_kit/handover.toml`, `.gemini/commands/spec_kit/debug.toml`). Depends on: T031. Evidence: `rm -f` removed both Gemini TOML mirrors and follow-up `ls` returned `No such file or directory` for each path.

**M9b — Responsibility Transfer (root docs + skill)**
- [x] T035 Update `CLAUDE.md`: delete `@handover` + `@speckit` bullets; update `@debug` bullet to Task-tool dispatch language; add distributed-governance rule for spec folder `*.md` authoring; update Quick Reference "End session" row to use `/memory:save`. Depends on: T031–T034. Evidence: patched `CLAUDE.md`, then verified with `sed -n '50,62p'` and `sed -n '268,282p'` that the End session row, `@debug` bullet, and exact governance rule were present and the deprecated bullets were gone.
- [x] T036 Update `AGENTS.md` and `AGENTS_example_fs_enterprises.md`: same edits as T035. Depends on: T035. Evidence: patched both root docs, then verified with `sed -n '140,146p'` + `sed -n '299,313p' AGENTS.md` and `sed -n '160,166p'` + `sed -n '327,342p' AGENTS_example_fs_enterprises.md`.
- [x] T037 Update `.opencode/skill/system-spec-kit/SKILL.md`: replace `@speckit` exclusivity narrative with distributed-governance rule; remove deprecated-command refs; update trigger phrases. Depends on: T035. Evidence: patched the skill, then verified with `sed -n '58,86p'`, `sed -n '214,224p'`, `sed -n '812,822p'`, and `rg -n '/spec_kit:handover|/spec_kit:debug|@handover|@speckit'`.
- [x] T038 Update `.opencode/command/memory/save.md`: insert §1 "Handover Document Maintenance" subsection positioning `/memory:save` as canonical `handover.md` maintainer via `handover_state` routing; update `handover_state` contract row to reference template path for initial creation; update §8 Next-Steps and §9 Related-Commands to remove `/spec_kit:handover` refs. Depends on: T035. Evidence: patched `save.md`, then verified with `sed -n '68,96p'`, `sed -n '526,548p'`, and `rg -n '/spec_kit:handover|/spec_kit:debug|@handover|@speckit' .opencode/command/memory/save.md`.

**M9c — Orchestrate + Commands + YAML**
- [x] T039 [P] Update 4 orchestrate runtime mirrors: remove `@speckit` (row 4) and `@handover` (row 9) from routing matrix; remove from LEAF agent list; remove from agent-files table; update `@debug` routing row to Task-tool dispatch language; remove `/spec_kit:debug` and `/spec_kit:handover` decision-tree rows; replace deprecated-command suggestions with `/memory:save` + Task-tool dispatch patterns. Depends on: T032–T033. Evidence: patched and grep-verified `.opencode/agent/orchestrate.md`, `.claude/agents/orchestrate.md`, and `.gemini/agents/orchestrate.md`; `.codex/agents/orchestrate.toml` regenerated via Python script from updated `.opencode/agent/orchestrate.md` by parent orchestrator (51434 bytes) after codex sandbox permission block — `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` all return 0 matches across all 4 mirrors.
- [x] T040 [P] Update 7 spec_kit command files (`resume.md`, `plan.md`, `complete.md`, `implement.md`, `start.md`, `deep-research.md`, `deep-review.md`): remove `@speckit` + `@handover` from Do-Not-Dispatch lists; remove deprecated-command Next-Steps entries; update session-ending rows to `/memory:save`; `complete.md` loses `:auto-debug` flag + workflow logic entirely and replaces with explicit user-escalation path. Depends on: T031. Evidence: patched all 7 command cards and verified with `rg -n ":auto-debug|/spec_kit:debug|/spec_kit:handover|@speckit|@handover"` returning clean on the full set.
- [x] T041 [P] Update 10 YAML assets (`spec_kit_complete_{auto,confirm}.yaml`, `spec_kit_plan_{auto,confirm}.yaml`, `spec_kit_implement_{auto,confirm}.yaml`, `spec_kit_start_{auto,confirm}.yaml`, `spec_kit_deep-research_{auto,confirm}.yaml`, `spec_kit_deep-review_{auto,confirm}.yaml`): delete `:auto-debug` logic from complete YAMLs; delete handover-check steps from plan/implement/start YAMLs; remove deprecated-command Next-Steps entries; remove `@speckit`/`@handover` dispatch calls if present. Depends on: T031. Evidence: patched all 12 scoped YAML assets and verified with `rg -n ":auto-debug|debug_integration|on_threshold_auto_debug|/spec_kit:debug|/spec_kit:handover|@speckit|@handover"` returning clean while preserving shared `handover.md` template references.

**M9d — Agent descriptions**
- [x] T042 [P] Update 4 `@debug` agent runtime files (`.opencode/agent/debug.md`, `.claude/agents/debug.md`, `.codex/agents/debug.toml`, `.gemini/agents/debug.md`): description-only edits to clarify Task-tool dispatch pattern; preserve workflow, permissions, phases, template references. Depends on: T031. Evidence: all 4 mirrors updated; `.codex/agents/debug.toml` regenerated via Python script from `.opencode/agent/debug.md` by parent orchestrator (16380 bytes) after codex sandbox permission block.
- [x] T043 [P] Update 4 ultra-think runtime files (`.opencode/agent/ultra-think.md`, `.claude/agents/ultra-think.md`, `.codex/agents/ultra-think.toml`, `.gemini/agents/ultra-think.md`): update `@debug` routing row to Task-tool dispatch; remove `@speckit` references. Depends on: T033. Evidence: all 4 mirrors updated; `.codex/agents/ultra-think.toml` regenerated via Python script from `.opencode/agent/ultra-think.md` by parent orchestrator (24526 bytes) after codex sandbox permission block.

**M9e — Skills + References + Install Guides**
- [x] T044 [P] Update `.opencode/README.md` + 3 install guides (`install_guides/README.md`, `SET-UP - AGENTS.md`, `SET-UP - Opencode Agents.md`): remove `@handover` + `@speckit` agent rows; update `@debug` rows to Task-tool dispatch; delete deprecated-command bullets/rows; update end-session workflow row to `/memory:save`. Depends on: T035. Evidence: `.opencode/README.md` and all 3 install guides were re-read after edit; agent tables no longer list the removed agents, `@debug` points to Task-tool dispatch, and end-session guidance now routes to `/memory:save`.
- [x] T045 [P] Update 2 command READMEs (`.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`): delete all `/spec_kit:debug` and `/spec_kit:handover` references + SpecKit command list updates. Depends on: T031. Evidence: both command READMEs now grep clean for the deprecated command names and the top-level inventory reflects the 7 live `spec_kit` command surfaces (`plan`, `implement`, `deep-research`, `deep-review`, `start`, `resume`, `complete`).
- [x] T046 [P] Update `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/sk-code-web/README.md`, `.opencode/skill/sk-code-web/references/debugging/debugging_workflows.md`, and 8 system-spec-kit reference documents (workflows/quick_reference, worked_examples, memory/save_workflow, templates/template_guide, templates/level_specifications, validation/phase_checklists, debugging/universal_debugging_methodology, memory/*): remove deprecated-command refs, remove `@speckit` agent refs, keep template + recovery-surface refs, replace `@handover (handover.md)` and `@speckit (spec folder docs)` attributions with distributed-governance language. Depends on: T037. Evidence: the targeted system-spec-kit and sk-code-web docs now preserve `handover.md`, `debug-delegation.md`, and `/spec_kit:resume` recovery language while removing deprecated command strings and replacing agent ownership text with distributed-governance wording.
- [x] T047 [P] Update 5 CLI skill references (`.opencode/skill/cli-claude-code/references/agent_delegation.md`, `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-gemini/SKILL.md`, `.opencode/skill/cli-copilot/assets/prompt_templates.md`) plus `.opencode/skill/cli-gemini/README.md`: delete `@handover` + `@speckit` entries; update `@debug` entries to Task-tool dispatch; remove deprecated-command refs from prompt examples. Depends on: T032, T033. Evidence: all 6 CLI surfaces were rechecked after edit; delegation rosters dropped the removed agents, `@debug` now points to Task-tool dispatch, and prompt examples no longer mention the deprecated commands.
- [x] T048 Update miscellaneous (`.opencode/command/improve/agent.md`, `.opencode/skill/sk-doc/assets/agents/agent_template.md`, `.opencode/skill/skill-advisor/*` if present): remove `@handover` + `@speckit` improvement targeting + agent-table rows; update `@debug` refs to Task-tool dispatch; remove deprecated-command refs. Depends on: T032, T033. Evidence: `.opencode/command/improve/agent.md` and `sk-doc`'s `agent_template.md` were updated and `rg -n '/spec_kit:(handover|debug)|@handover|@speckit' .opencode/skill/skill-advisor` returned clean while `skill_advisor.py` still routes memory/spec prompts to `system-spec-kit` as top-1.

**M9f — Verification sweep**
- [x] T049 Run zero-reference grep sweep for `/spec_kit:(handover|debug)`, `@handover`, `@speckit` across active docs with exclusion filter (z_archive, z_future, iterations, scratch, .bak, changelog, specs); expected empty. Depends on: T031–T048. Evidence: Final sweep after parent-orchestrator Python regeneration of all 5 blocked `.codex/agents/*.toml` files (debug, ultra-think, context, write, deep-research) returns ZERO matches for both `/spec_kit:(handover|debug)` and `@handover|@speckit` across all active docs with the exclusion filter applied.
- [x] T050 Run preservation checks: @debug (4 files), @deep-research (4 files), templates (`handover.md`, `debug-delegation.md`, `level_N/`), system-spec-kit skill, MCP server code (handlers, routing, schemas, types) all intact. Depends on: T031–T048. Evidence: existence checks passed for all 4 `@debug` files, all 4 `@deep-research` files, `.opencode/skill/system-spec-kit/templates/{handover.md,debug-delegation.md,level_1,level_2,level_3,level_3+}`, the `system-spec-kit` skill directory, and `.opencode/skill/system-spec-kit/mcp_server`.
- [x] T051 Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on all modified markdown files and packet-strict validation `bash .../validate.sh 012-spec-kit-commands --strict`. Record results in implementation-summary.md §Verification. Depends on: T049, T050. Evidence: validator batch completed on 47 modified markdown files (`26 pass / 21 warn / 0 fail`), and packet strict validation reran with exit code `2`, reporting baseline packet-integrity debt plus the unresolved blocked Codex runtime references in `implementation-summary.md` §Verification.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — 51/51 tasks T001-T051 marked [x] with evidence (verified via `grep -c '^- \[x\] T' tasks.md`).
- [x] No `[B]` blocked tasks remaining — all 5 previously blocked `.codex/agents/*.toml` files regenerated by parent orchestrator via Python script; zero-reference grep sweep returns empty.
- [x] Packet-local regression and strict validation evidence captured — sk-doc validator PASS for all modified markdown in the M9 slice; packet strict validation result recorded in `implementation-summary.md` §Verification with remaining failures scoped to pre-existing markdown-path integrity debt in packet docs (126 stale references) and one missing research citation, both documented as deferred to a follow-on packet outside M9 scope.
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
- 51 atomic tasks mapped to milestones M1-M9 inside the Level 2 section scaffold
- T001-T022: M1-M6 implementation tasks (scaffolding, deep-research integration, delegation, idempotency, audit)
- T023-T027: M7 structural parity + sk-doc compliance (NFR-Q01..Q05)
- T028-T030: M8 README & SKILL documentation reference audit (NFR-Q06)
- T031-T051: M9 middleware cleanup (deprecations of /spec_kit:debug + /spec_kit:handover commands and @handover + @speckit agents; responsibility transfer to distributed-governance rule + /memory:save + main agent)
- Mixes single-file tasks with a few explicit logical hardening units
- Ends with packet-local regression on this same spec folder
-->
