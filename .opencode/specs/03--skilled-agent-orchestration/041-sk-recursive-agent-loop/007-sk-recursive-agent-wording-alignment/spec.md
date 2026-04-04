---
title: "Feature Specification: Recursive Agent Wording Alignment [template:level_2/spec.md]"
description: "Phase 007 under packet 041 cleans up wording across the current agent-improver package, runtime mirrors, wrapper prompts, and active packet docs without changing behavior or historical evidence."
trigger_phrases:
  - "recursive agent wording alignment"
  - "041 phase 007"
  - "recursive agent wording pass"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Recursive Agent Wording Alignment

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
| **Created** | 2026-04-04 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [../006-sk-agent-improver-command-rename/](../006-sk-agent-improver-command-rename/) |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase `006`, the agent-improver program was structurally aligned, but several current surfaces still had awkward phrasing, inconsistent terminology, or minor wording bugs across the source skill package, runtime mirrors, wrapper prompts, and parent packet docs.

### Purpose
Run a wording-only cleanup across the current agent-improver surfaces so the language is clearer, the runtime-specific instructions are accurate, and the active packet history reads cleanly without rewriting historical `research/` or `memory/` artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- wording cleanup in `.opencode/skill/sk-agent-improver/` markdown surfaces
- wording cleanup in the canonical command and mirrored wrapper prompts
- wording cleanup in runtime-specific `agent-improver` mirror files
- wording cleanup in root packet `041` docs so phase `007` is recorded cleanly
- registry metadata updates needed to record phase `007`

### Out of Scope
- changing agent-improver behavior, promotion scope, benchmark logic, or file identities
- renaming files or reopening previously closed behavioral phases
- rewriting historical `research/` or `memory/` artifacts under `041`

### Files to Change
- `.opencode/skill/sk-agent-improver/SKILL.md`
- `.opencode/skill/sk-agent-improver/README.md`
- selected markdown files under `.opencode/skill/sk-agent-improver/references/`
- selected markdown files under `.opencode/skill/sk-agent-improver/assets/`
- `.opencode/command/spec_kit/agent-improver.md`
- `.agents/commands/spec_kit/agent-improver.toml`
- `.gemini/commands/spec_kit/agent-improver.toml`
- `.opencode/agent/agent-improver.md`
- `.claude/agents/agent-improver.md`
- `.gemini/agents/agent-improver.md`
- `.agents/agents/agent-improver.md`
- `.codex/agents/agent-improver.toml`
- active packet docs under `041-sk-agent-improver-loop/`
- `.opencode/specs/descriptions.json`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Current agent-improver wording is cleaned up | Source and mirrored agent-improver surfaces use clearer, accurate wording without changing behavior or file identity |
| REQ-002 | Current command and wrapper prompts are wording-aligned | Command docs and wrapper prompts use consistent wording for setup, execution, and promotion gates |
| REQ-003 | Runtime-specific agent wording is accurate | Runtime agent mirrors use the correct runtime path conventions and consistent summary wording |
| REQ-004 | Active packet docs read cleanly after the wording pass | Root packet and phase docs describe the current agent-improver program clearly without stale or awkward wording |
| REQ-005 | Parent packet records phase `007` | Root `041` docs list phase `007` and report `7 of 7 complete` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Current wording changes do not rewrite audit history | Historical `research/` and `memory/` artifacts remain untouched while current surfaces are cleaned up |
| REQ-007 | Strict validation passes | Root `041` and phase `007` pass `validate.sh --strict` |
| REQ-008 | Updated docs and runtime mirrors validate and parse | Document validation, TOML parsing, and strict packet validation all pass after the wording cleanup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Current agent-improver surfaces use clearer, more accurate wording while keeping the shipped command and file paths unchanged.
- **SC-002**: Runtime-specific instructions and summaries are accurate for OpenCode, Claude, Gemini, `.agents`, and Codex.
- **SC-003**: Source package docs, mirrored runtime surfaces, and active packet docs read consistently after the wording pass.
- **SC-004**: Root packet `041` clearly shows seven completed phases and pushes future work to `008-*`.

### Acceptance Scenarios
1. **Given** a maintainer reads the current agent-improver package, **when** they compare the key docs and mirrors, **then** they find clearer, more consistent wording without behavioral changes.
2. **Given** a maintainer inspects runtime-specific agent and command surfaces, **when** they compare wording, **then** the runtime guidance matches the active profile accurately.
3. **Given** a maintainer reads the parent packet, **when** they inspect the phase map and summaries, **then** phase `007` is represented clearly as the wording-alignment pass.
4. **Given** the wording edits and packet docs are synchronized, **when** strict validation is re-run, **then** root `041` and phase `007` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` validators | Wording cleanup still has to remain template-valid | Re-run document validation after edits |
| Dependency | runtime wrapper TOMLs | Wrapper prompt edits must still parse cleanly | Re-run TOML parsing after edits |
| Risk | Wording cleanup accidentally changes behavior claims | Medium | Keep the pass wording-only and leave file identities unchanged |
| Risk | Historical evidence gets rewritten by accident | Medium | Keep `research/` and `memory/` explicitly out of scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This phase exists to clean up current wording while preserving historical evidence as-is.
<!-- /ANCHOR:questions -->

---
