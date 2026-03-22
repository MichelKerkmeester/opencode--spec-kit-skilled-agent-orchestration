---
title: "Verification Checklist: manual-testing-per-playbook analysis phase"
description: "7 scenario verdicts (P0) plus evidence capture (P1) for analysis category."
trigger_phrases:
  - "analysis checklist"
  - "analysis verification"
  - "causal graph checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook analysis phase

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
- [ ] CHK-002 [P0] Test memories available for causal operations
- [ ] CHK-003 [P0] Named checkpoint created for EX-021 sandbox
- [ ] CHK-004 [P1] Playbook scenario files reviewed before execution
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] EX-019 Causal edge creation (memory_causal_link) -- Verdict: ___
- [ ] CHK-011 [P0] EX-020 Causal graph statistics (memory_causal_stats) -- Verdict: ___
- [ ] CHK-012 [P0] EX-021 Causal edge deletion (memory_causal_unlink) -- Verdict: ___
- [ ] CHK-013 [P0] EX-022 Causal chain tracing (memory_drift_why) -- Verdict: ___
- [ ] CHK-014 [P0] EX-023 Epistemic baseline capture (task_preflight) -- Verdict: ___
- [ ] CHK-015 [P0] EX-024 Post-task learning measurement (task_postflight) -- Verdict: ___
- [ ] CHK-016 [P0] EX-025 Learning history (memory_get_learning_history) -- Verdict: ___
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] EX-019 evidence artifact captured (tool output)
- [ ] CHK-021 [P1] EX-020 evidence artifact captured (tool output)
- [ ] CHK-022 [P1] EX-021 evidence artifact captured (before-trace, unlink, after-trace)
- [ ] CHK-023 [P1] EX-022 evidence artifact captured (tool output)
- [ ] CHK-024 [P1] EX-023 evidence artifact captured (tool output)
- [ ] CHK-025 [P1] EX-024 evidence artifact captured (tool output)
- [ ] CHK-026 [P1] EX-025 evidence artifact captured (tool output)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-027 [P0] No secrets or credentials added to analysis phase documents
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
| P0 Items | 10 | 0/10 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->
