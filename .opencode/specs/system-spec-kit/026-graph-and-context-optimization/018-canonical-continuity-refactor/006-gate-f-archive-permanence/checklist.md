---
title: "Verification Checklist: Gate F — Archive Permanence [template:level_2/checklist.md]"
description: "Verification Date: 2026-04-11"
trigger_phrases:
  - "gate f checklist"
  - "archive permanence checklist"
  - "retire keep investigate checklist"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: Gate F — Archive Permanence

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

- [ ] CHK-001 [P0] `spec.md` documents Gate F as the archive permanence decision gate, not a new observation phase
- [ ] CHK-002 [P0] `plan.md` uses iter 036's EWMA, seasonality, and stability rules as the execution path
- [ ] CHK-003 [P1] Dependencies on iter 016, iter 020, iter 036, iter 040, and the Gate B metric source are documented
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] If RETIRE is selected, archived rows are removed from live candidate generation
- [ ] CHK-011 [P0] If RETIRE is selected, archived rows stop re-entering the live index path
- [ ] CHK-012 [P1] If RETIRE is selected, a cold snapshot path exists before any live retirement step runs
- [ ] CHK-013 [P1] If KEEP or INVESTIGATE is selected, no out-of-scope runtime cleanup is performed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The 180-day daily series was evaluated with EWMA `alpha=0.1` and weekly seasonality correction
- [ ] CHK-021 [P0] The 30-day stability check includes rolling stddev, max raw-rate spike, and 14-day slope guards
- [ ] CHK-022 [P1] Intent-slice and archive-only query breakdowns were reviewed, not just the global average
- [ ] CHK-023 [P1] Ambiguous, low-volume, or outage days are called out in the evidence package and handled as iter 036 requires
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No retirement path hard-deletes archived source data on the first decision
- [ ] CHK-031 [P0] Human review is required before any RETIRE_CANDIDATE becomes a live retirement action
- [ ] CHK-032 [P1] Snapshot restore readiness is documented if RETIRE is chosen
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all describe the same decision ladder and conditional branch rules
- [ ] CHK-041 [P1] `implementation-summary.md` records the final decision and full evidence package
- [ ] CHK-042 [P2] Any RETIRE or INVESTIGATE follow-up phase reference is linked from this phase summary
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The phase stays read-focused outside this folder unless RETIRE activates the three approved runtime files
- [ ] CHK-051 [P1] Evidence artifacts live in the phase packet and do not leak into unrelated packet folders
- [ ] CHK-052 [P2] Any follow-up spec folder is a separate phase artifact, not undocumented scratch drift
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-04-11
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
