---
title: "Verification Checklist: manual-testing-per-playbook maintenance phase"
description: "Verification checklist for Phase 004 maintenance scenarios EX-014 and EX-035. All items unchecked — pending execution."
trigger_phrases:
  - "maintenance checklist"
  - "phase 004 checklist"
  - "EX-014 EX-035 checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook maintenance phase

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

- [ ] CHK-001 [P0] Playbook context read for 04--maintenance
- [ ] CHK-002 [P0] Feature catalog context read for 04--maintenance
- [ ] CHK-003 [P0] MCP server verified running before first tool call
- [ ] CHK-004 [P0] Target spec folder for EX-014 identified (at least one markdown file)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-030 [P1] Evidence for each scenario captured (tool output or screenshot)
- [ ] CHK-031 [P1] implementation-summary.md filled with verdicts and evidence
- [ ] CHK-032 [P1] Both verdicts use review-protocol terminology (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] EX-014 (memory_index_scan incremental) executed and tool output captured
- [ ] CHK-011 [P0] EX-014 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-012 [P0] EX-035 (startup runtime compatibility guards) executed and diagnostic output captured
- [ ] CHK-013 [P0] EX-035 verdict recorded (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P0] EX-014 used incremental mode (not force: true) unless playbook requires otherwise
- [ ] CHK-021 [P1] Corpus state noted before and after EX-014
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md are consistent with each other
- [ ] CHK-041 [P2] Any discovered issues logged as open questions in spec.md §10
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Evidence artifacts stored in `scratch/` only
- [ ] CHK-051 [P2] Memory save triggered after execution to preserve session context
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->
