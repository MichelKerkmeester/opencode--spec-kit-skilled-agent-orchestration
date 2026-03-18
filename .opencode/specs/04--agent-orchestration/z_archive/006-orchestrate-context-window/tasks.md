---
title: "Tasks: Orchestrate Agent Context Window Protection [006-orchestrate-context-window/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "orchestrate"
  - "agent"
  - "context"
  - "window"
  - "006"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Orchestrate Agent Context Window Protection

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

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
## Phase 1: CWB Core System

- [x] T001 Add new Section 27: "Context Window Budget" to orchestrate.md
  - Budget formula: `max_parallel = (budget - overhead) / result_size`
  - Scale thresholds table (1-4, 5-9, 10-15, 16-20 agents)
  - Budget allocation for orchestrator's own context
  - Enforcement rules (MUST check before dispatch)
  - Pre-dispatch checklist added

- [x] T002 Add CWB pre-dispatch validation step to Section 1 workflow
  - Inserted as step 5 between DECOMPOSE and DELEGATE
  - Mermaid diagram updated with CWB CHECK node (gate style)
  - Steps renumbered 5-10

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Collection Patterns

- [x] T003 Add new Section 28: "Result Collection Patterns"
  - Pattern A: Direct collection (1-4 agents) with full dispatch example
  - Pattern B: Summary-only returns (5-9 agents) with 30-line constraint
  - Pattern C: File-based + wave batching (10-20 agents) with 4-wave example
  - Background Agent Variant documented
  - Wave Synthesis Protocol with 5-step compression flow
  - Anti-Pattern "The Context Bomb" with failure scenario
  - Decision Matrix flowchart

- [x] T004 Modify Section 11 dispatch format
  - Added `Output Size` field: [full | summary-only (30 lines) | minimal (3 lines)]
  - Added `Write To` field: [file path for detailed findings | "none"]
  - Added CWB Fields explanation block below dispatch format

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Cross-Section Updates

- [x] T005 Modify Section 5 (Sub-Orchestrator Pattern)
  - Added Context Budget constraint row to Sub-Orchestrator Constraints table
  - Added Return Size Rule subsection with max return sizes by scale

- [x] T006 Modify Section 9 (Resource Budgeting)
  - Added "Orchestrator Self-Budget" subsection with budget component table
  - Added rule linking to §28 for file-based collection

- [x] T007 Modify Section 13 (Parallel vs Sequential)
  - Added "(with CWB Ceiling)" to section title
  - Added "within CWB limits" to parallel-first principle
  - Added CWB CEILING paragraph with wave explanation
  - Added Agent Count / Parallel Behavior table

- [x] T008 Modify Section 21 (Context Preservation)
  - Added "Agent dispatches" and "Context pressure" rows to monitoring table
  - Added proactive vs reactive note cross-referencing §27

- [x] T009 Modify Section 25 (Scaling Heuristics)
  - Added "Collection Pattern (§28)" column
  - Added "Est. Return per Agent" column with token estimates
  - Added CWB Integration note

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Safety Rails

- [x] T010 Add anti-pattern warning block
  - Section 28: "The Context Bomb" anti-pattern with full failure sequence
  - Section 29: Six anti-patterns including "Never dispatch 5+ agents without CWB check"

- [x] T011 Add context overflow to Circuit Breaker (Section 17)
  - Added "Context budget exceeded" to edge cases table
  - Added "Context Overflow Protection" subsection with 4-step protocol

- [x] T012 Update Summary (Section 23)
  - Added "Context Window Budget" to Advanced Features
  - Updated Parallel-First to show CWB ceiling with wave sizes
  - Added CWB enforcement to Limits section

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [x] T013 Read final orchestrate.md end-to-end
  - Section numbering: 1-30, sequential, no gaps ✓
  - Cross-references: all §N references resolve to valid sections ✓
  - No contradictions: parallel-first preserved within wave limits ✓
  - `validate_document.py`: PASSED (0 issues) ✓
  - `extract_structure.py`: DQI 95/100 (EXCELLENT) ✓

- [x] T014 Mental simulation: walk through 20-agent scenario
  - 4 waves × 5 agents, file-based collection
  - Per wave: 250 tokens summaries → orchestrator context
  - Total results: ~3K tokens vs ~150K available = PASSES ✓
  - Old approach: 20 × 8K = 160K = OVERFLOW ✗

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T014 all completed
- [x] No `[B]` blocked tasks remaining — None
- [x] orchestrate.md passes structural verification (T013) — DQI 95/100
- [x] 20-agent scenario traces successfully (T014) — ~3K tokens vs 160K old approach

<!-- /ANCHOR:completion -->

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [x] Load `spec.md` and verify scope hasn't changed
2. [x] Load `plan.md` and identify current phase
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied
5. [ ] Load `checklist.md` and identify relevant P0/P1 items
6. [x] Check for blocking issues in `decision-record.md`
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Phase 3 tasks must complete after Phase 1+2 |
| TASK-SCOPE | Stay within orchestrate.md, no other files |
| TASK-VERIFY | Verify each modification against spec requirements |
| TASK-DOC | Update task status immediately on completion |

---

## Workstream Organization

### Workstream 1: CWB Core + Patterns (T001-T004)
- [x] T001 Section 27: CWB System
- [x] T002 Workflow integration
- [x] T003 Section 28: Collection Patterns
- [x] T004 Dispatch format update

### Workstream 2: Integration + Safety (T005-T012)
- [x] T005-T009 Cross-section updates
- [x] T010-T012 Safety rails

### Workstream 3: Verification (T013-T014)
- [x] T013 Structural verification
- [x] T014 Scenario simulation

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
