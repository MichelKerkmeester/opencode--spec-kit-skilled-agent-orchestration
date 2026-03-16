---
title: "Verification Checklist: Embedding Optimization [template:level_2/checklist.md]"
---
# Verification Checklist: Embedding Optimization

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
- [ ] CHK-003 [P1] Dependencies identified and available (R-08 status confirmed; fallback section header parsing ready)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `buildWeightedEmbeddingPayload()` produces correct multiplier concatenation (title 1x, decisions 3x, outcomes 2x, general 1x)
- [ ] CHK-011 [P0] Memory indexer calls `generateDocumentEmbedding()` instead of raw `generateEmbedding()`
- [ ] CHK-012 [P1] Total payload length is capped; truncation priority is general > outcomes > decisions
- [ ] CHK-013 [P1] Structured section extraction correctly identifies title, decisions, outcomes, and general content
- [ ] CHK-014 [P1] Static decay metadata fields persisted by indexer for searcher consumption
- [ ] CHK-015 [P2] Weight multipliers are configurable (not hardcoded magic numbers)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests pass for weighted payload builder (concatenation, multipliers, truncation order)
- [ ] CHK-021 [P0] Unit tests pass for indexer routing through `generateDocumentEmbedding`
- [ ] CHK-022 [P1] Integration test: decision-heavy memory produces improved top-k retrieval ranking
- [ ] CHK-023 [P1] Existing embedding and indexer test suites pass with no regressions
- [ ] CHK-024 [P1] Temporal decay behavior unchanged at query time (searcher not modified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] Weighted payload does not leak sensitive content through repetition amplification
- [ ] CHK-031 [P2] Payload length cap prevents memory exhaustion from adversarial input
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md up to date with final implementation
- [ ] CHK-041 [P2] implementation-summary.md created after completion
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
| P0 Items | 5 | [ ]/5 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
