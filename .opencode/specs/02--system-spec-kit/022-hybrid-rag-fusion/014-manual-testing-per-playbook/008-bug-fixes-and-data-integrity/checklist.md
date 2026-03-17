---
title: "Verification Checklist: bug-fixes-and-data-integrity manual testing [template:level_2/checklist.md]"
description: "Verification checklist for Phase 008 bug-fix and data-integrity manual tests covering NEW-001 through NEW-004, NEW-065, NEW-068, NEW-075, NEW-083, NEW-084, NEW-116, and NEW-117."
trigger_phrases:
  - "bug fixes checklist"
  - "data integrity checklist"
  - "phase 008 verification"
  - "manual bug fix checklist"
  - "NEW-001 NEW-065 NEW-116 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: bug-fixes-and-data-integrity manual testing

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Scope is locked to 11 bug-fix and data-integrity tests (NEW-001 through NEW-004, NEW-065, NEW-068, NEW-075, NEW-083, NEW-084, NEW-116, NEW-117) with no out-of-phase scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 11 rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: testing strategy table in `plan.md` matches playbook rows for all 11 test IDs]
- [x] CHK-003 [P0] Feature catalog links for all 11 tests point to the correct `08--bug-fixes-and-data-integrity/` files [EVIDENCE: spec.md scope table links verified against the corresponding feature catalog directory]
- [ ] CHK-004 [P1] Sandbox or checkpoint strategy is confirmed for destructive scenarios NEW-065, NEW-084, NEW-116, and NEW-117 before execution begins [EVIDENCE: sandbox/checkpoint target documented in execution notes or open questions]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] NEW-001 documents the graph channel ID fix (G1) with verdict rule: PASS only when graph channel contributes >=1 hit when causal edges exist [EVIDENCE: spec.md REQ-001 and plan.md Phase 2 step]
- [x] CHK-011 [P0] NEW-004 documents SHA-256 content-hash deduplication (TM-02) with verdict rule: PASS only when re-save skips embedding and reports duplicate [EVIDENCE: spec.md REQ-002 and plan.md Phase 2 step]
- [x] CHK-012 [P0] NEW-065 documents the Sprint 8 DB/schema safety bundle with verdict rule: PASS only when all mutation paths complete atomically with no partial corruption and schema constraints hold [EVIDENCE: spec.md REQ-003 and plan.md Phase 3 step]
- [x] CHK-013 [P0] NEW-084 documents session-manager transaction gap fixes with verdict rule: PASS only when concurrent writes are serialized, session limits hold, and no corruption occurs [EVIDENCE: spec.md REQ-004 and plan.md Phase 3 step]
- [x] CHK-014 [P0] NEW-116 documents chunking orchestrator safe swap with verdict rule: PASS only when new chunks are staged before old deletion and old children survive if new indexing fails [EVIDENCE: spec.md REQ-005 and plan.md Phase 3 step]
- [x] CHK-015 [P0] NEW-117 documents SQLite datetime session cleanup with verdict rule: PASS only when only expired sessions are deleted regardless of timestamp format and active sessions are preserved [EVIDENCE: spec.md REQ-006 and plan.md Phase 3 step]
- [x] CHK-016 [P1] NEW-002 documents chunk collapse deduplication (G3) with verdict rule: PASS only when zero duplicate parent IDs appear in collapsed results [EVIDENCE: spec.md REQ-007 and plan.md Phase 2 step]
- [x] CHK-017 [P1] NEW-003 documents co-activation fan-effect divisor (R17) with verdict rule: PASS only when hub contribution decreases as degree increases and no single hub dominates >50% of top-5 results [EVIDENCE: spec.md REQ-008 and plan.md Phase 2 step]
- [x] CHK-018 [P1] NEW-068 documents guards and edge cases with verdict rule: PASS only when known edge cases are handled without double-counting or incorrect fallback behavior [EVIDENCE: spec.md REQ-009 and plan.md Phase 2 step]
- [x] CHK-019 [P1] NEW-075 documents canonical ID dedup hardening with verdict rule: PASS only when mixed-format IDs for the same entity resolve to one canonical ID with no duplicates [EVIDENCE: spec.md REQ-010 and plan.md Phase 2 step]
- [x] CHK-020 [P1] NEW-083 documents Math.max/min stack overflow elimination with verdict rule: PASS only when large arrays process without RangeError and produce correct min/max values [EVIDENCE: spec.md REQ-011 and plan.md Phase 2 step]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] NEW-001 has been executed and graph channel hit count evidence with causal-edge query output is captured [EVIDENCE: execution log attached]
- [ ] CHK-031 [P0] NEW-002 has been executed and dedup output showing zero duplicate parent IDs in collapsed results is captured [EVIDENCE: execution log attached]
- [ ] CHK-032 [P0] NEW-003 has been executed and comparative query evidence showing hub dampening proportional to degree is captured [EVIDENCE: execution log attached]
- [ ] CHK-033 [P0] NEW-004 has been executed and re-save output plus DB evidence showing no duplicate embedding row is captured [EVIDENCE: execution log attached]
- [ ] CHK-034 [P0] NEW-065 has been executed in sandbox and mutation output, SQL inspection, and schema constraint verification are captured [EVIDENCE: execution log attached]
- [ ] CHK-035 [P0] NEW-068 has been executed and edge-case trigger output with fallback behavior evidence is captured [EVIDENCE: execution log attached]
- [ ] CHK-036 [P0] NEW-075 has been executed and mixed-ID input with canonicalized output showing no duplicates is captured [EVIDENCE: execution log attached]
- [ ] CHK-037 [P0] NEW-083 has been executed and large-array execution output with numeric min/max comparison confirming no RangeError is captured [EVIDENCE: execution log attached]
- [ ] CHK-038 [P0] NEW-084 has been executed in sandbox and concurrent write simulation with transaction serialization evidence is captured [EVIDENCE: execution log attached]
- [ ] CHK-039 [P0] NEW-116 has been executed in sandbox and re-chunk output with old-children survival evidence under indexing failure is captured [EVIDENCE: execution log attached]
- [ ] CHK-040 [P0] NEW-117 has been executed in sandbox and before/after session evidence confirming only expired sessions deleted regardless of timestamp format is captured [EVIDENCE: execution log attached]
- [ ] CHK-041 [P0] Each of the 11 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-042 [P1] Coverage summary reports 11/11 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] No secrets or credentials were added to bug-fixes-and-data-integrity phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [ ] CHK-051 [P0] Destructive scenarios NEW-065, NEW-084, NEW-116, and NEW-117 are restricted to sandbox or checkpointed environments only; no production data stores are targeted [EVIDENCE: execution notes confirm sandbox target for all four scenarios]
- [ ] CHK-052 [P1] Sandbox state was restored after each destructive scenario so later evidence remains attributable and reversible [EVIDENCE: rollback/restore steps recorded per destructive scenario]
- [ ] CHK-053 [P2] Open execution questions about sandbox targets are resolved or documented before any destructive scenario is run in a shared environment [EVIDENCE: open questions in spec.md addressed or deferred with rationale]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows for NEW-001, NEW-002, NEW-003, NEW-004, NEW-065, NEW-068, NEW-075, NEW-083, NEW-084, NEW-116, NEW-117 and feature catalog]
- [ ] CHK-061 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, tasks, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-062 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `008-bug-fixes-and-data-integrity/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `008-bug-fixes-and-data-integrity/` at this stage [EVIDENCE: directory listing confirms four files]
- [ ] CHK-071 [P1] No unrelated files were added outside the `008-bug-fixes-and-data-integrity/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-072 [P2] Memory save was triggered after phase packet creation to make bug-fix and data-integrity context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
