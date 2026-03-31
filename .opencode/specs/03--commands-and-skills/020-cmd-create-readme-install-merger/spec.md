---
title: "Feature Specification: Merge create README and install guide commands [017-create-readme-install-merger/spec]"
description: "The create command family currently duplicates setup logic and routing across two command entry points. This spec defines a single canonical command/workflow family that preserves compatibility while reducing maintenance overhead."
SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
trigger_phrases:
  - "create command merge"
  - "folder readme"
  - "install guide"
  - "canonical command"
  - "workflow unification"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Merge create README and install guide commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-03 |
| **Branch** | `017-create-readme-install-merger` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current command assets for `create:folder_readme` and `create:install_guide` repeat the same orchestration structure: Phase 0 write-agent verification, a consolidated setup prompt, mode split (`:auto` and `:confirm`), and a six-step YAML workflow. This duplication increases divergence risk, as seen in inconsistent wording, setup fields, and quality gate details across four YAML files and two command entry files.

### Purpose
Define a canonical merged command/workflow family that consolidates shared orchestration while retaining operation-specific branches for README and install guide generation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Implement canonical merged command entrypoint for README/install guide creation.
- Convert legacy command markdown entrypoints into compatibility aliases.
- Add canonical `.agents` wrapper and convert legacy `.agents` command files into alias wrappers.
- Update command catalog/runtime references to point to canonical command usage.
- Record validation evidence for markdown docs and TOML wrapper parsing.

