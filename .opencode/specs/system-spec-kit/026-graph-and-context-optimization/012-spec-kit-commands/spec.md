---
title: "Feature Specification: Spec Kit Command Intake Refactor [template:level_2/spec.md]"
description: "Introduce /spec_kit:start as the canonical spec-folder intake interview and require deep-research to anchor every run to a real spec.md"
trigger_phrases:
  - "spec kit start"
  - "spec intake"
  - "deep research spec check"
  - "spec kit commands"
  - "interview spec folder"
  - "start command"
  - "spec folder interview"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-14T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored initial Level 2 spec covering /spec_kit:start + deep-research spec.md integration"
    next_safe_action: "Implement plan"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/skill/sk-deep-research/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-commands-initial-author"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "No blocking product-direction questions after iteration 010; implementation sequencing only"
    answered_questions: []
---
# Feature Specification: Spec Kit Command Intake Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planning |
| **Created** | 2026-04-14 |
| **Branch** | `026-012-spec-kit-commands` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/spec_kit:deep-research` creates iteration state and synthesises `research/research.md` but never authors or updates `spec.md`. Findings live in an isolated subdirectory; downstream `/plan` runs start from scratch. Separately, `/spec_kit:plan` and `/spec_kit:complete` conflate intake questions (what/why) with workflow controls (`:auto`/`:confirm`) and phase decomposition across a 9-question consolidated prompt, and never capture the manual graph relationships (`depends_on`, `related_to`) that `generate-description.js` cannot infer from text.

### Purpose

- `/spec_kit:start` guarantees the canonical trio (`spec.md`, `description.json`, `graph-metadata.json`) for create, repair, or placeholder-upgrade intake flows; optional memory-save behavior is a separate branch that only runs when structured context exists.
- `/spec_kit:deep-research` anchors every run to a real `spec.md` and syncs back an abridged findings block through a bounded generated fence rather than broad document rewriting.
- **M9 Middleware Cleanup** (additive scope): Deprecate `/spec_kit:debug` and `/spec_kit:handover` commands, plus the `@handover` and `@speckit` agents (4 runtime mirrors each). These are redundant after v3.4.0.0 moved continuity into canonical docs and introduced the `/memory:save` content-router. The `@debug` agent stays (description-only updates), and all templates (`handover.md`, `debug-delegation.md`, `level_N/`) stay. The `@speckit` exclusivity rule for spec-folder `*.md` writes is replaced with a distributed-governance rule: main agent writes using templates, runs `validate.sh --strict`, and routes continuity via `/memory:save`; `@deep-research` and `@debug` retain file-specific exclusivity for `research/research.md` and `debug-delegation.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **New command**: `/spec_kit:start` — standalone interactive intake interview that creates or repairs the canonical trio and optionally branches into memory-save mode only after canonical artifact success
- **Deep-research enhancement**: late-INIT lock + `folder_state` detection, pre-init seed or bounded context updates, and post-synthesis generated-fence write-back of abridged findings
- **Plan / complete smart-delegation**: detect `no-spec`, `partial-folder`, `repair-mode`, and unresolved placeholder-upgrade state in setup; absorb `/start` intake inline inside the parent command's consolidated prompt before original workflow steps resume
- **Command-layer safety**: staged canonical commit, seed-marker lifecycle handling, normalized-topic dedupe, and optional save-path branching around existing helper interfaces
- **Skill reference**: `.opencode/skill/sk-deep-research/` gains a `spec_check_protocol` reference doc describing lock lifecycle, seed-marker rules, host-anchor ownership, generated-fence replacement, audit events, and idempotency rules
- **M9 deprecations**: Delete `/spec_kit:handover` + `/spec_kit:debug` commands and their YAML assets; delete `@handover` + `@speckit` agents across 4 runtime mirrors each; delete Gemini command TOML mirrors; update references across orchestrate agents (4 runtimes), spec_kit commands, YAML workflows, root docs (CLAUDE.md / AGENTS.md / AGENTS_example_fs_enterprises.md), install guides, skill SKILL.md + README.md, reference documents, CLI skill references; replace `@speckit` exclusivity rule with distributed-governance rule in root docs + system-spec-kit SKILL.md; reposition `/memory:save` as canonical `handover.md` maintainer; remove `:auto-debug` flag logic from `/spec_kit:complete`

### Out of Scope

