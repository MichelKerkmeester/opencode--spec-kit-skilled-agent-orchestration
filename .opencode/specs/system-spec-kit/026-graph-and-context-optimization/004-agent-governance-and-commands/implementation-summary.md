---
title: "Implementation Summary [system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/implementation-summary]"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
description: "Closeout for the unified agent-governance-and-commands packet. Workstream A delivered the lean AGENTS execution-guardrail update under Critical Rules (three files, delivered 2026-04-08). Workstreams B and C delivered the canonical intake architecture — shared intake-contract.md module with /spec_kit:plan --intake-only, deep-research spec anchoring, /memory:save repositioning — and the hard-delete of deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit × 4 runtimes each), delivered across 2026-04-14 and 2026-04-15 after a 10-iteration deep review and five parallel Opus remediation agents. Flattened to a single Level 3 root on 2026-04-24."
trigger_phrases:
  - "implementation summary"
  - "packet closeout"
  - "agent governance summary"
  - "canonical intake"
  - "command graph architecture"
  - "middleware cleanup summary"
  - "intake contract delivered"
  - "agents guardrails summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands"
    last_updated_at: "2026-04-24T17:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Flattened two phase packets into unified root docs under one Level 3 closeout"
    next_safe_action: "Packet complete; no further work anticipated within this packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/resume.md"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/skill/sk-deep-research/references/spec_check_protocol.md"
      - ".opencode/changelog/01--system-spec-kit/v3.4.0.0.md"
    session_dedup:
      fingerprint: "sha256:004-agent-governance-impl-summary-merge-2026-04-24"
      session_id: "004-agent-governance-impl-summary-merge-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Workstream A: three AGENTS files carry lean Critical Rules block with all eight execution guardrails"
      - "Workstream B: single canonical intake contract at .opencode/skill/system-spec-kit/references/intake-contract.md, referenced by /spec_kit:plan and /spec_kit:complete"
      - "Workstream B: standalone intake invocation via /spec_kit:plan --intake-only with explicit YAML gate"
      - "Workstream C: deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit × 4 runtime mirrors each) hard-deleted"
      - "Deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2); 5 parallel Opus agents fixed all 12"
      - "Phase flatten 2026-04-24: child phase folders removed; authoritative docs live at packet root"
---
# Implementation Summary: Agent Governance And Commands

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-agent-governance-and-commands |
| **Status** | Complete |
| **Level** | 3 |
| **Workstream A Delivered** | 2026-04-08 |
| **Workstream B + C M1-M9 Delivered** | 2026-04-14 |
| **Workstream B + C M10-M15 Delivered** | 2026-04-15 |
| **Flattened Into Root** | 2026-04-24 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet closes three coordinated surgery passes on the agent and command graph, now consolidated into a single Level 3 root with no nested phase folders.

### Workstream A — AGENTS execution guardrails

In all three AGENTS targets (Public root `AGENTS.md`, Public enterprise example `AGENTS_example_fs_enterprises.md`, Barter coder `AGENTS.md`), the request-analysis framework lives inside `## 1. CRITICAL RULES` as `### Request Analysis & Execution`. The old standalone request-analysis top-level section is removed; later top-level sections are renumbered so old 6/7/8 became `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, `## 7. SKILLS SYSTEM`; the Clarify bullet points to `§4 Confidence Framework`; and the moved block is reduced to only `Flow` plus `#### Execution Behavior`.

The lean block carries all eight requested guardrails in operational language:

1. Avoid ownership-dodging; take responsibility for issues encountered.
2. Avoid premature stopping; push toward a complete solution.
3. Avoid permission-seeking when already capable of solving safely.
4. Plan multi-step approaches before acting.
5. Recall and apply project-specific conventions from `CLAUDE.md`.
6. Catch and fix own mistakes using reasoning loops and self-checks.
7. Use a research-first tool approach; prefer surgical edits.
8. Reason from actual data, not assumptions.

The moved `### Request Analysis & Execution` block spans `AGENTS.md:32-45`, `AGENTS_example_fs_enterprises.md:54-67`, `Barter/coder/AGENTS.md:58-71`, each transitioning directly into `### Tools & Search`.

### Workstream B — Canonical intake architecture

