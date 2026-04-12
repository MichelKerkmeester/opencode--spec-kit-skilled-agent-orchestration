---
title: "018 / 012 — MCP config and feature-flag cleanup tasks"
description: "Task ledger for the five-config cleanup and packet repair."
trigger_phrases: ["018 012 tasks", "mcp config cleanup tasks", "feature flag cleanup tasks"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/012-mcp-config-and-feature-flag-cleanup"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed the phase task ledger"
    next_safe_action: "Review checklist evidence"
    key_files: ["tasks.md", "checklist.md", "implementation-summary.md"]
---
# Tasks: 018 / 012 — MCP config and feature-flag cleanup

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

- [x] T001 Re-read the five Public MCP configs and verify the phase scope is Public-only. (`.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json`)
- [x] T002 Re-read the runtime default files that justify the minimal checked-in env blocks. (`mcp_server/lib/search/cross-encoder.ts`, `mcp_server/lib/cognitive/rollout-policy.ts`, `mcp_server/lib/search/vector-index-store.ts`)
- [x] T003 Run strict validation on the phase folder before edits to capture packet gaps. (`validate.sh --strict .../012-mcp-config-and-feature-flag-cleanup`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Keep the five Public config env blocks aligned without adding redundant checked-in `SPECKIT_*` flags. (`.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json`)
- [x] T005 Confirm the runtime default code stays aligned with the config notes. (`cross-encoder.ts`, `rollout-policy.ts`, `vector-index-store.ts`)
- [x] T006 Rewrite `spec.md` to a valid Level 2 packet spec with the five-config scope. (`spec.md`)
- [x] T007 Rewrite `implementation-summary.md` to the active template and remove stale six-config claims. (`implementation-summary.md`)
- [x] T008 Add the missing `plan.md`, `tasks.md`, and `checklist.md`. (`plan.md`, `tasks.md`, `checklist.md`)
- [x] T009 Refresh `graph-metadata.json` for the phase root. (`graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `npm run --workspace=@spec-kit/mcp-server typecheck` from the `system-spec-kit` workspace root. (`.opencode/skill/system-spec-kit`)
- [x] T011 Run `npm run --workspace=@spec-kit/scripts typecheck` from the `system-spec-kit` workspace root. (`.opencode/skill/system-spec-kit`)
- [x] T012 Run targeted Vitest suites for tool schemas, graph metadata, reranker behavior, rollout policy, and docs parity. (`mcp_server/tests/*.vitest.ts`, `scripts/tests/*.vitest.ts`)
- [x] T013 Re-run strict packet validation after the packet repair. (`validate.sh --strict .../012-mcp-config-and-feature-flag-cleanup`)
- [x] T014 Re-sweep the five Public configs for DB overrides and redundant checked-in feature flags. (`rg -n ...`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
