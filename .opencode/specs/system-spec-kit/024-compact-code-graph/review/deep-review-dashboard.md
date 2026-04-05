# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.

## Status
- Review Target: `.opencode/specs/system-spec-kit/024-compact-code-graph` (`spec-folder`)
- Status: `COMPLETE`
- Iteration: `6` of `20`
- Provisional Verdict: `CONDITIONAL`
- hasAdvisories: `true`

## Findings Summary
| Severity | Count | Trend |
|----------|------:|-------|
| P0 (Blockers) | 0 | stable |
| P1 (Required) | 6 | increasing then stable |
| P2 (Suggestions) | 1 | stable |

## Dimension Coverage
| Dimension | Status | Iteration | Findings |
|-----------|--------|-----------|----------|
| correctness | covered | 1 | 1 P1 |
| security | covered | 2 | 1 P1 |
| traceability | covered | 1 | 1 P1 |
| maintainability | covered | 3 | 1 P1 |
| performance | covered | 4 | 1 P1 |
| reliability | covered | 2 | 1 P1 |
| completeness | covered | 3 | 1 P2 |

## Traceability Coverage
| Protocol | Level | Status | Findings |
|----------|-------|--------|----------|
| spec_code | core | fail | P1-001, P1-003, P1-004, P1-005, P1-006 |
| checklist_evidence | core | fail | P1-002 |
| skill_agent | overlay | fail | P1-005, P2-001 |
| agent_cross_runtime | overlay | fail | P1-003, P2-001 |
| feature_catalog_code | overlay | pass | none |
| playbook_capability | overlay | pass | none |

## Progress
| # | Dimension | Ratio | P0/P1/P2 | Status |
|---|-----------|-------|----------|--------|
| 1 | correctness, traceability | 1.00 | 0 / 2 / 0 | complete |
| 2 | security, reliability | 1.00 | 0 / 2 / 0 | complete |
| 3 | maintainability, completeness | 1.00 | 0 / 1 / 1 | complete |
| 4 | performance | 1.00 | 0 / 1 / 0 | complete |
| 5 | stabilization challenge | 0.00 | 0 / 0 / 0 | thought |
| 6 | overlay closeout | 0.00 | 0 / 0 / 0 | complete |

## Trend
- Last 3 ratios: `[1.00 -> 0.00 -> 0.00]` (`decreasing`)
- Stuck count: `0`
- Gate violations: `spec_code`, `checklist_evidence`, `skill_agent`, `agent_cross_runtime`

## Next Focus
Synthesis complete. Use `/spec_kit:plan` to turn the active P1/P2 registry into remediation work.

## Active Risks
- Six active P1 findings keep the verdict at `CONDITIONAL`.
- Root/runtime truth-sync still fails across bootstrap contracts, hook safety, autosave routing, and structural budget guarantees.
- Overlay protocol coverage is closed, but `skill_agent` and `agent_cross_runtime` still fail on active findings.
