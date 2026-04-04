---
title: "Implementation Plan: create:prompt Command [03--commands-and-skills/017-cmd-create-prompt/plan]"
description: "Mode-based command wrapping sk-prompt-improver with argument routing and CLEAR scoring"
trigger_phrases:
  - "implementation"
  - "plan"
  - "create"
  - "prompt"
  - "command"
  - "017"
  - "cmd"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: create:prompt Command

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (OpenCode command format) |
| **Framework** | OpenCode command system (frontmatter-driven) |
| **Storage** | None (conversation-only output) |
| **Testing** | Manual invocation + command_template.md validation checklist |

### Overview

Create a single command file (`.opencode/command/create/prompt.md`) that serves as a user-facing entry point for the sk-prompt-improver skill. The command implements the Mode-Based Command Template pattern from command_template.md, with argument dispatch for sk-prompt-improver mode prefixes and :auto/:confirm execution modes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-003)
- [x] Dependencies identified (sk-prompt-improver exists)

### Definition of Done

- [ ] Command file created at `.opencode/command/create/prompt.md`
- [ ] All command_template.md validation checklist items pass
- [ ] Manual invocation test succeeds
- [ ] Spec docs updated (implementation-summary.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mode-Based Workflow Command (command_template.md §11) with Argument Dispatch (§12)

### Key Components

- **Mandatory Gate**: Blocks execution without explicit prompt input; prevents context inference
- **Argument Router**: Detects mode prefix ($text, $improve, etc.) and execution mode (:auto/:confirm)
- **Skill Loader**: Reads sk-prompt-improver SKILL.md and routes to appropriate references based on detected mode
- **Enhancement Pipeline**: Delegates to sk-prompt-improver's DEPTH processing → Framework Selection → CLEAR Scoring
- **Status Reporter**: Returns structured STATUS=OK/FAIL/CANCELLED output

### Data Flow

```
User invocation → Mandatory Gate → Argument Router → Skill Loader → Enhancement Pipeline → CLEAR Score → Delivery
     │                 │                │                  │                │                    │
     └── $ARGUMENTS    └── Parse mode   └── Load SKILL.md └── DEPTH rounds └── Score ≥40/50    └── STATUS output
         prefix             + refs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structure

- [ ] Create command file with frontmatter
- [ ] Implement mandatory gate pattern
- [ ] Add PURPOSE and CONTRACT sections

### Phase 2: Core Logic

- [ ] Implement argument dispatch (mode prefix + execution mode detection)
- [ ] Write INSTRUCTIONS section (5 steps: Parse → Load → Enhance → Score → Deliver)
- [ ] Add Gate 3 exemption declaration

### Phase 3: Polish & Verify

- [ ] Add EXAMPLES section (4+ usage patterns)
- [ ] Add NOTES and RELATED COMMANDS sections
- [ ] Verify against command_template.md checklist (§15)
- [ ] Manual invocation verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Invoke `/create:prompt "test prompt"` | CLI |
| Manual | Test mode prefixes ($text, $improve, $raw) | CLI |
| Manual | Test empty invocation (gate fires) | CLI |
| Structural | Verify against command_template.md §15 checklist | Manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-prompt-improver SKILL.md | Internal | Green | Cannot create command without skill |
| command_template.md | Internal | Green | Pattern reference for structure |
| create/ namespace | Internal | Green | Directory exists with other commands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Command file causes errors or conflicts with existing create commands
- **Procedure**: Delete `.opencode/command/create/prompt.md` (single file, no other changes)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Structure) ──► Phase 2 (Core Logic) ──► Phase 3 (Polish & Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Structure | None | Core Logic |
| Core Logic | Structure | Polish & Verify |
| Polish & Verify | Core Logic | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Structure | Low | ~15 min |
| Core Logic | Medium | ~30 min |
| Polish & Verify | Low | ~15 min |
| **Total** | | **~60 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] No other files modified (single file creation)
- [ ] Command name doesn't conflict with existing commands

### Rollback Procedure

1. Delete `.opencode/command/create/prompt.md`
2. Verify `/create:prompt` no longer resolves
3. No data reversal needed (no persistent state)

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
