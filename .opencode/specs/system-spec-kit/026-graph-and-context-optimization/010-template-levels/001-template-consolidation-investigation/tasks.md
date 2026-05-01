---
title: "Tasks: Template System Consolidation — Levels and Addendum to Generator"
description: "Task list for investigation packet. Phase 1 = run deep-research; Phase 2 = synthesize; Phase 3 = finalize ADR. Implementation tasks live in the follow-on packet."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "template consolidation tasks"
  - "spec-kit template tasks"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels"
    last_updated_at: "2026-05-01T07:34:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks skeleton created; T001 in flight"
    next_safe_action: "Wait for deep-research convergence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-template-consolidation-investigation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: Template System Consolidation — Levels and Addendum to Generator

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

- [x] T001 Scaffold spec folder via `create.sh --subfolder ... --level 3` (`010-template-levels/`)
- [x] T002 Author `spec.md` with research framing (problem, scope, requirements, risks)
- [x] T003 [P] Author `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` skeletons
- [x] T004 Run `validate.sh --strict` on the scaffolded packet
- [x] T005 Dispatch `/spec_kit:deep-research:auto` with 10 iterations, cli-codex gpt-5.5 high fast
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Deep-research loop runs autonomously (this packet's "implementation" is iterative research; the actual code refactor lives in a follow-on packet).

- [x] T006 Iteration 1: baseline analysis of current template system (newInfoRatio 0.82)
- [x] T007 Iterations 2-9: iterative investigation (ratios: 0.76 → 0.68 → 0.61 → 0.52 → 0.44 → 0.36 → 0.28 → 0.18)
- [x] T008 Convergence detected at iteration 10 (newInfoRatio 0.04 < threshold 0.05)
- [x] T009 `research/research.md` synthesized (29.7K, 17 sections) — recommendation: **PARTIAL**
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Post-research synthesis and decision finalization.

- [x] T010 Read `research/research.md` and extract recommendation (PARTIAL with 4-phase gated plan)
- [x] T011 Update `decision-record.md` ADR-001 with chosen direction, rationale, consequences, alternatives (5/5 Five Checks PASS)
- [ ] T012 Update `plan.md` Phases 1-N with concrete refactor steps from research synthesis
- [ ] T013 Populate risk register in `spec.md` §6 and §10 with research findings (final risk register lives in `research/research.md`; `spec.md` retains framing)
- [ ] T014 Run `validate.sh --strict` final pass
- [ ] T015 [P] Scaffold follow-on packet `011-template-consolidation-impl/` (or similar) using the populated plan — defer to user trigger
- [ ] T016 Author `implementation-summary.md` with packet outcomes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements (REQ-001 through REQ-004) satisfied
- [ ] `decision-record.md` ADR-001 finalized
- [ ] `validate.sh --strict` exits 0 or 1
- [ ] If recommendation is CONSOLIDATE: follow-on packet scaffolded with executable plan
- [ ] If recommendation is STATUS QUO: justification documented and packet closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research output**: See `research/research.md`
- **Decision record**: See `decision-record.md`
- **Parent**: `../spec.md` (026-graph-and-context-optimization)
<!-- /ANCHOR:cross-refs -->
