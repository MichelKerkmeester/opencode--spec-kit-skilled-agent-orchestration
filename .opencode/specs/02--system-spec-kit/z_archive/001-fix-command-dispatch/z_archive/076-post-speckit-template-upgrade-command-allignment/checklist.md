---
title: "Checklist: Post-SpecKit Template Upgrade - Command [076-post-speckit-template-upgrade-command-allignment/checklist]"
description: "checklist document for 076-post-speckit-template-upgrade-command-allignment."
trigger_phrases:
  - "checklist"
  - "post"
  - "speckit"
  - "template"
  - "upgrade"
  - "076"
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
- [x] CHK-005: All spec_kit commands (7) have standardized section headers
- [x] CHK-006: All memory commands (4) have standardized section headers
- [x] CHK-007: All create commands (6) have standardized section headers
- [x] CHK-008: All search commands (2) have standardized section headers

### Mandatory Gates
- [x] CHK-009: /memory:search has mandatory gate for required args

### Validation
- [x] CHK-010: All 19 commands pass compliance check post-update
- [x] CHK-011: No regression in command functionality

---

## P1 - Must Complete (Can Defer with Approval)

### Frontmatter Corrections
- [x] CHK-012: /create:skill argument-hint uses `<skill-name>` format
- [x] CHK-013: /create:agent argument-hint uses `<agent-name>` format

### Spec_Kit Enhancements
- [x] CHK-014: OUTPUT FORMATS section added to complete.md
- [x] CHK-015: OUTPUT FORMATS section added to implement.md
- [x] CHK-016: OUTPUT FORMATS section added to plan.md
- [x] CHK-017: OUTPUT FORMATS section added to research.md

### Cross-References
- [x] CHK-018: /memory:database line 393+ fixed (checkpoint reference)

### YAML Asset Alignment (Added 2026-01-21)
- [x] CHK-021: All 20 YAML assets analyzed for SpecKit v1.9.0 compliance
- [x] CHK-022: spec_kit_plan YAMLs have implementation-summary.md in Level 1
- [x] CHK-023: spec_kit_resume YAMLs use anchor-based memory retrieval
- [x] CHK-024: spec_kit_research YAMLs updated to v1.9.0 with critical rules
- [x] CHK-025: All 5 create namespace YAMLs have version/mode headers
- [x] CHK-026: create_agent.yaml uses unified permission format (not dual-object)
- [x] CHK-027: create_agent.yaml uses "secondary" terminology (not "subagent")

---

## P2 - Can Defer (Optional Improvements)

### Documentation
- [x] CHK-019: Implementation summary completed
- [x] CHK-020: Spec folder documentation complete

---

## Verification Evidence

| Item | Evidence | Verified By | Date |
|------|----------|-------------|------|
| CHK-001-004 | 10 Opus agents returned findings | Orchestrator | 2026-01-20 |
| CHK-005-008 | `grep -r "🔜" .opencode/command/` = 0 matches | Grep tool | 2026-01-20 |
| CHK-009 | `grep "MANDATORY FIRST" memory/search.md` found | Grep tool | 2026-01-20 |
| CHK-010-011 | Manual verification post-edit | Orchestrator | 2026-01-20 |
| CHK-012 | `grep "<skill-name>" skill.md` confirmed | Grep tool | 2026-01-20 |
| CHK-013 | `grep "<agent-name>" agent.md` confirmed | Grep tool | 2026-01-20 |
| CHK-014-017 | `grep "OUTPUT FORMATS" spec_kit/` = 7 files | Grep tool | 2026-01-20 |
| CHK-018 | `grep "checkpoint restore" database.md` confirmed | Grep tool | 2026-01-20 |
| CHK-021 | 10 Opus agents analyzed 20 YAML files | Orchestrator | 2026-01-21 |
| CHK-022 | `grep "implementation-summary.md" spec_kit_plan_*.yaml` = 2 | Grep tool | 2026-01-21 |
| CHK-023 | `grep "anchors:" spec_kit_resume_*.yaml` = 2 | Grep tool | 2026-01-21 |
| CHK-024 | `grep "v1.9.0" spec_kit_research_*.yaml` = 2 | Grep tool | 2026-01-21 |
| CHK-025 | `grep "Version: 1.9.0" create/*.yaml` = 5 | Grep tool | 2026-01-21 |
| CHK-026 | `grep "permission_reference:" create_agent.yaml` = 1 | Grep tool | 2026-01-21 |
| CHK-027 | `grep "secondary:" create_agent.yaml` = 1 | Grep tool | 2026-01-21 |

---

## Sign-Off (Level 3+)

| Role | Status | Date |
|------|--------|------|
| User | PENDING | - |
| AI Orchestrator | COMPLETE | 2026-01-20 |
