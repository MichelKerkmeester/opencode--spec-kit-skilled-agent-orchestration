---
title: "Tasks: Copilot Startup Hook Wiring [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring]"
description: "Task Format: T### [P?] Description (file path). Tracks the completed Phase 031 Copilot startup-hook wiring follow-on."
trigger_phrases:
  - "phase 031 tasks"
  - "copilot startup hook tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Copilot Startup Hook Wiring

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
- Confirm the Copilot report is the triggering evidence for this phase.
- Confirm runtime edits stay bounded to startup wiring, runtime detection, and truth-sync.
- Confirm strict packet validation is the final gate.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `COPILOT-SCOPE` | Touch only Copilot hook config/scripts, runtime detection/tests, and related packet/docs. |
| `SHARED-BANNER` | Reuse the shared startup brief instead of creating a Copilot-only banner string. |
| `VALIDATE-LAST` | Finish with targeted tests, hook smoke runs, and strict packet validation. |

### Status Reporting Format
- `in-progress`: describe the active wiring, test, or doc-sync pass.
- `blocked`: record the failing hook/test/validator output.
- `completed`: record changed files and final verification commands.

### Blocked Task Protocol
- If live wrapper output is wrong, keep the hook-wiring task open.
- If runtime detection docs still describe `disabled_by_scope` for this repo, keep the doc-sync task open.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Replace the Copilot `sessionStart` hook command with a repo-local startup wrapper
- [x] T002 Create a repo-local Superset notifier wrapper for non-banner events
- [x] T003 Preserve the shared startup banner output and snapshot note in the new startup wrapper
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Make Copilot runtime detection depend on actual repo hook wiring
- [x] T005 Update runtime-detection and cross-runtime fallback tests for the new Copilot behavior
- [x] T006 Add a dedicated Copilot hook wiring test covering JSON config plus wrapper output
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Create the Phase 031 Level 3 packet docs
- [x] T008 Update parent packet and Phase 004 docs so they stop claiming Copilot config is local/untracked
- [x] T009 Update related runtime-detection playbook and feature docs
- [x] T010 Run targeted `vitest`, hook smoke runs, JSON validation, and strict packet validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All active Phase 031 tasks are marked `[x]`
- [x] Copilot `sessionStart` now surfaces the shared startup banner through tracked repo config
- [x] Copilot runtime detection is dynamic and evidence-backed
- [x] Parent packet and related docs no longer overstate or understate Copilot parity
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
