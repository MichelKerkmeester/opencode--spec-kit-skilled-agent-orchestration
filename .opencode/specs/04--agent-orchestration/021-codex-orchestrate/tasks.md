---
title: "Tasks: ChatGPT Agent Suite Codex Optimization [021-codex-orchestrate/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "chatgpt"
  - "agent"
  - "suite"
  - "codex"
  - "021"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: ChatGPT Agent Suite Codex Optimization

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
## Phase 1: Request Analysis and Planning

- [x] T001 Confirm execution mode is `:auto` from user request
- [x] T002 Load `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- [x] T003 Analyze all `.opencode/agent/chatgpt/*.md` files for contradiction drift
- [x] T004 Create/update Level 3 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update retrieval-mode and output-budget policy (`.opencode/agent/chatgpt/context.md`)
- [x] T006 Update low-complexity fast-path analysis wording (`.opencode/agent/chatgpt/debug.md`)
- [x] T007 Update handover fast-path/tool-call and context-package wording (`.opencode/agent/chatgpt/handover.md`)
- [x] T008 Update research memory-save default and trivial exception wording (`.opencode/agent/chatgpt/research.md`)
- [x] T009 Update review model convention and blocker-vs-required semantics (`.opencode/agent/chatgpt/review.md`)
- [x] T010 Update speckit level semantics and validation-exit guidance (`.opencode/agent/chatgpt/speckit.md`)
- [x] T011 Update write template-first fast-path and mode-aware DQI thresholds (`.opencode/agent/chatgpt/write.md`)
- [x] T012 Update orchestrate direct-first profile, DEG, CWB/TCB thresholds, and anti-patterns (`.opencode/agent/chatgpt/orchestrate.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify NDP constraints remain unchanged (depth max and LEAF rules)
- [x] T014 Verify contradiction fixes and threshold references are internally consistent
- [x] T015 Verify scope lock: audit covers all 8 ChatGPT agent files and no extra agent families
- [x] T016 Complete Level 3 checklist with P0/P1 evidence citations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Completion and Context

- [x] T017 Update `implementation-summary.md` with all changed ChatGPT files and policy deltas
- [x] T018 Add ADR for cross-agent optimization strategy in `decision-record.md`
- [x] T019 Run spec validation (`validate.sh --json`) and capture results
- [x] T020 Return updated file list, validation summary, and remaining TODOs
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification checklist completed with P0/P1 evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
