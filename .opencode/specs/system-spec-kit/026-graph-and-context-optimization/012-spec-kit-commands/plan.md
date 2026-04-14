---
title: "Implementation Plan: Spec Kit Command Intake Refactor [template:level_2/plan.md]"
description: "Implements /spec_kit:start as the canonical spec-folder intake interview and wires deep-research, plan, and complete to a real spec.md contract. The approach keeps helper internals unchanged while adding command-layer state detection, generated-fence write-back, staged canonical commit semantics, and packet-local regression coverage."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec kit start"
  - "deep research spec check"
  - "spec kit commands"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-14T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored Level 2 implementation plan from converged packet research"
    next_safe_action: "Implement milestones M1-M6 in order, starting with /spec_kit:start command scaffolding"
    blockers: []
    key_files:
      - "start command surface"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - "spec_check_protocol reference"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-spec-kit-commands-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Research converged on /spec_kit:start as a thin intake command, not a second planning workflow"
      - "Deep-research spec sync must use a bounded generated findings block under a stable host anchor"
---
# Implementation Plan: Spec Kit Command Intake Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command cards, YAML workflow assets, shell helper reuse |
| **Framework** | OpenCode Spec Kit command system |
| **Storage** | Spec-folder markdown + JSON canonical artifacts (`spec.md`, `description.json`, `graph-metadata.json`) |
| **Testing** | `spec/validate.sh --strict`, validator-backed markdown/schema checks, targeted dry-runs, grep-based contract sweeps |

### Overview
This implementation introduces `/spec_kit:start` as the canonical intake entrypoint for creating or repairing the spec-folder artifact trio, then wires `/spec_kit:deep-research`, `/spec_kit:plan`, and `/spec_kit:complete` to that same spec-first contract. The technical strategy is to keep helper internals unchanged while adding late-init folder-state detection, single-writer locking, generated-fence write-back, inline delegated intake, and staged canonical commit plus optional memory-save branching at the command layer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` requirements, state names, and success criteria reflect the converged research contract
- [ ] All 14 target production files are mapped to milestones and task ownership
- [ ] Helper reuse contracts and no-regression expectations are documented before implementation begins

### Definition of Done
- [ ] REQ-001 through REQ-011 are satisfied and verified with packet-local evidence
- [ ] `plan.md`, `tasks.md`, and `checklist.md` remain synchronized with the implemented command/YAML surfaces
- [ ] Strict packet validation and the planned regression passes complete without introducing healthy-folder regressions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-card plus paired-YAML workflow orchestration, with helper reuse at the edges and runtime state control at the command layer.

### Key Components
- **`/spec_kit:start` command surface**: owns intake prompts, folder-state classification, canonical trio creation/repair, and optional memory-save branching.
- **Deep-research spec-check protocol**: owns late-INIT lock acquisition, folder-state classification, pre-init seed or context updates, and SYNTHESIS generated-fence write-back.
- **Parent-command delegation layer**: lets `/plan` and `/complete` absorb `/start` intake inline only when folder state is not healthy.
- **Idempotency and audit layer**: normalizes topics, dedupes relationship objects, tracks seed markers, and emits typed audit events for replay and verification.
- **Helper boundary**: reuses `create.sh`, `generate-description.js`, and `recommend-level.sh` without changing their internals.

### Data Flow
Direct `/spec_kit:start` runs collect the minimal intake fields, classify folder state, publish the canonical trio through staged command-layer commit, and optionally branch into memory save only when structured context exists. Deep-research acquires the advisory lock during late INIT, classifies `folder_state`, seeds or updates `spec.md` before LOOP, and replaces a single generated findings block during SYNTHESIS. `/plan` and `/complete` reuse the same `/start` intake fields inline inside Step 1 when they encounter `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`, then continue with their existing workflow.

### File-Level Change Map
| File | Change | Planned update |
|------|--------|----------------|
| `.opencode/command/spec_kit/start` | Create | Define `/start` setup contract, folder-state vocabulary, direct versus delegated behavior, and optional memory-save branching |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Create | Implement the shared `/start` state graph for auto mode with compact prompting and canonical trio publication |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Create | Implement the shared `/start` state graph for confirm mode with approvals around repair, overwrite, and relationship capture |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Add advisory lock timing, late-INIT spec detection, pre-init mutation rules, and SYNTHESIS write-back contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Wire `folder_state` branches, `spec_seed_created`, `spec_mutation`, and generated-fence write-back for auto mode |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Mirror the same state graph with confirm-mode approvals and explicit conflict exits |
| `.opencode/command/spec_kit/plan.md` | Modify | Document inline `/start` delegation states, returned fields, and healthy-folder bypass |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Add Step 0.5 delegated intake branch for non-healthy folders while keeping the current healthy path untouched |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Add the same delegated intake branch with confirm-mode gating |
| `.opencode/command/spec_kit/complete.md` | Modify | Mirror plan-side inline delegation, including resume and placeholder-upgrade handling |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Add delegated intake and no-regression bypass for auto mode |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Add delegated intake and confirm-mode approvals for completion flows |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Load and point to the new `spec_check_protocol` contract |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol` | Create | Canonicalize lock rules, folder-state transitions, seed markers, host anchors, generated fence replacement, and audit expectations |

