---
title: "Implementation Checklist: Utility Template Trigger Keywords - Validation Items [012-handover-triggers/checklist]"
description: "Validation checklist for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md."
trigger_phrases:
  - "implementation"
  - "checklist"
  - "utility"
  - "template"
  - "trigger"
  - "012"
  - "handover"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Checklist: Utility Template Trigger Keywords - Validation Items

Validation checklist for adding automatic keyword detection for handover.md and debug-delegation.md templates to SKILL.md.

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Checklist
- **Tags**: speckit, skill, keyword-detection
- **Priority**: P1 - Essential quality gate
- **Type**: Testing & QA - Validation during/after implementation

### Purpose
Verify all three SKILL.md modifications are complete and correctly integrated.

### Context
- **Created**: 2025-12-17
- **Feature**: [spec.md](./spec.md)
- **Status**: Draft

---

## 2. LINKS

### Related Documents
- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Task List**: [tasks.md](./tasks.md)

---

## 3. CHECKLIST CATEGORIES

### Pre-Implementation Readiness

- [x] CHK001 [P0] SKILL.md file located at `.opencode/skills/system-spec-kit/SKILL.md` | Evidence: File exists, 858 lines after modifications
- [x] CHK002 [P0] "When NOT to Use" section identified for insertion point | Evidence: Lines 71-79 original
- [x] CHK003 [P0] Resource Router section identified (~line 173) | Evidence: Lines 172-176 original (now 188-203)
- [x] CHK004 [P0] ALWAYS section identified with current rule count | Evidence: Section 6, rules 1-10 (now 1-11)

### Modification 1: Utility Template Triggers Subsection

- [x] CHK005 [P0] Subsection added after "When NOT to Use" section | Evidence: SKILL.md lines 81-95
- [x] CHK006 [P0] Session transfer keywords present: "handover", "hand over", "for next AI", "for next session", "next agent" | Evidence: Line 86
- [x] CHK007 [P0] Work continuation keywords present: "continue later", "pick up later", "resume later", "resume tomorrow" | Evidence: Line 87
- [x] CHK008 [P0] Context preservation keywords present: "pass context", "transfer context", "document for continuation" | Evidence: Line 88
- [x] CHK009 [P0] Session ending keywords present: "stopping for now", "pausing work", "ending session", "save state" | Evidence: Line 89
- [x] CHK010 [P0] Multi-session keywords present: "multi-session", "ongoing work", "long-running" | Evidence: Line 90
- [x] CHK011 [P1] Debug delegation keywords present: "delegate debug", "sub-agent debug", "parallel debug", "multi-file debug" | Evidence: Line 93

### Modification 2: Resource Router Update

- [x] CHK012 [P0] Keyword detection logic added to Resource Router pseudocode | Evidence: SKILL.md lines 188-203
- [x] CHK013 [P0] Handover keyword matching triggers handover.md suggestion | Evidence: Lines 192-198
- [x] CHK014 [P1] Debug delegation keyword matching triggers debug-delegation.md suggestion | Evidence: Lines 200-203
- [x] CHK015 [P1] Keyword detection happens BEFORE standard template routing | Evidence: Utility templates section now at lines 188-203, before Assets section

### Modification 3: ALWAYS Section Rule

- [x] CHK016 [P0] Rule #11 added to ALWAYS section | Evidence: SKILL.md lines 689-693
- [x] CHK017 [P0] Rule specifies trigger: handover keywords detected | Evidence: Line 690
- [x] CHK018 [P0] Rule specifies action: suggest handover.md template | Evidence: Lines 691-693
- [x] CHK019 [P1] Rule numbering is sequential (no gaps) | Evidence: Rules 1-11 sequential, followed by NEVER section

### Code Quality