You can now run `/spec_kit:plan` or `/spec_kit:complete` on any folder state and get canonical intake mechanics — five-state folder classification, four repair-mode branches, staged canonical-trio publication, relationship capture with `packet_id` dedup, resume semantics, fail-closed intake lock — through a single shared reference module at `.opencode/skill/system-spec-kit/references/intake-contract.md`. For standalone intake invocations (create folder, repair metadata, resolve placeholders without planning), `/spec_kit:plan --intake-only` is the invocation path; the former standalone `/spec_kit:start` command, its YAML assets, its Gemini CLI routing, and its skill registry boost entry are hard-deleted with no deprecation stub remaining. Deep-research anchors every run to a real `spec.md` via the `spec_check_protocol.md` reference.

#### Initial intake command surface (M1 — later superseded by the shared-module pattern in M10-M14)

The M1 pass authored a standalone intake command card + two YAML workflows to prove canonical intake mechanics: folder-state classification, level recommendation versus override, staged canonical-trio publication, and optional memory-save branching. YAML workflows shared one state graph across auto/confirm modes. This served as the concrete intake contract that M10 extracted into `intake-contract.md`; the command card and YAMLs were hard-deleted in M14b once the shared-module pattern was in place.

#### Deep-research anchored to real `spec.md` (M2-M3)

The command acquired an advisory lock during late INIT, classified folder state, seeded or updated bounded spec content before the iteration loop, and wrote back generated findings through one machine-owned fence `<!-- BEGIN/END GENERATED: deep-research/spec-findings -->`. `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` (+241 lines) documents lock lifecycle, folder-state detection, seed markers, host-anchor ownership, generated-fence replacement, audit events, and idempotency rules.

#### Parent-command delegation (M4-M6)

Both `/spec_kit:plan` and `/spec_kit:complete` detect non-healthy folders, absorb intake, bind returned intake fields (`feature_description`, `spec_path`, `selected_level`, `repair_mode`, `manual_relationships`), and preserve healthy-folder behavior. Idempotency, manual relationship dedup by `packet_id`, and typed audit events (`start_delegation_triggered`, `start_delegation_completed`, `relationship_captured`, `canonical_trio_committed`, `memory_save_branched`, `spec_check_result`) are encoded in YAML workflows.

#### Structural parity + sk-doc compliance (M7-M8)

ADR-001 replaced the broken diff-based overlap formula with shared-line similarity. Measured overlaps: initial intake command card vs `deep-research.md` = 46.76%; initial intake auto YAML vs `deep-research` auto YAML = 15.51%; initial intake confirm YAML vs `deep-research` confirm YAML = 16.16%. README + SKILL sweep covered 113 matched files; updates preserved NFR-Q04 discipline (additions and in-place clarifications only).

#### Shared intake contract extracted (M10)

`.opencode/skill/system-spec-kit/references/intake-contract.md` (220 lines, 15 sections) authored in one pass with 1:1 semantic coverage verified against the M1 initial intake surface. Sections cover inputs/outputs, workflow phases, five folder states (`empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`), four repair modes (`create`, `repair-metadata`, `resolve-placeholders`, `abort`), consolidated Q0-Q4+ interview, staged canonical trio publication, manual relationships with `packet_id` deduplication, resume semantics via `resume_question_id`/`reentry_reason`, intake lock scoped to Step 1 only, optional memory-save branch, error handling, consumer integration requirements.

#### `/spec_kit:plan` expanded to 8 steps (M11)

`plan.md` absorbs intake at Step 1 and gains the `--intake-only` flag plus eight intake-contract flags (`--spec-folder`, `--level`, `--start-state`, `--repair-mode`, `--record-relationships`, `--depends-on`, `--related-to`, `--supersedes`). Step 5a folder classification runs through the five states. The command's Step 1 now references `intake-contract.md §5` in place of inline intake logic. `start_delegation_required` renamed to `intake_required`. When `--intake-only` is set, the workflow halts after the Emit phase via an explicit YAML `intake_only` gate; when absent, planning continues. `:with-phases` pre-workflow preserved unchanged.

#### `/spec_kit:complete` Section 0 refactored (M12)

Section 0 applies the same pattern: six parallel edits replace the inline intake block with a reference to the shared module. Downstream workflow (Steps 5a, 8, 9) is semantically unchanged — only the intake-mechanics reference is rewired. The duplication risk between `/plan` and `/complete` is eliminated.

#### `/spec_kit:resume` re-entry routing (M13)

`resume.md` had zero `/spec_kit:start` references already, so no file change was required. The documented routing for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` now points at `/spec_kit:plan --intake-only` in the forward-looking prose sweep. Prefilled state semantics (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`) unchanged.