### M9 File-Level Change Map (Middleware Cleanup)

**DELETE (17 files)**: See `spec.md` §3 Files-to-Change (M9 Files to Change table) for complete list with reasons. Short version: 2 command markdowns, 3 command YAML assets, 4 @handover runtime mirrors, 4 @speckit runtime mirrors, 2 Gemini command TOML mirrors.

**MODIFY (~50 files)**: See `spec.md` §3 Files-to-Change (MODIFY table). Includes 4 orchestrate runtime mirrors, 4 @debug description updates, 4 ultra-think runtime mirrors, 7 spec_kit command files, 10 spec_kit YAML assets, 3 root docs (CLAUDE.md/AGENTS.md/AGENTS_example_fs_enterprises.md), 4 install guides, 2 command READMEs, 2 system-spec-kit docs, 2 sk-code-web docs, 8 reference documents, 5 CLI skill references, 3 miscellaneous (improve/agent.md, sk-doc agent template, skill-advisor), `/memory:save` card (with new "Handover Document Maintenance" subsection).

The consolidated table lives in `spec.md` to avoid duplication. `plan.md` enumerates the same files only when a specific phase action needs to be referenced.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: `/spec_kit:start` Command Scaffolding (M1)
- [ ] Create the `/start` command card as the thin intake surface with direct and delegated mode guidance
- [ ] Author `spec_kit_start_auto.yaml` and `spec_kit_start_confirm.yaml` on one shared state graph
- [ ] Define canonical trio publication versus optional memory-save branching without changing helper internals

### Phase 2: Deep-Research `spec_check_protocol` + Lock + Pre-Init Detection (M2)
- [ ] Patch the deep-research command card for late-INIT advisory locking and `folder_state` classification
- [ ] Add INIT branches for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected`
- [ ] Create the `spec_check_protocol` reference and wire it into `sk-deep-research`

### Phase 3: Post-Synthesis Write-Back (M3)
- [ ] Add one generated findings fence under the chosen host anchor
- [ ] Wire SYNTHESIS replacement and deferred-write behavior in both deep-research YAML assets
- [ ] Keep `research/research.md` as the source of truth while syncing only the abridged findings block into `spec.md`

### Phase 4: `/plan` and `/complete` Delegation (M4)
- [ ] Patch the parent command cards so delegated `/start` intake stays inline inside Step 1
- [ ] Add Step 0.5 branches for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`
- [ ] Preserve no-regression behavior for already healthy folders

### Phase 5: Idempotency Hardening + Seed Markers (M5)
- [ ] Normalize research-topic dedupe, tracked seed-marker detection, and placeholder-upgrade re-entry
- [ ] Dedupe manual relationship objects by `packet_id` within each relation type
- [ ] Ensure auto and confirm modes share one state graph and one returned-field contract

### Phase 6: Audit Events + Staged Commit Wrapper (M6)
- [ ] Add typed audit events for delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching
- [ ] Implement staged command-layer commit semantics for the canonical trio without claiming helper-level atomicity
- [ ] Finish with packet-local regression runs and strict validation before the implementation packet can be closed

