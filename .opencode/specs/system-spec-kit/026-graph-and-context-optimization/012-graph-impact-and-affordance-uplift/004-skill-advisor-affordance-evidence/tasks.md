---
title: "Tasks: Skill Advisor Affordance Evidence (012/004)"
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "012/004 tasks"
  - "affordance evidence tasks"
  - "skill advisor affordance tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence"
    last_updated_at: "2026-04-25T14:03:00+02:00"
    last_updated_by: "copilot-gpt-5.5"
    recent_action: "Normalized tasks doc"
    next_safe_action: "Review local commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Advisor Affordance Evidence (012/004)

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

- [x] T001 Confirm 012/001 license approval (spec docs) [EVIDENCE: implementation-summary.md records approval]
- [x] T002 Read agent brief and pt-02 RISK-05 constraints (prompts/agent-brief.md) [EVIDENCE: hard rules reflected in spec.md]
- [x] T003 [P] Read scorer, compiler, and projection context before edits (skill_advisor files) [EVIDENCE: implementation-summary.md references touched files]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define `AffordanceInput` and `NormalizedAffordance` types (affordance-normalizer.ts) [EVIDENCE: normalizer exports typed API]
- [x] T005 Implement allowlist filter (affordance-normalizer.ts) [EVIDENCE: affordance-normalizer.test.ts passes]
- [x] T006 Implement privacy stripping (affordance-normalizer.ts) [EVIDENCE: privacy assertion test passes]
- [x] T007 Add raw affordance option to scorer types (types.ts) [EVIDENCE: npm run typecheck passes]
- [x] T008 Force normalization before lane scoring (fusion.ts) [EVIDENCE: fusion passes normalized affordances into lanes]
- [x] T009 Add derived lane affordance scoring (derived.ts) [EVIDENCE: lane-attribution.test.ts passes]
- [x] T010 Add graph-causal affordance edge scoring (graph-causal.ts) [EVIDENCE: EDGE_MULTIPLIER keys unchanged]
- [x] T011 Extend Python compiler derived affordance support (skill_graph_compiler.py) [EVIDENCE: T246-GC-011 passes]
- [x] T012 Preserve compiler entity-kind allowlist (skill_graph_compiler.py) [EVIDENCE: T246-GC-012 passes]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Add Vitest allowlist and privacy coverage (affordance-normalizer.test.ts) [EVIDENCE: focused Vitest run passes]
- [x] T014 Add Vitest lane attribution coverage (lane-attribution.test.ts) [EVIDENCE: focused Vitest run passes]
- [x] T015 Add routing fixture coverage (routing-fixtures.affordance.test.ts) [EVIDENCE: focused Vitest run passes]
- [x] T016 Add feature catalog and playbook docs (system-spec-kit docs) [EVIDENCE: DQI 87 and 91]
- [x] T017 Populate implementation summary and checklist (spec folder) [EVIDENCE: implementation-summary.md and checklist.md updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [EVIDENCE: T001 through T017 complete]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: no blocked tasks listed]
- [x] Manual verification passed [EVIDENCE: manual playbook entry documents expected checks]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
