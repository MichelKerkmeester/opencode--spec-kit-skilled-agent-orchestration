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

- [x] T001 [P0] Define research questions RQ1-RQ8 in strategy.md (scratch/deep-research-strategy.md)
- [x] T002 [P0] Create research-ideas.md seeded from spec 023 proposals (scratch/research-ideas.md)
- [x] T003 [P0] Configure research parameters: maxIterations=15, convergenceThreshold=0.02 (scratch/deep-research-config.json)
- [x] T004 [P1] Verify spec folder scratch/ directory ready
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Launch deep research loop with prepared context — 3-wave orchestration with Wave 1 prep (3 parallel agents), Wave 2 loop (9 iterations), Wave 3 post-processing (2 parallel agents)
- [x] T006 [P0] Research converges naturally (9 iterations, practical convergence at question entropy STOP + ratio drop to 0.25)
- [x] T007 [P0] research.md produced with synthesized findings (research.md — 210 lines, 8 key findings, 15 v3 proposals)
- [x] T008 [P1] All 3 external repos analyzed at code level (AGR, pi-autoresearch, autoresearch-opencode) — 55+ SOURCE citations across 9 iterations
- [x] T009 [P1] Cross-runtime agent definition audit completed (wave1-cross-runtime-audit.md — 10 divergences, 7 alignment recommendations)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Create v3 improvement-proposals.md with validated proposals (scratch/improvement-proposals-v3.md — 575 lines)
- [x] T011 [P1] All 18 v2 proposals have validation status (8 implemented, 5 partial, 1 excluded, 2 tracked, 1 merged, 1 reclassified)
- [x] T012 [P1] File-level change lists for all P1/P2 proposals (all 15 v3 proposals have file-level change tables)
- [x] T013 [P1] At least 3 new proposals discovered (7 genuinely new: v3-02, v3-03, v3-04, v3-05, v3-06, v3-09, v3-10)
- [x] T014 [P2] Updated implementation sequencing for v3 (4-phase critical path in both research.md and improvement-proposals-v3.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Memory saved via generate-context.js (memory #4409, quality 83/100)
- [x] Checklist verified (20/20: 7 P0, 10 P1, 3 P2 — all with evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../023-sk-deep-research-creation/`
- **Prior Proposals**: See `../023-sk-deep-research-creation/scratch/improvement-proposals.md`
<!-- /ANCHOR:cross-refs -->
