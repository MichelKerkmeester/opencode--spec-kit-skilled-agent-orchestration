---
title: "Feature Specification: sk-deep-research [skilled-agent-orchestration/028-sk-deep-research-testing-playbook/spec]"
description: "sk-deep-research ships protocol and command docs but no manual testing playbook package. This spec locks the approved greenfield implementation plan: a 19-scenario playbook across 6 categories, with no feature catalog in place yet."
trigger_phrases:
  - "sk-deep-research testing playbook"
  - "manual testing playbook"
  - "deep research playbook"
  - "greenfield playbook creation"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/028-sk-deep-research-testing-playbook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: sk-deep-research Manual Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Implement the first `manual_testing_playbook/` package for `.opencode/skill/sk-deep-research/` as a greenfield documentation package derived from the live deep-research command, skill, README, references, assets, and `.codex/agents/deep-research.toml`. The approved plan is fixed: 19 scenarios using IDs `DR-001` through `DR-019`, organized into 6 numbered categories, with explicit disclosure that no `feature_catalog/` exists yet for `sk-deep-research`.

**Key Decisions**: keep the playbook greenfield and create-first, use the integrated `sk-doc` root-guidance contract, and preserve the approved 19-scenario ordering from entry points through synthesis and guardrails.

**Critical Dependencies**: `.opencode/skill/sk-deep-research/`, `.opencode/command/spec_kit/deep-research.md`, `.codex/agents/deep-research.toml`, and the `sk-doc` testing-playbook creation guide and templates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Approved |
| **Created** | 2026-03-19 |
| **Branch** | `028-sk-deep-research-testing-playbook` |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-deep-research` documents a rich operator-visible surface: the consolidated setup prompt, spec-folder choice, `:auto` and `:confirm` modes, initialization artifacts, state-discipline rules, convergence logic, recovery behavior, pause and resume flow, progressive synthesis, memory save, and LEAF-only guardrails. None of that is captured in a reusable manual testing playbook package today.

There is also no `feature_catalog/` package for `sk-deep-research` as of 2026-03-19. The approved playbook therefore cannot rely on catalog cross-links. It must declare that absence explicitly while still creating a stable scenario inventory for implementation and future maintenance.

### Purpose
Define the exact Level 3 implementation scope for a greenfield `manual_testing_playbook/` package for `sk-deep-research`, including the approved 19-scenario file map, 6 category folders, validation workflow, and architecture decisions required to build the playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Implement a greenfield `manual_testing_playbook/` package under `.opencode/skill/sk-deep-research/`.
- Create one root playbook and 19 per-feature scenario files using stable IDs `DR-001` through `DR-019`.
- Use the 6 approved category folders:
  - `01--entry-points-and-modes`
  - `02--initialization-and-state-setup`
  - `03--iteration-execution-and-state-discipline`
  - `04--convergence-and-recovery`
  - `05--pause-resume-and-fault-tolerance`
  - `06--synthesis-save-and-guardrails`
- Require realistic orchestrator-led prompts, deterministic command sequences, evidence capture, pass or fail rules, and failure triage in every scenario file.
- State clearly that no `feature_catalog/` exists yet and that the playbook is a greenfield create effort, not an update or migration.

### Out of Scope
- Creating `.opencode/skill/sk-deep-research/feature_catalog/` in this workstream.
- Modifying `sk-deep-research`, `sk-doc`, command, agent, or validator source files.
- Turning reference-only concepts such as wave mode, segment partitioning, or alternate CLI dispatch into shipped runtime features.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/ root playbook` | Create | Root playbook with integrated review protocol, evidence rules, category summaries, and explicit no-feature-catalog disclosure |
| `01--entry-points-and-modes / DR-001` | Create | Setup prompt and topic-capture scenario |
| `01--entry-points-and-modes / DR-002` | Create | Required spec-folder-choice scenario |
| `01--entry-points-and-modes / DR-003` | Create | Autonomous-mode scenario |
| `01--entry-points-and-modes / DR-004` | Create | Confirm-mode and approval-gates scenario |
| `02--initialization-and-state-setup / DR-005` | Create | Initialization-artifact scenario |
| `02--initialization-and-state-setup / DR-006` | Create | Config-default and file-protection scenario |
| `02--initialization-and-state-setup / DR-007` | Create | Strategy-seeding and boundaries scenario |
| `03--iteration-execution-and-state-discipline / DR-008` | Create | State-first-read and focus-selection scenario |
| `03--iteration-execution-and-state-discipline / DR-009` | Create | Iteration-artifact and citation-discipline scenario |
| `03--iteration-execution-and-state-discipline / DR-010` | Create | Strategy-update and append-only JSONL scenario |
| `04--convergence-and-recovery / DR-011` | Create | Composite-convergence scenario |
| `04--convergence-and-recovery / DR-012` | Create | Stuck-recovery scenario |
| `04--convergence-and-recovery / DR-013` | Create | State-reconstruction scenario |
| `05--pause-resume-and-fault-tolerance / DR-014` | Create | Pause-sentinel scenario |
| `05--pause-resume-and-fault-tolerance / DR-015` | Create | Resume-flow scenario |
| `05--pause-resume-and-fault-tolerance / DR-016` | Create | JSONL fault-tolerance scenario |
| `06--synthesis-save-and-guardrails / DR-017` | Create | Progressive-synthesis scenario |
| `06--synthesis-save-and-guardrails / DR-018` | Create | Memory-save and `synthesis_complete` scenario |
| `06--synthesis-save-and-guardrails / DR-019` | Create | LEAF-only and live-vs-reference-only guardrail scenario |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create the greenfield playbook package at `.opencode/skill/sk-deep-research/manual_testing_playbook/` | The package contains the root playbook file, the 6 approved category folders, and all 19 planned scenario files listed in Scope |
| REQ-002 | Use the current integrated `sk-doc` testing-playbook contract | The root playbook owns review protocol, orchestration rules, evidence expectations, and category summaries; there are no canonical sidecar review files and no `snippets/` subtree |
| REQ-003 | Derive every scenario from live `sk-deep-research` sources only | Scenario content is anchored to the current command, skill, README, references, assets, and `.codex/agents/deep-research.toml`, not to deleted or missing design docs |
| REQ-004 | Handle the missing feature catalog honestly | The root playbook cross-reference section and each per-feature file explicitly note that no dedicated `feature_catalog/` exists yet for `sk-deep-research` |
| REQ-005 | Give each scenario file a full operator-facing execution contract | Every per-feature file includes frontmatter, overview, current reality, one primary 9-column test row, source anchors, evidence requirements, pass or fail rules, and failure triage |
| REQ-006 | Preserve the approved 19-scenario inventory exactly | The package uses stable IDs `DR-001` through `DR-019` across the 6 approved category folders and keeps that ordering in the root index and per-feature files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Separate live behavior from reference-only notes | Scenarios treat shipped sequential behavior as executable and label segments, wave mode, alternate CLI dispatch, and direct-mode fallback according to current docs |
| REQ-008 | Document the validator limitation honestly | The root playbook states that `validate_document.py` validates the root doc only and that per-feature files require manual link, prompt-sync, and path spot checks |
| REQ-009 | Keep runtime path references canonical for this packet | Runtime-agent references in the playbook use `.codex/agents/deep-research.toml` as the canonical runtime anchor |
| REQ-010 | Preserve greenfield create assumptions | The playbook implementation does not assume legacy playbook files to migrate, normalize, or merge |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The implementation creates a 20-file playbook package: 1 root playbook plus 19 per-feature scenario files under the 6 approved category folders.
- **SC-002**: Every scenario is traceable to at least one live `sk-deep-research` source file and includes a realistic prompt, deterministic command sequence, expected signals, evidence, pass or fail rules, and triage.
- **SC-003**: The root playbook explicitly states that no dedicated `feature_catalog/` exists for `sk-deep-research` as of 2026-03-19 and does not fabricate catalog links.
- **SC-004**: Root-doc validation and path sweeps pass, and the package documents the current non-recursive validator limitation instead of hiding it.