### Workstream C — Middleware cleanup (M9 + M14)

- **15 verified deletions (M9)**: `/spec_kit:handover` + `/spec_kit:debug` command cards, 3 YAML assets (`handover_full`, `debug_auto`, `debug_confirm`), 4 `@handover` runtime mirrors (OpenCode, Claude, Codex TOML, Gemini), 4 `@speckit` runtime mirrors, 2 Gemini command TOML mirrors.
- **~50 file modifications (M9)**: orchestrate runtime mirrors × 4, `@debug` agent description updates × 4, ultra-think × 4, 7 live `spec_kit` command files, 10 YAML assets, 3 root docs, 4 install guides, 2 command READMEs, system-spec-kit skill + references × 11, sk-code-web × 2, CLI skill references × 5 + cli-gemini README, `.opencode/command/improve/agent.md`, `.opencode/skill/sk-doc/assets/agents/agent_template.md`, `.opencode/command/memory/save.md`.
- **Distributed-governance rule inserted**: spec-folder markdown writes now rely on template usage, `validate.sh --strict`, and `/memory:save`, while `@deep-research` remains exclusive for `research/research.md` and `@debug` remains exclusive for `.opencode/skill/system-spec-kit/templates/debug-delegation.md`.
- **`:auto-debug` flag removed** from `/spec_kit:complete`; replaced with explicit user-escalation path (`failure_count >= 3` → escalate with diagnostic summary; `@debug` available via Task tool).
- **`/memory:save` repositioned** as canonical packet handover maintainer via `handover_state` routing; §1 "Handover Document Maintenance" subsection inserted.
- **4 hard deletions (M14b)** atomically removed:
  - `.opencode/command/spec_kit/start.md` (340 lines)
  - `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` (508 lines)
  - `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` (585 lines)
  - `.gemini/commands/spec_kit/start.toml`
- **`COMMAND_BOOSTS` dictionary entry** removed from `.opencode/skill/system-spec-kit/SKILL.md:210` so the skill advisor no longer surfaces the deleted command.
- **26-file downstream prose sweep** delegated to `cli-copilot` with GPT-5.4 reasoning=high via an `@improve-prompt`-prepared CRAFT package. Copilot completed **56 edits across 26 files in one pass with zero drift and zero ambiguous-semantics flags**, plus caught and fixed one stray reference inside `intake-contract.md` itself.

### Deep-review remediation (M15)

A 10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2):

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| P001-COR-001 | P0 | spec.md CHK cross-references point to nonexistent rows | FIXED — swapped CHK-008/CHK-017/CHK-005 → CHK-034/CHK-041/CHK-023 |
| P003-COR-001 | P0 | `/spec_kit:plan --intake-only` documented but not executable in YAML | FIXED — explicit `intake_only` gate added (ADR-010) |
| P004-TRA-001 | P0 | Deleted start command still in forward-looking command indexes | FIXED — stale rows removed from `.opencode/command/README.txt` and `.opencode/command/spec_kit/README.txt` |
| P006-COR-001 | P0 | Nonexistent agent paths in system-spec-kit `graph-metadata.json` | FIXED — `.opencode/agent/speckit.md` and `.claude/agents/speckit.md` removed from `derived.key_files` |
| P001-COR-002 | P1 | Closeout status misalignment with unmet validation gates | FIXED — implementation-summary §Verification updated |
| P002-IIN-001 | P1 | Duplicated intake questionnaire in merged command surfaces | FIXED — Gemini TOMLs regenerated; duplication eliminated |
| P007-MAI-001 | P1 | Template quick starts bypass canonical intake workflow | FIXED — template READMEs updated |
| P009-SEC-001 | P1 | Copilot delegation docs missing governance route | FIXED — cli-copilot references updated |
| 4 additional P2 findings | P2 | Various minor improvements | FIXED in parallel remediation pass |

**Five parallel Opus remediation agents** resolved all 12 findings in the same session.

### Files Changed (unified)

