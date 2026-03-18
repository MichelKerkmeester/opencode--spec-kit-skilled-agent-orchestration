---
title: "Tasks: Review Agent Model-Agnostic [015-review-agent-model-agnostic/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "review"
  - "agent"
  - "model"
  - "agnostic"
  - "015"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Review Agent Model-Agnostic

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Create spec folder structure (`.opencode/specs/04--agent-orchestration/z_archive/015-review-agent-model-agnostic/`)
- [x] T002 Create spec.md with requirements and scope
- [x] T003 Create plan.md with implementation strategy
- [x] T004 Create tasks.md with task breakdown

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Read `.opencode/agent/review.md` to verify current frontmatter structure
- [x] T006 Remove line 5: `model: github-copilot/claude-opus-4.6` from frontmatter
- [x] T007 Verify YAML frontmatter parses correctly after edit
- [x] T008 Grep body text to confirm no model-specific prose remains

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Manual test: Dispatch review agent from @general (Sonnet 4.5)
- [x] T010 Manual test: Dispatch review agent from @orchestrate (if using different model)
- [x] T011 Verify review agent executes without errors in both cases
- [x] T012 Create implementation-summary.md documenting changes and verification results

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (review agent dispatches with model inheritance)
- [x] YAML frontmatter validates successfully

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