### Acceptance Scenarios

1. **Given** the approved package is greenfield, **when** the playbook is implemented, **then** it creates one root playbook and 19 scenario files rather than updating legacy playbook content.
2. **Given** the entry-point and initialization categories, **when** an operator follows `DR-001` through `DR-007`, **then** they can validate topic capture, spec-folder choice, execution mode, initialization artifacts, config defaults, and strategy seeding from live docs.
3. **Given** the iteration-discipline category, **when** an operator follows `DR-008` through `DR-010`, **then** they can confirm state-first reading, deterministic artifact capture, citations, and append-only JSONL updates.
4. **Given** the convergence and recovery category, **when** an operator follows `DR-011` through `DR-013`, **then** they can validate stop logic, stuck recovery, and state reconstruction without inventing undocumented behaviors.
5. **Given** the pause, resume, and fault-tolerance category, **when** an operator follows `DR-014` through `DR-016`, **then** they can verify pause handling, resume flow, and malformed-state recovery with explicit evidence expectations.
6. **Given** the synthesis, save, and guardrail category, **when** an operator follows `DR-017` through `DR-019`, **then** they can verify progressive synthesis, memory-save flow, and live-vs-reference-only boundaries while seeing that no feature catalog exists yet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/sk-deep-research/` docs and assets | Missing or stale anchors would weaken scenario truth | Anchor every scenario to current files and re-read live docs immediately before authoring |
| Dependency | `sk-doc` playbook creation guide and templates | Contract drift would create a non-standard package | Follow the shipped creation guide and root/snippet template structure exactly |
| Risk | Source docs mix live and reference-only behavior | Operators could test unshipped features as if they were live | Reserve explicit guardrail treatment for `DR-019` and label boundaries clearly |
| Risk | README points at a non-existent design spec path | Authors may copy stale references into the playbook | Treat the missing path as stale documentation and exclude it from live source anchors |
| Risk | No feature catalog exists | Traceability can become fuzzy | Make the absence explicit in root and per-feature docs and keep `DR-001` through `DR-019` stable for future catalog linkage |
| Risk | Root validator is non-recursive | Broken per-feature links or unsynced prompts may slip through | Require link sweeps, feature-count parity checks, and manual spot checks as part of playbook validation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The root playbook must let an operator locate the correct `DR-###` scenario within one category scan and one click from the root index.

