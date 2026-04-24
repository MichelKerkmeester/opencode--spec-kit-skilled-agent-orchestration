---
title: "Implementation Plan [system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/plan]"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
description: "Unified implementation plan: Workstream A delivers lean AGENTS execution guardrails under Critical Rules across three files; Workstream B delivers the shared intake-contract.md module plus /spec_kit:plan --intake-only and deep-research spec anchoring; Workstream C hard-deletes /spec_kit:handover + /spec_kit:debug + @handover + @speckit middleware with distributed-governance replacement. M1-M15 milestone delivery preserved; AGENTS pass runs in parallel during M9."
trigger_phrases:
  - "plan"
  - "implementation"
  - "canonical intake"
  - "agent execution guardrails"
  - "intake contract extraction"
  - "command graph consolidation"
  - "middleware cleanup"
  - "deep research spec check"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands"
    last_updated_at: "2026-04-24T17:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged two-phase plans into single Level 3 plan with A/B/C workstream framing"
    next_safe_action: "Packet is complete; use as historical plan reference"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:004-agent-governance-plan-merge-2026-04-24"
      session_id: "004-agent-governance-plan-merge-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All three workstreams complete; plan preserved as authoritative record"
      - "AGENTS guardrail work tracked as Workstream A (parallel to M9 middleware cleanup)"
      - "M1-M15 milestone sequence preserved for audit continuity"
---
# Implementation Plan: Agent Governance And Commands

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction files (AGENTS), Markdown command cards, YAML workflow assets, TOML (Gemini CLI routing), JSON (registry + catalog), shell helper reuse |
| **Framework** | OpenCode Spec Kit command system; `system-spec-kit` skill; `sk-deep-research` skill; cross-repo AGENTS instruction surface |
| **Storage** | Repo-local markdown (Public + Barter workspaces); spec-folder markdown + JSON canonical artifacts; Spec Kit Memory DB for continuity indexing |
| **Testing** | `spec/validate.sh --strict`; `validate_document.py` (sk-doc DQI); targeted dry-runs; grep-based contract sweeps; direct file evidence for AGENTS guardrails; manual command-invocation round trips |

### Overview

This plan delivers three coordinated surgery passes in one packet. Workstream A is the AGENTS execution-guardrail update; Workstreams B and C are the canonical-intake architecture and middleware cleanup. All three ran under 026's command-graph-simplification theme and close together.

**Workstream A — AGENTS guardrails** (Level 2 scope). The shape of the work is narrow: review the three AGENTS files directly; identify the smallest instruction blocks that carry the requested behaviors; keep request-analysis guidance inside `## 1. CRITICAL RULES` as `### Request Analysis & Execution`; delete the old standalone request-analysis top-level section; strip duplicate scaffolding from the moved block so only `Flow` plus `#### Execution Behavior` remain; keep later headings renumbered as `## 5 / ## 6 / ## 7`; preserve hard blockers and anti-permission semantics; verify all eight guardrails land parallel. This work ran in the same window as Workstream C's root-docs sweep but on different markdown surfaces.

**Workstreams B + C — Canonical intake + middleware cleanup** (Level 3 scope). Delivered through fifteen milestones: M1-M9 wired the core contracts (initial intake surface → deep-research anchoring → parent-command delegation → hardening → structural parity → cross-repo audit → middleware cleanup). M10-M15 completed the shared-reference pattern (extracted `intake-contract.md` → collapsed `plan.md` and `complete.md` to reference-only → added `--intake-only` with explicit YAML gate → updated `/spec_kit:resume` routing → hard-deleted standalone `start.md` surface → dispatched five parallel Opus agents to remediate twelve deep-review findings).

The reason A and B+C live in the same packet is that they share a governance thesis: stop relying on hidden conventions or middleware wrappers; push responsibility into explicit instruction surfaces (AGENTS) and explicit command surfaces (shared `intake-contract.md`), guarded by templates and `validate.sh --strict`. The `@speckit` exclusivity rule replaced in M9 is exactly the rule the lean AGENTS guardrails now enforce behaviorally: agents plan first, act surgically, verify with evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (reached before M1 kickoff and AGENTS pass)

- [x] `spec.md` requirements, state names, and success criteria reflect the converged research contract.
- [x] All target production files mapped to milestones and task ownership (including the three AGENTS paths).
- [x] Helper reuse contracts and no-regression expectations documented.
- [x] ADRs authored (`decision-record.md` ADR-001 through ADR-013).
- [x] The eight requested AGENTS guardrails are mapped to planned wording before edits begin.
- [x] Packet scope frozen to the three AGENTS targets + command surface touch points listed in `spec.md §3`.

### Definition of Done (met at packet closeout)

- [x] REQ-001 through REQ-030 and REQ-401 through REQ-414 satisfied and verified with packet-local evidence.
- [x] `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` synchronized.
- [x] Strict packet validation passes (initial closeout and deep-review remediation).
- [x] sk-doc validator PASS on all canonical docs.
- [x] Grep sweep confirms zero `/spec_kit:start`, `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit` refs in forward-looking docs.
- [x] All three AGENTS files contain explicit wording for the eight execution guardrails inside `### Request Analysis & Execution` under Critical Rules; the moved block contains only `Flow` plus `#### Execution Behavior`; the old standalone section is removed; later headings are renumbered.
- [x] `implementation-summary.md` populated with verification evidence.
- [x] Deep-review 12 findings (4 P0 / 4 P1 / 4 P2) all remediated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three patterns ran in parallel under one thesis:

- **Workstream A** — Research-first inspection → surgical instruction updates → evidence-based verification (eight-point guardrail matrix + structure checklist).
- **Workstreams B + C** — Shared reference module (extract duplicated intake logic into one canonical doc; callers reference, not duplicate) + command-card plus paired-YAML workflow orchestration + hard-delete-with-sweep for deprecated middleware.

### Final Architecture

