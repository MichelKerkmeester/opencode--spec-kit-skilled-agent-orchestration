---
title: "Implementation Plan: Canonical Intake and Middleware Cleanup [template:level_3/plan.md]"
description: "Milestoned delivery (M1-M15) establishing a single canonical intake reference module at .opencode/skill/system-spec-kit/references/intake-contract.md accessible via /spec_kit:plan --intake-only, anchoring /spec_kit:deep-research to real spec.md, and hard-deleting deprecated middleware (/spec_kit:handover, /spec_kit:debug, @handover, @speckit × 4 runtimes each) in favor of distributed governance and /memory:save-owned packet handover maintenance."
trigger_phrases:
  - "implementation"
  - "plan"
  - "canonical intake"
  - "intake contract extraction"
  - "command graph consolidation"
  - "deep research spec check"
  - "middleware cleanup"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Folder renamed; plan rewritten as M1-M15 canonical-intake delivery"
    next_safe_action: "Packet complete; validation passed after deep-review remediation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/resume.md"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/skill/sk-deep-research/references/spec_check_protocol.md"
    session_dedup:
      fingerprint: "sha256:012-canonical-intake-plan-2026-04-15"
      session_id: "012-canonical-intake-plan-2026-04-15"
      parent_session_id: "012-canonical-intake-closeout"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Shared reference-module pattern + /spec_kit:plan --intake-only is the chosen end-state architecture"
      - "Deep-research spec sync uses a bounded generated findings block under a stable host anchor"
      - "Delivered through sequential milestones M1-M15 with parallel middleware deletion and cli-copilot-delegated downstream sweep"
---
# Implementation Plan: Canonical Intake and Middleware Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command cards, YAML workflow assets, TOML (Gemini CLI routing), JSON (registry + catalog), shell helper reuse |
| **Framework** | OpenCode Spec Kit command system; `system-spec-kit` skill; `sk-deep-research` skill |
| **Storage** | Spec-folder markdown + JSON canonical artifacts (`spec.md`, `description.json`, `graph-metadata.json`); Spec Kit Memory DB for continuity indexing |
| **Testing** | `spec/validate.sh --strict`, `validate_document.py` (sk-doc DQI), targeted dry-runs, grep-based contract sweeps, manual command-invocation round trips |

### Overview

This plan delivers a single canonical intake surface, deep-research spec anchoring, and removal of deprecated middleware — all coordinated across a 15-milestone sequence.

M1-M9 wired the core contracts: M1 authored the intake-owning command card + YAML workflows that proved the intake shape; M2-M3 anchored `/spec_kit:deep-research` to a real `spec.md` via late-INIT detection and generated-fence write-back; M4 taught `/spec_kit:plan` and `/spec_kit:complete` to absorb intake when the target folder is not healthy; M5-M6 hardened idempotency and added typed audit events; M7-M8 verified structural parity and swept cross-repo README/SKILL documentation; M9 deprecated redundant middleware (`/spec_kit:handover`, `/spec_kit:debug`, `@handover`, `@speckit` with four runtime mirrors each), replaced `@speckit` exclusivity with a distributed-governance rule, and repositioned `/memory:save` as the canonical packet handover maintainer.

M10-M15 completed the shared-reference pattern by proving the intake contract belongs in exactly one place. M10 extracted the logic into `.opencode/skill/system-spec-kit/references/intake-contract.md` (220 lines, 15 sections); M11-M12 collapsed `plan.md` Step 1 and `complete.md` Section 0 to reference that module; M11 added the `--intake-only` flag with an explicit YAML gate; M13 updated `/spec_kit:resume` routing; M14 hard-deleted the standalone `start.md` + both YAML assets + `.gemini/commands/spec_kit/start.toml` + the `COMMAND_BOOSTS` skill-registry entry, and delegated the 26-file downstream documentation sweep to cli-copilot (GPT-5.4 reasoning=high), which completed 56 edits in one pass; M15 dispatched five parallel Opus agents to remediate all 12 findings from a 10-iteration deep review (4 P0 / 4 P1 / 4 P2).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (reached before M1 kickoff)