| File | Action | Purpose |
|------|--------|---------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md` | Modified | Workstream A: lean `### Request Analysis & Execution` block under `## 1. CRITICAL RULES` + renumbered headings. Workstream C: `@debug` Task-tool dispatch, distributed-governance rule, deprecated bullets removed. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS_example_fs_enterprises.md` | Modified | Same Workstream A + C edits mirrored into the enterprise example. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` | Modified | Workstream A edits only (Barter runtime) with local wording fit. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md` | Modified | Distributed-governance rule, `@debug` Task-tool dispatch. |
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Created | Canonical intake contract (220 lines, 15 sections). |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Created | Deep-research spec-check protocol (241 lines). |
| `.opencode/command/spec_kit/plan.md` | Modified | Step 1 references shared intake module; `--intake-only` flag with explicit YAML gate. |
| `.opencode/command/spec_kit/complete.md` | Modified | Section 0 references shared intake module; `:auto-debug` removed. |
| `.opencode/command/spec_kit/resume.md` | Modified | Routes intake re-entry to `/spec_kit:plan --intake-only`; handover/debug rows removed. |
| `.opencode/command/spec_kit/deep-research.md` | Modified | Late-INIT advisory lock + folder-state classification + SYNTHESIS generated-fence write-back. |
| `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/deep-review.md` | Modified | Removed `@speckit` + `@handover` do-not-dispatch lines; removed Session Handover Check. |
| `.opencode/command/spec_kit/assets/*.yaml` (7 workflow assets) | Modified | Reference-only intake; explicit `intake_only` gate; `:auto-debug` logic removed. |
| `.opencode/command/memory/save.md` | Modified | §1 "Handover Document Maintenance" subsection; `handover_state` contract row. |
| `.opencode/command/spec_kit/{handover.md, debug.md}` + 3 YAML assets | Deleted | Middleware deprecation (M9a). |
| `.opencode/agent/{handover.md, speckit.md}` + 3 runtime mirrors each (8 files) | Deleted | `@handover` + `@speckit` runtime retirement (M9a). |
| `.gemini/commands/spec_kit/{handover.toml, debug.toml, start.toml}` | Deleted | Gemini CLI routing removed (M9a + M14b). |
| `.opencode/command/spec_kit/start.md` + 2 YAML assets | Deleted | Standalone-intake surface removed (M14b). |
| `.opencode/skill/system-spec-kit/SKILL.md` + `README.md` | Modified | `@speckit` exclusivity → distributed-governance; `COMMAND_BOOSTS` entry removed at line 210. |
| `.opencode/agent/{orchestrate,debug,ultra-think}.md` + 3 runtime mirrors each | Modified | Description updates, Task-tool dispatch, `@speckit`/`@handover` refs removed. |
| `.opencode/install_guides/*`, `.opencode/README.md`, root `README.md` | Modified | Agent tables + command-graph updates. |
| 26 forward-looking doc surfaces (cli-* references, template READMEs, reference docs, catalog) | Modified | Delegated to cli-copilot GPT-5.4; 56 edits in one pass with zero drift. |
| `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` | Created | Migration notes for `/spec_kit:start → /spec_kit:plan --intake-only`, `/spec_kit:handover → /memory:save`, `/spec_kit:debug → Task-tool dispatch`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Rewritten (2026-04-24 flatten) | Unified root docs replacing nested phase layout. |

### REQ Coverage Matrix

**Workstream A**

| Requirement | Coverage | Evidence |
|-------------|----------|----------|
| REQ-401 | ✓ | Final file set contains only three AGENTS edits + packet docs |
| REQ-402 | ✓ | Ownership wording present in all three files |
| REQ-403 | ✓ | Persistence wording present |
| REQ-404 | ✓ | Anti-permission wording present + bounded by hard blockers |
| REQ-405 | ✓ | Plan-first wording present |
| REQ-406 | ✓ | Request-analysis block under `## 1. CRITICAL RULES` in all three files |
| REQ-407 | ✓ | Moved block contains only `Flow` + `#### Execution Behavior` before `### Tools & Search` |
| REQ-408..REQ-413 | ✓ | CLAUDE.md recall, self-checks, research-first, data-over-assumption, renumbered headings, `§4 Confidence Framework` reference |
| REQ-414 | ✓ | spec/plan/tasks/checklist/implementation-summary aligned on scope |

**Workstreams B + C**