- Changes to `spec.md` Level 1/2/3/3+ templates themselves — reused unchanged
- Changes to `create.sh`, `generate-description.js`, `recommend-level.sh`, or `generate-context.js` internals — helpers may be reused or wrapped, but their internals are unchanged
- Graph-metadata backfill behaviour — unchanged
- `/start` absorbing planning, completion, research dispatch, or phase-decomposition ownership — those remain parent-command concerns
- New MCP tools or memory-system changes — this is a command-layer refactor only
- Retroactive migration of existing spec folders that lack `description.json` or `graph-metadata.json` — handled separately by backfill

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/start` | Create | New intake command card covering create, repair, placeholder-upgrade, staged canonical trio publication, and optional memory-save branching |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Create | Auto-mode workflow sharing the `/start` state graph while minimizing prompts and skipping optional save when structured context is missing |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Create | Confirm-mode workflow sharing the same `/start` state graph with explicit approvals, resume handling, and manual relationship capture |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Late-INIT advisory lock, `folder_state` classification, bounded pre-init mutation rules, and post-synthesis generated-fence sync contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | INIT spec check, seed-create / conflict branches, and SYNTHESIS generated-fence write-back with typed audit events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Same state graph with explicit approvals for conflict handling, write-back, and deferred synthesis recovery |
| `.opencode/command/spec_kit/plan.md` | Modify | Setup phase absorbs `/start` intake inline for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade` states |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Step 0.5 start-delegation branch with returned-field binding and healthy-folder no-regression bypass |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Same delegation contract with parent-owned approvals preserved |
| `.opencode/command/spec_kit/complete.md` | Modify | Setup phase mirrors plan-side inline `/start` delegation and resume semantics |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Step 0.5 start-delegation branch for incomplete or non-healthy folder states |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Same delegation contract with confirm-mode gates around intake and continuation |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add `spec_check_protocol` loading guidance under the runtime workflow section |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol` | Create | Contract for advisory locking, folder-state detection, seed markers, host-anchor ownership, generated-fence replacement, audit events, and idempotency |

#### M9 Files to Change (Middleware Cleanup)

**DELETE (17 files)**:

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/handover.md` | Delete | Command deprecated |
| `.opencode/command/spec_kit/debug.md` | Delete | Command deprecated |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | Delete | Command YAML asset |
| `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` | Delete | Command YAML asset |
| `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` | Delete | Command YAML asset |
| `.opencode/agent/handover.md` | Delete | @handover agent runtime 1/4 |
| `.claude/agents/handover.md` | Delete | @handover runtime 2/4 |
| `.codex/agents/handover.toml` | Delete | @handover runtime 3/4 |
| `.gemini/agents/handover.md` | Delete | @handover runtime 4/4 |
| `.opencode/agent/speckit.md` | Delete | @speckit agent runtime 1/4 |
| `.claude/agents/speckit.md` | Delete | @speckit runtime 2/4 |
| `.codex/agents/speckit.toml` | Delete | @speckit runtime 3/4 |
| `.gemini/agents/speckit.md` | Delete | @speckit runtime 4/4 |
| `.gemini/commands/spec_kit/handover.toml` | Delete | Gemini command mirror |
| `.gemini/commands/spec_kit/debug.toml` | Delete | Gemini command mirror |