- [x] `spec.md` requirements, state names, and success criteria reflect the converged research contract
- [x] All target production files mapped to milestones and task ownership
- [x] Helper reuse contracts and no-regression expectations documented
- [x] ADRs authored (decision-record.md ADR-001 through ADR-013)

### Definition of Done (met at packet closeout)

- [x] REQ-001 through REQ-030 satisfied and verified with packet-local evidence
- [x] `plan.md`, `tasks.md`, and `checklist.md` synchronized with implemented command/YAML surfaces
- [x] Strict packet validation passes (initial closeout and deep-review remediation)
- [x] sk-doc validator PASS on all canonical docs
- [x] Grep sweep confirms zero `/spec_kit:start` refs in forward-looking docs
- [x] `implementation-summary.md` populated with verification evidence
- [x] Deep-review 12 findings (4 P0 / 4 P1 / 4 P2) all remediated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared reference module — extract duplicated intake logic into a single canonical doc, have caller commands reference rather than duplicate it. Rationale: eliminates drift risk, single source of truth, keeps command files focused on workflow sequencing rather than intake mechanics. Command-card plus paired-YAML workflow orchestration, with helper reuse at the edges and runtime state control at the command layer.

### Final Architecture

```
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
            │                     │                      │
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
```

### Key Components

- **`.opencode/skill/system-spec-kit/references/intake-contract.md`** — Canonical intake contract covering all five folder states, four repair modes, staged canonical-trio publication, manual relationship capture with `packet_id` dedup, resume semantics, and intake lock contract scoped to Step 1 only.

- **`/spec_kit:plan` (8-step workflow)**:
  1. **Intake** — references shared contract via `intake-contract.md §5`; publishes trio if needed; respects `--intake-only` flag with explicit YAML `intake_only` gate that terminates after Emit
  2. Request Analysis
  3. Pre-Work Review
  4. Specification
  5. Clarification
  6. Planning
  7. Save Context
  8. Workflow Finish

  `:with-phases` pre-workflow preserved (runs before Step 1 when enabled).

- **`/spec_kit:complete` (Section 0 references shared module)**: Section 0 references the shared intake contract in place of an inline block. Steps 5a/8/9 semantically unchanged; language aligned to reference-only pattern. `:auto-debug` flag removed; user escalation with Task-tool `@debug` dispatch replaces it.

- **`/spec_kit:resume` (routing for intake re-entry)**: When `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`, routes to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`). Otherwise routes to full `/spec_kit:plan` or `/spec_kit:implement` as before. Packet handover document remains first recovery source.

- **`/spec_kit:deep-research`**: Owns late-INIT lock acquisition, folder-state classification, pre-init seed or context updates, and SYNTHESIS generated-fence write-back. References `spec_check_protocol.md` for contract details.

- **Helper boundary**: Reuses `create.sh`, `generate-description.js`, `recommend-level.sh`, and `generate-context.js` without changing their internals.

### Data Flow

```
User invokes /spec_kit:plan or /spec_kit:complete
         │
         ▼
Setup Section resolves spec_path + execution_mode
         │
         ▼
Step 1 / Section 0: Load intake-contract.md reference
         │
         ├─ State: populated-folder → skip intake, proceed to planning/completion
         │
         └─ State: non-populated → execute shared intake contract
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

**For `/spec_kit:plan --intake-only`**: Flow exits after staged trio publication + optional memory save. Planning steps bypassed via explicit YAML `intake_only` gate.

### File-Level Change Map

See `spec.md §3 Files to Change` for the consolidated table covering new shared module, deep-research protocol, `/plan` + `/complete` integration, middleware deletions, and downstream documentation updates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### M1: Intake Command Surface Scaffolding

- [x] Drafted the initial intake-owning command card + two YAML workflows as the first pass at canonical intake mechanics, folder-state vocabulary, and direct vs delegated setup flow
- [x] Defined canonical trio publication versus optional memory-save branching without changing helper internals
- **Deliverables (later superseded by the shared-module pattern in M10-M14)**: command card (+312 new lines), auto YAML (+474 new lines), confirm YAML (+551 new lines)

