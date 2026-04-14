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
    recent_action: "Authored requirement-mapped Level 2 verification checklist"
    next_safe_action: "Verify implementation evidence"
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
    completion_pct: 0
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

- [ ] CHK-001 [P0] REQ-001: Run deep-research against empty, healthy, seeded, and conflict fixtures; confirm `{spec_folder}/research/.deep-research.lock`, `folder_state`, and `spec_check_result` appear before LOOP, and grep the command/YAML surfaces for the same state names.
- [ ] CHK-002 [P0] REQ-002: Run deep-research on an empty target folder and verify a Level 1 `spec.md` exists before iteration 001, `spec_seed_created` is emitted, and tracked deep-research seed markers are present in the seeded anchors.
- [ ] CHK-007 [P0] REQ-011: Interrupt `/start`, rerun delegated `/plan` or `/complete`, and verify `start_state`, `resume_question_id`, `repair_mode`, and `reentry_reason` resume at the first unresolved question or tracked seed marker; completion must stay blocked until the canonical trio validates and the seed markers are cleared or replaced with `N/A - insufficient source context`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] REQ-007: Use confirm-mode intake to record `depends_on`, `related_to`, and `supersedes`, then inspect `graph-metadata.json` to confirm each relation stores `{ packet_id, reason, source, spec_folder?, title? }` and dedupes by `packet_id`.
- [ ] CHK-009 [P1] REQ-008: Run `/spec_kit:start` with and without an explicit level override; verify `recommend-level.sh` inputs are derived, `level_recommendation` and `selected_level` are stored separately, and the chosen rationale appears in the metadata / complexity surfaces.
- [ ] CHK-010 [P1] REQ-009: Compare the auto and confirm `/start` YAML assets with `rg -n "empty-folder|partial-folder|repair-mode|placeholder-upgrade|populated-folder"` and run one auto plus one confirm flow to prove the same state graph and returned fields exist in both modes.
- [ ] CHK-011 [P1] REQ-010: Re-run deep-research and delegated `/start` flows with the same research topic and relationship inputs; verify no duplicate normalized topics, seed markers, generated findings blocks, or manual relationship objects are created.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] REQ-003: Run deep-research on an existing `spec.md`, confirm the normalized topic/context is appended only once at the approved pre-init locations, then induce a missing-anchor or duplicate-marker fixture and verify the flow halts with `spec_mutation_conflict`.
- [ ] CHK-004 [P0] REQ-004: Complete a research synthesis run and verify exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block exists under the chosen host anchor and references `research/research.md`.
- [ ] CHK-005 [P0] REQ-005: Run `/spec_kit:start` on empty, repair, and placeholder-upgrade targets; confirm `spec.md`, `description.json`, and `graph-metadata.json` publish as the canonical success condition, and verify the optional memory-save branch reports separately from trio success.
- [ ] CHK-006 [P0] REQ-006: Run `/spec_kit:plan` and `/spec_kit:complete` on `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade` fixtures; confirm inline `/start` intake returns `feature_description`, `spec_path`, `selected_level`, `repair_mode`, and `manual_relationships`, then resumes the parent workflow.
- [ ] CHK-020 [P2] NFR-P01: Review direct `/start` transcripts and confirm confirm mode uses no more than two consolidated prompts while auto mode uses zero prompts when all required flags are supplied.
- [ ] CHK-021 [P2] NFR-P02: Review delegated `/plan` and `/complete` transcripts and confirm intake adds no more than one extra user turn when delegation triggers and zero extra turns on healthy folders.
- [ ] CHK-028 [P2] SC-001: Run `/spec_kit:deep-research "topic"` on an empty target folder and confirm `spec.md` exists before the first iteration plus tracked seed markers appear in the placeholder-bearing anchors.
- [ ] CHK-029 [P2] SC-002: Run deep-research on a folder with an existing `spec.md` and confirm the normalized topic/context plus one generated findings block are the only new `spec.md` mutations.
- [ ] CHK-030 [P2] SC-003: Run `/spec_kit:start` on an empty folder and validate the resulting `spec.md`, `description.json`, and `graph-metadata.json` with packet strict validation plus the applicable markdown/schema validators.
- [ ] CHK-031 [P2] SC-004: Run `/spec_kit:plan` on a `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` folder and confirm inline `/start` intake completes before the original planning workflow resumes.
- [ ] CHK-032 [P2] SC-005: Run `/spec_kit:complete` on the same set of non-healthy folder states and confirm the same inline delegation completes with at most one extra round-trip.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P2] NFR-S01: Manually diff `spec.md` before and after deep-research on a populated folder and confirm all mutations are anchor-bounded appends or generated-fence replacements, with no broad prose rewrite.
- [ ] CHK-023 [P2] NFR-S02: Inspect the emitted `research/deep-research-state.jsonl` records and confirm every `spec_mutation` event includes `anchors_touched` and `diff_summary`.
- [ ] CHK-024 [P2] NFR-S03: Inspect populated `graph-metadata.json.manual.*` arrays and confirm required `packet_id`, `reason`, and `source` fields exist on every object, with optional hints stored only as metadata.
- [ ] CHK-025 [P2] NFR-S04: Review runtime traces or JSONL audit output and confirm typed events exist for delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P2] SC-006: Run `/spec_kit:plan` and `/spec_kit:complete` on healthy folders and confirm no new prompts, no hidden delegation, and no behavior regression.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P2] NFR-R01: Run `/spec_kit:start` on a healthy populated folder and confirm the default path is abort/no-op unless the user explicitly selects metadata repair or overwrite.
- [ ] CHK-027 [P2] NFR-R02: Simulate an artifact-write failure and confirm staged canonical commit preserves pre-existing files, emits an exact recovery step, and does not invalidate a previously successful canonical trio when only the optional memory-save branch fails.
- [ ] CHK-034 [P2] SC-007: Run a placeholder-upgrade flow and confirm every tracked seed marker is replaced with confirmed content or `N/A - insufficient source context` before success is reported.
- [ ] CHK-035 [P2] SC-008: Run the optional memory-save path with sufficient structured context, then force a skipped or failed save precondition and confirm the canonical trio remains valid while the save branch reports its own result independently.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:quality-consistency -->
## Quality / Consistency

