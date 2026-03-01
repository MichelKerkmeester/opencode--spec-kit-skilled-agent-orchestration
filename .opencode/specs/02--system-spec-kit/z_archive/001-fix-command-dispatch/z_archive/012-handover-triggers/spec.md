---
title: "Feature Specification: Utility Template Trigger Keywords - Requirements & User Stories [012-handover-triggers/spec]"
description: "Add automatic keyword detection for handover.md and debug-delegation.md templates to the SpecKit skill, enabling AI agents to recognize session transfer, work continuation, and ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "utility"
  - "template"
  - "trigger"
  - "spec"
  - "012"
  - "handover"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Utility Template Trigger Keywords - Requirements & User Stories

Add automatic keyword detection for handover.md and debug-delegation.md templates to the SpecKit skill, enabling AI agents to recognize session transfer, work continuation, and debug delegation intent.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: speckit, skill, keyword-detection, handover
- **Priority**: P1
- **Feature Branch**: `007-handover-triggers`
- **Created**: 2025-12-17
- **Status**: Draft
- **Input**: Sequential Thinking analysis identifying gap in automatic handover template triggering

### Stakeholders
- AI agents using SpecKit skill
- Developers managing multi-session work

### Purpose
Enable AI agents to automatically suggest handover.md or debug-delegation.md templates when users express intent for session transfer, work continuation, or parallel debugging through natural language keywords.

### Assumptions

- AI agents can pattern-match trigger phrases in user messages
- SKILL.md is the source of truth for SpecKit behavior
- Current Resource Router pseudocode is extensible with keyword detection

**Assumptions Validation Checklist**:
- [x] All assumptions reviewed with stakeholders
- [x] Technical feasibility verified for each assumption
- [x] Risk assessment completed for critical assumptions
- [x] Fallback plans identified for uncertain assumptions

---

## 2. SCOPE

### In Scope
- Add "Utility Template Triggers" subsection to SKILL.md after "When NOT to Use" section
- Update Resource Router pseudocode with keyword detection logic
- Add rule #11 to ALWAYS section for handover keyword detection
- Document both handover and debug-delegation trigger keywords

### Out of Scope
- Automated template creation (user confirmation still required)
- Changes to template files themselves
- Integration with semantic memory system (separate concern)

---

## 3. USERS & STORIES

### User Story 1 - Handover Intent Detection (Priority: P0)

As an AI agent, I need to automatically detect when a user expresses session handover intent so that I can suggest the handover.md template without requiring explicit requests.

**Why This Priority**: P0 because this is the core gap identified - handover intent is currently missed, forcing manual recognition.

**Independent Test**: When user says "hand this over to next AI", agent should suggest handover template.

**Acceptance Scenarios**:
1. **Given** user says "for next AI session", **When** AI parses message, **Then** AI suggests handover.md template
2. **Given** user says "continue this tomorrow", **When** AI parses message, **Then** AI suggests handover.md template
3. **Given** user says "save state for later", **When** AI parses message, **Then** AI suggests handover.md template

---

### User Story 2 - Debug Delegation Intent Detection (Priority: P1)

As an AI agent, I need to detect debug delegation intent so that I can suggest the debug-delegation.md template for parallel debugging workflows.

**Why This Priority**: P1 because debug delegation is a secondary workflow, less common than handover.

**Independent Test**: When user says "delegate debug to sub-agent", agent should suggest debug-delegation template.

**Acceptance Scenarios**:
1. **Given** user says "parallel debug this", **When** AI parses message, **Then** AI suggests debug-delegation.md template
2. **Given** user says "sub-agent debug the auth module", **When** AI parses message, **Then** AI suggests debug-delegation.md template

---

### User Story 3 - Resource Router Enhancement (Priority: P1)

As a SpecKit skill maintainer, I need the Resource Router pseudocode to include keyword detection logic so that the routing decisions are documented and consistent.

**Why This Priority**: P1 because this ensures the skill documentation matches expected behavior.