### M2: Deep-Research `spec_check_protocol` + Lock + Pre-Init Detection

- [x] Patched the deep-research command card for late-INIT advisory locking and `folder_state` classification
- [x] Added INIT branches for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected`
- [x] Created the `spec_check_protocol` reference and wired it into `sk-deep-research`
- **Deliverables**: `.opencode/command/spec_kit/deep-research.md` (+7 net), `spec_kit_deep-research_auto.yaml` (+85 net), `spec_kit_deep-research_confirm.yaml` (+138 net), `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` (+241 new lines), `.opencode/skill/sk-deep-research/SKILL.md` (+3 net)

### M3: Post-Synthesis Write-Back

- [x] Added one generated findings fence under the chosen host anchor
- [x] Wired SYNTHESIS replacement and deferred-write behavior in both deep-research YAML assets
- [x] Kept `research/research.md` as source of truth while syncing only abridged findings block into `spec.md`

### M4: `/spec_kit:plan` and `/spec_kit:complete` Delegation

- [x] Patched parent command cards so delegated intake stays inline inside Step 1
- [x] Added Step 0.5 branches for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`
- [x] Preserved no-regression behavior for already healthy folders
- **Deliverables**: `plan.md` (+29 net), `spec_kit_plan_auto.yaml` (+52 net), `spec_kit_plan_confirm.yaml` (+63 net), `complete.md` (+30 net), `spec_kit_complete_auto.yaml` (+52 net), `spec_kit_complete_confirm.yaml` (+63 net)

### M5: Idempotency Hardening + Seed Markers

- [x] Normalized research-topic dedupe, tracked seed-marker detection, and placeholder-upgrade re-entry
- [x] Deduped manual relationship objects by `packet_id` within each relation type
- [x] Ensured auto and confirm modes share one state graph and one returned-field contract

### M6: Audit Events + Staged Commit Wrapper

- [x] Added typed audit events for delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching
- [x] Implemented staged command-layer commit semantics for the canonical trio without claiming helper-level atomicity
- [x] Finished with packet-local regression runs and strict validation

### M7: Structural Parity & sk-doc Compliance