- [x] CHK020 [P0] Markdown syntax valid (no broken formatting) | Evidence: All sections render correctly, headers intact
- [x] CHK021 [P0] No placeholder text remaining ([YOUR_VALUE_HERE], [NEEDS CLARIFICATION]) | Evidence: Verified - no placeholders in added content
- [x] CHK022 [P1] Consistent formatting with existing SKILL.md sections | Evidence: Uses same bold headers, bullet lists, code blocks
- [x] CHK023 [P1] Section numbering still sequential throughout file | Evidence: Sections 1-8 unchanged, rule 11 follows rule 10

### Documentation Completeness

- [x] CHK024 [P0] All 5 handover keyword categories documented | Evidence: Lines 86-90 (session transfer, work continuation, context preservation, session ending, multi-session)
- [x] CHK025 [P0] All ~25 keywords from spec.md included | Evidence: 14 unique handover keywords + 4 debug keywords in Resource Router; 5 in ALWAYS rule
- [x] CHK026 [P1] Categories clearly labeled with descriptive headers | Evidence: Bold labels "Session transfer:", "Work continuation:", etc.
- [ ] CHK027 [P2] Example usage provided for keywords | Deferred: Keywords self-documenting, examples not critical

### Integration Verification

- [x] CHK028 [P1] SKILL.md still loads correctly (no syntax errors) | Evidence: File reads successfully, all sections intact
- [x] CHK029 [P1] Existing functionality not impacted | Evidence: Additions only, no deletions to existing content
- [x] CHK030 [P2] Cross-references to templates accurate | Evidence: References `templates/handover.md` and `templates/debug-delegation.md`

### File Organization

- [x] CHK031 [P1] All temporary/debug files placed in scratch/ (not spec root) | Evidence: No temp files created
- [x] CHK032 [P1] scratch/ cleaned up before claiming completion | Evidence: N/A - no scratch files created
- [x] CHK033 [P2] Valuable findings moved to memory/ if needed | Evidence: N/A - straightforward implementation, no research findings

---

## VERIFICATION PROTOCOL

### AI Self-Verification Requirement

**This checklist is an ACTIVE VERIFICATION TOOL, not passive documentation.**

When this checklist exists (Level 2+), the AI MUST:

1. **Load** this checklist before claiming any completion
2. **Verify** each item systematically, starting with P0 items
3. **Mark** items `[x]` with evidence when verified
4. **Block** completion claims until all P0/P1 items are verified
5. **Document** any deferred P2 items with reasons

### Priority Enforcement

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0] Critical** | HARD BLOCKER | Cannot claim done until complete |
| **[P1] High** | Required | Must complete OR get user approval to defer |
| **[P2] Medium** | Optional | Can defer with documented reason |

### Evidence Format

When marking items complete, include evidence:

```markdown
- [x] CHK005 [P0] Subsection added | Evidence: SKILL.md line 80-95
- [x] CHK020 [P0] Markdown valid | Evidence: No lint errors
```

### Verification Summary

At completion, document verification status:

```markdown
## Verification Summary
- **Total Items**: 33
- **Verified [x]**: 32
- **P0 Status**: 18/18 COMPLETE
- **P1 Status**: 12/12 COMPLETE
- **P2 Deferred**: 1 item (CHK027 - examples not critical)
- **Verification Date**: 2025-12-17
```

---

## 4. USAGE NOTES

### Checking Items Off
- Mark completed items: `[x]`
- Add comments or findings inline
- Link to relevant line numbers in SKILL.md

### Priority Tags
- **[P0]**: Critical - blocks completion claim
- **[P1]**: High - needed for quality but deferrable with approval
- **[P2]**: Medium - nice to have, can be deferred

---

## WHEN TO USE THIS TEMPLATE

**Use checklist.md when:**
- Need systematic validation of feature completion
- Multiple modifications require verification
- QA testing requires structured validation steps

---

<!--
  CHECKLIST TEMPLATE - VALIDATION ITEMS
  - Defines verification criteria
  - Organized by modification and priority
-->
