---
title: "Tasks: 012/003"
description: "Edge explanation + blast_radius uplift."
importance_tier: "important"
contextType: "implementation"
---
# Tasks: 012/003

<!-- SPECKIT_LEVEL: 2 -->

| ID | Task | Phase | Status |
|----|------|-------|--------|
| T-003-A1 | Extend metadata writer with `reason` + `step` | A | pending |
| T-003-A2 | Define owner-local vocabulary for fields | A | pending |
| T-003-A3 | Surface in query output `query.ts:978-981` | A | pending |
| T-003-A4 | Propagate through `code-graph-context.ts` | A | pending |
| T-003-B1 | Add `minConfidence` parameter to `computeBlastRadius` | B | pending |
| T-003-B2 | Refactor output shape (depthGroups, riskLevel, ambiguityCandidates, failureFallback) | B | pending |
| T-003-B3 | Implement risk classification rules | B | pending |
| T-003-B4 | Implement ambiguity detection + candidate surfacing | B | pending |
| T-003-B5 | Wrap failure paths in structured `failureFallback` | B | pending |
| T-003-C1 | feature_catalog entry for `06--analysis/` | C | pending |
| T-003-C2 | manual_testing_playbook entry for `06--analysis/` | C | pending |
| T-003-C3 | sk-doc DQI ≥85 | C | pending |
| T-003-D1 | Unit tests for all requirements | D | pending |
| T-003-D2 | Run existing code-graph vitest suite | D | pending |
| T-003-D3 | `validate.sh --strict` | D | pending |
| T-003-D4 | Populate `implementation-summary.md` | D | pending |

## Dependencies
- 012/001 license audit complete

## References
- spec.md, plan.md, checklist.md