```
Instruction surfaces (Workstream A)
┌────────────────────────────────────────────────────────────┐
│ AGENTS.md (Public root)                                    │
│ AGENTS_example_fs_enterprises.md (Public)                  │
│ Barter/coder/AGENTS.md                                     │
│                                                            │
│  ## 1. CRITICAL RULES                                      │
│    ├── Safety Constraints                                  │
│    ├── ### Request Analysis & Execution                    │
│    │     ├── Flow                                          │
│    │     └── #### Execution Behavior (8 bullets)           │
│    ├── ### Tools & Search                                  │
│    └── ### Quality & Anti-Patterns                         │
│  ## 2 ... ## 4                                             │
│  ## 5. AGENT ROUTING                                       │
│  ## 6. MCP CONFIGURATION                                   │
│  ## 7. SKILLS SYSTEM                                       │
└────────────────────────────────────────────────────────────┘

Command surfaces (Workstreams B + C)
┌──────────────────────────────────────────────────────────────┐
│ .opencode/skill/system-spec-kit/references/                  │
│   intake-contract.md  (shared canonical reference module)    │
│   - 5 folder states (empty/partial/repair/placeholder/pop)   │
│   - 4 repair modes (create/repair-metadata/resolve/abort)    │
│   - Staged canonical-trio publication (temp + rename)        │
│   - Manual relationships with packet_id dedup                │
│   - Resume semantics (resume_question_id, reentry_reason)    │
│   - Intake lock scoped to Step 1                             │
└──────────────────────────────────────────────────────────────┘
            ▲                     ▲                      ▲
            │ references          │ references           │ routes to
    ┌───────┴────────┐   ┌────────┴────────┐   ┌─────────┴─────────┐
    │ /spec_kit:plan │   │/spec_kit:complete│   │ /spec_kit:resume  │
    │  Step 1 Intake │   │  Section 0       │   │ reentry_reason in │
    │  + --intake-   │   │  (reference only)│   │  {incomplete-     │
    │  only flag     │   │                  │   │   interview, ...} │
    └────────────────┘   └──────────────────┘   │  → plan --intake- │
                                                │    only           │
                                                └───────────────────┘

/spec_kit:deep-research (anchored to real spec.md)
  ↓ uses
  spec_check_protocol.md reference
  (lock lifecycle, folder-state detection,
   generated-fence write-back)

DELETED (Workstream C):
  /spec_kit:handover, /spec_kit:debug, /spec_kit:start
  @handover × 4 runtimes, @speckit × 4 runtimes
```

### Key Components

**Workstream A — AGENTS surfaces**

- **Public enterprise example AGENTS file**: `AGENTS_example_fs_enterprises.md`.
- **Public root AGENTS file**: `AGENTS.md`.
- **Barter coder AGENTS file**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md`.
- **Critical Rules request-analysis block**: shared home for planning, research-first behavior, ownership, anti-permission wording, data-based reasoning, self-checks, and `CLAUDE.md` recall — now reduced to `Flow` plus `#### Execution Behavior`.
- **Eight-point guardrail matrix**: keeps all three files aligned on meaning.

**Workstreams B + C — Command surfaces**

- **`.opencode/skill/system-spec-kit/references/intake-contract.md`**: canonical intake contract (5 folder states, 4 repair modes, staged canonical-trio publication, manual relationships with `packet_id` dedup, resume semantics, intake lock scoped to Step 1).
- **`/spec_kit:plan` (8-step workflow)**:
  1. **Intake** — references shared contract via `intake-contract.md §5`; publishes trio if needed; respects `--intake-only` flag with explicit YAML `intake_only` gate that terminates after Emit.
  2. Request Analysis.
  3. Pre-Work Review.
  4. Specification.
  5. Clarification.
  6. Planning.
  7. Save Context.
  8. Workflow Finish.
  `:with-phases` pre-workflow preserved.
- **`/spec_kit:complete`**: Section 0 references the shared intake contract. Steps 5a/8/9 semantically unchanged. `:auto-debug` removed; user escalation with Task-tool `@debug` dispatch replaces it.
- **`/spec_kit:resume`**: When `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`, routes to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`). Otherwise routes as before. Packet handover document remains first recovery source.
- **`/spec_kit:deep-research`**: Late-INIT lock acquisition, folder-state classification, pre-init seed or context updates, SYNTHESIS generated-fence write-back. References `spec_check_protocol.md` for contract details.
- **Helper boundary**: reuses `create.sh`, `generate-description.js`, `recommend-level.sh`, `generate-context.js` without changing their internals.

### Data Flow — Workstream A

```
Read all three AGENTS files
  → map current wording to 8 requested guardrails
  → keep request-analysis guidance in ## 1. CRITICAL RULES
  → delete the old standalone request-analysis section
  → remove duplicate scaffolding from the moved block
  → confirm direct transition into ### Tools & Search
  → compare final wording against the guardrail matrix + heading expectations
  → validate the packet
  → record results in implementation-summary.md
```

### Data Flow — Workstreams B + C

```
User invokes /spec_kit:plan or /spec_kit:complete
         │
         ▼
Setup Section resolves spec_path + execution_mode
         │
         ▼
Step 1 / Section 0: Load intake-contract.md reference
         │
         ├─ populated-folder → skip intake, proceed to planning/completion
         │
         └─ non-populated → execute shared intake contract
                  │
                  ▼
            Folder classification (5 states)
                  │
                  ▼
            Repair-mode routing (4 branches)
                  │
                  ▼
            Consolidated Q0-Q4+ interview
                  │
                  ▼
            Staged trio publication (temp + rename)
                  │
                  ▼
            Optional memory save (if structured context exists)
                  │
                  ▼
            Return contract to caller → resume workflow
                                         (OR halt if --intake-only)