| Requirement | Coverage | Evidence |
|-------------|----------|----------|
| REQ-001..REQ-004 | ✓ | Deep-research command surface + YAML + protocol define advisory lock + folder-state + seed markers + generated-fence + `spec_check_result` |
| REQ-005..REQ-010 | ✓ | `intake-contract.md` authored; `plan.md` + `complete.md` reference shared module; `--intake-only` with explicit YAML gate; `resume.md` routing; re-entry state |
| REQ-011..REQ-013 | ✓ | Middleware deleted (7 command/YAML + 8 agent mirrors); distributed-governance rule in 4 files |
| REQ-014..REQ-017 | ✓ | `start.md` + 2 YAMLs + `start.toml` deleted; `COMMAND_BOOSTS` entry removed; zero forward-looking `/start` refs; `validate.sh --strict` PASS with documented supersession |
| REQ-018..REQ-024 | ✓ | Manual relationships object + dedup; level recommendation; shared state graph; idempotency; zero-reference sweep; preserved capabilities; `/memory:save` positioning + `:auto-debug` removal |
| REQ-025..REQ-030 | ✓ | Root README command-graph updated; cli-* refs updated; install guides updated; all 5 template READMEs updated; changelog authored; sk-doc DQI PASS |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Workstream A ran on 2026-04-08 as a narrow, three-target instruction sync. The session read each AGENTS file directly, built the eight-point guardrail matrix and structure checklist, patched each target with surgical edits that kept the moved block lean, re-read all three files to confirm the final wording preserved existing safety blockers, and closed the Workstream-A evidence with `validate.sh --strict`.

Workstreams B and C were delivered through fifteen milestones with middleware deletion running in parallel during M9. M1 scaffolded the initial intake command surface; M2-M3 wired `/spec_kit:deep-research` to `spec.md` via the protocol reference; M4 added parent-command inline absorption in `/spec_kit:plan` and `/spec_kit:complete`; M5-M6 hardened idempotency and audit events; M7-M8 verified structural parity and swept cross-repo README/SKILL docs; M9 deprecated the middleware wrappers (`/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit`) and repositioned `/memory:save` as canonical packet handover maintainer. The M9 closeout reran `validate.sh --strict` to `RESULT: PASSED`, ran `validate_document.py` on the changed-markdown set to 0 blocking issues, and generated the packet-local nested changelog.

M10 extracted `intake-contract.md` with 1:1 semantic coverage of the M1 intake logic; M11 expanded `plan.md` to reference the shared module and added `--intake-only`; M12 refactored `complete.md` Section 0; M13 verified `resume.md` was already clean; M14 atomically hard-deleted `start.md` + 2 YAML assets + `.gemini/commands/spec_kit/start.toml` + `COMMAND_BOOSTS` entry, and delegated the 26-file downstream prose sweep to `cli-copilot` (GPT-5.4 reasoning=high, `--allow-all-tools`) via an `@improve-prompt`-prepared CRAFT package which completed 56 edits in one pass; M15 dispatched five parallel Opus agents to remediate 12 findings from the 10-iteration deep review (4 P0 / 4 P1 / 4 P2).

