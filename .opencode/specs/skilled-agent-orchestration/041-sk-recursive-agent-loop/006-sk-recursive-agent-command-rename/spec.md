---
title: "Feature Specificati [skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename/spec]"
description: "Phase 006 under packet 041 renames the agent-improver command entrypoint itself, renames command assets and wrappers, and syncs command references across runtime docs and packet history."
trigger_phrases:
  - "recursive agent command rename"
  - "041 phase 006"
  - "recursive agent command entrypoint"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Recursive Agent Command Rename

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
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [../005-sk-improve-agent-package-runtime-alignment/](../005-sk-improve-agent-package-runtime-alignment/) |
| **Successor** | [../007-sk-improve-agent-wording-alignment/](../007-sk-improve-agent-wording-alignment/) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase `005`, the runtime mutator, skill package, and wrapper content all aligned on `agent-improver`, but the command entrypoint itself still carried the older `agent-improvement-loop` name. That left the repo with one last naming mismatch across the command markdown file, command asset filenames, wrapper filenames, README examples, runtime agent tables, and packet-history references.

### Purpose
Rename the command entrypoint itself to `/improve:agent-improver`, rename the command markdown and workflow assets to the agent-improver family, rename the wrapper TOMLs, and sync the active packet history to the new command surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- renaming the canonical command markdown entrypoint to `.opencode/command/spec_kit/agent-improver.md`
- renaming the command workflow assets to `improve_agent-improver_*.yaml`
- renaming the `.agents` and `.gemini` wrapper TOMLs to `agent-improver.toml`
- updating runtime agent tables, skill docs, README examples, and active packet docs to the new command name and path
- updating parent packet `041` docs and registry metadata to record phase `006`

### Out of Scope
- changing agent-improver benchmark logic, scoring thresholds, or promotion scope
- renaming the `sk-improve-agent` skill itself
- reopening deep-research history artifacts that intentionally preserve the original concept naming

### Files to Change
- `.opencode/command/spec_kit/agent-improver.md`
- `.opencode/command/spec_kit/assets/improve_agent-improver_auto.yaml`
- `.opencode/command/spec_kit/assets/improve_agent-improver_confirm.yaml`
- `.agents/commands/spec_kit/agent-improver.toml`
- `.gemini/commands/spec_kit/agent-improver.toml`
- runtime docs that reference the command surface
- active packet docs under `041-sk-improve-agent-loop/`
- `.opencode/specs/descriptions.json`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command entrypoint is renamed | The canonical command markdown file is `.opencode/command/spec_kit/agent-improver.md` and examples invoke `/improve:agent-improver` |
| REQ-002 | Command workflow assets are renamed | The canonical YAML files use the `improve_agent-improver_*.yaml` naming family |
| REQ-003 | Runtime wrappers are renamed | `.agents` and `.gemini` command wrapper files use `agent-improver.toml` |
| REQ-004 | Active runtime docs use the renamed command path | Runtime agent tables and skill docs point at `.opencode/command/spec_kit/agent-improver.md` and `/improve:agent-improver` |
| REQ-005 | Parent packet records phase `006` | Root `041` docs list phase `006` and report `6 of 6 complete` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Historical packet references are not misleading | Active packet docs stop pointing at the removed command filename as if it were current |
| REQ-007 | Strict validation passes | Root `041` and phase `006` pass `validate.sh --strict` |
| REQ-008 | Renamed command docs and wrappers validate and parse | `validate_document.py --type command` passes for the renamed command and TOML parsing passes for the renamed wrappers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The command entrypoint is now `/improve:agent-improver` and the canonical file path is `.opencode/command/spec_kit/agent-improver.md`.
- **SC-002**: YAML assets and wrapper TOMLs use the agent-improver naming family.
- **SC-003**: Runtime docs, skill docs, and active packet docs all reference the new command name and path.
- **SC-004**: Root packet `041` clearly shows six completed phases and pushes future work to `007-*`.

### Acceptance Scenarios
1. **Given** a maintainer browses the command directory, **when** they inspect the agent-improver surface, **then** they find `.opencode/command/spec_kit/agent-improver.md` instead of the removed command filename.
2. **Given** a maintainer inspects runtime wrappers and YAML assets, **when** they compare naming, **then** all command files use the agent-improver family consistently.
3. **Given** a maintainer reads runtime agent tables and README examples, **when** they look for the command entrypoint, **then** they see `/improve:agent-improver`.
4. **Given** strict validation is re-run, **when** the packet docs and command references are synchronized, **then** root `041` and phase `006` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` command validator | The renamed command must still validate structurally | Re-run `validate_document.py --type command` after the rename |
| Dependency | runtime wrapper TOMLs | Renamed wrapper files must still parse | Re-run TOML parsing after rename |
| Risk | Packet docs drift after the rename | Medium | Update parent and active phase docs in the same pass |
| Risk | Workflow assets keep the old filename family | Medium | Rename the files and update all references together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This phase exists to close the last command-surface naming gap explicitly.
<!-- /ANCHOR:questions -->

---