```

For `/spec_kit:plan --intake-only`: the flow exits after staged trio publication + optional memory save. Planning steps are bypassed via the explicit YAML `intake_only` gate.

### Edit Strategy

| Step | Workstream A Goal | Workstream B + C Goal | Constraint |
|------|-------------------|-----------------------|------------|
| Inspect | Understand existing wording and local section fit in all three AGENTS files | Audit current intake logic + deprecated middleware refs | No assumptions or blind edits |
| Plan | Decide where each guardrail and structural simplification should live | Decide what lives in shared module vs caller; enumerate deletions | Prefer parallel wording; single source of truth |
| Patch | Delete duplicate scaffolding; tighten guidance | Extract shared module; refactor callers to reference-only; delete middleware | Keep edits surgical and in scope |
| Verify | Map final wording, block shape, heading structure back to required outcomes | Zero-reference grep sweep + strict validation + deep review | Use direct file evidence, not recollection |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The milestones below preserve the M1-M15 sequence from the command-graph workstream verbatim. Workstream A's three-phase flow ran in a separate, narrow pass during the same 026 window and is documented here as Workstream A (Phases A1-A3).

### Workstream A (Phases A1-A3) — AGENTS execution guardrails

#### Phase A1: Setup and evidence review

- [x] Read `AGENTS_example_fs_enterprises.md` and identify the insertion point under `## 1. CRITICAL RULES`.
- [x] Read `AGENTS.md` (Public root) and identify the matching insertion point.
- [x] Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` and identify the matching insertion point.
- [x] Build an eight-point guardrail matrix plus a structure checklist for the lean block shape, section deletion, later-heading renumbering, direct transition into `### Tools & Search`, and `§4 Confidence Framework` cross-reference.

#### Phase A2: Surgical instruction updates

- [x] Update the Public enterprise example AGENTS file so the moved request-analysis block keeps only `Flow` plus `#### Execution Behavior`, the old standalone request-analysis section stays removed, later headings remain renumbered, and the `§4 Confidence Framework` reference stays correct.
- [x] Update the root Public `AGENTS.md` with the same lean structural and wording changes.
- [x] Update the Barter coder AGENTS file with the same lean structural and wording changes, adjusted only as needed for local section fit.
- [x] Re-read all three files after editing to confirm wording stays explicit, scoped, and safety-compatible.

#### Phase A3: Packet verification and closeout

- [x] Update `checklist.md` with evidence that all three files contain all eight guardrails in the moved Critical Rules subsection, that the old standalone request-analysis section is gone, and that the moved block now contains only `Flow` plus `#### Execution Behavior`.
- [x] Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet] --strict`.
- [x] Record same-session results in `implementation-summary.md`.

### Workstreams B + C (Milestones M1-M15) — Canonical intake + middleware cleanup

#### M1: Intake Command Surface Scaffolding

- [x] Drafted the initial intake-owning command card + two YAML workflows as the first pass at canonical intake mechanics, folder-state vocabulary, and direct vs delegated setup flow.
- [x] Defined canonical trio publication versus optional memory-save branching without changing helper internals.
- **Deliverables (later superseded by the shared-module pattern in M10-M14)**: command card (+312 new lines), auto YAML (+474 new lines), confirm YAML (+551 new lines).

#### M2: Deep-Research `spec_check_protocol` + Lock + Pre-Init Detection

- [x] Patched the deep-research command card for late-INIT advisory locking and `folder_state` classification.
- [x] Added INIT branches for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, `conflict-detected`.
- [x] Created `spec_check_protocol.md` (+241 new lines) and wired it into `sk-deep-research`.
- **Deliverables**: `deep-research.md` (+7 net), `spec_kit_deep-research_auto.yaml` (+85 net), `spec_kit_deep-research_confirm.yaml` (+138 net), `spec_check_protocol.md` (+241 new), `sk-deep-research/SKILL.md` (+3 net).

#### M3: Post-Synthesis Write-Back

- [x] Added one generated findings fence under the chosen host anchor.
- [x] Wired SYNTHESIS replacement and deferred-write behavior in both deep-research YAML assets.
- [x] Kept `research/research.md` as source of truth while syncing only the abridged findings block into `spec.md`.

#### M4: `/spec_kit:plan` and `/spec_kit:complete` Delegation

- [x] Patched parent command cards so delegated intake stays inline inside Step 1.
- [x] Added Step 0.5 branches for `no-spec`, `partial-folder`, `repair-mode`, `placeholder-upgrade`.
- [x] Preserved no-regression behavior for already healthy folders.
- **Deliverables**: `plan.md` (+29 net), `spec_kit_plan_auto.yaml` (+52 net), `spec_kit_plan_confirm.yaml` (+63 net), `complete.md` (+30 net), `spec_kit_complete_auto.yaml` (+52 net), `spec_kit_complete_confirm.yaml` (+63 net).

#### M5: Idempotency Hardening + Seed Markers

- [x] Normalized research-topic dedupe, tracked seed-marker detection, placeholder-upgrade re-entry.
- [x] Deduped manual relationship objects by `packet_id` within each relation type.
- [x] Ensured auto and confirm modes share one state graph and one returned-field contract.

#### M6: Audit Events + Staged Commit Wrapper

- [x] Added typed audit events for delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, optional memory-save branching.
- [x] Implemented staged command-layer commit semantics for the canonical trio without claiming helper-level atomicity.
- [x] Finished with packet-local regression runs and strict validation.

#### M7: Structural Parity & sk-doc Compliance

- [x] Used `deep-research.md` as the structural template for the new intake command surfaces (NFR-Q01).
- [x] Used `spec_kit_deep-research_auto.yaml` as the structural template for the paired YAML assets (NFR-Q02).
- [x] Ran `validate_document.py` on every new or modified markdown file; zero errors (NFR-Q03).
- [x] Preserved existing section ordering, anchor comments, and step IDs in all modifications (NFR-Q04).
- [x] Recorded structural overlap measurements in ADR-001 using the shared-line similarity formula (NFR-Q05).

#### M8: README & Skill Documentation Reference Audit

- [x] Enumerated every README and SKILL document referencing speckit commands.
- [x] Updated in-place: root `README.md`, `.opencode/README.md`, system-spec-kit README + SKILL, sk-deep-research README + SKILL, sk-deep-review, skill-advisor, install guides, template READMEs.
- [x] Preserved NFR-Q04 discipline (additions and in-place clarifications only).
- [x] Verified zero broken references afterwards (NFR-Q06).

#### M9: Middleware Cleanup

**M9a — DELETE (15 enumerated paths)**
- [x] Deleted `/spec_kit:handover` command + `/spec_kit:debug` command + 3 command YAML assets.
- [x] Deleted the 4 runtime `@handover` mirrors across `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`.
- [x] Deleted `@speckit` agent across 4 runtime mirrors.
- [x] Deleted Gemini command TOML mirrors (`handover.toml`, `debug.toml`).

**M9b — Responsibility Transfer (4 files; runs in parallel with Workstream A edits)**
- [x] Updated `CLAUDE.md`: deleted `@handover` + `@speckit` bullets; updated `@debug` to Task-tool dispatch; added distributed-governance rule; updated Quick Reference rows.
- [x] Updated `AGENTS.md` and `AGENTS_example_fs_enterprises.md`: same edits (Workstream C portion of the AGENTS file changes; the Workstream A lean block update is a separate edit in the same files).
- [x] Updated `.opencode/skill/system-spec-kit/SKILL.md`: replaced `@speckit` exclusivity with distributed-governance; removed deprecated-command refs.
- [x] Updated `.opencode/command/memory/save.md`: inserted §1 "Handover Document Maintenance" subsection.

**M9c — Orchestrate + Commands + YAML (15+ files)**
- [x] Updated 4 orchestrate runtime mirrors.
- [x] Updated the 7 live `spec_kit` command files.
- [x] Updated 10 YAML assets; deleted `:auto-debug` flag logic from `spec_kit_complete_{auto,confirm}.yaml`.

**M9d — Agent descriptions (8 files)**
- [x] Updated 4 `@debug` agent runtime files.
- [x] Updated 4 ultra-think runtime files.

**M9e — Skills + References + Install Guides (15+ files)**
- [x] Updated `.opencode/README.md` + 3 install_guides files.
- [x] Updated 2 command READMEs.
- [x] Updated `.opencode/skill/system-spec-kit/README.md`.
- [x] Updated `.opencode/skill/sk-code-web/README.md` + debugging workflows.
- [x] Updated 8 system-spec-kit reference documents.
- [x] Updated 5 CLI skill references + `.opencode/skill/cli-gemini/README.md`.
- [x] Updated 3 misc surfaces.

**M9f — Verification sweep**
- [x] Ran zero-reference grep sweep — returned empty for all deprecated patterns.
- [x] Verified `@debug` agent survival (4 runtime files still exist).
- [x] Verified `@deep-research` agent survival.
- [x] Verified template survival (`handover.md`, `debug-delegation.md`, `level_N/`).
- [x] Ran `validate_document.py` on all modified markdown files: zero errors.
- [x] Ran packet-strict validation: `RESULT: PASSED`.

#### M10: Downstream Audit + Shared Intake Module Extraction

- [x] M10.1 Exhaustive grep for `/spec_kit:start`, `spec_kit/start.md`, `spec_kit_start_*.yaml` — 46 active forward-looking references enumerated.
- [x] M10.2 Located harness skill-registry file at `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary.
- [x] M10.3 Drafted `intake-contract.md` (220 lines, 15 sections).
- [x] M10.4 Reviewed draft against M1 intake logic; verified 1:1 semantic coverage.
- [x] M10.5 Ran sk-doc DQI validator on intake-contract reference — PASS.

