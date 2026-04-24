---
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/spec]"
description: "Unified packet covering three coordinated surgery passes on the agent and command graph: lean execution-guardrail update across three AGENTS files, canonical intake consolidation with shared intake-contract.md module plus /spec_kit:plan --intake-only, and hard-delete of /spec_kit:handover + /spec_kit:debug + @handover + @speckit middleware with distributed-governance replacement."
trigger_phrases:
  - "004-agent-governance-and-commands"
  - "agent execution guardrails"
  - "agents critical rules request analysis"
  - "canonical intake"
  - "intake contract"
  - "spec_kit plan intake only"
  - "deep research spec anchoring"
  - "middleware cleanup"
  - "handover debug deprecation"
  - "distributed governance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands"
    last_updated_at: "2026-04-24T17:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged two phase packets into a single Level 3 root under unified agent-governance framing"
    next_safe_action: "Treat root docs as authoritative; no further phase nesting"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:004-agent-governance-merge-2026-04-24"
      session_id: "004-agent-governance-merge-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet promoted from nested phase layout to flat Level 3 root docs with no child phases"
      - "Workstream A (AGENTS guardrails) and Workstream B (canonical intake + middleware cleanup) fused into one narrative"
      - "REQ, CHK, and ADR identifiers preserved verbatim for audit continuity"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: Agent Governance And Commands

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet closes three coordinated surgery passes on the agent and command graph for `026-graph-and-context-optimization`. All three passes landed together because they reshape the same surface: who speaks for SpecKit, how agents are told to behave, and which commands still exist.

- **Workstream A — Agent execution guardrails.** Three AGENTS instruction files (Public root `AGENTS.md`, the enterprise example `AGENTS_example_fs_enterprises.md`, and the Barter coder runtime `AGENTS.md`) received a lean execution-guardrail block under `## 1. CRITICAL RULES` as `### Request Analysis & Execution`. The old standalone request-analysis section is removed, later top-level headings are renumbered to `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, `## 7. SKILLS SYSTEM`, and the moved block now contains only `Flow` plus `#### Execution Behavior` before transitioning into `### Tools & Search`. All eight requested guardrails (ownership, persistence, anti-permission-seeking, plan-first, `CLAUDE.md` recall, self-checks, research-first surgical edits, data-over-assumption) live inside that block.
- **Workstream B — Canonical intake consolidation.** The three parallel intake surfaces (standalone `/spec_kit:start` + inline blocks in `/spec_kit:plan` and `/spec_kit:complete`) collapsed into one shared reference module at `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference that module in place of inline duplication; `/spec_kit:plan --intake-only` provides the standalone invocation path with an explicit YAML `intake_only` gate that terminates after Emit; `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only`; `/spec_kit:deep-research` anchors every run to a real `spec.md` via `spec_check_protocol.md`, a late-INIT advisory lock, folder-state classification, bounded pre-init mutation, and a machine-owned generated-fence for findings write-back.
- **Workstream C — Middleware cleanup.** `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, and `@speckit` (each with four runtime mirrors across `.opencode`, `.claude`, `.codex`, `.gemini`) are hard-deleted. `@debug` survives through Task-tool dispatch; the `@speckit` exclusivity rule is replaced by a distributed-governance contract in `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and the `system-spec-kit` SKILL; `/memory:save` owns packet handover maintenance via `handover_state` routing; the `:auto-debug` flag is removed from `/spec_kit:complete` in favour of an explicit user-escalation path.

Workstream A was sized Level 2; workstreams B and C shipped together as a Level 3 packet. The unified packet is Level 3 because that is the highest level of any merged component and because the 13 ADRs and 80+ touch points in B+C dominate the complexity profile.

**Critical Dependencies**: `/spec_kit:resume` routing; `validate.sh --strict`; sk-doc DQI validator; `generate-description.js` + graph-metadata backfill; cross-repo availability of the three AGENTS files.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Workstream A Delivered** | 2026-04-08 |
| **Workstream B + C Delivered** | 2026-04-15 |
| **Flattened Into Root** | 2026-04-24 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../003-code-graph-package/spec.md |
| **Successor** | ../005-release-cleanup-playbooks/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three related problems accumulated on the same surface before this packet landed:

1. **Agent execution guidance was scattered and weakly operational.** The request-analysis framework sat as a standalone top-level section with duplicated scaffolding (`Principle` table, `CLARITY Triggers`, `Pre-Change Checklist`, `Five Checks`, `STOP CONDITIONS`), the three AGENTS files drifted in wording, and the block did not explicitly require ownership, persistence, plan-first behavior, `CLAUDE.md` recall, self-checks, or data-first reasoning. Agents ended up hedging, stopping early, or asking permission for work already inside scope.
2. **SpecKit intake logic lived in three parallel places.** A standalone `/spec_kit:start` command plus inline intake blocks inside `/spec_kit:plan` and `/spec_kit:complete` each maintained their own copies of the five-state folder classification, four repair-mode branches, staged canonical-trio publication, manual relationship capture, resume semantics, and intake lock — with each copy drifting as features accumulated. `/spec_kit:deep-research` never authored or updated `spec.md`; findings lived in an isolated subdirectory and downstream `/plan` runs started from scratch.
3. **Four deprecated middleware wrappers kept cluttering the command graph after v3.4.0.0.** `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, and `@speckit` (each with four runtime mirrors) were redundant once v3.4.0.0 moved continuity into canonical docs and introduced the `/memory:save` content router. `@speckit` exclusivity blocked main-agent authoring of spec folders despite templates and `validate.sh --strict` already providing the quality gate.

### Purpose

Tell the three threads as one coherent end state:

- AGENTS instructions carry a lean execution-guardrail block under `## 1. CRITICAL RULES` in all three targets, with parallel wording and explicit operational imperatives for the eight requested behaviors.
- A single canonical intake contract at `.opencode/skill/system-spec-kit/references/intake-contract.md` owns folder classification, repair modes, trio publication, relationships, resume, and the intake lock. Both `/spec_kit:plan` and `/spec_kit:complete` reference that module in place of inline duplication; `/spec_kit:plan --intake-only` replaces the standalone command; `/spec_kit:deep-research` anchors every run to a real `spec.md` via the spec-check protocol.
- The deprecated middleware is gone. `@debug` survives through Task-tool dispatch; a distributed-governance rule replaces `@speckit` exclusivity; `/memory:save` owns packet handover maintenance; `:auto-debug` is removed from `/spec_kit:complete`.

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `../002-memory-quality-remediation/006-memory-duplication-reduction/`. Canonical narrative ownership stays in the canonical static docs; memory files carry only pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Workstream A — AGENTS execution guardrails**