**MODIFY (reference removal and distributed-governance adoption)**:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` | Modify | Delete @speckit + @handover bullets; update @debug bullet to Task-tool dispatch; add distributed-governance rule; update Quick Reference workflow rows |
| `AGENTS.md` | Modify | Same edits as CLAUDE.md |
| `AGENTS_example_fs_enterprises.md` | Modify | Same edits |
| `.opencode/agent/orchestrate.md` | Modify | Remove @speckit + @handover routing rows, LEAF-list entries, agent-files entries; update @debug routing to Task-tool dispatch; replace deprecated-command suggestions with `/memory:save` + Task-tool patterns |
| `.claude/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/orchestrate.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.opencode/command/spec_kit/resume.md` | Modify | Delete `/spec_kit:handover` + `/spec_kit:debug` Next-Steps rows; keep handover.md recovery refs; update session-ending row to `/memory:save` |
| `.opencode/command/spec_kit/plan.md` | Modify | Remove @speckit + @handover from Do-Not-Dispatch lists; remove Handover Check row; update pause-Next-Steps to `/memory:save` |
| `.opencode/command/spec_kit/complete.md` | Modify | Remove `:auto-debug` flag entirely (argument-hint + workflow logic); remove @speckit + @handover dispatch restrictions; delete debug-integration subsection; replace `:auto-debug` fallback with user-escalation |
| `.opencode/command/spec_kit/implement.md` | Modify | Remove @speckit + @handover from Do-Not-Dispatch; remove Session Handover Check step; remove deprecated-command Next-Steps rows |
| `.opencode/command/spec_kit/start.md` | Modify | Remove `/spec_kit:handover` Next-Steps row; remove @speckit dispatch language |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Remove `/spec_kit:handover` Next-Steps row |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Remove `/spec_kit:handover` Next-Steps row |
| `.opencode/command/spec_kit/assets/spec_kit_complete_{auto,confirm}.yaml` | Modify | Delete `:auto-debug` flag logic, debug_integration blocks, handover check steps |
| `.opencode/command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml` | Modify | Delete handover-check + deprecated-command Next-Steps entries |
| `.opencode/command/spec_kit/assets/spec_kit_implement_{auto,confirm}.yaml` | Modify | Delete handover check + debug-dispatch steps |
| `.opencode/command/spec_kit/assets/spec_kit_start_{auto,confirm}.yaml` | Modify | Delete `/spec_kit:handover` Next-Steps entries |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` | Modify | Remove @speckit/@handover dispatch calls if present |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml` | Modify | Remove @speckit/@handover dispatch calls if present |
| `.opencode/command/memory/save.md` | Modify | Insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row; update §8 Next-Steps + §9 Related-Commands to remove `/spec_kit:handover` refs |
| `.opencode/agent/debug.md` | Modify | Update description to remove `/spec_kit:debug` dispatcher language; clarify Task-tool dispatch pattern |
| `.claude/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/debug.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.opencode/agent/ultra-think.md` | Modify | Update @debug routing row to Task-tool dispatch pattern; remove @speckit refs |
| `.claude/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/ultra-think.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.opencode/README.md` | Modify | Delete @handover + @speckit rows; update @debug; delete deprecated-command bullets; update end-session workflow row |
| `.opencode/install_guides/README.md` | Modify | Agent table: delete @handover + @speckit rows; SpecKit commands: remove deprecated commands |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Delete rows for `/spec_kit:debug`, `/spec_kit:handover`, @speckit, @handover |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | Remove @speckit + @handover refs; update @debug refs |
| `.opencode/command/README.txt` | Modify | Remove debug + handover from SpecKit command list + rows |
| `.opencode/command/spec_kit/README.txt` | Modify | Delete all `/spec_kit:debug` and `/spec_kit:handover` references |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Replace @speckit exclusivity narrative with distributed-governance rule; remove deprecated-command refs; update trigger phrases |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Remove deprecated-command refs; remove @speckit agent refs; keep all template + recovery-surface refs |
| `.opencode/skill/sk-code-web/README.md` | Modify | Delete deprecated-command refs; keep debugging methodology |
| `.opencode/skill/sk-code-web/references/debugging/debugging_workflows.md` | Modify | Remove `/spec_kit:debug` command refs; keep workflow content |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Delete `/spec_kit:handover` + `/spec_kit:handover:full`/`:quick` subsections; replace @handover + @speckit refs with distributed-governance language |
| `.opencode/skill/system-spec-kit/references/workflows/worked_examples.md` | Modify | Update/remove deprecated-command workflow examples |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | Replace `/spec_kit:handover` attribution with `/memory:save` + template narrative |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | Replace `/spec_kit:handover:full` attribution with `/memory:save` + main-agent narrative |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Remove deprecated-command refs; remove @speckit agent refs |
| `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Modify | Remove `/spec_kit:handover` + @speckit gate refs |
| `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` | Modify | Remove `/spec_kit:debug` command refs; keep @debug agent methodology |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | Modify | Delete @handover + @speckit entries; update @debug entries to Task-tool dispatch |
| `.opencode/skill/cli-codex/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Update @debug dispatch example to Task-tool pattern |
| `.opencode/skill/cli-gemini/README.md` | Modify | Remove @debug command ref; keep handover.md recovery ref |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Modify | Delete handover/debug command refs; update @debug to Task-tool dispatch |
| `.opencode/command/improve/agent.md` | Modify | Remove @handover + @speckit improvement targeting; update @debug; remove deprecated-command refs |
| `.opencode/skill/sk-doc/assets/agents/agent_template.md` | Modify | Agent table: delete @handover + @speckit rows; update @debug description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research late INIT acquires the advisory lock and classifies `folder_state` in the resolved target folder | After acquiring `{spec_folder}/research/.deep-research.lock`, setup classifies `folder_state` as `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`, passes that state into INIT and SYNTHESIS, and records the result in a typed `spec_check_result` audit event; verified by dry-runs against empty, healthy, seeded, and conflict fixtures |
| REQ-002 | If `folder_state == no-spec`, deep-research seeds `spec.md` from the research ASK **before** Phase LOOP begins | INIT writes a Level 1 `spec.md`, emits `spec_seed_created`, and places tracked deep-research seed markers in the placeholder-bearing anchors used for later upgrade; LOOP is blocked until the file exists and the seed markers can be discovered deterministically |
| REQ-003 | If `folder_state == spec-present`, deep-research applies bounded pre-init context updates and fails closed on ambiguity | The normalized research topic is deduped and appended only at the approved host locations, missing anchors or duplicate markers emit `spec_mutation_conflict`, semantic-purpose conflicts halt rather than rewrite human prose, and reruns on the same topic no-op cleanly |
| REQ-004 | Post-synthesis, deep-research writes back abridged findings through one machine-owned generated block under the chosen host anchor | SYNTHESIS writes or replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block, references `research/research.md` as the source of truth, and emits `spec_synthesis_deferred` instead of writing partial output when synthesis is interrupted |
| REQ-005 | `/spec_kit:start` exists and publishes the canonical trio through staged commit semantics, with optional memory save as a separate branch | Running `/spec_kit:start` on an empty, repair, or placeholder-upgrade target publishes `spec.md`, `description.json`, and `graph-metadata.json` as the canonical success condition; optional memory-save behavior only runs when structured context exists and is reported independently from trio success |
| REQ-006 | `/plan` and `/complete` smart-detect non-healthy target folders and absorb `/start` intake inline before resuming their original workflow | Delegation triggers for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`, returns `feature_description`, `spec_path`, `selected_level`, `repair_mode`, and `manual_relationships` into the parent flow, and preserves current behavior for already healthy folders |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `/start` interview optionally captures manual graph relationships (`depends_on`, `related_to`, `supersedes`) | `graph-metadata.json.manual.depends_on`, `.related_to`, and `.supersedes` store objects shaped as `{ packet_id, reason, source, spec_folder?, title? }`, and repeated runs dedupe entries by `packet_id` within each relation type |
| REQ-008 | `/start` suggests a documentation level via `recommend-level.sh` and stores recommendation versus user override separately | `/start` derives numeric `loc/files/risk` proxies for the helper, records `level_recommendation` separately from `selected_level`, writes the confirmed level into `spec.md`, and captures the rationale in the Complexity Assessment / metadata surfaces |
| REQ-009 | `/start` supports `:auto` and `:confirm` through one shared state graph and one shared output contract | Both YAML workflows implement the same folder states (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`) and returned fields; only approval density and prompt compression differ |
| REQ-010 | Deep-research and `/start` flows are idempotent across repeated runs on the same topic or repair path | Normalized research topics, tracked seed markers, generated-fence replacement, and manual-relationship object dedupe prevent duplicate Open Questions, context notes, findings blocks, or manual edges across reruns |
| REQ-011 | Intake resume and re-entry contract is enforced across `/start` and delegated parent flows | `/start`, delegated `/plan`, and delegated `/complete` normalize `start_state` into `empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, or `populated-folder`; reruns persist and return `resume_question_id`, `repair_mode`, and `reentry_reason`; success is blocked until the canonical trio validates and every tracked seed marker is cleared or explicitly replaced with `N/A - insufficient source context` |

### P0 — M9 Middleware Cleanup (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | `/spec_kit:debug` and `/spec_kit:handover` commands + YAML assets + Gemini command TOML mirrors are deleted | The 7 command/asset files (`handover.md`, `debug.md`, `spec_kit_handover_full.yaml`, `spec_kit_debug_{auto,confirm}.yaml`, `.gemini/commands/spec_kit/{handover,debug}.toml`) no longer exist; `grep -rE "/spec_kit:(handover|debug)"` on active docs returns empty after exclusion filter for archive/future/iterations/scratch/changelog/specs |
| REQ-013 | `@handover` and `@speckit` agents deleted across all 4 runtime mirrors (8 files total) | The 8 agent files (`{opencode/agent,claude/agents,gemini/agents}/{handover,speckit}.md` + `.codex/agents/{handover,speckit}.toml`) no longer exist; `grep -rE "@handover\|@speckit"` on active docs returns empty after exclusion filter |
| REQ-014 | `@speckit` exclusivity rule replaced with distributed-governance rule across CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md, and `.opencode/skill/system-spec-kit/SKILL.md` | All four files contain the replacement rule: "Any agent writing spec folder docs MUST use templates from `templates/level_N/`, run `bash .../validate.sh [spec_folder] --strict` after each file write, and route continuity updates through `/memory:save`"; `@deep-research` and `@debug` remain exclusive for `research/research.md` and `debug-delegation.md` respectively |

### P1 — M9 Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | All active-doc references to deprecated commands/agents updated (orchestrate routing, spec_kit commands, YAML assets, install guides, skill docs, reference docs, CLI skill refs) | Verified by zero-reference grep sweep across 50+ active files; no dangling `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` references in active code surface (exclusions applied) |
| REQ-016 | Preserved capabilities: `@debug` agent (4 runtime mirrors with description-only updates), all templates (`handover.md`, `debug-delegation.md`, `level_N/`), `system-spec-kit` skill, all MCP server code (handlers, routing, schemas, types), stop-hook autosave, `/spec_kit:resume` recovery ladder | Verified by survival check: 4 @debug files exist; 2 template files exist; skill directory exists; MCP server code unchanged; `/spec_kit:resume` still reads `handover.md` as first recovery source; `handover_state` routing category in `routing-prototypes.json` unchanged |
| REQ-017 | `/memory:save` positioned as canonical `handover.md` maintainer via `handover_state` content-router category; `:auto-debug` flag removed from `/spec_kit:complete` with explicit user-escalation replacement | `save.md` contains new "Handover Document Maintenance" subsection in §1; `spec_kit_complete_{auto,confirm}.yaml` contains no `:auto-debug` references; escalation path replaces auto-debug fallback logic |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/spec_kit:deep-research "topic"` on an empty target folder produces `spec.md` **before** any iteration runs, with tracked deep-research seed markers placed in the placeholder-bearing anchors
- **SC-002**: `/spec_kit:deep-research "topic"` on a folder with existing `spec.md` appends the normalized topic/context only at the approved pre-init locations and replaces one generated findings block during synthesis without overwriting user-authored content
- **SC-003**: `/spec_kit:start` on an empty folder produces `spec.md`, `description.json`, and `graph-metadata.json` that pass packet validation and the applicable markdown/schema checks
- **SC-004**: `/spec_kit:plan` on a `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` target folder absorbs `/start` intake inside its consolidated prompt, then continues through its existing workflow using the populated outputs
- **SC-005**: `/spec_kit:complete` demonstrates the same smart-detect behavior with a single additional round-trip at most when delegation is required
- **SC-006**: Zero regression — running `/spec_kit:plan` or `/spec_kit:complete` on a folder that already satisfies the healthy-folder contract behaves exactly as today (no new prompts, no delegation)
- **SC-007**: Placeholder-upgrade flows only complete after every tracked seed marker is replaced with confirmed content or the explicit fallback `N/A - insufficient source context`
- **SC-008**: Optional memory-save mode only runs when sufficient structured context exists, and its skip or failure state does not invalidate an already committed canonical trio

### M9 Success Criteria

- **SC-009**: `grep -rE "/spec_kit:(handover|debug)"` across active docs (excluding archive/future/iterations/scratch/changelog/specs) returns zero matches after M9 executes
- **SC-010**: `grep -rE "@handover|@speckit"` across active docs (with same exclusions) returns zero matches after M9 executes
- **SC-011**: `/memory:save` command card documents it as canonical `handover.md` maintainer via `handover_state` routing; routing prototype in `routing-prototypes.json` unchanged
- **SC-012**: Running `/spec_kit:resume` on an existing spec folder still reads `handover.md` as the first recovery source and presents continuity correctly (no regression)
- **SC-013**: `@debug` agent remains dispatchable via Task tool in all 4 runtimes; `@deep-research` retains exclusive write access for `research/research.md`; main agent can write other spec-folder `*.md` files using templates under the distributed-governance rule
- **SC-014**: `system-spec-kit` skill, `handover.md` template, `debug-delegation.md` template, `level_N/` templates, and all MCP server code (handlers, routing, schemas, types) remain unchanged and functional

### Acceptance Scenarios

1. **Given** an empty packet folder, **when** `/spec_kit:deep-research "topic"` starts, **then** it seeds `spec.md` before iteration 001 and records the tracked seed markers needed for later upgrade.
2. **Given** a populated packet folder with an existing `spec.md`, **when** deep-research runs on the same topic twice, **then** the normalized pre-init context and generated findings fence appear only once and human-owned prose remains untouched.
3. **Given** an empty, partial, repair, or placeholder-upgrade target folder, **when** `/spec_kit:start` runs directly, **then** it publishes the canonical trio and only attempts memory save when structured context exists.
4. **Given** `/spec_kit:plan` or `/spec_kit:complete` receives a non-healthy target folder, **when** Step 1 begins, **then** `/start` intake is absorbed inline and the parent workflow resumes with the returned fields already bound.
5. **Given** a placeholder-upgrade rerun after an interrupted intake, **when** the operator resumes, **then** the flow restarts at the first unresolved question or tracked seed marker instead of replaying accepted answers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seed-marker drift or untracked placeholder edits break placeholder-upgrade re-entry | `/plan`, `/complete`, and `/start` may misclassify an unfinished folder as healthy | Use explicit tracked deep-research seed markers only, block completion until they are cleared or replaced with `N/A - insufficient source context`, and fail closed on ambiguous marker state |
| Risk | Generated-fence conflicts or human edits inside the machine-owned findings block | Deep-research write-back could overwrite user content or duplicate findings | Require exactly one matching `BEGIN/END GENERATED: deep-research/spec-findings` pair, emit typed conflict audits, and halt instead of repairing in place |
| Risk | Staged canonical commit fails mid-publication | Canonical trio may become inconsistent or leave confusing temp state | Use temp-sibling staging plus final publish semantics, preserve pre-existing files on failure, and surface exact recovery steps rather than claiming transactional helper guarantees |
| Risk | `generate-context.js` is treated as the default metadata-only repair path | `/start` create or repair flows inherit avoidable memory-save failure modes | Keep baseline `/start` creation and metadata repair independent from `generate-context.js`; optional memory save is a post-success branch only |
| Risk | Inline `/start` delegation regresses healthy-folder `/plan` or `/complete` behavior | Existing commands become noisier or prompt-heavy for already valid folders | Gate delegation strictly to `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`; healthy folders bypass the branch entirely |
| Risk | Advisory lock contention or stale lock cleanup stalls valid deep-research runs | Second writers may corrupt spec state or operators may be blocked without guidance | Treat lock contention as a first-class blocking state, require confirm or explicit recovery for stale-lock override, and audit the outcome |
| Dependency | `create.sh`, `generate-description.js`, and Level 1/2 templates | Canonical trio emission depends on helper reuse and template-path stability | Reuse helpers and templates as-is; implement staged commit and save branching at the command layer only |
| Dependency | `recommend-level.sh` CLI contract | Level suggestion depends on stable helper inputs and output parsing | Derive numeric `loc/files/risk` proxies before invocation and store helper output separately from the confirmed level |
| Dependency | `validate_document.py` and packet strict validation | Success criteria depend on markdown/schema and packet validation remaining available | Run validator-backed verification as part of completion and treat failures as blockers |
| Risk (M9) | Main agent or third-party agent writes spec folder docs without templates or `validate.sh --strict` after @speckit deletion | Quality degrades; packet validation fails at completion | Add distributed-governance rule to CLAUDE.md / AGENTS.md / SKILL.md; YAML workflow steps explicitly call `validate.sh`; checklist.md at packet closure catches gaps |
| Risk (M9) | Hidden dispatcher of `@speckit` or `@handover` in MCP handlers or hooks that Explore agents missed | Deletion breaks workflows | Phase 7 zero-reference sweep catches any remaining refs; rollback path deletes the 17 files as one commit that can be reverted together |
| Risk (M9) | `:auto-debug` flag removal breaks users who relied on auto-escalation at 3+ failures | Silent loss of auto-debug fallback in `/spec_kit:complete` | Replace with explicit "escalate to user with diagnostic summary" path; main agent can still Task-dispatch `@debug` manually; document migration note in complete.md |
| Risk (M9) | Full 7-section `handover.md` regeneration becomes unavailable (no command produces it) | Users lose deliberate-handover capability | Accept trade-off; `/memory:save` still maintains `session-log` anchor; stop-hook still auto-saves continuity; follow-on packet may enhance `/memory:save` handler to auto-initialize full template |
| Dependency (M9) | `handover.md` template + `level_N/` templates + bash scripts (`validate.sh`, `create.sh`, `recommend-level.sh`) | Distributed governance depends on these remaining stable | Templates and scripts are explicitly preserved by M9; Phase 7 survival check verifies |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `/spec_kit:start` interview completes in ≤ 2 consolidated prompts total (confirm mode); 0 prompts in auto mode when all required flags are provided
- **NFR-P02**: `/plan` and `/complete` smart-delegation adds ≤ 1 additional user turn when target folder is empty; zero additional turns when spec.md already exists

### Security / Integrity
- **NFR-S01**: No command may overwrite user-authored `spec.md` content silently — all mutations are anchor-bounded appends or clearly-fenced new sections
- **NFR-S02**: Deep-research auto mode writes a JSONL audit record to `research/deep-research-state.jsonl` for every spec.md mutation (`type: "spec_mutation"`, `anchors_touched: [...]`, `diff_summary: "..."`)
- **NFR-S03**: Interview answers that populate `graph-metadata.json.manual.*` must be objects containing `packet_id`, `reason`, and `source`, with optional `spec_folder` / `title` hints preserved only as denormalized metadata
- **NFR-S04**: Delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching must emit typed audit events so the flow can be verified from runtime traces as well as final files

### Reliability
- **NFR-R01**: Running `/spec_kit:start` on an already-populated folder asks before overwriting; default is abort; user must explicitly confirm to repair metadata-only
- **NFR-R02**: Canonical trio publication uses staged canonical commit semantics, preserves pre-existing files on failure, and surfaces the exact recovery step instead of relying on implicit helper transactionality. Optional memory save is outside the canonical trio transaction and must not invalidate a successful canonical commit.

### Quality / Consistency
- **NFR-Q01**: The new `/spec_kit:start` command card MUST mirror the structural pattern of existing `/spec_kit:*` command cards (`plan.md`, `deep-research.md`, `complete.md`, `implement.md`, `handover.md`). Required top-level sections: `EXECUTION PROTOCOL` callout, `CONSTRAINTS`, `UNIFIED SETUP PHASE`, `PURPOSE`, `CONTRACT`, `WORKFLOW OVERVIEW`, `INSTRUCTIONS`, `OUTPUT FORMATS`, `REFERENCE`, `MEMORY INTEGRATION`, `QUALITY GATES`, `ERROR HANDLING`, `NEXT STEPS`. Frontmatter MUST include `description`, `argument-hint`, `allowed-tools` using the same style and vocabulary.
- **NFR-Q02**: The new `spec_kit_start_auto.yaml` and `spec_kit_start_confirm.yaml` assets MUST mirror the structural pattern of existing speckit YAMLs (`spec_kit_plan_auto.yaml`, `spec_kit_deep-research_auto.yaml`, `spec_kit_complete_auto.yaml`). Required top-level keys in order: `role`, `purpose`, `action`, `operating_mode`, `user_inputs`, `field_handling`, `packet_graph_metadata`, `documentation_levels`, `available_templates`, `workflow` (with `step_N_*` naming), `quality_gates`, `parallel_dispatch_config` (if applicable), and `completion_report`. Naming conventions for step IDs and variables MUST match prior art verbatim where semantics overlap (e.g. `spec_folder`, `execution_mode`, `step_preflight_contract`).
- **NFR-Q03**: All new markdown (`start.md`, `spec_check_protocol.md`) MUST pass `python3 .opencode/skill/sk-doc/scripts/validate_document.py` with zero errors. Warnings may be acknowledged only when they are inherited from the same-level template or the parallel pattern already in use by other speckit commands.
- **NFR-Q04**: All modifications to existing `plan.md`, `complete.md`, `deep-research.md` (and paired YAMLs) MUST preserve existing section ordering, anchor comments, and step IDs. Additions use the same callout style (`> ⚠️` / `> **Note:**`) and markdown-table conventions as the surrounding code. Renames are prohibited without an explicit migration note.
- **NFR-Q05**: Structural parity MUST be verified via `diff -u <new-file> <nearest-existing-sibling>` spot checks and recorded in `checklist.md`. A 50%+ structural overlap with the nearest sibling is the minimum acceptance bar; divergences MUST be justified in `decision-record.md` (if authored) or in the plan.md architecture section.
- **NFR-Q06**: All cross-repo README and SKILL documentation that references speckit commands MUST be audited and updated to reflect M1-M7 changes. Sweep: `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` plus root `README.md`. Each matched file MUST include `/spec_kit:start` in command inventories, updated `/spec_kit:deep-research` descriptions noting `spec.md` integration, updated `/spec_kit:plan` and `/spec_kit:complete` descriptions noting smart delegation, and links to `spec_check_protocol.md` where relevant. Updates are additions and in-place clarifications only (no renames, no removed sections).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty folder, or folder with `scratch/` only → `/start` creates the canonical trio only; it does not create `memory/` by default
- Folder with `spec.md` but no `description.json` or `graph-metadata.json` → `/start` enters metadata-only repair mode and regenerates the missing metadata without rewriting human-authored `spec.md`
- Folder containing tracked deep-research seed markers → `/start`, `/plan`, and `/complete` classify it as `placeholder-upgrade`, not as a healthy populated folder
- Phase-child folder (parent numbered, child numbered) → `description.json.parentChain` reflects both levels; `graph-metadata.json.parent_id` points to the numbered parent folder
- Very long feature description (> 500 characters) → truncated to 150 characters for `description.json.description`; full text preserved in `spec.md` §2 Problem Statement

### Error Scenarios
- User aborts mid-interview → re-entry persists `resume_question_id`, `repair_mode`, and `reentry_reason`; next `/spec_kit:start` or delegated parent run resumes at the first unresolved question or tracked seed marker
- `recommend-level.sh` returns non-zero exit code → fall back to Level 1 default; log a warning to the console; user can override
- Missing host anchor, duplicate markers, or human edits inside the generated findings block → deep-research emits a typed conflict audit and halts fail closed rather than repairing in place
- Staged canonical commit or rename failure after temp writes → pre-existing files are preserved, exact recovery output is shown, and optional memory save is not attempted
- Optional memory-save mode requested without sufficient structured context → canonical trio remains the success condition, memory save is skipped, and the reason is reported explicitly
- Target path is outside `specs/` or `.opencode/specs/` alias roots → `/start` refuses and shows the accepted root list

### State Transitions
- Deep-research → synthesis interrupted → `spec.md` retains pre-init updates only; post-synthesis additions deferred to the next synthesis run; audit log captures the interruption
- `/plan` delegated to `/start` → start completes → plan continues from Step 1 with populated `spec_path`, `feature_description`, and `level`
- `/start` on a folder that already passed a deep-research pre-init create → detects deep-research seed markers, enters `placeholder-upgrade`, and only exits once every tracked seed block is resolved or explicitly marked `N/A - insufficient source context`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 14 files across 4 commands + 1 skill; ~400–600 LOC net addition; introduces new command + YAML pair |
| Risk | 15/25 | Core workflow rewiring; modifies user-authored documents; cross-command coordination; audit logging requirement |
| Research | 10/20 | Script APIs documented; reusing existing helpers; interview pattern is the only novel design element |
| **Total** | **40/70** | **Level 2** — checklist.md to be authored during subsequent `/spec_kit:plan` |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- No blocking open questions remain after iteration 010. The remaining work is implementation sequencing: choose the concrete staged-write wrapper, wire the runtime audit sink, and patch the markdown/YAML surfaces in milestone order.

### M9 Open Questions

- **M9-Q1**: `:auto-debug` flag replacement — default is user escalation; orchestrate can still Task-dispatch `@debug` manually. Confirm during M9 execution whether a lightweight auto-dispatch-at-3-failures retained via Task tool is preferred over pure user escalation.
- **M9-Q2**: `/memory:save` handler enhancement to auto-initialize full 7-section `handover.md` from template when file does not exist — deliberately deferred to a follow-on packet. Confirm M9 does not need to absorb this scope.
- **M9-Q3**: Governance reversal path — if distributed-governance rule fails in practice (agents bypass `validate.sh`), a follow-on can introduce `@spec-master` as a slim replacement with same exclusive-writer contract. No action needed in M9 unless reversal triggers early.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC — Spec Kit Command Intake Refactor
- Covers two tightly-coupled features: /spec_kit:start and deep-research spec.md integration
- ~400–600 LOC net across commands, YAMLs, and skill references
- Checklist.md and decision-record.md deferred to follow-on /spec_kit:plan run
-->