#### M11: `/spec_kit:plan` Expansion with `--intake-only`

- [x] M11.1 Rewrote `plan.md` Setup Section to remove duplicate intake questions.
- [x] M11.2 Rewrote `plan.md` Step 1 Intake block to reference shared intake-contract module.
- [x] M11.3 Added `--intake-only` flag handling with explicit YAML `intake_only` gate.
- [x] M11.4 Added eight intake-contract flags.
- [x] M11.5 Verified `:with-phases` pre-workflow interaction (no regression).
- [x] M11.6 Updated `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`.
- [x] M11.7 Renamed `start_delegation_required` variable to `intake_required`.

#### M12: `/spec_kit:complete` Section 0 Refactor

- [x] M12.1 Rewrote `complete.md` Section 0 to reference shared intake-contract module.
- [x] M12.2 Updated Steps 5a/8/9 to reflect reference-only pattern.
- [x] M12.3 Updated `spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml`.

#### M13: `/spec_kit:resume` Routing Update

- [x] M13.1 Verified `resume.md` had zero `/spec_kit:start` references already.
- [x] M13.2 Documented routing for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → `/spec_kit:plan --intake-only`.

#### M14: Hard Delete + Downstream Sweep

**M14a — Forward-looking Doc Updates (delegated to cli-copilot GPT-5.4)**
- [x] Updated `system-spec-kit/SKILL.md` (lines 121, 210, 564, 923, 932); removed `COMMAND_BOOSTS` entry at line 210.
- [x] Updated `system-spec-kit/README.md`.
- [x] Updated template READMEs: main, level_2, level_3, level_3+, addendum.
- [x] Updated `sk-deep-research/SKILL.md` + `spec_check_protocol.md`.
- [x] Updated `sk-deep-review/README.md` + `skill-advisor/README.md`.
- [x] Updated cli-* agent-delegation refs: cli-claude-code, cli-codex, cli-gemini.
- [x] Updated install guides.
- [x] Updated top-level docs: `.opencode/README.md`, root `README.md` command-graph, `command/README.txt`, `command/spec_kit/README.txt`.
- [x] Updated `.opencode/specs/descriptions.json` line 4809.
- **cli-copilot outcome**: 56 edits across 26 files in one pass with zero drift; caught and fixed one stray reference inside `intake-contract.md` itself.

**M14b — Deletions**
- [x] Deleted `.opencode/command/spec_kit/start.md` (340 LOC).
- [x] Deleted `spec_kit_start_auto.yaml` (508 LOC) + `spec_kit_start_confirm.yaml` (585 LOC).
- [x] Deleted `.gemini/commands/spec_kit/start.toml`.
- [x] Removed `spec_kit:start` entry from `COMMAND_BOOSTS` at `SKILL.md:210`.

#### M15: Deep-Review + Remediation