- [ ] CHK-036 [P2] NFR-Q01: `diff -u .opencode/command/spec_kit/start.md .opencode/command/spec_kit/deep-research.md` — confirm new `/start.md` mirrors sibling's top-level sections (EXECUTION PROTOCOL, CONSTRAINTS, UNIFIED SETUP PHASE, PURPOSE, CONTRACT, WORKFLOW OVERVIEW, INSTRUCTIONS, OUTPUT FORMATS, REFERENCE, MEMORY INTEGRATION, QUALITY GATES, ERROR HANDLING, NEXT STEPS), frontmatter fields (`description`, `argument-hint`, `allowed-tools`), and callout style. Record structural overlap ≥ 50%.
- [ ] CHK-037 [P2] NFR-Q02: `diff -u .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` — confirm top-level key ordering (`role`, `purpose`, `action`, `operating_mode`, `user_inputs`, `field_handling`, `packet_graph_metadata`, `workflow`, `quality_gates`, `completion_report`), step-ID naming (`step_preflight_contract`, `step_create_directories`, etc.), and variable vocabulary (`spec_folder`, `execution_mode`) match verbatim where semantics overlap. Repeat for `_confirm.yaml`.
- [ ] CHK-038 [P2] NFR-Q03: Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new (`start.md`, `spec_check_protocol.md`) and modified (`deep-research.md`, `plan.md`, `complete.md`, `sk-deep-research/SKILL.md`) markdown file. Zero errors required. Only template-inherited warnings allowed.
- [ ] CHK-039 [P2] NFR-Q04: `git diff --stat` modified command cards and YAMLs; confirm no deleted section headers, no renamed step IDs, no reordered sections. Additions only. No migration note required because no renames.
- [ ] CHK-040 [P2] NFR-Q05: For each new file, compute `diff -u <new> <nearest-sibling> | grep -c '^[+-]'` as percentage of total lines. Overlap MUST be ≥ 50 percent. If less, divergence justified in `decision-record.md` or plan.md Architecture section.
- [ ] CHK-041 [P2] NFR-Q06 (sweep): Run `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` from repo root. Also explicitly verify root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` is included. Record matched-file count and list.
- [ ] CHK-042 [P2] NFR-Q06 (content): For every file from CHK-041, confirm: (a) command inventories include `/spec_kit:start`, (b) deep-research descriptions mention `spec.md` anchoring or `spec_check_protocol`, (c) plan/complete descriptions mention smart delegation / `folder_state`, (d) command-chain diagrams (if present) are updated, (e) no stale descriptions of pre-M1 behavior remain.
- [ ] CHK-043 [P2] NFR-Q06 (discipline): `git diff --stat` on modified README/SKILL files shows additions and in-place clarifications only. No section deletions. No renames. Any structural changes justified inline or in `decision-record.md`.

### M9 Middleware Cleanup

- [ ] CHK-044 [P0] REQ-012: Verify 7 deleted command + YAML files no longer exist: `.opencode/command/spec_kit/{handover,debug}.md`, `.opencode/command/spec_kit/assets/{spec_kit_handover_full,spec_kit_debug_auto,spec_kit_debug_confirm}.yaml`, `.gemini/commands/spec_kit/{handover,debug}.toml`. Run `ls` on each path; all must return "No such file".
- [ ] CHK-045 [P0] REQ-013: Verify 8 deleted agent files no longer exist: `{.opencode/agent,.claude/agents,.gemini/agents}/{handover,speckit}.md` + `.codex/agents/{handover,speckit}.toml`. Run `ls` on each path; all must return "No such file".
- [ ] CHK-046 [P0] REQ-014: Verify distributed-governance rule present in CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md, and `.opencode/skill/system-spec-kit/SKILL.md`. Grep: `grep -E "validate\.sh --strict"` in these 4 files — rule must appear in each with correct `templates/level_N/` + `/memory:save` + `@deep-research` + `@debug` exclusivity preservation.
- [ ] CHK-047 [P1] REQ-015: Zero-reference grep sweep across active docs for `/spec_kit:(handover|debug)`, `@handover`, `@speckit`. Command: `grep -rE "..." --include="*.md" --include="*.txt" --include="*.toml" --include="*.yaml" . 2>/dev/null | grep -vE "(z_archive|z_future|/iterations/|\.bak|legacy-memory-quarantine|scratch/|\.opencode/changelog/|\.opencode/specs/)"`. Expected: empty output for all three patterns.
- [ ] CHK-048 [P1] REQ-016: Preservation check — `@debug` agent (4 runtime files exist), `@deep-research` agent (4 runtime files exist), templates (`.opencode/skill/system-spec-kit/templates/{handover.md,debug-delegation.md,level_N/}`), `system-spec-kit` skill directory exists, MCP server code unchanged (`handlers/memory-save.ts`, `routing-prototypes.json`, type `'handover_state'` in `types.ts`), stop-hook autosave logic unchanged, `/spec_kit:resume` recovery ladder still reads handover.md.
- [ ] CHK-049 [P1] REQ-017: `/memory:save` positioning — `save.md` contains new "Handover Document Maintenance" subsection in §1; `handover_state` contract row mentions template path for initial creation; §8 Next-Steps replaces `/spec_kit:handover` row with `/memory:save`; §9 Related-Commands removes `/spec_kit:handover` ref. `:auto-debug` flag absent from `spec_kit_complete_{auto,confirm}.yaml` (grep returns empty); user-escalation replacement logic present.
- [ ] CHK-050 [P2] SC-009: Zero-ref grep for `/spec_kit:(handover|debug)` on active docs — empty after exclusions.
- [ ] CHK-051 [P2] SC-010: Zero-ref grep for `@handover|@speckit` on active docs — empty after exclusions.
- [ ] CHK-052 [P2] SC-011: `grep -E "handover_state|handover\.md::session-log" .opencode/command/memory/save.md` returns ≥ 2 matches; `grep -E "handover_state" .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` unchanged from pre-M9 state.
- [ ] CHK-053 [P2] SC-012: `grep -E "handover\.md" .opencode/command/spec_kit/resume.md` returns ≥ 5 matches (recovery ladder intact); functional test: run `/spec_kit:resume` on a spec folder with handover.md and verify continuity is presented correctly.
- [ ] CHK-054 [P2] SC-013 + SC-014: Functional test — dispatch `@debug` via Task tool (verify fresh-perspective debugging works); verify main agent can write spec folder `*.md` using template + `validate.sh --strict` pass; verify `@deep-research` still exclusive for `research/research.md`; verify `system-spec-kit` skill still advertised by skill-advisor.
<!-- /ANCHOR:quality-consistency -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 7 | 0/7 |
| P2 Items | 29 | 0/29 |

**Verification Date**: 2026-04-14
<!-- /ANCHOR:summary -->

---

<!--
LEVEL 2 CHECKLIST
- P0 = REQ-001..REQ-006 + REQ-011 + REQ-012..REQ-014 (10 items)
- P1 = REQ-007..REQ-010 + REQ-015..REQ-017 (7 items)
- P2 = NFR-P01..P02, NFR-S01..S04, NFR-R01..R02, NFR-Q01..Q06, success criteria SC-001..SC-008, and M9 SC-009..SC-014 (29 items)
-->
