---
title: "Implementation Plan: Merge create README and install guide commands [017-create-readme-install-merger/plan]"
description: "This plan defines how to consolidate duplicated command orchestration into a canonical workflow family while preserving current command behavior through aliases and staged deprecation."
SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
trigger_phrases:
  - "create command plan"
  - "routing model"
  - "input contract"
  - "yaml architecture"
  - "migration plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Merge create README and install guide commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command specs + YAML workflow assets |
| **Framework** | OpenCode command runtime with mode suffix routing |
| **Storage** | Repository command and asset files |
| **Testing** | Spec validator, YAML parsing checks, command behavior parity review |

### Overview
The merge strategy introduces a canonical command family with one shared routing kernel and operation-specific branches for README and install guide behavior. Existing commands remain as compatibility aliases during migration, while setup prompting, input normalization, and quality gates are centralized.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented in `spec.md`
- [x] Merge constraints and non-goals defined
- [x] Source evidence captured from current command and YAML assets

### Definition of Done
- [x] Canonical command and alias map implemented
- [x] Shared routing kernel and operation branches implemented
- [x] Validation and rollback procedures tested in dry-run scenarios (static parity+safety PASS; rollback dry-run simulation PASS)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Modular command orchestration with a shared kernel plus operation-specific branches.

### Key Components
- **Canonical Command Surface**: Preferred user-facing command is `/create:folder_readme` with operation selector `readme|install` (default `readme` when omitted), while `/create:doc` remains a compatibility/internal kernel entrypoint.
- **Unified Setup Resolver**: Single consolidated setup logic that asks only missing inputs and applies consistent conflict handling.
- **Shared Workflow Kernel**: Common phases for verification, setup parsing, mode routing, confidence gates, and completion reporting.
- **Operation Branches**: README branch and install-guide branch retain specialized discovery, section requirements, and template references.

### Data Flow
Invocation enters canonical parser, normalization resolves operation and mode, setup resolver fills missing fields, router dispatches to shared kernel, kernel executes selected operation branch, then validation and reporting complete with standardized status output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Naming Finalization
- [x] Lock canonical naming and alias policy.
- [x] Finalize unified input schema and precedence rules.
- [x] Approve migration map and deprecation timeline.

### Phase 2: Workflow Consolidation Design
- [x] Define shared YAML kernel schema.
- [x] Split operation-specific branch sections for README and install guide.
- [x] Define setup prompt consolidation and conflict-resolution decision tree.