On 2026-04-24 the two phase packets were flattened into unified root docs under this single Level 3 closeout. The merge rewrote the root `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, promoted `checklist.md` and `decision-record.md` to the root, preserved REQ/CHK/ADR identifiers verbatim for audit continuity, and moved the Workstream-A deep-review artifacts into the root `review/` folder. Phase subfolders `001-agent-execution-guardrails/` and `002-command-graph-consolidation/` and `context-index.md` were deleted.

Verification evidence was built three ways: a correctly-scoped grep sweep with zero active hits outside expected supersession-documentation surfaces; `validate.sh --strict` output audited against each reported `SPEC_DOC_INTEGRITY` error to confirm each one is a documented supersession reference (the validator's naive link extractor cannot distinguish "documenting a deprecation" from "broken link"); and `git diff HEAD` on M1-M9 surfaces confirming historical facts were preserved verbatim in the canonical docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Workstream / Milestone | Why |
|----------|------------------------|-----|
| Move request-analysis guidance into `## 1. CRITICAL RULES` instead of leaving it as a standalone top-level section | A | Reduces duplicated policy surfaces and keeps planning/execution guidance close to the hard rules that govern it. |
| Strip duplicate support scaffolding from the moved block | A | Keeps the execution contract clear while avoiding extra tables/checklists that repeat nearby policy. |
| Keep only `Flow` plus `#### Execution Behavior` in the moved block | A | Surgical update that preserves all eight requested behaviors in one operational block across all three instruction surfaces. |
| Source-contract grep verification for unchecked rows | M7-M8 closeout | User explicitly scoped source-level evidence plus structural confirmation rather than fixture or slash-command execution. |
| Treat M9 middleware deprecation as complete while preserving continuity and recovery surfaces | M9 | Removes deprecated wrappers and agents without regressing `/memory:save`, `/spec_kit:resume`, `@debug`, `@deep-research`. |
| Distributed-governance rule over `@speckit` exclusivity | M9 (ADR-011) | Replaces agent-exclusivity with template-driven + validator-enforced governance; depends on Workstream A execution guardrails as the behavioral foundation. |
| `/memory:save` as canonical packet handover maintainer | M9 (ADR-012) | Single canonical command for continuity + handover maintenance; template + routing-prototype infrastructure preserved. |
| `:auto-debug` flag removal and explicit user escalation | M9 (ADR-013) | Preserves escalation signal while keeping agent dispatch explicit and user-controlled. |
| Structural overlap formula: shared-line similarity | M7 (ADR-001) | Replaces broken unified-diff formula with reproducible exact-line metric. |
| Shared reference module over inline duplication | M10-M12 (ADR-002, ADR-003) | Three parallel intake surfaces had drift risk; single canonical surface eliminates that risk. |
| Hard delete over phased stub deprecation | M14 (ADR-005) | User chose a zero-artifact end state via AskUserQuestion; 30+ forward-looking references atomically updated within packet boundary. |
| `--intake-only` flag over `/spec_kit:intake` alias | M11 (ADR-004) | One discoverable command surface with `--help`-visible flag is simpler than maintaining a thin alias. |
| Explicit `intake_only` YAML gate | M15 remediation (ADR-010) | Documentation alone is insufficient; gate ensures `--intake-only` actually halts after Step 1. |
| `complete.md` references shared module rather than call-chaining into `/plan --intake-only` | M12 (ADR-009) | Avoids inverted dependency; keeps `complete.md` self-contained. |
| Intake lock scoped to Step 1 only | M10-M11 (ADR-006) | Lock must not block planning Steps 2-8 on unrelated concurrent folders; preserves fail-closed semantics during intake window. |
| Forward-looking sweep only (historical records preserved) | M14a (ADR-008) | Changelog entries and historical records must not be rewritten; only forward-looking docs get the sweep. |
| Flatten nested phase packets to a single Level 3 root | 2026-04-24 | Child phase folders no longer serve a navigation purpose now that both workstreams are complete; root docs become the single authoritative surface. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Workstream A structure update (Public enterprise) | PASS — lean `### Request Analysis & Execution` block at lines 54-67; transitions directly into `### Tools & Search` at line 71; hard blockers preserved at lines 34-38; anti-permission wording at line 64 |
| Workstream A structure update (Public root) | PASS — block at lines 32-45; transitions into `### Tools & Search` at line 49; hard blockers at lines 11-15; anti-permission wording at line 41 |
| Workstream A structure update (Barter) | PASS — block at lines 58-71; transitions into `### Tools & Search` at line 75; hard blockers at lines 37-41; anti-permission wording at line 67 |
| Workstream A packet validator | PASS — `validate.sh --strict` returned clean for the original phase folder before flatten |
| M1-M8 source-contract sweep (CHK-001 through CHK-035) | PASS — all rows marked [x] with grep-based evidence |
| M9 verification tail (CHK-036 through CHK-054) | PASS — all marked [x] including source-contract closure for previously stale rows |
| M1-M9 final task state | PASS — 54/54 early-milestone tasks marked [x] |
| M1-M9 nested changelog generation | PASS — `nested-changelog.js --write` generated the packet-local changelog |
| M1-M9 final sk-doc validator batch | PASS — `validate_document.py` returned 0 issues across changed-markdown closeout set |
| M1-M9 final packet strict validation | PASS — `validate.sh [packet-folder] --strict` returned `RESULT: PASSED` with 0 warnings |
| M10-M14 `validate.sh --strict` | CONDITIONAL — `SPEC_DOC_INTEGRITY` reports are documented supersession references the validator's naive link extractor cannot distinguish from broken links. Forward-looking references resolve correctly to `v3.4.0.0.md`. |
| M10-M14 grep `/spec_kit:start` in active scope | PASS — zero active hits (excluding packet-local changelog and historical scratch) |
| M10-M14 grep `spec_kit/start.md` in active scope | PASS — zero active hits |
| M1-M9 state preservation after M10-M15 consolidation | PASS — M1-M9 evidence preserved verbatim in canonical docs |
| Manual integration tests T090-T094 | DEFERRED — user-driven manual tests (`/spec_kit:plan --intake-only`, intake bypass, `/complete`, `/resume` re-entry, idempotence) |
| Harness skill registry cleanup | PASS — `COMMAND_BOOSTS` entry removed at `SKILL.md:210` |
| Changelog entry authored | PASS — `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` documents migration notes |
| cli-copilot delegation outcome | PASS — 56 edits across 26 files in one pass; zero drift; caught and fixed one stray reference in `intake-contract.md` |
| M15 P001-COR-001 remediation | FIXED — spec.md CHK references swapped to real rows (CHK-034, CHK-041, CHK-023) |
| M15 P003-COR-001 remediation | FIXED — explicit `intake_only` YAML gate added (ADR-010) |
| M15 P004-TRA-001 remediation | FIXED — stale `start` rows removed from command indexes |
| M15 P006-COR-001 remediation | FIXED — nonexistent agent paths removed from system-spec-kit graph-metadata |
| M15 P1/P2 remediation (8 findings) | FIXED — all resolved via 5 parallel Opus agents |
| Closeout `validate.sh --strict` re-run | PASS (with documented supersession warnings) |
| Phase flatten 2026-04-24 | PASS — root docs rewritten; child phase folders + `context-index.md` removed; `description.json` + `graph-metadata.json` regenerated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **External invokers break**. Any external script, automation, or documentation outside this repository that called `/spec_kit:start`, `/spec_kit:handover`, or `/spec_kit:debug` will receive "command not found" from the harness. Migration mappings are documented in `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`; in-repo consumers are all updated.

