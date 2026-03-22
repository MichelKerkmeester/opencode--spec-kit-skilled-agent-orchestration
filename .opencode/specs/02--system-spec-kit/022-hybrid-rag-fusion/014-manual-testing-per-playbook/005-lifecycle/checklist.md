---
title: "Verification Checklist: manual-testing-per-playbook lifecycle phase"
description: "Verification checklist for Phase 005 lifecycle scenarios EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144. All items unchecked — pending execution."
trigger_phrases:
  - "lifecycle checklist"
  - "phase 005 checklist"
  - "checkpoint lifecycle checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook lifecycle phase

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

- [ ] CHK-001 [P0] Playbook context read for 05--lifecycle
- [ ] CHK-002 [P0] Feature catalog context read for 05--lifecycle
- [ ] CHK-003 [P0] MCP server verified running before first tool call
- [ ] CHK-004 [P0] Baseline checkpoint list noted before EX-015
- [ ] CHK-005 [P1] Baseline memory count noted before EX-017
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-050 [P1] Evidence for all 10 scenarios captured (tool output or screenshot)
- [ ] CHK-051 [P1] implementation-summary.md filled with all verdicts and evidence
- [ ] CHK-052 [P1] All verdicts use review-protocol terminology (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Checkpoint Group
- [ ] CHK-010 [P0] EX-015 (checkpoint_create) executed and tool output captured
- [ ] CHK-011 [P0] EX-015 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-012 [P0] EX-016 (checkpoint_list) executed; EX-015 checkpoint present in list; output captured
- [ ] CHK-013 [P0] EX-016 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-014 [P0] EX-017 (checkpoint_restore) executed and tool output captured
- [ ] CHK-015 [P0] EX-017 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-016 [P0] EX-018 (checkpoint_delete) executed with matching confirmName; output captured
- [ ] CHK-017 [P0] EX-018 verdict recorded (PASS / PARTIAL / FAIL)

### Async and Server Lifecycle
- [ ] CHK-020 [P0] 097 (async ingestion job lifecycle) executed and job reached completed state; output captured
- [ ] CHK-021 [P0] 097 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-022 [P0] 114 (path traversal validation) executed; traversal payload rejected; output captured
- [ ] CHK-023 [P0] 114 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-024 [P0] 124 (automatic archival) executed; archival triggered; output captured
- [ ] CHK-025 [P0] 124 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-026 [P0] 134 (startup pending-file recovery) executed; server restarted; recovery output captured
- [ ] CHK-027 [P0] 134 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-028 [P0] 144 (advisory ingest forecast) executed; forecast output captured
- [ ] CHK-029 [P0] 144 verdict recorded (PASS / PARTIAL / FAIL)
- [ ] CHK-030 [P0] 100 (async shutdown with deadline) executed last; shutdown output captured; server restarted
- [ ] CHK-031 [P0] 100 verdict recorded (PASS / PARTIAL / FAIL)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Scenario 100 was run after all other MCP-dependent scenarios
- [ ] CHK-041 [P0] EX-018 confirmName matched the checkpoint name from EX-015 exactly
- [ ] CHK-042 [P1] MCP server restarted successfully after scenario 100 and scenario 134
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] spec.md, plan.md, tasks.md, and checklist.md are consistent with each other
- [ ] CHK-061 [P2] Any discovered issues logged as open questions in spec.md §10
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Evidence artifacts stored in `scratch/` only
- [ ] CHK-071 [P2] Memory save triggered after execution to preserve session context
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->