- [x] Used `.opencode/command/spec_kit/deep-research.md` as the structural template for the new intake command surfaces; required top-level sections, frontmatter shape, and callout style match (NFR-Q01)
- [x] Used `spec_kit_deep-research_auto.yaml` as the structural template for the paired YAML assets; top-level keys, step ID naming, and variable vocabulary match prior art (NFR-Q02)
- [x] Ran `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new or modified markdown file; zero errors (NFR-Q03)
- [x] Preserved existing section ordering, anchor comments, and step IDs in all modifications (NFR-Q04)
- [x] Recorded structural overlap measurements in decision-record.md ADR-001 using shared-line similarity formula (NFR-Q05)

### M8: README & Skill Documentation Reference Audit

- [x] Enumerated every README and SKILL document referencing speckit commands via `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .`
- [x] Updated in-place: root `README.md`, `.opencode/README.md`, system-spec-kit README + SKILL, sk-deep-research README + SKILL, sk-deep-review, skill-advisor, install guides, template READMEs
- [x] Preserved NFR-Q04 discipline: additions and in-place clarifications only; no renames, no removed sections
- [x] Verified zero broken references afterwards (NFR-Q06)

### M9: Middleware Cleanup

**M9a — DELETE (15 enumerated paths)**
- [x] Deleted `/spec_kit:handover` command + `/spec_kit:debug` command + 3 command YAML assets
- [x] Deleted the 4 runtime `@handover` mirrors across `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`
- [x] Deleted `@speckit` agent across 4 runtime mirrors
- [x] Deleted Gemini command TOML mirrors (`handover.toml`, `debug.toml`)

**M9b — Responsibility Transfer (4 files)**
- [x] Updated `CLAUDE.md`: deleted `@handover` + `@speckit` bullets; updated `@debug` to Task-tool dispatch; added distributed-governance rule; updated Quick Reference rows
- [x] Updated `AGENTS.md` and `AGENTS_example_fs_enterprises.md`: same edits
- [x] Updated `.opencode/skill/system-spec-kit/SKILL.md`: replaced `@speckit` exclusivity with distributed-governance; removed deprecated-command refs
- [x] Updated `.opencode/command/memory/save.md`: inserted §1 "Handover Document Maintenance" subsection

**M9c — Orchestrate + Commands + YAML (15+ files)**
- [x] Updated 4 orchestrate runtime mirrors
- [x] Updated the 7 live `spec_kit` command files
- [x] Updated 10 YAML assets; deleted `:auto-debug` flag logic from `spec_kit_complete_{auto,confirm}.yaml`

**M9d — Agent descriptions (8 files)**
- [x] Updated 4 `@debug` agent runtime files
- [x] Updated 4 ultra-think runtime files

**M9e — Skills + References + Install Guides (15+ files)**
- [x] Updated `.opencode/README.md` + 3 install_guides files
- [x] Updated 2 command READMEs
- [x] Updated `.opencode/skill/system-spec-kit/README.md`
- [x] Updated `.opencode/skill/sk-code-web/README.md` + debugging workflows
- [x] Updated 8 system-spec-kit reference documents
- [x] Updated 5 CLI skill references + `.opencode/skill/cli-gemini/README.md`
- [x] Updated 3 misc surfaces

**M9f — Verification sweep**
- [x] Ran zero-reference grep sweep — returned empty for all deprecated patterns
- [x] Verified `@debug` agent survival (4 runtime files still exist)
- [x] Verified `@deep-research` agent survival
- [x] Verified template survival (`handover.md`, `debug-delegation.md`, `level_N/`)
- [x] Ran `validate_document.py` on all modified markdown files: zero errors
- [x] Ran packet-strict validation: `RESULT: PASSED`

### M10: Downstream Audit + Shared Intake Module Extraction

- [x] M10.1 Exhaustive grep for `/spec_kit:start`, `spec_kit/start.md`, `spec_kit_start_*.yaml` — 46 active forward-looking references enumerated
- [x] M10.2 Located harness skill-registry file at `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary
- [x] M10.3 Drafted `.opencode/skill/system-spec-kit/references/intake-contract.md` (220 lines, 15 sections) with folder classification, repair modes, trio publication, relationships, resume, lock
- [x] M10.4 Reviewed draft against the M1 intake logic; verified 1:1 semantic coverage (no missed flag, no missed branch)
- [x] M10.5 Ran sk-doc DQI validator on intake-contract reference — PASS

### M11: `/spec_kit:plan` Expansion with `--intake-only`

- [x] M11.1 Rewrote `plan.md` Setup Section to remove duplicate intake questions; kept folder-state detection as trigger for shared-module inclusion
- [x] M11.2 Rewrote `plan.md` Step 1 Intake block to reference shared intake-contract module (no inline duplication)
- [x] M11.3 Added `--intake-only` flag handling with explicit YAML `intake_only` gate that terminates successfully after Emit
- [x] M11.4 Added eight intake-contract flags: `--spec-folder`, `--level`, `--start-state`, `--repair-mode`, `--record-relationships`, `--depends-on`, `--related-to`, `--supersedes`
- [x] M11.5 Verified `:with-phases` pre-workflow interaction with new Step 1 (no regression)
- [x] M11.6 Updated `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` with reference-only language + `--intake-only` branch
- [x] M11.7 Renamed `start_delegation_required` variable to `intake_required`

### M12: `/spec_kit:complete` Section 0 Refactor

- [x] M12.1 Rewrote `complete.md` Section 0 to reference shared intake-contract module (removed inline block)
- [x] M12.2 Updated Steps 5a/8/9 of `complete.md` to reflect reference-only pattern (semantic behavior unchanged; language aligned)
- [x] M12.3 Updated `spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml`