### Out of Scope
- Removing legacy aliases in this cycle.
- Canonical vs legacy runtime parity dry-run matrix execution across all invocation combinations.
- Changing generated README/install guide content templates (behavior remains unchanged target).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/folder_readme.md` | Update | Preferred unified user-facing command for README/install workflows |
| compatibility/internal workflow kernel entrypoint | Update | Legacy internal wrapper retired after implementation; behavior folded into the canonical command |
| install-guide compatibility alias | Update | Legacy install-guide wrapper retired after implementation; install behavior now routes through the canonical command |
| `.agents/commands/create/folder_readme.toml` | Update | Preferred unified `.agents` wrapper |
| `.agents/commands/create/doc.toml` | Update | Compatibility/internal `.agents` wrapper |
| `.agents/commands/create/install_guide.toml` | Update | Converted to compatibility alias wrapper |
| `.opencode/command/create/README.txt` | Update | Command catalog references canonical command |
| `.opencode/README.md` | Update | Runtime command references updated |
| `README.md` | Update | Public command references updated |
| `.opencode/install_guides/README.md` | Update | Install guide references updated |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Update | Setup reference updated for canonical path |
| `.opencode/agent/write.md` | Update | Writer agent references updated |
| `.claude/agents/write.md` | Update | Claude runtime writer references updated |
| `.agents/agents/write.md` | Update | `.agents` writer references updated |
| `.codex/agents/write.toml` | Update | Codex writer references updated |
| `.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/spec.md` | Update | Implementation-progress sync |
| `.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/plan.md` | Update | Implementation status and evidence sync |
| `.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/tasks.md` | Update | Task completion state sync |
| `.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/checklist.md` | Update | Verification progress sync |
| `.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/implementation-summary.md` | Update | Implementation cycle summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Propose canonical merged command naming | One primary command name plus rationale, aliases, and collision check documented in `plan.md` |
| REQ-002 | Define unified operation and mode routing model | Routing model covers operation selection (`readme` vs `install`) and mode selection (`auto` vs `confirm`) with deterministic precedence |
| REQ-003 | Unify input contract | Shared fields and operation-specific fields defined, including mapping for `target-path`, `project-name`, and flags |
| REQ-004 | Define setup prompt consolidation logic | Single prompt strategy specifies conditional questions and no redundant follow-up prompts except conflict handling |
| REQ-005 | Specify shared YAML architecture with branches | Shared kernel and operation-specific branch structure documented, including where behavior diverges |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Document backward compatibility and migration map | Existing command calls map to canonical equivalents, with explicit alias and deprecation timeline |
| REQ-007 | Define validation, DQI gates, and rollback strategy | Validation gates include structure checks, placeholder checks, DQI thresholds, and safe rollback triggers |
| REQ-008 | Capture risks, assumptions, and out-of-scope boundaries | Each category has concrete entries tied to this merge effort |
| REQ-009 | Ground decisions in current command assets | Evidence table references command markdown and all four YAML files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Preferred unified command wrapper exists at `.opencode/command/create/folder_readme.md`, supports README/install workflows, and defaults to README when operation is omitted.
- **SC-002**: Legacy markdown and `.agents` command entrypoints are preserved as compatibility aliases to canonical command.
- **SC-003**: Command catalog/runtime reference files are updated to canonical naming across OpenCode and agent surfaces.
- **SC-004**: Markdown doc validation passes for canonical + legacy aliases, and TOML wrappers parse without errors.
- **SC-005**: Spec validator reports no structural errors for this Level 2 spec folder.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

1. **AS-001 - Legacy README Auto Path Parity**: **Given** a user invokes `/create:folder_readme :auto`, **When** canonical routing resolves aliases, **Then** the system dispatches to the README auto branch without changing setup or completion semantics.
2. **AS-002 - Legacy Install Confirm Path Parity**: **Given** a user invokes `/create:install_guide :confirm`, **When** canonical routing resolves aliases, **Then** the system dispatches to the install confirm branch with checkpoint behavior preserved.
3. **AS-003 - Preferred Explicit Operation Routing**: **Given** a user invokes `/create:folder_readme` with explicit operation and mode, **When** required arguments are provided, **Then** no additional setup prompt questions are asked.
4. **AS-004 - Ambiguous Mixed-Flag Rejection**: **Given** inputs include conflicting operation flags, **When** router normalization runs, **Then** command execution halts with a deterministic guidance error asking for explicit operation selection.
5. **AS-005 - Conflict Safety Enforcement**: **Given** target output already exists, **When** conflict handling is required, **Then** overwrite or merge only occurs after explicit user choice.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing command assets remain source-of-truth during planning | Incorrect assumptions if assets change mid-spec | Record evidence references and validate against latest files before implementation |
| Risk | Alias handling could create ambiguous invocation behavior | User-facing command regressions | Define strict precedence: explicit operation flag over inferred argument pattern over defaults |
| Risk | Shared YAML over-consolidation can hide operation-specific rules | Loss of operation fidelity | Keep shared kernel plus explicit branch sections for README and install guide |
| Risk | Deprecation too aggressive | Breaking user workflows | Stage deprecation with warning window and rollback aliases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Command routing decision resolves in a single pass from parsed arguments and suffix.
- **NFR-P02**: Consolidated setup prompt keeps first-round-trip completion at one interaction when inputs are complete.

### Security
- **NFR-S01**: No new secret inputs are introduced in the unified contract.
- **NFR-S02**: Existing guardrails around explicit overwrite and conflict resolution remain mandatory.

### Reliability
- **NFR-R01**: Backward-compatible aliases preserve current command entry behavior during migration window.
- **NFR-R02**: Rollback plan can restore pre-merge command files without data migration.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty argument string with no suffix: unified setup prompts for operation, path/project, and mode.
- Mixed flags for both operations: router rejects ambiguous combinations and requests explicit operation selection.
- Invalid mode suffix: router falls back to setup-mode question.

### Error Scenarios
- Shared kernel parse failure: stop before YAML dispatch and surface normalized error.
- Existing file conflicts for both operations: enforce conditional conflict question, no implicit overwrite.
- Unknown command alias after deprecation: return migration hint to `/create:folder_readme`.

### State Transitions
- Command begins in compatibility alias and transitions to canonical routing path before workflow execution.
- Partial setup completion: missing required fields trigger targeted re-prompt only for missing fields.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two command entrypoints and four YAML workflows need merge-safe design |
| Risk | 17/25 | User-facing command behavior and migration compatibility risk |
| Research | 14/20 | Evidence review across six source assets completed |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What objective threshold should be used to remove compatibility aliases (release count, usage telemetry, or both)?
- Should parity matrix evidence be codified as a required pre-removal checklist artifact in the next implementation pass?
<!-- /ANCHOR:questions -->
