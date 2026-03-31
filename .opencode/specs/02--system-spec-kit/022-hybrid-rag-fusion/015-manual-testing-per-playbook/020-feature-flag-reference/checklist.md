---
title: "Verific [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/checklist]"
description: "Verification checklist for Phase 020 feature-flag-reference audit scenarios PB-020-01 through PB-020-03."
trigger_phrases:
  - "phase 020 checklist"
  - "feature-flag-reference audit checklist"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook feature-flag-reference audit phase

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

- [ ] CHK-001 [P0] Playbook source and Phase 020 catalog packet were read before execution
- [ ] CHK-002 [P0] Exact prompts and pass criteria for PB-020-01 through PB-020-03 were extracted before testing
- [ ] CHK-003 [P1] A reversible graduated flag target was selected before PB-020-03
- [ ] CHK-004 [P1] Evidence capture format was chosen before running inventory and toggle checks
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] PB-020-01 has a documented comparison between documented counts and code counts
- [ ] CHK-011 [P0] PB-020-02 has explicit evidence for catalog default state and runtime default state
- [ ] CHK-012 [P0] PB-020-03 has pre-toggle and post-toggle evidence with baseline restored
- [ ] CHK-013 [P1] Any inert or undocumented flag cases are described explicitly rather than implied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] PB-020-01 executed and verdict recorded
- [ ] CHK-021 [P0] PB-020-02 executed and verdict recorded
- [ ] CHK-022 [P0] PB-020-03 executed and verdict recorded
- [ ] CHK-023 [P1] Phase coverage reported as 3/3 with no skipped scenarios
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret values were copied into evidence artifacts
- [ ] CHK-031 [P1] PB-020-03 runtime state was restored after the toggle workflow
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `tasks.md`, `checklist.md`, and `implementation-summary.md` agree on the scenario verdicts
- [ ] CHK-041 [P2] Follow-up inventory drift or inert-flag ambiguity is documented for later cleanup if discovered
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary evidence stays inside this phase folder or its `scratch/` directory
- [ ] CHK-051 [P2] Any follow-up notes are removed or promoted into the packet before completion
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

