---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/001-fix-status-derivation/ (spec-folder)
- Started: 2026-04-13T08:30:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: PASS
- hasAdvisories: true
- Session ID: 2026-04-13T08:30:00Z-019-001-review
- Parent Session: 2026-04-13T08:25:00Z-019-graph-metadata-validation-review
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: max_iterations

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 0 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness - deriveStatus branch ordering and checklist fallback | correctness | 0.00 | 0/0/0 | complete |
| 2 | security - doc-derived status values do not cross a privilege boundary | security | 0.00 | 0/0/0 | complete |
| 3 | traceability - phase claims vs targeted schema coverage | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability - helper shape and checklist completion semantics | maintainability | 0.00 | 0/0/0 | complete |
| 5 | traceability - active corpus verification against expected complete/in_progress/planned totals | traceability | 0.00 | 0/0/0 | complete |
| 6 | correctness - explicit frontmatter status passthrough and corpus normalization | correctness/traceability | 1.00 | 0/0/1 | complete |
| 7 | maintainability - skeptic pass on status normalization finding | maintainability | 0.00 | 0/0/1 | complete |
| 8 | traceability - targeted vitest verification for the status fallback patch | traceability | 0.00 | 0/0/1 | complete |
| 9 | correctness - packet-local graph-metadata spot checks after corpus verification | correctness | 0.00 | 0/0/1 | complete |
| 10 | cross-phase synthesis - final status fallback verdict | correctness/security/traceability/maintainability | 0.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 1
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
Completed. Carry F001 as a follow-up normalization task if the reporting buckets need to be strictly canonical.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
