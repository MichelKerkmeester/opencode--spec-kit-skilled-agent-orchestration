---
title: "Feature Specification: Agent System Improvements [005-agent-system-improvements/spec]"
description: "This specification defines 9 targeted improvements to the OpenCode agent, command, and skill documentation. All changes are documentation/instruction-level refinements - no new ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "agent"
  - "system"
  - "improvements"
  - "spec"
  - "005"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Agent System Improvements

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This specification defines 9 targeted improvements to the OpenCode agent, command, and skill documentation. All changes are documentation/instruction-level refinements - no new agents, systems, or architectural changes. Research validated the existing system is architecturally sound; improvements address documentation gaps (missing verification sections, diagrams) and consistency issues (naming).

**Key Decisions**: Documentation-only changes, AGENTS.md out of scope

**Critical Dependencies**: None - all changes are self-contained documentation updates

---

<!-- /ANCHOR:executive-summary -->


<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-01-27 |

---

<!-- /ANCHOR:metadata -->


<!-- ANCHOR:problem-purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Agent documentation has inconsistencies (naming: @write vs @documentation-writer), missing verification sections (speckit.md, orchestrate.md lack OUTPUT VERIFICATION), and no visual workflow diagrams. This causes confusion during task routing and allows false completion claims.

### Purpose
Improve agent system reliability by adding missing verification sections, visual diagrams, and fixing naming inconsistencies - all through documentation updates only.

---

<!-- /ANCHOR:problem-purpose -->


<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Agent files: orchestrate.md, speckit.md, research.md
- Command files: complete.md, research.md, debug.md, implement.md
- Skill files: (none in this iteration)

### Out of Scope
- AGENTS.md - explicitly excluded per user requirement
- New agents or systems
- Architectural changes
- Hook implementations

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/orchestrate.md` | Modify | Fix @write naming (4 locations), add OUTPUT VERIFICATION, add PDR protocol, add Mermaid diagram, add scaling heuristics, enhance task template |
| `.opencode/agent/speckit.md` | Modify | Add OUTPUT VERIFICATION section |
| `.opencode/agent/research.md` | Modify | Add HARD BLOCK verification section |
| `.opencode/command/spec_kit/complete.md` | Modify | Add Mermaid workflow diagram |
| `.opencode/command/spec_kit/research.md` | Modify | Fix Q5/Q6 duplicate numbering |
| `.opencode/command/spec_kit/debug.md` | Modify | Complete "for default" text |
| `.opencode/command/spec_kit/implement.md` | Modify | Complete "for default" text |

---

<!-- /ANCHOR:scope -->


<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add OUTPUT VERIFICATION to speckit.md | Section exists with file verification checklist |
| REQ-002 | Add OUTPUT VERIFICATION to orchestrate.md | Section exists with synthesis verification checklist |
| REQ-003 | Fix @documentation-writer → @write in orchestrate.md | All 4 locations updated, no orphan references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add Mermaid diagram to complete.md | Flowchart visible after Section 3 |
| REQ-005 | Add Mermaid diagram to orchestrate.md | Flowchart visible after Section 1 |
| REQ-006 | Add HARD BLOCK verification to research.md | Section exists with 3-gate verification |
| REQ-007 | Add Pre-Delegation Reasoning protocol | PDR section exists in orchestrate.md Section 11 |
| REQ-008 | Fix minor command file issues | Q5→Q6, "for default" text completed |
| REQ-009 | Add task description template enhancement | Objective, Boundary, Scale fields added |
| REQ-010 | Add scaling heuristics section | Agent count guidance table exists |

---

<!-- /ANCHOR:requirements -->


<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 files modified with documented changes
- **SC-002**: No orphan @documentation-writer references remain
- **SC-003**: All new sections follow existing document patterns

---

<!-- /ANCHOR:success-criteria -->


<!-- ANCHOR:risks-dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking existing agent behavior | Low | Documentation-only changes, no code |
| Risk | Inconsistent section numbering | Low | Follow existing patterns |
| Dependency | None | N/A | Self-contained changes |

---

<!-- /ANCHOR:risks-dependencies -->


<!-- ANCHOR:non-functional-requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No impact - documentation only

### Security
- **NFR-S01**: No security implications

### Reliability
- **NFR-R01**: Improved - better verification reduces false completions

---

<!-- /ANCHOR:non-functional-requirements -->


<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: N/A - documentation changes
- Maximum length: Diagrams should fit in standard markdown renderers

### Error Scenarios
- Mermaid not rendering: Use text fallback in documentation

---

<!-- /ANCHOR:edge-cases -->


<!-- ANCHOR:complexity-assessment -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 7, LOC: ~300, Systems: 0 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | 10-agent parallel research completed |
| Multi-Agent | 12/15 | 10 workstreams in research phase |
| Coordination | 10/15 | Dependencies: minimal |
| **Total** | **60/100** | **Level 3+ (due to research complexity)** |

---

<!-- /ANCHOR:complexity-assessment -->


<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Mermaid diagrams don't render | L | L | Test in preview first |
| R-002 | Section numbering conflicts | M | L | Review existing structure |

---

<!-- /ANCHOR:risk-matrix -->


<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Clear Workflow Visualization (Priority: P1)

**As a** developer using /spec_kit:complete, **I want** a visual workflow diagram, **so that** I understand the 14-step process at a glance.

**Acceptance Criteria**:
1. Given the complete.md file, When I view Section 3, Then I see a Mermaid flowchart

### US-002: Reliable Completion Verification (Priority: P0)

**As a** speckit agent, **I want** explicit verification rules, **so that** I don't falsely claim completion.

**Acceptance Criteria**:
1. Given speckit.md, When I complete work, Then I must pass OUTPUT VERIFICATION checklist

---

<!-- /ANCHOR:user-stories -->


<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Implementation Review | User | Pending | |

---

<!-- /ANCHOR:approval-workflow -->


<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [x] Follows existing documentation patterns
- [x] No new dependencies introduced

---

<!-- /ANCHOR:compliance-checkpoints -->


<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Product Owner | High | Direct conversation |

---

<!-- /ANCHOR:stakeholder-matrix -->


<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v1.0 (2026-01-27)
**Initial specification**
- 9 recommendations from research
- AGENTS.md explicitly out of scope

---

<!-- /ANCHOR:change-log -->


<!-- ANCHOR:open-questions -->
## 16. OPEN QUESTIONS

- None - all questions resolved in research phase

---

<!-- /ANCHOR:open-questions -->


<!-- ANCHOR:related-documents -->
## RELATED DOCUMENTS

- **Analysis**: See `001-analysis-agent-system-architecture.md`
- **Recommendations**: See `002-recommendations-agent-system-improvements.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

<!-- /ANCHOR:related-documents -->
