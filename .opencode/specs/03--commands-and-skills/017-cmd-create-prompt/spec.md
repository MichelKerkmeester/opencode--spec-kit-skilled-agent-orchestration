---
title: "Feature Specification: create:prompt Command [03--commands-and-skills/017-cmd-create-prompt/spec]"
description: "Create a /create:prompt command wrapping sk-prompt-improver skill"
trigger_phrases:
  - "feature"
  - "specification"
  - "create"
  - "prompt"
  - "command"
  - "spec"
  - "017"
  - "cmd"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: create:prompt Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |

---
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-prompt-improver skill provides powerful prompt engineering capabilities (7 frameworks, DEPTH processing, CLEAR scoring), but users must manually load the SKILL.md and follow its multi-step pipeline. There is no dedicated command to invoke this skill directly, creating friction and inconsistency in prompt creation workflows.

### Purpose

Create a `/create:prompt` command in the `create/` namespace that provides a streamlined, mode-aware entry point for prompt creation and improvement using the sk-prompt-improver skill, with argument routing, framework auto-selection, and structured CLEAR-scored output delivery.

---
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Mode-based command file (`.opencode/command/create/prompt.md`) following command_template.md standards
- Mandatory gate pattern for required `<prompt_or_topic>` argument
- Argument dispatch routing for sk-prompt-improver mode prefixes (`$text`, `$improve`, `$refine`, `$short`, `$json`, `$yaml`, `$raw`)
- `:auto`/`:confirm` execution mode support
- Skill invocation instructions (load SKILL.md + relevant references)
- CLEAR scoring delivery with transparency report
- Gate 3 exemption declaration (prompt enhancement is conversation-only by default)

### Out of Scope

- YAML workflow asset files (command works via direct skill invocation, not YAML dispatch)
- Modifications to sk-prompt-improver SKILL.md or its references
- File output management (enhanced prompts delivered in conversation)
- @write agent verification (not needed for skill invocation commands)
- New scoring systems or frameworks beyond what sk-prompt-improver provides

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/prompt.md` | Create | New command file for `/create:prompt` |

---
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command file follows command_template.md standards | Frontmatter with description, argument-hint, allowed-tools; mandatory gate; numbered sections; STATUS output |
| REQ-002 | Mandatory gate prevents context inference | Gate blocks execution when $ARGUMENTS is empty; presents prompt question to user |
| REQ-003 | Argument routing dispatches sk-prompt-improver modes | Mode prefixes ($text, $improve, $refine, $short, $json, $yaml, $raw) correctly detected and routed |
| REQ-004 | Skill invocation instructions are complete | Command loads sk-prompt-improver SKILL.md and follows the enhancement pipeline (framework selection → DEPTH → CLEAR scoring) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | :auto/:confirm mode support | Mode detection from command suffix; autonomous executes without gates; interactive pauses for user approval |
| REQ-006 | CLEAR scoring delivery | Enhanced prompt includes CLEAR score breakdown and transparency report |
| REQ-007 | Example usage covers common scenarios | At least 4 examples showing different invocation patterns |

---
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:prompt "my vague prompt"` invokes sk-prompt-improver and delivers an enhanced prompt with CLEAR score ≥ 40/50
- **SC-002**: Command file passes command_template.md validation checklist (§15) — all required items checked
- **SC-003**: Mode prefix detection correctly routes `$text`, `$improve`, `$refine`, `$short`, `$json`, `$yaml`, `$raw` to appropriate sk-prompt-improver modes

---

### Acceptance Scenarios

- **Given** a user invokes `/create:prompt` with a vague prompt, **when** the command routes into `sk-prompt-improver`, **then** the workflow returns an enhanced prompt rather than a manual skill-loading detour.
- **Given** the request includes an explicit mode prefix such as `$json` or `$refine`, **when** the command guidance is followed, **then** the correct prompt-improver mode is selected.
- **Given** the command runs in `:confirm` mode, **when** the user reviews the workflow, **then** the command behavior pauses for approval instead of acting as autonomous mode.
- **Given** the command wrapper is compared to the underlying skill, **when** the spec packet is reviewed, **then** it remains a thin entrypoint over the existing prompt-improver behavior rather than a new prompt engine.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-prompt-improver skill must exist and be functional | Command cannot work without the skill | Skill already exists and is complete (verified in 001-initial-creation spec) |
| Risk | Mode prefix conflicts with user prompt text | Low | Mode prefixes use $ symbol which is unlikely in natural prompt text |
| Risk | Command complexity creep beyond 250 LOC | Medium | Keep command as thin wrapper; all logic lives in skill, not command |

---
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — all requirements are clear based on sk-prompt-improver SKILL.md and command_template.md patterns.

---
<!-- /ANCHOR:questions -->

---