### Phase 7: Structural Parity & sk-doc Compliance (M7)
- [ ] Use `/spec_kit:deep-research/plan.md` or `/spec_kit:complete.md` as the structural templates for `/spec_kit:start.md`. Required top-level sections, frontmatter shape, and callout style MUST match the nearest sibling. Refer to NFR-Q01.
- [ ] Use `spec_kit_deep-research_auto.yaml` as the structural template for `spec_kit_start_auto.yaml` (and `_confirm.yaml`). Top-level keys, step ID naming, and variable vocabulary MUST match prior art. Refer to NFR-Q02.
- [ ] Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new or modified markdown file; zero errors required, only template-inherited warnings allowed. Refer to NFR-Q03.
- [ ] All modifications to existing `plan.md`, `complete.md`, `deep-research.md` (and paired YAMLs) preserve existing section ordering, anchor comments, and step IDs; no renames without migration note. Refer to NFR-Q04.
- [ ] Run `diff -u <new-file> <nearest-existing-sibling>` spot checks; structural overlap MUST be ≥ 50 percent. Divergences recorded in `decision-record.md` or architecture section. Refer to NFR-Q05.

### Phase 8: README & Skill Documentation Reference Audit (M8)
- [ ] Enumerate every README and SKILL document in the repo that may reference speckit commands or deep-research behavior. Required sweep: `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .` — plus the root `README.md`.
- [ ] For each match, audit for references that are now stale or incomplete given M1-M7 changes: missing `/spec_kit:start` in command inventories, deep-research descriptions that omit the `spec.md` integration, plan/complete descriptions that omit smart delegation, missing links to `spec_check_protocol.md`, and outdated command-chain diagrams.
- [ ] Update in place:
  - Root `README.md` — command inventory, chain diagram, and any "what changed" section
  - `.opencode/README.md` — if it maintains a speckit command list
  - `.opencode/skill/system-spec-kit/README.md` and `SKILL.md` — speckit lifecycle description
  - `.opencode/skill/sk-deep-research/README.md` and `SKILL.md` — spec.md integration, spec_check_protocol reference, folder_state detection
  - `.opencode/skill/sk-deep-review/README.md` and `SKILL.md` — cross-reference if deep-review docs mention deep-research behavior
  - `.opencode/skill/skill-advisor/README.md` — routing table if it lists speckit commands
  - `.opencode/install_guides/README.md` — if it enumerates commands
  - `.opencode/skill/system-spec-kit/templates/*/README.md` — if any mention command inventory
- [ ] Preserve NFR-Q04 discipline: additions and in-place clarifications only; no renames, no removed sections. Refer to NFR-Q06 (below).
- [ ] Verify zero broken references afterwards: re-run the grep sweep and spot-check that no README still describes a stale state (e.g. deep-research without spec.md anchoring, plan without delegation).

### Phase 9: Middleware Cleanup — Deprecate @handover + @speckit + /spec_kit:debug + /spec_kit:handover (M9)

**Phase 9a — DELETE (17 files)**
- [ ] Delete `/spec_kit:handover` command + `/spec_kit:debug` command + 3 command YAML assets (`spec_kit_handover_full.yaml`, `spec_kit_debug_{auto,confirm}.yaml`)
- [ ] Delete @handover agent across 4 runtime mirrors (`{.opencode/agent,.claude/agents,.gemini/agents}/handover.md` + `.codex/agents/handover.toml`)
- [ ] Delete @speckit agent across 4 runtime mirrors (`{.opencode/agent,.claude/agents,.gemini/agents}/speckit.md` + `.codex/agents/speckit.toml`)
- [ ] Delete Gemini command TOML mirrors (`.gemini/commands/spec_kit/{handover,debug}.toml`)
- [ ] Verify git status shows exactly 17 deletions

**Phase 9b — Responsibility Transfer (4 files)**
- [ ] Update `CLAUDE.md`: delete @handover + @speckit bullets; update @debug bullet to Task-tool dispatch language; add distributed-governance rule; update Quick Reference workflow rows
- [ ] Update `AGENTS.md`: same edits as CLAUDE.md
- [ ] Update `AGENTS_example_fs_enterprises.md`: same edits
- [ ] Update `.opencode/skill/system-spec-kit/SKILL.md`: replace @speckit exclusivity narrative with distributed-governance rule; remove deprecated-command refs; update trigger phrases
- [ ] Update `.opencode/command/memory/save.md`: insert §1 "Handover Document Maintenance" subsection; update `handover_state` contract row; update §8 Next-Steps and §9 Related-Commands

