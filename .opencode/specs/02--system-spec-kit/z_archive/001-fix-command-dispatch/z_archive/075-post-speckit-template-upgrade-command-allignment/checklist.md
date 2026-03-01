---
title: "Checklist: Post-SpecKit Template Upgrade - Command [075-post-speckit-template-upgrade-command-allignment/checklist]"
description: "checklist document for 075-post-speckit-template-upgrade-command-allignment."
trigger_phrases:
  - "checklist"
  - "post"
  - "speckit"
  - "template"
  - "upgrade"
  - "075"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Post-SpecKit Template Upgrade - Command Alignment

## P0 - HARD BLOCKERS (Must Complete)

### Research Phase
- [x] CHK-001: Specs 072-075 analyzed for SpecKit changes
- [x] CHK-002: Current system-spec-kit skill state documented
- [x] CHK-003: All 19 commands audited for compliance
- [x] CHK-004: Gap analysis completed with prioritization

### Section Structure
- [ ] CHK-005: All spec_kit commands (7) have standardized section headers
- [ ] CHK-006: All memory commands (4) have standardized section headers
- [ ] CHK-007: All create commands (6) have standardized section headers
- [ ] CHK-008: All search commands (2) have standardized section headers

### Mandatory Gates
- [ ] CHK-009: /memory:search has mandatory gate for required args

### Validation
- [ ] CHK-010: All 19 commands pass compliance check post-update
- [ ] CHK-011: No regression in command functionality

---

## P1 - Must Complete (Can Defer with Approval)

### Frontmatter Corrections
- [ ] CHK-012: /create:skill argument-hint uses `<skill-name>` format
- [ ] CHK-013: /create:agent argument-hint uses `<agent-name>` format

### Spec_Kit Enhancements
- [ ] CHK-014: OUTPUT FORMATS section added to complete.md
- [ ] CHK-015: OUTPUT FORMATS section added to implement.md
- [ ] CHK-016: OUTPUT FORMATS section added to plan.md
- [ ] CHK-017: OUTPUT FORMATS section added to research.md

### Cross-References
- [ ] CHK-018: /memory:database line 393 fixed (checkpoint reference)

---

## P2 - Can Defer (Optional Improvements)

### Additional Sections
- [ ] CHK-019: GATE 3 COMPLIANCE section added where missing
- [ ] CHK-020: RELATED COMMANDS section added where missing
- [ ] CHK-021: SUB-AGENT DELEGATION documented consistently

### Documentation
- [ ] CHK-022: Implementation summary completed
- [ ] CHK-023: Memory context saved for future reference

---

## Verification Evidence

| Item | Evidence | Verified By | Date |
|------|----------|-------------|------|
| CHK-001 | 10-agent research complete | Orchestrator | 2026-01-20 |
| CHK-002 | SKILL.md analysis complete | Agent 5 | 2026-01-20 |
| CHK-003 | Compliance matrix generated | Agent 10 | 2026-01-20 |
| CHK-004 | plan.md created | Orchestrator | 2026-01-20 |

---

## Sign-Off (Level 3+)

### Approval Status

| Role | Status | Notes |
|------|--------|-------|
| User | PENDING | Awaiting implementation phase completion |
| AI Orchestrator | IN PROGRESS | Research complete, implementation pending |

### Quality Gates

| Gate | Status | Evidence |
|------|--------|----------|
| Research Complete | PASS | 10/10 agents returned findings |
| Plan Approved | PENDING | Awaiting user review |
| Implementation Complete | PENDING | 0/12 tasks completed |
| Validation Complete | PENDING | 0/19 commands verified |
