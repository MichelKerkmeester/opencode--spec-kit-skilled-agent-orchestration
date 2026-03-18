# Tasks: sk-deep-research Refinement via Self-Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Define research questions RQ1-RQ8 in strategy.md (scratch/deep-research-strategy.md)
- [ ] T002 [P0] Create research-ideas.md seeded from spec 023 proposals (scratch/research-ideas.md)
- [ ] T003 [P0] Configure research parameters: maxIterations=15, convergenceThreshold=0.02 (scratch/deep-research-config.json)
- [ ] T004 [P1] Verify spec folder scratch/ directory ready
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P0] Launch `/spec_kit:deep-research:auto` with prepared context
- [ ] T006 [P0] Research converges naturally (8-15 iterations expected)
- [ ] T007 [P0] research.md produced with synthesized findings (research.md)
- [ ] T008 [P1] All 3 external repos analyzed at code level (AGR, pi-autoresearch, autoresearch-opencode)
- [ ] T009 [P1] Cross-runtime agent definition audit completed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 [P0] Create v3 improvement-proposals.md with validated proposals (scratch/improvement-proposals-v3.md)
- [ ] T011 [P1] All 18 v2 proposals have validation status
- [ ] T012 [P1] File-level change lists for all P1/P2 proposals
- [ ] T013 [P1] At least 3 new proposals discovered
- [ ] T014 [P2] Updated implementation sequencing for v3
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Memory saved via generate-context.js
- [ ] Checklist verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../023-sk-deep-research-creation/`
- **Prior Proposals**: See `../023-sk-deep-research-creation/scratch/improvement-proposals.md`
<!-- /ANCHOR:cross-refs -->
