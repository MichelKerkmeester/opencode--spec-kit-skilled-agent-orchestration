---
title: "Feature Specification: Recursive Agent Package and Runtime Alignment [template:level_2/spec.md]"
description: "Phase 005 under packet 041 corrects agent-improver template fidelity, renames the mutator to agent-improver across runtimes, aligns the command surface, and syncs the .agents skill mirror."
trigger_phrases:
  - "recursive agent package runtime alignment"
  - "041 phase 005"
  - "recursive agent template parity"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Recursive Agent Package and Runtime Alignment

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
| **Predecessor** | [../004-sk-improve-agent-promotion-verification/](../004-sk-improve-agent-promotion-verification/) |
| **Successor** | [../006-sk-improve-agent-command-rename/](../006-sk-improve-agent-command-rename/) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase `004`, the agent-improver workflow was functionally strong, but the package still had a stricter alignment gap against the `sk-doc` templates. The source package docs were valid but not template-faithful enough, the mutator agent still used the old `agent-improvement-loop` name across runtimes, the command body and wrappers still reflected an older command shape, and the `.agents/skills/sk-improve-agent` mirror had not been resynchronized to the corrected source package.

### Purpose
Create a package-and-runtime alignment phase that brings the agent-improver skill docs, markdown assets, runtime agent surfaces, command surfaces, and mirrored `.agents/skills` package into explicit parity with the `sk-doc` and `sk-code-opencode` expectations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skill/sk-improve-agent/` markdown package alignment against `sk-doc` templates
- renaming the canonical mutator agent to `agent-improver` across OpenCode, Claude, Gemini, `.agents`, and Codex runtimes
- aligning the command entrypoint and command wrappers with the `sk-doc` command template shape
- syncing `.agents/skills/sk-improve-agent/` to the corrected source package
- parent packet `041` docs and registry metadata needed to record phase `005`

### Out of Scope
- changing the agent-improver scoring or benchmark logic beyond package or runtime parity needs
- renaming the command entrypoint itself during phase `005`; that follow-up was deferred to a later phase
- widening promotion eligibility or target scope

### Files to Change
- `.opencode/skill/sk-improve-agent/`
- `.opencode/agent/agent-improver.md`
- `.claude/agents/agent-improver.md`
- `.gemini/agents/agent-improver.md`
- `.agents/agents/agent-improver.md`
- `.codex/agents/agent-improver.toml`
- `.opencode/command/spec_kit/agent-improver.md`
- `.opencode/command/spec_kit/assets/improve_agent-improver_auto.yaml`
- `.opencode/command/spec_kit/assets/improve_agent-improver_confirm.yaml`
- `.agents/commands/spec_kit/agent-improver.toml`
- `.gemini/commands/spec_kit/agent-improver.toml`
- `.agents/skills/sk-improve-agent/`
- `.opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/`
- `.opencode/specs/descriptions.json`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Source package matches `sk-doc` templates more closely | `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/skill/sk-improve-agent/README.md`, `references/*.md`, and markdown `assets/*.md` validate and use the expected template family structure |
| REQ-002 | Mutator agent is renamed to `agent-improver` across runtimes | OpenCode, Claude, Gemini, `.agents`, and Codex runtime files use the new agent name and current template-aligned structure |
| REQ-003 | Command surfaces are aligned | The canonical command doc and both wrapper TOMLs reflect the corrected command template structure |
| REQ-004 | `.agents/skills/sk-improve-agent` is resynchronized | The mirrored `.agents` skill package matches the corrected source package, including scripts |
| REQ-005 | Parent packet records phase `005` | Root `041` docs list phase `005` and report `5 of 5 complete` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Dispatch surfaces use the renamed mutator | YAML workflows dispatch `@agent-improver` |
| REQ-007 | Historical packet references are not misleading | Active packet docs stop pointing at the removed `agent-improvement-loop` agent path as if it were current |
| REQ-008 | Strict validation passes | Root `041` and phase `005` pass `validate.sh --strict` |
| REQ-009 | Source doc validators pass | `package_skill.py --check`, `validate_document.py`, and script syntax checks pass for touched surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The agent-improver source package is template-faithful across `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/skill/sk-improve-agent/README.md`, `references/`, and markdown `assets/`.
- **SC-002**: The mutator exists only as `agent-improver` across runtime surfaces, and dispatch files call the new name.
- **SC-003**: The `.agents/skills/sk-improve-agent/` mirror matches the source package after the correction pass.
- **SC-004**: Root packet `041` clearly shows five completed phases and pushes future work to `006-*`.

### Acceptance Scenarios
1. **Given** a maintainer inspects the agent-improver package, **when** they compare it to the `sk-doc` templates, **then** the source package follows the expected template family rather than only passing minimal validation.
2. **Given** a maintainer inspects runtime agent files, **when** they look for the old mutator name, **then** they find `agent-improver` instead.
3. **Given** a maintainer inspects the mirrored `.agents` skill package, **when** they compare it to the OpenCode source package, **then** the docs, assets, and scripts are synchronized.
4. **Given** strict validation is re-run, **when** packet docs and package references are synchronized, **then** root `041` and phase `005` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` template family | Source of truth for markdown package alignment | Validate every touched markdown surface against the correct template family |
| Dependency | runtime mirror files | Rename must remain cross-runtime consistent | Rename and patch all runtime surfaces together |
| Risk | Wrapper and YAML drift after rename | Medium | Update dispatch and wrapper surfaces in the same phase |
| Risk | `.agents/skills` mirror falls behind source package | Medium | Resynchronize the mirror package after source edits |
| Risk | Historical packet docs become misleading | Low | Update active packet references and record the stricter correction in phase `005` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This phase exists to close template-fidelity and runtime-parity gaps explicitly.
<!-- /ANCHOR:questions -->

---
