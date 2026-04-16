---
title: "Feature Specification: Canonical Intake and Middleware Cleanup [template:level_3/spec.md]"
description: "Establish one canonical intake surface for spec-folder creation and repair via a shared reference module at .opencode/skill/system-spec-kit/references/intake-contract.md, accessible through /spec_kit:plan --intake-only, and delete deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit) in favor of distributed governance and /memory:save."
trigger_phrases:
  - "canonical intake"
  - "intake contract module"
  - "spec kit intake"
  - "spec_kit plan intake only"
  - "deep research spec check"
  - "middleware cleanup"
  - "distributed governance"
  - "handover debug deprecation"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Folder renamed; spec rewritten under canonical-intake framing"
    next_safe_action: "Packet is complete; future edits should live in a successor packet"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/resume.md"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/skill/sk-deep-research/references/spec_check_protocol.md"
    session_dedup:
      fingerprint: "sha256:012-canonical-intake-cleanup-2026-04-15"
      session_id: "012-canonical-intake-2026-04-15"
      parent_session_id: "012-canonical-intake-closeout"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Single canonical intake surface delivered via shared intake-contract.md referenced by /spec_kit:plan and /spec_kit:complete"
      - "Standalone intake invocation preserved via /spec_kit:plan --intake-only flag with explicit YAML gate"
      - "Deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit with 4 runtime mirrors each) deleted in favor of distributed governance"
---
# Feature Specification: Canonical Intake and Middleware Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Spec-folder intake and deep-research anchoring lived in duplicated places: `/spec_kit:deep-research` never wrote or updated `spec.md`, three parallel intake surfaces drifted independently, and four runtime wrappers (`/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit`) kept adding clutter to the command graph after v3.4.0.0 already moved continuity into canonical docs and introduced the `/memory:save` content router. This packet consolidates all of that into a coherent end state.

The delivered architecture gives SpecKit a single canonical intake contract at `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference that module in place of inline intake logic, and `/spec_kit:plan --intake-only` provides the standalone "create folder without planning yet" invocation path. `/spec_kit:resume` routes intake re-entry reasons to `/spec_kit:plan --intake-only` with prefilled state. `/spec_kit:deep-research` anchors every run to a real `spec.md` via the `spec_check_protocol.md` reference, with an advisory lock, folder-state classification, bounded pre-init mutation, and a machine-owned generated-fence for findings write-back. The deprecated middleware wrappers are hard-deleted — `@debug` survives with Task-tool dispatch; the `@speckit` exclusivity rule is replaced by a distributed-governance rule across `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and the `system-spec-kit` SKILL; `/memory:save` owns canonical packet handover maintenance via `handover_state` routing.

**Critical Dependencies**: `/spec_kit:resume` routing; `validate.sh --strict`; sk-doc DQI validator; `generate-description.js` + graph-metadata backfill.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-14 |
| **Completed** | 2026-04-15 |
| **Branch** | `026-012-canonical-intake-and-middleware-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/spec_kit:deep-research` created iteration state and synthesised `research/research.md` but never authored or updated `spec.md`. Findings lived in an isolated subdirectory; downstream `/plan` runs started from scratch. Intake logic for creating, repairing, and resuming spec folders was duplicated across three parallel surfaces — a standalone `/spec_kit:start` command plus inline intake blocks inside `/spec_kit:plan` and `/spec_kit:complete` — with each surface drifting independently as features accumulated. `/spec_kit:plan` and `/spec_kit:complete` additionally conflated intake questions (what/why) with workflow controls (`:auto`/`:confirm`) and phase decomposition across a 9-question consolidated prompt, and never captured the manual graph relationships (`depends_on`, `related_to`, `supersedes`) that `generate-description.js` cannot infer from text. In parallel, redundant middleware (`/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit`) cluttered the command and agent graphs after v3.4.0.0 moved continuity into canonical docs and introduced the `/memory:save` content-router.

### Purpose

Tell the command-graph evolution as one coherent story:

