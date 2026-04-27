---
title: "Plan: Edge Explanation + Impact Uplift (012/003)"
description: "Implementation steps for edge reason/step + blast_radius enrichment."
importance_tier: "important"
contextType: "implementation"
---
# Plan: 012/003

<!-- SPECKIT_LEVEL: 2 -->

## Steps

### A. Edge metadata
1. Extend `structural-indexer.ts:85-94` metadata writer with `reason: string` and `step: string`
2. Define owner-local vocabulary for `reason` (e.g., `"direct-import"`, `"ast-call-edge"`, `"heuristic-name-match"`) and `step` (e.g., `"parse"`, `"resolve"`, `"link"`)
3. Surface fields in `query.ts:978-981` relationship-query output
4. Propagate through `code-graph-context.ts` payload assembly

### B. Blast radius enrichment
5. Extend `computeBlastRadius` (`query.ts:862-909`) signature: add `minConfidence?: number`
6. Refactor output to `{ depthGroups, riskLevel, ambiguityCandidates, failureFallback? }`
7. Implement risk classification (rules: HIGH if depth-1 count > 10 or ambiguity present; MEDIUM if depth-1 ∈ [4,9]; LOW if ≤3)
8. Implement ambiguity detection — when target symbol fq_name resolves to multiple `code_nodes`, return candidates instead of picking
9. Wrap any failure paths in `failureFallback` structured shape

### C. Per-packet docs
10. `/create:feature-catalog` for `06--analysis/` (blast_radius uplift)
11. `/create:testing-playbook` for `06--analysis/`
12. sk-doc DQI ≥85

### D. Verification
13. Unit tests for each requirement
14. Run code-graph vitest suite — confirm no regression
15. `validate.sh --strict`
16. Populate `implementation-summary.md`

## Dependencies
- 012/001 license audit completion (P0)
- 012/002 phase runner — recommended but not strictly required (this sub-phase doesn't depend on phase boundaries)

## Effort
M (4-6h)

## References
- spec.md (this folder), tasks.md, checklist.md
