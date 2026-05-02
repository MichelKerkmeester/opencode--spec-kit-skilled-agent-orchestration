---
title: "Tasks: System Deep Research — Bugs and Improvements"
description: "Task tracker for packet 046 — 20-iteration deep research loop."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "046-system-deep-research-bugs-and-improvements tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
    last_updated_at: "2026-05-01T05:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Dispatch workflow"
    blockers: []
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

# Tasks: System Deep Research — Bugs and Improvements

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

- [x] T001 Scaffold packet 046 (Level 2)
- [x] T002 Remove template README artifact
- [x] T003 Author spec.md with 20 research angles (5 per category × 4 categories)
- [x] T004 Author plan.md, tasks.md, checklist.md
- [ ] T005 Validate strict + commit packet scaffold
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Init phase: write deep-research-config.json (cli-codex/gpt-5.5/high)
- [ ] T007 Init phase: write deep-research-strategy.md (20-angle question mapping)
- [ ] T008 Init phase: load memory_context + cocoindex prior research
- [ ] T009 Loop phase: iterations 001-005 (Category A — production bugs)
- [ ] T010 Loop phase: iterations 006-010 (Category B — wiring/automation)
- [ ] T011 Loop phase: iterations 011-015 (Category C — refinement)
- [ ] T012 Loop phase: iterations 016-020 (Category D — architecture/organization)
- [ ] T013 Synth phase: research.md aggregation across iterations
- [ ] T014 Synth phase: resource-map.md emission
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Save phase: generate-context.js for 046
- [ ] T016 Verify each iteration cites file:line evidence (spot-check 5 random)
- [ ] T017 Verify research.md addresses all 20 angles (grep A1..D5)
- [ ] T018 Run validate.sh --strict
- [ ] T019 Commit + push (research/ folder + spec docs)
- [ ] T020 Provide remediation seed for follow-on packets (047+)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] 20 iteration files exist
- [ ] research.md + resource-map.md exist
- [ ] validate.sh --strict exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md` (20 angles in §3 Scope)
- **Plan**: `plan.md`
- **Workflow**: `/spec_kit:deep-research:auto`
- **Workflow YAML**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Skill protocol**: `.opencode/skill/sk-deep-research/SKILL.md`
- **Outputs**:
  - `research/iterations/iteration-NNN.md` (×20)
  - `research/deltas/iter-NNN.jsonl` (×20)
  - `research/research.md` (synthesis)
  - `research/resource-map.md`
<!-- /ANCHOR:cross-refs -->

---
