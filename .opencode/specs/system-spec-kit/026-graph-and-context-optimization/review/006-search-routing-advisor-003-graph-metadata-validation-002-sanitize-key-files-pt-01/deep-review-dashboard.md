---
title: Deep Review Dashboard
description: Auto-generated reducer view over the sanitize-key-files review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

## 2. STATUS
- Review Target: Sanitize Key Files in Graph Metadata packet (spec-folder)
- Started: 2026-04-21T17:41:45.016Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
- Session ID: rvw-2026-04-21T17-41-45Z-sanitize-key-files
- Lifecycle Mode: new
- Generation: 1

## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 5 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Correctness review of packet lineage and persisted metadata | correctness | 0.34 | 0/1/0 | complete |
| 2 | Security pass on key-file sanitization and resolver lookup behavior | security | 0.08 | 0/1/0 | complete |
| 3 | Traceability pass on authority sources and checklist evidence after packet renumbering | traceability | 0.42 | 0/4/0 | complete |
| 4 | Maintainability pass on key_files output normalization and reviewer ergonomics | maintainability | 0.18 | 0/5/0 | complete |
| 5 | Correctness refinement against canonical description-generation contracts | correctness | 0.11 | 0/5/0 | complete |
| 6 | Security stabilization of filtered candidate and resolver behavior | security | 0.06 | 0/5/0 | complete |
| 7 | Traceability recheck against migration metadata and derived source-doc inventory | traceability | 0.12 | 0/5/0 | complete |
| 8 | Maintainability recheck of alias duplication in persisted key_files | maintainability | 0.09 | 0/5/0 | complete |
| 9 | Final correctness pass on persisted ancestry metadata | correctness | 0.07 | 0/5/0 | complete |
| 10 | Final security stabilization pass before synthesis | security | 0.06 | 0/5/0 | complete |

## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 1 |

## 6. BLOCKED STOPS
No blocked-stop events were recorded; the loop ran to the user-requested 10-iteration limit.

## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

## 8. TREND
- Last 3 ratios: 0.09 -> 0.07 -> 0.06
- convergenceScore: 0.58
- openFindings: 5
- persistentSameSeverity: 5
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 5

## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

## 10. NEXT FOCUS
Fix the five active P1 findings, regenerate the packet metadata surfaces, and rerun the deep review to verify the packet has regained clean traceability and canonical `key_files` output.

## 11. ACTIVE RISKS
- 5 active P1 findings remain open.
- `checklist_evidence` is still failing because the checked evidence lines no longer land on the cited parser logic.
- The packet still carries one stale ancestry surface and one non-canonical `key_files` output surface.
