---
title: "Verification Checklist: Manual Testing — Pipeline Architecture (Phase 014)"
description: "Verification checklist for Phase 014 pipeline architecture manual test execution. One P0 item per scenario, all unchecked. 18 scenarios: 049–054, 067, 071, 076, 078, 080, 087, 095, 112, 115, 129, 130, 146."
trigger_phrases:
  - "pipeline architecture checklist"
  - "phase 014 verification"
  - "manual pipeline architecture checklist"
  - "049 050 051 pipeline checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Pipeline Architecture (Phase 014)

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

- [ ] CHK-001 [P0] Playbook loaded — rows for all 18 scenario IDs (049, 050, 051, 052, 053, 054, 067, 071, 076, 078, 080, 087, 095, 112, 115, 129, 130, 146) are accessible
- [ ] CHK-002 [P0] Review protocol loaded — PASS/FAIL/SKIP verdict rules available before any execution
- [ ] CHK-003 [P1] Feature catalog links confirmed for all 18 scenarios in `../../feature_catalog/14--pipeline-architecture/`
- [ ] CHK-004 [P1] Sandbox or checkpoint available for destructive scenarios (080, 112, 115, 130)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Scenario 049 executed and verdicted — 4-stage pipeline refactor (R6)
- [ ] CHK-011 [P0] Scenario 050 executed and verdicted — MPAB chunk-to-memory aggregation (R1)
- [ ] CHK-012 [P0] Scenario 051 executed and verdicted — Chunk ordering preservation (B2)
- [ ] CHK-013 [P0] Scenario 052 executed and verdicted — Template anchor optimization (S2)
- [ ] CHK-014 [P0] Scenario 053 executed and verdicted — Validation signals as retrieval metadata (S3)
- [ ] CHK-015 [P0] Scenario 054 executed and verdicted — Learned relevance feedback (R11)
- [ ] CHK-016 [P0] Scenario 067 executed and verdicted — Search pipeline safety
- [ ] CHK-017 [P0] Scenario 071 executed and verdicted — Performance improvements
- [ ] CHK-018 [P0] Scenario 076 executed and verdicted — Activation window persistence
- [ ] CHK-019 [P0] Scenario 078 executed and verdicted — Legacy V1 pipeline removal
- [ ] CHK-020 [P0] Scenario 080 executed and verdicted in sandbox — Pipeline and mutation hardening
- [ ] CHK-021 [P0] Scenario 087 executed and verdicted — DB_PATH extraction and import standardisation
- [ ] CHK-022 [P0] Scenario 095 executed and verdicted — Strict Zod schema validation (P0-1)
- [ ] CHK-023 [P0] Scenario 112 executed and verdicted in sandbox — Cross-process DB hot rebinding
- [ ] CHK-024 [P0] Scenario 115 executed and verdicted in sandbox — Transaction atomicity on rename failure (P0-5)
- [ ] CHK-025 [P0] Scenario 129 executed and verdicted — Lineage state active projection and asOf resolution
- [ ] CHK-026 [P0] Scenario 130 executed and verdicted in sandbox — Lineage backfill rollback drill
- [ ] CHK-027 [P0] Scenario 146 executed and verdicted — Dynamic server instructions (P1-6)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All 18 scenarios have a verdict — no "Not Started" entries remain
- [ ] CHK-031 [P0] Each verdict has an evidence note (transcript snippet, command output, or explicit skip reason)
- [ ] CHK-032 [P0] All FAIL verdicts have defect notes capturing observed vs expected behaviour
- [ ] CHK-033 [P1] Destructive scenarios (080, 112, 115, 130) have sandbox isolation or checkpoint evidence recorded
- [ ] CHK-034 [P1] Any SKIP verdicts have explicit reasons (scenario file not found, environment unavailable, etc.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets or credentials added to phase 014 documents
- [ ] CHK-041 [P0] Destructive scenario execution was confined to sandbox or isolated worktree — no production environment modified
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md, and checklist.md are synchronised — no contradictions in scenario names or IDs across documents
- [ ] CHK-051 [P2] implementation-summary.md updated with final verdict summary after all scenarios complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Only the expected phase documents exist in `014-pipeline-architecture/` — no stray temp files at folder root
- [ ] CHK-061 [P2] Evidence files placed in `scratch/` subdirectory only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 0/24 |
| P1 Items | 6 | 0/6 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
