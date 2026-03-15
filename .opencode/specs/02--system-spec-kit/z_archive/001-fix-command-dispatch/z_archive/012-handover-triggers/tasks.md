---
title: "Tasks: Utility Template Trigger Keywords - Implementation Breakdown [012-handover-triggers/tasks]"
description: "Task list for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md."
trigger_phrases:
  - "tasks"
  - "utility"
  - "template"
  - "trigger"
  - "keywords"
  - "012"
  - "handover"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Utility Template Trigger Keywords - Implementation Breakdown

Task list for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

<!-- ANCHOR:notation -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: speckit, skill, keyword-detection
- **Priority**: P1 - Core functionality gap

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/012-handover-triggers`

### Prerequisites
- **Required**: `plan.md`, `spec.md`
- **Optional**: None

### Organization
Tasks are grouped by the three required SKILL.md modifications.

---

<!-- /ANCHOR:notation -->
## 2. CONVENTIONS

### Task Format

```text
- [ ] T### [P?] Description
```

**Format Elements:**
- **[P]**: Can run in parallel
- Include exact file paths in descriptions
- ID format: `T###`

### Path Conventions
- **Target file**: `.opencode/skills/system-spec-kit/SKILL.md`

---

## WORKING FILES LOCATION

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Draft content before insertion | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

---

## 3. TASK GROUPS BY MODIFICATION

### Phase 0: Research (Verify Insertion Points)

**Purpose**: Confirm exact line numbers for modifications

- [ ] T001 Read SKILL.md and locate "When NOT to Use" section (target: insert after ~line 79)
- [ ] T002 Read SKILL.md and locate Resource Router pseudocode (target: ~line 173)
- [ ] T003 Read SKILL.md and locate ALWAYS section rules (target: add rule #11)

**Checkpoint**: Insertion points verified - content drafting can begin

---

### Phase 1: User Story 1 - Handover Detection (Priority: P0)

**Goal**: Add "Utility Template Triggers" subsection with all handover keywords

**Implementation:**
- [ ] T004 Draft "Utility Template Triggers" subsection content with 5 keyword categories:
  - Session transfer: "handover", "hand over", "for next AI", "for next session", "next agent"
  - Work continuation: "continue later", "pick up later", "resume later", "resume tomorrow"
  - Context preservation: "pass context", "transfer context", "document for continuation"
  - Session ending: "stopping for now", "pausing work", "ending session", "save state"
  - Multi-session: "multi-session", "ongoing work", "long-running"
- [ ] T005 Insert subsection into SKILL.md after "When NOT to Use" section

**Checkpoint**: Handover keywords documented in SKILL.md

---

### Phase 2: User Story 2 - Debug Delegation Detection (Priority: P1)

**Goal**: Add debug delegation keywords to the same subsection

**Implementation:**
- [ ] T006 Add debug delegation keywords to "Utility Template Triggers" subsection:
  - "delegate debug", "sub-agent debug", "parallel debug", "multi-file debug"

**Checkpoint**: Debug delegation keywords documented alongside handover keywords

---

### Phase 3: User Story 3 - Resource Router Enhancement (Priority: P1)

**Goal**: Update Resource Router pseudocode with keyword detection logic

**Implementation:**
- [ ] T007 Draft keyword detection logic for Resource Router pseudocode:
  ```
  # Utility template keyword detection (before standard routing)
  if message contains handover_keywords:
      suggest handover.md template
  if message contains debug_delegation_keywords:
      suggest debug-delegation.md template
  ```
- [ ] T008 Insert keyword detection logic into Resource Router section (~line 173)

**Checkpoint**: Resource Router includes keyword matching

---

### Phase 4: ALWAYS Section Update

**Goal**: Add rule #11 for handover keyword detection

**Implementation:**
- [ ] T009 Draft rule #11 text:
  - Trigger: Handover keywords detected in user message
  - Action: Suggest handover.md template for session transfer
- [ ] T010 Insert rule #11 into ALWAYS section

**Checkpoint**: ALWAYS section includes handover keyword detection rule

---

### Phase 5: Validation

**Purpose**: Verify all changes applied correctly

- [ ] T011 Verify "Utility Template Triggers" subsection present and complete
- [ ] T012 Verify Resource Router includes keyword detection
- [ ] T013 Verify ALWAYS section includes rule #11
- [ ] T014 Verify no broken markdown formatting
- [ ] T015 Verify section numbering still sequential

**Checkpoint**: All modifications verified

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] Markdown syntax valid
- [ ] No broken links or references
- [ ] Consistent formatting with existing SKILL.md

### Documentation
- [ ] All keywords from spec.md included
- [ ] Categories clearly labeled
- [ ] Action items clearly stated

### Review & Sign-off
- [ ] Owner review and sign-off
- [ ] Paths and naming follow conventions

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
- **Checklist**: See `checklist.md` for validation

---

## WHEN TO USE THIS TEMPLATE

**Use tasks.md when:**
- Creating Level 2 or Level 3 spec folders
- Feature requires breaking down into discrete, trackable tasks
- Multiple modifications need independent tracking

---

<!--
  TASKS TEMPLATE - IMPLEMENTATION BREAKDOWN
  - Defines discrete, trackable work items
  - Organized by user story/phase
-->
