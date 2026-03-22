---
title: "Verification Checklist: manual-testing-per-playbook ux-hooks phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 018 UX-hooks manual test packet covering scenarios 103, 104, 105, 106, 107, 166, 167, 168, 169, 179, and 180."
trigger_phrases:
  - "ux hooks verification checklist"
  - "phase 018 checklist"
  - "ux hooks manual test verification"
  - "mutation feedback checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook ux-hooks phase

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

- [ ] CHK-001 [P0] Playbook source and review protocol loaded before execution begins
- [ ] CHK-002 [P0] All 11 scenario prompts and command sequences verified against `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] CHK-003 [P0] vitest test files confirmed present and suite compiles without import errors
- [ ] CHK-004 [P1] Feature flag support confirmed for all 6 flag-based scenarios (default OFF)
- [ ] CHK-005 [P1] ripgrep available or grep fallback documented
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-030 [P0] All 11 scenarios have a PASS, PARTIAL, or FAIL verdict with explicit rationale
- [ ] CHK-031 [P0] vitest import crashes are reported as FAIL with verbatim error text (not silently skipped)
- [ ] CHK-032 [P1] Flag-based scenarios include evidence for both enabled and disabled flag states
- [ ] CHK-033 [P1] No fabricated or inferred evidence; all outputs captured verbatim from tool calls or test runs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] 103 vitest suite passes 6/6 tests with evidence captured [Evidence: _pending_]
- [ ] CHK-011 [P0] 104 vitest suite passes and no-op, FSRS, atomic-save assertions confirmed [Evidence: _pending_]
- [ ] CHK-012 [P0] 105 vitest suite passes and hints, autoSurfacedContext, token metadata assertions confirmed [Evidence: _pending_]
- [ ] CHK-013 [P0] 106 ripgrep output confirms all 4 terms present in hooks/index.ts and hooks/README.md [Evidence: _pending_]
- [ ] CHK-014 [P0] 107 three-suite + Group 13b pass with confirmName rejection and safetyConfirmationUsed=true confirmed [Evidence: _pending_]
- [ ] CHK-015 [P0] 166 tier-1 and tier-2 explain outputs present with flag ON; no explain output with flag OFF [Evidence: _pending_]
- [ ] CHK-016 [P0] 167 all 4 profile modes produce distinct output shapes; default shape used with flag OFF [Evidence: _pending_]
- [ ] CHK-017 [P0] 168 cursor token present on non-final pages; no cursor on final page; single response with flag OFF [Evidence: _pending_]
- [ ] CHK-018 [P0] 169 prior-session results deprioritized; new session resets state; no dedup with flag OFF [Evidence: _pending_]
- [ ] CHK-019 [P0] 179 all 3 recovery statuses returned for empty/weak results; no payload for healthy results; no payload with flag OFF [Evidence: _pending_]
- [ ] CHK-020 [P0] 180 calibrated confidence present per result with 4-factor weighting; no confidence field with flag OFF [Evidence: _pending_]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets in evidence artifacts
- [ ] CHK-041 [P0] All feature flags reset to OFF after execution of each flag-based scenario
- [ ] CHK-042 [P1] 169 session boundaries verified — no state leakage between distinct sessionIds
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Phase coverage reported as 11/11 scenarios with verdict summary
- [ ] CHK-051 [P1] `implementation-summary.md` updated with execution results and verdict table
- [ ] CHK-052 [P2] Findings saved to `memory/` via generate-context.js
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Evidence artifacts stored in `scratch/` only during execution
- [ ] CHK-061 [P2] `scratch/` cleaned of intermediate drafts after completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 7 | 0/7 |
| P2 Items | 3 | 0/3 |

**Verification Date**: _Not Started_
<!-- /ANCHOR:summary -->

---
