---
title: "Verification Checklist: Manual Testing — Evaluation and Measurement"
description: "Verification Date: Not Started"
trigger_phrases:
  - "evaluation and measurement checklist"
  - "manual testing checklist"
  - "scenario verification checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Evaluation and Measurement

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

- [ ] CHK-001 [P0] MCP server confirmed running before test start
- [ ] CHK-002 [P0] SPECKIT_ABLATION=true confirmed in environment
- [ ] CHK-003 [P0] Pre-test checkpoint created
- [ ] CHK-004 [P1] eval_metric_snapshots table confirmed present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P1] Playbook scenario files reviewed before execution
- [ ] CHK-006 [P1] Spec/plan/tasks consistent across phase documents
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Scenario 005 — Evaluation database and schema (R13-S1): PASS
- [ ] CHK-011 [P0] Scenario 006 — Core metric computation (R13-S1): PASS
- [ ] CHK-012 [P0] Scenario 007 — Observer effect mitigation (D4): PASS
- [ ] CHK-013 [P0] Scenario 008 — Full-context ceiling evaluation (A2): PASS
- [ ] CHK-014 [P0] Scenario 009 — Quality proxy formula (B7): PASS
- [ ] CHK-015 [P0] Scenario 010 — Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A): PASS
- [ ] CHK-016 [P0] Scenario 011 — BM25-only baseline (G-NEW-1): PASS
- [ ] CHK-017 [P0] Scenario 012 — Agent consumption instrumentation (G-NEW-2): PASS
- [ ] CHK-018 [P0] Scenario 013 — Scoring observability (T010): PASS
- [ ] CHK-019 [P0] Scenario 014 — Full reporting and ablation study framework (R13-S3): PASS
- [ ] CHK-020 [P0] Scenario 015 — Shadow scoring and channel attribution (R13-S2): PASS
- [ ] CHK-021 [P0] Scenario 072 — Test quality improvements: PASS
- [ ] CHK-022 [P0] Scenario 082 — Evaluation and housekeeping fixes: PASS
- [ ] CHK-023 [P0] Scenario 088 — Cross-AI validation fixes (Tier 4): PASS
- [ ] CHK-024 [P0] Scenario 090 — INT8 quantization evaluation (R5): PASS
- [ ] CHK-025 [P0] Scenario 126 — Memory roadmap baseline snapshot: PASS
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials added to evaluation-and-measurement phase documents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] All scenario results recorded in tasks.md
- [ ] CHK-041 [P0] implementation-summary.md filled in with results and date
- [ ] CHK-042 [P2] Any FAIL or SKIP-ENV findings linked to a follow-up tracking item
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp notes in scratch/ only
- [ ] CHK-051 [P2] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 0/19 |
| P1 Items | 3 | 0/3 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — one P0 item per scenario
Mark checked with evidence when scenario passes, e.g.:
- [ ] CHK-010 [P0] Scenario 005 — Evaluation database and schema (R13-S1): PASS [Run: YYYY-MM-DD, evidence here]
P0 must complete, P1 need approval to defer
SKIP-ENV is acceptable for scenarios 088, 090 if environment dependencies are absent
-->