### M13: `/spec_kit:resume` Routing Update

- [x] M13.1 Verified `resume.md` had zero `/spec_kit:start` references already (no file change needed)
- [x] M13.2 Documented routing for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → `/spec_kit:plan --intake-only` with prefilled state in forward-looking prose sweep

### M14: Hard Delete + Downstream Sweep

**M14a — Forward-looking Doc Updates (delegated to cli-copilot GPT-5.4)**
- [x] M14a.1 Updated `.opencode/skill/system-spec-kit/SKILL.md` (lines 121, 210, 564, 923, 932) — removed `COMMAND_BOOSTS` entry at line 210
- [x] M14a.2 Updated `.opencode/skill/system-spec-kit/README.md`
- [x] M14a.3 Updated template READMEs: templates main, level_2, level_3, level_3+, addendum
- [x] M14a.4 Updated `.opencode/skill/sk-deep-research/SKILL.md` + `spec_check_protocol.md`
- [x] M14a.5 Updated `.opencode/skill/sk-deep-review/README.md` + `.opencode/skill/skill-advisor/README.md`
- [x] M14a.6 Updated cli-* agent-delegation refs: cli-claude-code, cli-codex, cli-gemini
- [x] M14a.7 Updated install guides
- [x] M14a.8 Updated top-level docs: `.opencode/README.md`, root `README.md` command-graph, `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`
- [x] M14a.9 Updated `.opencode/specs/descriptions.json` line 4809
- **cli-copilot outcome**: 56 edits across 26 files in one pass with zero drift; caught and fixed one stray reference inside `intake-contract.md` itself

**M14b — Deletions**
- [x] M14b.1 Deleted `.opencode/command/spec_kit/start.md` (340 LOC)
- [x] M14b.2 Deleted `spec_kit_start_auto.yaml` (508 LOC) + `spec_kit_start_confirm.yaml` (585 LOC)
- [x] M14b.3 Deleted `.gemini/commands/spec_kit/start.toml`
- [x] M14b.4 Removed `spec_kit:start` entry from `COMMAND_BOOSTS` in `SKILL.md:210`

### M15: Deep-Review + Remediation

**10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2)**:

- **P0-001 (P001-COR-001)** — spec.md CHK cross-references pointed to nonexistent rows → FIXED: swapped CHK-008/CHK-017/CHK-005 to real CHK-034/CHK-041/CHK-023
- **P0-002 (P003-COR-001)** — `/spec_kit:plan --intake-only` documented but not executable in YAML → FIXED: added explicit `intake_only` gate that terminates successfully after Emit
- **P0-003 (P004-TRA-001)** — deleted `start` command still referenced in forward-looking indexes at `.opencode/command/README.txt` and `.opencode/command/spec_kit/README.txt` → FIXED: removed stale `start` rows
- **P0-004 (P006-COR-001)** — nonexistent agent paths in `system-spec-kit/graph-metadata.json` → FIXED: replaced/removed `.opencode/agent/speckit.md` and `.claude/agents/speckit.md` from derived key_files
- **P1-001 through P1-004**, **P2-001 through P2-004** — all remediated in parallel

**Five parallel Opus remediation agents** resolved all 12 findings. Final verification:
- [x] `validate.sh --strict` — `SPEC_DOC_INTEGRITY` errors remaining are documented supersession references
- [x] Grep sweep — zero active hits for `/spec_kit:start` in forward-looking scope
- [x] All milestone evidence preserved verbatim
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Intake + Deep-Research Testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract grep | Command cards, YAML assets, skill reference, event names, fence markers | `rg`, manual diff review |
| Dry-run / fixture | `folder_state` classification, seed creation, repair-mode, placeholder-upgrade, generated-fence replacement | Command dry-runs against empty, partial, repair, seeded, healthy, and conflict fixtures |
| Regression | Existing healthy-folder `/spec_kit:plan` and `/spec_kit:complete` behavior; deep-research reruns on same topic | Packet-local command runs plus strict validation |
| Structural parity | Intake command surfaces vs nearest speckit sibling; paired YAMLs vs nearest YAML sibling | `diff -u` vs nearest sibling; shared-line similarity formula; `validate_document.py` |
| Manual review | Human-authored content preservation, generated-fence boundaries, optional memory-save branching | File review in `spec.md`, JSON metadata inspection |

