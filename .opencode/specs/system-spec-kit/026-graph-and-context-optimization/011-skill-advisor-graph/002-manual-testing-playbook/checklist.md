---
title: "Verification Checklist: Playbook Template Alignment"
description: "Checklist for verifying the 24 scenario snippets and root operator guide match the intended playbook contract."
trigger_phrases:
  - "002-manual-testing-playbook"
  - "playbook checklist"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created checklist"
    next_safe_action: "Implement playbook rewrites"
    key_files: ["checklist.md"]
---
# Verification Checklist: Playbook Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |

---

## Template Structure (P0)

- [ ] CHK-001: All 24 scenario snippets contain frontmatter with `title` and `description`
- [ ] CHK-002: All 24 scenario snippets have 5 numbered sections (1. OVERVIEW through 5. SOURCE METADATA)
- [ ] CHK-003: All 24 scenario snippets have "Why This Matters" subsection in section 1
- [ ] CHK-004: All 24 scenario snippets have RCAF prompt in section 2 (CURRENT REALITY)
- [ ] CHK-005: All 24 scenario snippets have RCAF prompt in section 3 (TEST EXECUTION)
- [ ] CHK-006: All 24 scenario snippets have failure triage subsection in section 3
- [ ] CHK-007: All 24 scenario snippets have source files table in section 4
- [ ] CHK-008: Root playbook remains a multi-section operator guide rather than a 5-section snippet

---

## RCAF Prompt Quality (P0)

- [ ] CHK-010: All prompts follow pattern: `As a {ROLE} validation operator, {ACTION} against {TARGET}. Verify {EXPECTED}. Return {FORMAT}.`
- [ ] CHK-011: All prompts reference specific commands or files (not generic placeholders)
- [ ] CHK-012: Expected outcomes in prompts match the actual pass/fail criteria

---

## Path References (P0)

- [ ] CHK-020: Zero bare `skill-advisor/skill_advisor.py` or legacy `.opencode/skill/scripts/skill_advisor.py` references remain in any playbook file
- [ ] CHK-021: All Skill Advisor command paths use `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- [ ] CHK-022: Root playbook links match actual file paths on disk

---

## Root Playbook (P1)

- [ ] CHK-030: Root playbook has execution policy block
- [ ] CHK-031: Root playbook has prerequisites section
- [ ] CHK-032: Root playbook scenario directory matches file inventory
- [ ] CHK-033: Root playbook uses `.opencode/skill/skill-advisor/scripts/` paths throughout when referencing runtime artifacts
- [ ] CHK-034: Root playbook points to the live `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md`

---

## Consistency (P1)

- [ ] CHK-040: Playbook IDs (GB-001, CP-001, RS-001) are consistent between root and snippets
- [ ] CHK-041: Scenario descriptions in root TOC match snippet titles
- [ ] CHK-042: Source metadata in each snippet correctly references its category and file path
