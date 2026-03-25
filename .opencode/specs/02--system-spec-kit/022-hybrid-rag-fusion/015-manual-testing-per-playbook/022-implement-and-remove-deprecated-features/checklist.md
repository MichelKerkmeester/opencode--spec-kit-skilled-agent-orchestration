---
title: "Verification Checklist: manual-testing-per-playbook implement-and-remove-deprecated-features phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 022 deprecated-feature scenarios PB-022-01 through PB-022-03."
trigger_phrases:
  - "phase 022 checklist"
  - "deprecated features checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook implement-and-remove-deprecated-features phase

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

- [ ] CHK-001 [P0] Playbook source and Phase 022 catalog packet were read before execution
- [ ] CHK-002 [P0] Exact prompts and pass criteria for PB-022-01 through PB-022-03 were extracted before testing
- [ ] CHK-003 [P1] A representative REMOVE target was selected before PB-022-02
- [ ] CHK-004 [P1] Baseline state for the selected target was captured before any workflow steps
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] PB-022-01 has explicit evidence for all six implement/remove targets
- [ ] CHK-011 [P0] PB-022-02 has pre-workflow and post-workflow evidence for the selected target
- [ ] CHK-012 [P0] PB-022-03 has grep or trace evidence for residual runtime and documentation references
- [ ] CHK-013 [P1] Any blocked or partially executable removal step is documented explicitly
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] PB-022-01 executed and verdict recorded
- [ ] CHK-021 [P0] PB-022-02 executed and verdict recorded
- [ ] CHK-022 [P0] PB-022-03 executed and verdict recorded
- [ ] CHK-023 [P1] Phase coverage reported as 3/3 with no skipped scenarios
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret values or unnecessary runtime internals were copied into evidence artifacts
- [ ] CHK-031 [P1] Any reversible workflow step restored the selected target to a safe baseline state
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `tasks.md`, `checklist.md`, and `implementation-summary.md` agree on the three scenario states
- [ ] CHK-041 [P2] Any remaining dead references or follow-up cleanup are documented explicitly
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary evidence stays inside this phase folder or its `scratch/` directory
- [ ] CHK-051 [P2] Any temporary grep notes are removed or promoted into the packet before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending execution
<!-- /ANCHOR:summary -->