**Phase 9c — Orchestrate + Commands + YAML (15+ files)**
- [ ] Update 4 orchestrate runtime mirrors: remove @speckit (row 4) + @handover (row 9) routing matrix entries, remove from LEAF list, remove from agent-files table, update @debug routing language, remove deprecated-command suggestions
- [ ] Update 7 spec_kit command files (`resume.md`, `plan.md`, `complete.md`, `implement.md`, `start.md`, `deep-research.md`, `deep-review.md`): remove @speckit + @handover from Do-Not-Dispatch lists, remove deprecated-command Next-Steps entries, update session-ending rows to `/memory:save`; `complete.md` loses `:auto-debug` flag entirely
- [ ] Update 10 YAML assets: delete `:auto-debug` logic from `spec_kit_complete_*.yaml`, delete handover-check steps from plan/implement/start YAMLs, remove deprecated-command Next-Steps entries, remove @speckit/@handover dispatch calls if present

**Phase 9d — Agent descriptions (8 files)**
- [ ] Update 4 @debug agent runtime files: description-only edits to clarify Task-tool dispatch; preserve workflow, permissions, phases
- [ ] Update 4 ultra-think runtime files: update @debug routing row; remove @speckit refs

**Phase 9e — Skills + References + Install Guides (15+ files)**
- [ ] Update `.opencode/README.md` + 3 install_guides files: remove deprecated-command and agent refs, update @debug rows, update end-session workflow
- [ ] Update 2 command READMEs (`.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`): delete all deprecated-command rows
- [ ] Update `.opencode/skill/system-spec-kit/README.md`: remove deprecated-command refs, remove @speckit agent refs, keep template + recovery-surface refs
- [ ] Update `.opencode/skill/sk-code-web/README.md` + `references/debugging/debugging_workflows.md`: remove `/spec_kit:debug` refs, keep debugging methodology
- [ ] Update 8 system-spec-kit reference documents (workflows/quick_reference, worked_examples, memory/save_workflow, templates/template_guide, templates/level_specifications, validation/phase_checklists, debugging/universal_debugging_methodology, memory/*): replace @speckit / @handover references with distributed-governance language
- [ ] Update 5 CLI skill references (cli-claude-code, cli-codex, cli-gemini agent_delegation.md + cli-gemini SKILL.md/README.md + cli-copilot prompt_templates.md): delete deprecated agent/command entries, update @debug entries to Task-tool dispatch
- [ ] Update 3 misc (`improve/agent.md`, `sk-doc/assets/agents/agent_template.md`, `skill-advisor/*`): remove deprecated-agent entries, update @debug refs

**Phase 9f — Verification sweep**
- [ ] Run zero-reference grep sweep for `/spec_kit:(handover|debug)`, `@handover`, `@speckit` (with archive/future/iterations/scratch/changelog/specs exclusions) — expect empty
- [ ] Verify @debug agent survival: 4 runtime files still exist
- [ ] Verify @deep-research agent survival: 4 runtime files still exist
- [ ] Verify template survival: `handover.md`, `debug-delegation.md`, `level_N/` all exist
- [ ] Verify `system-spec-kit` skill survival: SKILL.md exists and skill-advisor routing returns it
- [ ] Verify `/memory:save` routing intact: `handover_state` + `handover.md::session-log` references remain in `save.md`
- [ ] Verify `/spec_kit:resume` unchanged: still reads handover.md as first recovery source
- [ ] Verify MCP server code unchanged: `handlers/memory-save.ts`, `routing-prototypes.json`, type `'handover_state'` all present
- [ ] Run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on all modified markdown files: zero errors
- [ ] Run packet-strict validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands --strict`
- [ ] Verify distributed-governance rule present in CLAUDE.md, AGENTS.md, `.opencode/skill/system-spec-kit/SKILL.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract grep | Command cards, YAML assets, skill reference, event names, fence markers | `rg`, manual diff review |
| Dry-run / fixture | `folder_state` classification, seed creation, repair-mode, placeholder-upgrade, generated-fence replacement | Command dry-runs against empty, partial, repair, seeded, healthy, and conflict fixtures |
| Regression | Existing healthy-folder `/plan` and `/complete` behavior; deep-research reruns on same topic | Packet-local command runs plus strict validation |
| Manual review | Human-authored content preservation, generated-fence boundaries, optional memory-save branching | File review in `spec.md`, JSON metadata inspection |
| **Structural parity** | New `start.md` vs nearest speckit sibling; new `spec_kit_start_*.yaml` vs nearest YAML sibling; modified files preserve ordering/anchors/step-IDs | `diff -u` vs nearest sibling, structural checklist items, `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |

### Requirement Coverage
- **REQ-001 to REQ-004**: verify deep-research late-INIT lock, `folder_state`, seed-create, bounded pre-init mutation, and generated-fence write-back on both empty and populated fixtures.
- **REQ-005 to REQ-006**: verify direct `/start` trio publication plus parent-command inline delegation on `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`.
- **REQ-007 to REQ-010**: verify relationship-object schema, helper-backed level recommendation versus override, shared auto/confirm state graph parity, and rerun idempotency.
- **REQ-011**: verify resume data (`resume_question_id`, `repair_mode`, `reentry_reason`) and completion blocking until seed markers clear or are explicitly replaced.
- **NFR-Q01 to NFR-Q05**: verify structural parity with existing speckit commands/YAMLs, sk-doc validator compliance for all new and modified markdown, preservation of existing ordering/anchors/step-IDs, and `diff -u` ≥ 50% overlap vs nearest sibling.
- **Regression rule**: after implementation, run deep-research on this same `012-spec-kit-commands` packet to prove the real `spec.md` anchor flow works end to end without breaking the current research packet layout.

### M9 Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deletion verification | 17 deleted files are absent; 8 preserved agent files remain (`@debug` + `@deep-research` across 4 runtimes each) | `ls` + git status |
| Zero-reference grep sweep | Active docs contain no `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` refs | `grep -rE "..."` with exclusion filter for archive/future/iterations/scratch/changelog/specs |
| Preservation check | Templates (`handover.md`, `debug-delegation.md`, `level_N/`), `system-spec-kit` skill, MCP server code (handlers, routing, schemas, types, dist/) remain intact | `ls` + content hash comparison |
| Distributed-governance rule presence | CLAUDE.md, AGENTS.md, `.opencode/skill/system-spec-kit/SKILL.md` contain the new rule with `validate.sh --strict` reference | `grep -E "validate\.sh --strict"` in the 3 files |
| `/memory:save` positioning | `save.md` §1 contains "Handover Document Maintenance" subsection; `handover_state` contract row references template path for initial creation | `grep -E "Handover Document Maintenance\|handover_state"` in save.md |
| `/spec_kit:resume` recovery ladder unchanged | `handover.md` still read as first recovery source | `grep -E "handover\.md"` in `resume.md` matches ≥ 5 times |
| Orchestrate routing consistency | All 4 orchestrate runtime mirrors apply identical edits | `diff` on relevant sections between runtimes |
| sk-doc validator | All modified markdown files pass with 0 errors | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Packet strict validation after M9 | Packet 012 passes `validate.sh --strict` | `bash .../validate.sh ... --strict` |

### M9 Requirement Coverage

- **REQ-012 + REQ-013**: verified by deletion check + zero-reference grep sweep
- **REQ-014**: verified by distributed-governance rule presence check in 4 files
- **REQ-015**: verified by zero-reference grep sweep across ~50 modified files
- **REQ-016**: verified by preservation check for @debug, templates, skill, MCP code, resume ladder
- **REQ-017**: verified by `/memory:save` positioning check + `:auto-debug` absence in `spec_kit_complete_{auto,confirm}.yaml`

### M9 End-to-End Functional Verification

- **Main-agent spec-folder writes**: invoke `/spec_kit:start` on a new folder after M9; verify main agent writes `spec.md` from template and `validate.sh --strict` passes
- **/memory:save handover_state routing**: trigger `/memory:save` with `routeAs: 'handover_state'`; verify content lands in `handover.md::session-log`
- **@debug Task-tool dispatch**: dispatch `@debug` via Task tool; verify fresh-perspective debugging works without the deprecated `/spec_kit:debug` wrapper
- **@deep-research exclusive write preserved**: verify only `@deep-research` writes `research/research.md` (rule preserved as standalone, no longer carve-out from @speckit)
- **Orchestrate routing correctness**: orchestrate agent on deprecation-pattern tasks should suggest `/memory:save` + Task-tool dispatch, never `@speckit`, `@handover`, `/spec_kit:debug`, or `/spec_kit:handover`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec/create.sh` | Internal helper | Green | Needed only for existing parent-command phase creation paths; `/start` must not absorb phase logic, but later `:with-phases` reuse should continue through the same helper path |
| `scripts/generate-description.js` | Internal helper | Yellow | Canonical metadata regeneration depends on an implementation-time wrapper choice after `spec.md` exists; helper internals stay unchanged, but exact command-layer sequencing must be selected carefully |
| `spec/recommend-level.sh` | Internal helper | Green | `/start` level suggestion depends on deriving numeric `loc/files/risk` proxies first and storing `level_recommendation` separately from `selected_level` |
| `scripts/dist/memory/generate-context.js` | Internal helper | Yellow | Optional memory-save mode can reuse it only after canonical trio success and only when structured context exists; it is not the baseline create/repair path |
| `.opencode/skill/system-spec-kit/templates/level_{1,2}/` | Internal templates | Green | Deep-research seed-create and `/start` scaffold output depend on the existing templates staying stable |
| `validate_document.py` and `spec/validate.sh --strict` | Verification tooling | Green | Completion evidence depends on validator-backed markdown/schema checks remaining available |
| **Existing speckit command cards as structural templates** — `plan.md`, `deep-research.md`, `complete.md`, `implement.md`, `handover.md` | Structural reference | Green | `/spec_kit:start.md` MUST mirror their top-level sections, frontmatter shape, and callout style per NFR-Q01. Verified via `diff -u` vs nearest sibling. |
| **Existing speckit YAML assets as structural templates** — `spec_kit_plan_auto.yaml`, `spec_kit_deep-research_auto.yaml`, `spec_kit_complete_auto.yaml` (+ confirm variants) | Structural reference | Green | `spec_kit_start_auto.yaml` and `_confirm.yaml` MUST mirror their top-level key ordering, step-ID naming, and variable vocabulary per NFR-Q02. |
| **sk-doc validator** — `.opencode/skill/sk-doc/scripts/validate_document.py` | Verification tooling | Green | Every new or modified markdown file MUST pass with zero errors per NFR-Q03. Template-inherited warnings only. |
| **M9 `validate.sh --strict` + templates** — bash scripts at `scripts/spec/` and templates at `templates/level_N/` | Runtime substrate for distributed governance | Green | After @speckit deletion, spec-folder authoring quality depends on these scripts + templates remaining stable. M9 does not modify them; Phase 7 survival check verifies presence |
| **M9 `/memory:save` content router** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` + `routing-prototypes.json` | Runtime handler for `handover_state` routing | Green | M9 repositions `/memory:save` as handover.md maintainer in documentation only; handler code is unchanged. Phase 7 preservation check verifies |
| **M9 `/spec_kit:resume` recovery ladder** — `.opencode/skill/system-spec-kit/mcp_server/dist/lib/resume/resume-ladder.js` | Runtime reads handover.md as first recovery source | Green | No changes; Phase 7 verification confirms `resume.md` still references handover.md |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Missing host anchors, duplicate markers, or human edits inside the generated findings block | Fail closed, emit typed conflict audits, and require an explicit repair path instead of heuristic in-place fixes |
| Advisory lock contention or stale-lock confusion | Block the second writer and keep stale-lock override behind confirm or explicit recovery only |
| Generated-block replacement or rename failure | Surface the exact recovery output and keep pre-existing files intact rather than pretending a helper-level transaction exists |
| Deep-research-created placeholder specs are treated as healthy | Use explicit tracked seed markers and gate success on marker clearance or explicit `N/A - insufficient source context` replacement |
| Metadata-only repair accidentally routes through `generate-context.js` | Keep metadata repair inside canonical trio creation and reserve `generate-context.js` for optional memory-save mode only |
| `recommend-level.sh` fails or returns unusable output | Fall back explicitly, record the recommendation failure, and keep user-confirmed level override separate |

- **Trigger**: Roll back if healthy-folder `/plan` or `/complete` flows gain extra prompts, deep-research can no longer complete on this packet, generated-fence replacement touches human-owned prose, or canonical trio publication can leave inconsistent pre-existing files.
- **Procedure**: Revert the touched command cards, YAML assets, and `spec_check_protocol` references together; rerun healthy-folder smoke checks, packet strict validation, and the deep-research regression fixture before reattempting the implementation.

### M9 Rollback

- **Trigger**: Roll back if Phase 9f verification sweep finds dangling refs, main agent cannot write spec folder docs without @speckit, `/memory:save` handover_state routing breaks, `/spec_kit:resume` recovery ladder fails, or `@debug` agent becomes unreachable via Task tool
- **Procedure**: Revert the 17 DELETE operations in a single `git restore` batch; revert root docs (CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md) edits; revert orchestrate runtime mirror edits; revert spec_kit command + YAML asset edits; revert skill + reference + install-guide edits. Run Phase 7 verification in reverse to confirm return to pre-M9 state. Then document regression in `implementation-summary.md` §Known Limitations and consider alternative path: create `@spec-master` agent as a slim replacement for `@speckit` with the same exclusive-writer contract
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
M1 (/start scaffolding) ───────┐
                               ├──► M4 (plan/complete delegation) ──┐
M2 (spec check + lock) ──► M3 ─┘                                    │
                                                                     ├──► M5 (idempotency + seed markers) ──► M6 (audit + staged commit) ──► M7 (structural parity) ──► M8 (README audit) ──► M9 (middleware cleanup)
M2 (spec protocol) ──────────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| M1 `/start` scaffolding | None | M4, M5, M6 |
| M2 deep-research spec check | None | M3, M5 |
| M3 post-synthesis write-back | M2 | M5, M6 |
| M4 parent-command delegation | M1 | M5, M6 |
| M5 idempotency hardening | M1, M3, M4 | M6 |
| M6 audit + staged commit wrapper | M1, M3, M4, M5 | M7 |
| M7 structural parity + sk-doc compliance | M1–M6 | M8 |
| M8 README + SKILL documentation audit | M1–M7 | M9 |
| M9 middleware cleanup (deprecations) | M8 (clean starting ref state) | Verification / closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| M1 `/start` scaffolding | Medium | 0.5-1 day |
| M2 deep-research spec check | High | 0.5-1 day |
| M3 post-synthesis write-back | High | 0.5 day |
| M4 parent-command delegation | High | 0.5-1 day |
| M5 idempotency hardening | High | 0.5 day |
| M6 audit + staged commit wrapper | High | 0.5 day |
| M7 structural parity + sk-doc compliance | Medium | 0.5 day |
| M8 README + SKILL documentation audit | Medium | 0.5 day |
| M9 middleware cleanup (17 deletions + ~50 reference updates) | High | 1–1.5 days |
| **Total** | | **5-7 implementation days plus validation time** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture a clean diff for the 14 planned production files only
- [ ] Prepare empty, partial, repair, placeholder-upgrade, healthy, and conflict fixtures before changing runtime behavior
- [ ] Confirm the deep-research regression target remains this same packet

### Rollback Procedure
1. Revert the `/start`, deep-research, plan, complete, and `sk-deep-research` edits as one batch so the state model stays internally consistent.
2. Remove any test-only generated fences or seed markers from fixtures created during implementation verification.
3. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands --strict` and the healthy-folder smoke tests.
4. Re-run the packet-local deep-research regression only after the baseline behavior is restored.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Remove or reset test fixture folders only; no persistent database schema changes are part of this packet
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Milestones M1-M6 mirror research sections 6-12
- Focuses on command-layer contracts, helper reuse boundaries, and packet-local regression
- Deep-research on this same packet is the required real-world regression pass
-->