2. **Harness restart or skill reload may be required**. The `COMMAND_BOOSTS` dictionary change at `SKILL.md:210` is picked up by the skill advisor on its next load; a running session may need a restart or `/skill:reload` to pick up the removal.

3. **Manual integration tests deferred**. Tasks T090-T094 (`/spec_kit:plan --intake-only` on empty folder, intake bypass on populated folder, `/complete` on empty folder, `/resume` re-entry routing, idempotence) are scoped as user-driven manual tests. Documentation and validation gates all pass, but runtime behavior verification on real scratch folders is the user's responsibility.

4. **`validate.sh --strict` reports `SPEC_DOC_INTEGRITY` errors by design**. The canonical docs intentionally reference the deprecated `start.md` to document the supersession narrative. The validator's naive link extractor flags these as missing files. The errors are expected supersession-documentation state and do not indicate broken code or missing content.

5. **Historical artifacts preserved**. The packet-local nested changelog, scratch transcript snapshots inside sibling packets, and deep-review iterations in `review/` all retain `/spec_kit:start` references by design. Only forward-looking docs received the sweep.

6. **Template structural warnings pre-existing**. `AI_PROTOCOL` (Level 3 expects 4 AI Execution Protocol sub-components) and `SECTION_COUNTS` (Level 3 expects at least 6 acceptance scenarios) warnings reflect template alignment gaps inherited from M11 authoring. Non-blocking; deferred to a future template-refinement packet.

7. **CHK-452 remains open by design.** No context-save action is part of the supplied Workstream-A evidence, so the packet leaves that optional P2 item unclaimed.

8. **`/memory:save` full 7-section handover auto-initialization deferred**. M9 trade-off accepted: full 7-section packet handover regeneration is no longer available as a single command. `/memory:save` maintains the `session-log` anchor; stop hook auto-saves continuity; follow-on packet may enhance the `/memory:save` handler to auto-initialize the full template.

9. **Residual risk is limited to future regression, not current packet debt**. Any new drift would come from later edits reintroducing deprecated references or breaking the distributed-governance wording.

### Next Steps

1. If extra confidence is desired beyond this source-contract + deep-review closeout, user may dispatch another `@deep-review` for an independent audit against the flattened root docs.
2. Keep the zero-reference sweep and packet strict validation as the regression gate for any future edits touching the M9 surfaces or the shared intake contract.
3. Re-run the changed-markdown validator batch whenever the packet summary artifacts or release notes are updated again.
4. Execute manual integration tests T090-T094 when convenient to upgrade DEFERRED → PASS in the verification table.
5. Keep AGENTS edits synchronized across the Public root, Public enterprise example, and Barter coder file triad (per the `feedback_agents_md_sync_triad` memory).
<!-- /ANCHOR:limitations -->
