---
title: "Plan: Memory Causal Trust Display (012/005)"
description: "Display-only badges on MemoryResultEnvelope."
importance_tier: "important"
contextType: "implementation"
---
# Plan: 012/005

<!-- SPECKIT_LEVEL: 2 -->

## Steps

### A. Compute badges
1. Read `lib/storage/causal-edges.ts:82-94` to confirm available columns
2. Define `TrustBadges` interface: `{ confidence, extractionAge, lastAccessAge, orphan, weightHistoryChanged }`
3. Compute helper: from causal edge row → `TrustBadges`
4. Decide display placement (memory_search results / context envelope / status panel) — record in implementation-summary.md

### B. Wire into formatters
5. Modify `formatters/search-results.ts` to add `trustBadges` to envelope (additive)
6. Modify `lib/response/profile-formatters.ts` to propagate badges
7. Confirm backward compat: callers without expectation of new field still parse

### C. Per-packet docs
8. `/create:feature-catalog` for `13--memory-quality-and-indexing/`
9. `/create:testing-playbook` for `13--memory-quality-and-indexing/`
10. sk-doc DQI ≥85

### D. Verification
11. Unit tests per requirement
12. Static check: causal_edges schema unchanged
13. Static check: relation type list unchanged
14. `validate.sh --strict`
15. Populate `implementation-summary.md`

## Dependencies
- 012/001 license audit complete

## Effort
S-M (2-4h)

## References
- spec.md (this folder), tasks.md, checklist.md
