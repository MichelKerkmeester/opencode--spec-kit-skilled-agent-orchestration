---
title: "Verification Checklist: Phase Classification [template:level_2/checklist.md]"
---
# Verification Checklist: Phase Classification

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
- [ ] CHK-003 [P1] Dependencies identified and available (R-08 signal extraction completed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `TopicCluster` interface defined with all required fields: id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence (REQ-001)
- [ ] CHK-011 [P0] Per-exchange document vectors built using trigger-extractor preprocessing (REQ-002)
- [ ] CHK-012 [P0] Keyword-precedence ladder replaced with cluster-level phase scoring (REQ-001)
- [ ] CHK-013 [P1] Observation types expanded: test, documentation, performance added to existing set (REQ-003)
- [ ] CHK-014 [P1] Non-contiguous phase returns tracked as separate timeline entries (REQ-004)
- [ ] CHK-015 [P1] `FLOW_PATTERN` derived from cluster branching structure: linear / branching / iterative / exploratory (REQ-005)
- [ ] CHK-016 [P1] Context-aware scoring resolves ambiguous cases (e.g., "grep in debug output" -> Debugging)
- [ ] CHK-017 [P2] Cluster confidence values are meaningful (ratio of top score to total)
- [ ] CHK-018 [P2] `collect-session-data.ts` supports `TopicCluster` output alongside existing structures
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] SC-001 validated: "grep in debug output" classified as Debugging, not Research
- [ ] CHK-021 [P0] SC-002 validated: Research -> Implementation -> Research produces 3 separate timeline entries
- [ ] CHK-022 [P1] New observation types (test, documentation, performance) correctly recognized and classified
- [ ] CHK-023 [P1] `FLOW_PATTERN` correctly derived from known cluster structures
- [ ] CHK-024 [P1] Existing phase classification tests still pass with updated scoring
- [ ] CHK-025 [P2] Document vector construction produces consistent term-frequency maps
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] No sensitive data exposed through cluster metadata
- [ ] CHK-031 [P2] Cosine similarity computation handles edge cases (zero vectors, single-term vectors)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md updated with final implementation details
- [ ] CHK-041 [P2] implementation-summary.md written after completion
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
| P1 Items | 10 | [ ]/10 |
| P2 Items | 7 | [ ]/7 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