- `/spec_kit:deep-research` anchors every run to a real `spec.md` and syncs back an abridged findings block through a bounded generated fence.
- Canonical intake logic lives in exactly one place: `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference that module in place of inline duplication. `/spec_kit:plan --intake-only` provides the standalone invocation path for spec-folder creation and repair without planning yet.
- `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`).
- Deprecated middleware is gone. `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, and `@speckit` are hard-deleted. `@debug` survives (description-only updates, Task-tool dispatch). A distributed-governance rule governs spec folder authoring; `/memory:save` owns packet handover maintenance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Shared canonical intake module**: `.opencode/skill/system-spec-kit/references/intake-contract.md` documents five folder states (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`), four repair modes (`create`, `repair-metadata`, `resolve-placeholders`, `abort`), staged canonical-trio publication, manual relationship capture with `packet_id` dedup, resume semantics, and the intake lock.
- **`/spec_kit:plan` with intake absorption**: Step 1 references the shared intake module. Adds `--intake-only` flag (with explicit YAML `intake_only` gate) plus eight intake-contract flags (`--spec-folder`, `--level`, `--start-state`, `--repair-mode`, `--record-relationships`, `--depends-on`, `--related-to`, `--supersedes`). Preserves `:with-phases` pre-workflow.
- **`/spec_kit:complete` with intake reference**: Section 0 references the shared intake module; downstream Steps 5a/8/9 unchanged in behavior; `:auto-debug` flag removed.
- **`/spec_kit:resume` routing**: Intake re-entry reasons (`incomplete-interview`, `placeholder-upgrade`, `metadata-repair`) route to `/spec_kit:plan --intake-only` with prefilled state. Packet handover document remains first recovery source.
- **Deep-research spec anchoring**: Late-INIT advisory lock, `folder_state` classification, pre-init seed or bounded context updates, and post-synthesis generated-fence write-back. `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` documents lock lifecycle, seed-marker rules, host-anchor ownership, generated-fence replacement, audit events, and idempotency rules.
- **Command-layer safety**: Staged canonical commit, seed-marker lifecycle handling, normalized-topic dedupe, optional save-path branching around existing helper interfaces.
- **Middleware deprecations**: Delete `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit` (with four runtime mirrors each), Gemini command TOML mirrors, and the skill-registry `COMMAND_BOOSTS` entry for intake prompting. Update cross-repo references across orchestrate agents, spec_kit commands, YAML workflows, root docs, install guides, skill docs, reference documents, CLI skill references. Replace `@speckit` exclusivity rule with distributed-governance rule in root docs + system-spec-kit SKILL. Reposition `/memory:save` as canonical packet handover maintainer via `handover_state` routing. Remove `:auto-debug` flag from `/spec_kit:complete`.

### Out of Scope

- Changes to `spec.md` Level 1/2/3/3+ templates themselves — reused unchanged.
- Changes to `create.sh`, `generate-description.js`, `recommend-level.sh`, or `generate-context.js` internals — helpers may be reused or wrapped, but their internals are unchanged.
- Graph-metadata backfill behaviour — unchanged.
- New MCP tools or memory-system changes — this is a command-layer refactor only.
- Retroactive migration of existing spec folders that lack `description.json` or `graph-metadata.json` — handled separately by backfill.
- Sibling packets `013-advisor-phrase-booster-tailoring` and `014-memory-save-planner-first-default` — unrelated scope.
- Historical changelog entries at `.opencode/changelog/01--system-spec-kit/` — historical records, only updated to reflect consolidated delivery, not rewritten.

### Files to Change

**New shared reference module and deep-research protocol:**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Create | Canonical intake contract (folder classification, repair modes, trio publication, relationships, resume, lock) |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Create | Contract for advisory locking, folder-state detection, seed markers, host-anchor ownership, generated-fence replacement, audit events, idempotency |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Late-INIT advisory lock, `folder_state` classification, bounded pre-init mutation rules, and post-synthesis generated-fence sync contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | INIT spec check, seed-create / conflict branches, and SYNTHESIS generated-fence write-back with typed audit events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Same state graph with explicit approvals for conflict handling, write-back, and deferred synthesis recovery |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add `spec_check_protocol` loading guidance under the runtime workflow section |

**`/spec_kit:plan` and `/spec_kit:complete` integrated with the shared module:**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/plan.md` | Modify | Step 1 references shared intake module; add `--intake-only` flag; preserve `:with-phases` |
| `.opencode/command/spec_kit/complete.md` | Modify | Section 0 references shared intake module; remove inline block (also loses `:auto-debug`) |
| `.opencode/command/spec_kit/resume.md` | Modify | Route intake re-entry reasons to `/spec_kit:plan --intake-only`; delete `/spec_kit:handover` + `/spec_kit:debug` Next-Steps rows; update session-ending row to `/memory:save` |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Reflect new workflow + `--intake-only` branch with explicit `intake_only` gate |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Same |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Reference-only refactor for Section 0; delete `:auto-debug` logic |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Same |
| `.opencode/command/spec_kit/implement.md` | Modify | Remove `@speckit` + `@handover` from Do-Not-Dispatch; remove Session Handover Check step |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Remove `/spec_kit:handover` Next-Steps row |
| `.opencode/command/spec_kit/assets/spec_kit_implement_{auto,confirm}.yaml` | Modify | Delete handover check + debug-dispatch steps |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` | Modify | Remove `@speckit`/`@handover` dispatch calls if present |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml` | Modify | Remove `@speckit`/`@handover` dispatch calls if present |
| `.opencode/command/memory/save.md` | Modify | Insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row; update §8 Next-Steps + §9 Related-Commands |

**Middleware deletions (15 enumerated paths):**

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/handover.md` | Delete | Command deprecated |
| `.opencode/command/spec_kit/debug.md` | Delete | Command deprecated |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | Delete | Command YAML asset |
| `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` | Delete | Command YAML asset |
| `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` | Delete | Command YAML asset |
| `.opencode/agent/handover.md` | Delete | `@handover` agent runtime 1/4 |
| `.claude/agents/handover.md` | Delete | `@handover` runtime 2/4 |
| `.codex/agents/handover.toml` | Delete | `@handover` runtime 3/4 |
| `.gemini/agents/handover.md` | Delete | `@handover` runtime 4/4 |
| `.opencode/agent/speckit.md` | Delete | `@speckit` agent runtime 1/4 |
| `.claude/agents/speckit.md` | Delete | `@speckit` runtime 2/4 |
| `.codex/agents/speckit.toml` | Delete | `@speckit` runtime 3/4 |
| `.gemini/agents/speckit.md` | Delete | `@speckit` runtime 4/4 |
| `.gemini/commands/spec_kit/handover.toml` | Delete | Gemini command mirror |
| `.gemini/commands/spec_kit/debug.toml` | Delete | Gemini command mirror |

**Root docs, orchestrate, and agent description updates:**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` | Modify | Delete `@speckit` + `@handover` bullets; update `@debug` to Task-tool dispatch; add distributed-governance rule; update Quick Reference rows |
| `AGENTS.md` | Modify | Same edits as `CLAUDE.md` |
| `AGENTS_example_fs_enterprises.md` | Modify | Same edits |
| `.opencode/agent/orchestrate.md` | Modify | Remove `@speckit` + `@handover` routing rows, LEAF-list entries, agent-files entries; update `@debug` routing |
| `.claude/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/orchestrate.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.opencode/agent/debug.md` | Modify | Update description to Task-tool dispatch pattern |
| `.claude/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/debug.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.opencode/agent/ultra-think.md` | Modify | Update `@debug` routing to Task-tool dispatch; remove `@speckit` refs |
| `.claude/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/ultra-think.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.opencode/README.md` | Modify | Delete `@handover` + `@speckit` rows; update `@debug`; delete deprecated-command bullets |
| `README.md` | Modify | Update command-graph diagram |

**Install guides, command READMEs, skill references, and catalog:**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/install_guides/README.md` | Modify | Agent table + SpecKit commands update; remove `/start` entry |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Delete deprecated command/agent rows |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | Same edits; remove `/start` from setup walkthrough |
| `.opencode/command/README.txt` | Modify | Remove debug + handover + `/start` from SpecKit command list |
| `.opencode/command/spec_kit/README.txt` | Modify | Delete all `/spec_kit:debug`, `/spec_kit:handover`, and `/start` references |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Replace `@speckit` exclusivity with distributed-governance; remove deprecated-command refs; remove `spec_kit:start` entry from `COMMAND_BOOSTS` registry at line 210 |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Same |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | Remove standalone-intake delegation notes |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Modify | Same |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Modify | Same |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Modify | Same |
| `.opencode/skill/system-spec-kit/templates/addendum/README.md` | Modify | Same |
| `.opencode/skill/sk-code-web/README.md` | Modify | Delete deprecated-command refs |
| `.opencode/skill/sk-code-web/references/debugging/debugging_workflows.md` | Modify | Remove `/spec_kit:debug` refs |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Delete `/spec_kit:handover` subsections; replace `@handover` + `@speckit` with distributed-governance |
| `.opencode/skill/system-spec-kit/references/workflows/worked_examples.md` | Modify | Remove deprecated-command examples |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | Replace `/spec_kit:handover` attribution with `/memory:save` |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | Replace `/spec_kit:handover:full` attribution with `/memory:save` |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Remove deprecated-command refs |
| `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Modify | Remove `/spec_kit:handover` + `@speckit` gate refs |
| `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` | Modify | Remove `/spec_kit:debug` command refs |
| `.opencode/skill/sk-deep-review/README.md` | Modify | Remove standalone-intake reference |
| `.opencode/skill/skill-advisor/README.md` | Modify | Remove standalone-intake entry from routing docs |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | Modify | Delete `@handover` + `@speckit` entries; update `@debug` to Task-tool dispatch |
| `.opencode/skill/cli-codex/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Update `@debug` dispatch example |
| `.opencode/skill/cli-gemini/README.md` | Modify | Remove `@debug` command ref |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Modify | Delete handover/debug command refs |
| `.opencode/command/improve/agent.md` | Modify | Remove `@handover` + `@speckit` improvement targeting |
| `.opencode/skill/sk-doc/assets/agents/agent_template.md` | Modify | Agent table: delete `@handover` + `@speckit` rows |
| `.opencode/specs/descriptions.json` | Modify | Update 012 packet description entry |

**Standalone-intake surface deletions (4 enumerated paths):**

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/start.md` | Delete | Redundant with shared intake-contract.md (340 LOC) |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Delete | Asset for deleted command (508 LOC) |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Delete | Asset for deleted command (585 LOC) |
| `.gemini/commands/spec_kit/start.toml` | Delete | CLI routing for deleted command |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research late INIT acquires the advisory lock and classifies `folder_state` in the resolved target folder | After acquiring `{spec_folder}/research/.deep-research.lock`, setup classifies `folder_state` as `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`, passes that state into INIT and SYNTHESIS, and records the result in a typed `spec_check_result` audit event |
| REQ-002 | If `folder_state == no-spec`, deep-research seeds `spec.md` from the research ASK **before** the iteration loop begins | INIT writes a Level 1 `spec.md`, emits `spec_seed_created`, and places tracked deep-research seed markers in placeholder-bearing anchors used for later upgrade |
| REQ-003 | If `folder_state == spec-present`, deep-research applies bounded pre-init context updates and fails closed on ambiguity | The normalized research topic is deduped and appended only at the approved host locations; missing anchors or duplicate markers emit `spec_mutation_conflict`; semantic-purpose conflicts halt rather than rewrite human prose |
| REQ-004 | Post-synthesis, deep-research writes back abridged findings through one machine-owned generated block under the chosen host anchor | SYNTHESIS writes or replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block; emits `spec_synthesis_deferred` instead of partial output when interrupted |
| REQ-005 | Shared canonical intake module exists with complete contract | `.opencode/skill/system-spec-kit/references/intake-contract.md` authored with all five folder states, four repair modes, trio publication, relationship capture, resume semantics, intake lock |
| REQ-006 | `/spec_kit:plan` absorbs intake via the shared reference | `plan.md` Step 1 references shared module; no duplicate intake logic in `plan.md` body |
| REQ-007 | `/spec_kit:complete` absorbs intake via the shared reference | `complete.md` Section 0 references shared module; no duplicate intake logic in `complete.md` body |
| REQ-008 | `--intake-only` flag halts `/spec_kit:plan` after Step 1 with explicit YAML gate | `/spec_kit:plan --intake-only` halts after Step 1 (trio published, no planning); YAML workflow contains explicit `intake_only` gate that terminates successfully after Emit and bypasses Steps 2-7 |
| REQ-009 | `/spec_kit:resume` routing updated for intake re-entry | `/spec_kit:resume` routes `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` to `/spec_kit:plan --intake-only` with prefilled state |
| REQ-010 | Intake resume and re-entry contract is enforced | `/spec_kit:plan --intake-only` and delegated `/plan`/`/complete` normalize `start_state` into `empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, or `populated-folder`; reruns persist `resume_question_id`, `repair_mode`, `reentry_reason` |
| REQ-011 | `/spec_kit:debug` and `/spec_kit:handover` commands + YAML assets + Gemini command TOML mirrors are deleted | 7 deprecated command/asset surfaces no longer exist; `grep -rE "/spec_kit:(handover\|debug)"` on active docs returns empty |
| REQ-012 | `@handover` and `@speckit` agents deleted across all 4 runtime mirrors (8 files total) | 8 agent files no longer exist; `grep -rE "@handover\|@speckit"` on active docs returns empty |
| REQ-013 | `@speckit` exclusivity rule replaced with distributed-governance rule across `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and system-spec-kit SKILL.md | All four files contain the replacement rule using templates + `validate.sh --strict` + `/memory:save` |
| REQ-014 | Standalone `/spec_kit:start` + assets deleted | `start.md`, 2 YAML assets, `.gemini/.../start.toml` removed from repo |
| REQ-015 | Skill registry cleaned | `COMMAND_BOOSTS` entry at `SKILL.md:210` for standalone intake no longer surfaces in harness skill list |
| REQ-016 | Zero forward-looking standalone-intake refs | grep for `/spec_kit:start` or `spec_kit/start.md` in forward-looking docs returns zero matches (historical changelogs excluded) |
| REQ-017 | Structural validation passes | `validate.sh --strict` exits 0 (or documents `SPEC_DOC_INTEGRITY` warnings that reference documented supersession narrative) |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-018 | Manual graph relationships capture works | `graph-metadata.json.manual.depends_on`, `.related_to`, and `.supersedes` store objects shaped as `{ packet_id, reason, source, spec_folder?, title? }`; repeated runs dedupe by `packet_id`; contract lives in `intake-contract.md §8 Manual Relationships` |
| REQ-019 | Level recommendation preserved | `intake-contract.md §7 Level Recommendation` derives numeric `loc/files/risk` proxies; records `level_recommendation` separately from `selected_level` |
| REQ-020 | Auto and confirm modes share one state graph | Both `/spec_kit:plan` YAML workflows implement the same folder states and returned fields; only approval density and prompt compression differ; contract lives in `intake-contract.md §4 Folder States` |
| REQ-021 | Deep-research and intake flows are idempotent across repeated runs | Normalized research topics, tracked seed markers, generated-fence replacement, and manual-relationship object dedupe prevent duplicate content across reruns |
| REQ-022 | All active-doc references to deprecated commands/agents updated | Zero-reference grep sweep across 50+ active files returns empty |
| REQ-023 | Preserved capabilities: `@debug` agent (4 runtime mirrors), preserved templates, `system-spec-kit` skill, MCP server code, stop-hook autosave, `/spec_kit:resume` recovery ladder | Survival checks pass for all preserved surfaces |
| REQ-024 | `/memory:save` positioned as canonical packet handover maintainer via `handover_state` routing; `:auto-debug` flag removed from `/spec_kit:complete` | `save.md` §1 contains "Handover Document Maintenance" subsection; `spec_kit_complete_{auto,confirm}.yaml` contains no `:auto-debug` references |
| REQ-025 | Root README command-graph updated | Root `README.md` reflects new architecture; graph diagram shows no `/spec_kit:start` node |
| REQ-026 | CLI agent-delegation refs updated | All three cli-* skill `agent_delegation.md` files carry correct post-cleanup references |
| REQ-027 | Install guides updated | Both install guide files free of `/start` references |
| REQ-028 | Template READMEs updated | All five template README files free of standalone-intake delegation notes |
| REQ-029 | Changelog entry authored | Entry at `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` documents the canonical-intake end state and standalone-intake deprecation |
| REQ-030 | sk-doc validator PASS | All canonical docs pass DQI scoring |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Intake and Deep-Research Success Criteria

- **SC-001**: `/spec_kit:deep-research "topic"` on an empty target folder produces `spec.md` **before** any iteration runs, with tracked deep-research seed markers placed in placeholder-bearing anchors
- **SC-002**: `/spec_kit:deep-research "topic"` on a folder with existing `spec.md` appends the normalized topic/context only at approved pre-init locations and replaces one generated findings block during synthesis without overwriting user-authored content
- **SC-003**: `/spec_kit:plan --intake-only` on an empty folder publishes `spec.md`, `description.json`, and `graph-metadata.json` passing packet validation via the shared `intake-contract.md` module
- **SC-004**: `/spec_kit:plan` on a `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` target folder absorbs intake via the shared module reference, then continues through its existing workflow
- **SC-005**: `/spec_kit:complete` demonstrates the same shared-module reference behavior with a single additional round-trip at most when intake is required
- **SC-006**: Zero regression — running `/spec_kit:plan` or `/spec_kit:complete` on a folder that already satisfies the healthy-folder contract behaves exactly as today (no new prompts, no delegation)
- **SC-007**: Placeholder-upgrade flows only complete after every tracked seed marker is replaced with confirmed content or the explicit fallback `N/A - insufficient source context`
- **SC-008**: Optional memory-save mode only runs when sufficient structured context exists, and its skip or failure state does not invalidate an already committed canonical trio

### Shared Module and Resume Success Criteria

- **SC-009**: Shared intake module exists with complete contract (folder states, repair modes, trio publication, relationship capture, resume semantics, intake lock)
- **SC-010**: `plan.md` Step 1 references shared module; no duplicate intake logic in `plan.md` body
- **SC-011**: `complete.md` Section 0 references shared module; no duplicate intake logic in `complete.md` body
- **SC-012**: `/spec_kit:plan --intake-only` halts after Step 1 end-to-end with explicit YAML gate
- **SC-013**: `/spec_kit:resume` re-entry routes to `/spec_kit:plan --intake-only` correctly
- **SC-014**: `start.md`, 2 YAML assets, `.gemini/.../start.toml` deleted; `COMMAND_BOOSTS` entry removed at `SKILL.md:210`
- **SC-015**: Zero `/spec_kit:start` references in forward-looking docs (grep verified)
- **SC-016**: sk-doc validator PASS on all canonical docs
- **SC-017**: `validate.sh --strict` exits 0 for this packet (or documents `SPEC_DOC_INTEGRITY` warnings that reference documented supersession narrative)

### Middleware Cleanup Success Criteria

- **SC-018**: `grep -rE "/spec_kit:(handover|debug)"` across active docs (excluding archive/future/iterations/scratch/changelog/specs) returns zero matches
- **SC-019**: `grep -rE "@handover|@speckit"` across active docs (with same exclusions) returns zero matches
- **SC-020**: `/memory:save` command card documents it as the canonical packet handover maintainer via `handover_state` routing; routing prototype unchanged
- **SC-021**: Running `/spec_kit:resume` on an existing spec folder still reads the packet handover document as the first recovery source (no regression)
- **SC-022**: `@debug` agent remains dispatchable via Task tool in all 4 runtimes; `@deep-research` retains exclusive write access for `research/research.md`
- **SC-023**: `system-spec-kit` skill, preserved templates (`handover.md`, `debug-delegation.md`, `level_N/`), and all MCP server code remain unchanged and functional

### Acceptance Scenarios

1. **Given** an empty packet folder, **when** `/spec_kit:deep-research "topic"` starts, **then** it seeds `spec.md` before iteration 001 and records the tracked seed markers needed for later upgrade.
2. **Given** a populated packet folder with an existing `spec.md`, **when** deep-research runs on the same topic twice, **then** the normalized pre-init context and generated findings fence appear only once and human-owned prose remains untouched.
3. **Given** an empty folder, **when** `/spec_kit:plan --intake-only feature-description` runs, **then** the canonical trio is published via the shared intake-contract module and the command exits without producing `plan.md`/`tasks.md`/`checklist.md`.
4. **Given** a populated folder, **when** `/spec_kit:plan feature-description` runs, **then** intake is bypassed cleanly and planning proceeds without extra prompts.
5. **Given** a folder needing repair, **when** `/spec_kit:plan` runs, **then** repair-mode interview runs inline via the shared module before planning.
6. **Given** `/spec_kit:complete` on a folder requiring intake, **when** Section 0 executes, **then** the shared intake-contract module runs and completion proceeds.
7. **Given** a session with `reentry_reason: incomplete-interview`, **when** `/spec_kit:resume` runs, **then** the operator is routed to `/spec_kit:plan --intake-only` with prefilled state.
8. **Given** I invoke the deleted `/spec_kit:start`, **then** the harness returns "command not found" cleanly (no silent failure); changelog documents `/spec_kit:start → /spec_kit:plan --intake-only`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Intake and Deep-Research Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seed-marker drift or untracked placeholder edits break placeholder-upgrade re-entry | `/spec_kit:plan` and `/spec_kit:complete` may misclassify an unfinished folder as healthy | Use explicit tracked deep-research seed markers only; block completion until they are cleared; fail closed on ambiguous marker state |
| Risk | Generated-fence conflicts or human edits inside the machine-owned findings block | Deep-research write-back could overwrite user content or duplicate findings | Require exactly one matching `BEGIN/END GENERATED: deep-research/spec-findings` pair; emit typed conflict audits; halt instead of repairing in place |
| Risk | Staged canonical commit fails mid-publication | Canonical trio may become inconsistent | Use temp-sibling staging plus final publish semantics; preserve pre-existing files on failure; surface exact recovery steps |
| Risk | `generate-context.js` treated as the default metadata-only repair path | Intake creation or repair flows inherit avoidable memory-save failure modes | Keep baseline intake creation and metadata repair independent from `generate-context.js` |
| Risk | Intake delegation regresses healthy-folder `/plan` or `/complete` behavior | Existing commands become noisier | Gate delegation strictly to non-healthy states; healthy folders bypass |
| Risk | Advisory lock contention or stale lock cleanup stalls valid deep-research runs | Second writers may corrupt spec state | Treat lock contention as first-class blocking state; require confirm for stale-lock override |
| Risk | `plan.md` size growth | Projected 550-600 LOC after intake absorption; cognitive overhead | Shared-module extraction reduces duplication; reference-only inclusion keeps `plan.md` from carrying full contract (see [CHK-034](./checklist.md#chk-034)) |
| Risk | Atomic downstream sweep misses a ref | 26 modify + 4 delete files = 30 touch points; regression risk if any `/start` reference stays | Exhaustive grep baseline established; closure gate re-runs grep; P0 [CHK-034](./checklist.md#chk-034) blocks closeout |
| Risk | Intake lock race | Lock must cover Step 1 only, not Steps 2-8 | ADR-006 scopes lock explicitly; shared module documents release point (see [CHK-041](./checklist.md#chk-041)) |
| Risk | Breaking external invokers | External scripts/docs outside repo may call `/spec_kit:start` | Hard delete is user-requested; release changelog provides migration note |
| Risk | sk-doc voice drift in `intake-contract.md` | New reference doc must match project voice | sk-doc validator enforced as P0 (see [CHK-023](./checklist.md#chk-023)) |
| Dependency | `create.sh`, `generate-description.js`, and Level 1/2 templates | Canonical trio emission depends on helper reuse | Reuse helpers and templates as-is |
| Dependency | `recommend-level.sh` CLI contract | Level suggestion depends on stable helper inputs | Derive numeric proxies before invocation; store helper output separately from confirmed level |
| Dependency | `validate_document.py` and packet strict validation | Success criteria depend on validator-backed checks | Run validator-backed verification as part of completion |
| Dependency | Harness skill registry | Removal of `spec_kit:start` entry requires knowing exact registry file path | Audit located `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary |
| Dependency | `/spec_kit:resume` routing | Routing change must match shared module's `reentry_reason` values | Verification covers round-trip |

### Middleware Cleanup Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Main agent writes spec folder docs without templates after `@speckit` deletion | Quality degrades; packet validation fails | Distributed-governance rule added to root docs + SKILL; YAML workflow steps call `validate.sh`; checklist catches gaps |
| Risk | Hidden dispatcher of `@speckit` or `@handover` in MCP handlers or hooks | Deletion breaks workflows | Zero-reference sweep; rollback path deletes 17 files as one commit that can be reverted together |
| Risk | `:auto-debug` flag removal breaks users who relied on auto-escalation at 3+ failures | Silent loss of auto-debug fallback | Replace with explicit "escalate to user with diagnostic summary" path |
| Risk | Full 7-section packet handover regeneration becomes unavailable | Users lose deliberate-handover capability | Accept trade-off; `/memory:save` maintains `session-log` anchor; stop hook auto-saves continuity |
| Dependency | Templates + bash scripts at `scripts/spec/` | Distributed governance depends on these remaining stable | Templates and scripts explicitly preserved; survival check verifies |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `/spec_kit:plan --intake-only` completes in ≤ 2 consolidated prompts total (confirm mode); 0 prompts in auto mode when all required flags are provided
- **NFR-P02**: `/spec_kit:plan` and `/spec_kit:complete` smart-delegation adds ≤ 1 additional user turn when target folder is empty; zero additional turns when `spec.md` already exists
- **NFR-P03**: Intake contract execution time target <2s on healthy folder classification

### Security / Integrity

- **NFR-S01**: No command may overwrite user-authored `spec.md` content silently — all mutations are anchor-bounded appends or clearly-fenced new sections
- **NFR-S02**: Deep-research auto mode writes a JSONL audit record to `research/deep-research-state.jsonl` for every `spec.md` mutation (`type: "spec_mutation"`, `anchors_touched: [...]`, `diff_summary: "..."`)
- **NFR-S03**: Interview answers populating `graph-metadata.json.manual.*` must be objects containing `packet_id`, `reason`, and `source`, with optional `spec_folder` / `title` hints preserved only as denormalized metadata
- **NFR-S04**: Delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching must emit typed audit events
- **NFR-S05**: Intake lock prevents concurrent trio publication under same `spec_folder` path (fail-closed semantics)

### Reliability

- **NFR-R01**: Staged trio publication remains atomic — partial writes never leave visible half-published state (temp + rename semantics preserved)
- **NFR-R02**: Canonical trio publication uses staged canonical commit semantics, preserves pre-existing files on failure. Optional memory save is outside the canonical trio transaction
- **NFR-R03**: `/spec_kit:plan --intake-only` is idempotent on empty folder (repeat invocation yields identical trio, no duplicate intake lock)
- **NFR-R04**: Running `/spec_kit:plan` on an already-populated folder does not re-ask intake questions; default behavior is bypass

### Quality / Consistency

- **NFR-Q01**: Modified command cards and YAML assets preserve existing section ordering, anchor comments, and step IDs. Renames prohibited without migration note
- **NFR-Q02**: All new markdown passes `python3 .opencode/skill/sk-doc/scripts/validate_document.py` with zero errors. Template-inherited warnings may be acknowledged
- **NFR-Q03**: All modifications to existing command surfaces (`plan.md`, `complete.md`, `deep-research.md`, `resume.md`) and their paired YAMLs preserve existing section ordering, anchor comments, and step IDs
- **NFR-Q04**: All cross-repo README and SKILL documentation referencing speckit commands audited and updated
- **NFR-Q05**: `validate.sh --strict` PASS on all canonical docs before closeout
- **NFR-Q06**: sk-doc DQI PASS on all canonical docs
- **NFR-Q07**: Grep sweep confirms zero `/spec_kit:start` references in forward-looking scoped paths

---

## 8. EDGE CASES

### Data Boundaries

- Empty folder, or folder with `scratch/` only → shared intake contract creates the canonical trio only; does not create `memory/` by default
- Folder with `spec.md` but no `description.json` or `graph-metadata.json` → enters metadata-only repair mode and regenerates the missing metadata without rewriting human-authored `spec.md`
- Folder containing tracked deep-research seed markers → classified as `placeholder-upgrade`, not as a healthy populated folder
- Phase-child folder → `description.json.parentChain` reflects both levels; `graph-metadata.json.parent_id` points to the numbered parent folder
- Very long feature description (> 500 characters) → truncated to 150 characters for `description.json.description`; full text preserved in `spec.md` §2 Problem Statement
- Empty folder with `--intake-only` → publishes trio + intake lock; no planning artifacts created
- Populated folder with `--intake-only` → no-op on trio; exits cleanly

### Error Scenarios

- User aborts mid-interview → re-entry persists `resume_question_id`, `repair_mode`, and `reentry_reason`; next `/spec_kit:plan --intake-only` resumes at first unresolved question
- `recommend-level.sh` returns non-zero exit code → fall back to Level 1 default; log warning; user can override
- Missing host anchor, duplicate markers, or human edits inside the generated findings block → deep-research emits typed conflict audit and halts fail closed
- Staged canonical commit or rename failure after temp writes → pre-existing files preserved; exact recovery output shown; optional memory save not attempted
- Optional memory-save mode requested without sufficient structured context → canonical trio remains the success condition; memory save skipped; reason reported explicitly
- Target path is outside `specs/` or `.opencode/specs/` alias roots → refuses and shows accepted root list
- Intake lock contention → fail-closed; return error; do not partial-write
- Resume re-entry to deleted `/spec_kit:start` invocation → backward-compat handling via session migration note in v3.4.0.0 changelog
- External script invoking `/spec_kit:start` → hard delete breaks these; changelog provides migration mapping `/spec_kit:start → /spec_kit:plan --intake-only`

### State Transitions

- Deep-research → synthesis interrupted → `spec.md` retains pre-init updates only; post-synthesis additions deferred to next synthesis run
- `/spec_kit:plan` detects non-healthy folder → loads `intake-contract.md §5 Folder States`, executes repair-mode branch, then continues to Step 2 planning
- `/spec_kit:plan --intake-only` completes Step 1 → halts at Emit phase (explicit YAML `intake_only` gate); planning Steps 2-7 bypassed
- `/spec_kit:resume` detects `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → routes to `/spec_kit:plan --intake-only` with prefilled state
- `/spec_kit:resume` detects `reentry_reason in {none, planning-paused, implementation-paused}` → routes to full `/spec_kit:plan` or `/spec_kit:implement` as today

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 80+ touch points (15 middleware deletions + 50+ reference modifications + 4 standalone-intake deletions + 26 forward-looking doc updates + new shared reference module); LOC: ~1200 delta; Systems: 6 (commands, skills, templates, CLI configs, registry, MCP) |
| Risk | 20/25 | Breaking: Y (external invokers of `/spec_kit:start`); Architectural: Y (consolidates three parallel surfaces into one shared reference); modifies user-authored documents |
| Research | 10/20 | Script APIs documented; reusing existing helpers; shared-module pattern is novel design element |
| Multi-Agent | 7/15 | M1-M9 sequential + parallel middleware deletion; M10-M15 shared-module consolidation delegated to cli-copilot (GPT-5.4 reasoning=high); 5 parallel Opus agents for deep-review remediation |
| Coordination | 12/15 | Dependencies: helpers, resume routing, skill registry, MCP handlers |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Atomic sweep misses a downstream ref | H | M | Audit + grep closure gate (CHK-051) |
| R-002 | External invokers break after `/spec_kit:start` hard delete | M | M | Release changelog migration note (REQ-029) |
| R-003 | Skill registry mutation requires harness restart | M | L | Documented restart step in implementation-summary.md §Known Limitations |
| R-004 | `plan.md` size growth causes cognitive overhead | L | M | Reference-only absorption; shared module carries detail (ADR-003) |
| R-005 | Intake lock race in shared module | H | L | ADR-006 scopes lock to Step 1 only |
| R-006 | Resume round-trip fails for old sessions | M | L | Migration note + CHK-044 routing verification |
| R-007 | Seed-marker drift breaks placeholder-upgrade re-entry | H | M | Explicit tracked DR seed markers + fail-closed on ambiguity |
| R-008 | Generated-fence conflicts with human edits | M | L | Require exactly one BEGIN/END GENERATED pair + emit typed conflict audits + halt |
| R-009 | Staged canonical commit fails mid-publication | M | L | Temp-sibling staging + preserve pre-existing files on failure |
| R-010 | Main agent writes spec folder docs without templates after `@speckit` deletion | H | L | Distributed-governance rule (ADR-011) + YAML `validate.sh --strict` enforcement + checklist catches gaps |
| R-011 | Hidden dispatcher of `@speckit`/`@handover` in MCP handlers | H | L | Zero-reference sweep + rollback via 17-file revert |
| R-012 | `:auto-debug` removal breaks auto-escalation workflows | L | L | Explicit user escalation path; `@debug` still available via Task tool |
| R-013 | sk-doc voice drift in `intake-contract.md` | L | L | sk-doc DQI validator enforced as P0 (CHK-054) |

---

## 11. USER STORIES

### US-001: Unified intake surface (Priority: P0)

**As a** SpecKit user invoking `/spec_kit:plan`, **I want** intake to happen automatically when needed, **so that** I don't need to know about a separate `/spec_kit:start` command.

**Acceptance Criteria**:
1. Given an empty folder, When I run `/spec_kit:plan feature-description`, Then trio is published via shared intake contract AND planning proceeds with no separate command invocation
2. Given a populated folder, When I run `/spec_kit:plan feature-description`, Then intake block is bypassed cleanly
3. Given a folder needing repair, When I run `/spec_kit:plan`, Then repair-mode interview runs inline before planning

---

### US-002: Intake-only invocation (Priority: P0)

**As a** SpecKit user wanting to create a spec folder without planning yet, **I want** a `--intake-only` flag, **so that** I can set up the folder and return to it later.

**Acceptance Criteria**:
1. Given an empty folder, When I run `/spec_kit:plan feature-description --intake-only`, Then trio is published AND the command exits without producing `plan.md`/`tasks.md`/`checklist.md`
2. Given a populated folder, When I run `/spec_kit:plan --intake-only`, Then no-op exit with informational message

---

### US-003: Resume continuity (Priority: P1)

**As a** SpecKit user resuming interrupted work, **I want** `/spec_kit:resume` to route me correctly when I was mid-intake, **so that** I don't lose state.

**Acceptance Criteria**:
1. Given a session with `reentry_reason: incomplete-interview`, When I run `/spec_kit:resume`, Then I'm routed to `/spec_kit:plan --intake-only` with prefilled state
2. Given a session with `reentry_reason: placeholder-upgrade`, When I run `/spec_kit:resume`, Then I'm routed identically

---

### US-004: Deprecation clarity (Priority: P1)

**As a** SpecKit user who previously used `/spec_kit:start`, **I want** clear migration guidance, **so that** I can update my workflows.

**Acceptance Criteria**:
1. Given I check the changelog, When I look up v3.4.0.0, Then I find the migration mapping `/spec_kit:start → /spec_kit:plan --intake-only`
2. Given I invoke the deleted `/spec_kit:start`, Then harness returns "command not found" cleanly (no silent failure)

---

### US-005: Distributed governance (Priority: P1)

**As a** SpecKit contributor authoring spec-folder docs, **I want** clear governance rules after `@speckit` exclusivity deletion, **so that** quality stays consistent.

**Acceptance Criteria**:
1. Given I edit any spec-folder `*.md`, Then I use templates from `.opencode/skill/system-spec-kit/templates/level_N/` and run `validate.sh --strict` after each file write
2. Given continuity updates are needed, Then I route through `/memory:save` rather than authoring standalone continuity files

---

## 12. OPEN QUESTIONS

- No blocking open questions remain. All architectural choices resolved via AskUserQuestion during planning sessions.

### Resolved Notes

- **`:auto-debug` replacement**: Replaced with explicit user escalation; orchestrate can still Task-dispatch `@debug` manually
- **`/memory:save` auto-initialize**: Full 7-section packet handover auto-initialization deferred to a follow-on packet
- **Distributed-governance rule**: In effect; no reversal path triggered
- All architectural choices resolved via AskUserQuestion during 2026-04-15 planning session. Five Checks evaluation at 5/5 PASS (recorded in plan.md).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Shared Intake Contract**: `.opencode/skill/system-spec-kit/references/intake-contract.md`
- **Deep-Research Spec-Check Protocol**: `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`
- **Changelog Release Note**: `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`
- **Deep Review Report**: `review/review-report.md`

---

<!--
LEVEL 3 SPEC — Canonical Intake and Middleware Cleanup
- Single canonical intake contract at .opencode/skill/system-spec-kit/references/intake-contract.md
- /spec_kit:plan and /spec_kit:complete reference the shared module in place of inline duplication
- /spec_kit:plan --intake-only provides standalone intake invocation with explicit YAML gate
- /spec_kit:deep-research anchors to real spec.md via spec_check_protocol.md reference
- Deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit × 4 runtimes each) hard-deleted
- Distributed-governance rule replaces @speckit exclusivity; /memory:save owns packet handover maintenance
- REQ-001..REQ-030 enumerate intake/deep-research, shared-module, resume, and middleware-cleanup requirements
- Deep review flagged 12 findings; 5 parallel Opus remediation agents fixed all before closeout
-->
