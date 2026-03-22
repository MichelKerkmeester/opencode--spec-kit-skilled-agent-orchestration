---
title: "Verification Checklist: manual-testing-per-playbook evaluation phase"
description: "2 scenario verdicts (P0) plus evidence capture (P1) for evaluation category."
trigger_phrases:
  - "evaluation checklist"
  - "evaluation verification"
  - "ablation dashboard checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook evaluation phase

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

- [ ] CHK-001 [P0] MCP server health verified
- [ ] CHK-002 [P0] SPECKIT_ABLATION=true confirmed in environment
- [ ] CHK-003 [P1] Ground truth queries exist for ablation evaluation
- [ ] CHK-004 [P1] Playbook scenario files reviewed before execution
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] EX-026 Ablation studies (eval_run_ablation) -- Verdict: ___
- [ ] CHK-011 [P0] EX-027 Reporting dashboard (eval_reporting_dashboard) -- Verdict: ___
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] EX-026 evidence artifact captured (per-channel Recall@20 deltas)
- [ ] CHK-021 [P1] EX-027 evidence artifact captured (text format output)
- [ ] CHK-022 [P1] EX-027 evidence artifact captured (JSON format output)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P0] No secrets or credentials added to evaluation phase documents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] tasks.md updated with verdicts
- [ ] CHK-031 [P1] implementation-summary.md completed
- [ ] CHK-032 [P2] Deviations documented with reproducibility notes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-033 [P1] Temp notes in scratch/ only
- [ ] CHK-034 [P2] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 0/4 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->
