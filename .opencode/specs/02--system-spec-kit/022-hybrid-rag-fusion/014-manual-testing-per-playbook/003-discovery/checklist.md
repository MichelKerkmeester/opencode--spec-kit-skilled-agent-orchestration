---
title: "Verification Checklist: manual-testing-per-playbook discovery phase"
description: "Verification checklist for Phase 003 discovery scenarios EX-011, EX-012, EX-013. All items unchecked — pending execution."
trigger_phrases:
  - "discovery checklist"
  - "phase 003 checklist"
  - "EX-011 EX-012 EX-013 checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook discovery phase

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

- [ ] CHK-001 [P0] Playbook context read for 03--discovery
- [ ] CHK-002 [P0] Feature catalog context read for 03--discovery
- [ ] CHK-003 [P0] MCP server verified running before first tool call
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-030 [P1] Evidence for each scenario captured (tool output or screenshot)
- [ ] CHK-031 [P1] implementation-summary.md filled with verdicts and evidence
- [ ] CHK-032 [P1] All three scenario verdicts use review-protocol terminology (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] EX-011 (memory_list) executed and tool output captured
- [ ] CHK-011 [P0] EX-011 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-012 [P0] EX-012 (memory_stats with composite ranking) executed and tool output captured
- [ ] CHK-013 [P0] EX-012 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-014 [P0] EX-013a (memory_health full mode) executed and tool output captured
- [ ] CHK-015 [P0] EX-013b (memory_health divergent_aliases mode) executed and tool output captured
- [ ] CHK-016 [P0] EX-013 verdict recorded (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P0] autoRepair was NOT triggered during EX-013 execution
- [ ] CHK-021 [P1] Corpus state noted before and after execution
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
| P0 Items | 10 | 0/10 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->
