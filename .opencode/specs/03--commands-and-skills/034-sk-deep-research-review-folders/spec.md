---
title: "Feature Specification: sk-deep-research Review [03--commands-and-skills/034-sk-deep-research-review-folders/spec]"
description: "Review mode currently stores durable session artifacts in scratch even though system-spec-kit defines scratch as disposable temporary workspace. This spec plans a dedicated review/ subfolder for all deep-review outputs, plus a compatibility path for legacy scratch-based review sessions."
trigger_phrases:
  - "deep review folder"
  - "review subfolder"
  - "sk-deep-research review outputs"
  - "scratch misuse"
  - "review packet contract"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: sk-deep-research Review Folder Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

`/spec_kit:deep-research:review` still writes durable session state into `scratch/` across the review auto and confirm YAML workflows, the runtime `deep-review` agents, and the review-mode contract assets. That conflicts with system-spec-kit guidance, which defines `scratch/` as disposable temporary workspace rather than a canonical home for resumable review state. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:82-88] [SOURCE: .opencode/agent/deep-review.md:31-31] [SOURCE: .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml:202-230] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:565-589]

This packet plans a dedicated `review/` subfolder inside the target spec so all review-mode outputs live together: config, JSONL state, strategy, dashboard, iteration artifacts, pause sentinel, and final report. The implementation also needs a legacy migration path because existing review sessions already persist their state under `scratch/`.

**Key Decisions**: move the full review-mode packet into `review/`, keep current review-mode filenames for this change, and migrate legacy scratch-based review state instead of stranding it.

**Critical Dependencies**: review auto and confirm YAML workflows, all four runtime `deep-review` agent definitions, `review_mode_contract.yaml`, review templates, and the review-mode docs and playbook surfaces under `sk-deep-research`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Approved |
| **Created** | 2026-03-27 |
| **Branch** | `034-sk-deep-research-review-folders` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Review mode is currently modeled as a `scratch/` workflow. The review auto YAML writes config, JSONL state, strategy, dashboard, and iteration files into `scratch/`, and the confirm YAML mirrors the same contract. The primary `deep-review` agent says it may write only `scratch/` artifacts inside the active spec folder, and the review-mode contract asset plus the deep-review strategy template both hard-code `scratch/` as the destination for durable review state. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:82-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml:83-120] [SOURCE: .opencode/agent/deep-review.md:31-65] [SOURCE: .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml:202-230] [SOURCE: .opencode/skill/sk-deep-review/assets/deep_review_strategy.md:3-19]

That contract conflicts with the repository's broader spec-folder rules. System-spec-kit defines `scratch/` as a directory for temporary, disposable files that should be cleaned up when work is done, not as the authoritative home for resumable review packets or finalized review artifacts. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:565-589] [SOURCE: .opencode/skill/system-spec-kit/references/structure/folder_structure.md:139-152]

### Purpose
Define the Level 3 implementation plan for moving all `:review` mode outputs into a dedicated `review/` subfolder under the target spec, while preserving review behavior, keeping research-mode artifact placement out of scope, allowing only the shared spec-root compatibility fixes needed by the common deep-research entrypoint, and protecting legacy scratch-based review sessions from being orphaned.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Redirect all review-mode runtime artifacts into `{spec_folder}/review/`:
  - `deep-research-config.json`
  - `deep-research-state.jsonl`
  - the deep-review strategy file
  - the deep-review dashboard file
  - review iteration files
  - `.deep-research-pause`
  - the final review report
- Update both review-mode YAML workflows to create, classify, resume, synthesize, and pause against `review/` rather than `scratch/`.
- Update all runtime `deep-review` agent definitions to match the new `review/` contract and permission wording.
- Update review-mode contract assets, templates, docs, and manual testing scenarios so every first-party surface describes the same folder layout.
- Add a compatibility path for legacy review sessions that already persisted state into `scratch/`.
- Validate that review-mode `scratch/` references are removed from the relevant review surfaces after implementation.
- Apply any directly related deep-research command-surface compatibility fixes required to keep review entrypoints reachable from either `specs/` or `.opencode/specs/`.