### Security
- **NFR-S01**: Any scenario that mutates state, pauses the loop, or exercises recovery behavior must state its isolation expectations and captured evidence explicitly.

### Reliability
- **NFR-R01**: Every scenario must include at least one live source anchor and one concrete expected signal so future maintainers can detect drift during manual reviews.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- No feature catalog exists: the playbook must use stable `DR-001` through `DR-019` IDs and explicit "catalog not available yet" notes rather than broken links.
- Some documented behaviors are reference-only: the playbook must distinguish executable scenarios from documentation-only guidance.

### Error Scenarios
- The README references `.opencode/specs/04--agent-orchestration/028-auto-deep-research/`, but that path does not exist in the current repository; the playbook must not use it as a live validation anchor.
- Root-doc validation is not recursive; the implementation must add manual path, link, and prompt-sync sweeps for category files.
- If command, skill, and reference docs disagree during authoring, the implementation must stop and reconcile those conflicts before publishing scenario truth.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | 20 planned playbook files, 6 scenario categories, root plus per-feature contract work |
| Risk | 12/25 | No code changes, but high documentation drift risk and contract sensitivity |
| Research | 17/20 | Requires synthesis across command, skill, README, references, assets, and runtime agent docs |
| Multi-Agent | 4/15 | Operator-facing orchestration coverage only; no multi-agent implementation in this task |
| Coordination | 12/15 | Must align `sk-doc` contract, `sk-deep-research` docs, approved scenario ordering, and no-feature-catalog constraints |
| **Total** | **66/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Playbook scenarios copy stale or deleted references | H | M | Restrict anchors to live files and exclude the missing design-spec path |
| R-002 | Authors treat reference-only notes as shipped features | H | M | Add explicit live-vs-reference-only guidance in `DR-019` and the root guide |
| R-003 | Missing feature catalog causes ad hoc IDs or broken links | M | H | Freeze stable `DR-001` through `DR-019` IDs and add explicit "no catalog yet" language |
| R-004 | Non-recursive validation misses per-feature mistakes | M | M | Add manual sweeps for links, prompts, feature counts, and category file presence |

---

## 11. USER STORIES

### US-001: Create the first reusable playbook package (Priority: P0)

**As a** skill maintainer, **I want** a greenfield manual testing playbook for `sk-deep-research`, **so that** operator-visible behavior can be validated consistently before future changes ship.

**Acceptance Criteria**:
1. Given the current repository state, when the playbook is authored, then it creates a new `manual_testing_playbook/` package rather than updating a legacy one.
2. Given the `sk-doc` contract, when the package is reviewed, then the root doc owns global policy and per-feature files own execution truth.

---

### US-002: Validate the deep-research loop as an operator would use it (Priority: P0)

**As an** operator, **I want** the approved `DR-001` through `DR-019` scenario set across the 6 named categories, **so that** I can run realistic prompts and grade the skill with repeatable evidence.

**Acceptance Criteria**:
1. Given an operator-facing scenario, when the tester opens a per-feature file, then the file provides the exact prompt, command sequence, expected signals, evidence requirements, and pass or fail rules.
2. Given the root playbook, when the tester scans the category summaries, then they can find the correct scenario without reading source docs first.

---

### US-003: Preserve honesty about current repository limits (Priority: P1)

**As a** future maintainer, **I want** the playbook to document the missing feature catalog, the non-recursive validator, and the reference-only boundaries, **so that** the package stays truthful and maintainable.

**Acceptance Criteria**:
1. Given the root playbook cross-reference section, when the maintainer checks for catalog links, then it explicitly states that no dedicated feature catalog exists yet.
2. Given `DR-019`, when the maintainer reads reference-only features, then they are clearly marked as documentation-only or non-executable where appropriate.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should a future `feature_catalog/` reuse the playbook feature IDs directly, or should the catalog introduce its own ID namespace and crosswalk table?
- If direct-mode fallback becomes executable in a later iteration of the runtime, should it remain grouped with `DR-019` or move into convergence and recovery as a live scenario?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
- Aligned to the approved 19-scenario implementation plan
- Greenfield playbook implementation is in scope
-->
