---
title: "Verification Checklist: Graph Testing and Playbook Alignment [006]"
description: "Verification checklist for integration tests, stress tests, playbook updates, and README alignment."
trigger_phrases:
  - "006"
  - "graph testing checklist"
  - "playbook alignment checklist"
importance_tier: "important"
contextType: "planning"
---
# Verification Checklist: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval for deferral |
| **[P2]** | Optional | Can defer with documented reason |

Mark each item `[x]` with evidence in brackets: `[Test: filename - result]`, `[Manual: description]`, `[Review: PR#]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] CJS coverage graph modules read and relation weights documented
- [x] CHK-002 [P0] TS coverage-graph-db.ts VALID_RELATIONS read and documented
- [x] CHK-003 [P1] Existing playbook files read for format patterns
- [x] CHK-004 [P1] Existing skill READMEs checked for graph references
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] `coverage-graph-integration.vitest.ts` created with CJS-TS relation alignment tests
- [ ] CHK-011 [P0] Integration tests verify weight clamping consistency across layers
- [ ] CHK-012 [P0] Integration tests verify self-loop prevention in both layers
- [ ] CHK-013 [P0] Integration tests verify namespace isolation
- [ ] CHK-014 [P0] `coverage-graph-stress.vitest.ts` created with 1000+ node tests
- [ ] CHK-015 [P0] Stress tests verify contradiction scanning at scale
- [ ] CHK-016 [P1] All integration tests pass with zero failures
- [ ] CHK-017 [P1] All stress tests pass with acceptable performance
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:playbooks -->
## Playbook Updates

- [ ] CHK-020 [P0] sk-deep-research: `031-graph-convergence-signals.md` created following existing playbook format
- [ ] CHK-021 [P0] sk-deep-research: `029-graph-events-emission.md` created following existing playbook format
- [ ] CHK-022 [P0] sk-deep-review: `021-graph-convergence-review.md` created following existing playbook format
- [ ] CHK-023 [P0] sk-deep-review: `015-graph-events-review.md` created following existing playbook format
- [ ] CHK-024 [P1] sk-agent-improver: mutation coverage, trade-off detection, and candidate lineage test cases created
- [ ] CHK-025 [P1] All playbook files use consistent frontmatter and section structure
<!-- /ANCHOR:playbooks -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] sk-deep-research README updated with graph capability references
- [ ] CHK-031 [P1] sk-deep-review README updated with graph capability references
- [ ] CHK-032 [P1] sk-agent-improver README updated with graph capability references
- [ ] CHK-033 [P2] implementation-summary.md created after all implementation is complete
<!-- /ANCHOR:docs -->
