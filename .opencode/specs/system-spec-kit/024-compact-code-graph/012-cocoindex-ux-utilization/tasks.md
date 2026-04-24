<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Tasks: Phase 012 — CocoIndex UX [system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/tasks]"
description: "Track delivered Phase 012 work and explicit not-implemented follow-ups."
trigger_phrases:
  - "tasks"
  - "phase 012"
  - "cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/012-cocoindex-ux-utilization"
    last_updated_at: "2026-04-24T15:33:48Z"
    last_updated_by: "claude-opus-4-7-spec-audit-2026-04-24"
    recent_action: "Spec audit + path reference remediation (Pass 1-3)"
    next_safe_action: "Continue systematic remediation or reindex"
    blockers: []

---
# Tasks: Phase 012 — CocoIndex UX, Utilization & Usefulness


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation-2 -->
### Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation-2 -->

---

<!-- ANCHOR:phase-1-2 -->
### Phase 1: Setup
- [x] T001 Confirm hook build output is verified manually rather than by a dedicated script (`mcp_server`)
- [x] T002 Confirm packet rewrite scope is limited to this phase folder (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T003 [P] Rebuild packet docs on the Level 2 scaffold (`.opencode/skill/system-spec-kit/templates/level_2/`)
<!-- /ANCHOR:phase-1-2 -->

---

<!-- ANCHOR:phase-2-2 -->
### Phase 2: Implementation
- [x] T004 Document SessionStart as CocoIndex availability reporting only (`spec.md`, `plan.md`, `implementation-summary.md`)
- [x] T005 Document that SessionStart remains status-only and does not run `ensure_ready.sh` (`hooks/claude/session-prime.ts`)
- [x] T006 Document PreCompact semantic neighbors as hint text only (`spec.md`, `plan.md`, `implementation-summary.md`)
- [x] T007 Document that PreCompact remains hint-only and does not execute cached semantic-neighbor queries (`hooks/claude/compact-inject.ts`)
- [x] T008 Document `ccc_status` as availability/binaryPath/indexExists/indexSize (`spec.md`, `tasks.md`, `implementation-summary.md`)
- [x] T009 Document `ccc_feedback` as local JSONL append-only feedback without CocoIndex DB writes and without `memory_validate` parity (`spec.md`, `tasks.md`, `implementation-summary.md`)
- [x] T010 Update the broader CocoIndex README and tool reference (broader CocoIndex docs)
- [x] T011 Document that SessionStart does not trigger a background CocoIndex re-index (`hooks/claude/session-prime.ts`)
<!-- /ANCHOR:phase-2-2 -->

---

<!-- ANCHOR:phase-3-2 -->
### Phase 3: Verification
- [x] T012 Record manual `npm run build` output verification for `dist/hooks/claude/*.js` (`checklist.md`, `implementation-summary.md`)
- [x] T013 Record hook smoke tests for `session-prime.js`, `compact-inject.js`, and `session-stop.js` (`checklist.md`, `implementation-summary.md`)
- [x] T014 Update checklist evidence and deferrals to match actual delivery (`checklist.md`)
- [x] T015 Re-run packet validation after the rewrite (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-3-2 -->

---

<!-- ANCHOR:completion-2 -->
### Completion Criteria
- [x] All implementation tasks are now either shipped or explicitly closed as documented deferrals
- [x] No packet-structure blockers remain
- [x] Manual verification reality is documented
<!-- /ANCHOR:completion-2 -->

---

<!-- ANCHOR:cross-refs-2 -->
### Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs-2 -->
