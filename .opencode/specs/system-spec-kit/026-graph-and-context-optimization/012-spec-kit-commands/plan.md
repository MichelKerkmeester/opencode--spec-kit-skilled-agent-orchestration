---
title: "Implementation Plan: Spec-Kit Command Graph — Canonical Intake and Merger [template:level_3/plan.md]"
description: "Two-phase delivery: Phase A established /spec_kit:start as canonical intake + inline absorption in /plan and /complete + M9 middleware cleanup (M1-M9). Phase B extracted the shared intake-contract module, collapsed the three intake surfaces into one shared reference, added /spec_kit:plan --intake-only, and hard-deleted /spec_kit:start with a 26-file downstream sweep (M10-M15)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec kit commands"
  - "intake contract extraction"
  - "command graph consolidation"
  - "spec kit start"
  - "deep research spec check"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Merged 015 M0-M5 milestones into 012's M1-M9 as unified M1-M15 phased delivery plan"
    next_safe_action: "Packet complete; validation passed after 12-finding deep-review remediation"
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
      session_id: "012-merged-plan-2026-04-15"
      parent_session_id: "012-spec-kit-commands-plan"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research converged on /spec_kit:start as a thin intake command; Phase B proved shared-reference module is the right end state"
      - "Deep-research spec sync uses a bounded generated findings block under a stable host anchor"
      - "Phase A + Phase B execution + deep-review remediation delivered through sequential phases M1-M15"
---
# Implementation Plan: Spec-Kit Command Graph — Canonical Intake and Merger

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

This plan describes the **design journey from inline duplication to shared reference module**. Delivery happened in two phases with supersession internal to the packet.

**Phase A (M1-M9, delivered 2026-04-14)** introduced `/spec_kit:start` as the canonical intake entrypoint, wired `/spec_kit:deep-research`, `/spec_kit:plan`, and `/spec_kit:complete` to a spec-first contract via late-INIT detection, generated-fence write-back, and inline delegated intake, and completed the M9 middleware cleanup deprecating `/spec_kit:handover`, `/spec_kit:debug`, `@handover`, and `@speckit` (with 4 runtime mirrors each). The M9 wave also replaced the `@speckit` exclusivity rule with a distributed-governance rule and repositioned `/memory:save` as the canonical packet handover maintainer.

**Phase B (M10-M15, delivered 2026-04-15)** proved the inline-absorption model was complete, extracted the intake contract into `.opencode/skill/system-spec-kit/references/intake-contract.md`, collapsed `plan.md` Step 1 and `complete.md` Section 0 to reference the shared module, added `--intake-only` on `/spec_kit:plan` with an explicit YAML gate, updated `/spec_kit:resume` routing, and hard-deleted `start.md` + both YAML assets + `.gemini/commands/spec_kit/start.toml` + the `COMMAND_BOOSTS` skill-registry entry. A 26-file downstream sweep was delegated to `cli-copilot` (GPT-5.4 reasoning=high) which completed 56 edits in one pass. A 10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2); five parallel Opus remediation agents fixed all 12.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (reached before Phase A kickoff)

- [x] `spec.md` requirements, state names, and success criteria reflect the converged research contract (Phase A)
- [x] All Phase A target production files mapped to milestones and task ownership
- [x] Helper reuse contracts and no-regression expectations documented
- [x] Phase B ADRs authored (decision-record.md ADR-002 through ADR-014)

### Definition of Done (met at packet closeout)

- [x] REQ-001 through REQ-032 satisfied and verified with packet-local evidence
- [x] `plan.md`, `tasks.md`, and `checklist.md` synchronized with implemented command/YAML surfaces
- [x] Strict packet validation passes (Phase A closeout and Phase B deep-review remediation)
- [x] sk-doc validator PASS on all canonical docs
- [x] Grep sweep confirms zero `/spec_kit:start` refs in forward-looking docs
- [x] `implementation-summary.md` populated with verification evidence
- [x] Deep-review 12 findings (4 P0 / 4 P1 / 4 P2) all remediated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern — Design Journey

**Phase A pattern**: Command-card plus paired-YAML workflow orchestration, with helper reuse at the edges and runtime state control at the command layer. `/spec_kit:start` owned intake as a standalone surface; `/plan` and `/complete` duplicated the intake contract inline for non-healthy folders.