### Out of Scope
- Changing research-mode artifact placement or redesigning the broader deep-research `scratch/` contract for non-review flows.
- Renaming review-mode basenames from `deep-research-*` to `deep-review-*`.
- General cleanup of unrelated temporary files already living in `scratch/`.
- Adding a new review-contract generator or wider contract-rendering framework unless it becomes strictly necessary to land the path change safely.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Modify | Move review state paths, directory creation, resume, pause, synthesis, and backup logic from `scratch/` to `review/` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` | Modify | Mirror the same `review/` contract in confirm mode |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep the shared deep-research spec-folder compatibility guard aligned with the alias roots accepted by the entrypoint |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Update the review-mode artifact summary, recovery text, and shared spec-root guidance |
| `.agents/commands/spec_kit/deep-research.toml` | Modify | Keep the parallel wrapper metadata aligned with the shared deep-research command modes |
| `.opencode/agent/deep-review.md` | Modify | Update the canonical OpenCode deep-review contract to write under `review/` |
| `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.gemini/agents/deep-review.md` | Modify | Keep runtime parity with the canonical deep-review contract |
| `.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml` | Modify | Change review output path patterns and any render-target expectations that describe them |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`, `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Modify | Update review template descriptions and embedded path guidance |
| `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-research/README.md` | Modify | Update review-mode resource descriptions and user-facing behavior |
| `.opencode/skill/sk-deep-research/references/quick_reference.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Synchronize the documented review-mode state-file contract and troubleshooting guidance |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/07--review-mode/*.md` plus the shared pause/resume scenarios in `05--pause-resume-and-fault-tolerance/` | Modify | Update operator prompts and expected signals for the new review packet location |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Move the full review-mode packet into `review/` | Review auto and confirm workflows resolve config, JSONL, strategy, dashboard, iteration files, pause sentinel, and final report under `{spec_folder}/review/` |
| REQ-002 | Keep review-mode consumers in sync | `.opencode`, `.claude`, `.codex`, and `.gemini` deep-review agent definitions plus `review_mode_contract.yaml` all describe the same `review/` paths and write permissions |
| REQ-003 | Protect existing review sessions | Review-mode startup detects legacy scratch-based review state and migrates or rehomes only the review-specific artifacts before resume classification |
| REQ-004 | Restore the meaning of `scratch/` | No first-party review-mode workflow or doc instructs users to keep durable review state in `scratch/`; `scratch/` remains reserved for temporary or disposable files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep research mode out of scope | Research auto and confirm workflows plus `deep-research` agents keep their scratch-based storage contract unchanged, except for clarifying wording or shared spec-root compatibility fixes needed by the common entrypoint |
| REQ-006 | Keep the path change scope-tight | Review-mode file basenames remain `deep-research-config.json`, `deep-research-state.jsonl`, the deep-review strategy file, the deep-review dashboard file, the iteration files, and the final review report |
| REQ-007 | Update docs and playbooks together | Command docs, skill docs, references, and manual testing playbook scenarios all reflect the same review-folder contract in the same implementation wave |
| REQ-008 | Handle report discoverability deliberately | The implementation either updates all first-party consumers to the review-folder report location or documents any intentional compatibility shim instead of leaving behavior ambiguous |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Starting a fresh `/spec_kit:deep-research:review` session creates all durable artifacts under `{spec_folder}/review/`, not `scratch/`.
- **SC-002**: Resuming a legacy scratch-based review session does not lose state and does not require the user to repair paths manually for the happy path.
- **SC-003**: A repository sweep over the planned review surfaces finds no stale review-mode `scratch/` references after implementation, except for deliberate historical examples or archived artifacts.
- **SC-004**: The review-mode docs and manual testing playbook explicitly describe the new review packet location and corresponding pause or resume behavior.

### Acceptance Scenarios

1. **Given** a new review run with no existing state, **when** the review YAML initializes, **then** the spec folder gains a `review/` subfolder containing the review config, JSONL, strategy, dashboard, iteration artifacts, and final report.
2. **Given** a pre-existing review session that stored state under `scratch/`, **when** review mode is reinvoked after the change, **then** the review-specific artifacts are migrated into `review/` before resume classification and the loop continues from persisted state.
3. **Given** the implementation updates review paths, **when** maintainers inspect the deep-review runtime files across `.opencode`, `.claude`, `.codex`, and `.gemini`, **then** each runtime describes the same review-folder contract.
4. **Given** a maintainer reads the command entrypoint, skill docs, quick reference, loop protocol, state format, and playbook scenarios, **when** they look for the review packet location, **then** every first-party document points at `review/` rather than `scratch/`.
5. **Given** a root-level review report or a partial legacy packet exists, **when** review mode starts after the change, **then** the workflow makes the canonical review-packet location explicit instead of leaving two equally authoritative paths.
6. **Given** unrelated temp files still exist in `scratch/`, **when** legacy review migration runs, **then** those files remain untouched while the review packet is rehomed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Review auto and confirm YAML workflows | Path drift here breaks creation, resume, pause, and synthesis | Treat both YAML files as first-class implementation targets and validate them together |
| Dependency | Runtime deep-review agent definitions | Runtime mismatch would reintroduce contract drift across environments | Update all four runtime variants in the same patch and run parity sweeps |
| Dependency | `review_mode_contract.yaml` plus downstream docs | If the contract asset still points at `scratch/`, docs and future renders will drift | Update the contract asset first, then sync every consumer surface |
| Risk | Legacy scratch review sessions become unreadable | Existing review packets could stop resuming after the path change | Implement a review-specific migration path keyed to known filenames and review-mode markers |
| Risk | Hidden consumers still expect a root-level review report | Downstream tooling or docs may break even if the core loop works | Search for root-level report references during implementation and either update or shim them explicitly |
| Risk | Scratch contains unrelated temporary files | A naive migration could move or delete the wrong artifacts | Migrate only the review-specific whitelist and leave unrelated scratch contents untouched |
| Risk | Review contract render targets are declarative but no generator was found during planning | Manual multi-file edits could drift later | Document manual sync as the current implementation reality and treat generator work as a separate follow-up unless it becomes necessary immediately |
---

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Review-mode migration checks must inspect only the review-specific filename whitelist so startup stays bounded and does not sweep unrelated scratch content unnecessarily.

### Security
- **NFR-S01**: Legacy migration must move only review-specific artifacts and must not relocate arbitrary scratch files or sensitive temporary data unrelated to the review packet.

### Reliability
- **NFR-R01**: Review-mode session classification must treat `review/` as the single canonical runtime location after migration, so resume, completed-session detection, and invalid-state handling all agree on one path.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A spec folder already contains both `review/` and legacy `scratch/` review files; the implementation must not duplicate or overwrite good canonical state silently.
- `scratch/` contains unrelated temporary debugging files next to legacy review artifacts; the migration must move only the review whitelist.
- A completed legacy review session has a root-level review report but no active scratch state; the implementation must decide whether to migrate it, preserve it, or document it without creating ambiguous behavior.

### Error Scenarios
- The review config is present but the JSONL or strategy file is missing after migration; the workflow must still classify the session as invalid rather than resuming partial state.
- Legacy scratch state exists for research mode rather than review mode; the review migration logic must ignore it.
- First-party docs or playbook scenarios still reference `scratch/` after implementation; validation must fail the change until the drift is resolved.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Multiple YAML workflows, four runtime agent files, contract assets, docs, references, and playbook scenarios |
| Risk | 16/25 | Resume behavior, legacy-state migration, and downstream report-path compatibility all carry regression risk |
| Research | 15/20 | Requires cross-reading command, skill, asset, agent, and system-spec-kit structure guidance |
| Multi-Agent | 3/15 | Multi-runtime parity matters, but implementation remains single-workstream |
| Coordination | 14/15 | Path contract must stay synchronized across workflows, runtime agents, docs, and playbook validations |
| **Total** | **67/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Review sessions already persisted under `scratch/` stop resuming | H | M | Implement targeted migration before resume classification |
| R-002 | Runtime deep-review definitions drift after the path change | H | M | Update `.opencode`, `.claude`, `.codex`, and `.gemini` together and sweep them for parity |
| R-003 | First-party docs keep mixed `scratch/` and `review/` guidance | M | H | Treat docs and playbook sync as in-scope, not as cleanup |
| R-004 | Downstream consumers still look for a root-level review report | M | M | Search, update, or provide an explicit compatibility choice during implementation |
| R-005 | Migration grabs unrelated scratch content | M | L | Use a strict file whitelist plus review-mode marker checks |

---

## 11. USER STORIES

### US-001: Isolate durable review packets (Priority: P0)

**As a** spec-folder operator, **I want** deep-review state to live under `review/`, **so that** `scratch/` remains disposable and the review packet is easy to find, archive, and resume.

**Acceptance Criteria**:
1. Given a fresh review run, When initialization completes, Then all durable review artifacts live under `{spec_folder}/review/`.
2. Given the spec folder also has `scratch/`, When I inspect it after a review run, Then it does not contain the canonical review packet.

---

### US-002: Preserve legacy review continuity (Priority: P0)

**As a** returning operator with older review work, **I want** legacy scratch-based review state to be migrated or resumed safely, **so that** previous review sessions are not stranded by the folder change.

**Acceptance Criteria**:
1. Given legacy review-specific files exist under `scratch/`, When I rerun review mode, Then the workflow migrates those files into `review/` before attempting resume.
2. Given unrelated temp files also exist in `scratch/`, When migration runs, Then those unrelated files remain untouched.

---

### US-003: Keep first-party guidance coherent (Priority: P1)

**As a** maintainer, **I want** the command, runtime agents, contract assets, docs, and playbook scenarios to agree on the review packet location, **so that** future updates do not reintroduce path drift.

**Acceptance Criteria**:
1. Given I read any first-party review-mode doc or runtime file, When I look for the packet location, Then it points to `review/`.
2. Given I run the planned validation sweeps, When the change is complete, Then stale review-mode `scratch/` references are either gone or intentionally documented as historical examples.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No generator or renderer for `review_mode_contract.yaml` render targets was found during this planning pass. Implementation should verify whether manual multi-file updates remain the intended workflow or whether a generator exists outside the scanned surfaces.
- Verify whether any tooling outside the scanned first-party files assumes a root-level review-report path before finalizing the migration shape.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
