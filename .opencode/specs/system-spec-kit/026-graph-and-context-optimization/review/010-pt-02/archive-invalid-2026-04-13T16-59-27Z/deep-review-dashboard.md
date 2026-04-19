---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

20-iteration root deep review for the promoted `010-search-and-routing-tuning` tree, focused on promotion integrity across prompts, graph metadata, review lineage, and root packet status coherence.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/` (spec-folder)
- Started: `2026-04-13T16:53:40Z`
- Status: `COMPLETE`
- Iteration: `20 of 20`
- Provisional Verdict: `CONDITIONAL`
- hasAdvisories: `false`
- Session ID: `2026-04-13T16:53:40Z-010-search-and-routing-tuning-deep-review`
- Parent Session: `none`
- Lifecycle Mode: `new`
- Generation: `1`
- continuedFromRun: `none`
- stopReason: `max_iterations`

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | legacy graph-metadata baseline across promoted root packets | correctness/traceability | 1.00 | 0/1/0 | complete |
| 2 | live prompt and operational launch surfaces after promotion | traceability | 0.55 | 0/2/0 | complete |
| 3 | promoted 001 root review report versus current Stage 3 runtime | correctness/traceability | 0.34 | 0/3/0 | complete |
| 4 | promoted 002 root review report versus current metadata-only routing | traceability/maintainability | 0.00 | 0/3/0 | complete |
| 5 | promoted 003 root review outputs versus repaired closeout claims | traceability/maintainability | 0.00 | 0/3/0 | complete |
| 6 | root 002 completion-state coherence across spec docs and metadata | traceability | 0.22 | 0/4/0 | complete |
| 7 | security sweep over promoted packet surfaces | security | 0.00 | 0/4/0 | complete |
| 8 | cross-reference sweep for old 019 closeout wording | traceability/maintainability | 0.00 | 0/4/0 | complete |
| 9 | old-path grep stabilization across review and metadata artifacts | traceability | 0.00 | 0/4/0 | complete |
| 10 | code verification of the shipped Stage 3 continuity fix | correctness | 0.00 | 0/4/0 | complete |
| 11 | code verification of the shipped metadata-only host-selection fix | correctness | 0.00 | 0/4/0 | complete |
| 12 | strict-validation pass over the promoted roots | traceability | 0.00 | 0/4/0 | complete |
| 13 | review packet lineage consistency inside promoted child roots | maintainability/traceability | 0.00 | 0/4/0 | complete |
| 14 | research citation and evidence-quality sweep | maintainability/traceability | 0.00 | 0/4/0 | complete |
| 15 | description and graph-metadata child-mapping sweep | traceability | 0.00 | 0/4/0 | complete |
| 16 | review packet recovery/resume surface sweep | maintainability | 0.00 | 0/4/0 | complete |
| 17 | graph-metadata parser closeout claims versus promoted outputs | correctness/traceability | 0.00 | 0/4/0 | complete |
| 18 | stabilization pass on live prompt and old-path references | traceability | 0.00 | 0/4/0 | complete |
| 19 | convergence sweep across all four review dimensions | correctness/security/traceability/maintainability | 0.00 | 0/4/0 | complete |
| 20 | final synthesis and release-readiness verdict | correctness/security/traceability/maintainability | 0.00 | 0/4/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- graphConvergenceScore: `0.00`
- graphDecision: `none`
- graphBlockers: `none`

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: `0.00 -> 0.00 -> 0.00`
- convergenceScore: `1.00`
- openFindings: `4`
- persistentSameSeverity: `0`
- severityChanged: `0`
- repeatedFindings (deprecated combined bucket): `0`

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
Completed. Open a focused promotion-remediation pass before treating `010-search-and-routing-tuning` as a clean promoted root.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- `F001` P1: rerunning the promoted `002` prompt still dispatches against the retired 006 path.
- `F002` P1: promoted root review artifacts still advertise pre-promotion 017/018/019 findings and verdicts.
- `F003` P1: the promoted root tree still contains legacy plaintext `graph-metadata.json` files despite the 003 closeout claiming zero remain.
- `F004` P1: root `002-content-routing-accuracy` still publishes contradictory completion state across its spec docs and metadata.

<!-- /ANCHOR:active-risks -->
