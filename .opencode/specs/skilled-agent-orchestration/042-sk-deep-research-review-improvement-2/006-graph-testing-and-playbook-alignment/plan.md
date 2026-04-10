---
title: "Implementation Plan: Graph Testing and Playbook Alignment [006]"
description: "3-part plan covering integration tests, stress tests, manual testing playbook updates, and README alignment for coverage graph capabilities."
trigger_phrases:
  - "006"
  - "graph testing plan"
  - "playbook alignment plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Vitest tests), Markdown (playbook + READMEs) |
| **Framework** | Vitest for integration/stress tests |
| **Source Modules** | CJS: coverage-graph-core.cjs, coverage-graph-signals.cjs, coverage-graph-convergence.cjs, coverage-graph-contradictions.cjs; TS: coverage-graph-db.ts |
| **Testing** | Vitest integration + stress suites; manual operator testing playbooks |

### Overview

This plan delivers three parts:

- **Part A**: Rigorous integration and stress tests that verify CJS-to-TS API contract alignment, namespace isolation, and performance at scale
- **Part B**: Manual testing playbook updates adding graph-specific test cases to sk-deep-research, sk-deep-review, and sk-agent-improver
- **Part C**: README updates for skills missing graph capability references
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Coverage graph CJS modules exist and have passing unit tests
- [x] Coverage graph TS DB module exists with type definitions
- [x] Existing playbook files read for format patterns
- [x] Existing READMEs checked for graph references

### Definition of Done

- [ ] Integration test suite passes with zero failures
- [ ] Stress test suite passes with acceptable performance
- [ ] 4 new playbook files in sk-deep-research and sk-deep-review
- [ ] 3 new playbook files in sk-agent-improver
- [ ] Skill READMEs updated where graph references are missing
- [ ] Checklist items verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:plan -->
## 3. IMPLEMENTATION PLAN

### Part A: Integration and Stress Tests

1. Create `coverage-graph-integration.vitest.ts` with test suites for:
   - CJS-TS relation name alignment (research and review)
   - Weight clamping consistency
   - Self-loop prevention in both layers
   - Namespace isolation
   - Convergence signal alignment

2. Create `coverage-graph-stress.vitest.ts` with test suites for:
   - 1000+ node graph construction and query
   - Contradiction scanning at scale
   - Provenance traversal performance
   - Cluster metrics at scale

### Part B: Manual Testing Playbooks

3. Add research playbook test cases:
   - `031-graph-convergence-signals.md` in `04--convergence-and-recovery/`
   - `029-graph-events-emission.md` in `03--iteration-execution-and-state-discipline/`

4. Add review playbook test cases:
   - `021-graph-convergence-review.md` in `04--convergence-and-recovery/`
   - `015-graph-events-review.md` in `03--iteration-execution-and-state-discipline/`

5. Add agent-improver playbook test cases:
   - `022-mutation-coverage-graph-tracking.md` in `06--end-to-end-loop/`
   - `023-trade-off-detection.md` in `06--end-to-end-loop/`
   - `024-candidate-lineage.md` in `06--end-to-end-loop/`

### Part C: README Updates

6. Update READMEs for sk-deep-research, sk-deep-review, and sk-agent-improver to reference graph capabilities where missing.
<!-- /ANCHOR:plan -->

---

<!-- ANCHOR:risks -->
## 4. RISKS

| Risk | Mitigation |
|------|------------|
| TS DB module requires better-sqlite3 which may not be available in test env | Integration tests import types only from TS; contract checks use string comparison on exported constants |
| CJS relation sets intentionally differ from TS (TS has additional relations) | Tests document the superset relationship explicitly |
| Playbook format evolution | All new playbooks follow the latest pattern from existing files |
<!-- /ANCHOR:risks -->