10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2); five parallel Opus remediation agents resolved all twelve:

- **P0-001 (P001-COR-001)** — `spec.md` CHK cross-references pointed to nonexistent rows → FIXED: swapped CHK-008/CHK-017/CHK-005 to real CHK-034/CHK-041/CHK-023.
- **P0-002 (P003-COR-001)** — `/spec_kit:plan --intake-only` documented but not executable in YAML → FIXED: added explicit `intake_only` gate (ADR-010).
- **P0-003 (P004-TRA-001)** — deleted `start` command still referenced in forward-looking indexes → FIXED: removed stale rows.
- **P0-004 (P006-COR-001)** — nonexistent agent paths in `system-spec-kit/graph-metadata.json` → FIXED: removed `.opencode/agent/speckit.md` and `.claude/agents/speckit.md` from derived `key_files`.
- **P1-001 through P1-004, P2-001 through P2-004** — all remediated in parallel.

Final verification:
- [x] `validate.sh --strict` — remaining `SPEC_DOC_INTEGRITY` errors are documented supersession references.
- [x] Grep sweep — zero active hits for `/spec_kit:start` in forward-looking scope.
- [x] All milestone evidence preserved verbatim.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Workstream A testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Direct content review | Confirm all three AGENTS files contain all requested guardrails in the moved Critical Rules subsection | `Read`, targeted content review |
| Lean block verification | Confirm the moved block contains only `Flow` plus `#### Execution Behavior` and transitions to `### Tools & Search` | Targeted heading and section review |
| Scope verification | Confirm changes stayed inside the three AGENTS targets plus packet docs | File list review |
| Structure verification | Confirm standalone request-analysis section was removed and later headings renumbered to `## 5`, `## 6`, `## 7` | Targeted heading review |
| Packet validation | Confirm required Level 2 docs and structure are valid | `validate.sh --strict` |
| Summary verification | Confirm `implementation-summary.md` matches actual work | Cross-read final files |

**Verification plan**: eight-row evidence map tying each requested guardrail to wording in all three AGENTS files; verify moved block under `## 1. CRITICAL RULES` as `### Request Analysis & Execution`; verify duplicate scaffolding absent; verify direct transition into `### Tools & Search`; verify later headings `## 5 / ## 6 / ## 7`; re-check anti-permission wording respects existing safety blockers; re-check planning-first wording encourages decisive execution; re-check Clarify bullet points to `§4 Confidence Framework`.

### Workstreams B + C testing — intake + deep-research

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract grep | Command cards, YAML assets, skill reference, event names, fence markers | `rg`, manual diff review |
| Dry-run / fixture | `folder_state` classification, seed creation, repair-mode, placeholder-upgrade, generated-fence replacement | Command dry-runs against empty, partial, repair, seeded, healthy, and conflict fixtures |
| Regression | Existing healthy-folder `/spec_kit:plan` and `/spec_kit:complete` behavior; deep-research reruns | Packet-local command runs plus strict validation |
| Structural parity | Intake command surfaces vs nearest speckit sibling; paired YAMLs vs nearest YAML sibling | `diff -u`; shared-line similarity formula; `validate_document.py` |
| Manual review | Human-authored content preservation, generated-fence boundaries, optional memory-save branching | File review in `spec.md`, JSON metadata inspection |

### Workstream C testing — middleware cleanup

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deletion verification | 17 deleted files absent; 8 preserved agent files remain (`@debug` + `@deep-research` × 4) | `ls` + git status |
| Zero-reference grep sweep | Active docs contain no `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` refs | `grep -rE "..."` with exclusion filter |
| Preservation check | Templates, `system-spec-kit` skill, MCP server code remain intact | `ls` + content hash comparison |
| Distributed-governance rule presence | `CLAUDE.md`, `AGENTS.md`, system-spec-kit SKILL contain new rule | `grep -E "validate\.sh --strict"` |
| `/memory:save` positioning | `save.md` §1 contains "Handover Document Maintenance" | `grep -E "Handover Document Maintenance|handover_state"` |
| `/spec_kit:resume` recovery ladder unchanged | Packet handover document still read as first recovery source | `grep -E "handover\.md"` in `resume.md` matches ≥ 5 times |

### Shared-module + standalone-intake deletion testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | All canonical docs | `validate.sh --strict` |
| Quality | All canonical docs | sk-doc DQI validator |
| Static | Repo-wide `/spec_kit:start` reference grep | `grep -r` / Grep tool |
| Integration | `/spec_kit:plan --intake-only` end-to-end | Manual invocation on scratch folder |
| Integration | `/spec_kit:plan` full workflow on empty folder | Manual invocation |
| Integration | `/spec_kit:plan` full workflow on populated folder (intake bypass) | Manual invocation |
| Integration | `/spec_kit:complete` on empty folder (inline intake via shared module) | Manual invocation |
| Integration | `/spec_kit:resume` with `reentry_reason: incomplete-interview` | Manual invocation with forced state |
| Idempotence | `/spec_kit:plan --intake-only` twice on same folder | Manual invocation |

### Requirement coverage

- **REQ-401 through REQ-414**: direct file evidence in all three AGENTS targets (eight-point matrix + structure checklist).
- **REQ-001 to REQ-004**: deep-research late-INIT lock, `folder_state`, seed-create, bounded pre-init mutation, generated-fence write-back on both empty and populated fixtures.
- **REQ-005 to REQ-010**: shared module existence, `plan.md`/`complete.md` reference-only bodies, YAML `intake_only` gate, resume routing, re-entry contract.
- **REQ-011 to REQ-017**: deletion check, zero-reference grep sweep, preservation check, distributed-governance rule presence, `/memory:save` positioning, `:auto-debug` absence, `validate.sh --strict` exit.
- **REQ-018 to REQ-024**: relationship-object schema, helper-backed level recommendation, shared state graph parity, rerun idempotency, zero-reference sweep, preserved-capability survival, `/memory:save` positioning.
- **REQ-025 to REQ-030**: root README diff review, cli-* agent-delegation grep, install guide grep, template README grep, changelog existence, sk-doc DQI PASS.