- Update `AGENTS_example_fs_enterprises.md` (Public), `AGENTS.md` (Public root), and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` with the new execution guardrails moved under Section 1 `## 1. CRITICAL RULES` → `### Request Analysis & Execution`.
- Delete the old standalone request-analysis top-level section in all three files; renumber later top-level headings to `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, `## 7. SKILLS SYSTEM`; keep the Clarify bullet's `§4 Confidence Framework` reference correct.
- Strip duplicate support scaffolding from the moved block so it contains only `Flow` plus `#### Execution Behavior` before transitioning into `### Tools & Search`.
- Verify all eight requested guardrails land parallel across the three targets.

**Workstream B — Canonical intake + deep-research anchoring**

- **Shared canonical intake module**: `.opencode/skill/system-spec-kit/references/intake-contract.md` documents five folder states (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`), four repair modes (`create`, `repair-metadata`, `resolve-placeholders`, `abort`), staged canonical-trio publication, manual relationship capture with `packet_id` dedup, resume semantics, and the intake lock.
- **`/spec_kit:plan` with intake absorption**: Step 1 references the shared intake module. Adds `--intake-only` flag with an explicit YAML `intake_only` gate plus eight intake-contract flags (`--spec-folder`, `--level`, `--start-state`, `--repair-mode`, `--record-relationships`, `--depends-on`, `--related-to`, `--supersedes`). Preserves `:with-phases` pre-workflow.
- **`/spec_kit:complete` with intake reference**: Section 0 references the shared intake module; downstream Steps 5a/8/9 behavior unchanged; `:auto-debug` flag removed.
- **`/spec_kit:resume` routing**: Intake re-entry reasons (`incomplete-interview`, `placeholder-upgrade`, `metadata-repair`) route to `/spec_kit:plan --intake-only` with prefilled state. Packet handover document remains the first recovery source.
- **Deep-research spec anchoring**: Late-INIT advisory lock, `folder_state` classification, pre-init seed or bounded context updates, and post-synthesis generated-fence write-back. `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` documents lock lifecycle, seed-marker rules, host-anchor ownership, generated-fence replacement, audit events, and idempotency rules.

**Workstream C — Middleware cleanup**

- Delete `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit` (each with four runtime mirrors), Gemini command TOML mirrors, and the skill-registry `COMMAND_BOOSTS` entry for standalone intake prompting.
- Delete standalone `/spec_kit:start` surface (command card + two YAML assets + Gemini TOML) plus the `COMMAND_BOOSTS` entry at `SKILL.md:210`.
- Update cross-repo references across orchestrate agents, spec_kit commands, YAML workflows, root docs, install guides, skill docs, reference documents, CLI skill references.
- Replace `@speckit` exclusivity with a distributed-governance rule in `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and the system-spec-kit SKILL.
- Reposition `/memory:save` as canonical packet handover maintainer via `handover_state` routing.
- Remove `:auto-debug` flag from `/spec_kit:complete` in favor of explicit user escalation; preserve `@debug` agent in all four runtimes via Task-tool dispatch.

### Out of Scope

- Additional AGENTS, skill, command, or template files beyond the three named AGENTS targets and the command-graph surfaces above.
- Changes to `spec.md` Level 1/2/3/3+ templates themselves — reused unchanged.
- Changes to `create.sh`, `generate-description.js`, `recommend-level.sh`, or `generate-context.js` internals — helpers may be wrapped but their internals are unchanged.
- Graph-metadata backfill behavior — unchanged.
- New MCP tools or memory-system changes — this is a command-layer and instruction-surface refactor only.
- Retroactive migration of existing spec folders lacking `description.json` or `graph-metadata.json` — handled separately by backfill.
- Sibling packets `013-advisor-phrase-booster-tailoring` and `014-memory-save-rewrite` — unrelated scope.
- Historical changelog entries at `.opencode/changelog/01--system-spec-kit/` — historical records, only updated to reflect consolidated delivery, not rewritten.

### Files to Change

**Workstream A — AGENTS instruction files (3 files)**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS_example_fs_enterprises.md` | Modify | Keep `### Request Analysis & Execution` under `## 1. CRITICAL RULES`; drop duplicate support scaffolding; preserve only `Flow` plus `#### Execution Behavior`; remove standalone request-analysis section; retain renumbered later headings and `§4 Confidence Framework` reference. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md` | Modify | Same lean structural change in the Public root agent guidance. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` | Modify | Same lean structural change in the Barter coder runtime (adjusted only for local wording fit). |

**Workstream B — Shared reference module, protocol, and command surfaces**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Create | Canonical intake contract (folder classification, repair modes, trio publication, relationships, resume, lock). |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Create | Contract for advisory locking, folder-state detection, seed markers, host-anchor ownership, generated-fence replacement, audit events, idempotency. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Late-INIT advisory lock, `folder_state` classification, bounded pre-init mutation rules, post-synthesis generated-fence sync contract. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | INIT spec check, seed-create / conflict branches, SYNTHESIS generated-fence write-back with typed audit events. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Same state graph with explicit approvals for conflict handling, write-back, deferred-synthesis recovery. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add `spec_check_protocol` loading guidance. |
| `.opencode/command/spec_kit/plan.md` | Modify | Step 1 references shared intake module; add `--intake-only` flag; preserve `:with-phases`. |
| `.opencode/command/spec_kit/complete.md` | Modify | Section 0 references shared intake module; remove inline block; remove `:auto-debug`. |
| `.opencode/command/spec_kit/resume.md` | Modify | Route intake re-entry reasons to `/spec_kit:plan --intake-only`; remove `/spec_kit:handover` + `/spec_kit:debug` Next-Steps rows; update session-ending row to `/memory:save`. |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Reference-only language + `--intake-only` branch with explicit `intake_only` gate. |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Same. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Section 0 reference-only refactor; delete `:auto-debug` logic. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Same. |
| `.opencode/command/spec_kit/implement.md` | Modify | Remove `@speckit` + `@handover` from Do-Not-Dispatch; remove Session Handover Check step. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Remove `/spec_kit:handover` Next-Steps row. |
| `.opencode/command/spec_kit/assets/spec_kit_implement_{auto,confirm}.yaml` | Modify | Delete handover-check + debug-dispatch steps. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` | Modify | Remove any `@speckit`/`@handover` dispatch calls. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml` | Modify | Remove any `@speckit`/`@handover` dispatch calls. |
| `.opencode/command/memory/save.md` | Modify | Insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row; update §8 Next-Steps + §9 Related-Commands. |

**Workstream C — Middleware deletions (15 paths)**

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/handover.md` | Delete | Command deprecated. |
| `.opencode/command/spec_kit/debug.md` | Delete | Command deprecated. |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | Delete | Command YAML asset. |
| `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` | Delete | Command YAML asset. |
| `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` | Delete | Command YAML asset. |
| `.opencode/agent/handover.md` | Delete | `@handover` agent runtime 1/4. |
| `.claude/agents/handover.md` | Delete | `@handover` runtime 2/4. |
| `.codex/agents/handover.toml` | Delete | `@handover` runtime 3/4. |
| `.gemini/agents/handover.md` | Delete | `@handover` runtime 4/4. |
| `.opencode/agent/speckit.md` | Delete | `@speckit` agent runtime 1/4. |
| `.claude/agents/speckit.md` | Delete | `@speckit` runtime 2/4. |
| `.codex/agents/speckit.toml` | Delete | `@speckit` runtime 3/4. |
| `.gemini/agents/speckit.md` | Delete | `@speckit` runtime 4/4. |
| `.gemini/commands/spec_kit/handover.toml` | Delete | Gemini command mirror. |
| `.gemini/commands/spec_kit/debug.toml` | Delete | Gemini command mirror. |

**Workstream C — Root docs, orchestrate, agent descriptions**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md` | Modify | Delete `@speckit` + `@handover` bullets; update `@debug` to Task-tool dispatch; add distributed-governance rule; update Quick Reference rows. |
| `.opencode/agent/orchestrate.md` + 3 runtime mirrors | Modify | Remove `@speckit` + `@handover` routing rows, LEAF-list entries, agent-files entries; update `@debug` routing. |
| `.opencode/agent/debug.md` + 3 runtime mirrors | Modify | Update description to Task-tool dispatch pattern. |
| `.opencode/agent/ultra-think.md` + 3 runtime mirrors | Modify | Update `@debug` routing; remove `@speckit` refs. |
| `.opencode/README.md` | Modify | Delete `@handover` + `@speckit` rows; update `@debug`; delete deprecated-command bullets. |
| `README.md` | Modify | Update command-graph diagram. |

**Workstream C — Install guides, skill references, catalog**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/install_guides/README.md`, `SET-UP - AGENTS.md`, `SET-UP - Opencode Agents.md` | Modify | Agent tables + SpecKit commands update; remove `/start`, handover, debug references. |
| `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt` | Modify | Remove `/spec_kit:debug`, `/spec_kit:handover`, `/start` entries. |
| `.opencode/skill/system-spec-kit/SKILL.md` + `README.md` | Modify | Replace `@speckit` exclusivity with distributed-governance rule; remove `spec_kit:start` entry from `COMMAND_BOOSTS` at line 210. |
| `.opencode/skill/system-spec-kit/templates/{,level_2/,level_3/,level_3+/,addendum/}README.md` | Modify | Remove standalone-intake delegation notes. |
| `.opencode/skill/sk-code-web/README.md` + `references/debugging/debugging_workflows.md` | Modify | Remove `/spec_kit:debug` refs. |
| `.opencode/skill/system-spec-kit/references/**` (workflows, templates, memory, validation, debugging) | Modify | Replace `/spec_kit:handover` attributions with `/memory:save`; remove deprecated-command refs and `@speckit` gate references. |
| `.opencode/skill/sk-deep-review/README.md`, `.opencode/skill/skill-advisor/README.md` | Modify | Remove standalone-intake entries. |
| `.opencode/skill/cli-{claude-code,codex,gemini}/references/agent_delegation.md` | Modify | Delete `@handover` + `@speckit` entries; update `@debug` to Task-tool dispatch. |
| `.opencode/skill/cli-gemini/{SKILL.md,README.md}` | Modify | Update `@debug` dispatch example; remove `@debug` command ref. |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Modify | Delete handover/debug command refs. |
| `.opencode/command/improve/agent.md` | Modify | Remove `@handover` + `@speckit` improvement targeting. |
| `.opencode/skill/sk-doc/assets/agents/agent_template.md` | Modify | Agent table: delete `@handover` + `@speckit` rows. |
| `.opencode/specs/descriptions.json` | Modify | Update packet description entry (line 4809). |

**Workstream C — Standalone-intake surface deletions (4 paths)**

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/start.md` | Delete | Redundant with shared `intake-contract.md` (340 LOC). |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Delete | Asset for deleted command (508 LOC). |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Delete | Asset for deleted command (585 LOC). |
| `.gemini/commands/spec_kit/start.toml` | Delete | CLI routing for deleted command. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Requirement IDs are preserved verbatim from the two originating packets so existing audit trails continue to resolve: `REQ-401..REQ-414` belong to Workstream A (AGENTS guardrails); `REQ-001..REQ-030` belong to Workstreams B and C (canonical intake + middleware cleanup).

### P0 — Blockers (MUST complete)

**Workstream A**

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-401 | The packet must stay scoped to the three named AGENTS targets plus packet-local documentation and verification. | Final file set contains only the three AGENTS edits and this packet's docs or verification artifacts. |
| REQ-402 | All three AGENTS files must explicitly instruct agents to avoid ownership-dodging language and take responsibility for fixing issues encountered. | Each target file contains guidance that tells agents to own and fix encountered problems. |
| REQ-403 | All three AGENTS files must instruct agents not to stop early and to keep pushing toward a complete solution when safe and in scope. | Each target file includes explicit persistence guidance tied to complete problem resolution. |
| REQ-404 | All three AGENTS files must tell agents not to seek permission for work they are already capable of performing safely within scope. | Each target file includes operational wording that discourages unnecessary permission-seeking while preserving existing safety gates. |
| REQ-405 | All three AGENTS files must require planning for multi-step work before edits or tool execution. | Each target file includes a plan-first instruction for multi-step tasks. |
| REQ-406 | All three AGENTS files must place the request-analysis framework inside `## 1. CRITICAL RULES` under `### Request Analysis & Execution`. | Each target file contains that subsection in Critical Rules rather than as a standalone top-level section. |
| REQ-407 | The moved request-analysis block in all three AGENTS files must be lean and contain only `Flow` plus `#### Execution Behavior`. | Each target file omits the removed scaffolding and transitions from the moved block directly into `### Tools & Search`. |

**Workstreams B + C**

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research late INIT acquires the advisory lock and classifies `folder_state` in the resolved target folder. | Setup acquires `{spec_folder}/research/.deep-research.lock`, classifies `folder_state` as `no-spec` / `spec-present` / `spec-just-created-by-this-run` / `conflict-detected`, passes that state into INIT and SYNTHESIS, and records the result in a typed `spec_check_result` audit event. |
| REQ-002 | If `folder_state == no-spec`, deep-research seeds `spec.md` from the research ASK **before** the iteration loop begins. | INIT writes a Level 1 `spec.md`, emits `spec_seed_created`, and places tracked deep-research seed markers in placeholder-bearing anchors used for later upgrade. |
| REQ-003 | If `folder_state == spec-present`, deep-research applies bounded pre-init context updates and fails closed on ambiguity. | Normalized research topic is deduped and appended only at approved host locations; missing anchors or duplicate markers emit `spec_mutation_conflict`; semantic-purpose conflicts halt rather than rewrite human prose. |
| REQ-004 | Post-synthesis, deep-research writes back abridged findings through one machine-owned generated block under the chosen host anchor. | SYNTHESIS writes or replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block; emits `spec_synthesis_deferred` instead of partial output when interrupted. |
| REQ-005 | Shared canonical intake module exists with complete contract. | `.opencode/skill/system-spec-kit/references/intake-contract.md` authored with all five folder states, four repair modes, trio publication, relationship capture, resume semantics, intake lock. |
| REQ-006 | `/spec_kit:plan` absorbs intake via the shared reference. | `plan.md` Step 1 references the shared module; no duplicate intake logic in `plan.md` body. |
| REQ-007 | `/spec_kit:complete` absorbs intake via the shared reference. | `complete.md` Section 0 references the shared module; no duplicate intake logic in `complete.md` body. |
| REQ-008 | `--intake-only` flag halts `/spec_kit:plan` after Step 1 with explicit YAML gate. | `/spec_kit:plan --intake-only` halts after Step 1 (trio published, no planning); YAML workflow contains an explicit `intake_only` gate that terminates successfully after Emit and bypasses Steps 2-7. |
| REQ-009 | `/spec_kit:resume` routing updated for intake re-entry. | Resume routes `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` to `/spec_kit:plan --intake-only` with prefilled state. |
| REQ-010 | Intake resume and re-entry contract is enforced. | `/spec_kit:plan --intake-only` and delegated `/plan` / `/complete` normalize `start_state` into `empty-folder` / `partial-folder` / `repair-mode` / `placeholder-upgrade` / `populated-folder`; reruns persist `resume_question_id`, `repair_mode`, `reentry_reason`. |
| REQ-011 | `/spec_kit:debug` and `/spec_kit:handover` commands + YAML assets + Gemini command TOML mirrors are deleted. | 7 deprecated command/asset surfaces no longer exist; `grep -rE "/spec_kit:(handover\|debug)"` on active docs returns empty. |
| REQ-012 | `@handover` and `@speckit` agents deleted across all 4 runtime mirrors (8 files total). | 8 agent files no longer exist; `grep -rE "@handover\|@speckit"` on active docs returns empty. |
| REQ-013 | `@speckit` exclusivity rule replaced with distributed-governance rule across `CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, and system-spec-kit SKILL.md. | All four files contain the replacement rule using templates + `validate.sh --strict` + `/memory:save`. |
| REQ-014 | Standalone `/spec_kit:start` + assets deleted. | `start.md`, 2 YAML assets, `.gemini/.../start.toml` removed. |
| REQ-015 | Skill registry cleaned. | `COMMAND_BOOSTS` entry at `SKILL.md:210` for standalone intake no longer surfaces in the harness skill list. |
| REQ-016 | Zero forward-looking standalone-intake refs. | Grep for `/spec_kit:start` or `spec_kit/start.md` in forward-looking docs returns zero matches (historical changelogs excluded). |
| REQ-017 | Structural validation passes. | `validate.sh --strict` exits 0 (or documents `SPEC_DOC_INTEGRITY` warnings that reference documented supersession narrative). |

### P1 — Required (complete OR user-approved deferral)

**Workstream A**

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-408 | All three AGENTS files must remind agents to recall and apply project-specific conventions from `CLAUDE.md` files. | Each target file references `CLAUDE.md` convention recall operationally. |
| REQ-409 | All three AGENTS files must require self-checks and reasoning loops that catch and fix the agent's own mistakes. | Each target file includes explicit self-correction guidance. |
| REQ-410 | All three AGENTS files must require a research-first tool approach and a preference for surgical edits over broad rewrites. | Each target file tells agents to inspect evidence first and keep edits narrow. |
| REQ-411 | All three AGENTS files must tell agents to reason from actual data rather than assumptions. | Each target file includes explicit evidence-over-assumption guidance. |
| REQ-412 | All three AGENTS files must delete the old standalone request-analysis section and leave later top-level sections renumbered as `## 5`, `## 6`, `## 7`. | Each target file shows `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, `## 7. SKILLS SYSTEM` and no dedicated request-analysis section. |
| REQ-413 | The moved request-analysis block must keep the confidence cross-reference correct. | Each target file uses `§4 Confidence Framework` in the Clarify bullet. |
| REQ-414 | Packet docs and verification notes must describe the three-file scope, structural move, section deletion, lean block shape, renumbering, and evidence consistently. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` align on scope and structure changes. |

**Workstreams B + C**

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-018 | Manual graph relationships capture works. | `graph-metadata.json.manual.depends_on`, `.related_to`, `.supersedes` store objects shaped as `{ packet_id, reason, source, spec_folder?, title? }`; repeated runs dedupe by `packet_id`; contract in `intake-contract.md §8`. |
| REQ-019 | Level recommendation preserved. | `intake-contract.md §7` derives numeric `loc/files/risk` proxies; records `level_recommendation` separately from `selected_level`. |
| REQ-020 | Auto and confirm modes share one state graph. | Both `/spec_kit:plan` YAML workflows implement the same folder states and returned fields; only approval density and prompt compression differ; contract in `intake-contract.md §4`. |
| REQ-021 | Deep-research and intake flows are idempotent across repeated runs. | Normalized research topics, tracked seed markers, generated-fence replacement, and manual-relationship object dedupe prevent duplicate content across reruns. |
| REQ-022 | All active-doc references to deprecated commands/agents updated. | Zero-reference grep sweep across 50+ active files returns empty. |
| REQ-023 | Preserved capabilities: `@debug` agent (4 runtime mirrors), preserved templates, `system-spec-kit` skill, MCP server code, stop-hook autosave, `/spec_kit:resume` recovery ladder. | Survival checks pass for all preserved surfaces. |
| REQ-024 | `/memory:save` positioned as canonical packet handover maintainer via `handover_state` routing; `:auto-debug` flag removed from `/spec_kit:complete`. | `save.md` §1 contains "Handover Document Maintenance" subsection; `spec_kit_complete_{auto,confirm}.yaml` contains no `:auto-debug` references. |
| REQ-025 | Root README command-graph updated. | Root `README.md` reflects new architecture; graph diagram shows no `/spec_kit:start` node. |
| REQ-026 | CLI agent-delegation refs updated. | All three cli-* skill `agent_delegation.md` files carry correct post-cleanup references. |
| REQ-027 | Install guides updated. | Both install guide files free of `/start` references. |
| REQ-028 | Template READMEs updated. | All five template README files free of standalone-intake delegation notes. |
| REQ-029 | Changelog entry authored. | Entry at `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` documents the canonical-intake end state and standalone-intake deprecation. |
| REQ-030 | sk-doc validator PASS. | All canonical docs pass DQI scoring. |

### Acceptance Scenarios

1. **Ownership + persistence land in all three AGENTS targets.** Given an agent encounters an issue inside scope, when it reads the updated guidance, then it is told to own the problem and keep working toward a complete fix, and it is not encouraged to stop early or dodge responsibility.
2. **Agents plan + research first.** Given a multi-step task, when the updated instructions apply, then the agent plans the approach, uses a research-first, evidence-driven workflow, and prefers surgical edits.
3. **Request-analysis moved into Critical Rules.** Given the AGENTS files previously held request-analysis guidance as a top-level section, when the updated layout lands, then that guidance appears under `## 1. CRITICAL RULES` as `### Request Analysis & Execution`, and the moved block keeps only `Flow` plus `#### Execution Behavior` before `### Tools & Search`.
4. **Agents rely on local conventions and self-correction.** Given project-specific conventions in `CLAUDE.md`, when an agent prepares to act, then it recalls and applies those conventions and uses self-checks to catch and repair its own mistakes.
5. **Deep-research seeds a new folder.** Given an empty packet folder, when `/spec_kit:deep-research "topic"` starts, then it seeds `spec.md` before iteration 001 and records tracked seed markers for later upgrade.
6. **Deep-research stays idempotent on a populated folder.** Given a populated folder with existing `spec.md`, when deep-research runs on the same topic twice, then the normalized pre-init context and generated findings fence appear only once and human-owned prose remains untouched.
7. **Standalone intake via flag.** Given an empty folder, when `/spec_kit:plan --intake-only feature-description` runs, then the canonical trio is published via the shared intake-contract module and the command exits without producing `plan.md`/`tasks.md`/`checklist.md`.
8. **Healthy folder bypass.** Given a populated folder, when `/spec_kit:plan feature-description` runs, then intake is bypassed cleanly and planning proceeds without extra prompts.
9. **Repair-mode intake before planning.** Given a folder needing repair, when `/spec_kit:plan` runs, then repair-mode interview runs inline via the shared module before planning.
10. **Complete delegates intake via shared module.** Given `/spec_kit:complete` on a folder requiring intake, when Section 0 executes, then the shared intake-contract module runs and completion proceeds.
11. **Resume routes intake re-entry.** Given a session with `reentry_reason: incomplete-interview`, when `/spec_kit:resume` runs, then the operator is routed to `/spec_kit:plan --intake-only` with prefilled state.
12. **Deleted start command returns clean not-found.** Given I invoke the deleted `/spec_kit:start`, then the harness returns "command not found" cleanly (no silent failure); the changelog documents `/spec_kit:start → /spec_kit:plan --intake-only`.
13. **Scope stays narrow for AGENTS edits.** Given the AGENTS workstream is limited to three files plus packet docs, when implementation completes, then unrelated policy cleanup is excluded.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Workstream A success criteria

- **SC-401**: All three AGENTS files contain the requested execution guardrails in explicit operational language.
- **SC-402**: All three AGENTS files place the request-analysis framework under `## 1. CRITICAL RULES` and remove the old standalone section.
- **SC-403**: The moved block is lean in all three files and contains only `Flow` plus `#### Execution Behavior` before `### Tools & Search`.
- **SC-404**: Later top-level sections are renumbered cleanly as `## 5`, `## 6`, `## 7`; the Clarify bullet points to `§4 Confidence Framework`.
- **SC-405**: Packet documentation stays aligned to the three-file scope and the structural changes.
- **SC-406**: The Workstream-A evidence validates cleanly and leaves a same-session implementation record.

### Workstream B + C success criteria — intake and deep-research

- **SC-001**: `/spec_kit:deep-research "topic"` on an empty target folder produces `spec.md` **before** any iteration runs, with tracked seed markers placed in placeholder-bearing anchors.
- **SC-002**: `/spec_kit:deep-research "topic"` on a folder with existing `spec.md` appends the normalized topic/context only at approved pre-init locations and replaces one generated findings block during synthesis without overwriting user-authored content.
- **SC-003**: `/spec_kit:plan --intake-only` on an empty folder publishes `spec.md`, `description.json`, and `graph-metadata.json` passing packet validation via the shared `intake-contract.md` module.
- **SC-004**: `/spec_kit:plan` on a `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` target folder absorbs intake via the shared module, then continues its existing workflow.
- **SC-005**: `/spec_kit:complete` demonstrates the same shared-module reference behavior with a single additional round-trip at most when intake is required.
- **SC-006**: Zero regression — running `/spec_kit:plan` or `/spec_kit:complete` on a folder already satisfying the healthy contract behaves exactly as before (no new prompts, no delegation).
- **SC-007**: Placeholder-upgrade flows complete only after every tracked seed marker is replaced with confirmed content or the explicit fallback `N/A - insufficient source context`.
- **SC-008**: Optional memory-save mode only runs when sufficient structured context exists, and its skip or failure state does not invalidate an already committed canonical trio.

### Workstream B + C success criteria — shared module and resume

- **SC-009**: Shared intake module exists with complete contract.
- **SC-010**: `plan.md` Step 1 references the shared module; no duplicate intake logic in `plan.md` body.
- **SC-011**: `complete.md` Section 0 references the shared module; no duplicate intake logic in `complete.md` body.
- **SC-012**: `/spec_kit:plan --intake-only` halts after Step 1 end-to-end with explicit YAML gate.
- **SC-013**: `/spec_kit:resume` re-entry routes to `/spec_kit:plan --intake-only` correctly.
- **SC-014**: `start.md`, both YAML assets, `.gemini/.../start.toml` deleted; `COMMAND_BOOSTS` entry removed at `SKILL.md:210`.
- **SC-015**: Zero `/spec_kit:start` references in forward-looking docs.
- **SC-016**: sk-doc validator PASS on all canonical docs.
- **SC-017**: `validate.sh --strict` exits 0 (or documents `SPEC_DOC_INTEGRITY` warnings referencing documented supersession narrative).

### Workstream C success criteria — middleware cleanup

- **SC-018**: `grep -rE "/spec_kit:(handover|debug)"` across active docs returns zero matches.
- **SC-019**: `grep -rE "@handover|@speckit"` across active docs returns zero matches.
- **SC-020**: `/memory:save` command card documents it as the canonical packet handover maintainer via `handover_state` routing.
- **SC-021**: `/spec_kit:resume` on an existing spec folder still reads the packet handover document as the first recovery source.
- **SC-022**: `@debug` agent remains dispatchable via Task tool in all 4 runtimes; `@deep-research` retains exclusive write access for `research/research.md`.
- **SC-023**: `system-spec-kit` skill, preserved templates (`handover.md`, `debug-delegation.md`, `level_N/`), and all MCP server code remain unchanged and functional.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Workstream A risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to all three target AGENTS files | Blocks the phase if any target cannot be read or updated | Read all three files first, then keep verification evidence for all paths |
| Risk | Guardrail wording becomes abstract | Future agents ignore intent or interpret loosely | Use concrete operational phrasing that mirrors the requested behavior |
| Risk | Broader cleanup sneaks into AGENTS edits | Scope expands beyond the packet | Restrict implementation to the three requested AGENTS files and packet docs only |
| Risk | Three AGENTS files drift in wording | One runtime may enforce weaker behavior | Verify all three files against the same eight-point checklist |
| Risk | Guidance conflicts with existing safety gates | Agents get contradictory instructions | Keep anti-permission wording explicitly bounded by existing safety and scope rules |

### Workstream B + C risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seed-marker drift or untracked placeholder edits break placeholder-upgrade re-entry | `/plan` and `/complete` may misclassify an unfinished folder as healthy | Use explicit tracked seed markers only; block completion until cleared; fail closed on ambiguous marker state |
| Risk | Generated-fence conflicts or human edits inside the machine-owned findings block | Deep-research write-back could overwrite user content or duplicate findings | Require exactly one matching `BEGIN/END GENERATED: deep-research/spec-findings` pair; emit typed conflict audits; halt instead of repairing in place |
| Risk | Staged canonical commit fails mid-publication | Canonical trio may become inconsistent | Temp-sibling staging plus final publish semantics; preserve pre-existing files on failure; surface exact recovery steps |
| Risk | `generate-context.js` treated as default metadata-only repair path | Intake creation/repair inherits memory-save failure modes | Keep baseline intake creation and metadata repair independent from `generate-context.js` |
| Risk | Intake delegation regresses healthy-folder `/plan` or `/complete` behavior | Existing commands become noisier | Gate delegation strictly to non-healthy states; healthy folders bypass |
| Risk | Advisory lock contention or stale lock cleanup stalls valid deep-research runs | Second writers may corrupt spec state | Treat lock contention as first-class blocking state; require confirm for stale-lock override |
| Risk | `plan.md` size growth | Projected 550-600 LOC after intake absorption | Shared-module extraction reduces duplication; reference-only inclusion keeps `plan.md` from carrying full contract ([CHK-034](./checklist.md#chk-034)) |
| Risk | Atomic downstream sweep misses a ref | 26 modify + 4 delete files = 30 touch points | Exhaustive grep baseline established; closure gate re-runs grep; P0 [CHK-051](./checklist.md#chk-051) blocks closeout |
| Risk | Intake lock race | Lock must cover Step 1 only, not Steps 2-8 | ADR-006 scopes lock explicitly ([CHK-041](./checklist.md#chk-041)) |
| Risk | Breaking external invokers | External scripts/docs outside repo call `/spec_kit:start` | Hard delete is user-requested; release changelog provides migration note |
| Risk | sk-doc voice drift in `intake-contract.md` | New reference doc must match project voice | sk-doc validator enforced as P0 ([CHK-054](./checklist.md#chk-054)) |
| Risk | Main agent writes spec folder docs without templates after `@speckit` deletion | Quality degrades; packet validation fails | Distributed-governance rule in root docs + SKILL; YAML workflow steps call `validate.sh`; checklist catches gaps |
| Risk | Hidden dispatcher of `@speckit` or `@handover` in MCP handlers or hooks | Deletion breaks workflows | Zero-reference sweep; rollback path deletes 17 files as one commit that can be reverted together |
| Risk | `:auto-debug` flag removal breaks users relying on auto-escalation at 3+ failures | Silent loss of auto-debug fallback | Replace with explicit "escalate to user with diagnostic summary" path |
| Risk | Full 7-section packet handover regeneration becomes unavailable | Users lose deliberate-handover capability | Accept trade-off; `/memory:save` maintains `session-log`; stop hook auto-saves continuity |
| Dependency | `create.sh`, `generate-description.js`, Level 1/2 templates | Canonical trio emission depends on helper reuse | Reuse helpers and templates as-is |
| Dependency | `recommend-level.sh` CLI contract | Level suggestion depends on stable helper inputs | Derive numeric proxies before invocation; store helper output separately from confirmed level |
| Dependency | `validate_document.py` and packet strict validation | Success criteria depend on validator-backed checks | Run validator-backed verification as part of completion |
| Dependency | Harness skill registry | Removal of `spec_kit:start` entry requires exact registry file path | `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary |
| Dependency | `/spec_kit:resume` routing | Routing change must match shared module's `reentry_reason` values | Verification covers round-trip |
| Dependency | Templates + bash scripts at `scripts/spec/` | Distributed governance depends on these remaining stable | Templates and scripts explicitly preserved; survival check verifies |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `/spec_kit:plan --intake-only` completes in ≤ 2 consolidated prompts (confirm mode); 0 prompts in auto mode when all required flags are provided.
- **NFR-P02**: `/spec_kit:plan` and `/spec_kit:complete` smart-delegation adds ≤ 1 additional user turn when target folder is empty; zero additional turns when `spec.md` already exists.
- **NFR-P03**: Intake contract execution time target <2s on healthy folder classification.

### Security / Integrity

- **NFR-S01**: No command may overwrite user-authored `spec.md` content silently — all mutations are anchor-bounded appends or clearly-fenced new sections.
- **NFR-S02**: Deep-research auto mode writes a JSONL audit record to `research/deep-research-state.jsonl` for every `spec.md` mutation (`type: "spec_mutation"`, `anchors_touched: [...]`, `diff_summary: "..."`).
- **NFR-S03**: Interview answers populating `graph-metadata.json.manual.*` must be objects containing `packet_id`, `reason`, and `source`; optional `spec_folder` / `title` hints preserved only as denormalized metadata.
- **NFR-S04**: Delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching emit typed audit events.
- **NFR-S05**: Intake lock prevents concurrent trio publication under the same `spec_folder` path (fail-closed). Implementation: `withSpecFolderLock()` in `mcp_server/handlers/save/spec-folder-mutex.ts` serializes per-folder saves via a promise-chain map; on prior-save failure the chain `.catch()`-continues; the map entry is cleaned up in `finally` only when the current chain is still the tail. Callers: `memory-save.ts:2396` and `atomic-index-memory.ts:324`.

### Reliability

- **NFR-R01**: Staged trio publication remains atomic — partial writes never leave visible half-published state.
- **NFR-R02**: Canonical trio publication uses staged commit semantics and preserves pre-existing files on failure. Optional memory save is outside the canonical trio transaction.
- **NFR-R03**: `/spec_kit:plan --intake-only` is idempotent on empty folder (repeat invocation yields identical trio, no duplicate intake lock).
- **NFR-R04**: `/spec_kit:plan` on an already-populated folder does not re-ask intake questions.

### Quality / Consistency (Workstream-A maintainability also enforced)

- **NFR-Q01**: Modified command cards and YAML assets preserve existing section ordering, anchor comments, and step IDs. Renames prohibited without migration note.
- **NFR-Q02**: All new markdown passes `validate_document.py` with zero errors.
- **NFR-Q03**: Modifications to `plan.md`, `complete.md`, `deep-research.md`, `resume.md` and paired YAMLs preserve existing section ordering, anchor comments, step IDs.
- **NFR-Q04**: Cross-repo README and SKILL documentation referencing speckit commands is audited and updated.
- **NFR-Q05**: `validate.sh --strict` PASS on all canonical docs before closeout.
- **NFR-Q06**: sk-doc DQI PASS on all canonical docs.
- **NFR-Q07**: Grep sweep confirms zero `/spec_kit:start` references in forward-looking scoped paths.
- **NFR-M01** (Workstream A): The AGENTS guidance reads as operational policy, not aspirational prose.
- **NFR-M02** (Workstream A): All three AGENTS files stay meaningfully parallel so later sync work is straightforward.
- **NFR-T01** (Workstream A): The checklist maps the eight requested guardrails to direct evidence in the three AGENTS files.
- **NFR-T02** (Workstream A): The implementation summary records what changed in each AGENTS file and how the packet was validated.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Workstream A

- Existing wording may already imply one of the requested behaviors; Phase A still makes the guidance explicit if the current language leaves room for weak interpretation.
- One target file may need slightly different phrasing to fit local structure, but the meaning of all eight guardrails must remain aligned.
- Anti-permission guidance must not erase escalation rules for true blockers, missing context, or safety boundaries.
- Planning-first guidance should reinforce action readiness, not add process overhead for trivial one-step tasks.
- Removing duplicate scaffolding must not remove actual behavior requirements; the leaner block still has to preserve all eight execution bullets.

### Workstream B + C — data boundaries

- Empty folder, or folder with `scratch/` only → shared intake contract creates the canonical trio only; does not create `memory/` by default.
- Folder with `spec.md` but no `description.json` or `graph-metadata.json` → enters metadata-only repair mode and regenerates the missing metadata without rewriting human-authored `spec.md`.
- Folder containing tracked deep-research seed markers → classified as `placeholder-upgrade`, not as a healthy populated folder.
- Phase-child folder → `description.json.parentChain` reflects both levels; `graph-metadata.json.parent_id` points to the numbered parent folder.
- Very long feature description (> 500 characters) → truncated to 150 characters for `description.json.description`; full text preserved in `spec.md §2 Problem Statement`.
- Empty folder with `--intake-only` → publishes trio + intake lock; no planning artifacts created.
- Populated folder with `--intake-only` → no-op on trio; exits cleanly.

### Workstream B + C — error scenarios

- User aborts mid-interview → re-entry persists `resume_question_id`, `repair_mode`, `reentry_reason`; next `/spec_kit:plan --intake-only` resumes at first unresolved question.
- `recommend-level.sh` returns non-zero exit → fall back to Level 1 default; log warning; user can override.
- Missing host anchor, duplicate markers, or human edits inside the generated findings block → deep-research emits typed conflict audit and halts fail-closed.
- Staged canonical commit or rename failure after temp writes → pre-existing files preserved; exact recovery output shown; optional memory save not attempted.
- Optional memory-save mode requested without sufficient structured context → canonical trio remains the success condition; memory save skipped; reason reported explicitly.
- Target path outside `specs/` or `.opencode/specs/` alias roots → refuses and shows accepted root list.
- Intake lock contention → fail-closed; return error; do not partial-write.
- Resume re-entry to deleted `/spec_kit:start` invocation → backward-compat handling via session migration note in v3.4.0.0 changelog.
- External script invoking `/spec_kit:start` → hard delete breaks these; changelog provides migration mapping `/spec_kit:start → /spec_kit:plan --intake-only`.

### Workstream B + C — state transitions

- Deep-research → synthesis interrupted → `spec.md` retains pre-init updates only; post-synthesis additions deferred to next synthesis run.
- `/spec_kit:plan` detects non-healthy folder → loads `intake-contract.md §5`, executes repair-mode branch, then continues to Step 2 planning.
- `/spec_kit:plan --intake-only` completes Step 1 → halts at Emit (explicit YAML `intake_only` gate); planning Steps 2-7 bypassed.
- `/spec_kit:resume` detects `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → routes to `/spec_kit:plan --intake-only` with prefilled state.
- `/spec_kit:resume` detects `reentry_reason in {none, planning-paused, implementation-paused}` → routes to full `/spec_kit:plan` or `/spec_kit:implement` as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~83 touch points (3 AGENTS files + 15 middleware deletions + 50+ reference modifications + 4 standalone-intake deletions + 26 forward-looking doc updates + new shared reference module); LOC delta: ~1200; Systems: 6 (commands, skills, templates, CLI configs, registry, MCP) plus cross-repo AGENTS sync |
| Risk | 20/25 | Breaking: Y (external invokers of `/spec_kit:start`); Architectural: Y (consolidates three parallel surfaces into one shared reference); modifies user-authored documents; cross-repo AGENTS sync |
| Research | 10/20 | Script APIs documented; reusing existing helpers; shared-module pattern is novel design element |
| Multi-Agent | 7/15 | M1-M9 sequential + parallel middleware deletion; M10-M15 shared-module consolidation delegated to cli-copilot (GPT-5.4 reasoning=high); 5 parallel Opus agents for deep-review remediation |
| Coordination | 12/15 | Dependencies: helpers, resume routing, skill registry, MCP handlers, cross-workspace AGENTS files |
| **Total** | **71/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
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
| R-008 | Generated-fence conflicts with human edits | M | L | Require exactly one BEGIN/END GENERATED pair + typed conflict audits + halt |
| R-009 | Staged canonical commit fails mid-publication | M | L | Temp-sibling staging + preserve pre-existing files on failure |
| R-010 | Main agent writes spec folder docs without templates after `@speckit` deletion | H | L | Distributed-governance rule (ADR-011) + YAML `validate.sh --strict` enforcement |
| R-011 | Hidden dispatcher of `@speckit`/`@handover` in MCP handlers | H | L | Zero-reference sweep + rollback via 17-file revert |
| R-012 | `:auto-debug` removal breaks auto-escalation workflows | L | L | Explicit user escalation path; `@debug` still available via Task tool |
| R-013 | sk-doc voice drift in `intake-contract.md` | L | L | sk-doc DQI validator enforced as P0 (CHK-054) |
| R-014 | AGENTS wording drifts across the three targets | M | M | Eight-point matrix verified against each file directly |
| R-015 | AGENTS edits weaken an existing safety rule | H | L | Keep anti-permission wording bounded by existing hard blockers; re-read after editing |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Agents take ownership (Priority: P0)

**As a** developer relying on SpecKit agents, **I want** the three AGENTS files to carry explicit ownership and persistence guidance, **so that** agents stop hedging or bailing when they hit friction inside scope.

**Acceptance**:
1. Given an agent encounters an issue, when it reads updated AGENTS guidance, then it is told to own and fix that issue instead of framing it as "not my change".
2. Given a multi-step task, when the agent executes, then it pushes toward a complete solution and does not stop at artificial checkpoints.

### US-002: Unified intake surface (Priority: P0)

**As a** SpecKit user invoking `/spec_kit:plan`, **I want** intake to happen automatically when needed, **so that** I don't need to know about a separate `/spec_kit:start` command.

**Acceptance**:
1. Given an empty folder, when I run `/spec_kit:plan feature-description`, then trio is published via shared intake contract and planning proceeds with no separate command invocation.
2. Given a populated folder, when I run `/spec_kit:plan feature-description`, then the intake block is bypassed cleanly.
3. Given a folder needing repair, when I run `/spec_kit:plan`, then repair-mode interview runs inline before planning.

### US-003: Intake-only invocation (Priority: P0)

**As a** SpecKit user wanting to create a spec folder without planning yet, **I want** a `--intake-only` flag, **so that** I can set up the folder and return to it later.

**Acceptance**:
1. Given an empty folder, when I run `/spec_kit:plan feature-description --intake-only`, then the trio is published and the command exits without producing `plan.md` / `tasks.md` / `checklist.md`.
2. Given a populated folder, when I run `/spec_kit:plan --intake-only`, then no-op exit with informational message.

### US-004: Resume continuity (Priority: P1)

**As a** SpecKit user resuming interrupted work, **I want** `/spec_kit:resume` to route me correctly when I was mid-intake, **so that** I don't lose state.

**Acceptance**:
1. Given a session with `reentry_reason: incomplete-interview`, when I run `/spec_kit:resume`, then I'm routed to `/spec_kit:plan --intake-only` with prefilled state.
2. Given a session with `reentry_reason: placeholder-upgrade`, then the same route applies.

### US-005: Deprecation clarity (Priority: P1)

**As a** SpecKit user who previously used `/spec_kit:start`, `/spec_kit:handover`, or `/spec_kit:debug`, **I want** clear migration guidance, **so that** I can update my workflows.

**Acceptance**:
1. Given I check the changelog, when I look up v3.4.0.0, then I find migration mappings for `/spec_kit:start → /spec_kit:plan --intake-only`, `/spec_kit:handover → /memory:save`, `/spec_kit:debug → Task-tool dispatch of @debug`.
2. Given I invoke the deleted commands, then the harness returns "command not found" cleanly.

### US-006: Distributed governance (Priority: P1)

**As a** SpecKit contributor authoring spec-folder docs, **I want** clear governance rules after `@speckit` exclusivity deletion, **so that** quality stays consistent.

**Acceptance**:
1. Given I edit any spec-folder `*.md`, then I use templates from `.opencode/skill/system-spec-kit/templates/level_N/` and run `validate.sh --strict` after each file write.
2. Given continuity updates are needed, then I route through `/memory:save` rather than authoring standalone continuity files.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

No blocking open questions remain. All architectural choices were resolved via AskUserQuestion during planning sessions on 2026-04-08 (Workstream A) and 2026-04-15 (Workstreams B + C).

### Resolved Notes

- **`:auto-debug` replacement**: Replaced with explicit user escalation; orchestrate can still Task-dispatch `@debug` manually.
- **`/memory:save` auto-initialize**: Full 7-section packet handover auto-initialization deferred to a follow-on packet.
- **Distributed-governance rule**: In effect; no reversal path triggered.
- **AGENTS parallelism**: All three AGENTS files stay meaningfully parallel; the Barter coder file uses local wording fit where needed.
- **Five Checks evaluation** (Level 3 required): 5/5 PASS (recorded in `plan.md`).
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
- **Deep Review Report**: `review/004-agent-execution-guardrails-pt-01/` (Workstream A audit trail)

---

<!--
LEVEL 3 SPEC — Agent Governance And Commands (merged)
- Workstream A (REQ-401..REQ-414) covers three AGENTS files: lean request-analysis block under Critical Rules; standalone section deleted; later headings renumbered 5/6/7; eight execution guardrails explicit and parallel.
- Workstream B (REQ-001..REQ-010, REQ-018..REQ-021) covers canonical intake consolidation: shared intake-contract.md module; /spec_kit:plan --intake-only with explicit YAML gate; /spec_kit:complete references shared module; /spec_kit:resume routing; /spec_kit:deep-research anchored to real spec.md via spec_check_protocol.md.
- Workstream C (REQ-011..REQ-017, REQ-022..REQ-030) covers middleware cleanup: hard-delete /spec_kit:handover, /spec_kit:debug, @handover, @speckit × 4 runtimes each; distributed-governance rule; /memory:save as canonical packet handover maintainer; :auto-debug removed; standalone /spec_kit:start deleted.
- Deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2); 5 parallel Opus agents fixed all before closeout.
- REQ, CHK, ADR identifiers preserved verbatim from the two originating packets for audit continuity.
-->