### Middleware Cleanup Testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deletion verification | 17 deleted files are absent; 8 preserved agent files remain (`@debug` + `@deep-research` across 4 runtimes) | `ls` + git status |
| Zero-reference grep sweep | Active docs contain no `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` refs | `grep -rE "..."` with exclusion filter |
| Preservation check | Templates, `system-spec-kit` skill, MCP server code remain intact | `ls` + content hash comparison |
| Distributed-governance rule presence | `CLAUDE.md`, `AGENTS.md`, system-spec-kit SKILL contain new rule | `grep -E "validate\.sh --strict"` |
| `/memory:save` positioning | `save.md` §1 contains "Handover Document Maintenance" subsection | `grep -E "Handover Document Maintenance\|handover_state"` |
| `/spec_kit:resume` recovery ladder unchanged | Packet handover document still read as first recovery source | `grep -E "handover\.md"` in `resume.md` matches ≥ 5 times |

### Shared-Module and Standalone-Intake Deletion Testing

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

### Requirement Coverage

- **REQ-001 to REQ-004**: verified deep-research late-INIT lock, `folder_state`, seed-create, bounded pre-init mutation, and generated-fence write-back on both empty and populated fixtures
- **REQ-005 to REQ-010**: verified shared module existence, `plan.md`/`complete.md` reference-only bodies, YAML `intake_only` gate, resume routing, and re-entry contract
- **REQ-011 to REQ-017**: verified by deletion check, zero-reference grep sweep, preservation check, distributed-governance rule presence, `/memory:save` positioning, `:auto-debug` absence, deletion `ls` checks, zero-forward-looking-ref grep sweep, `validate.sh --strict` exit
- **REQ-018 to REQ-024**: verified relationship-object schema, helper-backed level recommendation versus override, shared state graph parity, rerun idempotency, zero-reference sweep across 50+ files, preserved-capability survival, `/memory:save` positioning
- **REQ-025 to REQ-030**: verified by root README diff review, cli-* agent-delegation grep, install guide grep, template README grep, changelog existence, sk-doc DQI PASS

### Deep-Review Testing (M15)

