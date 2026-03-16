---
title: "Verification Checklist: Signal Extraction [template:level_2/checklist.md]"
---
# Verification Checklist: Signal Extraction

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified (none -- foundational change)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `SemanticSignalExtractor` created with `mode: 'topics' | 'triggers' | 'summary' | 'all'` (REQ-001)
- [ ] CHK-011 [P0] Single canonical stopword profile with `balanced` and `aggressive` modes replaces 3 divergent lists (REQ-002)
- [ ] CHK-012 [P0] Golden tests with 3+ frozen input -> expected output for regression detection (REQ-004)
- [ ] CHK-013 [P1] Configurable n-gram depth (1-4 grams) with default 2 (REQ-003)
- [ ] CHK-014 [P1] `trigger-extractor.ts` converted to thin adapter with stable public API (REQ-005)
- [ ] CHK-015 [P1] `topic-extractor.ts` converted to thin adapter with stable public API (REQ-005)
- [ ] CHK-016 [P1] `session-extractor.ts` inline extraction (lines 381-437) removed; delegates to unified engine (REQ-005)
- [ ] CHK-017 [P1] `semantic-summarizer.ts` converted to thin adapter (REQ-005)
- [ ] CHK-018 [P2] Dead code removed from migrated extractors
- [ ] CHK-019 [P2] TF-IDF weighting consistent with existing trigger-extractor logic
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] SC-001 validated: same input produces deterministic ranked output regardless of call path
- [ ] CHK-021 [P0] Golden tests pass after all adapter migrations
- [ ] CHK-022 [P1] SC-002 validated: stopword divergence eliminated (53 session-only + 36 trigger-only reconciled)
- [ ] CHK-023 [P1] Existing extractor test suites pass through adapter layer
- [ ] CHK-024 [P1] Same input through all 4 call paths produces identical ranked output
- [ ] CHK-025 [P1] Stopword profile modes (balanced vs. aggressive) produce expected differences
- [ ] CHK-026 [P2] N-gram extraction validated at depths 1-4
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] No sensitive data exposed through extraction output
- [ ] CHK-031 [P2] TF-IDF computation handles adversarial/empty input gracefully
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md updated with final implementation details
- [ ] CHK-041 [P1] Stopword reconciliation decisions documented (session-only words kept/dropped)
- [ ] CHK-042 [P2] implementation-summary.md written after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 6 | [ ]/6 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
