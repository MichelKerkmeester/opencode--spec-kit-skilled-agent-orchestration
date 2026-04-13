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
- Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/ (spec-folder)
- Started: 2026-04-13T11:30:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasAdvisories: true
- Session ID: 2026-04-13T11:30:00Z-003-root-review
- Parent Session: none
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness - key_files sanitization and entity seeding | correctness | 1.00 | 0/1/0 | complete |
| 2 | correctness - canonical entity path preference inside packet docs | correctness/maintainability | 0.20 | 0/1/1 | complete |
| 3 | traceability - corpus health counts and command-shaped metadata leakage | traceability | 0.00 | 0/1/1 | complete |
| 4 | traceability - status distribution and normalization leftovers | traceability/correctness | 0.20 | 0/1/2 | complete |
| 5 | doc accuracy - operator-facing graph metadata contract surfaces | traceability/maintainability | 0.00 | 0/1/2 | complete |
| 6 | backfill behavior - script contract vs packet 004 docs and regression suite | correctness/traceability | 1.00 | 0/2/2 | complete |
| 7 | security - metadata drift does not cross a privilege boundary | security | 0.00 | 0/2/2 | complete |
| 8 | traceability - 003 root packet validation and phase closeout completeness | traceability | 1.00 | 0/3/2 | complete |
| 9 | maintainability - synthesis across parser, tests, corpus, and packet docs | maintainability/traceability | 0.00 | 0/3/2 | complete |
| 10 | cross-phase synthesis - final 003 verdict | correctness/security/traceability/maintainability | 0.00 | 0/3/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 0 |
| traceability | covered | 4 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 5
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
Completed. Move to remediation planning for F001-F003 before reopening the lower-severity metadata hygiene findings.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- 3 active P1 finding(s) keep the packet in `FAIL`.
- 2 active P2 finding(s) remain as advisories after the required fixes land.

<!-- /ANCHOR:active-risks -->
