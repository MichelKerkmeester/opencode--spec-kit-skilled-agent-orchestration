---
title: "Feature Specification: Spec-Kit Command Graph — Canonical Intake and Merger [template:level_3/spec.md]"
description: "Unified command-graph evolution: (Phase A) introduce /spec_kit:start as canonical intake + inline absorption in /plan and /complete + M9 middleware cleanup; (Phase B) collapse all three intake surfaces into shared intake-contract module with /spec_kit:plan --intake-only and hard-delete /spec_kit:start"
trigger_phrases:
  - "spec kit commands"
  - "spec kit start"
  - "spec intake"
  - "deep research spec check"
  - "intake contract module"
  - "spec_kit plan intake only"
  - "start into plan merger"
  - "middleware cleanup"
  - "distributed governance"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Merged packet 015-start-into-plan-merger into 012 as unified command-graph evolution spec"
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
      fingerprint: "sha256:015-into-012-merger-2026-04-15"
      session_id: "012-merged-spec-2026-04-15"
      parent_session_id: "012-spec-kit-commands-final-closeout"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase A and Phase B consolidated into one coherent command-graph evolution story"
      - "All 15 enumerated M9 deletions preserved as historical evidence; shared module replaces inline duplication"
      - "Standalone /spec_kit:start now hard-deleted; /spec_kit:plan --intake-only replaces it"
---
# Feature Specification: Spec-Kit Command Graph — Canonical Intake and Merger

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet tells the complete command-graph evolution story across two phases delivered sequentially.

