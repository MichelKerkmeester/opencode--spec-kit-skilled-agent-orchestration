---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/tasks]"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
description: "Unified task ledger. Task IDs preserved verbatim from the two originating phase packets: T401-T412 cover Workstream A (AGENTS execution guardrails); T001-T097 cover Workstreams B + C (canonical intake + middleware cleanup via milestones M1-M15)."
trigger_phrases:
  - "tasks"
  - "agent governance tasks"
  - "canonical intake tasks"
  - "command graph tasks"
  - "intake contract tasks"
  - "middleware cleanup tasks"
  - "m10 audit tasks"
  - "agents guardrail tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands"
    last_updated_at: "2026-04-24T17:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged task ledgers from both phase packets under one closeout"
    next_safe_action: "All tasks complete; packet validation passed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:004-agent-governance-tasks-merge-2026-04-24"
      session_id: "004-agent-governance-tasks-merge-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "T401-T412 cover Workstream A (AGENTS guardrail edits + verification + closeout)"
      - "T001-T051 cover M1-M9 (intake surface scaffolding, deep-research anchoring, parent delegation, hardening, structural parity, doc audit, middleware cleanup)"
      - "T052-T097 cover M10-M15 (downstream audit, shared intake module, plan.md expansion, complete.md refactor, resume.md routing, hard delete + sweep, deep-review remediation)"
---
# Tasks: Agent Governance And Commands

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[D]` | Deferred |
| `[P]` | Parallelizable |
| `[G]` | Gate or required checkpoint |
| `[B]` | Blocked |

**Task Format**: `T### [modifier] Description (primary file or artifact)`

Task IDs are kept identical to the originating packets for audit traceability: `T401-T412` belong to Workstream A; `T001-T097` belong to Workstreams B + C. Original ordering within each block is preserved.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Workstream A — AGENTS Setup

- [x] T401 Read `AGENTS_example_fs_enterprises.md` and capture the insertion point under `## 1. CRITICAL RULES`.
- [x] T402 Read `AGENTS.md` in the Public workspace and capture the parallel insertion point.
- [x] T403 Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` and capture the parallel insertion point.
- [x] T404 [G] Build the eight-point guardrail matrix plus the structure checklist (lean block shape, standalone section deletion, later-heading renumbering, direct transition into `### Tools & Search`, `§4 Confidence Framework` cross-reference), then freeze the Workstream-A scope to the three AGENTS files plus packet docs and verification only.

### M1 Intake Command Surface Scaffolding

- [x] T001 Draft the initial intake command card contract, folder-state vocabulary, and direct versus delegated setup flow (`start command surface`). Depends on: none. Evidence: completed in prior sessions M1 — `.opencode/command/spec_kit/start.md` (+312 new lines). (Later superseded in M14.)
- [x] T002 [P] Author the auto-mode intake workflow for create, repair, placeholder-upgrade, and optional memory-save branching (`spec_kit_start_auto.yaml`). Depends on: T001. Evidence: +474 new lines. (Later superseded in M14.)
- [x] T003 [P] Author the confirm-mode intake workflow with approvals around overwrite, repair, resume, and relationship capture (`spec_kit_start_confirm.yaml`). Depends on: T001. Evidence: +551 new lines. (Later superseded in M14.)
- [x] T004 Finalize the shared canonical trio publication versus optional memory-save contract as one logical implementation unit. Depends on: T002, T003. Evidence: shared state graph enforced in both YAML workflows.

### M2 Deep-Research Spec Check and Lock

- [x] T005 Patch the deep-research command card for advisory lock timing, late-INIT spec detection, and `folder_state` classification (`deep-research.md`). Depends on: T001. Evidence: `deep-research.md` (+7 net).
- [x] T006 [P] Patch the deep-research auto YAML INIT phase for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, `conflict-detected` branches. Depends on: T005. Evidence: `spec_kit_deep-research_auto.yaml` (+85 net).
- [x] T007 [P] Patch the deep-research confirm YAML INIT phase with the same branches plus confirm-mode conflict handling. Depends on: T005. Evidence: `spec_kit_deep-research_confirm.yaml` (+138 net).
- [x] T008 Create the canonical `spec_check_protocol` reference. Depends on: T005. Evidence: `spec_check_protocol.md` (+241 new lines).
- [x] T009 Update `sk-deep-research` to load and reference the new protocol. Depends on: T008. Evidence: `SKILL.md` (+3 net).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workstream A — Surgical AGENTS Updates

