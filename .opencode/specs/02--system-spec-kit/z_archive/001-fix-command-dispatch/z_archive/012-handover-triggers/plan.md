---
title: "Implementation Plan: Utility Template Trigger Keywords - Technical Approach & Architecture [012-handover-triggers/plan]"
description: "Implementation plan for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md."
trigger_phrases:
  - "implementation"
  - "plan"
  - "utility"
  - "template"
  - "trigger"
  - "012"
  - "handover"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Utility Template Trigger Keywords - Technical Approach & Architecture

Implementation plan for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: speckit, skill, keyword-detection
- **Priority**: P1 - Core functionality gap identified
- **Branch**: `007-handover-triggers`
- **Date**: 2025-12-17
- **Spec**: [spec.md](./spec.md)

### Input
Feature specification from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/012-handover-triggers/spec.md`

### Summary
Add three targeted modifications to SKILL.md: (1) new "Utility Template Triggers" subsection documenting keywords, (2) Resource Router pseudocode update for keyword detection, (3) new rule #11 in ALWAYS section. Total estimated LOC: ~60-80 lines added.

### Technical Context

- **Language/Version**: Markdown documentation
- **Primary Dependencies**: None - pure documentation change
- **Storage**: N/A
- **Testing**: Manual verification of SKILL.md structure
- **Target Platform**: AI agent skill system
- **Project Type**: single-project (skill documentation)
- **Performance Goals**: N/A
- **Constraints**: Must maintain backward compatibility with existing SKILL.md structure
- **Scale/Scope**: Single file modification (~80 lines)

---

## 2. QUALITY GATES

**GATE: Must pass before implementation.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Stakeholders identified; decisions path agreed
- [x] Constraints known; risks captured
- [x] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/tasks)
- [ ] No placeholder text remaining
- [ ] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: SKILL.md structure broken, existing functionality impacted
- **Recovery Procedure**: Git revert to previous SKILL.md version

### Constitution Check (Complexity Tracking)

No violations - this is a documentation-only change with no new abstractions.

---

## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/012-handover-triggers
  spec.md              # Feature specification
  plan.md              # This file
  tasks.md             # Task breakdown
  checklist.md         # Validation checklist
  scratch/             # Drafts, prototypes (if needed)
  memory/              # Session context (if needed)
```

### Source Code (Repository Root)

```
.opencode/skills/system-spec-kit/
  SKILL.md             # Target file for modifications
```

### Structure Decision

Single file modification to existing SKILL.md - no new files required.

---

## 4. IMPLEMENTATION PHASES

### Phase 0: Research & Discovery

- **Goal**: Locate exact insertion points in SKILL.md
- **Deliverables**:
  - Line number for "Utility Template Triggers" subsection (~line 79, after "When NOT to Use")
  - Line number for Resource Router update (~line 173)
  - Line number for ALWAYS section rule addition
- **Owner**: AI agent
- **Duration**: 5 minutes
- **Parallel Tasks**: None

### Phase 1: Design & Setup

- **Goal**: Draft exact content for each modification
- **Deliverables**:
  - "Utility Template Triggers" subsection content (keywords organized by category)
  - Resource Router pseudocode addition (keyword matching logic)
  - ALWAYS rule #11 text
- **Owner**: AI agent
- **Duration**: 10 minutes
- **Parallel Tasks**: All three drafts can be prepared in parallel [P]

### Phase 2: Core Implementation

- **Goal**: Apply modifications to SKILL.md
- **Deliverables**:
  - SKILL.md updated with "Utility Template Triggers" subsection
  - SKILL.md updated with Resource Router keyword detection
  - SKILL.md updated with ALWAYS rule #11
- **Owner**: AI agent
- **Duration**: 15 minutes
- **Parallel Tasks**: Must be sequential to avoid edit conflicts

### Phase 3: Validation

- **Goal**: Verify all changes applied correctly
- **Deliverables**:
  - No broken markdown structure
  - All keywords present
  - Section numbering consistent
- **Owner**: AI agent
- **Duration**: 5 minutes
- **Parallel Tasks**: None

---

## 5. TESTING STRATEGY

### Manual Verification

- **Scope**: SKILL.md structure and content integrity
- **Tools**: Read file, visual inspection
- **Coverage Target**: 100% of changes verified

### Validation Checklist

- [ ] "Utility Template Triggers" subsection exists after "When NOT to Use"
- [ ] All 5 handover keyword categories documented
- [ ] Debug delegation keywords documented
- [ ] Resource Router includes keyword detection logic
- [ ] ALWAYS section includes rule #11
- [ ] No broken markdown formatting
- [ ] Section numbers still sequential

---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Modifications complete | 3/3 | Manual count |
| Keywords documented | ~25 | Manual count |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Placeholder text | 0 | Grep for YOUR_VALUE_HERE |
| Broken formatting | 0 | Visual inspection |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Line numbers shifted from analysis | Low | Med | Re-verify insertion points before edit | Implementer |
| R-002 | Section numbering broken | Low | Low | Re-number sections after insertion | Implementer |

### Rollback Plan

- **Rollback Trigger**: SKILL.md structure broken
- **Rollback Procedure**:
  1. Git checkout previous version of SKILL.md
  2. Verify skill still loads correctly
- **Verification**: Skill invocation test

---

## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| SKILL.md file access | Internal | SpecKit | Green | Now | Cannot proceed |

### External Dependencies

None.

---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Product**: N/A
- **Engineering**: AI agent (self)
- **Design**: N/A
- **QA**: Manual verification

### Checkpoints

- **Pre-implementation**: Verify insertion points
- **Post-implementation**: Verify all changes applied

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Checklist**: See `checklist.md` for validation

### Additional References

- SKILL.md: `.opencode/skills/system-spec-kit/SKILL.md`
- Sequential Thinking analysis (provided in user request)

---

## WHEN TO USE THIS TEMPLATE

**Use plan.md when:**
- Creating Level 2 or Level 3 spec folders (moderate to complex features)
- Need to define technical approach and architecture before implementation
- Multiple phases of work requiring coordination

---

<!--
  PLAN TEMPLATE - TECHNICAL APPROACH
  - Defines HOW to build the feature
  - Phases, testing strategy, success metrics
-->