**Phase A (delivered 2026-04-14)** introduced `/spec_kit:start` as the canonical spec-folder intake command, anchored `/spec_kit:deep-research` to a real `spec.md` via the `spec_check_protocol` reference, and taught `/spec_kit:plan` and `/spec_kit:complete` to inline-absorb `/start` intake when the target folder is not healthy. The same pass completed the **M9 middleware cleanup** that removed `/spec_kit:handover`, `/spec_kit:debug`, the `@handover` agent, and the `@speckit` agent (with 4 runtime mirrors each), replacing the `@speckit` exclusivity rule with a distributed-governance rule in root guidance docs (`CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, `.opencode/skill/system-spec-kit/SKILL.md`) and re-positioning `/memory:save` as the canonical packet handover maintainer.

**Phase B (delivered 2026-04-15)** proved that inline-absorption was already the dominant invocation path — every real user flow entered through `/plan` or `/complete` — which made the standalone `/spec_kit:start` surface a vestigial third copy of the same intake contract. Phase B extracted the intake contract into a shared reference module at `.opencode/skill/system-spec-kit/references/intake-contract.md`, collapsed `plan.md` Step 1 and `complete.md` Section 0 to reference that module (no inline duplication), added a `--intake-only` flag on `/spec_kit:plan` for standalone intake invocations, updated `/spec_kit:resume` routing so `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` directs to `/spec_kit:plan --intake-only`, and hard-deleted `start.md` + both YAML assets + `.gemini/commands/spec_kit/start.toml` + the `COMMAND_BOOSTS` skill-registry entry, along with a 26-file downstream sweep. A 10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2); five parallel Opus remediation agents fixed all 12 before closeout.

**Key Design Journey**: From "three parallel intake surfaces with inline duplication" (Phase A end state) to "one shared contract module with a single flagged standalone entry" (Phase B end state). The supersession is now internal to this packet since packet 015 has been folded in.

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
| **Merged** | 2026-04-15 (015 folded into 012) |
| **Branch** | `026-012-spec-kit-commands` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement (Phase A)

`/spec_kit:deep-research` created iteration state and synthesised `research/research.md` but never authored or updated `spec.md`. Findings lived in an isolated subdirectory; downstream `/plan` runs started from scratch. Separately, `/spec_kit:plan` and `/spec_kit:complete` conflated intake questions (what/why) with workflow controls (`:auto`/`:confirm`) and phase decomposition across a 9-question consolidated prompt, and never captured the manual graph relationships (`depends_on`, `related_to`) that `generate-description.js` cannot infer from text. In parallel, redundant middleware (`/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit`) cluttered the command and agent graphs after v3.4.0.0 moved continuity into canonical docs and introduced the `/memory:save` content-router.

### Problem Statement (Phase B)

Phase A delivered `/spec_kit:start` as a standalone intake surface AND embedded inline `/start` absorption in `/spec_kit:plan` and `/spec_kit:complete`. The inline-absorption model proved complete — every real invocation path already flowed through plan or complete. The standalone `/spec_kit:start` command became a vestigial third parallel copy of the same intake contract (five-state folder classification, four repair-mode branches, staged canonical-trio publication, relationship capture, resume semantics) that drifted independently as each surface evolved.

### Purpose

Tell the command-graph evolution as one coherent story:

- `/spec_kit:deep-research` anchors every run to a real `spec.md` and syncs back an abridged findings block through a bounded generated fence.
- Canonical intake logic lives in exactly one place: `.opencode/skill/system-spec-kit/references/intake-contract.md`. Both `/spec_kit:plan` and `/spec_kit:complete` reference that module in place of inline duplication. `/spec_kit:plan --intake-only` provides the standalone invocation path previously owned by `/spec_kit:start`.
- `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`).
- Deprecated middleware is gone. `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit`, and `/spec_kit:start` are hard-deleted. `@debug` survives (description-only updates, Task-tool dispatch). Distributed-governance rule governs spec folder authoring; `/memory:save` owns packet handover maintenance via `handover_state` routing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — Phase A (command creation + inline absorption + middleware cleanup)

- **New command (Phase A, later deleted in Phase B)**: `/spec_kit:start` was created as a standalone interactive intake interview that publishes the canonical trio. Superseded and hard-deleted in Phase B.
- **Deep-research enhancement**: late-INIT advisory lock + `folder_state` detection, pre-init seed or bounded context updates, and post-synthesis generated-fence write-back of abridged findings.
- **Plan / complete smart-delegation (Phase A)**: detect `no-spec`, `partial-folder`, `repair-mode`, and unresolved placeholder-upgrade state in setup; absorb `/start` intake inline inside the parent command's consolidated prompt before original workflow steps resume.
- **Command-layer safety**: staged canonical commit, seed-marker lifecycle handling, normalized-topic dedupe, and optional save-path branching around existing helper interfaces.
- **Skill reference**: `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` documents lock lifecycle, seed-marker rules, host-anchor ownership, generated-fence replacement, audit events, and idempotency rules.
- **M9 middleware deprecations**: Delete `/spec_kit:handover` + `/spec_kit:debug` commands and their YAML assets; delete `@handover` + `@speckit` agents across 4 runtime mirrors each; delete Gemini command TOML mirrors; update references across orchestrate agents (4 runtimes), spec_kit commands, YAML workflows, root docs, install guides, skill docs, reference documents, CLI skill references; replace `@speckit` exclusivity rule with distributed-governance rule in root docs + system-spec-kit SKILL; reposition `/memory:save` as the canonical packet handover maintainer; remove `:auto-debug` flag logic from `/spec_kit:complete`.

### In Scope — Phase B (consolidation into shared module)

- **Create** `.opencode/skill/system-spec-kit/references/intake-contract.md` capturing full intake logic.
- **Expand** `.opencode/command/spec_kit/plan.md` to absorb intake as Step 1 via shared-module reference; add `--intake-only` flag halting after Step 1.
- **Refactor** `.opencode/command/spec_kit/complete.md` Section 0 to reference shared module (no inline duplication).
- **Update** `/spec_kit:resume` routing so intake re-entry reasons direct to `/spec_kit:plan --intake-only` with prefilled state.
- **Delete** `.opencode/command/spec_kit/start.md`, both start YAML assets, and `.gemini/commands/spec_kit/start.toml`.
- **Remove** `spec_kit:start` entry from harness `COMMAND_BOOSTS` registry at `.opencode/skill/system-spec-kit/SKILL.md:210`.
- **Update** 26 downstream reference files (skills, templates, CLI delegation refs, install guides, root docs, command READMEs, `descriptions.json`).

### Out of Scope

- Changes to `spec.md` Level 1/2/3/3+ templates themselves — reused unchanged.
- Changes to `create.sh`, `generate-description.js`, `recommend-level.sh`, or `generate-context.js` internals — helpers may be reused or wrapped, but their internals are unchanged.
- Graph-metadata backfill behaviour — unchanged.
- New MCP tools or memory-system changes — this is a command-layer refactor only.
- Retroactive migration of existing spec folders that lack `description.json` or `graph-metadata.json` — handled separately by backfill.
- Packet 013 (advisor-phrase-booster-tailoring) and packet 014 (save-flow-unified-journey) — unrelated scope.
- Historical changelog entries at `.opencode/changelog/01--system-spec-kit/` — historical records, only updated to reflect consolidated delivery, not rewritten.

### Files to Change

**Phase A — command + middleware deliveries:**

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/command/spec_kit/deep-research.md` | Modify | A | Late-INIT advisory lock, `folder_state` classification, bounded pre-init mutation rules, and post-synthesis generated-fence sync contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | A | INIT spec check, seed-create / conflict branches, and SYNTHESIS generated-fence write-back with typed audit events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | A | Same state graph with explicit approvals for conflict handling, write-back, and deferred synthesis recovery |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | A | Add `spec_check_protocol` loading guidance under the runtime workflow section |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Create | A | Contract for advisory locking, folder-state detection, seed markers, host-anchor ownership, generated-fence replacement, audit events, idempotency |

**Phase A M9 DELETE (15 enumerated paths):**

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

**Phase A M9 MODIFY (reference removal + distributed-governance adoption):**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` | Modify | Delete @speckit + @handover bullets; update @debug to Task-tool dispatch; add distributed-governance rule; update Quick Reference rows |
| `AGENTS.md` | Modify | Same edits as CLAUDE.md |
| `AGENTS_example_fs_enterprises.md` | Modify | Same edits |
| `.opencode/agent/orchestrate.md` | Modify | Remove @speckit + @handover routing rows, LEAF-list entries, agent-files entries; update @debug routing |
| `.claude/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/orchestrate.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/orchestrate.md` | Modify | Same edits (runtime mirror) |
| `.opencode/command/spec_kit/resume.md` | Modify | Delete `/spec_kit:handover` + `/spec_kit:debug` Next-Steps rows; keep packet-handover recovery refs; update session-ending row to `/memory:save` |
| `.opencode/command/spec_kit/implement.md` | Modify | Remove @speckit + @handover from Do-Not-Dispatch; remove Session Handover Check step |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Remove `/spec_kit:handover` Next-Steps row |
| `.opencode/command/spec_kit/assets/spec_kit_implement_{auto,confirm}.yaml` | Modify | Delete handover check + debug-dispatch steps |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml` | Modify | Remove @speckit/@handover dispatch calls if present |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml` | Modify | Remove @speckit/@handover dispatch calls if present |
| `.opencode/command/memory/save.md` | Modify | Insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row; update §8 Next-Steps + §9 Related-Commands |
| `.opencode/agent/debug.md` | Modify | Update description to Task-tool dispatch pattern |
| `.claude/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/debug.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/debug.md` | Modify | Same edits (runtime mirror) |
| `.opencode/agent/ultra-think.md` | Modify | Update @debug routing to Task-tool dispatch; remove @speckit refs |
| `.claude/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.codex/agents/ultra-think.toml` | Modify | Same edits (runtime mirror) |
| `.gemini/agents/ultra-think.md` | Modify | Same edits (runtime mirror) |
| `.opencode/README.md` | Modify | Delete @handover + @speckit rows; update @debug; delete deprecated-command bullets |
| `.opencode/install_guides/README.md` | Modify | Agent table + SpecKit commands update |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Delete deprecated command/agent rows |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | Same edits |
| `.opencode/command/README.txt` | Modify | Remove debug + handover from SpecKit command list |
| `.opencode/command/spec_kit/README.txt` | Modify | Delete all `/spec_kit:debug` and `/spec_kit:handover` references |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Replace @speckit exclusivity with distributed-governance; remove deprecated-command refs |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Same |
| `.opencode/skill/sk-code-web/README.md` | Modify | Delete deprecated-command refs |
| `.opencode/skill/sk-code-web/references/debugging/debugging_workflows.md` | Modify | Remove `/spec_kit:debug` refs |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Delete `/spec_kit:handover` subsections; replace @handover + @speckit with distributed-governance |
| `.opencode/skill/system-spec-kit/references/workflows/worked_examples.md` | Modify | Remove deprecated-command examples |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | Replace `/spec_kit:handover` attribution with `/memory:save` |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | Replace `/spec_kit:handover:full` attribution with `/memory:save` |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Remove deprecated-command refs |
| `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Modify | Remove `/spec_kit:handover` + @speckit gate refs |
| `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` | Modify | Remove `/spec_kit:debug` command refs |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | Modify | Delete @handover + @speckit entries; update @debug to Task-tool dispatch |
| `.opencode/skill/cli-codex/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/references/agent_delegation.md` | Modify | Same edits |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Update @debug dispatch example |
| `.opencode/skill/cli-gemini/README.md` | Modify | Remove @debug command ref |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Modify | Delete handover/debug command refs |
| `.opencode/command/improve/agent.md` | Modify | Remove @handover + @speckit improvement targeting |
| `.opencode/skill/sk-doc/assets/agents/agent_template.md` | Modify | Agent table: delete @handover + @speckit rows |

**Phase B — consolidation into shared module:**

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Create | B | Canonical intake contract (folder classification, repair modes, trio publication, relationships, resume, lock) |
| `.opencode/command/spec_kit/plan.md` | Modify | B | Step 1 references shared module; add `--intake-only` flag; preserve `:with-phases` |
| `.opencode/command/spec_kit/complete.md` | Modify | B | Section 0 references shared module; remove inline block (also loses `:auto-debug` in Phase A) |
| `.opencode/command/spec_kit/resume.md` | Modify | B | Route intake re-entry reasons to `/spec_kit:plan --intake-only` |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | B | Reflect new workflow + `--intake-only` branch with explicit `intake_only` gate |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | B | Same |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | B | Reflect Section 0 reference-only refactor |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | B | Same |
| `.opencode/command/spec_kit/README.txt` | Modify | B | Remove `/start` references |
| `.opencode/command/README.txt` | Modify | B | Remove `/start` from command index |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | B | Remove `/start` from command listings; remove `COMMAND_BOOSTS` entry at line 210 |
| `.opencode/skill/system-spec-kit/README.md` | Modify | B | Remove `/start` mentions |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | B | Remove `/start` from phase-system docs |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Modify | B | Remove `/start` delegation note |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Modify | B | Same |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Modify | B | Same |
| `.opencode/skill/system-spec-kit/templates/addendum/README.md` | Modify | B | Same |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Modify | B | Update protocol to reflect no-`/start` world |
| `.opencode/skill/sk-deep-review/README.md` | Modify | B | Remove `/start` reference |
| `.opencode/skill/skill-advisor/README.md` | Modify | B | Remove `/start` from routing docs |
| `.opencode/install_guides/README.md` | Modify | B | Remove `/start` from install guide index |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | B | Remove `/start` from setup walkthrough |
| `.opencode/README.md` | Modify | B | Remove `/start` from top-level command listing |
| `README.md` | Modify | B | Update command-graph diagram |
| `.opencode/specs/descriptions.json` | Modify | B | Update 012 packet description entry |

**Phase B DELETE (4 enumerated paths):**

| File Path | Change Type | Reason |
|-----------|-------------|--------|
| `.opencode/command/spec_kit/start.md` | Delete | Vestigial after merger (340 LOC) |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Delete | Asset for deleted command (508 LOC) |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Delete | Asset for deleted command (585 LOC) |
| `.gemini/commands/spec_kit/start.toml` | Delete | CLI routing for deleted command |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Phase A Blockers (MUST complete) — delivered 2026-04-14

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research late INIT acquires the advisory lock and classifies `folder_state` in the resolved target folder | After acquiring `{spec_folder}/research/.deep-research.lock`, setup classifies `folder_state` as `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`, passes that state into INIT and SYNTHESIS, and records the result in a typed `spec_check_result` audit event |
| REQ-002 | If `folder_state == no-spec`, deep-research seeds `spec.md` from the research ASK **before** Phase LOOP begins | INIT writes a Level 1 `spec.md`, emits `spec_seed_created`, and places tracked deep-research seed markers in placeholder-bearing anchors used for later upgrade |
| REQ-003 | If `folder_state == spec-present`, deep-research applies bounded pre-init context updates and fails closed on ambiguity | The normalized research topic is deduped and appended only at the approved host locations; missing anchors or duplicate markers emit `spec_mutation_conflict`; semantic-purpose conflicts halt rather than rewrite human prose |
| REQ-004 | Post-synthesis, deep-research writes back abridged findings through one machine-owned generated block under the chosen host anchor | SYNTHESIS writes or replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block; emits `spec_synthesis_deferred` instead of partial output when interrupted |
| REQ-005 | `/spec_kit:start` exists (Phase A) and publishes the canonical trio through staged commit semantics, with optional memory save as a separate branch | Phase A: `/spec_kit:start` publishes `spec.md`, `description.json`, `graph-metadata.json` via staged canonical commit. **Superseded in Phase B**: the standalone command is deleted; the same contract is now delivered via `/spec_kit:plan --intake-only` calling the shared `intake-contract.md` module |
| REQ-006 | `/plan` and `/complete` smart-detect non-healthy target folders and absorb `/start` intake inline before resuming their original workflow | Phase A: delegation triggers for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`, returning `feature_description`, `spec_path`, `selected_level`, `repair_mode`, and `manual_relationships`. **Phase B refinement**: absorption is now via shared-module reference, not inline duplication |

### P1 — Phase A Required (complete OR user-approved deferral) — delivered 2026-04-14

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `/start` interview optionally captures manual graph relationships (`depends_on`, `related_to`, `supersedes`) | `graph-metadata.json.manual.depends_on`, `.related_to`, and `.supersedes` store objects shaped as `{ packet_id, reason, source, spec_folder?, title? }`; repeated runs dedupe by `packet_id`. **Phase B**: this contract now lives in `intake-contract.md §8 Manual Relationships** |
| REQ-008 | `/start` suggests a documentation level via `recommend-level.sh` | Derives numeric `loc/files/risk` proxies; records `level_recommendation` separately from `selected_level`. **Phase B**: contract lives in `intake-contract.md §7 Level Recommendation` |
| REQ-009 | `/start` supports `:auto` and `:confirm` through one shared state graph | Both YAML workflows implement the same folder states and returned fields; only approval density and prompt compression differ. **Phase B**: replaced by unified contract in `intake-contract.md §4 Folder States` executed by `/spec_kit:plan` |
| REQ-010 | Deep-research and `/start` flows are idempotent across repeated runs | Normalized research topics, tracked seed markers, generated-fence replacement, and manual-relationship object dedupe prevent duplicate content across reruns |
| REQ-011 | Intake resume and re-entry contract is enforced | `/start`, delegated `/plan`, and delegated `/complete` normalize `start_state` into `empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, or `populated-folder`; reruns persist `resume_question_id`, `repair_mode`, `reentry_reason`. **Phase B**: routing now flows through `/spec_kit:resume` → `/spec_kit:plan --intake-only` |

### P0 — Phase A M9 Middleware Cleanup (MUST complete) — delivered 2026-04-14

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | `/spec_kit:debug` and `/spec_kit:handover` commands + YAML assets + Gemini command TOML mirrors are deleted | 7 deprecated command/asset surfaces no longer exist; `grep -rE "/spec_kit:(handover\|debug)"` on active docs returns empty |
| REQ-013 | `@handover` and `@speckit` agents deleted across all 4 runtime mirrors (8 files total) | 8 agent files no longer exist; `grep -rE "@handover\|@speckit"` on active docs returns empty |
| REQ-014 | `@speckit` exclusivity rule replaced with distributed-governance rule across CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md, and system-spec-kit SKILL.md | All four files contain the replacement rule using templates + `validate.sh --strict` + `/memory:save` |

### P1 — Phase A M9 Required (complete OR user-approved deferral) — delivered 2026-04-14

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | All active-doc references to deprecated commands/agents updated | Zero-reference grep sweep across 50+ active files returns empty |
| REQ-016 | Preserved capabilities: `@debug` agent (4 runtime mirrors), preserved templates, `system-spec-kit` skill, MCP server code, stop-hook autosave, `/spec_kit:resume` recovery ladder | Survival checks pass for all preserved surfaces |
| REQ-017 | `/memory:save` positioned as canonical packet handover maintainer via `handover_state` routing; `:auto-debug` flag removed from `/spec_kit:complete` | `save.md` §1 contains "Handover Document Maintenance" subsection; `spec_kit_complete_{auto,confirm}.yaml` contains no `:auto-debug` references |

### P0 — Phase B Blockers (MUST complete) — delivered 2026-04-15

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-018 | Shared intake contract exists | `.opencode/skill/system-spec-kit/references/intake-contract.md` authored with all five folder states, four repair modes, trio publication, relationship capture, resume semantics, intake lock |
| REQ-019 | plan.md absorbs intake via reference | `plan.md` Step 1 references shared module; no duplicate intake logic in plan.md body |
| REQ-020 | complete.md absorbs intake via reference | `complete.md` Section 0 references shared module; no duplicate intake logic in complete.md body |
| REQ-021 | `--intake-only` flag works with explicit gate | `/spec_kit:plan --intake-only` halts after Step 1 (trio published, no planning); YAML workflow contains explicit `intake_only` gate that terminates successfully after Emit and bypasses Steps 1-7 |
| REQ-022 | resume.md routing updated | `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only` with prefilled state |
| REQ-023 | start.md + assets deleted | `start.md`, 2 YAML assets, `.gemini/.../start.toml` removed from repo |
| REQ-024 | Skill registry cleaned | `COMMAND_BOOSTS` entry at `SKILL.md:210` removed; `spec_kit:start` no longer surfaces in harness skill list |
| REQ-025 | Zero forward-looking `/start` refs | grep `/spec_kit:start\|spec_kit/start.md` in forward-looking docs returns zero matches (historical changelogs excluded) |
| REQ-026 | Structural validation passes | `validate.sh 012-spec-kit-commands --strict` exits 0 (or documents `SPEC_DOC_INTEGRITY` warnings that reference the supersession narrative) |

### P1 — Phase B Required (complete OR user-approved deferral) — delivered 2026-04-15

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-027 | Root README command-graph updated | Root `README.md` reflects new architecture; graph diagram shows no `/spec_kit:start` node |
| REQ-028 | CLI agent-delegation refs updated | All three cli-* skill agent_delegation.md files carry correct post-merger references |
| REQ-029 | Install guides updated | Both install guide files free of `/start` references |
| REQ-030 | Template READMEs updated | All five template README files free of `/start` delegation notes |
| REQ-031 | Changelog entry authored | Entry at `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` documents merger and deprecation |
| REQ-032 | sk-doc validator PASS | All canonical docs pass DQI scoring |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Phase A Success Criteria

- **SC-001**: `/spec_kit:deep-research "topic"` on an empty target folder produces `spec.md` **before** any iteration runs, with tracked deep-research seed markers placed in placeholder-bearing anchors
- **SC-002**: `/spec_kit:deep-research "topic"` on a folder with existing `spec.md` appends the normalized topic/context only at approved pre-init locations and replaces one generated findings block during synthesis without overwriting user-authored content
- **SC-003**: Phase A: `/spec_kit:start` on an empty folder produced `spec.md`, `description.json`, and `graph-metadata.json` passing packet validation. **Phase B supersession**: the same outcome now achieved via `/spec_kit:plan --intake-only` calling the shared `intake-contract.md` module
- **SC-004**: `/spec_kit:plan` on a `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` target folder absorbs intake via the shared module reference, then continues through its existing workflow
- **SC-005**: `/spec_kit:complete` demonstrates the same shared-module reference behavior with a single additional round-trip at most when intake is required
- **SC-006**: Zero regression — running `/spec_kit:plan` or `/spec_kit:complete` on a folder that already satisfies the healthy-folder contract behaves exactly as today (no new prompts, no delegation)
- **SC-007**: Placeholder-upgrade flows only complete after every tracked seed marker is replaced with confirmed content or the explicit fallback `N/A - insufficient source context`
- **SC-008**: Optional memory-save mode only runs when sufficient structured context exists, and its skip or failure state does not invalidate an already committed canonical trio

### Phase A M9 Success Criteria

- **SC-009**: `grep -rE "/spec_kit:(handover|debug)"` across active docs (excluding archive/future/iterations/scratch/changelog/specs) returns zero matches
- **SC-010**: `grep -rE "@handover|@speckit"` across active docs (with same exclusions) returns zero matches
- **SC-011**: `/memory:save` command card documents it as the canonical packet handover maintainer via `handover_state` routing; routing prototype unchanged
- **SC-012**: Running `/spec_kit:resume` on an existing spec folder still reads the packet handover document as the first recovery source (no regression)
- **SC-013**: `@debug` agent remains dispatchable via Task tool in all 4 runtimes; `@deep-research` retains exclusive write access for `research/research.md`
- **SC-014**: `system-spec-kit` skill, preserved templates (`handover.md`, `debug-delegation.md`, `level_N/`), and all MCP server code remain unchanged and functional

### Phase B Success Criteria

- **SC-015**: Shared intake module exists with complete contract (folder states, repair modes, trio publication, relationship capture, resume semantics, intake lock)
- **SC-016**: `plan.md` Step 1 references shared module; no duplicate intake logic in plan.md body
- **SC-017**: `complete.md` Section 0 references shared module; no duplicate intake logic in complete.md body
- **SC-018**: `/spec_kit:plan --intake-only` halts after Step 1 end-to-end with explicit YAML gate
- **SC-019**: `/spec_kit:resume` re-entry routes to `/spec_kit:plan --intake-only` correctly
- **SC-020**: `start.md`, 2 YAML assets, `.gemini/.../start.toml` deleted; `COMMAND_BOOSTS` entry removed at `SKILL.md:210`
- **SC-021**: Zero `/spec_kit:start` references in forward-looking docs (grep verified)
- **SC-022**: sk-doc validator PASS on all canonical docs
- **SC-023**: `validate.sh --strict` exits 0 for 012 packet (or documents `SPEC_DOC_INTEGRITY` warnings that reference the supersession narrative)

### Acceptance Scenarios

1. **Given** an empty packet folder, **when** `/spec_kit:deep-research "topic"` starts, **then** it seeds `spec.md` before iteration 001 and records the tracked seed markers needed for later upgrade.
2. **Given** a populated packet folder with an existing `spec.md`, **when** deep-research runs on the same topic twice, **then** the normalized pre-init context and generated findings fence appear only once and human-owned prose remains untouched.
3. **Given** an empty folder, **when** `/spec_kit:plan --intake-only feature-description` runs, **then** the canonical trio is published via the shared intake-contract module and the command exits without producing plan.md/tasks.md/checklist.md.
4. **Given** a populated folder, **when** `/spec_kit:plan feature-description` runs, **then** intake is bypassed cleanly and planning proceeds without extra prompts.
5. **Given** a folder needing repair, **when** `/spec_kit:plan` runs, **then** repair-mode interview runs inline via the shared module before planning.
6. **Given** `/spec_kit:complete` on a folder requiring intake, **when** Section 0 executes, **then** the shared intake-contract module runs and completion proceeds.
7. **Given** a session with `reentry_reason: incomplete-interview`, **when** `/spec_kit:resume` runs, **then** the operator is routed to `/spec_kit:plan --intake-only` with prefilled state.
8. **Given** I invoke the deleted `/spec_kit:start`, **then** the harness returns "command not found" cleanly (no silent failure); changelog documents `/spec_kit:start → /spec_kit:plan --intake-only`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Phase A Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seed-marker drift or untracked placeholder edits break placeholder-upgrade re-entry | `/plan`, `/complete`, and `/start` may misclassify an unfinished folder as healthy | Use explicit tracked deep-research seed markers only; block completion until they are cleared; fail closed on ambiguous marker state |
| Risk | Generated-fence conflicts or human edits inside the machine-owned findings block | Deep-research write-back could overwrite user content or duplicate findings | Require exactly one matching `BEGIN/END GENERATED: deep-research/spec-findings` pair; emit typed conflict audits; halt instead of repairing in place |
| Risk | Staged canonical commit fails mid-publication | Canonical trio may become inconsistent | Use temp-sibling staging plus final publish semantics; preserve pre-existing files on failure; surface exact recovery steps |
| Risk | `generate-context.js` treated as the default metadata-only repair path | `/start` create or repair flows inherit avoidable memory-save failure modes | Keep baseline `/start` creation and metadata repair independent from `generate-context.js` |
| Risk | Inline `/start` delegation regresses healthy-folder `/plan` or `/complete` behavior | Existing commands become noisier | Gate delegation strictly to non-healthy states; healthy folders bypass |
| Risk | Advisory lock contention or stale lock cleanup stalls valid deep-research runs | Second writers may corrupt spec state | Treat lock contention as first-class blocking state; require confirm for stale-lock override |
| Dependency | `create.sh`, `generate-description.js`, and Level 1/2 templates | Canonical trio emission depends on helper reuse | Reuse helpers and templates as-is |
| Dependency | `recommend-level.sh` CLI contract | Level suggestion depends on stable helper inputs | Derive numeric proxies before invocation; store helper output separately from confirmed level |
| Dependency | `validate_document.py` and packet strict validation | Success criteria depend on validator-backed checks | Run validator-backed verification as part of completion |

### Phase A M9 Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk (M9) | Main agent writes spec folder docs without templates after @speckit deletion | Quality degrades; packet validation fails | Distributed-governance rule to root docs + SKILL; YAML workflow steps call `validate.sh`; checklist catches gaps |
| Risk (M9) | Hidden dispatcher of `@speckit` or `@handover` in MCP handlers or hooks | Deletion breaks workflows | Phase 7 zero-reference sweep; rollback path deletes 17 files as one commit that can be reverted together |
| Risk (M9) | `:auto-debug` flag removal breaks users who relied on auto-escalation at 3+ failures | Silent loss of auto-debug fallback | Replace with explicit "escalate to user with diagnostic summary" path |
| Risk (M9) | Full 7-section packet handover regeneration becomes unavailable | Users lose deliberate-handover capability | Accept trade-off; `/memory:save` maintains `session-log` anchor; stop hook auto-saves continuity |
| Dependency (M9) | Templates + bash scripts at `scripts/spec/` | Distributed governance depends on these remaining stable | Templates and scripts explicitly preserved; Phase 7 survival check verifies |

### Phase B Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 012 Phase A legacy (closed state before merger) | Phase B builds on Phase A delivery; `/start` was vestigial | Shared-module extraction preserves semantics |
| Dependency | Harness skill registry | Removal of `spec_kit:start` entry requires knowing exact registry file path | M0 audit located `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary |
| Dependency | `/spec_kit:resume` routing | Routing change must match shared module's `reentry_reason` values | M4 verification covers round-trip |
| Risk (Phase B) | plan.md size growth | Projected 550-600 LOC after intake absorption; cognitive overhead | Shared-module extraction reduces duplication; reference-only inclusion keeps plan.md from carrying full contract (see [CHK-034](./checklist.md#chk-034)) |
| Risk (Phase B) | Atomic downstream sweep misses a ref | 26 modify + 4 delete files = 30 touch points; regression risk if any `/start` reference stays | M0 audit established exhaustive grep baseline; M5 closure re-runs grep; P0 [CHK-034](./checklist.md#chk-034) blocks closeout |
| Risk (Phase B) | Intake lock race | Lock must cover Step 1 only, not Steps 2-8 | ADR-011 scopes lock explicitly; shared module documents release point (see [CHK-041](./checklist.md#chk-041)) |
| Risk (Phase B) | Breaking external invokers | External scripts/docs outside repo may call `/spec_kit:start` | Hard delete is user-requested; release changelog provides migration note |
| Risk (Phase B) | sk-doc voice drift in intake-contract.md | New reference doc must match project voice | sk-doc validator enforced as P0 (see [CHK-023](./checklist.md#chk-023)) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `/spec_kit:plan --intake-only` (replacing former `/spec_kit:start` interview) completes in ≤ 2 consolidated prompts total (confirm mode); 0 prompts in auto mode when all required flags are provided
- **NFR-P02**: `/plan` and `/complete` smart-delegation adds ≤ 1 additional user turn when target folder is empty; zero additional turns when spec.md already exists
- **NFR-P03**: Intake contract execution time unchanged from the baseline `/spec_kit:start` timing (target: <2s on healthy folder classification)

### Security / Integrity

- **NFR-S01**: No command may overwrite user-authored `spec.md` content silently — all mutations are anchor-bounded appends or clearly-fenced new sections
- **NFR-S02**: Deep-research auto mode writes a JSONL audit record to `research/deep-research-state.jsonl` for every spec.md mutation (`type: "spec_mutation"`, `anchors_touched: [...]`, `diff_summary: "..."`)
- **NFR-S03**: Interview answers populating `graph-metadata.json.manual.*` must be objects containing `packet_id`, `reason`, and `source`, with optional `spec_folder` / `title` hints preserved only as denormalized metadata
- **NFR-S04**: Delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching must emit typed audit events
- **NFR-S05**: Intake lock prevents concurrent trio publication under same `spec_folder` path (fail-closed semantics preserved from Phase A)

### Reliability

- **NFR-R01**: Staged trio publication remains atomic — partial writes never leave visible half-published state (temp + rename semantics preserved)
- **NFR-R02**: Canonical trio publication uses staged canonical commit semantics, preserves pre-existing files on failure. Optional memory save is outside the canonical trio transaction
- **NFR-R03**: `/spec_kit:plan --intake-only` is idempotent on empty folder (repeat invocation yields identical trio, no duplicate intake lock)
- **NFR-R04**: Running `/spec_kit:plan` on an already-populated folder does not re-ask intake questions; default behavior is bypass

### Quality / Consistency

- **NFR-Q01**: The Phase A `/spec_kit:start` command card mirrored the structural pattern of existing `/spec_kit:*` command cards (structural parity recorded in decision-record.md ADR-001 with shared-line similarity measurements). **Phase B**: surface deleted; quality gate shifts to the shared `intake-contract.md` matching existing `.opencode/skill/system-spec-kit/references/` patterns
- **NFR-Q02**: Phase A: YAML assets `spec_kit_start_{auto,confirm}.yaml` mirrored existing speckit YAML prior art. **Phase B**: assets deleted; `/spec_kit:plan` YAML assets modified with `--intake-only` branch preserving existing top-level key ordering and step-ID naming
- **NFR-Q03**: All new markdown passes `python3 .opencode/skill/sk-doc/scripts/validate_document.py` with zero errors. Template-inherited warnings may be acknowledged
- **NFR-Q04**: All modifications to existing command surfaces (plan.md, complete.md, deep-research.md, resume.md) and their paired YAMLs preserve existing section ordering, anchor comments, and step IDs. Renames prohibited without migration note
- **NFR-Q05**: Structural parity verified via shared-line similarity measurements recorded in decision-record.md ADR-001
- **NFR-Q06**: All cross-repo README and SKILL documentation referencing speckit commands audited and updated
- **NFR-Q07**: `validate.sh --strict` PASS on all canonical docs before closeout
- **NFR-Q08**: sk-doc DQI PASS on all canonical docs
- **NFR-Q09**: Grep sweep confirms zero `/spec_kit:start` references in forward-looking scoped paths

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
- `/plan` detects non-healthy folder → loads `intake-contract.md §5 Folder States`, executes repair-mode branch, then continues to Step 2 planning
- `/plan --intake-only` completes Step 1 → halts at Emit phase (explicit YAML `intake_only` gate); planning Steps 2-7 bypassed
- `/spec_kit:resume` detects `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → routes to `/spec_kit:plan --intake-only` with prefilled state
- `/spec_kit:resume` detects `reentry_reason in {none, planning-paused, implementation-paused}` → routes to full `/spec_kit:plan` or `/spec_kit:implement` as today

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 80+ touch points across Phase A and Phase B (15 M9 deletions + 50+ M9 modifications + 5 Phase B deletions + 26 Phase B modifications + new shared reference module); LOC: ~1200 expected delta combined; Systems: 6 (commands, skills, templates, CLI configs, registry, MCP) |
| Risk | 20/25 | Breaking: Y (external invokers of `/spec_kit:start`); Architectural: Y (two-phase supersession internal to packet); modifies user-authored documents |
| Research | 10/20 | Script APIs documented; reusing existing helpers; interview pattern + shared-module pattern are novel design elements |
| Multi-Agent | 7/15 | Phase A sequential + M9 parallel; Phase B M5a delegated to cli-copilot (GPT-5.4 reasoning=high); 5 parallel Opus agents for deep-review remediation |
| Coordination | 12/15 | Dependencies: helpers, resume routing, skill registry, MCP handlers |
| **Total** | **71/100** | **Level 3** |

---

## 10. USER STORIES

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
1. Given an empty folder, When I run `/spec_kit:plan feature-description --intake-only`, Then trio is published AND the command exits without producing plan.md/tasks.md/checklist.md
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

## 11. OPEN QUESTIONS

- No blocking open questions remain. All architectural choices resolved via AskUserQuestion during Phase A (2026-04-14) and Phase B (2026-04-15) planning sessions.

### Phase A M9 Notes (resolved)

- **M9-Q1 (resolved)**: `:auto-debug` flag replaced with explicit user escalation; orchestrate can still Task-dispatch `@debug` manually
- **M9-Q2 (deferred)**: `/memory:save` handler enhancement to auto-initialize full 7-section packet handover document — deferred to a follow-on packet
- **M9-Q3 (resolved)**: Distributed-governance rule in effect; no reversal path triggered

### Phase B Notes (resolved)

- All Phase B architectural choices resolved via AskUserQuestion during 2026-04-15 planning session. Five Checks evaluation at 5/5 PASS (recorded in plan.md).
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
- **Supersession Note**: Packet 015-start-into-plan-merger has been folded into this packet as Phase B. Supersession is now internal to 012.

---

<!--
LEVEL 3 SPEC — Spec-Kit Command Graph: Canonical Intake and Merger
- Unifies Phase A (original 012) + Phase B (former 015) as one coherent evolution story
- Phase A: /spec_kit:start creation + inline absorption + M9 middleware cleanup (delivered 2026-04-14)
- Phase B: shared intake-contract module + /spec_kit:plan --intake-only + hard-delete /spec_kit:start (delivered 2026-04-15)
- REQ-001..REQ-017 = Phase A requirements (preserved verbatim from original 012 spec.md)
- REQ-018..REQ-032 = Phase B requirements (folded in from former 015 spec.md)
- Deep review identified 12 findings across 10 iterations; all resolved via 5 parallel Opus remediation agents
-->