- [x] T405 Update `AGENTS_example_fs_enterprises.md` so `### Request Analysis & Execution` stays under Critical Rules, the old standalone request-analysis section is removed, duplicate support scaffolding is gone, the block keeps only `Flow` plus `#### Execution Behavior`, and later headings remain renumbered.
- [x] T406 Update `AGENTS.md` in the Public workspace with the same lean structural and wording changes.
- [x] T407 Update `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` with the same lean structural and wording changes.
- [x] T408 [G] Re-read all three edited AGENTS files and confirm the wording stays explicit, scoped, and safety-compatible; the request-analysis block stays under Critical Rules; duplicate scaffolding is gone; the block transitions directly into `### Tools & Search`; later headings remain renumbered; the `§4 Confidence Framework` reference is correct.

### M3 Post-Synthesis Write-Back

- [x] T010 Extend the deep-research command card with the generated-fence write-back and deferred-synthesis contract. Depends on: T005. Evidence: generated-fence write-back in `deep-research.md`.
- [x] T011 Patch the deep-research auto YAML SYNTHESIS phase to write or replace the generated findings block and emit typed audit events. Depends on: T006, T008, T010. Evidence: `step_writeback_spec_findings` + `step_release_lock` added.
- [x] T012 Patch the deep-research confirm YAML SYNTHESIS phase to gate write-back approval and deferred-sync recovery. Depends on: T007, T008, T010. Evidence: confirm-mode write-back approval and deferred-sync.

### M4 `/spec_kit:plan` and `/spec_kit:complete` Delegation

- [x] T013 Patch the `/spec_kit:plan` command card for inline intake delegation, returned fields, and healthy-folder bypass. Depends on: T004. Evidence: `plan.md` (+29 net).
- [x] T014 [P] Patch the plan auto YAML to inject intake for non-healthy states. Depends on: T013. Evidence: `spec_kit_plan_auto.yaml` (+52 net).
- [x] T015 [P] Patch the plan confirm YAML with same delegation states + parent-owned approval checkpoints. Depends on: T013. Evidence: `spec_kit_plan_confirm.yaml` (+63 net).
- [x] T016 Patch the `/spec_kit:complete` command card for the same inline delegation contract. Depends on: T004. Evidence: `complete.md` (+30 net).
- [x] T017 [P] Patch the complete auto YAML for delegated intake and no-regression bypass. Depends on: T016. Evidence: `spec_kit_complete_auto.yaml` (+52 net).
- [x] T018 [P] Patch the complete confirm YAML with delegated intake approval gates. Depends on: T016. Evidence: `spec_kit_complete_confirm.yaml` (+63 net).

### M5 and M6 Hardening, Audit, Staged Commit

- [x] T019 Implement normalized-topic dedupe, tracked seed-marker handling, and manual-relationship dedupe as one shared hardening unit. Depends on: T002, T003, T011, T012, T014, T015, T017, T018.
- [x] T020 Validate repair-mode and re-entry coverage against the five-state intake contract. Depends on: T019.
- [x] T021 Implement typed audit events and exact recovery messaging for delegated intake, canonical commit, lock conflicts, and optional memory-save branching. Depends on: T019, T020.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Workstream A — Packet Verification and Closeout

