---
title: "Verification Checklist: Spec Kit Command Intake Refactor [template:level_2/checklist.md]"
description: "Verification Date: 2026-04-14"
trigger_phrases:
  - "verification"
  - "checklist"
  - "spec kit start"
  - "deep research spec check"
  - "spec kit commands"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-14T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed source-contract verification sweep across CHK-001 through CHK-054"
    next_safe_action: "Closeout"
    blockers: []
    key_files:
      - "start command surface"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-spec-kit-commands-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P0 maps REQ-001 through REQ-006 plus REQ-011"
      - "P1 maps REQ-007 through REQ-010"
      - "P2 maps all NFRs and success criteria"
---
# Verification Checklist: Spec Kit Command Intake Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001: Source contract verified. [EVIDENCE: `rg -n 'folder_state|spec_check_result|deep-research.lock'` returned 34 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`, `.opencode/command/spec_kit/deep-research.md`, and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, including the advisory lock path, `folder_state` enum, and typed `spec_check_result` audit event.]
- [x] CHK-002 [P0] REQ-002: Source contract verified. [EVIDENCE: `rg -n 'spec_seed_created|deep-research seed|seed.?marker'` returned 12 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, including `spec_seed_created`, DR seed markers, and the pre-LOOP seeding path.]
- [x] CHK-007 [P0] REQ-011: Source contract verified. [EVIDENCE: `rg -n 'resume_question_id|repair_mode|reentry_reason|start_state'` returned 75 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml`, covering re-entry state, repair-mode binding, and tracked-seed-marker resume semantics.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] REQ-007: Source contract verified. [EVIDENCE: `rg -n 'depends_on|related_to|supersedes|packet_id.*reason.*source'` returned 35 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml`, including grouped relation capture, `{ packet_id, reason, source, spec_folder?, title? }` shape, and per-relation `packet_id` dedupe.]
- [x] CHK-009 [P1] REQ-008: Source contract verified. [EVIDENCE: `rg -n 'recommend-level|level_recommendation|selected_level'` returned 53 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml`, showing `recommend-level.sh` invocation plus separate `level_recommendation` and `selected_level` bindings/audit events.]
- [x] CHK-010 [P1] REQ-009: Source contract verified. [EVIDENCE: `rg -n 'empty-folder|partial-folder|repair-mode|placeholder-upgrade|populated-folder'` returned 15 matches in `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` and 10 in `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`, with the same five-state graph, returned `start_state`, and shared contract vocabulary in both modes.]
- [x] CHK-011 [P1] REQ-010: Source contract verified. [EVIDENCE: `rg -n 'dedupe|idempotent|normalized.topic|generated.fence'` returned 37 matches across `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, covering normalized-topic no-op logic, relationship dedupe, and generated-fence replacement rules.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] REQ-003: Source contract verified. [EVIDENCE: `rg -n 'spec_mutation_conflict|normalized.topic|pre-init'` returned 27 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, covering normalized-topic dedupe, bounded pre-init updates, and fail-closed `spec_mutation_conflict`.]
- [x] CHK-004 [P0] REQ-004: Source contract verified. [EVIDENCE: `rg -n 'BEGIN GENERATED|spec-findings|END GENERATED'` returned 4 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/command/spec_kit/deep-research.md`, showing the machine-owned `deep-research/spec-findings` fence and write-back contract.]
- [x] CHK-005 [P0] REQ-005: Source contract verified. [EVIDENCE: `rg -n 'canonical.trio|spec.md.*description.json.*graph-metadata.json|staged.canonical.commit'` returned 55 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, covering canonical trio publication and the separate optional memory-save branch.]
- [x] CHK-006 [P0] REQ-006: Source contract verified. [EVIDENCE: `rg -n 'feature_description|spec_path|selected_level|repair_mode|manual_relationships|delegated.intake'` returned 27 matches across `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`, binding the delegated `/start` intake fields back into parent `/plan` and `/complete` flows.]
- [x] CHK-020 [P2] NFR-P01: Source contract verified structurally — `rg -n 'consolidated\\.prompt|prompts:' .opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` returned 0 matches, `spec_kit_start_auto.yaml` exposes only 1 conditional `prompt:` path, and `spec_kit_start_confirm.yaml` centralizes prompting through approval gates plus conditional question prompts instead of multi-round prompt arrays.
- [x] CHK-021 [P2] NFR-P02: Source contract verified via `rg -n 'single_consolidated_prompt|approval_source|folder_state != populated|folder_state == populated'` — 22 matches across `.opencode/command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml`, `.opencode/command/spec_kit/assets/spec_kit_complete_{auto,confirm}.yaml`, `.opencode/command/spec_kit/plan.md`, and `.opencode/command/spec_kit/complete.md`, showing a single consolidated delegated intake path plus healthy-folder no-regression skip branches.
- [x] CHK-028 [P2] SC-001: Source contract verified via `rg -n 'spec_seed_created|seed_markers|DR-SEED|before LOOP|LOOP begins'` — 25 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, encoding pre-LOOP seeding and tracked DR seed markers.
- [x] CHK-029 [P2] SC-002: Source contract verified via `rg -n 'normalized.topic|spec_preinit_context_added|spec_preinit_context_deduped|BEGIN GENERATED|END GENERATED|spec-findings'` — 36 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`, `.opencode/command/spec_kit/deep-research.md`, and `spec_check_protocol.md`, covering bounded pre-init mutation plus single generated-fence replacement.
- [x] CHK-030 [P2] SC-003: Source contract verified via `rg -n 'canonical.trio|description.json|graph-metadata.json|validate.sh|schema|validator'` — 107 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, including trio publication, validator references, and schema-aware metadata generation.
- [x] CHK-031 [P2] SC-004: Source contract verified via `rg -n 'folder_state != populated|single_consolidated_prompt|start_delegation_completed|feature_description|spec_path|selected_level|repair_mode|manual_relationships'` — 50 matches across `.opencode/command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` and `.opencode/command/spec_kit/plan.md`, showing inline `/start` absorption before the planning workflow resumes.
- [x] CHK-032 [P2] SC-005: Source contract verified via `rg -n 'folder_state != populated|single_consolidated_prompt|start_delegation_completed|selectedLevel|repairMode|Healthy folder detected'` — 11 matches across `.opencode/command/spec_kit/assets/spec_kit_complete_{auto,confirm}.yaml` and `.opencode/command/spec_kit/complete.md`, showing the same inline delegation shape and healthy-folder bypass for `/complete`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P2] NFR-S01: Source contract verified via `rg -n 'anchor|anchors_touched|host_anchor|generated findings fence|bounded'` — 63 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`, `.opencode/command/spec_kit/deep-research.md`, and `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, explicitly limiting mutations to anchor-bounded updates and generated-fence replacement.
- [x] CHK-023 [P2] NFR-S02: Source contract verified via `rg -n 'spec_mutation|audit|anchors_touched|diff_summary'` — 31 matches across `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` and `spec_check_protocol.md`, showing `spec_mutation` audit records with both `anchors_touched` and `diff_summary`.
- [x] CHK-024 [P2] NFR-S03: Source contract verified via `rg -n 'packet_id|reason|source|spec_folder\\?|title\\?'` — 57 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, encoding the required manual relationship object schema and optional denormalized hints.
- [x] CHK-025 [P2] NFR-S04: Source contract verified via `rg -n 'start_delegation_triggered|start_delegation_completed|relationship_captured|canonical_trio_committed|memory_save_branched|spec_check_result'` — 46 matches across the start, plan, complete, and deep-research YAML surfaces plus `spec_check_protocol.md`, covering typed audit events for intake, re-entry, relationships, canonical commit, and optional save branching.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P2] SC-006: Source contract verified via `rg -n 'folder_state == populated|Healthy folder detected|preserve the current Step 1 behavior|preserve the current prompt unchanged'` — 14 matches across `.opencode/command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml`, `.opencode/command/spec_kit/assets/spec_kit_complete_{auto,confirm}.yaml`, `.opencode/command/spec_kit/plan.md`, and `.opencode/command/spec_kit/complete.md`, explicitly preserving healthy-folder behavior with no hidden delegation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P2] NFR-R01: Source contract verified via `rg -n 'populated-folder|abort|no-op'` — 14 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, including populated-folder detection, default `repair_mode = abort`, and no-op guard language.
- [x] CHK-027 [P2] NFR-R02: Source contract verified via `rg -n 'staged.canonical.commit|preserve.*existing|recovery.step|preserve_preexisting_on_failure'` — 5 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, covering staged canonical commit semantics, recovery guidance, and pre-existing-file preservation.
- [x] CHK-034 [P2] SC-007: Source contract verified via `rg -n 'placeholder-upgrade|N/A - insufficient source context|detected_seed_markers|resume_question_id'` — 53 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml`, `.opencode/command/spec_kit/start.md`, `.opencode/command/spec_kit/complete.md`, and `spec_check_protocol.md`, wiring placeholder-upgrade re-entry to tracked seed markers and explicit `N/A - insufficient source context` resolution.
- [x] CHK-035 [P2] SC-008: Source contract verified via `rg -n 'structured context|memory save|memory_save_branched|canonical trio|never invalidates trio success'` — 43 matches across `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` and `.opencode/command/spec_kit/start.md`, encoding the optional memory-save branch, insufficient-context skip path, and trio-success independence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:quality-consistency -->
## Quality / Consistency

- [x] CHK-036 [P2] NFR-Q01: `diff -u .opencode/command/spec_kit/start.md .opencode/command/spec_kit/deep-research.md` — confirm new `/start.md` mirrors sibling's top-level sections (EXECUTION PROTOCOL, CONSTRAINTS, UNIFIED SETUP PHASE, PURPOSE, CONTRACT, WORKFLOW OVERVIEW, INSTRUCTIONS, OUTPUT FORMATS, REFERENCE, MEMORY INTEGRATION, QUALITY GATES, ERROR HANDLING, NEXT STEPS), frontmatter fields (`description`, `argument-hint`, `allowed-tools`), and callout style. Record structural overlap ≥ 50%. Evidence: `start.md` now includes `## REFERENCE`; diff rerun confirmed command-card skeleton parity and the result is recorded in `implementation-summary.md`.
- [x] CHK-037 [P2] NFR-Q02: `diff -u .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` — confirm top-level key ordering (`role`, `purpose`, `action`, `operating_mode`, `user_inputs`, `field_handling`, `packet_graph_metadata`, `workflow`, `quality_gates`, `completion_report`), step-ID naming (`step_preflight_contract`, `step_create_directories`, etc.), and variable vocabulary (`spec_folder`, `execution_mode`) match verbatim where semantics overlap. Repeat for `_confirm.yaml`. Evidence: auto + confirm start YAMLs still pass key-order and step-ID parity checks; snapshot captured in `implementation-summary.md`.
- [x] CHK-038 [P2] NFR-Q03: Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new (`start.md`, `spec_check_protocol.md`) and modified (`deep-research.md`, `plan.md`, `complete.md`, `sk-deep-research/SKILL.md`) markdown file. Zero errors required. Only template-inherited warnings allowed. Evidence: modified-markdown validator batch returned zero errors; `start.md` kept one inherited numbering warning and `templates/README.md` also passed when rerun with `--no-exclude`.
- [x] CHK-039 [P2] NFR-Q04: `git diff --stat` modified command cards and YAMLs; confirm no deleted section headers, no renamed step IDs, no reordered sections. Additions only. No migration note required because no renames. Evidence: this remediation did not modify existing command/YAML production surfaces beyond the additive `start.md` reference block; README/SKILL diff showed no section deletions or renames.
- [x] CHK-040 [P2] NFR-Q05: For each new file, compute `diff -u <new> <nearest-sibling> | grep -c '^[+-]'` as percentage of total lines. Overlap MUST be ≥ 50 percent. If less, divergence justified in `decision-record.md` or plan.md Architecture section. Evidence: corrected shared-line similarity replaced the broken diff-count formula in `decision-record.md`; recorded overlaps are `46.76%`, `15.51%`, and `16.16%`, with explicit divergence rationale.
- [x] CHK-041 [P2] NFR-Q06 (sweep): Run `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` from repo root. Also explicitly verify root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` is included. Record matched-file count and list. Evidence: rerun sweep returned `113` matched README/SKILL files and included root `README.md`; the full sorted list plus targeted buckets are recorded in `implementation-summary.md`.
- [x] CHK-042 [P2] NFR-Q06 (content): For every file from CHK-041, confirm: (a) command inventories include `/spec_kit:start`, (b) deep-research descriptions mention `spec.md` anchoring or `spec_check_protocol`, (c) plan/complete descriptions mention smart delegation / `folder_state`, (d) command-chain diagrams (if present) are updated, (e) no stale descriptions of pre-M1 behavior remain. Evidence: targeted verification snapshot in `implementation-summary.md` shows PASS for root README, `.opencode/README.md`, system-spec-kit docs, install guide, and the audited deep-research/deep-review/skill-advisor/template targets.
- [x] CHK-043 [P2] NFR-Q06 (discipline): `git diff --stat` on modified README/SKILL files shows additions and in-place clarifications only. No section deletions. No renames. Any structural changes justified inline or in `decision-record.md`. Evidence: `git diff --stat -- README.md .opencode/README.md .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/SKILL.md .opencode/install_guides/README.md .opencode/skill/system-spec-kit/templates/README.md` returned 6 changed files with no section removals; count corrections were in-place clarifications.

### M9 Middleware Cleanup

- [x] CHK-044 [P0] REQ-012: Verify 7 deleted command + YAML files no longer exist: `.opencode/command/spec_kit/{handover,debug}.md`, `.opencode/command/spec_kit/assets/{spec_kit_handover_full,spec_kit_debug_auto,spec_kit_debug_confirm}.yaml`, `.gemini/commands/spec_kit/{handover,debug}.toml`. Run `ls` on each path; all must return "No such file". [EVIDENCE: post-`rm -f` `ls` checks returned `No such file or directory` for all 7 command/YAML/TOML targets.]
- [x] CHK-045 [P0] REQ-013: Verify 8 deleted agent files no longer exist: `{.opencode/agent,.claude/agents,.gemini/agents}/{handover,speckit}.md` + `.codex/agents/{handover,speckit}.toml`. Run `ls` on each path; all must return "No such file". [EVIDENCE: all 8 files confirmed absent via `ls` (8/8); `.codex/agents/*.toml` pair removed via follow-up `rm -f` from parent orchestrator after codex sandbox permission block.]
- [x] CHK-046 [P0] REQ-014: Verify distributed-governance rule present in CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md, and `.opencode/skill/system-spec-kit/SKILL.md`. Grep: `grep -E "validate\.sh --strict"` in these 4 files — rule must appear in each with correct `templates/level_N/` + `/memory:save` + `@deep-research` + `@debug` exclusivity preservation. [EVIDENCE: the exact governance sentence is present in all four files, verified by post-edit `sed` reads plus `rg -n '/spec_kit:handover|/spec_kit:debug|@handover|@speckit'` returning no matches across the edited set.]
- [x] CHK-047 [P1] REQ-015: Zero-reference grep sweep across active docs for `/spec_kit:(handover|debug)`, `@handover`, `@speckit`. Command: `grep -rE "..." --include="*.md" --include="*.txt" --include="*.toml" --include="*.yaml" . 2>/dev/null | grep -vE "(z_archive|z_future|/iterations/|\.bak|legacy-memory-quarantine|scratch/|\.opencode/changelog/|\.opencode/specs/)"`. Expected: empty output for all three patterns. [EVIDENCE: final post-regeneration sweep returns ZERO matches across all active docs; all 5 previously blocked `.codex/agents/*.toml` files (debug, ultra-think, context, write, deep-research) were regenerated by parent orchestrator from their `.opencode/agent/*.md` counterparts.]
- [x] CHK-048 [P1] REQ-016: Preservation check — `@debug` agent (4 runtime files exist), `@deep-research` agent (4 runtime files exist), templates (`.opencode/skill/system-spec-kit/templates/{handover.md,debug-delegation.md,level_N/}`), `system-spec-kit` skill directory exists, MCP server code unchanged (`handlers/memory-save.ts`, `routing-prototypes.json`, type `'handover_state'` in `types.ts`), stop-hook autosave logic unchanged, `/spec_kit:resume` recovery ladder still reads handover.md. [EVIDENCE: existence checks passed for all 4 `@debug` files, all 4 `@deep-research` files, the required templates and level directories, `system-spec-kit`, and `mcp_server`; `resume.md` still references `handover.md` 8 times and `routing-prototypes.json` still contains the `handover_state` routing cluster.]
- [x] CHK-049 [P1] REQ-017: `/memory:save` positioning — `save.md` contains new "Handover Document Maintenance" subsection in §1; `handover_state` contract row mentions template path for initial creation; §8 Next-Steps replaces `/spec_kit:handover` row with `/memory:save`; §9 Related-Commands removes `/spec_kit:handover` ref. `:auto-debug` flag absent from `spec_kit_complete_{auto,confirm}.yaml` (grep returns empty); user-escalation replacement logic present. [EVIDENCE: `save.md` lines 80/82/93/534 confirm the subsection, template-path contract, and `/memory:save` next-step; both complete YAMLs now use `failure_count >= 3` user escalation with `@debug` via Task tool instead of the removed auto-debug flag.]
- [x] CHK-050 [P2] SC-009: Zero-ref grep for `/spec_kit:(handover|debug)` on active docs — empty after exclusions. Evidence: Final sweep post-regeneration returns ZERO matches across all active docs (all 5 `.codex/agents/*.toml` files regenerated clean).
- [x] CHK-051 [P2] SC-010: Zero-ref grep for `@handover|@speckit` on active docs — empty after exclusions. Evidence: Final sweep post-regeneration returns ZERO matches across all active docs (all 5 `.codex/agents/*.toml` files regenerated clean).
- [x] CHK-052 [P2] SC-011: `grep -E "handover_state|handover\.md::session-log" .opencode/command/memory/save.md` returns ≥ 2 matches; `grep -E "handover_state" .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` unchanged from pre-M9 state. Evidence: `save.md` returned lines `82`, `93`, and `534`; `routing-prototypes.json` still contains the `handover_state` block and negative-hint references at lines `69`, `131`, `211`, `221`, `229`, `237`, `245`, `253`, `271`, `287`, `295`, `305`, `313`, and `329`.
- [x] CHK-053 [P2] SC-012: Source contract verified. Evidence: `rg -n 'handover\.md' .opencode/command/spec_kit/resume.md` returned 8 matches, preserving the handover-first recovery ladder in `/spec_kit:resume` from source (`handover.md -> _memory.continuity -> spec docs`).
- [x] CHK-054 [P2] SC-013 + SC-014: Source contract verified. Evidence: `skill_advisor.py 'save this conversation context to memory' --threshold 0.8` still ranks `system-spec-kit` at `0.95`; `rg -n '@debug|Task tool|research/research\.md|validate\.sh --strict|templates/level_N|/memory:save'` across `AGENTS.md`, `CLAUDE.md`, `AGENTS_example_fs_enterprises.md`, `.opencode/skill/system-spec-kit/SKILL.md`, the 4 `@debug` mirrors, and the 4 `@deep-research` mirrors confirms Task-tool debug dispatch, distributed-governance write rules, and preserved `research/research.md` exclusivity.
<!-- /ANCHOR:quality-consistency -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 29 | 29/29 |

**Verification Date**: 2026-04-14
<!-- /ANCHOR:summary -->

---

<!--
LEVEL 2 CHECKLIST
- P0 = REQ-001..REQ-006 + REQ-011 + REQ-012..REQ-014 (10 items)
- P1 = REQ-007..REQ-010 + REQ-015..REQ-017 (7 items)
- P2 = NFR-P01..P02, NFR-S01..S04, NFR-R01..R02, NFR-Q01..Q06, success criteria SC-001..SC-008, and M9 SC-009..SC-014 (29 items)
-->
