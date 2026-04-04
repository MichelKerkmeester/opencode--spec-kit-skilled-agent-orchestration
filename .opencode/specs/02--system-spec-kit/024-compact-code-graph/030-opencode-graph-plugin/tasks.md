---
title: "Tasks: OpenCode Graph Plugin Phased Execution [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/tasks]"
description: "Task Format: T### [P?] Description (file path). Tracks the completed runtime phases under packet 030."
trigger_phrases:
  - "packet 030 tasks"
  - "phase creation tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: OpenCode Graph Plugin Phased Execution

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

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the phase or packet scope before editing.
- Confirm runtime claims are backed by the existing implementation summary.
- Confirm strict validation is the final closeout gate.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `DOC-SCOPE` | Keep edits inside the declared packet or phase scope. |
| `TRUTH-FIRST` | Do not change the meaning of the shipped runtime claims. |
| `VALIDATE-LAST` | Rerun strict validation before claiming completion. |

### Status Reporting Format
- `in-progress`: describe the active doc or validation pass.
- `blocked`: record the validator error or missing evidence.
- `completed`: record changed files and final validation status.

### Blocked Task Protocol
- If validation fails, keep the related task open until the blocker is fixed.
- If evidence is missing, record that gap explicitly instead of marking completion.


---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Complete the shared payload/provenance runtime layer and Phase 1 packet docs
- [x] T002 Confirm the Phase 2 transport boundary consumes the Phase 1 contract without owning retrieval policy
- [x] T003 [P] Confirm the Phase 3 graph-ops hardening boundary stays below the transport shell
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement and wire the live OpenCode plugin transport layer into session resume/bootstrap outputs and `opencode.json`
- [x] T005 Implement and wire the graph operations hardening helper into session health/resume/bootstrap outputs
- [x] T006 Synchronize parent and child packet docs with the delivered runtime files
- [x] T007 Create implementation summaries for the parent packet and all three child phases
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `npm run typecheck` for `.opencode/skill/system-spec-kit/mcp_server`
- [x] T009 Run targeted `vitest` coverage for shared payload, transport adapter, live plugin, graph ops, bootstrap, and context-server behavior
- [x] T010 Run strict packet validation and JSON validation for packet 030
- [x] T010a Run plugin-specific verification for `.opencode/plugins/spec-kit-compact-code-graph.js` and `opencode.json`
- [x] T011 Verify future memory saves can target child phase folders through the documented explicit CLI target workflow
- [x] T012 Obtain a parallel review pass over the completed packet and runtime surfaces
- [x] T013 Create phase `004-cross-runtime-startup-surfacing-parity` and truth-sync the parent packet docs
- [x] T014 Implement startup/session-context surfacing parity across the targeted non-OpenCode CLI runtime surfaces
- [x] T015 Run runtime/config verification proving those startup surfaces now match the OpenCode reference behavior
- [x] T016 Refresh packet closeout evidence after the parity implementation lands
- [x] T017 Create phase `005-code-graph-auto-reindex-parity` and thread it through the parent packet as the next follow-on
- [x] T018 Implement bounded code graph auto-reindex parity so structural reads mimic CocoIndex first-use refresh where safe
- [x] T019 Run typecheck, targeted `vitest`, and strict packet validation for Phase 5
- [x] T020 Refresh packet closeout evidence once Phase 5 lands
- [x] T021 Create phase `031-copilot-startup-hook-wiring` and thread it through the parent packet
- [x] T022 Implement the Copilot repo-local sessionStart wrapper and preserve best-effort Superset notifications
- [x] T023 Align Copilot runtime detection, tests, and runtime-detection docs with the new repo hook reality
- [x] T024 Run targeted verification and strict packet validation for Phase 031
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All active packet tasks are marked `[x]`
- [x] Completed phases 001-003 remain closed with evidence-backed runtime verification
- [x] Startup/session-context parity follow-on is implemented and verified
- [x] Code graph auto-reindex parity follow-on is implemented and verified
- [x] Copilot startup-hook wiring follow-on is implemented and verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