- [x] T409 Update `checklist.md` with direct evidence for all three AGENTS files, including the lean moved block, deleted section, removed duplicate scaffolding, renumbered headings, and corrected cross-reference.
- [x] T410 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet] --strict` for Workstream A closeout.
- [x] T411 Update `implementation-summary.md` with the exact AGENTS-file changes and packet verification results.
- [x] T412 Confirm the final file set stayed limited to the three AGENTS targets plus packet documentation and verification.

### M7 Structural Parity + sk-doc Compliance

- [x] T022 Run packet-local regression and strict validation, including deep-research on this same packet after implementation. Depends on: T009, T011, T012, T014, T015, T017, T018, T021. Evidence: `validate.sh --strict` returned `RESULT: PASSED`.
- [x] T023 Structural parity — command cards (NFR-Q01). Depends on: T005.
- [x] T024 Structural parity — YAML assets (NFR-Q02). Depends on: T006, T007.
- [x] T025 sk-doc validator (NFR-Q03). Depends on: all M1-M4 tasks. Evidence: final closeout batch validated 0 blocking issues.
- [x] T026 Non-regression of existing convention (NFR-Q04). Depends on: T014, T015, T017, T018.
- [x] T027 Structural overlap measurement (NFR-Q05). Depends on: T023, T024. Evidence: ADR-001 recorded overlaps `46.76%`, `15.51%`, `16.16%`.

### M8 README + SKILL Audit

- [x] T028 README & SKILL reference sweep (NFR-Q06, part 1). Depends on: M1-M7. Evidence: `113` matched README/SKILL files.
- [x] T029 README & SKILL content update (NFR-Q06, part 2). Depends on: T028.
- [x] T030 README & SKILL audit verification (NFR-Q06, part 3). Depends on: T029.

### M9 Middleware Cleanup — DELETE operations

- [x] T031 Delete `/spec_kit:handover` + `/spec_kit:debug` command files and 3 YAML assets. Depends on: T030.
- [x] T032 Delete the 4 runtime `@handover` agent mirrors. Depends on: T031.
- [x] T033 Delete the 4 runtime `@speckit` agent mirrors. Depends on: T031.
- [x] T034 Delete Gemini command TOML mirrors. Depends on: T031.

### M9 Middleware Cleanup — Responsibility Transfer (runs parallel with Workstream A T405-T407 on same AGENTS files)

- [x] T035 Update `CLAUDE.md`: distributed-governance rule added; `@debug` Task-tool dispatch; `@speckit`/`@handover` bullets removed. Depends on: T031-T034.
- [x] T036 Update `AGENTS.md` and `AGENTS_example_fs_enterprises.md` with same M9b edits (`@debug` Task-tool dispatch, distributed-governance rule, deprecated bullets removed). Coordinate with Workstream A edits on the same files. Depends on: T035.
- [x] T037 Update `.opencode/skill/system-spec-kit/SKILL.md`: replace `@speckit` exclusivity with distributed-governance rule. Depends on: T035.
- [x] T038 Update `.opencode/command/memory/save.md`: insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row. Depends on: T035.

### M9 — Orchestrate + Commands + YAML

- [x] T039 [P] Update 4 orchestrate runtime mirrors. Depends on: T032, T033.
- [x] T040 [P] Update the 7 live `spec_kit` command cards. Depends on: T031. Evidence: `:auto-debug` removed from `/spec_kit:complete`.
- [x] T041 [P] Update 10 YAML assets. Depends on: T031. Evidence: `:auto-debug` logic + handover-check steps removed.

### M9 — Agent descriptions

- [x] T042 [P] Update 4 `@debug` agent runtime files. Depends on: T031. Evidence: Task-tool dispatch language.
- [x] T043 [P] Update 4 ultra-think runtime files. Depends on: T033.

### M9 — Skills + References + Install Guides

- [x] T044 [P] Update `.opencode/README.md` + 3 install guides. Depends on: T035.
- [x] T045 [P] Update 2 command READMEs. Depends on: T031.
- [x] T046 [P] Update 11 system-spec-kit + sk-code-web reference documents. Depends on: T037.
- [x] T047 [P] Update 5 CLI skill references + cli-gemini README. Depends on: T032, T033.
- [x] T048 Update miscellaneous surfaces (`.opencode/command/improve/agent.md`, `sk-doc/assets/agents/agent_template.md`). Depends on: T032, T033.

### M9 — Verification sweep

- [x] T049 Run zero-reference grep sweep. Depends on: T031-T048. Evidence: ZERO matches for both `/spec_kit:(handover|debug)` and `@handover|@speckit`.
- [x] T050 Run preservation checks. Depends on: T031-T048. Evidence: existence checks passed for all 4 `@debug` + `@deep-research` files, preserved templates, skill directory, MCP server.
- [x] T051 Run `validate_document.py` on all modified markdown files and packet-strict validation. Depends on: T049, T050. Evidence: 0 blocking issues + `RESULT: PASSED`.

### M10 Downstream Audit + Shared Module

- [x] T052 Grep across `.opencode/command/` for `/spec_kit:start` and `spec_kit/start.md`. Depends on: T051. Evidence: 46 active forward-looking references.
- [x] T053 [P] Grep across `.opencode/skill/` for `/spec_kit:start`. Depends on: T051.
- [x] T054 [P] Grep across install guides and top-level READMEs. Depends on: T051.
- [x] T055 Locate harness skill-registry file. Depends on: T051. Evidence: `COMMAND_BOOSTS` dict at `.opencode/skill/system-spec-kit/SKILL.md:210`.
- [x] T056 Reconcile audit output against spec.md §3 Files-to-Change. Depends on: T052-T055.

### M10.3 Shared Intake Module

- [x] T057 Draft `.opencode/skill/system-spec-kit/references/intake-contract.md`. Depends on: T056. Evidence: 220 lines, 15 sections.
- [x] T058 Review draft against M1 intake logic; ensure 1:1 semantic coverage. Depends on: T057.
- [x] T059 Run sk-doc DQI validator on intake-contract reference. Depends on: T058. Evidence: PASS.
- [x] T060 Commit intake-contract reference to repo. Depends on: T059.

### M11 `/spec_kit:plan` Expansion

- [x] T061 Rewrite `plan.md` Setup Section (remove duplicate intake questions; keep folder-state detection as trigger for shared-module inclusion). Depends on: T060.
- [x] T062 Rewrite `plan.md` Step 1 Intake block to reference shared intake-contract module. Depends on: T061.
- [x] T063 Add `--intake-only` flag handling — halt after Step 1 completes. Depends on: T062.
- [x] T064 Verify `:with-phases` pre-workflow interaction (no regression). Depends on: T063.
- [x] T065 [P] Update `spec_kit_plan_auto.yaml` with reference-only language + `--intake-only` branch. Depends on: T063.
- [x] T066 [P] Update `spec_kit_plan_confirm.yaml`. Depends on: T063.

### M12 `/spec_kit:complete` Refactor

- [x] T067 Rewrite `complete.md` Section 0 to reference shared intake-contract module. Depends on: T060.
- [x] T068 Update Steps 5a/8/9 of `complete.md` to reflect reference-only pattern. Depends on: T067.
- [x] T069 [P] Update `spec_kit_complete_auto.yaml`. Depends on: T067.
- [x] T070 [P] Update `spec_kit_complete_confirm.yaml`. Depends on: T067.

### M13 `/spec_kit:resume` Routing

- [x] T071 Update `resume.md` routing: intake re-entry reasons → `/spec_kit:plan --intake-only` with prefilled state. Depends on: T060. Evidence: zero `/spec_kit:start` references present; no file change needed. Routing documented in forward-looking prose sweep.
- [x] T072 Audit `spec_kit_resume_*.yaml` (if present). Depends on: T055. Evidence: no resume YAMLs found.

### M14a Authoritative Doc Updates

- [x] T073 [P] Update `.opencode/skill/system-spec-kit/SKILL.md` (lines 121, 210, 564, 923, 932). Depends on: T055. Evidence: `COMMAND_BOOSTS` entry at line 210 removed.
- [x] T074 [P] Update `.opencode/skill/system-spec-kit/README.md`. Depends on: T055.
- [x] T075 [P] Update template READMEs: main, level_2, level_3, level_3+, addendum. Depends on: T055.
- [x] T076 [P] Update `.opencode/skill/sk-deep-research/SKILL.md` + `spec_check_protocol.md`. Depends on: T055.
- [x] T077 [P] Update `.opencode/skill/sk-deep-review/README.md` + `.opencode/skill/skill-advisor/README.md`. Depends on: T055.
- [x] T078 [P] Update cli-* agent-delegation refs: cli-claude-code, cli-codex, cli-gemini. Depends on: T055.
- [x] T079 [P] Update install guides. Depends on: T055.
- [x] T080 [P] Update top-level docs: `.opencode/README.md`, root `README.md`, `command/README.txt`, `command/spec_kit/README.txt`. Depends on: T055.
- [x] T081 Update `.opencode/specs/descriptions.json` line 4809. Depends on: T080.

### M14b Deletions

- [x] T082 Delete `.opencode/command/spec_kit/start.md`. Depends on: T073-T081.
- [x] T083 Delete `spec_kit_start_auto.yaml` + `spec_kit_start_confirm.yaml`. Depends on: T073-T081.
- [x] T084 Delete `.gemini/commands/spec_kit/start.toml`. Depends on: T073-T081.
- [x] T085 Remove `spec_kit:start` entry from `COMMAND_BOOSTS` in `SKILL.md:210`. Depends on: T055, T073.

### M14c Validation + M15 Remediation

- [x] T086 Run `validate.sh --strict`. Depends on: T082-T085. Evidence: CONDITIONAL — `SPEC_DOC_INTEGRITY` reports reflect packet's own docs legitimately referencing deprecated `start.md` to document supersession.
- [x] T087 Run sk-doc DQI validator on all canonical docs. Depends on: T086.
- [x] T088 Grep `/spec_kit:start` repo-wide; expect zero hits in forward-looking paths. Depends on: T082-T085. Evidence: PASS — zero active hits.
- [x] T089 Verify M1-M9 state preservation. Depends on: T086.
- [D] T090 Manual integration test: `/spec_kit:plan --intake-only` on scratch empty folder. Depends on: T089. Deferred: requires manual integration testing on live harness.
- [D] T091 Manual integration test: `/spec_kit:plan` full workflow on scratch populated folder (intake bypass). Depends on: T089. Deferred.
- [D] T092 Manual integration test: `/spec_kit:complete` on scratch empty folder. Depends on: T089. Deferred.
- [D] T093 Manual integration test: `/spec_kit:resume` with `reentry_reason: incomplete-interview`. Depends on: T089. Deferred.
- [D] T094 Idempotence test: `/spec_kit:plan --intake-only` twice on same folder. Depends on: T089. Deferred.
- [x] T095 Author changelog entry at `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`. Depends on: T086. Evidence: migration note `/spec_kit:start → /spec_kit:plan --intake-only` authored.
- [x] T096 Execute M15 deep-review remediation: 5 parallel Opus agents fix 12 findings. Depends on: T086. Evidence: `review/review-report.md` documents all findings resolved.
- [x] T097 Populate `implementation-summary.md` with verification evidence; run `/memory:save` on packet (packet closeout). Depends on: T096.
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies — Workstream A

| Task | Depends On | Reason |
|------|------------|--------|
| `T405-T407` | `T401-T404` | Edit plan depends on reading all three files and freezing scope first. |
| `T408` | `T405-T407` | Cross-file verification requires all three AGENTS edits plus the structural move and renumbering to exist. |
| `T409-T412` | `T407-T408` | Checklist, validation, summary, and final scope review depend on completed edits and evidence. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All `T401-T412` (Workstream A) marked `[x]`; all three AGENTS files contain all eight requested guardrails inside the lean moved Critical Rules subsection; later headings renumbered.
- [x] All `T001-T097` (Workstreams B + C) resolved: 92 `[x]`, 5 `[D]` (T090-T094 manual integration testing).
- [x] No `[B]` blocked tasks remaining.
- [x] Packet-local regression + strict validation passed (sk-doc validator PASS; packet strict validation PASSED with documented supersession warnings).
- [x] 26-file downstream sweep delivered via cli-copilot delegation; 4 hard-deletions executed; skill registry cleaned.
- [x] M15 deep-review remediation: all 12 findings resolved via 5 parallel Opus agents.
- [x] Zero forward-looking `/spec_kit:start` references; zero `/spec_kit:(handover|debug)` references; zero `@handover|@speckit` references.
- [x] Distributed-governance rule in effect across `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, system-spec-kit SKILL.
- [x] Same-session implementation summary published.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Shared Intake Contract**: `.opencode/skill/system-spec-kit/references/intake-contract.md`
- **Deep-Research Spec-Check Protocol**: `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`
- **Deep Review Report**: `review/004-agent-execution-guardrails-pt-01/`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS — Merged ledger
- T401-T412 cover Workstream A (12 atomic tasks: setup, three AGENTS patches, cross-file verification, closeout)
- T001-T097 cover Workstreams B + C (97 atomic tasks mapped to milestones M1-M15):
  - T001-T021: M1-M6 command creation + deep-research integration + hardening
  - T022-T030: M7-M8 structural parity + README audit
  - T031-T051: M9 middleware cleanup (15 deletions + ~50 modifications + zero-ref sweep)
  - T052-T060: M10 downstream audit + shared intake module
  - T061-T066: M11 plan.md expansion + --intake-only
  - T067-T070: M12 complete.md refactor
  - T071-T072: M13 resume.md routing (no edits needed)
  - T073-T081: M14a forward-looking doc updates (delegated to cli-copilot)
  - T082-T085: M14b deletions
  - T086-T095: M14c validation + manual tests + changelog
  - T096-T097: M15 deep-review remediation + closeout
-->