### Deep-review testing (M15)

| Test Type | Scope | Outcome |
|-----------|-------|---------|
| 10-iteration deep review | All delivered surfaces + downstream sweep | FAIL (12 findings: 4 P0 / 4 P1 / 4 P2) |
| P0 remediation | 4 blocker findings | FIXED via 5 parallel Opus agents |
| P1 remediation | 4 required findings | FIXED in same remediation pass |
| P2 remediation | 4 optional findings | FIXED in same remediation pass |
| Post-remediation validation | `validate.sh --strict`, grep sweep, milestone preservation | PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AGENTS_example_fs_enterprises.md` availability | Workspace (Public) | Green | Public enterprise guidance cannot be updated |
| `AGENTS.md` availability | Workspace (Public root) | Green | Root Public guidance cannot be updated |
| Barter coder `AGENTS.md` availability | External workspace | Green | Cross-repo parity cannot be established |
| Existing safety rules in all three AGENTS files | Policy | Green | New guardrails must fit without contradicting hard blockers |
| `spec/create.sh` | Internal helper | Green | Needed for parent-command phase creation paths |
| `scripts/generate-description.js` | Internal helper | Green | Canonical metadata regeneration |
| `spec/recommend-level.sh` | Internal helper | Green | Level suggestion |
| `scripts/dist/memory/generate-context.js` | Internal helper | Green | Optional memory-save reuse after canonical trio success |
| `.opencode/skill/system-spec-kit/templates/level_{1,2}/` | Internal templates | Green | Seed-create and intake scaffold |
| `validate_document.py` + `spec/validate.sh --strict` | Verification tooling | Green | Completion evidence |
| `intake-contract.md` | Shared reference module | Green | Core deliverable |
| Existing speckit command cards as structural templates | Structural reference | Green | Preserves sections |
| Existing speckit YAML assets as structural templates | Structural reference | Green | `--intake-only` preserves key ordering |
| sk-doc validator | Verification tooling | Green | Every new/modified markdown MUST pass |
| Harness skill registry (`COMMAND_BOOSTS`) | Runtime registry | Green | Entry removed at `SKILL.md:210` |
| `/memory:save` content router | Runtime handler | Green | Canonical packet handover maintainer |
| `/spec_kit:resume` recovery ladder | Runtime | Green | Routing updated for intake re-entry only |
| Templates + bash scripts at `scripts/spec/` | Runtime substrate for distributed governance | Green | Preserved explicitly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Rollback Triggers

- Roll back if healthy-folder `/spec_kit:plan` or `/spec_kit:complete` flows gain extra prompts.
- Roll back if deep-research can no longer complete on this packet.
- Roll back if generated-fence replacement touches human-owned prose.
- Roll back if canonical trio publication can leave inconsistent pre-existing files.
- Roll back if the verification sweep finds dangling refs.
- Roll back if main agent cannot write spec folder docs without `@speckit`.
- Roll back if `/memory:save` `handover_state` routing breaks.
- Roll back if `@debug` agent becomes unreachable via Task tool.
- Roll back if post-implementation smoke tests fail.
- Roll back if shared intake-contract module proves insufficient for real-world cases.
- Roll back Workstream A edits if an AGENTS edit weakens an existing safety rule, adds scope beyond the request, or creates wording drift between the three targets.

### Rollback Procedure

1. Revert M10-M15 commits as one batch so M1-M9 state is restored.
2. If M1-M9 rollback is also needed, revert touched command cards, YAML assets, references, and middleware-cleanup commits as a second batch.
3. For Workstream A rollback: revert the affected wording block in the target file; re-check the eight-point matrix; re-apply a smaller, more precise edit; re-run direct verification and packet validation.
4. Remove any test-only generated fences or seed markers from fixtures.
5. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet-folder] --strict`.
6. Re-run healthy-folder smoke tests.
7. Re-run packet-local deep-research regression after baseline restored.
8. If harness skill registry was mutated, restore `spec_kit:start` `COMMAND_BOOSTS` entry from git history.

**Rollback Boundaries (Workstream A)**: keep AGENTS edits localized so individual wording blocks can be reverted without disturbing unrelated policy text. Treat each AGENTS file as independently reversible, but do not close the packet until all three files are aligned again.

**Data Reversal**: No data migrations. Documentation and command-layer changes only. Filesystem revert via git.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

### Milestone + Phase Graph

```text
Workstream A:
  Read three AGENTS files
          │
          ▼
  Build eight-point guardrail matrix
          │
          ▼
  Patch Public enterprise AGENTS file  ─┐
  Patch Public root AGENTS file  ──────┼─►  Cross-file verification ─► Packet validation ─► Summary
  Patch Barter AGENTS file  ───────────┘

Workstreams B + C:
M1 (intake surface) ──────────┐
                              ├──► M4 (plan/complete delegation) ──┐
M2 (spec check + lock) ──► M3 ┘                                    │
                                                                   ├──► M5 ──► M6 ──► M7 ──► M8 ──► M9
M2 (spec protocol) ─────────────────────────────────────────────── ┘

M10 (Audit + Shared Module) ──► M11 (plan.md) ──┐
                                │                ├──► M14 (Sweep + Deletion) ──► M15 (Deep Review Remediation)
                                ├──► M12 (complete.md)
                                │
                                └──► M13 (resume.md)
```

