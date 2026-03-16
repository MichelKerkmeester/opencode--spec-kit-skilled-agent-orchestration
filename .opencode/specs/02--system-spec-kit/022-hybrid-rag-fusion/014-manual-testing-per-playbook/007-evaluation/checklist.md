---
title: "Verification Checklist: manual-testing-per-playbook evaluation phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 007 evaluation manual tests covering EX-026 (ablation studies) and EX-027 (reporting dashboard)."
trigger_phrases:
  - "evaluation checklist"
  - "phase 007 verification"
  - "ablation dashboard checklist"
  - "evaluation test verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook evaluation phase

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

- [ ] CHK-001 [P0] EX-026 and EX-027 requirements documented in `spec.md` — REQ-001 and REQ-002 must cover both scenarios with exact prompts, command sequences, and feature links
- [ ] CHK-002 [P0] Execution plan defined in `plan.md` with preconditions, phases, and testing strategy table for both scenarios
- [ ] CHK-003 [P1] Dependencies identified (`SPECKIT_ABLATION` flag, `retrieval-channels-smoke` eval dataset, populated eval tables) and status recorded in `plan.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] EX-026 ablation run produces per-channel Recall@20 deltas and a verdict classification (CRITICAL/negligible/HARMFUL) — evidence captured from `eval_run_ablation` output
- [ ] CHK-011 [P0] EX-027 dashboard generates without error in both `format:text` and `format:json` — both output variants captured as evidence
- [ ] CHK-012 [P1] `SPECKIT_ABLATION` flag state confirmed before and after EX-026 execution — documented in evidence notes
- [ ] CHK-013 [P1] EX-026 ablation metric snapshots stored with negative timestamp IDs are confirmed present after `storeResults:true` run
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] EX-026 ablation command sequence executed exactly as written: `eval_run_ablation({ dataset:"retrieval-channels-smoke", channels:["semantic","keyword","graph"], storeResults:true })` followed by `eval_reporting_dashboard({ format:"json", limit:10 })`
- [ ] CHK-021 [P0] EX-027 dashboard command sequence executed exactly as written: `eval_reporting_dashboard(format:text)` and `eval_reporting_dashboard(format:json)`
- [ ] CHK-022 [P1] EX-027 dashboard output contains trend/channel/summary data — not an empty sprint list — confirmed in evidence
- [ ] CHK-023 [P1] Both scenarios assigned PASS, PARTIAL, or FAIL verdict with explicit rationale per the review protocol acceptance rules
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in any spec or evidence artifact
- [ ] CHK-031 [P0] Eval dataset name and channel filter inputs validated before execution — `retrieval-channels-smoke` dataset confirmed to exist and channels list is non-empty
- [ ] CHK-032 [P1] No eval database mutations persist beyond the intended ablation snapshot; `storeResults:false` path behavior noted for reference
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Feature catalog entries for EX-026 and EX-027 match the scenarios as documented in `spec.md` scope table
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized — all 4 docs reflect the same test IDs, prompts, and pass criteria
- [ ] CHK-042 [P2] Evidence references (tool output files, verdict notes) captured and linked from `tasks.md` or an `implementation-summary.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — no temp files created outside scratch/
- [ ] CHK-051 [P1] scratch/ cleaned before completion — no scratch files generated during spec creation
- [ ] CHK-052 [P2] Findings saved to memory/ using `generate-context.js` — not written manually
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