**Independent Test**: Resource Router pseudocode should show keyword matching before template suggestions.

**Acceptance Scenarios**:
1. **Given** Resource Router pseudocode, **When** reviewing line ~173, **Then** keyword detection logic is present for utility templates

---

## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** SKILL.md MUST include a "Utility Template Triggers" subsection listing all handover trigger keywords
- **REQ-FUNC-002:** SKILL.md MUST include debug-delegation trigger keywords in the same subsection
- **REQ-FUNC-003:** Resource Router pseudocode MUST include keyword detection for utility templates before standard template routing
- **REQ-FUNC-004:** ALWAYS section MUST include rule #11 for handover keyword detection with action to suggest template
- **REQ-FUNC-005:** Trigger keywords MUST cover five categories: session transfer, work continuation, context preservation, session ending, multi-session

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Handover Detection | REQ-FUNC-001, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005 | Core handover functionality |
| Story 2 - Debug Delegation | REQ-FUNC-002, REQ-FUNC-003 | Debug workflow extension |
| Story 3 - Router Enhancement | REQ-FUNC-003 | Documentation consistency |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keyword matching should be instant (no API calls required)

### Usability
- **NFR-U01**: Keywords should be natural language phrases users would actually say
- **NFR-U02**: False positive rate should be low (keywords specific enough to avoid accidental triggers)

---

## 6. EDGE CASES

### False Positives
- What happens when user says "hand" in unrelated context (e.g., "hand me that file")? Keyword is "handover" or "hand over", not just "hand"
- What happens when "continue" appears in code discussion? Keyword is "continue later", "continue tomorrow" - requires temporal qualifier

### Partial Matches
- How does system handle "I'll hand this over to..." vs "handover document"? Both should trigger suggestion

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: 100% of defined trigger keywords documented in SKILL.md
- **SC-002**: Resource Router pseudocode includes keyword detection logic
- **SC-003**: ALWAYS section includes rule #11

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Completeness | Trigger keywords documented | 5 categories, ~20 keywords | Manual review |
| Quality | No placeholder text remaining | 0 placeholders | Grep for YOUR_VALUE_HERE |

---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| SKILL.md file | Internal | SpecKit | Green | Cannot make changes |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Keywords too broad, causing false positives | Med | Low | Use multi-word phrases, require temporal qualifiers | Implementer |
| R-002 | Keywords too narrow, missing user intent | Med | Med | Include variations and synonyms | Implementer |

---

## 9. OUT OF SCOPE

**Explicit Exclusions**:

- Automated template creation without user confirmation
- Integration with memory system triggers (handled by system-memory skill)
- Changes to handover.md or debug-delegation.md template content

---

## 10. OPEN QUESTIONS

- None - analysis from Sequential Thinking is comprehensive

---

## 11. APPENDIX

### Handover Trigger Keywords (from Sequential Thinking Analysis)

**Session Transfer:**
- "handover", "hand over", "for next AI", "for next session", "next agent"

**Work Continuation:**
- "continue later", "pick up later", "resume later", "resume tomorrow"

**Context Preservation:**
- "pass context", "transfer context", "document for continuation"

**Session Ending:**
- "stopping for now", "pausing work", "ending session", "save state"

**Multi-Session:**
- "multi-session", "ongoing work", "long-running"

### Debug Delegation Keywords

- "delegate debug", "sub-agent debug", "parallel debug", "multi-file debug"

---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, tasks.md, etc.
- `memory/` - Session context and conversation history

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` for technical approach and architecture
- **Task Breakdown**: See `tasks.md` for implementation task list organized by user story
- **Validation Checklist**: See `checklist.md` for QA and validation procedures

---

## 12. CHANGELOG

### Version History

#### v1.0 (2025-12-17)
**Initial specification**

---

<!--
  SPEC TEMPLATE - REQUIREMENTS & USER STORIES
  - Defines WHAT needs to be built and WHY
  - User stories prioritized and independently testable
  - Requirements traceable to stories
  - Uses REQ-XXX identifiers for change tracking
-->