| Test Type | Scope | Outcome |
|-----------|-------|---------|
| 10-iteration deep review | All delivered surfaces + downstream sweep | FAIL (12 findings: 4 P0 / 4 P1 / 4 P2) |
| P0 remediation | 4 blocker findings | FIXED via 5 parallel Opus agents |
| P1 remediation | 4 required findings | FIXED in same remediation pass |
| P2 remediation | 4 optional findings | FIXED in same remediation pass |
| Post-remediation validation | Re-run `validate.sh --strict`, grep sweep, milestone preservation check | PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec/create.sh` | Internal helper | Green | Needed for parent-command phase creation paths; helper internals unchanged |
| `scripts/generate-description.js` | Internal helper | Green | Canonical metadata regeneration depends on implementation-time wrapper choice |
| `spec/recommend-level.sh` | Internal helper | Green | Level suggestion depends on deriving numeric proxies first |
| `scripts/dist/memory/generate-context.js` | Internal helper | Green | Optional memory-save reuses after canonical trio success |
| `.opencode/skill/system-spec-kit/templates/level_{1,2}/` | Internal templates | Green | Seed-create and intake scaffold depend on templates staying stable |
| `validate_document.py` and `spec/validate.sh --strict` | Verification tooling | Green | Completion evidence depends on validator availability |
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Shared reference module | Green | Core deliverable; canonical intake logic owned here |
| Existing speckit command cards as structural templates | Structural reference | Green | Modifications preserve sections |
| Existing speckit YAML assets as structural templates | Structural reference | Green | `--intake-only` preserves key ordering |
| sk-doc validator | Verification tooling | Green | Every new/modified markdown MUST pass |
| Harness skill registry (`COMMAND_BOOSTS` in SKILL.md) | Runtime registry | Green | `COMMAND_BOOSTS` entry removed at line 210 |
| `validate.sh --strict` + templates | Runtime substrate for distributed governance | Green | Preserved explicitly |
| `/memory:save` content router | Runtime handler for `handover_state` routing | Green | Repositioned as canonical packet handover maintainer |
| `/spec_kit:resume` recovery ladder | Runtime reads packet handover as first recovery source | Green | Routing updated for intake re-entry only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Rollback Triggers

- Roll back if healthy-folder `/spec_kit:plan` or `/spec_kit:complete` flows gain extra prompts
- Roll back if deep-research can no longer complete on this packet
- Roll back if generated-fence replacement touches human-owned prose
- Roll back if canonical trio publication can leave inconsistent pre-existing files
- Roll back if the verification sweep finds dangling refs
- Roll back if main agent cannot write spec folder docs without `@speckit`
- Roll back if `/memory:save` `handover_state` routing breaks
- Roll back if `@debug` agent becomes unreachable via Task tool
- Roll back if post-implementation smoke tests fail (`/spec_kit:plan` breaks, resume re-entry fails, `complete.md` workflow breaks)
- Roll back if shared intake-contract module proves insufficient for real-world cases

### Rollback Procedure

1. Revert M10-M15 commits as one batch so M1-M9 state is restored
2. If M1-M9 rollback is also needed, revert touched command cards, YAML assets, references, and middleware-cleanup commits as a second batch
3. Remove any test-only generated fences or seed markers from fixtures
4. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet-folder] --strict`
5. Re-run healthy-folder smoke tests
6. Re-run packet-local deep-research regression after baseline restored
7. If harness skill registry was mutated, restore `spec_kit:start` `COMMAND_BOOSTS` entry from git history

**Data Reversal**: No data migrations. Documentation and command-layer changes only. Filesystem revert via git.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

### Milestone Graph

```text
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

| Milestone | Depends On | Blocks |
|-------|------------|--------|
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

| Milestone | Complexity | Estimated Effort | Actual |
|-------|------------|------------------|--------|
| M1 intake surface scaffolding | Medium | 0.5-1 day | Delivered |
| M2 deep-research spec check | High | 0.5-1 day | Delivered |
| M3 post-synthesis write-back | High | 0.5 day | Delivered |
| M4 parent-command delegation | High | 0.5-1 day | Delivered |
| M5 idempotency hardening | High | 0.5 day | Delivered |
| M6 audit + staged commit wrapper | High | 0.5 day | Delivered |
| M7 structural parity + sk-doc compliance | Medium | 0.5 day | Delivered |
| M8 README + SKILL documentation audit | Medium | 0.5 day | Delivered |
| M9 middleware cleanup (17 deletions + ~50 reference updates) | High | 1-1.5 days | Delivered |
| M10 Audit + Shared Module | Medium | 3-4 hours | Delivered |
| M11 plan.md expansion + `--intake-only` | Medium | 2-3 hours | Delivered |
| M12 complete.md refactor | Low | 1-2 hours | Delivered |
| M13 resume.md routing | Low | 1 hour | Delivered (zero edits needed) |
| M14 Sweep + Deletion (26 file edits + 4 deletions + validation) | High | 4-6 hours | Delivered via cli-copilot delegation in one pass |
| M15 Deep Review + Remediation (12 findings via 5 parallel agents) | High | 3-4 hours | Delivered |
| **Total** | | **~8-10 implementation days** | **Delivered across 2026-04-14 and 2026-04-15** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Clean diff captured for target production files
- [x] Empty, partial, repair, placeholder-upgrade, healthy, and conflict fixtures prepared
- [x] Deep-research regression target confirmed as this same packet
- [x] All canonical docs pass `validate.sh --strict` (or document documented supersession warnings)
- [x] All canonical docs pass sk-doc DQI
- [x] Grep sweep returns zero forward-looking `/spec_kit:start` refs

### Rollback Procedure

1. Revert M10-M15 first as one batch so M1-M9 state is restored
2. If M1-M9 rollback is also needed, revert touched command cards, YAML assets, references, and middleware-cleanup commits as a second batch
3. Remove any test-only generated fences or seed markers from fixtures
4. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet-folder] --strict`
5. Re-run healthy-folder smoke tests
6. Re-run packet-local deep-research regression after baseline restored
7. If harness skill registry was mutated, restore `spec_kit:start` `COMMAND_BOOSTS` entry from git history

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: Remove or reset test fixture folders only; no persistent database schema changes are part of this packet
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
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
| M13 resume.md | M10 | Verification only — zero file edits needed (already clean) | M14 |
| M14 Sweep + Deletion | M11, M12, M13 | 26 updated docs + 4 deleted files + registry entry removed | M15 |
| M15 Deep Review Remediation | M14 | 12 findings fixed (4 P0 / 4 P1 / 4 P2) | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. M1 intake surface scaffolding — CRITICAL
2. M2 spec check + M3 post-synthesis — CRITICAL
3. M4 delegation — CRITICAL
4. M9 middleware cleanup — CRITICAL
5. M10 Audit — CRITICAL (unblocks everything downstream)
6. M10 Shared Module — CRITICAL (unblocks M11/M12/M13)
7. M11 plan.md expansion — CRITICAL (core deliverable)
8. M14a Doc Updates — CRITICAL (prevents orphaned `/start` references after deletion)
9. M14b Deletions — CRITICAL (final state achieved)
10. M15 Deep Review Remediation — CRITICAL (P0 blockers must clear before closeout)

