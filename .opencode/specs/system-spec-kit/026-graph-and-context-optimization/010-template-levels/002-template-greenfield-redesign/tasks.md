---
title: "Tasks: Template Backend Greenfield Redesign"
description: "Task list for the greenfield investigation packet. 9-iter deep-research loop converged at 0.06; ADR-001 chose C+F hybrid manifest-driven design."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "template greenfield tasks"
  - "C+F hybrid tasks"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign"
    last_updated_at: "2026-05-01T12:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks updated post-convergence; Phase 1+2+3 done"
    next_safe_action: "Trigger follow-on implementation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-11-00-template-greenfield"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Template Backend Greenfield Redesign

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Scaffold packet via `create.sh --subfolder ... --topic 'template-greenfield-redesign' --level 3`
- [x] T002 Author `spec.md` with greenfield framing + 10 research questions + 5 candidate designs
- [x] T003 [P] Initialize deep-research state files (config, state.jsonl, strategy with anchors, registry)
- [x] T004 Dispatch `/spec_kit:deep-research:auto` with 9 iterations, cli-codex gpt-5.5 high fast, convergence 0.10
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Deep-research loop ran autonomously. 9 iterations of cli-codex / gpt-5.5 / high reasoning / fast service-tier with externalized state.

- [x] T005 Iteration 1: parser-contract probe + irreducible-core inventory (newInfoRatio 0.78)
- [x] T006 Iteration 2: addon-doc lifecycle classification + level-encoding validator survey (0.82)
- [x] T007 Iteration 3: design elimination round — C+F hybrid winner picked (0.74)
- [x] T008 Iteration 4: manifest schema + sample scaffolds + golden tests (0.67)
- [x] T009 Iteration 5: refactor plan + Q10 inline-gates decision + risk register (0.58)
- [x] T010 Iteration 6: inline-gate EBNF + manifest evolution policy + edge probes (0.47)
- [x] T011 Iteration 7: integration probe — concrete diffs against current source (0.41)
- [x] T012 Iteration 8: end-to-end dry-run of 3 preset shapes + concretized manifest JSON (0.38)
- [x] T013 Iteration 9: final synthesis — research.md + resource-map.md + ADRs (0.06 — CONVERGED)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Post-research synthesis and decision finalization.

- [x] T014 Read `research/research.md` (40.9 KB, 17 sections) and extract recommendation
- [x] T015 Update `decision-record.md` with ADR-001 (C+F hybrid) + ADR-002 (manifest version) + ADR-003 (template-contract location) + ADR-004 (phase-parent scaffolding)
- [x] T016 Update `plan.md` with concrete refactor phases from research synthesis
- [ ] T017 Run `validate.sh --strict` final pass
- [ ] T018 Author `implementation-summary.md` with packet outcomes
- [ ] T019 [P] User triggers follow-on implementation packet (012-template-greenfield-impl/ or similar)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements (REQ-001 through REQ-005) satisfied
- [x] `decision-record.md` ADR-001 finalized + 5/5 Five Checks PASS
- [x] `research/research.md` produced (40.9 KB, 17 sections)
- [x] `research/resource-map.md` produced (11.5 KB)
- [x] All 10 design questions Q1-Q10 answered with cited evidence
- [x] 3 final open items resolved as ADR-002/003/004
- [ ] `validate.sh --strict` exits 0 or 1 (final pass after all spec-doc edits land)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
