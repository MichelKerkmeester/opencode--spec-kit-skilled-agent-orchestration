---
title: "Verification Checklist: Fix Create Command Dispatch Vulnerability + Defensive [008-fix-create-dispatch/checklist]"
description: "Verification Date: Pending"
trigger_phrases:
  - "verification"
  - "checklist"
  - "fix"
  - "create"
  - "command"
  - "008"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Fix Create Command Dispatch Vulnerability + Defensive Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Spec 118 guardrail pattern reviewed for consistency

<!-- /ANCHOR:pre-impl -->

---

## Critical Fix (skill.md)

- [ ] CHK-010 [P0] `Task` removed from skill.md allowed-tools frontmatter
- [ ] CHK-011 [P0] Guardrail block inserted at line 7 (after frontmatter)
- [ ] CHK-012 [P0] `/create:skill` executes directly without phantom dispatch

---

## Defensive Hardening

- [ ] CHK-020 [P0] All 6 .md files have guardrail blocks at line 7
- [ ] CHK-021 [P1] agent.md guardrail uses Fix A only (no YAML loading step)
- [ ] CHK-022 [P1] Remaining 5 files use Fix A+B (guardrail + YAML loading prominence)
- [ ] CHK-023 [P1] All @write references remain properly fenced

---

## YAML Assets

- [ ] CHK-030 [P1] All 6 YAML files have `# REFERENCE ONLY` comments
- [ ] CHK-031 [P1] Orphaned create_agent.yaml investigated and documented

---

## Release

- [ ] CHK-040 [P0] CHANGELOG updated with v2.0.1.2 entry
- [ ] CHK-041 [P0] All changes committed
- [ ] CHK-042 [P0] Tagged v2.0.1.2 and pushed
- [ ] CHK-043 [P1] GitHub release created

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec/plan/tasks synchronized with actual implementation
- [ ] CHK-051 [P2] implementation-summary.md created after completion
- [ ] CHK-052 [P2] Findings saved to memory/

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 7 | 0/7 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