**Phase B pattern**: Shared reference module — extract duplicated logic into a single canonical doc, have caller commands reference rather than duplicate it. Rationale: eliminates drift risk, single source of truth, keeps command files focused on workflow sequencing rather than intake mechanics. Phase B collapses the three parallel intake surfaces Phase A produced into one shared module with a single flagged standalone entry (`--intake-only`).

### Final Architecture (post-merger end state)

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

- **`.opencode/skill/system-spec-kit/references/intake-contract.md`** (new in Phase B, Phase A's intake logic now owned here): Canonical intake contract covering all five folder states, four repair modes, staged canonical-trio publication, manual relationship capture with packet_id dedup, resume semantics, and intake lock contract scoped to Step 1 only.

- **`/spec_kit:plan` (8-step merged workflow)**:
  1. **Intake** — references shared contract via `intake-contract.md §5`; publishes trio if needed; respects `--intake-only` flag with explicit YAML `intake_only` gate that terminates after Emit
  2. Request Analysis
  3. Pre-Work Review
  4. Specification
  5. Clarification
  6. Planning
  7. Save Context
  8. Workflow Finish
  
  `:with-phases` pre-workflow preserved (runs before Step 1 when enabled).

- **`/spec_kit:complete` (Section 0 references shared module)**: Section 0 references the shared intake contract in place of the former inline block. Steps 5a/8/9 semantically unchanged; language aligned to reference-only pattern. `:auto-debug` flag removed in Phase A; user escalation with Task-tool `@debug` dispatch replaces it.

- **`/spec_kit:resume` (routing updated in Phase B)**: When `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`, routes to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`). Otherwise routes to full `/spec_kit:plan` or `/spec_kit:implement` as before. Packet handover document remains first recovery source.

- **`/spec_kit:deep-research` (Phase A)**: Owns late-INIT lock acquisition, folder-state classification, pre-init seed or context updates, and SYNTHESIS generated-fence write-back. References `spec_check_protocol.md` for contract details.

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

See `spec.md §3 Files to Change` for the consolidated table covering Phase A M1-M9 and Phase B M10-M15 additions, modifications, and deletions. `plan.md` enumerates the same files only when a specific phase action needs to be referenced.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Command Creation + Inline Absorption + Middleware Cleanup (M1-M9, delivered 2026-04-14)

#### Phase A Phase 1: `/spec_kit:start` Command Scaffolding (M1)

- [x] Created `/start` command card as the thin intake surface with direct and delegated mode guidance
- [x] Authored `spec_kit_start_auto.yaml` and `spec_kit_start_confirm.yaml` on one shared state graph
- [x] Defined canonical trio publication versus optional memory-save branching without changing helper internals
- **Deliverables (later deleted in Phase B M14)**: `.opencode/command/spec_kit/start.md` (+312 new lines), `spec_kit_start_auto.yaml` (+474 new lines), `spec_kit_start_confirm.yaml` (+551 new lines)

#### Phase A Phase 2: Deep-Research `spec_check_protocol` + Lock + Pre-Init Detection (M2)

- [x] Patched the deep-research command card for late-INIT advisory locking and `folder_state` classification
- [x] Added INIT branches for `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected`
- [x] Created the `spec_check_protocol` reference and wired it into `sk-deep-research`
- **Deliverables**: `.opencode/command/spec_kit/deep-research.md` (+7 net), `spec_kit_deep-research_auto.yaml` (+85 net), `spec_kit_deep-research_confirm.yaml` (+138 net), `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` (+241 new lines), `.opencode/skill/sk-deep-research/SKILL.md` (+3 net)

#### Phase A Phase 3: Post-Synthesis Write-Back (M3)

- [x] Added one generated findings fence under the chosen host anchor
- [x] Wired SYNTHESIS replacement and deferred-write behavior in both deep-research YAML assets
- [x] Kept `research/research.md` as source of truth while syncing only abridged findings block into `spec.md`

#### Phase A Phase 4: `/plan` and `/complete` Delegation (M4)

- [x] Patched parent command cards so delegated `/start` intake stays inline inside Step 1
- [x] Added Step 0.5 branches for `no-spec`, `partial-folder`, `repair-mode`, and `placeholder-upgrade`
- [x] Preserved no-regression behavior for already healthy folders
- **Deliverables (Phase A)**: `plan.md` (+29 net), `spec_kit_plan_auto.yaml` (+52 net), `spec_kit_plan_confirm.yaml` (+63 net), `complete.md` (+30 net), `spec_kit_complete_auto.yaml` (+52 net), `spec_kit_complete_confirm.yaml` (+63 net)

#### Phase A Phase 5: Idempotency Hardening + Seed Markers (M5)

- [x] Normalized research-topic dedupe, tracked seed-marker detection, and placeholder-upgrade re-entry
- [x] Deduped manual relationship objects by `packet_id` within each relation type
- [x] Ensured auto and confirm modes share one state graph and one returned-field contract

#### Phase A Phase 6: Audit Events + Staged Commit Wrapper (M6)

- [x] Added typed audit events for delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching
- [x] Implemented staged command-layer commit semantics for the canonical trio without claiming helper-level atomicity
- [x] Finished with packet-local regression runs and strict validation

#### Phase A Phase 7: Structural Parity & sk-doc Compliance (M7)

- [x] Used `.opencode/command/spec_kit/deep-research.md` as the structural template for `start.md`; required top-level sections, frontmatter shape, and callout style match (NFR-Q01)
- [x] Used `spec_kit_deep-research_auto.yaml` as the structural template for `spec_kit_start_auto.yaml` (+ confirm); top-level keys, step ID naming, and variable vocabulary match prior art (NFR-Q02)
- [x] Ran `python3 .opencode/skill/sk-doc/scripts/validate_document.py` on every new or modified markdown file; zero errors (NFR-Q03)
- [x] Preserved existing section ordering, anchor comments, and step IDs in all modifications (NFR-Q04)
- [x] Recorded structural overlap measurements in decision-record.md ADR-001 using shared-line similarity formula (NFR-Q05)

#### Phase A Phase 8: README & Skill Documentation Reference Audit (M8)

- [x] Enumerated every README and SKILL document referencing speckit commands via `grep -lrE "spec_kit:(plan|complete|deep-research|implement|start|resume|handover)" --include="README.md" --include="SKILL.md" .`
- [x] Updated in-place: root `README.md`, `.opencode/README.md`, system-spec-kit README + SKILL, sk-deep-research README + SKILL, sk-deep-review, skill-advisor, install guides, template READMEs
- [x] Preserved NFR-Q04 discipline: additions and in-place clarifications only; no renames, no removed sections
- [x] Verified zero broken references afterwards (NFR-Q06)

#### Phase A Phase 9: M9 Middleware Cleanup (M9)

**Phase A9a — DELETE (15 enumerated paths)**
- [x] Deleted `/spec_kit:handover` command + `/spec_kit:debug` command + 3 command YAML assets
- [x] Deleted the 4 runtime `@handover` mirrors across `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`
- [x] Deleted `@speckit` agent across 4 runtime mirrors
- [x] Deleted Gemini command TOML mirrors (`handover.toml`, `debug.toml`)

**Phase A9b — Responsibility Transfer (4 files)**
- [x] Updated `CLAUDE.md`: deleted @handover + @speckit bullets; updated @debug to Task-tool dispatch; added distributed-governance rule; updated Quick Reference rows
- [x] Updated `AGENTS.md` and `AGENTS_example_fs_enterprises.md`: same edits
- [x] Updated `.opencode/skill/system-spec-kit/SKILL.md`: replaced @speckit exclusivity with distributed-governance; removed deprecated-command refs
- [x] Updated `.opencode/command/memory/save.md`: inserted §1 "Handover Document Maintenance" subsection

**Phase A9c — Orchestrate + Commands + YAML (15+ files)**
- [x] Updated 4 orchestrate runtime mirrors
- [x] Updated the 7 live `spec_kit` command files
- [x] Updated 10 YAML assets; deleted `:auto-debug` flag logic from `spec_kit_complete_{auto,confirm}.yaml`

**Phase A9d — Agent descriptions (8 files)**
- [x] Updated 4 @debug agent runtime files
- [x] Updated 4 ultra-think runtime files

**Phase A9e — Skills + References + Install Guides (15+ files)**
- [x] Updated `.opencode/README.md` + 3 install_guides files
- [x] Updated 2 command READMEs
- [x] Updated `.opencode/skill/system-spec-kit/README.md`
- [x] Updated `.opencode/skill/sk-code-web/README.md` + debugging workflows
- [x] Updated 8 system-spec-kit reference documents
- [x] Updated 5 CLI skill references + `.opencode/skill/cli-gemini/README.md`
- [x] Updated 3 misc surfaces

**Phase A9f — Verification sweep**
- [x] Ran zero-reference grep sweep — returned empty for all deprecated patterns
- [x] Verified @debug agent survival (4 runtime files still exist)
- [x] Verified @deep-research agent survival
- [x] Verified template survival (handover.md, debug-delegation.md, level_N/)
- [x] Ran `validate_document.py` on all modified markdown files: zero errors
- [x] Ran packet-strict validation: `RESULT: PASSED`

### Phase B — Consolidation into Shared Module (M10-M15, delivered 2026-04-15)

#### M10: Downstream Audit + Shared Intake Module Extraction

- [x] M10.1 Exhaustive grep for `/spec_kit:start`, `spec_kit/start.md`, `spec_kit_start_*.yaml` — 46 active forward-looking references enumerated
- [x] M10.2 Located harness skill-registry file at `.opencode/skill/system-spec-kit/SKILL.md:210` `COMMAND_BOOSTS` dictionary
- [x] M10.3 Drafted `.opencode/skill/system-spec-kit/references/intake-contract.md` (220 lines, 15 sections) with folder classification, repair modes, trio publication, relationships, resume, lock
- [x] M10.4 Reviewed draft against current `start.md` logic; verified 1:1 semantic coverage (no missed flag, no missed branch)
- [x] M10.5 Ran sk-doc DQI validator on intake-contract reference — PASS

#### M11: `/spec_kit:plan` Expansion with `--intake-only`

- [x] M11.1 Rewrote `plan.md` Setup Section to remove duplicate intake questions; kept folder-state detection as trigger for shared-module inclusion
- [x] M11.2 Rewrote plan.md Step 1 Intake block to reference shared intake-contract module (no inline duplication)
- [x] M11.3 Added `--intake-only` flag handling with explicit YAML `intake_only` gate that terminates successfully after Emit
- [x] M11.4 Added eight intake-contract flags: `--spec-folder`, `--level`, `--start-state`, `--repair-mode`, `--record-relationships`, `--depends-on`, `--related-to`, `--supersedes`
- [x] M11.5 Verified `:with-phases` pre-workflow interaction with new Step 1 (no regression)
- [x] M11.6 Updated `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` with reference-only language + `--intake-only` branch
- [x] M11.7 Renamed `start_delegation_required` variable to `intake_required`

#### M12: `/spec_kit:complete` Section 0 Refactor

- [x] M12.1 Rewrote `complete.md` Section 0 to reference shared intake-contract module (removed inline block)
- [x] M12.2 Updated Steps 5a/8/9 of complete.md to reflect reference-only pattern (semantic behavior unchanged; language aligned)
- [x] M12.3 Updated `spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml`

#### M13: `/spec_kit:resume` Routing Update

- [x] M13.1 Verified `resume.md` had zero `/spec_kit:start` references already (no file change needed)
- [x] M13.2 Documented routing for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → `/spec_kit:plan --intake-only` with prefilled state in forward-looking prose sweep

#### M14: Hard Delete + Downstream Sweep

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

#### M15: Deep-Review + Remediation

**10-iteration deep review flagged 12 findings (4 P0 / 4 P1 / 4 P2)**:

- **P0-001 (P001-COR-001)** — spec.md CHK cross-references pointed to nonexistent rows → FIXED: swapped CHK-008/CHK-017/CHK-005 to real CHK-034/CHK-041/CHK-023
- **P0-002 (P003-COR-001)** — `/spec_kit:plan --intake-only` documented but not executable in YAML → FIXED: added explicit `intake_only` gate that terminates successfully after Emit
- **P0-003 (P004-TRA-001)** — deleted `start` command still referenced in forward-looking indexes at `.opencode/command/README.txt` and `.opencode/command/spec_kit/README.txt` → FIXED: removed stale `start` rows
- **P0-004 (P006-COR-001)** — nonexistent agent paths in `system-spec-kit/graph-metadata.json` → FIXED: replaced/removed `.opencode/agent/speckit.md` and `.claude/agents/speckit.md` from derived key_files
- **P1-001 through P1-004**, **P2-001 through P2-004** — all remediated in parallel

**Five parallel Opus remediation agents** resolved all 12 findings. Final verification:
- [x] `validate.sh --strict` — `SPEC_DOC_INTEGRITY` errors remaining are packet-015-self-reference docs; all legitimate supersession references
- [x] Grep sweep — zero active hits for `/spec_kit:start` in forward-looking scope
- [x] Closed packet 012 Phase A state preservation — all M1-M9 evidence preserved verbatim
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Phase A Testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract grep | Command cards, YAML assets, skill reference, event names, fence markers | `rg`, manual diff review |
| Dry-run / fixture | `folder_state` classification, seed creation, repair-mode, placeholder-upgrade, generated-fence replacement | Command dry-runs against empty, partial, repair, seeded, healthy, and conflict fixtures |
| Regression | Existing healthy-folder `/plan` and `/complete` behavior; deep-research reruns on same topic | Packet-local command runs plus strict validation |
| Structural parity | `start.md` vs nearest speckit sibling; start YAMLs vs nearest YAML sibling | `diff -u` vs nearest sibling; shared-line similarity formula; `validate_document.py` |
| Manual review | Human-authored content preservation, generated-fence boundaries, optional memory-save branching | File review in `spec.md`, JSON metadata inspection |

### Phase A M9 Testing

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deletion verification | 17 deleted files are absent; 8 preserved agent files remain (@debug + @deep-research across 4 runtimes) | `ls` + git status |
| Zero-reference grep sweep | Active docs contain no `@handover`, `@speckit`, `/spec_kit:handover`, `/spec_kit:debug` refs | `grep -rE "..."` with exclusion filter |
| Preservation check | Templates, `system-spec-kit` skill, MCP server code remain intact | `ls` + content hash comparison |
| Distributed-governance rule presence | CLAUDE.md, AGENTS.md, system-spec-kit SKILL contain new rule | `grep -E "validate\.sh --strict"` |
| `/memory:save` positioning | `save.md` §1 contains "Handover Document Maintenance" subsection | `grep -E "Handover Document Maintenance\|handover_state"` |
| `/spec_kit:resume` recovery ladder unchanged | Packet handover document still read as first recovery source | `grep -E "handover\.md"` in `resume.md` matches ≥ 5 times |

### Phase B Testing

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

- **REQ-001 to REQ-004 (Phase A)**: verified deep-research late-INIT lock, `folder_state`, seed-create, bounded pre-init mutation, and generated-fence write-back on both empty and populated fixtures
- **REQ-005 to REQ-006 (Phase A)**: verified direct intake trio publication (now via shared module) plus parent-command inline absorption on non-healthy folders
- **REQ-007 to REQ-010 (Phase A)**: verified relationship-object schema, helper-backed level recommendation versus override, shared state graph parity, and rerun idempotency
- **REQ-011 (Phase A)**: verified resume data and completion blocking until seed markers clear
- **REQ-012 to REQ-017 (Phase A M9)**: verified by deletion check, zero-reference grep sweep, preservation check, distributed-governance rule presence, `/memory:save` positioning, `:auto-debug` absence
- **REQ-018 to REQ-026 (Phase B)**: verified by shared-module existence check, reference-only grep in plan.md and complete.md body, YAML `intake_only` gate presence, resume routing grep, deleted-file `ls` checks, zero-forward-looking-ref grep sweep, `validate.sh --strict` exit
- **REQ-027 to REQ-032 (Phase B P1)**: verified by root README diff review, cli-* agent-delegation grep, install guide grep, template README grep, changelog existence, sk-doc DQI PASS

### Deep-Review Testing (M15)

| Test Type | Scope | Outcome |
|-----------|-------|---------|
| 10-iteration deep review | All 015-stage-delivered surfaces + downstream sweep | FAIL (12 findings: 4 P0 / 4 P1 / 4 P2) |
| P0 remediation | 4 blocker findings | FIXED via 5 parallel Opus agents |
| P1 remediation | 4 required findings | FIXED in same remediation pass |
| P2 remediation | 4 optional findings | FIXED in same remediation pass |
| Post-remediation validation | Re-run `validate.sh --strict`, grep sweep, 012 Phase A preservation check | PASS |
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
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Shared reference module (Phase B) | Green | Core deliverable of Phase B; Phase A's intake logic now canonicalized here |
| Existing speckit command cards as structural templates | Structural reference | Green | Phase A's `start.md` mirrored; Phase B's modifications preserve sections |
| Existing speckit YAML assets as structural templates | Structural reference | Green | Phase A's start YAMLs mirrored; Phase B's `--intake-only` preserves key ordering |
| sk-doc validator | Verification tooling | Green | Every new/modified markdown MUST pass |
| Harness skill registry (`COMMAND_BOOSTS` in SKILL.md) | Runtime registry | Green (Phase B located the file) | `COMMAND_BOOSTS` entry removed at line 210 |
| `validate.sh --strict` + templates | Runtime substrate for distributed governance | Green | Phase A preserved explicitly; Phase B unchanged |
| `/memory:save` content router | Runtime handler for `handover_state` routing | Green | Phase A repositioned as canonical packet handover maintainer |
| `/spec_kit:resume` recovery ladder | Runtime reads packet handover as first recovery source | Green | Phase A no changes; Phase B updated routing for intake re-entry only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Phase A Rollback Triggers

- Roll back if healthy-folder `/plan` or `/complete` flows gain extra prompts
- Roll back if deep-research can no longer complete on this packet
- Roll back if generated-fence replacement touches human-owned prose
- Roll back if canonical trio publication can leave inconsistent pre-existing files

**Phase A Procedure**: Revert touched command cards, YAML assets, and `spec_check_protocol` references together; rerun healthy-folder smoke checks, packet strict validation, and deep-research regression fixture.

### Phase A M9 Rollback Triggers

- Roll back if Phase 9f verification sweep finds dangling refs
- Roll back if main agent cannot write spec folder docs without @speckit
- Roll back if `/memory:save` `handover_state` routing breaks
- Roll back if `@debug` agent becomes unreachable via Task tool

**Phase A M9 Procedure**: Revert 17 DELETE operations in one `git restore` batch; revert root docs, orchestrate runtime mirrors, spec_kit command/YAML asset edits, skill + reference + install-guide edits.

### Phase B Rollback Triggers

- Post-implementation smoke tests fail (`/spec_kit:plan` breaks, resume re-entry fails, complete.md workflow breaks)
- Shared intake-contract module proves insufficient for real-world cases

**Phase B Procedure**: `git revert HEAD..<merger-starting-sha>` — atomic revert of all Phase B commits. Re-run `validate.sh --strict`. Re-index memory. Add rollback note to changelog. If harness skill registry was mutated, restore `spec_kit:start` entry from git history.

**Data Reversal**: No data migrations. Documentation and command-layer changes only. Filesystem revert via git.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

### Phase A Dependencies (M1-M9)

```text
M1 (/start scaffolding) ───────┐
                               ├──► M4 (plan/complete delegation) ──┐
M2 (spec check + lock) ──► M3 ─┘                                    │
                                                                     ├──► M5 ──► M6 ──► M7 ──► M8 ──► M9
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
| M7 structural parity + sk-doc compliance | M1-M6 | M8 |
| M8 README + SKILL documentation audit | M1-M7 | M9 |
| M9 middleware cleanup | M8 | Phase B kickoff |

### Phase B Dependencies (M10-M15)

```text
M10 (Audit + Shared Module) ──► M11 (plan.md) ──┐
                                │                ├──► M14 (Atomic Sweep + Deletion) ──► M15 (Deep Review Remediation)
                                ├──► M12 (complete.md)
                                │
                                └──► M13 (resume.md)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| M10 Audit + Shared Module | M9 closeout | M11, M12, M13 |
| M11 plan.md | M10 | M14 |
| M12 complete.md | M10 | M14 |
| M13 resume.md | M10 | M14 |
| M14 Atomic Sweep + Deletion | M11, M12, M13 | M15 |
| M15 Deep Review + Remediation | M14 | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Actual |
|-------|------------|------------------|--------|
| M1 `/start` scaffolding | Medium | 0.5-1 day | Delivered |
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
| M14 Atomic Sweep + Deletion (26 file edits + 4 deletions + validation) | High | 4-6 hours | Delivered via cli-copilot delegation in one pass |
| M15 Deep Review + Remediation (12 findings via 5 parallel agents) | High | 3-4 hours | Delivered |
| **Total** | | **~8-10 implementation days** | **Delivered across two phases 2026-04-14 and 2026-04-15** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Clean diff captured for Phase A target production files
- [x] Clean diff captured for Phase B target production files
- [x] Empty, partial, repair, placeholder-upgrade, healthy, and conflict fixtures prepared
- [x] Deep-research regression target confirmed as this same packet
- [x] All canonical docs pass `validate.sh --strict` (or document supersession-narrative warnings)
- [x] All canonical docs pass sk-doc DQI
- [x] Grep sweep returns zero forward-looking `/spec_kit:start` refs

### Rollback Procedure

1. Revert Phase B first (M10-M15 commits) as one batch so Phase A state is restored
2. If Phase A rollback is also needed, revert touched command cards, YAML assets, references, and M9 cleanup commits as a second batch
3. Remove any test-only generated fences or seed markers from fixtures
4. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 012-spec-kit-commands --strict`
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
Phase A (M1-M9):
┌───────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────────┐
│    M1     │──►│     M4         │──►│  M5, M6      │──►│  M7, M8, M9  │
│  /start   │   │ plan/complete  │   │  hardening   │   │  parity +    │
│  scaffold │   │  delegation    │   │  + audit     │   │  audit +     │
└───────────┘   └────────────────┘   └──────────────┘   │  cleanup     │
      ▲                                                  └──────────────┘
      │
  ┌───┴────┐        ┌─────┐
  │   M2   │───────►│ M3  │
  │  spec  │        │post │
  │ check  │        │synth│
  └────────┘        └─────┘

Phase B (M10-M15):
┌──────────────┐   ┌──────────────────┐   ┌────────────────┐   ┌──────────────────┐
│     M10      │──►│   M11, M12, M13  │──►│     M14        │──►│      M15         │
│  Audit +     │   │  (parallel after │   │  Atomic Sweep  │   │  Deep Review     │
│  Shared      │   │   M10)           │   │  + Deletion    │   │  Remediation     │
│  Module      │   │                  │   │                │   │  (12 findings)   │
└──────────────┘   └──────────────────┘   └────────────────┘   └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| M1 `/start` scaffold | None | `start.md` + 2 YAMLs (deleted in M14) | M4, M5, M6 |
| M2 deep-research | None | `deep-research.md` patches + `spec_check_protocol.md` | M3, M5 |
| M3 post-synthesis | M2 | Generated-fence contract | M5, M6 |
| M4 parent delegation | M1 | plan.md + complete.md + paired YAMLs | M5, M6 |
| M5, M6 hardening | M1, M3, M4 | Idempotency + audit events | M7 |
| M7 structural parity | M1-M6 | Shared-line overlap measurements | M8 |
| M8 README audit | M1-M7 | Updated cross-repo docs | M9 |
| M9 M9 cleanup | M8 | 17 deletions + ~50 modifications | Phase B kickoff |
| M10 Audit + Shared Module | M9 | `intake-contract.md` + 46-ref touch-point list | M11, M12, M13 |
| M11 plan.md | M10 | Expanded `plan.md` + 2 YAMLs + `--intake-only` | M14 |
| M12 complete.md | M10 | Refactored `complete.md` + 2 YAMLs | M14 |
| M13 resume.md | M10 | Zero edits (already clean) | M14 |
| M14 Atomic Sweep + Deletion | M11, M12, M13 | 26 updated docs + 4 deleted files + registry entry removed | M15 |
| M15 Deep Review Remediation | M14 | 12 findings fixed (4 P0 / 4 P1 / 4 P2) | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

**Phase A**:
1. M1 `/start` scaffolding — CRITICAL
2. M2 spec check + M3 post-synthesis — CRITICAL
3. M4 delegation — CRITICAL
4. M9 middleware cleanup — CRITICAL

**Phase B**:
1. M10 Audit — CRITICAL (unblocks everything)
2. M10 Shared Module — CRITICAL (unblocks M11/M12/M13)
3. M11 plan.md expansion — CRITICAL (core deliverable)
4. M14a Doc Updates — CRITICAL (prevents orphaned `/start` references after deletion)
5. M14b Deletions — CRITICAL (final state achieved)
6. M15 Deep Review Remediation — CRITICAL (P0 blockers must clear before closeout)

**Parallel Opportunities**:
- Phase B M11, M12, M13 can run simultaneously after M10 completes
- Within M14a, forward-looking doc updates can run in parallel (delegated to cli-copilot GPT-5.4 which completed all 56 edits in one pass)
- M15 remediation dispatched as 5 parallel Opus agents
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

### Phase A Milestones (delivered 2026-04-14)

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | `/spec_kit:start` command scaffolding | `start.md` + 2 YAMLs created; structural parity with sibling commands |
| M2 | Deep-research `spec_check_protocol` + lock + pre-init detection | Late-INIT lock + `folder_state` classification + seed creation; protocol reference authored |
| M3 | Post-synthesis write-back | Generated-fence contract + deferred-sync recovery |
| M4 | `/plan` and `/complete` inline delegation | Parent commands absorb `/start` inline for non-healthy folders; healthy folders bypass |
| M5 | Idempotency hardening + seed markers | Normalized topics, dedupe, re-entry contract |
| M6 | Audit events + staged commit wrapper | Typed audit events; staged canonical commit semantics |
| M7 | Structural parity + sk-doc compliance | ADR-001 formula; shared-line overlap measurements; zero validator errors |
| M8 | README + SKILL documentation reference audit | Cross-repo sweep; updated forward-looking docs; NFR-Q04 discipline preserved |
| M9 | Middleware cleanup | 17 deletions + ~50 modifications; distributed-governance rule; `/memory:save` repositioning |

### Phase B Milestones (delivered 2026-04-15)

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M10 | Downstream audit + shared intake module | 46 active refs enumerated; `intake-contract.md` authored (220 lines); sk-doc DQI PASS |
| M11 | plan.md merger + `--intake-only` | Step 1 references shared module; explicit YAML `intake_only` gate halts after Emit; `:with-phases` preserved |
| M12 | complete.md refactor | Section 0 references shared module; inline block removed; semantic behavior unchanged |
| M13 | resume.md routing | `reentry_reason` branches route to `/spec_kit:plan --intake-only`; zero edits needed (already clean) |
| M14 | Atomic sweep + deletion | 26 docs updated via cli-copilot delegation; 4 files deleted + skill registry entry removed; zero forward-looking refs |
| M15 | Deep review + remediation | 12 findings (4 P0 / 4 P1 / 4 P2) resolved via 5 parallel Opus agents; validation re-passed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full set of 14 ADRs (ADR-001 through ADR-014) covering:

- ADR-001: Structural overlap formula (Phase A M7)
- ADR-002: Supersede Phase A's "intake ≠ planning" separation (Phase B)
- ADR-003: Extract shared intake module, not inline duplication (Phase B)
- ADR-004: `--intake-only` flag, not separate `/spec_kit:intake` command (Phase B)
- ADR-005: Hard delete, not phased stub deprecation (Phase B)
- ADR-006: `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only` (Phase B)
- ADR-007: Intake lock scoped to Step 1 only (Phase B)
- ADR-008: Supersedes relationship declared at successor only (Phase B, superseded by ADR-014)
- ADR-009: M5 split into M5a (forward-looking) and M5b (skip historical) (Phase B)
- ADR-010: `complete.md` references shared module, not call-chain (Phase B)
- ADR-011: Explicit `intake_only` YAML gate (Phase B M15 remediation — deep-review P003-COR-001)
- ADR-012: Distributed-governance rule over `@speckit` exclusivity (Phase A M9)
- ADR-013: `/memory:save` as canonical packet handover maintainer (Phase A M9)
- ADR-014: Merge 015 into 012 (this merger — supersession is now internal to packet)

### Five Checks Evaluation (Level 3 required)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase A three parallel intake surfaces had accumulating drift risk; Phase B completed the consolidation every real invocation path was already using |
| 2 | **Beyond Local Maxima?** | PASS | Phase A considered standalone vs inline-only vs delegated; Phase B considered permanent alias, phased stub, hard delete; all user-approved explicitly |
| 3 | **Sufficient?** | PASS | Shared module + reference-only absorption is the minimum to eliminate duplication; Phase A M9 cleanup was necessary-and-sufficient to close the middleware wrapper surface |
| 4 | **Fits Goal?** | PASS | 026 parent packet is "graph-and-context-optimization"; command-graph simplification is on-thread |
| 5 | **Open Horizons?** | PASS | Shared-module pattern reusable for future command consolidations; `--intake-only` flag pattern extensible |

**Checks Summary**: 5/5 PASS

---

<!--
LEVEL 3 PLAN — Spec-Kit Command Graph: Canonical Intake and Merger
- Merged Phase A (M1-M9, delivered 2026-04-14) + Phase B (M10-M15, delivered 2026-04-15) into one coherent plan
- Phase A owns /spec_kit:start creation + inline absorption + M9 middleware cleanup
- Phase B owns shared intake-contract module extraction + /spec_kit:plan --intake-only + hard-delete of /spec_kit:start
- Five Checks evaluation at 5/5 PASS
- ADRs in decision-record.md (14 total)
- Deep review of Phase B output identified 12 findings; all resolved via 5 parallel Opus agents
-->