| Phase / Milestone | Depends On | Blocks |
|-------|------------|--------|
| A1 Setup / Review | None | A2 editing |
| A2 Public enterprise AGENTS update | A1 | A3 cross-file verification |
| A2 Public root AGENTS update | A1 | A3 cross-file verification |
| A2 Barter AGENTS update | A1 | A3 cross-file verification |
| A3 Cross-file verification + packet validation + summary | All A2 | None |
| M1 intake surface | None | M4, M5, M6 |
| M2 deep-research spec check | None | M3, M5 |
| M3 post-synthesis write-back | M2 | M5, M6 |
| M4 parent-command delegation | M1 | M5, M6 |
| M5 idempotency hardening | M1, M3, M4 | M6 |
| M6 audit + staged commit wrapper | M1, M3, M4, M5 | M7 |
| M7 structural parity + sk-doc compliance | M1-M6 | M8 |
| M8 README + SKILL documentation audit | M1-M7 | M9 |
| M9 middleware cleanup | M8 | M10 |
| M10 Audit + Shared Module | M9 closeout | M11, M12, M13 |
| M11 plan.md | M10 | M14 |
| M12 complete.md | M10 | M14 |
| M13 resume.md | M10 | M14 |
| M14 Sweep + Deletion | M11, M12, M13 | M15 |
| M15 Deep Review + Remediation | M14 | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Milestone / Phase | Complexity | Estimated | Actual |
|-------|------------|-----------|--------|
| A1 Setup / Review | Medium | 20-30 minutes | Delivered |
| A2 Surgical AGENTS updates | Medium | 30-45 minutes | Delivered |
| A3 Verification / Summary | Low | 15-25 minutes | Delivered |
| M1 intake surface scaffolding | Medium | 0.5-1 day | Delivered |
| M2 deep-research spec check | High | 0.5-1 day | Delivered |
| M3 post-synthesis write-back | High | 0.5 day | Delivered |
| M4 parent-command delegation | High | 0.5-1 day | Delivered |
| M5 idempotency hardening | High | 0.5 day | Delivered |
| M6 audit + staged commit wrapper | High | 0.5 day | Delivered |
| M7 structural parity + sk-doc compliance | Medium | 0.5 day | Delivered |
| M8 README + SKILL documentation audit | Medium | 0.5 day | Delivered |
| M9 middleware cleanup (17 deletions + ~50 refs) | High | 1-1.5 days | Delivered |
| M10 Audit + Shared Module | Medium | 3-4 hours | Delivered |
| M11 plan.md expansion + `--intake-only` | Medium | 2-3 hours | Delivered |
| M12 complete.md refactor | Low | 1-2 hours | Delivered |
| M13 resume.md routing | Low | 1 hour | Delivered (zero edits needed) |
| M14 Sweep + Deletion (26 edits + 4 deletions + validation) | High | 4-6 hours | Delivered via cli-copilot delegation in one pass |
| M15 Deep Review + Remediation (12 findings via 5 parallel agents) | High | 3-4 hours | Delivered |
| **Total** | | **~8-10 implementation days** | **Delivered 2026-04-08 (A) and 2026-04-14 to 2026-04-15 (B+C)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Workstream A (parallel to M9b):
┌────────────────┐   ┌───────────────────┐   ┌─────────────────┐
│  Read 3 AGENTS │──►│ Eight-point matrix│──►│ Patch 3 AGENTS  │──┐
│     files      │   │ + structure check │   │   files         │  │
└────────────────┘   └───────────────────┘   └─────────────────┘  ▼
                                                         ┌──────────────────┐
                                                         │  Cross-file      │
                                                         │  verification +  │
                                                         │  packet validate │
                                                         └──────────────────┘

M1-M9 Core:
┌───────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────────┐
│    M1     │──►│     M4         │──►│  M5, M6      │──►│  M7, M8, M9  │
│  intake   │   │ plan/complete  │   │  hardening   │   │  parity +    │
│  surface  │   │  delegation    │   │  + audit     │   │  audit +     │
└───────────┘   └────────────────┘   └──────────────┘   │  cleanup     │
      ▲                                                  └──────────────┘
      │
  ┌───┴────┐        ┌─────┐
  │   M2   │───────►│ M3  │
  │  spec  │        │post │
  │ check  │        │synth│
  └────────┘        └─────┘

M10-M15 Consolidation:
┌──────────────┐   ┌──────────────────┐   ┌────────────────┐   ┌──────────────────┐
│     M10      │──►│   M11, M12, M13  │──►│     M14        │──►│      M15         │
│  Audit +     │   │  (parallel after │   │  Sweep +       │   │  Deep Review     │
│  Shared      │   │   M10)           │   │  Deletion      │   │  Remediation     │
│  Module      │   │                  │   │                │   │  (12 findings)   │
└──────────────┘   └──────────────────┘   └────────────────┘   └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A1-A3 AGENTS pass | None (runs parallel to M9b) | Lean Critical Rules block + renumbered headings in all three AGENTS files | Packet closeout (shares closeout gate with M15) |
| M1 intake surface scaffold | None | Initial intake command card + 2 YAMLs (later superseded in M14) | M4, M5, M6 |
| M2 deep-research | None | `deep-research.md` patches + `spec_check_protocol.md` | M3, M5 |
| M3 post-synthesis | M2 | Generated-fence contract | M5, M6 |
| M4 parent delegation | M1 | `plan.md` + `complete.md` + paired YAMLs | M5, M6 |
| M5, M6 hardening | M1, M3, M4 | Idempotency + audit events | M7 |
| M7 structural parity | M1-M6 | Shared-line overlap measurements | M8 |
| M8 README audit | M1-M7 | Updated cross-repo docs | M9 |
| M9 middleware cleanup | M8 | 17 deletions + ~50 modifications | M10 |
| M10 Audit + Shared Module | M9 | `intake-contract.md` + 46-ref touch-point list | M11, M12, M13 |
| M11 plan.md | M10 | Expanded `plan.md` + 2 YAMLs + `--intake-only` | M14 |
| M12 complete.md | M10 | Refactored `complete.md` + 2 YAMLs | M14 |
| M13 resume.md | M10 | Verification only — zero file edits | M14 |
| M14 Sweep + Deletion | M11, M12, M13 | 26 updated docs + 4 deletions + registry entry removed | M15 |
| M15 Deep Review Remediation | M14 | 12 findings fixed (4 P0 / 4 P1 / 4 P2) | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. A1 Read three AGENTS files and build eight-point matrix — CRITICAL for Workstream A.
2. A2 Patch all three AGENTS files with lean block + renumbering — CRITICAL.
3. M1 intake surface scaffolding — CRITICAL.
4. M2 spec check + M3 post-synthesis — CRITICAL.
5. M4 delegation — CRITICAL.
6. M9 middleware cleanup — CRITICAL.
7. M10 Audit — CRITICAL (unblocks everything downstream).
8. M10 Shared Module — CRITICAL (unblocks M11/M12/M13).
9. M11 plan.md expansion — CRITICAL (core deliverable).
10. M14a Doc Updates — CRITICAL (prevents orphaned `/start` references after deletion).
11. M14b Deletions — CRITICAL (final state achieved).
12. M15 Deep Review Remediation — CRITICAL (P0 blockers must clear before closeout).