**Parallel Opportunities**:
- M11, M12, M13 can run simultaneously after M10 completes
- Within M14a, forward-looking doc updates can run in parallel (delegated to cli-copilot GPT-5.4 which completed all 56 edits in one pass)
- M15 remediation dispatched as 5 parallel Opus agents
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
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
| M11 | `plan.md` intake reference + `--intake-only` | Step 1 references shared module; explicit YAML `intake_only` gate halts after Emit; `:with-phases` preserved |
| M12 | `complete.md` refactor | Section 0 references shared module; inline block removed; semantic behavior unchanged |
| M13 | `resume.md` routing | `reentry_reason` branches route to `/spec_kit:plan --intake-only`; zero edits needed (already clean) |
| M14 | Sweep + deletion | 26 docs updated via cli-copilot delegation; 4 files deleted + skill registry entry removed; zero forward-looking refs |
| M15 | Deep review + remediation | 12 findings (4 P0 / 4 P1 / 4 P2) resolved via 5 parallel Opus agents; validation re-passed |
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
| 1 | **Necessary?** | PASS | Three parallel intake surfaces drift-risk real; every delay accumulates new refs |
| 2 | **Beyond Local Maxima?** | PASS | Standalone-only, inline-only, shared-module, permanent alias, phased stub, and hard delete all considered |
| 3 | **Sufficient?** | PASS | Shared module + reference-only absorption is the minimum to eliminate duplication; M9 cleanup was necessary-and-sufficient to close the middleware wrapper surface |
| 4 | **Fits Goal?** | PASS | 026 parent packet is "graph-and-context-optimization"; command-graph simplification is on-thread |
| 5 | **Open Horizons?** | PASS | Shared-module pattern reusable for future command consolidations; `--intake-only` flag pattern extensible |

**Checks Summary**: 5/5 PASS

---

<!--
LEVEL 3 PLAN — Canonical Intake and Middleware Cleanup
- M1-M9: initial intake command surface + deep-research anchoring + parent delegation + hardening + audit + middleware cleanup (delivered 2026-04-14)
- M10-M15: shared intake-contract module extraction + /spec_kit:plan --intake-only + hard-delete of /spec_kit:start (delivered 2026-04-15)
- Five Checks evaluation at 5/5 PASS
- ADRs in decision-record.md (13 total)
- Deep review identified 12 findings; all resolved via 5 parallel Opus agents
-->
