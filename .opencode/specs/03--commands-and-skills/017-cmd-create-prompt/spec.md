---
title: "Feature Specification: create:prompt Command [template:level_2/spec.md]"
description: "Create a /create:prompt command wrapping sk-prompt-improver skill"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: create:prompt Command

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-prompt-improver skill provides powerful prompt engineering capabilities (7 frameworks, DEPTH processing, CLEAR scoring), but users must manually load the SKILL.md and follow its multi-step pipeline. There is no dedicated command to invoke this skill directly, creating friction and inconsistency in prompt creation workflows.

### Purpose

Create a `/create:prompt` command in the `create/` namespace that provides a streamlined, mode-aware entry point for prompt creation and improvement using the sk-prompt-improver skill, with argument routing, framework auto-selection, and structured CLEAR-scored output delivery.
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
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:prompt "my vague prompt"` invokes sk-prompt-improver and delivers an enhanced prompt with CLEAR score ≥ 40/50
- **SC-002**: Command file passes command_template.md validation checklist (§15) — all required items checked
- **SC-003**: Mode prefix detection correctly routes `$text`, `$improve`, `$refine`, `$short`, `$json`, `$yaml`, `$raw` to appropriate sk-prompt-improver modes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-prompt-improver skill must exist and be functional | Command cannot work without the skill | Skill already exists and is complete (verified in 001-initial-creation spec) |
| Risk | Mode prefix conflicts with user prompt text | Low | Mode prefixes use $ symbol which is unlikely in natural prompt text |
| Risk | Command complexity creep beyond 250 LOC | Medium | Keep command as thin wrapper; all logic lives in skill, not command |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Command loads and begins execution in < 2s (skill file read time)

### Security

- **NFR-S01**: No API keys or credentials in command file
- **NFR-S02**: Enhanced prompts not persisted without explicit user request

### Reliability

- **NFR-R01**: Command gracefully handles missing sk-prompt-improver skill with clear error message
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty input: Mandatory gate triggers; user prompted for prompt text
- Very long input (>2000 tokens): Skill handles truncation/summarization per its RULES
- Mode prefix only (e.g., just `$improve`): Treat as empty prompt, trigger gate

### Error Scenarios

- sk-prompt-improver SKILL.md not found: Return STATUS=FAIL with clear error and skill path
- Invalid mode prefix: Default to Interactive mode with notification
- CLEAR score below threshold: Skill handles re-iteration; command relays result

### State Transitions

- User cancels during :confirm mode: Return STATUS=CANCELLED
- Mode prefix + :auto/:confirm combined: Parse both (mode prefix first, execution suffix second)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 1 file create, ~150-200 LOC, 1 system (command framework) |
| Risk | 3/25 | No API, no auth, no breaking changes |
| Research | 5/20 | Pattern analysis from existing create commands + sk-prompt-improver |
| **Total** | **13/70** | **Level 2 Appropriate** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — all requirements are clear based on sk-prompt-improver SKILL.md and command_template.md patterns.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Skill Reference**: `.opencode/skill/sk-prompt-improver/SKILL.md`
- **Command Template**: `.opencode/skill/sk-doc/assets/agents/command_template.md`
