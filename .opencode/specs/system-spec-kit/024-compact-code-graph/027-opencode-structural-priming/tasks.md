---
title: "Tasks: OpenCode Structural Priming [system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/tasks]"
description: "Task tracker for non-hook runtime structural bootstrap and recovery alignment."
trigger_phrases:
  - "027 structural priming tasks"
  - "opencode structural bootstrap tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/027-opencode-structural-priming"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: OpenCode Structural Priming

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm structural-bootstrap contract boundaries against `018`, `024`, and `026-session-start-injection-debug` (`spec.md`)
- [x] T002 Define the shared structural-bootstrap contract fields, token budget, and degraded-state rules for non-hook surfaces (`spec.md`, `plan.md`)
- [x] T003 [P] Document OpenCode-first wording requirements and shared recovery vocabulary, marking `context-server.ts` and runtime responses as the source of truth while `AGENTS.md` and `.opencode/agent/context-prime.md` mirror that contract (`AGENTS.md`, `.opencode/agent/context-prime.md`)
- [x] T004 Register `027-opencode-structural-priming` explicitly in the parent packet phase map (`../spec.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Enrich auto-prime payloads with the shared structural contract and next-step hints for non-hook runtimes (`mcp_server/hooks/memory-surface.ts`)
- [x] T006 Make `session_bootstrap` return the same structural contract by default (`mcp_server/handlers/session-bootstrap.ts`)
- [x] T007 Add lightweight structural recovery guidance to `session_resume` using the same contract vocabulary (`mcp_server/handlers/session-resume.ts`)
- [x] T008 Update `session_health` to recommend `session_bootstrap` when structural context is stale or missing (`mcp_server/handlers/session-health.ts`)
- [x] T009 Update first-turn/server guidance so OpenCode knows when structural context is already injected and when to recover (`mcp_server/context-server.ts`, `AGENTS.md`, `.opencode/agent/context-prime.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify OpenCode first-turn flow with ready graph data shows automatic structural context
- [x] T011 Verify OpenCode first-turn flow with stale graph data marks the contract degraded and recommends `session_bootstrap`
- [x] T012 Verify OpenCode first-turn flow with missing graph data omits highlights and uses explicit absence guidance
- [x] T013 Verify `session_bootstrap`, `session_resume`, and `session_health` use the same structural-contract vocabulary and next steps
- [x] T014 Verify OpenCode-first wording remains compatible with other non-hook runtimes
- [x] T015 Verify packet references distinguish `027-opencode-structural-priming` from `026-session-start-injection-debug`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] OpenCode-first structural bootstrap contract documented and verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