### Phase 3: Validation and Migration Readiness
- [x] Define parity test matrix across legacy and canonical invocations.
- [x] Define DQI and validator gates for produced docs.
- [x] Define rollback runbook and deprecation communication plan.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-like contract checks | Input parsing and normalization rules | Static review + schema checks |
| Integration-like routing checks | Legacy alias parity and operation dispatch | Command invocation matrix |
| Manual | End-to-end behavior in `:auto` and `:confirm` across both operations | CLI dry-runs + output review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/create/folder_readme.md` and the merged install-guide branch | Internal | Green | Merge contract cannot preserve current command semantics |
| Four operation-mode YAML assets in `.opencode/command/create/assets/` | Internal | Green | Shared kernel design cannot be grounded in current behavior |
| sk-doc DQI expectations in existing workflows | Internal | Yellow | Validation policy inconsistencies after merge |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity tests fail for legacy command behavior, or migration aliases cause ambiguous invocation paths.
- **Procedure**: Revert canonical command changes, restore legacy command entry files and mode YAML files, keep compatibility warnings disabled until fix cycle.

### Dry-Run Evidence (Non-Destructive)

| Check | Result |
|-------|--------|
| Wrapper and canonical command presence | PASS - wrappers and canonical command all exist |
| Simulated rollback command sequence | PASS - rollback command list produced for execution rehearsal |
| Smoke readiness (`/create:folder_readme`, `/create:install_guide` in `:auto` + `:confirm`) | PASS - all four invocation surfaces reported available |
| Status marker | `ROLLBACK_DRY_RUN_STATUS PASS` |

### Deprecation Window Policy

- Retain legacy aliases for a minimum of **2 release cycles OR 30 days, whichever is longer**.
- Alias retirement is gated by **zero P0 parity regressions** in validation evidence.
- Alias retirement is gated by **documentation updates completed** across command/runtime references before removal.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ─────┐
                        ├──► Phase 2 (Consolidation) ──► Phase 3 (Validation/Migration)
Evidence Review ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | Evidence review | Consolidation, Migration |
| Consolidation | Contract | Validation |
| Validation/Migration | Consolidation | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract and naming | Medium | 2-3 hours |
| Consolidation design | High | 4-6 hours |
| Validation and migration readiness | Medium | 2-4 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Legacy command snapshots captured.
- [x] Alias behavior comparison matrix captured.
- [x] Validation scripts and DQI checks runnable on both operations.

### Rollback Procedure
1. Disable canonical command entry and re-enable legacy command entrypoints.
2. Restore original mode-specific YAML routing for both commands.
3. Run smoke checks for `/create:folder_readme` and `/create:install_guide` in `:auto` and `:confirm` modes.
4. Publish rollback notice and updated migration guidance.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Repository file reversion only.
<!-- /ANCHOR:enhanced-rollback -->

---

### Evidence Baseline

| Evidence Asset | Key Finding |
|----------------|-------------|
| `.opencode/command/create/folder_readme.md` | Uses Phase 0 write verification + unified setup + mode split to two YAML files |
| merged install-guide branch inside `.opencode/command/create/folder_readme.md` | Mirrors the setup protocol and mode split with operation-specific input fields |
| `.opencode/command/create/assets/create_folder_readme_auto.yaml` | Autonomous six-step workflow with README-specific section model and DQI gate |
| `.opencode/command/create/assets/create_folder_readme_confirm.yaml` | Interactive variant with step checkpoints and same core structure |
| `.opencode/command/create/assets/create_install_guide_auto.yaml` | Autonomous six-step workflow with install-guide-specific section model and platform logic |
| `.opencode/command/create/assets/create_install_guide_confirm.yaml` | Interactive variant with checkpointed install guide flow and same core structure |

### Implementation Evidence (Current Cycle)

| Evidence Asset | Result |
|----------------|--------|
| `.opencode/command/create/folder_readme.md` | Preferred unified user-facing command updated for README/install workflows (default `readme`) |
| compatibility/internal workflow kernel behavior | Retired wrapper behavior remains preserved inside the canonical command flow |
| install-guide compatibility alias behavior | Legacy wrapper retired after implementation; install routing remains available through the canonical command |
| `.agents/commands/create/folder_readme.toml` | Preferred unified `.agents` wrapper updated |
| `.agents/commands/create/doc.toml` | Retained as compatibility/internal `.agents` wrapper |
| `.agents/commands/create/install_guide.toml` | Converted to compatibility alias wrapper |
| Alias warning behavior in markdown/TOML wrappers | Implemented one-line deprecation warnings with canonical migration hints before routing |
| `python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/command/create/folder_readme.md` (canonical pass used for merged workflow) | VALID |
| `python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/command/create/folder_readme.md` | VALID |
| install-guide branch validation via canonical command document review | VALID |
| `python3.11 -c "import tomllib, pathlib; ..."` (three `.agents` files) | TOML_PARSE_VALID |
| Static parity+safety suite | PASS (20 checks, 0 failed), including `route:readme:auto`, `route:readme:confirm`, `route:install:auto`, `route:install:confirm`; alias-token + alias-source checks for markdown and `.agents` wrappers; confirm-checkpoints + explicit-overwrite-options checks for both confirm YAML files; no-secret-field checks in the canonical merged command document |
| Rollback dry-run simulation | PASS (non-destructive), wrappers + canonical present, simulated rollback commands listed, smoke readiness PASS for both operations in `:auto` + `:confirm`, status `ROLLBACK_DRY_RUN_STATUS PASS` |

#### Parity Matrix (Canonical + Legacy Alias Equivalence)

| Operation | Mode | Canonical Route Expectation | Legacy Alias Equivalence | Evidence |
|-----------|------|-----------------------------|--------------------------|----------|
| README | `:auto` | Routes to README auto branch | `/create:folder_readme:auto` equivalent to canonical README auto path | static parity+safety PASS: `route:readme:auto` + alias-token/source checks |
| README | `:confirm` | Routes to README confirm branch | `/create:folder_readme:confirm` equivalent to canonical README confirm path | static parity+safety PASS: `route:readme:confirm` + confirm-checkpoints + explicit-overwrite-options |
| Install guide | `:auto` | Routes to install auto branch | `/create:install_guide:auto` equivalent to canonical install auto path | static parity+safety PASS: `route:install:auto` + alias-token/source checks |
| Install guide | `:confirm` | Routes to install confirm branch | `/create:install_guide:confirm` equivalent to canonical install confirm path | static parity+safety PASS: `route:install:confirm` + confirm-checkpoints + explicit-overwrite-options |

### Open Execution Items

- No open execution items remain for this phase.
