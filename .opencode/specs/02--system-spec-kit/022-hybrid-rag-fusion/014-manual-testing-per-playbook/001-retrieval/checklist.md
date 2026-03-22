---
title: "Verification Checklist: manual-testing-per-playbook retrieval phase [template:level_2/checklist.md]"
description: "Verification checklist for phase 001 retrieval: 11 scenarios (EX-001, M-001, EX-002, M-002, EX-003, EX-004, EX-005, 086, 109, 142, 143) — all items unchecked, awaiting execution."
trigger_phrases:
  - "retrieval checklist"
  - "phase 001 verification"
  - "manual retrieval checklist"
  - "EX-001 EX-002 EX-003 EX-004 EX-005 086 109 142 143 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: manual-testing-per-playbook retrieval phase

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

- [ ] CHK-001 [P0] Playbook files for 01--retrieval confirmed accessible
- [ ] CHK-002 [P0] Feature catalog files for 01--retrieval confirmed accessible
- [ ] CHK-003 [P0] Review protocol loaded and verdict rules understood
- [ ] CHK-004 [P0] MCP runtime healthy — `memory_context`, `memory_search`, `memory_match_triggers` all respond
- [ ] CHK-005 [P1] Sandbox data and checkpoint strategy prepared for scenarios 086 and 143
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-030 [P1] Evidence captured for each executed scenario (output excerpt or observation)
- [ ] CHK-031 [P1] Feature catalog cross-reference verified for each scenario
- [ ] CHK-032 [P1] PARTIAL verdicts include a root-cause note and remediation suggestion
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Each item below must be marked `[x]` with a verdict (PASS / PARTIAL / FAIL) and an evidence reference before this phase is complete.

- [ ] CHK-010 [P0] EX-001 executed and verdicted — Unified context retrieval (memory_context)
- [ ] CHK-011 [P0] M-001 executed and verdicted — Context Recovery and Continuation
- [ ] CHK-012 [P0] EX-002 executed and verdicted — Semantic and lexical search (memory_search)
- [ ] CHK-013 [P0] M-002 executed and verdicted — Targeted Memory Lookup
- [ ] CHK-014 [P0] EX-003 executed and verdicted — Trigger phrase matching (memory_match_triggers)
- [ ] CHK-015 [P0] EX-004 executed and verdicted — Hybrid search pipeline
- [ ] CHK-016 [P0] EX-005 executed and verdicted — 4-stage pipeline architecture
- [ ] CHK-017 [P0] 086 executed and verdicted — BM25 trigger phrase re-index gate
- [ ] CHK-018 [P0] 109 executed and verdicted — Quality-aware 3-tier search fallback
- [ ] CHK-019 [P0] 142 executed and verdicted — Session transition trace contract
- [ ] CHK-020 [P0] 143 executed and verdicted — Bounded graph-walk rollout and diagnostics
- [ ] CHK-021 [P0] All 11 scenarios assigned a verdict — 0 skipped test IDs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] 086 trigger-phrase edits target only disposable sandbox data — not shared production records
- [ ] CHK-041 [P0] 143 rollout flag changes documented and restored to defaults after capture
- [ ] CHK-042 [P1] Sandbox checkpoint created before any destructive or mutation step
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] tasks.md updated with final status for each scenario task
- [ ] CHK-051 [P0] implementation-summary.md completed with aggregate results
- [ ] CHK-052 [P1] No placeholder or template text remains in any phase document
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Evidence artifacts stored in `scratch/` only
- [ ] CHK-061 [P2] Memory save triggered after execution to preserve session context
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: —
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