**Parallel Opportunities**:
- A1-A3 (Workstream A) can run alongside M9b since the two touch `AGENTS.md` + `AGENTS_example_fs_enterprises.md` for different reasons (M9b removes `@handover`/`@speckit` bullets; A2 reshapes the `## 1. CRITICAL RULES` block). Coordinate edits on the same files to avoid merge conflicts.
- M11, M12, M13 can run simultaneously after M10 completes.
- Within M14a, forward-looking doc updates run in parallel (delegated to cli-copilot GPT-5.4 in one pass).
- M15 remediation dispatched as 5 parallel Opus agents.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone / Phase | Description | Success Criteria |
|-----------|-------------|------------------|
| A1 | Setup and evidence review of three AGENTS files | Eight-point matrix + structure checklist frozen |
| A2 | Surgical AGENTS updates | Lean `### Request Analysis & Execution` block under `## 1. CRITICAL RULES` in all three files; standalone section removed; headings renumbered |
| A3 | Packet verification and closeout (Workstream A) | Checklist evidence + `validate.sh --strict` clean |
| M1 | Intake command surface scaffolding | Initial intake command card + 2 YAMLs created; structural parity with sibling commands |
| M2 | Deep-research `spec_check_protocol` + lock + pre-init detection | Late-INIT lock + `folder_state` classification + seed creation; protocol reference authored |
| M3 | Post-synthesis write-back | Generated-fence contract + deferred-sync recovery |
| M4 | `/spec_kit:plan` and `/spec_kit:complete` inline delegation | Parent commands absorb intake inline for non-healthy folders; healthy folders bypass |
| M5 | Idempotency hardening + seed markers | Normalized topics, dedupe, re-entry contract |
| M6 | Audit events + staged commit wrapper | Typed audit events; staged canonical commit semantics |
| M7 | Structural parity + sk-doc compliance | ADR-001 formula; shared-line overlap measurements; zero validator errors |
| M8 | README + SKILL documentation reference audit | Cross-repo sweep; updated forward-looking docs; NFR-Q04 discipline preserved |
| M9 | Middleware cleanup | 17 deletions + ~50 modifications; distributed-governance rule; `/memory:save` repositioning |
| M10 | Downstream audit + shared intake module | 46 active refs enumerated; `intake-contract.md` authored (220 lines); sk-doc DQI PASS |
| M11 | `plan.md` intake reference + `--intake-only` | Step 1 references shared module; explicit YAML `intake_only` gate; `:with-phases` preserved |
| M12 | `complete.md` refactor | Section 0 references shared module; inline block removed |
| M13 | `resume.md` routing | `reentry_reason` branches route to `/spec_kit:plan --intake-only` |
| M14 | Sweep + deletion | 26 docs updated via cli-copilot; 4 files deleted + skill registry entry removed |
| M15 | Deep review + remediation | 12 findings (4 P0 / 4 P1 / 4 P2) resolved via 5 parallel Opus agents |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full set of 13 ADRs covering:

- ADR-001: Structural overlap formula (M7)
- ADR-002: Shared intake module over inline duplication
- ADR-003: Reference-only absorption (plan.md / complete.md size + cognitive overhead trade-off)
- ADR-004: `--intake-only` flag, not separate `/spec_kit:intake` command
- ADR-005: Hard delete, not phased stub deprecation
- ADR-006: Intake lock scoped to Step 1 only
- ADR-007: `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only`
- ADR-008: Forward-looking sweep only; historical records preserved
- ADR-009: `complete.md` references shared module, not call-chain into `/plan`
- ADR-010: Explicit `intake_only` YAML gate (M15 remediation)
- ADR-011: Distributed-governance rule over `@speckit` exclusivity (M9)
- ADR-012: `/memory:save` as canonical packet handover maintainer (M9)
- ADR-013: `:auto-debug` flag removal and explicit user escalation path (M9)

### Five Checks Evaluation (Level 3 required)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three parallel intake surfaces drift-risk real; AGENTS instruction weakness allowed ownership-dodging; every delay accumulated new refs |
| 2 | **Beyond Local Maxima?** | PASS | Standalone-only, inline-only, shared-module, permanent alias, phased stub, hard delete, and status-quo AGENTS wording all considered |
| 3 | **Sufficient?** | PASS | Shared module + reference-only absorption eliminates duplication; M9 cleanup closes the middleware wrapper surface; Workstream A lean block carries the eight requested behaviors without adding new scaffolding |
| 4 | **Fits Goal?** | PASS | 026 parent packet is "graph-and-context-optimization"; command-graph simplification + AGENTS execution discipline are both on-thread |
| 5 | **Open Horizons?** | PASS | Shared-module pattern reusable for future command consolidations; `--intake-only` flag pattern extensible; AGENTS eight-point matrix reusable for future instruction-surface syncs |

**Checks Summary**: 5/5 PASS

---

<!--
LEVEL 3 PLAN — Agent Governance And Commands (merged)
- Workstream A (A1-A3): three AGENTS files get lean Critical Rules block with request-analysis subsection; runs parallel to M9b.
- M1-M9: initial intake command surface + deep-research anchoring + parent delegation + hardening + audit + middleware cleanup (delivered 2026-04-14)
- M10-M15: shared intake-contract module extraction + /spec_kit:plan --intake-only + hard-delete of /spec_kit:start (delivered 2026-04-15)
- Five Checks evaluation at 5/5 PASS
- ADRs in decision-record.md (13 total)
- Deep review identified 12 findings; all resolved via 5 parallel Opus agents
-->
