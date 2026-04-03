# Cross-File Consistency Sweep -- Checks 1-4

Sweep performed 2026-03-24.

---

## Check 1: Review Dimensions -- order and count
**Status:** CONSISTENT
**Files checked:** 8
**Mismatches found:** 0
**Fixes applied:** None

All 8 files list the 7 review dimensions in the correct canonical order:
D1 Correctness, D2 Security, D3 Spec Alignment, D4 Completeness, D5 Cross-Ref Integrity, D6 Patterns, D7 Documentation Quality.

| File | Status | Notes |
|------|--------|-------|
| `references/loop_protocol.md` (section 6.1, line 554) | MATCH | 7 dimensions, correct order |
| `references/quick_reference.md` (lines 245-251) | MATCH | 7 dimensions, correct order |
| `references/convergence.md` (section 10) | N/A | References dimension coverage as a signal; does not list individual dimensions by name |
| `assets/deep_review_strategy.md` (section 3, lines 36-42) | MATCH | 7 dimensions, correct order |
| `review_auto.yaml` (step_order_dimensions, lines 176-178) | MATCH | 7 dimensions, correct order |
| `agent/deep-review.md` (section 3 rubric) | N/A | Section 3 is the 5-dimension SCORING rubric (Correctness/Security/Patterns/Maintainability/Performance), intentionally different from the 7 REVIEW dimensions |
| `README.md` (lines 161-169) | MATCH | 7 dimensions, correct order |
| `SKILL.md` (section 1) | N/A | Lists review mode triggers but does not enumerate individual dimensions |

---

## Check 2: Verdicts -- 4 verdicts with consistent definitions
**Status:** FIXED
**Files checked:** 8
**Mismatches found:** 3 (across 3 files)
**Fixes applied:**
- `assets/deep_review_dashboard.md:37` -- Added "PASS WITH NOTES" to provisional verdict list (was `[PASS | CONDITIONAL | FAIL | PENDING]`, now `[PASS | PASS WITH NOTES | CONDITIONAL | FAIL | PENDING]`)
- `SKILL.md:354` -- Added "PASS WITH NOTES" to verdict list (was `(PASS/CONDITIONAL/FAIL)`, now `(PASS/PASS WITH NOTES/CONDITIONAL/FAIL)`)
- `README.md:54` -- Added "PASS WITH NOTES" to verdict list (was `(PASS/CONDITIONAL/FAIL)`, now `(PASS/PASS WITH NOTES/CONDITIONAL/FAIL)`)
- `README.md:340` -- Added "PASS WITH NOTES" to verdict list (was `(PASS/CONDITIONAL/FAIL)`, now `(PASS/PASS WITH NOTES/CONDITIONAL/FAIL)`)

Canonical 4 verdicts verified in all sources:

| File | Status | Notes |
|------|--------|-------|
| `references/loop_protocol.md` (section 6.3, lines 679-683) | MATCH | All 4 verdicts with correct definitions |
| `references/quick_reference.md` (lines 256-260) | MATCH | All 4 verdicts with correct definitions |
| `references/state_format.md` (section 8, lines 565-575) | MATCH | All 4 verdicts in section table |
| `review_auto.yaml` (phase_synthesis, lines 516-558) | MATCH | All 4 verdicts with correct definitions |
| `review_confirm.yaml` (phase_synthesis, lines 655-658) | MATCH | All 4 verdicts with correct definitions |
| `README.md` (lines 54, 340) | FIXED | Was missing "PASS WITH NOTES" in 2 locations |
| `SKILL.md` (line 354) | FIXED | Was missing "PASS WITH NOTES" |
| `assets/deep_review_dashboard.md` (line 37) | FIXED | Was missing "PASS WITH NOTES" |

---

## Check 3: review-report.md 11 sections -- identical list
**Status:** FIXED
**Files checked:** 5
**Mismatches found:** 1
**Fixes applied:**
- `references/state_format.md:568` -- Changed "P1 Findings (Required Fixes)" to "P1 Findings (Required)" to match authoritative YAML workflows

Canonical 11 sections verified:

| # | Section Name | Consistent Across All Files |
|---|-------------|---------------------------|
| 1 | Executive Summary | Yes |
| 2 | Score Breakdown | Yes |
| 3 | P0 Findings (Blockers) | Yes |
| 4 | P1 Findings (Required) | Yes (was "Required Fixes" in state_format.md -- fixed) |
| 5 | P2 Findings (Suggestions) | Yes |
| 6 | Cross-Reference Results | Yes |
| 7 | Coverage Map | Yes |
| 8 | Positive Observations | Yes |
| 9 | Convergence Report | Yes |
| 10 | Remediation Priority | Yes |
| 11 | Release Readiness Verdict | Yes |

| File | Status | Notes |
|------|--------|-------|
| `references/state_format.md` (section 8, lines 563-575) | FIXED | Section 4 was "P1 Findings (Required Fixes)" -- changed to "P1 Findings (Required)" |
| `references/loop_protocol.md` (section 6.3, line 676) | MATCH | References "11 sections (see state_format.md Section 8)" -- indirect, consistent |
| `review_auto.yaml` (phase_synthesis, lines 511-558) | MATCH | All 11 sections, correct order, authoritative source |
| `review_confirm.yaml` (phase_synthesis, lines 612-659) | MATCH | All 11 sections, correct order, authoritative source |
| `README.md` | N/A | Mentions "11-section review-report.md" but does not enumerate individual sections |

---

## Check 4: Convergence parameters -- exact numbers
**Status:** CONSISTENT
**Files checked:** 5
**Mismatches found:** 0
**Fixes applied:** None

All files agree on the canonical review-mode convergence parameters:

| Parameter | Canonical Value | All Files Match |
|-----------|----------------|----------------|
| Rolling avg weight | 0.30 | Yes |
| Rolling avg window | 2 | Yes |
| Rolling avg threshold | 0.08 | Yes |
| Rolling avg min_iterations | 2 | Yes |
| MAD weight | 0.25 | Yes |
| MAD min_iterations | 3 | Yes |
| Dimension coverage weight | 0.45 | Yes |
| Dimension coverage threshold | 1.0 (100%) | Yes |
| Stuck threshold | 2 | Yes |
| Composite stop | >0.60 | Yes |

| File | Status | Notes |
|------|--------|-------|
| `references/convergence.md` (sections 10.2-10.3) | MATCH | Full parameter table + pseudocode |
| `review_auto.yaml` (step_check_convergence) | MATCH | All parameters in algorithm block |
| `review_confirm.yaml` (step_check_convergence) | MATCH | All parameters in algorithm block |
| `references/quick_reference.md` (review convergence section) | MATCH | Signal table + key defaults |
| `README.md` (Key Statistics, line 21) | MATCH | Weights listed in summary row |
