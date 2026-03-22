---
title: "Verification Checklist: manual-testing-per-playbook memory quality and indexing phase [template:level_2/checklist.md]"
description: "Verification checklist for phase 013 memory quality and indexing: 34 exact IDs (M-003, M-005, M-005a/b/c, M-006, M-006a/b/c, 039-048, 069, 073, 092, 111, 119, 131, 132, 133, 155, 155-F, 164, 165, 176, 177, 178) -- all items unchecked, awaiting execution."
trigger_phrases:
  - "memory quality checklist"
  - "phase 013 verification"
  - "indexing checklist"
  - "M-003 M-005 M-006 039 155 164 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: manual-testing-per-playbook memory quality and indexing phase

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

- [ ] CHK-001 [P0] Playbook files for 13--memory-quality-and-indexing confirmed accessible
- [ ] CHK-002 [P0] Feature catalog files for 13--memory-quality-and-indexing confirmed accessible
- [ ] CHK-003 [P0] Review protocol loaded and verdict rules understood
- [ ] CHK-004 [P0] MCP runtime healthy -- `memory_save`, `memory_index_scan`, quality gate pipeline all respond
- [ ] CHK-005 [P1] Sandbox data and named checkpoint prepared for destructive scenarios (M-005, M-006, 044)
- [ ] CHK-006 [P1] Baseline feature flag values recorded for all SPECKIT_* flags used in Group 6 scenarios
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Each item below must be marked `[x]` with a verdict (PASS / PARTIAL / FAIL) and an evidence reference before this phase is complete.

### Group 1: Core Pipeline Scenarios

- [ ] CHK-010 [P0] M-003 executed and verdicted -- Context Save + Index Update
- [ ] CHK-011 [P0] M-005 executed and verdicted -- Outsourced Agent Memory Capture Round-Trip
- [ ] CHK-012 [P0] M-005a executed and verdicted -- JSON-mode hard-fail
- [ ] CHK-013 [P0] M-005b executed and verdicted -- nextSteps persistence
- [ ] CHK-014 [P0] M-005c executed and verdicted -- Verification freshness
- [ ] CHK-015 [P0] M-006 executed and verdicted -- Session Enrichment and Alignment Guardrails
- [ ] CHK-016 [P0] M-006a executed and verdicted -- Unborn-HEAD and dirty snapshot fallback
- [ ] CHK-017 [P0] M-006b executed and verdicted -- Detached-HEAD snapshot preservation
- [ ] CHK-018 [P0] M-006c executed and verdicted -- Similar-folder boundary protection

### Group 2: Quality Loop and Signal Scenarios

- [ ] CHK-020 [P0] 039 executed and verdicted -- Verify-fix-verify memory quality loop (PI-A5)
- [ ] CHK-021 [P0] 040 executed and verdicted -- Signal vocabulary expansion (TM-08)
- [ ] CHK-022 [P0] 041 executed and verdicted -- Pre-flight token budget validation (PI-A3)
- [ ] CHK-023 [P0] 042 executed and verdicted -- Spec folder description discovery (PI-B3)
- [ ] CHK-024 [P0] 043 executed and verdicted -- Pre-storage quality gate (TM-04)
- [ ] CHK-025 [P0] 044 executed and verdicted -- Reconsolidation-on-save (TM-06)
- [ ] CHK-026 [P0] 045 executed and verdicted -- Smarter memory content generation (S1)
- [ ] CHK-027 [P0] 046 executed and verdicted -- Anchor-aware chunk thinning (R7)
- [ ] CHK-028 [P0] 047 executed and verdicted -- Encoding-intent capture at index time (R16)
- [ ] CHK-029 [P0] 048 executed and verdicted -- Auto entity extraction (R10)

### Group 3: Consolidation and Persistence Scenarios

- [ ] CHK-030 [P0] 069 executed and verdicted -- Entity normalization consolidation
- [ ] CHK-031 [P0] 073 executed and verdicted -- Quality gate timer persistence
- [ ] CHK-032 [P0] 092 executed and verdicted -- Implemented: auto entity extraction (R10)
- [ ] CHK-033 [P0] 111 executed and verdicted -- Deferred lexical-only indexing
- [ ] CHK-034 [P0] 119 executed and verdicted -- Memory filename uniqueness (ensureUniqueMemoryFilename)

### Group 4: Validation and Preflight Scenarios

- [ ] CHK-035 [P0] 131 executed and verdicted -- Description.json batch backfill validation (PI-B3)
- [ ] CHK-036 [P0] 132 executed and verdicted -- description.json schema field validation
- [ ] CHK-037 [P0] 133 executed and verdicted -- Dry-run preflight for memory_save

### Group 5: Post-Save and Review Scenarios

- [ ] CHK-040 [P0] 155 executed and verdicted -- Post-save quality review
- [ ] CHK-041 [P0] 155-F executed and verdicted -- Score penalty advisory logging

### Group 6: Advanced Quality Features

- [ ] CHK-050 [P0] 164 executed and verdicted -- Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK)
- [ ] CHK-051 [P0] 165 executed and verdicted -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)
- [ ] CHK-052 [P0] 176 executed and verdicted -- Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG)
- [ ] CHK-053 [P0] 177 executed and verdicted -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)
- [ ] CHK-054 [P0] 178 executed and verdicted -- Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)

### Coverage

- [ ] CHK-060 [P0] All 34 exact IDs assigned a verdict -- 0 skipped test IDs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-070 [P1] Evidence captured for each executed scenario (output excerpt or observation)
- [ ] CHK-071 [P1] Feature catalog cross-reference verified for each scenario
- [ ] CHK-072 [P1] PARTIAL verdicts include a root-cause note and remediation suggestion
- [ ] CHK-073 [P1] Sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F have independent evidence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-080 [P0] M-005 outsourced agent capture targets only disposable sandbox data
- [ ] CHK-081 [P0] M-006 git state manipulation uses temporary repos only
- [ ] CHK-082 [P0] 044 reconsolidation merge uses sandbox data with pre-merge checkpoint
- [ ] CHK-083 [P0] Feature flag changes (164, 165, 176, 177, 178) documented and restored to defaults after capture
- [ ] CHK-084 [P1] Named checkpoint created before any destructive or mutation step
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-090 [P0] tasks.md updated with final status for each scenario task
- [ ] CHK-091 [P0] implementation-summary.md completed with aggregate results
- [ ] CHK-092 [P1] No placeholder or template text remains in any phase document
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-100 [P1] Evidence artifacts stored in `scratch/` only
- [ ] CHK-101 [P2] Memory save triggered after execution to preserve session context
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 42 | 0/42 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: --
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
